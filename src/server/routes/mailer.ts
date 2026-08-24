import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { EmailService } from '../services/EmailService';
import { authLimiter } from '../middleware/rate-limiter';
import { z } from 'zod';

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
    const supabase = getSupabaseClient(c.req.header('Authorization'));

    // If forgot-password, strictly verify that this email exists in our system
    if (type === 'forgot-password') {
      const { data: userByEmail } = await supabase
        .from('admin_users')
        .select('id, email, username')
        .or(`email.eq.${email},username.eq.${email}`)
        .maybeSingle();

      let isRegistered = !!userByEmail;

      if (!isRegistered) {
        // Also check schools official_email
        const { data: schoolByEmail } = await supabase
          .from('schools')
          .select('id')
          .eq('official_email', email)
          .maybeSingle();

        if (schoolByEmail) {
          isRegistered = true;
        }
      }

      if (!isRegistered) {
        const { data: prospectiveSchool } = await supabase
          .from('prospective_schools')
          .select('id')
          .eq('official_email', email)
          .maybeSingle();

        if (prospectiveSchool) {
          isRegistered = true;
        }
      }

      if (!isRegistered) {
        return c.json({
          success: false,
          message: 'Email tidak terdaftar sebagai admin sekolah di sistem CationGate.'
        }, 404);
      }
    }

    // Invalidate old unused OTPs for this email
    await supabase
      .from('verification_otps')
      .update({ is_used: true })
      .eq('email', email)
      .eq('is_used', false);

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    const { error: insertError } = await supabase.from('verification_otps').insert({
      email,
      otp_code: otp,
      expires_at: expiresAt,
      is_used: false
    });

    if (insertError) {
      console.error('Insert OTP DB error:', insertError);
      throw insertError;
    }

    // Send email using professional email template
    if (type === 'forgot-password') {
      await EmailService.sendForgotPasswordOtpEmail(email, otp);
    } else {
      await EmailService.sendRegistrationOtpEmail(email, otp);
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
    const supabase = getSupabaseClient(c.req.header('Authorization'));

    // Check OTP in database
    const { data: records, error } = await supabase
      .from('verification_otps')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (!records || records.length === 0) {
      return c.json({
        success: false,
        message: 'Kode OTP tidak valid atau sudah kedaluwarsa.'
      }, 400);
    }

    // Mark OTP as used
    await supabase.from('verification_otps').update({ is_used: true }).eq('id', records[0].id);

    return c.json({
      success: true,
      message: 'Verifikasi kode OTP berhasil.'
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
