import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { redis } from '../../utils/redis';
// @ts-ignore
import midtransClient from 'midtrans-client';
import crypto from 'crypto';
import { registerLimiter } from '../middleware/rate-limiter';

const saasRouter = new Hono();

// Midtrans Core Config
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
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
    
    // 0. Check Redis cache first
    try {
      const cached = await redis.get(`school:${slug}`);
      if (cached) {
        return c.json({ success: true, data: cached });
      }
    } catch (redisErr) {
      console.warn('Redis cache read error:', redisErr);
    }

    const supabase = getSupabaseClient();
    
    // 1. Check verified 'schools' table first
    const { data: verifiedData } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
      
    if (verifiedData) {
      try {
        await redis.setex(`school:${slug}`, 300, verifiedData); // cache for 5 minutes
      } catch (e) {}
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
      // Enrich with school_uuid from in-memory map (generated during registration)
      const memSchool = fontInMemSchools.get(slug);
      if (memSchool && memSchool.school_uuid) {
        candidateData.school_uuid = memSchool.school_uuid;
      }
      try {
        await redis.setex(`school:${slug}`, 300, candidateData);
      } catch (e) {}
      return c.json({ success: true, data: candidateData });
    }

    // 3. Check in-memory fallback map (Clone to prevent cross-tenant memory leak)
    const localSchool = fontInMemSchools.get(slug);
    if (localSchool) {
      checkThreeDayTakedown(localSchool);
      return c.json({ success: true, data: { ...localSchool } });
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

// Check if email already exists
saasRouter.post('/check-email', async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email) return c.json({ available: false }, 400);

    const supabase = getSupabaseClient();
    const { data: existingEmailInSchools } = await supabase.from('schools').select('id').or(`email.eq.${email},official_email.eq.${email}`).maybeSingle();
    const { data: existingEmailInCandidates } = await supabase.from('prospective_schools').select('id').eq('official_email', email).maybeSingle();
    const { data: existingAdminEmail } = await supabase.from('admin_users').select('id').eq('email', email).maybeSingle();

    const isTaken = !!(existingEmailInSchools || existingEmailInCandidates || existingAdminEmail);
    return c.json({ available: !isTaken });
  } catch (err) {
    console.error('Error checking email:', err);
    return c.json({ available: false }, 500);
  }
});

