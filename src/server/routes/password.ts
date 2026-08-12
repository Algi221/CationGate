import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '../db/supabase';

const passwordRouter = new Hono();

passwordRouter.post('/reset', async (c) => {
  try {
    const { email, otp, newPassword } = await c.req.json();

    if (!email || !otp || !newPassword) {
      return c.json({ success: false, message: 'Semua kolom wajib diisi.' }, 400);
    }

    if (newPassword.length < 6) {
      return c.json({ success: false, message: 'Password minimal 6 karakter.' }, 400);
    }

    const supabase = getSupabaseClient();

    // Verify OTP first
    const { data: records, error: otpError } = await supabase
      .from('verification_otps')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (otpError) throw otpError;

    if (!records || records.length === 0) {
      return c.json({ success: false, message: 'Kode OTP tidak valid atau sudah kadaluarsa.' }, 400);
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) throw userError;

    if (!user) {
      return c.json({ success: false, message: 'Akun tidak ditemukan.' }, 404);
    }

    // Update password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: hashedPassword })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Mark OTP as used
    await supabase.from('verification_otps').update({ is_used: true }).eq('id', records[0].id);

    return c.json({ success: true, message: 'Password berhasil diubah. Silakan login dengan password baru.' });
  } catch (err: any) {
    console.error('Reset Password Error:', err);
    return c.json({ success: false, message: 'Terjadi kesalahan sistem.' }, 500);
  }
});

export default passwordRouter;
