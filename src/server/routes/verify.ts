import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import crypto from 'crypto';

const verifyRouter = new Hono();

// Generate a 6-digit OTP
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Submit verification data (NPSN, Dapodik, Social Media) and send OTP
verifyRouter.post('/submit-data', async (c) => {
  try {
    const body = await c.req.json();
    const { school_id, npsn, dapodik_code, official_email, instagram_url, linkedin_url, website_url } = body;

    if (!school_id || !npsn || !dapodik_code || !official_email) {
      return c.json({ success: false, message: 'NPSN, Kode Dapodik, dan Email Resmi wajib diisi.' }, 400);
    }

    const supabase = getSupabaseClient();

    // Update school with verification data
    const socialMedia = {
      instagram: instagram_url || null,
      linkedin: linkedin_url || null,
      website: website_url || null,
    };

    const { error: updateError } = await supabase
      .from('schools')
      .update({
        npsn,
        dapodik_code,
        official_email,
        social_media: socialMedia
      })
      .eq('id', school_id);

    if (updateError) {
      console.error('Update school error:', updateError);
      return c.json({ success: false, message: 'Gagal menyimpan data verifikasi.' }, 500);
    }

    // Generate OTP and save to database
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Invalidate old OTPs for this school
    await supabase
      .from('verification_otps')
      .update({ is_used: true })
      .eq('school_id', school_id)
      .eq('is_used', false);

    // Insert new OTP
    const { error: otpError } = await supabase
      .from('verification_otps')
      .insert({
        school_id,
        email: official_email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        is_used: false
      });

    if (otpError) {
      console.error('OTP insert error:', otpError);
      return c.json({ success: false, message: 'Gagal membuat kode OTP.' }, 500);
    }

    // Send OTP via email using Nodemailer
    try {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"CationGate" <noreply@cationgate.com>',
        to: official_email,
        subject: 'Kode Verifikasi CationGate',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #09090b; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">CG</div>
            </div>
            <h2 style="font-size: 20px; font-weight: 600; color: #09090b; margin-bottom: 8px; text-align: center;">Kode Verifikasi Anda</h2>
            <p style="font-size: 14px; color: #71717a; text-align: center; margin-bottom: 24px;">Gunakan kode berikut untuk memverifikasi email resmi sekolah Anda di CationGate.</p>
            <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #09090b; font-family: monospace; margin: 0;">${otpCode}</p>
            </div>
            <p style="font-size: 12px; color: #a1a1aa; text-align: center;">Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      // Don't fail the request, OTP is saved in DB.
      // Admin can manually check or user can retry.
      console.warn('OTP generated but email failed to send. OTP code:', otpCode);
    }

    return c.json({ success: true, message: 'Data verifikasi tersimpan. Kode OTP telah dikirim ke email resmi sekolah.' });
  } catch (err) {
    console.error('Submit verification error:', err);
    return c.json({ success: false, message: 'Terjadi kesalahan server.' }, 500);
  }
});

// Resend OTP
verifyRouter.post('/send-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { school_id, email } = body;

    if (!school_id || !email) {
      return c.json({ success: false, message: 'school_id dan email diperlukan.' }, 400);
    }

    const supabase = getSupabaseClient();

    // Invalidate old OTPs
    await supabase
      .from('verification_otps')
      .update({ is_used: true })
      .eq('school_id', school_id)
      .eq('is_used', false);

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: otpError } = await supabase
      .from('verification_otps')
      .insert({
        school_id,
        email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        is_used: false
      });

    if (otpError) {
      return c.json({ success: false, message: 'Gagal membuat kode OTP baru.' }, 500);
    }

    // Send email
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"CationGate" <noreply@cationgate.com>',
        to: email,
        subject: 'Kode Verifikasi CationGate (Kirim Ulang)',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #09090b; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">CG</div>
            </div>
            <h2 style="font-size: 20px; font-weight: 600; color: #09090b; margin-bottom: 8px; text-align: center;">Kode Verifikasi Baru</h2>
            <p style="font-size: 14px; color: #71717a; text-align: center; margin-bottom: 24px;">Berikut kode OTP baru untuk verifikasi email Anda.</p>
            <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #09090b; font-family: monospace; margin: 0;">${otpCode}</p>
            </div>
            <p style="font-size: 12px; color: #a1a1aa; text-align: center;">Kode ini berlaku selama 10 menit.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Resend OTP email error:', emailErr);
      console.warn('OTP generated but email failed. OTP code:', otpCode);
    }

    return c.json({ success: true, message: 'Kode OTP baru telah dikirim.' });
  } catch (err) {
    console.error('Send OTP error:', err);
    return c.json({ success: false, message: 'Terjadi kesalahan server.' }, 500);
  }
});

// Check OTP code
verifyRouter.post('/check-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { school_id, otp_code } = body;

    if (!school_id || !otp_code) {
      return c.json({ success: false, message: 'school_id dan otp_code diperlukan.' }, 400);
    }

    const supabase = getSupabaseClient();

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from('verification_otps')
      .select('*')
      .eq('school_id', school_id)
      .eq('otp_code', otp_code)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError || !otpRecord) {
      return c.json({ success: false, message: 'Kode OTP tidak valid atau sudah kedaluwarsa.' }, 400);
    }

    // Mark OTP as used
    await supabase
      .from('verification_otps')
      .update({ is_used: true })
      .eq('id', otpRecord.id);

    // Update school status to 'OTP_VERIFIED' (OTP verified, waiting for CationGate Superadmin manual approval)
    await supabase
      .from('schools')
      .update({ status: 'OTP_VERIFIED' })
      .eq('id', school_id);

    return c.json({ success: true, message: 'Email berhasil diverifikasi! Menunggu persetujuan Superadmin CationGate.' });
  } catch (err) {
    console.error('Check OTP error:', err);
    return c.json({ success: false, message: 'Terjadi kesalahan server.' }, 500);
  }
});

// Admin CationGate: Approve or Reject school verification
verifyRouter.post('/admin-approve', async (c) => {
  try {
    const body = await c.req.json();
    const { school_id, action } = body; // action: 'approve' or 'reject'

    if (!school_id || !action) {
      return c.json({ success: false, message: 'school_id dan action diperlukan.' }, 400);
    }

    const supabase = getSupabaseClient();

    if (action === 'approve') {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'FULL_VERIFIED' })
        .eq('id', school_id);

      if (error) throw error;
      return c.json({ success: true, message: 'Sekolah berhasil diverifikasi dan disetujui (FULL_VERIFIED)!' });
    } else if (action === 'reject' || action === 'suspend') {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'SUSPENDED' })
        .eq('id', school_id);

      if (error) throw error;
      return c.json({ success: true, message: 'Status sekolah diubah menjadi SUSPENDED.' });
    }

    return c.json({ success: false, message: 'Action tidak valid. Gunakan "approve" atau "reject".' }, 400);
  } catch (err) {
    console.error('Admin approve error:', err);
    return c.json({ success: false, message: 'Terjadi kesalahan server.' }, 500);
  }
});

export default verifyRouter;
