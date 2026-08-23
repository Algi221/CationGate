import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '../db/supabase';
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
    const supabase = getSupabaseClient();

    // 1. Verify OTP
    const { data: records, error: otpError } = await supabase
      .from('verification_otps')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (otpError) throw otpError;

    if (!records || records.length === 0) {
      return c.json({
        success: false,
        message: 'Kode OTP tidak valid atau sudah kedaluwarsa.'
      }, 400);
    }

    // 2. Find target admin user by email or username
    const { data: initialUser, error: userError } = await supabase
      .from('admin_users')
      .select('id')
      .or(`email.eq.${email},username.eq.${email}`)
      .maybeSingle();

    if (userError) throw userError;

    let user = initialUser;

    // If not found in admin_users, check if email belongs to a school
    if (!user) {
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('official_email', email)
        .maybeSingle();

      if (school) {
        const { data: schoolAdmin } = await supabase
          .from('admin_users')
          .select('id')
          .eq('school_id', school.id)
          .maybeSingle();

        if (schoolAdmin) {
          user = schoolAdmin;
        }
      }
    }

    if (!user) {
      return c.json({
        success: false,
        message: 'Akun Admin Sekolah dengan email tersebut tidak ditemukan.'
      }, 404);
    }

    // 3. Hash and update new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // 4. Mark OTP as used
    await supabase.from('verification_otps').update({ is_used: true }).eq('id', records[0].id);

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
