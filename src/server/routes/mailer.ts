import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { EmailService } from '../services/EmailService';
import { authLimiter } from '../middleware/rate-limiter';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const mailerRouter = new Hono();

const sendOtpSchema = z.object({
  email: z.string().email('Format alamat email tidak valid.'),
  type: z.enum(['registration', 'forgot-password']).default('registration')
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

mailerRouter.post('/send-otp', authLimiter, async (c) => {
  try {
    const rawBody = await c.req.json();
    const parseResult = sendOtpSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return c.json({
        success: false,
        message: parseResult.error.issues[0].message
      }, 400);
    }

    const { email, type } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();
    const supabase = getSupabaseClient(c.req.header('Authorization'));

    // If forgot-password, strictly verify that this email exists in our system
    if (type === 'forgot-password') {
      let isRegistered = false;

      const { data: userByEmail } = await supabase
        .from('admin_users')
        .select('id, email, username')
        .or(`email.ilike.${cleanEmail},username.ilike.${cleanEmail}`)
        .maybeSingle();

      if (userByEmail) {
        isRegistered = true;
      }

      if (!isRegistered) {
        // Also check schools official_email
        const { data: schoolByEmail } = await supabase
          .from('schools')
          .select('id')
          .ilike('official_email', cleanEmail)
          .maybeSingle();

        if (schoolByEmail) {
          isRegistered = true;
        }
      }

      if (!isRegistered) {
        const { data: prospectiveSchool } = await supabase
          .from('prospective_schools')
          .select('id')
          .ilike('official_email', cleanEmail)
          .maybeSingle();

        if (prospectiveSchool) {
          isRegistered = true;
        }
      }

      // Check direct PostgreSQL pool fallback
      if (!isRegistered) {
        try {
          const pgRes = await pool.query(
            `SELECT id FROM admin_users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)
             UNION
             SELECT id FROM schools WHERE LOWER(official_email) = LOWER($1)
             UNION
             SELECT id FROM prospective_schools WHERE LOWER(official_email) = LOWER($1)
             LIMIT 1`,
            [cleanEmail]
          );
          if (pgRes.rows && pgRes.rows.length > 0) {
            isRegistered = true;
          }
        } catch (_pgErr) {}
      }

      if (!isRegistered) {
        return c.json({
          success: false,
          message: 'Email tidak terdaftar sebagai admin sekolah di sistem CationGate.'
        }, 404);
      }
    }

    // Invalidate old unused OTPs for this email
    try {
      await supabase
        .from('verification_otps')
        .update({ is_used: true })
        .ilike('email', cleanEmail)
        .eq('is_used', false);
    } catch (_sbInv) {}

    try {
      await pool.query(`UPDATE verification_otps SET is_used = true WHERE LOWER(email) = LOWER($1) AND is_used = false`, [cleanEmail]);
    } catch (_pgInv) {}

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    let inserted = false;
    try {
      const { error: insertError } = await supabase.from('verification_otps').insert({
        email: cleanEmail,
        otp_code: otp,
        expires_at: expiresAt,
        is_used: false
      });
      if (!insertError) inserted = true;
    } catch (_sbIns) {}

    if (!inserted) {
      try {
        await pool.query(
          `INSERT INTO verification_otps (email, otp_code, expires_at, is_used)
           VALUES ($1, $2, $3, false)`,
          [cleanEmail, otp, expiresAt]
        );
      } catch (pgErr) {
        console.error('Insert OTP DB error:', pgErr);
        throw pgErr;
      }
    }

    // Send email using professional email template
    if (type === 'forgot-password') {
      await EmailService.sendForgotPasswordOtpEmail(cleanEmail, otp);
    } else {
      await EmailService.sendRegistrationOtpEmail(cleanEmail, otp);
    }

    return c.json({
      success: true,
      message: 'Kode OTP telah berhasil dikirim ke alamat email Anda.'
    });
  } catch (err: unknown) {
    console.error('Send OTP Error:', err);
    return c.json({
      success: false,
      message: err instanceof Error ? err.message : 'Gagal mengirim kode OTP ke email. Silakan coba lagi.'
    }, 500);
  }
});

const verifyOtpSchema = z.object({
  email: z.string().email('Format email tidak valid.'),
  otp: z.string().length(6, 'Kode OTP harus berjumlah 6 digit.')
});

mailerRouter.post('/verify-otp', async (c) => {
  try {
    const rawBody = await c.req.json();
    const parseResult = verifyOtpSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return c.json({
        success: false,
        message: parseResult.error.issues[0].message
      }, 400);
    }

    const { email, otp } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();
    const supabase = getSupabaseClient(c.req.header('Authorization'));

    // Check OTP in database
    let otpRecord: { id: number | string; email: string } | null = null;

    try {
      const { data: records } = await supabase
        .from('verification_otps')
        .select('*')
        .ilike('email', cleanEmail)
        .eq('otp_code', cleanOtp)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (records && records.length > 0) {
        otpRecord = records[0];
      }
    } catch (_sbOtp) {}

    if (!otpRecord) {
      try {
        const pgRes = await pool.query(
          `SELECT id, email FROM verification_otps
           WHERE LOWER(email) = LOWER($1) AND otp_code = $2 AND expires_at > NOW()
           ORDER BY created_at DESC LIMIT 1`,
          [cleanEmail, cleanOtp]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          otpRecord = pgRes.rows[0];
        }
      } catch (_pgOtp) {}
    }

    if (!otpRecord) {
      return c.json({
        success: false,
        message: 'Kode OTP tidak valid atau sudah kedaluwarsa.'
      }, 400);
    }

    // Query admin user by email if exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let adminUser: any = null;

    try {
      const { data: user } = await supabase
        .from('admin_users')
        .select('id, username, nama_lengkap, email, role, school_id')
        .or(`email.ilike.${cleanEmail},username.ilike.${cleanEmail}`)
        .maybeSingle();
      if (user) adminUser = user;
    } catch (_sbU) {}

    if (!adminUser) {
      try {
        const pgAdmin = await pool.query(
          `SELECT id, username, nama_lengkap, email, role, school_id
           FROM admin_users
           WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)
           LIMIT 1`,
          [cleanEmail]
        );
        if (pgAdmin.rows && pgAdmin.rows.length > 0) {
          adminUser = pgAdmin.rows[0];
        }
      } catch (_pgU) {}
    }

    let schoolSlug = '';
    const { isValidUUID } = await import("../db/resolve-school");

    if (adminUser?.school_id) {
      try {
        if (isValidUUID(String(adminUser.school_id))) {
          const { data: school } = await supabase
            .from('schools')
            .select('slug')
            .eq('id', adminUser.school_id)
            .maybeSingle();
          if (school?.slug) schoolSlug = school.slug;
        } else {
          const { data: school } = await supabase
            .from('schools')
            .select('slug')
            .eq('slug', String(adminUser.school_id))
            .maybeSingle();
          if (school?.slug) schoolSlug = school.slug;
        }
      } catch (_sErr) {}

      if (!schoolSlug) {
        try {
          const pgS = await pool.query(
            `SELECT slug FROM schools WHERE id::text = $1 OR slug = $1 LIMIT 1`,
            [String(adminUser.school_id)]
          );
          if (pgS.rows.length > 0) schoolSlug = pgS.rows[0].slug;
        } catch (_pgS) {}
      }
    }

    if (!schoolSlug) {
      try {
        const { data: school } = await supabase
          .from('schools')
          .select('slug')
          .or(`email.ilike.${cleanEmail},official_email.ilike.${cleanEmail}`)
          .maybeSingle();
        if (school?.slug) schoolSlug = school.slug;
      } catch (_sErr2) {}

      if (!schoolSlug) {
        try {
          const pgS = await pool.query(
            `SELECT slug FROM schools WHERE LOWER(email) = LOWER($1) OR LOWER(official_email) = LOWER($1) LIMIT 1`,
            [cleanEmail]
          );
          if (pgS.rows.length > 0) schoolSlug = pgS.rows[0].slug;
        } catch (_pgS2) {}
      }
    }

    const adminPayload = {
      id: adminUser?.id || 1,
      username: adminUser?.username || cleanEmail.split('@')[0],
      nama: adminUser?.nama_lengkap || adminUser?.username || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: adminUser?.role || 'admin',
      school_id: adminUser?.school_id || schoolSlug || null,
      school_slug: schoolSlug || null
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is required.');
    }
    const token = jwt.sign(adminPayload, jwtSecret, { expiresIn: '7d' });

    return c.json({
      success: true,
      message: 'Kode OTP berhasil diverifikasi.',
      token,
      admin: adminPayload,
      schoolSlug: schoolSlug || null
    });
  } catch (err: unknown) {
    console.error('Verify OTP Error:', err);
    return c.json({
      success: false,
      message: 'Gagal memverifikasi kode OTP.'
    }, 500);
  }
});

export default mailerRouter;
