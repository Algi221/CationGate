import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';
import crypto from 'crypto';
import { gatekeeperAuth } from '../middleware/auth';
import { rateLimiter } from '../middleware/rate-limiter';
import { EmailService } from '../services/EmailService';

const verifyRouter = new Hono();

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

verifyRouter.post('/submit-data', rateLimiter({ windowMs: 15 * 60 * 1000, max: 3 }), async (c) => {
  try {
    const body = await c.req.json();
    const {
      school_id,
      npsn,
      dapodik_code,
      official_email,
      instagram_url,
      linkedin_url,
      website_url,
      legal_sk_number,
      accreditation,
      admin_name,
      sk_document_url,
      sk_document_name
    } = body;

    if (!npsn && !official_email && !legal_sk_number) {
      return c.json({ success: false, message: 'NPSN dan Email Resmi wajib diisi.' }, 400);
    }

    const targetSchoolId = school_id || 'demo';
    const supabase = getSupabaseClient();

    const resolvedId = await resolveSchoolUUID(String(targetSchoolId), fontInMemSchools);

    const socialMedia = {
      instagram: instagram_url || null,
      linkedin: linkedin_url || null,
      website: website_url || null,
    };

    fontInMemSchools.forEach((s, slugKey) => {
      if (
        String(s.id) === String(targetSchoolId) ||
        slugKey === String(targetSchoolId) ||
        (resolvedId && String(s.id) === String(resolvedId))
      ) {
        s.npsn = npsn || s.npsn;
        s.dapodik_code = dapodik_code || s.dapodik_code;
        s.official_email = official_email || s.official_email;
        s.legal_sk_number = legal_sk_number || s.legal_sk_number;
        s.accreditation = accreditation || s.accreditation;
        s.admin_name = admin_name || s.admin_name;
        s.social_media = socialMedia;
        s.sk_document_url = sk_document_url || s.sk_document_url;
        s.sk_document_name = sk_document_name || s.sk_document_name;
        s.status = 'PENDING_VERIFICATION';
      }
    });

    try {
      let psUpdate = supabase
        .from('prospective_schools')
        .update({
          npsn: npsn || undefined,
          dapodik_code: dapodik_code || undefined,
          official_email: official_email || undefined,
          legal_sk_number: legal_sk_number || undefined,
          accreditation: accreditation || undefined,
          admin_name: admin_name || undefined,
          social_media: socialMedia,
          sk_document_name: sk_document_name || undefined,
          sk_document_url: sk_document_url || undefined,
          status: 'PENDING_VERIFICATION'
        });

      const isNumericId = !isNaN(Number(targetSchoolId)) && Number(targetSchoolId) > 0;
      if (isNumericId) {
        psUpdate = psUpdate.or(`id.eq.${targetSchoolId},slug.eq.${targetSchoolId}`);
      } else {
        psUpdate = psUpdate.eq('slug', targetSchoolId);
      }

      await psUpdate;
    } catch (err) {
      console.warn('Supabase prospective_schools update warning:', err);
    }

    if (resolvedId) {
      try {
        await supabase
          .from('schools')
          .update({
            npsn: npsn || undefined,
            dapodik_code: dapodik_code || undefined,
            official_email: official_email || undefined,
            legal_sk_number: legal_sk_number || undefined,
            accreditation: accreditation || undefined,
            admin_name: admin_name || undefined,
            social_media: socialMedia,
            status: 'PENDING_VERIFICATION'
          })
          .eq('id', resolvedId);
      } catch (dbErr: unknown) {
        console.warn('Supabase school update warning:', dbErr instanceof Error ? dbErr.message : String(dbErr));
      }
    }

    // Generate OTP and save to database if resolvedId exists
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    if (resolvedId) {
      try {
        await supabase
          .from('verification_otps')
          .update({ is_used: true })
          .eq('school_id', resolvedId)
          .eq('is_used', false);

        await supabase
          .from('verification_otps')
          .insert({
            school_id: resolvedId,
            email: official_email || `admin@${resolvedId}.sch.id`,
            otp_code: otpCode,
            expires_at: expiresAt.toISOString(),
            is_used: false
          });
      } catch (otpErr: unknown) {
        console.warn('OTP DB insert warning:', otpErr instanceof Error ? otpErr.message : String(otpErr));
      }
    }

    // Send OTP via email using professional template
    if (official_email) {
      try {
        await EmailService.sendRegistrationOtpEmail(official_email, otpCode);
      } catch (_emailErr) {
        console.warn('OTP generated but email failed to send. OTP code:', otpCode);
      }
    }

    return c.json({
      success: true,
      message: 'Data verifikasi tersimpan. Dokumen sedang ditinjau oleh Gatekeeper.'
    });
  } catch (err: unknown) {
    console.error('Submit verification exception:', err);
    return c.json({ success: false, message: 'Terjadi kesalahan server saat menyimpan data.' }, 500);
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
    const resolvedResendId = await resolveSchoolUUID(String(school_id), fontInMemSchools);
    if (!resolvedResendId) {
      return c.json({ success: false, message: 'Sekolah tidak ditemukan.' }, 404);
    }

    await supabase
      .from('verification_otps')
      .update({ is_used: true })
      .eq('school_id', resolvedResendId)
      .eq('is_used', false);

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: otpError } = await supabase
      .from('verification_otps')
      .insert({
        school_id: resolvedResendId,
        email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        is_used: false
      });

    if (otpError) {
      return c.json({ success: false, message: 'Gagal membuat kode OTP baru.' }, 500);
    }

    // Send email using professional template
    try {
      await EmailService.sendRegistrationOtpEmail(email, otpCode);
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

    // Resolve school_id to actual UUID
    const resolvedCheckId = await resolveSchoolUUID(String(school_id), fontInMemSchools);
    if (!resolvedCheckId) {
      return c.json({ success: false, message: 'Sekolah tidak ditemukan.' }, 404);
    }

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from('verification_otps')
      .select('*')
      .eq('school_id', resolvedCheckId)
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
      .eq('id', resolvedCheckId);

    return c.json({ success: true, message: 'Email berhasil diverifikasi! Menunggu persetujuan Superadmin CationGate.' });
  } catch (err) {
    console.error('Check OTP error:', err);
    return c.json({ success: false, message: 'Terjadi kesalahan server.' }, 500);
  }
});

// Admin CationGate: Approve or Reject school verification
verifyRouter.post('/admin-approve', gatekeeperAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { school_id, action } = body; // action: 'approve' or 'reject'

    if (!school_id || !action) {
      return c.json({ success: false, message: 'school_id dan action diperlukan.' }, 400);
    }

    const supabase = getSupabaseClient();

    // Resolve school_id to actual UUID
    const resolvedAdminId = await resolveSchoolUUID(String(school_id), fontInMemSchools);
    if (!resolvedAdminId) {
      return c.json({ success: false, message: 'Sekolah tidak ditemukan.' }, 404);
    }

    if (action === 'approve') {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'FULL_VERIFIED' })
        .eq('id', resolvedAdminId);

      if (error) throw error;
      return c.json({ success: true, message: 'Sekolah berhasil diverifikasi dan disetujui (FULL_VERIFIED)!' });
    } else if (action === 'reject' || action === 'suspend') {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'SUSPENDED' })
        .eq('id', resolvedAdminId);

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
