import { Hono } from 'hono';
import { Resend } from 'resend';
import { getSupabaseClient } from '../db/supabase';

const mailerRouter = new Hono();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

mailerRouter.post('/send-otp', async (c) => {
  try {
    const { email, type = 'registration' } = await c.req.json();
    if (!email) return c.json({ success: false, message: 'Email dibutuhkan' }, 400);

    const supabase = getSupabaseClient(c.req.header('Authorization'));

    if (type === 'forgot-password') {
      const { data: user } = await supabase.from('admin_users').select('id').eq('email', email).maybeSingle();
      if (!user) {
        return c.json({ success: false, message: 'Akun tidak terdaftar di sistem.' }, 404);
      }
    }

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    const { error: insertError } = await supabase.from('verification_otps').insert({
      email,
      otp_code: otp,
      expires_at: expiresAt
    });

    if (insertError) throw insertError;

    if (process.env.RESEND_API_KEY) {
      const { error } = await resend.emails.send({
        from: 'CationGate <noreply@cationgate.site>',
        to: email,
        subject: 'Kode Verifikasi OTP Anda',
        html: `
          <div style="font-family: sans-serif; padding: 20px; text-align: center;">
            <h2>Verifikasi Email Anda</h2>
            <p>Gunakan kode OTP berikut untuk melanjutkan proses:</p>
            <h1 style="background: #f4f4f4; padding: 15px; border-radius: 10px; display: inline-block; letter-spacing: 5px;">${otp}</h1>
            <p>Kode ini berlaku selama 15 menit. JANGAN berikan kode ini kepada siapapun.</p>
          </div>
        `
      });

      if (error) {
        throw new Error(error.message);
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        console.error('FATAL: RESEND_API_KEY is not configured for production. Email will not be sent.');
        return c.json({ success: false, message: 'Gagal mengirim email: Konfigurasi server email tidak lengkap.' }, 500);
      }

      console.warn('⚠️ RESEND_API_KEY not configured, skipping email send. OTP generated:', otp);
      // For local development when Resend is not set up
      return c.json({ success: true, message: 'OTP berhasil digenerate (Mode Dev)', dev_otp: otp });
    }

    return c.json({ success: true, message: 'Kode OTP telah dikirim ke email Anda.' });
  } catch (err: unknown) {
    console.error('Send OTP Error:', err);
    return c.json({ success: false, message: 'Gagal mengirim OTP.' }, 500);
  }
});

mailerRouter.post('/verify-otp', async (c) => {
  try {
    const { email, otp } = await c.req.json();
    if (!email || !otp) return c.json({ success: false, message: 'Email dan OTP dibutuhkan' }, 400);

    const supabase = getSupabaseClient(c.req.header('Authorization'));

    // Check OTP
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
      return c.json({ success: false, message: 'Kode OTP tidak valid atau sudah kadaluarsa.' }, 400);
    }

    // Mark as used
    await supabase.from('verification_otps').update({ is_used: true }).eq('id', records[0].id);

    return c.json({ success: true, message: 'Verifikasi berhasil.' });
  } catch (err: unknown) {
    console.error('Verify OTP Error:', err);
    return c.json({ success: false, message: 'Gagal verifikasi OTP.' }, 500);
  }
});

export default mailerRouter;
