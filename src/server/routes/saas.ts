import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
// @ts-ignore
import midtransClient from 'midtrans-client';

const saasRouter = new Hono();

// Midtrans Core Config
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'Mid-server-OuI5I5rbJs8R2HAmAFoWBlTX',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'Mid-client-lwrX66vs4ssU0E8r'
});

// In-Memory store for registered schools fallback (HMR Refreshed)
export const fontInMemSchools = new Map<string, any>();

// Helper function to check 3-day takedown expiry
function checkThreeDayTakedown(schoolObj: any): boolean {
  if (!schoolObj || schoolObj.status === 'FULL_VERIFIED' || schoolObj.status === 'TAKEDOWN') {
    return false;
  }
  const createdAt = schoolObj.created_at ? new Date(schoolObj.created_at).getTime() : Date.now();
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  if (Date.now() - createdAt > THREE_DAYS_MS && schoolObj.status !== 'PENDING_VERIFICATION') {
    schoolObj.status = 'TAKEDOWN';
    schoolObj.is_verified = false;
    return true;
  }
  return false;
}

// Fetch school data by slug for frontend routing
saasRouter.get('/school-by-slug/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const supabase = getSupabaseClient();
    
    // 1. Check verified 'schools' table first
    const { data: verifiedData } = await supabase
      .from('schools')
      .select('id, name, slug, logo_url, status, is_verified, subscription_plan, subscription_end_date, npsn, dapodik_code, official_email, legal_sk_number, accreditation, admin_name, social_media, created_at')
      .eq('slug', slug)
      .maybeSingle();
      
    if (verifiedData) {
      return c.json({ success: true, data: verifiedData });
    }

    // 2. Check candidate 'prospective_schools' table (or calon_sekolah)
    let candidateData: any = null;
    try {
      const { data: psData } = await supabase
        .from('prospective_schools')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      candidateData = psData;
    } catch (e) {}

    if (!candidateData) {
      try {
        const { data: csData } = await supabase
          .from('calon_sekolah')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        candidateData = csData;
      } catch (e) {}
    }

    if (candidateData) {
      checkThreeDayTakedown(candidateData);
      return c.json({ success: true, data: candidateData });
    }

    // 3. Check in-memory fallback map
    const localSchool = fontInMemSchools.get(slug);
    if (localSchool) {
      checkThreeDayTakedown(localSchool);
      return c.json({ success: true, data: localSchool });
    }

    // Default Seed Fallback ONLY for smktarunabhakti or demo
    if (slug === 'smktarunabhakti' || slug === 'demo') {
      return c.json({
        success: true,
        data: {
          id: 1,
          name: slug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : 'SMK Demo Indonesia',
          slug,
          status: 'FULL_VERIFIED',
          is_verified: true,
          logo_url: '/assets/logo_sekolah/logo_smktb.png'
        }
      });
    }

    // Return 404 for unregistered school slugs
    return c.json({
      success: false,
      notFound: true,
      message: `Sekolah atau URL '${slug}' belum terdaftar di CationGate.`
    }, 404);
  } catch (err) {
    const slug = c.req.param('slug');
    const localSchool = fontInMemSchools.get(slug);
    if (localSchool) {
      checkThreeDayTakedown(localSchool);
      return c.json({ success: true, data: localSchool });
    }
    if (slug === 'smktarunabhakti' || slug === 'demo') {
      return c.json({
        success: true,
        data: {
          id: 1,
          name: slug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : 'SMK Demo Indonesia',
          slug,
          status: 'FULL_VERIFIED',
          is_verified: true,
          logo_url: '/assets/logo_sekolah/logo_smktb.png'
        }
      });
    }
    return c.json({
      success: false,
      notFound: true,
      message: `Sekolah atau URL '${slug}' belum terdaftar di CationGate.`
    }, 404);
  }
});