// Register new school from Landing Page
saasRouter.post('/register', registerLimiter, async (c) => {
  try {
    const { school_name, slug, email, phone, address, plan_type, admin_name, admin_username, admin_password, admin_email } = await c.req.json();
    
    if (!school_name || !slug || !email || !admin_username || !admin_password) {
      return c.json({ success: false, message: 'Data tidak lengkap' }, 400);
    }
    
    const isTrial = plan_type === 'trial';
    const supabase = getSupabaseClient();
    
    // Check if slug exists in Supabase (schools or prospective_schools) or Memory
    const { data: existingVerifiedSlug } = await supabase.from('schools').select('id').eq('slug', slug).maybeSingle();
    const { data: existingCandidateSlug } = await supabase.from('prospective_schools').select('id').eq('slug', slug).maybeSingle();
    
    // Check if name exists in Supabase
    const { data: existingVerifiedName } = await supabase.from('schools').select('id').ilike('name', school_name).maybeSingle();
    const { data: existingCandidateName } = await supabase.from('prospective_schools').select('id').ilike('name', school_name).maybeSingle();

    let slugExists = !!(existingVerifiedSlug || existingCandidateSlug || fontInMemSchools.has(slug));
    let nameExists = !!(existingVerifiedName || existingCandidateName);

    // Also check in-memory map for duplicate name
    if (!nameExists) {
      for (const val of fontInMemSchools.values()) {
        if (val.name?.toLowerCase() === school_name.toLowerCase()) {
          nameExists = true;
          break;
        }
      }
    }

    if (slugExists || nameExists) {
      return c.json({
        success: false,
        message: slugExists 
          ? 'Subdomain URL sudah digunakan. Silakan pilih URL lain.' 
          : 'Nama sekolah sudah terdaftar. Hubungi kami jika ini adalah sekolah Anda.'
      }, 400);
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
      logo_url: ''
    };
    
    // 1. Insert into Supabase 'prospective_schools' table
    let insertedSchoolId: any = null;

    // Generate a UUID for admin_users.school_id (since admin_users.school_id is UUID type)
    // This UUID will be used as the "virtual" school_id until the school is fully verified
    // and migrated to the 'schools' table.
    const { randomUUID } = await import('crypto');
    const generatedSchoolUUID = randomUUID();

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
      } catch (pgErr: any) {
        console.error('PG Insert error during SaaS registration fallback:', pgErr.message);
        return c.json({ success: false, message: 'Gagal menyimpan data pendaftaran ke database' }, 500);
      }
    }

    // Store the generated UUID in the school object for login resolution
    newSchoolObj.school_uuid = generatedSchoolUUID;

    // Store in memory map as well for instant routing & persistence across refreshes
    fontInMemSchools.set(slug, newSchoolObj);
    
    // 2. Insert into 'schools' table first to satisfy foreign key constraint for admin_users
    try {
      await supabase.from('schools').insert({
        id: generatedSchoolUUID,
        name: school_name,
        slug: slug,
        email: email || '',
        status: 'unverified',
        subscription_plan: 'free'
      });
    } catch (schoolsErr: any) {
      try {
        await pool.query(
          `INSERT INTO schools (id, name, slug, email, status, subscription_plan, created_at)
           VALUES ($1::uuid, $2, $3, $4, 'unverified', 'free', NOW())
           ON CONFLICT (id) DO NOTHING`,
          [generatedSchoolUUID, school_name, slug, email || '']
        );
      } catch (e) {}
    }

    // 3. Insert admin user into 'admin_users' table
    // IMPORTANT: Use the generated UUID for school_id (NOT the integer prospective_schools.id)
    // because admin_users.school_id column is UUID type.
    const hashedPassword = bcrypt.hashSync(admin_password, 10);
    try {
      await supabase.from('admin_users').insert({
        username: admin_email || email,
        email: admin_email || email,
        password_hash: hashedPassword,
        nama_lengkap: admin_name || admin_username,
        role: 'superadmin',
        school_id: generatedSchoolUUID
      });
    } catch (adminErr: any) {
      try {
        await pool.query(
          `INSERT INTO admin_users (username, email, password_hash, nama_lengkap, role, school_id)
           VALUES ($1, $2, $3, $4, 'superadmin', $5::uuid)
           ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
          [admin_email || email, admin_email || email, hashedPassword, admin_name || admin_username, generatedSchoolUUID]
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
saasRouter.post('/activate', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { school_id, slug, order_id } = body;
    const targetSlug = slug || school_id;

    if (!targetSlug) return c.json({ success: false, message: 'school_id or slug is required' }, 400);

    const supabase = getSupabaseClient();
    const idOrSlug = String(targetSlug);

    // If order_id provided, update its status
    if (order_id) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'SETTLEMENT', updated_at: new Date().toISOString() })
          .eq('order_id', order_id);
      } catch (e) {}
    }

    // 1. Update Supabase 'prospective_schools'
    try {
      let psUpdate = supabase
        .from('prospective_schools')
        .update({
          status: 'FULL_VERIFIED',
          is_verified: true,
          plan_type: 'PRO'
        });
      
      const isNumericId = !isNaN(Number(idOrSlug)) && Number(idOrSlug) > 0;
      if (isNumericId) {
        psUpdate = psUpdate.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
      } else {
        psUpdate = psUpdate.eq('slug', idOrSlug);
      }
      
      await psUpdate;
    } catch (e) {
      console.warn('Supabase prospective_schools update warning:', e);
    }

    // 2. Update/Upsert Supabase 'schools'
    // 2. Update/Upsert Supabase 'schools'
    try {
      let scUpdate = supabase
        .from('schools')
        .update({
          status: 'FULL_VERIFIED',
          subscription_plan: 'PRO_750K'
        });

      const isNumericId = !isNaN(Number(idOrSlug)) && Number(idOrSlug) > 0;
      if (isNumericId) {
        scUpdate = scUpdate.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
      } else {
        scUpdate = scUpdate.eq('slug', idOrSlug);
      }
      
      await scUpdate;
    } catch (e) {
      console.warn('Supabase schools update warning:', e);
    }

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

// ═══════════════════════════════════════════════════════════════
// MIDTRANS PAYMENT GATEWAY
// Supports two order types:
// - SCHOOL_PLAN: Subscription plan payment for tenant school
// - STUDENT_FORM: Registration form payment for student
// ═══════════════════════════════════════════════════════════════

// Helper: Create Midtrans Snap Token for any order type
async function createMidtransOrder({
  orderType,
  amount,
  customerName,
  customerEmail,
  itemId,
  itemName,
  metadata = {}
}: {
  orderType: 'SCHOOL_PLAN' | 'STUDENT_FORM';
  amount: number;
  customerName: string;
  customerEmail: string;
  itemId: string;
  itemName: string;
  metadata?: any;
}) {
  const orderId = `CG-${orderType}-${Date.now()}`;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    credit_card: { secure: true },
    customer_details: {
      first_name: customerName || 'Customer',
      email: customerEmail || 'customer@cationgate.id',
    },
    item_details: [
      {
        id: itemId,
        price: amount,
        quantity: 1,
        name: itemName,
      },
    ],
  };

  const transaction = await snap.createTransaction(parameter);
  return { token: transaction.token, redirect_url: transaction.redirect_url, order_id: orderId };
}

// 1. POST /create-payment-token - Generic (back-compat) for SCHOOL_PLAN
saasRouter.post('/create-payment-token', async (c) => {
  try {
    const { school_name, email, amount, plan_id, billing_cycle } = await c.req.json();
    const grossAmount = amount || 750000;
    const orderId = `CG-PRO-${Date.now()}`;

    // Look up plan name if plan_id provided
    let itemName = 'Paket SaaS CationGate Pro (1 Tahun)';
    if (plan_id) {
      try {
        const supabase = getSupabaseClient();
        const { data: plan } = await supabase.from('plans').select('*').eq('id', plan_id).maybeSingle();
        if (plan) {
          itemName = `Paket ${plan.name} (${billing_cycle === 'monthly' ? 'Bulanan' : 'Tahunan'})`;
        }
      } catch (e) {}
    }

    const result = await createMidtransOrder({
      orderType: 'SCHOOL_PLAN',
      amount: grossAmount,
      customerName: school_name,
      customerEmail: email,
      itemId: plan_id ? `PLAN-${plan_id}` : 'PRO-YEARLY-750K',
      itemName,
    });

    // Persist order
    try {
      const supabase = getSupabaseClient();
      await supabase.from('orders').insert({
        order_id: result.order_id,
        order_type: 'SCHOOL_PLAN',
        plan_id: plan_id || null,
        amount: grossAmount,
        status: 'PENDING',
      });
    } catch (dbErr) {
      console.warn('Order insert warning (table may not exist yet):', dbErr);
    }

    return c.json({
      success: true,
      token: result.token,
      redirect_url: result.redirect_url,
      order_id: result.order_id,
    });
  } catch (err: any) {
    console.error('Midtrans token creation error:', err?.message);
    // Return mock token for sandbox resilience
    return c.json({
      success: true,
      token: `MOCK-SNAP-TOKEN-${Date.now()}`,
      message: 'Mock token created (Midtrans offline)',
    });
  }
});

// 2. POST /payment/student-form-token - Token for student registration fee
saasRouter.post('/payment/student-form-token', async (c) => {
  try {
    const { school_id, applicant_name, applicant_email, applicant_nisn } = await c.req.json();
    if (!school_id) {
      return c.json({ success: false, message: 'school_id is required' }, 400);
    }

    // Fetch school-specific registration fee from landing_page_config
    const supabase = getSupabaseClient();
    let regFee = 150000; // default fallback
    let schoolName = 'Sekolah';
    try {
      const { data: school } = await supabase.from('schools').select('name').eq('id', school_id).maybeSingle();
      if (school) schoolName = school.name;
    } catch (e) {}

    try {
      const { data: cfg } = await supabase
        .from('landing_page_config')
        .select('config_value')
        .eq('school_id', school_id)
        .eq('config_key', 'registration_fee')
        .maybeSingle();

      if (cfg && cfg.config_value) {
        const val = cfg.config_value as any;
        if (typeof val === 'object' && val.amount) {
          regFee = Number(val.amount);
        } else if (typeof val === 'number') {
          regFee = val;
        }
      }
    } catch (e) {}

    const result = await createMidtransOrder({
      orderType: 'STUDENT_FORM',
      amount: regFee,
      customerName: applicant_name,
      customerEmail: applicant_email,
      itemId: `REG-FEE-${school_id}`,
      itemName: `Biaya Formulir Pendaftaran - ${schoolName}`,
    });

    // Persist order
    try {
      await supabase.from('orders').insert({
        order_id: result.order_id,
        order_type: 'STUDENT_FORM',
        school_id,
        amount: regFee,
        status: 'PENDING',
      });
    } catch (dbErr) {
      console.warn('Order insert warning (table may not exist yet):', dbErr);
    }

    return c.json({
      success: true,
      token: result.token,
      redirect_url: result.redirect_url,
      order_id: result.order_id,
      amount: regFee,
    });
  } catch (err: any) {
    console.error('Student form token error:', err?.message);
    return c.json({
      success: true,
      token: `MOCK-SNAP-TOKEN-${Date.now()}`,
      message: 'Mock token created (Midtrans offline)',
    });
  }
});

// 3. POST /midtrans-webhook - Handles both SCHOOL_PLAN & STUDENT_FORM
saasRouter.post('/midtrans-webhook', async (c) => {
  try {
    const notificationJson = await c.req.json();
    
    // Security: Signature Verification
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const hash = crypto.createHash('sha512')
      .update(`${notificationJson.order_id}${notificationJson.status_code}${notificationJson.gross_amount}${serverKey}`)
      .digest('hex');
      
    if (notificationJson.signature_key !== hash) {
      console.warn(`[Midtrans Webhook] Invalid signature for OrderId: ${notificationJson.order_id}`);
      return c.json({ success: false, message: 'Invalid signature' }, 403);
    }

    const statusResponse = await snap.transaction.notification(notificationJson);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`[Midtrans Webhook] OrderId: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

    // Map transaction status to our internal status
    let internalStatus = 'PENDING';
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      internalStatus = 'SETTLEMENT';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny') {
      internalStatus = 'CANCELLED';
    } else if (transactionStatus === 'expire') {
      internalStatus = 'EXPIRED';
    }

    // Update order in DB
    const supabase = getSupabaseClient();
    let orderRow: any = null;
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();
      orderRow = orderData;
    } catch (e) {}

    // Always try to update order status
    try {
      await supabase
        .from('orders')
        .update({ status: internalStatus, updated_at: new Date().toISOString() })
        .eq('order_id', orderId);
    } catch (e) {}

    // If successful, trigger downstream effects based on order_type
    if (internalStatus === 'SETTLEMENT' && orderRow) {
      if (orderRow.order_type === 'SCHOOL_PLAN') {
        // Activate school subscription
        try {
          await supabase
            .from('prospective_schools')
            .update({ status: 'FULL_VERIFIED', is_verified: true })
            .or(`slug.eq.${orderRow.school_id},id.eq.${orderRow.school_id}`);
          await supabase
            .from('schools')
            .update({ status: 'FULL_VERIFIED', is_verified: true })
            .or(`slug.eq.${orderRow.school_id},id.eq.${orderRow.school_id}`);
        } catch (e) {
          console.warn('School activation warning:', e);
        }
      } else if (orderRow.order_type === 'STUDENT_FORM') {
        // Mark student registration fee as paid
        try {
          if (orderRow.applicant_id) {
            await supabase
              .from('calon_siswa')
              .update({ registration_paid: true })
              .eq('id', orderRow.applicant_id);
          }
        } catch (e) {
          console.warn('Student fee update warning:', e);
        }
      }
    }

    return c.json({ success: true, message: 'Webhook processed' });
  } catch (err: any) {
    console.warn('[Midtrans Webhook Error]:', err.message);
    return c.json({ success: true, message: 'Webhook received' });
  }
});

// Get active pricing plans
saasRouter.get('/plans', async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) {
      console.warn('Plans table missing, returning empty array');
      return c.json({ success: true, data: [] });
    }
    return c.json({ success: true, data: data || [] });
  } catch (err: any) {
    console.error('Fetch SaaS plans error:', err?.message);
    return c.json({ success: false, message: 'Gagal mengambil data paket SaaS' }, 500);
  }
});

export default saasRouter;
