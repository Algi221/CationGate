import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { authLimiter } from '../middleware/rate-limiter';
import { z } from 'zod';

const passwordRouter = new Hono();

const resetPasswordSchema = z.object({
  email: z.string().email('Format email tidak valid.'),
  otp: z.string().length(6, 'Kode OTP harus berjumlah 6 digit.'),
  newPassword: z.string().min(6, 'Kata sandi baru minimal 6 karakter.')
});

passwordRouter.post('/reset', authLimiter, async (c) => {
  try {
    const rawBody = await c.req.json();
    const parseResult = resetPasswordSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return c.json({
        success: false,
        message: parseResult.error.issues[0].message
      }, 400);
    }

    const { email, otp, newPassword } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.trim();
    const supabase = getSupabaseClient();

    // 1. Verify OTP in Supabase or Postgres pool
    let otpValid = false;
    let otpRecordId: number | string | null = null;

    try {
      const { data: records } = await supabase
        .from('verification_otps')
        .select('*')
        .ilike('email', cleanEmail)
        .eq('otp_code', cleanOtp)
        .gt('expires_at', new Date(Date.now() - 30 * 60000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (records && records.length > 0) {
        otpValid = true;
        otpRecordId = records[0].id;
      }
    } catch (_sbOtpErr) {}

    if (!otpValid) {
      try {
        const pgOtp = await pool.query(
          `SELECT id FROM verification_otps
           WHERE LOWER(email) = LOWER($1) AND otp_code = $2
             AND expires_at > NOW() - INTERVAL '30 minutes'
           ORDER BY created_at DESC LIMIT 1`,
          [cleanEmail, cleanOtp]
        );
        if (pgOtp.rows && pgOtp.rows.length > 0) {
          otpValid = true;
          otpRecordId = pgOtp.rows[0].id;
        }
      } catch (_pgOtpErr) {}
    }

    if (!otpValid) {
      return c.json({
        success: false,
        message: 'Kode OTP tidak valid atau sudah kedaluwarsa.'
      }, 400);
    }

    // 2. Find target admin user by email or username
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user: any = null;

    try {
      const { data: initialUser } = await supabase
        .from('admin_users')
        .select('id, username, email, school_id')
        .or(`email.ilike.${cleanEmail},username.ilike.${cleanEmail}`)
        .maybeSingle();

      if (initialUser) user = initialUser;
    } catch (_uErr) {}

    if (!user) {
      try {
        const pgRes = await pool.query(
          `SELECT id, username, email, school_id
           FROM admin_users
           WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)
           LIMIT 1`,
          [cleanEmail]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          user = pgRes.rows[0];
        }
      } catch (_pgErr) {}
    }

    // Check schools table
    if (!user) {
      try {
        const { data: school } = await supabase
          .from('schools')
          .select('id, slug')
          .ilike('official_email', cleanEmail)
          .maybeSingle();

        if (school) {
          const { data: schoolAdmin } = await supabase
            .from('admin_users')
            .select('id, username, email, school_id')
            .or(`school_id.eq.${school.id},school_id.eq.${school.slug}`)
            .maybeSingle();

          if (schoolAdmin) user = schoolAdmin;
        }
      } catch (_sErr) {}
    }

    // Check prospective_schools table
    if (!user) {
      try {
        const { data: ps } = await supabase
          .from('prospective_schools')
          .select('id, slug, admin_name')
          .ilike('official_email', cleanEmail)
          .maybeSingle();

        if (ps) {
          const { data: psAdmin } = await supabase
            .from('admin_users')
            .select('id, username, email, school_id')
            .or(`school_id.eq.${ps.id},school_id.eq.${ps.slug}`)
            .maybeSingle();

          if (psAdmin) user = psAdmin;
        }
      } catch (_psErr) {}
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // 3. Update or Auto-provision Admin User with new password
    if (user) {
      try {
        await supabase
          .from('admin_users')
          .update({
            password_hash: hashedPassword,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } catch (_upSbErr) {}

      try {
        await pool.query(
          `UPDATE admin_users SET password_hash = $1 WHERE id = $2`,
          [hashedPassword, user.id]
        );
      } catch (_upPgErr) {}
    } else {
      // Auto-provision if user verified OTP
      const defaultUsername = cleanEmail.split('@')[0] || cleanEmail;
      try {
        await supabase.from('admin_users').insert({
          username: defaultUsername,
          email: cleanEmail,
          password_hash: hashedPassword,
          nama_lengkap: defaultUsername,
          role: 'admin'
        });
      } catch (_insSbErr) {
        try {
          await pool.query(
            `INSERT INTO admin_users (username, email, password_hash, nama_lengkap, role)
             VALUES ($1, $2, $3, $4, 'admin')
             ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, email = EXCLUDED.email`,
            [defaultUsername, cleanEmail, hashedPassword, defaultUsername]
          );
        } catch (_insPgErr) {}
      }
    }

    // 4. Mark OTP as used
    if (otpRecordId) {
      try {
        await supabase.from('verification_otps').update({ is_used: true }).eq('id', otpRecordId);
      } catch (_uSb) {}
      try {
        await pool.query(`UPDATE verification_otps SET is_used = true WHERE id = $1`, [otpRecordId]);
      } catch (_uPg) {}
    }

    return c.json({
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan login menggunakan kata sandi baru Anda.'
    });
  } catch (err: unknown) {
    console.error('Reset Password Error:', err);
    return c.json({
      success: false,
      message: 'Terjadi kesalahan sistem saat memperbarui kata sandi.'
    }, 500);
  }
});

export default passwordRouter;