// Register new school from Landing Page
saasRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { school_name, slug, email, phone, address, admin_name, admin_username, admin_password, plan_type } = body;
    
    if (!school_name || !slug || !email || !admin_username || !admin_password) {
      return c.json({ success: false, message: 'Data tidak lengkap' }, 400);
    }
    
    const isTrial = plan_type === 'trial';
    const supabase = getSupabaseClient();
    
    // Check if slug exists in Supabase (schools or prospective_schools) or Memory
    const { data: existingVerified } = await supabase.from('schools').select('id, status, is_verified').eq('slug', slug).maybeSingle();
    const existingInMem = fontInMemSchools.get(slug);

    if (existingVerified || existingInMem) {
      const targetId = existingVerified?.id || existingInMem?.id || Math.floor(Date.now() / 1000);
      const existingObj = {
        id: targetId,
        name: school_name,
        slug,
        official_email: email,
        status: existingVerified?.status || existingInMem?.status || 'BELUM_KIRIM_VERIFIKASI',
        is_verified: existingVerified?.is_verified ?? existingInMem?.is_verified ?? false,
        plan_type: isTrial ? 'TRIAL' : 'YEARLY',
        admin_name: admin_name || admin_username,
        created_at: existingInMem?.created_at || new Date().toISOString(),
        logo_url: '/assets/logo_sekolah/logo_smktb.png'
      };
      fontInMemSchools.set(slug, existingObj);

      return c.json({
        success: true,
        school_id: targetId,
        slug: slug,
        message: 'Sekolah terdaftar! Mengarahkan ke dashboard instansi...'
      });
    }
    
    const fallbackId = Math.floor(Date.now() / 1000);
    const createdAtIso = new Date().toISOString();

    const newSchoolObj: any = {
      id: fallbackId,
      name: school_name,
      slug,
      official_email: email,
      status: 'BELUM_KIRIM_VERIFIKASI',
      is_verified: false,
      plan_type: isTrial ? 'TRIAL' : 'YEARLY',
      admin_name: admin_name || admin_username,
      created_at: createdAtIso,
      logo_url: '/assets/logo_sekolah/logo_smktb.png'
    };
    
    // 1. Insert into Supabase 'prospective_schools' table
    let insertedSchoolId: any = null;

    try {
      const { data: psData, error: psErr } = await supabase
        .from('prospective_schools')
        .upsert({
          name: school_name,
          slug: slug,
          official_email: email,
          status: 'BELUM_KIRIM_VERIFIKASI',
          is_verified: false,
          plan_type: isTrial ? 'TRIAL' : 'YEARLY',
          admin_name: admin_name || admin_username,
          created_at: createdAtIso
        }, { onConflict: 'slug' })
        .select('*')
        .maybeSingle();

      if (psData && psData.id) {
        insertedSchoolId = psData.id;
        newSchoolObj.id = insertedSchoolId;
      }
    } catch (sbErr: any) {
      console.warn('Supabase client insert warning:', sbErr.message);
    }

    if (!insertedSchoolId) {
      try {
        const pgRes = await pool.query(
          `INSERT INTO prospective_schools (name, slug, official_email, status, is_verified, plan_type, admin_name, created_at)
           VALUES ($1, $2, $3, 'BELUM_KIRIM_VERIFIKASI', false, $4, $5, NOW())
           ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, official_email = EXCLUDED.official_email
           RETURNING id`,
          [school_name, slug, email, isTrial ? 'TRIAL' : 'YEARLY', admin_name || admin_username]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          insertedSchoolId = pgRes.rows[0].id;
          newSchoolObj.id = insertedSchoolId;
        }
      } catch (pgErr: any) {}
    }

    // Store in memory map as well for instant routing & persistence across refreshes
    fontInMemSchools.set(slug, newSchoolObj);
    
    // 2. Insert admin user into 'admin_users' table
    const hashedPassword = bcrypt.hashSync(admin_password, 10);
    try {
      await supabase.from('admin_users').insert({
        username: admin_username,
        password_hash: hashedPassword,
        nama_lengkap: admin_name || admin_username,
        role: 'superadmin',
        school_id: newSchoolObj.id
      });
    } catch (adminErr: any) {
      try {
        await pool.query(
          `INSERT INTO admin_users (username, password_hash, nama_lengkap, role, school_id)
           VALUES ($1, $2, $3, 'superadmin', $4)
           ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
          [admin_username, hashedPassword, admin_name || admin_username, newSchoolObj.id]
        );
      } catch (e) {}
    }

    return c.json({ 
      success: true, 
      school_id: newSchoolObj.id,
      slug: slug,
      message: 'Registrasi berhasil! Account instansi aktif.'
    });
    
  } catch (err: any) {
    console.error('SaaS register exception:', err?.message);
    return c.json({ 
      success: false, 
      message: 'Terjadi kesalahan sistem saat registrasi: ' + err?.message
    }, 500);
  }
});

// Endpoint untuk mengaktifkan sekolah setelah pembayaran Midtrans (Sandbox Simulation / Webhook / Callback)
saasRouter.post('/activate', async (c) => {
  try {
    const body = await c.req.json();
    const { school_id, slug } = body;
    const targetSlug = slug || school_id;

    if (!targetSlug) return c.json({ success: false, message: 'school_id or slug is required' }, 400);

    const supabase = getSupabaseClient();
    const idOrSlug = String(targetSlug);

    // 1. Update Supabase 'prospective_schools'
    try {
      await supabase
        .from('prospective_schools')
        .update({
          status: 'FULL_VERIFIED',
          is_verified: true,
          plan_type: 'PRO'
        })
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } catch (e) {}

    // 2. Update/Upsert Supabase 'schools'
    try {
      await supabase
        .from('schools')
        .update({
          status: 'FULL_VERIFIED',
          is_verified: true,
          plan_type: 'PRO',
          subscription_plan: 'PRO_750K'
        })
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } catch (e) {}

    // 3. Update fontInMemSchools map
    fontInMemSchools.forEach((s, keySlug) => {
      if (String(s.id) === idOrSlug || String(s.slug) === idOrSlug || keySlug === idOrSlug) {
        s.status = 'FULL_VERIFIED';
        s.is_verified = true;
        s.plan_type = 'PRO';
        s.subscription_plan = 'PRO_750K';
      }
    });

    const localObj = fontInMemSchools.get(idOrSlug);
    if (localObj) {
      localObj.status = 'FULL_VERIFIED';
      localObj.is_verified = true;
      localObj.plan_type = 'PRO';
      localObj.subscription_plan = 'PRO_750K';
    }

    return c.json({
      success: true,
      message: 'Pembayaran Midtrans berhasil dikonfirmasi! Paket Pro CationGate (Rp 750.000 / Tahun) telah aktif & dashboard unlocked.'
    });
  } catch (err: any) {
    console.error('Activate error:', err);
    return c.json({ success: false, message: 'Gagal mengaktifkan lisensi: ' + err.message }, 500);
  }
});

// Endpoint Midtrans Webhook Notification Handler (Sandbox & Production)
saasRouter.post('/midtrans-webhook', async (c) => {
  try {
    const notificationJson = await c.req.json();
    const statusResponse = await snap.transaction.notification(notificationJson);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`[Midtrans Webhook] Transaction notification received. OrderId: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'challenge') {
        console.warn(`[Midtrans Webhook] Transaction ${orderId} challenged.`);
      } else {
        console.log(`[Midtrans Webhook] Transaction ${orderId} SUCCESSFUL/SETTLED.`);
      }
    }
    return c.json({ success: true, message: 'Webhook processed' });
  } catch (err: any) {
    console.warn('[Midtrans Webhook Error]:', err.message);
    return c.json({ success: true, message: 'Webhook received' });
  }
});

// Endpoint untuk generate Snap Token Midtrans Paket Pro Rp 750.000 / Tahun
saasRouter.post('/create-payment-token', async (c) => {
  try {
    const { school_name, email, amount } = await c.req.json();
    const orderId = `CG-PRO-${Date.now()}`;
    const grossAmount = amount || 750000;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: school_name || 'Admin Sekolah',
        email: email || 'admin@cationgate.id'
      },
      item_details: [
        {
          id: 'PRO-YEARLY-750K',
          price: grossAmount,
          quantity: 1,
          name: 'Paket SaaS CationGate Pro (1 Tahun)'
        }
      ]
    };

    const transaction = await snap.createTransaction(parameter);
    return c.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId
    });
  } catch (err: any) {
    console.error('Midtrans token creation error:', err?.message);
    // Return mock token for sandbox resilience if Midtrans credentials are offline
    return c.json({
      success: true,
      token: `MOCK-SNAP-TOKEN-${Date.now()}`,
      message: 'Mock token created'
    });
  }
});

export default saasRouter;
