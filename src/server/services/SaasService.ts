import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { resolveSchoolUUID } from '../db/resolve-school';
import { redis } from '../../utils/redis';
import bcrypt from 'bcryptjs';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
});

// In-memory registered schools fallback map
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fontInMemSchools = new Map<string, any>();

export interface SaasTransaction {
  id: number | string;
  order_id: string;
  school_name: string;
  school_slug: string;
  plan_name: string;
  amount: number;
  payment_method: string;
  status: 'SETTLEMENT' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
  customer_name?: string;
  customer_email?: string;
  created_at: string;
  settlement_time?: string;
}

export const inMemTransactions: SaasTransaction[] = [
  {
    id: 1,
    order_id: "CG-SUB-20260815-001",
    school_name: "SMK Taruna Bhakti",
    school_slug: "smktarunabhakti",
    plan_name: "Pro Tahunan",
    amount: 1200000,
    payment_method: "Midtrans (BCA Virtual Account)",
    status: "SETTLEMENT",
    customer_name: "Admin SMK Taruna Bhakti",
    customer_email: "info@smktarunabhakti.sch.id",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    settlement_time: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 120000).toISOString()
  },
  {
    id: 2,
    order_id: "CG-SUB-20260820-002",
    school_name: "SMK TI Bali Global Denpasar",
    school_slug: "smktiglobal",
    plan_name: "Enterprise Institution",
    amount: 1200000,
    payment_method: "Midtrans (QRIS Mandiri)",
    status: "SETTLEMENT",
    customer_name: "Panitia SPMB Bali Global",
    customer_email: "spmb@smktiglobal.sch.id",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    settlement_time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 65000).toISOString()
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkThreeDayTakedown(schoolObj: any): boolean {
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

export class SaasService {
  static async getSchoolBySlug(slug: string) {
    try {
      const cached = await redis.get(`school:${slug}`);
      if (cached) return { success: true, data: cached };
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
        await redis.setex(`school:${slug}`, 300, verifiedData);
      } catch (_e) {}
      return { success: true, data: verifiedData };
    }

    // 2. Check candidate 'prospective_schools' table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let candidateData: any = null;
    try {
      const { data: psData } = await supabase
        .from('prospective_schools')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      candidateData = psData;
    } catch (_e) {}

    if (!candidateData) {
      try {
        const { data: csData } = await supabase
          .from('calon_sekolah')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        candidateData = csData;
      } catch (_e) {}
    }

    if (candidateData) {
      checkThreeDayTakedown(candidateData);
      const memSchool = fontInMemSchools.get(slug);
      if (memSchool && memSchool.school_uuid) {
        candidateData.school_uuid = memSchool.school_uuid;
      }
      try {
        await redis.setex(`school:${slug}`, 300, candidateData);
      } catch (_e) {}
      return { success: true, data: candidateData };
    }

    // 3. Check in-memory fallback map
    const localSchool = fontInMemSchools.get(slug);
    if (localSchool) {
      checkThreeDayTakedown(localSchool);
      return { success: true, data: { ...localSchool } };
    }

    // Default Seed Fallback ONLY for smktarunabhakti or demo
    if (slug === 'smktarunabhakti' || slug === 'demo') {
      return {
        success: true,
        data: {
          id: 1,
          name: slug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : 'SMK Demo Indonesia',
          slug,
          status: 'FULL_VERIFIED',
          is_verified: true,
          logo_url: '/assets/logo_sekolah/logo_smktb.png'
        }
      };
    }

    return {
      success: false,
      notFound: true,
      message: `Sekolah atau URL '${slug}' belum terdaftar di CationGate.`
    };
  }

  static async checkEmailAvailability(email: string) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) return { available: false, exists: false };

    let isTaken = false;

    // 1. Direct PG pool check
    try {
      const pgRes = await pool.query(
        `SELECT 1 FROM (
           SELECT email FROM schools WHERE LOWER(email) = $1
           UNION ALL
           SELECT official_email AS email FROM prospective_schools WHERE LOWER(official_email) = $1
           UNION ALL
           SELECT email FROM admin_users WHERE LOWER(email) = $1 OR LOWER(username) = $1
         ) t LIMIT 1`,
        [cleanEmail]
      );
      if (pgRes.rows && pgRes.rows.length > 0) {
        isTaken = true;
      }
    } catch (_pgErr) {
      // Fallback to Supabase client
    }

    // 2. Supabase checks
    if (!isTaken) {
      try {
        const supabase = getSupabaseClient();
        const { data: schoolMatch } = await supabase
          .from('schools')
          .select('id')
          .ilike('email', cleanEmail)
          .maybeSingle();

        const { data: candidateMatch } = await supabase
          .from('prospective_schools')
          .select('id')
          .ilike('official_email', cleanEmail)
          .maybeSingle();

        const { data: adminMatch } = await supabase
          .from('admin_users')
          .select('id')
          .ilike('email', cleanEmail)
          .maybeSingle();

        const { data: adminUserMatch } = await supabase
          .from('admin_users')
          .select('id')
          .ilike('username', cleanEmail)
          .maybeSingle();

        if (schoolMatch || candidateMatch || adminMatch || adminUserMatch) {
          isTaken = true;
        }
      } catch (_sbErr) {}
    }

    // 3. In-memory registered schools map check
    if (!isTaken) {
      for (const val of fontInMemSchools.values()) {
        const valObj = val as { email?: string; official_email?: string };
        if (valObj.email?.toLowerCase() === cleanEmail || valObj.official_email?.toLowerCase() === cleanEmail) {
          isTaken = true;
          break;
        }
      }
    }

    return { available: !isTaken, exists: isTaken };
  }

  static async checkSlugAvailability(slug: string) {
    const cleanSlug = String(slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');

    if (!cleanSlug || cleanSlug.length < 3) {
      return { available: false, exists: false, message: 'Subdomain minimal 3 karakter alfanumerik.' };
    }

    const reservedSlugs = [
      'admin', 'api', 'app', 'auth', 'dashboard', 'demo', 'gatekeeper',
      'login', 'register', 'root', 'superadmin', 'system', 'www', 'mail',
      'static', 'assets', 'cationgate'
    ];
    if (reservedSlugs.includes(cleanSlug)) {
      return { available: false, exists: true, message: 'Subdomain ini dicadangkan oleh sistem.' };
    }

    let isTaken = false;

    // 1. PostgreSQL direct check
    try {
      const pgRes = await pool.query(
        `SELECT id FROM schools WHERE LOWER(slug) = $1
         UNION
         SELECT id FROM prospective_schools WHERE LOWER(slug) = $1
         LIMIT 1`,
        [cleanSlug]
      );
      if (pgRes.rows && pgRes.rows.length > 0) {
        isTaken = true;
      }
    } catch (_pgErr) {}

    // 2. Supabase checks
    if (!isTaken) {
      try {
        const supabase = getSupabaseClient();
        const { data: schoolMatch } = await supabase
          .from('schools')
          .select('id')
          .eq('slug', cleanSlug)
          .maybeSingle();

        const { data: candidateMatch } = await supabase
          .from('prospective_schools')
          .select('id')
          .eq('slug', cleanSlug)
          .maybeSingle();

        if (schoolMatch || candidateMatch) {
          isTaken = true;
        }
      } catch (_sbErr) {}
    }

    // 3. In-memory map check
    if (!isTaken) {
      if (fontInMemSchools.has(cleanSlug)) {
        isTaken = true;
      }
    }

    return {
      available: !isTaken,
      exists: isTaken,
      message: isTaken ? 'Subdomain sudah digunakan sekolah lain.' : 'Subdomain tersedia.'
    };
  }

  static async registerSchool(data: {
    school_name: string;
    slug: string;
    email: string;
    plan_type?: string;
    admin_name?: string;
    admin_username: string;
    admin_password: string;
    admin_email?: string;
  }) {
    const { school_name, slug, email, plan_type, admin_name, admin_username, admin_password, admin_email } = data;

    if (!school_name || !slug || !email || !admin_username || !admin_password) {
      return { success: false as const, statusCode: 400 as const, message: 'Data tidak lengkap' };
    }

    const isTrial = plan_type === 'trial';
    const supabase = getSupabaseClient();

    // Check slug
    const { data: existingVerifiedSlug } = await supabase.from('schools').select('id').eq('slug', slug).maybeSingle();
    const { data: existingCandidateSlug } = await supabase.from('prospective_schools').select('id').eq('slug', slug).maybeSingle();

    // Check name
    const { data: existingVerifiedName } = await supabase.from('schools').select('id').ilike('name', school_name).maybeSingle();
    const { data: existingCandidateName } = await supabase.from('prospective_schools').select('id').ilike('name', school_name).maybeSingle();

    const slugExists = !!(existingVerifiedSlug || existingCandidateSlug || fontInMemSchools.has(slug));
    let nameExists = !!(existingVerifiedName || existingCandidateName);

    if (!nameExists) {
      for (const val of fontInMemSchools.values()) {
        if (val.name?.toLowerCase() === school_name.toLowerCase()) {
          nameExists = true;
          break;
        }
      }
    }

    if (slugExists || nameExists) {
      return {
        success: false as const,
        statusCode: 400 as const,
        message: slugExists 
          ? 'Subdomain URL sudah digunakan. Silakan pilih URL lain.' 
          : 'Nama sekolah sudah terdaftar. Hubungi kami jika ini adalah sekolah Anda.'
      };
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanAdminEmail = (admin_email || email).toLowerCase().trim();
    const cleanAdminUsername = (admin_username || email).trim();
    const cleanSchoolName = school_name.trim();
    const cleanSlug = slug.toLowerCase().trim();

    const fallbackId = Math.floor(Date.now() / 1000);
    const createdAtIso = new Date().toISOString();

    const newSchoolObj: Record<string, unknown> = {
      id: fallbackId,
      name: cleanSchoolName,
      slug: cleanSlug,
      official_email: cleanEmail,
      status: 'BELUM_KIRIM_VERIFIKASI',
      is_verified: false,
      plan_type: isTrial ? 'TRIAL' : 'YEARLY',
      admin_name: admin_name || cleanAdminUsername,
      created_at: createdAtIso,
      logo_url: ''
    };

    let insertedSchoolId: number | string | null = null;
    const { randomUUID } = await import('crypto');
    const generatedSchoolUUID = randomUUID();

    try {
      const { data: psData } = await supabase
        .from('prospective_schools')
        .upsert({
          name: cleanSchoolName,
          slug: cleanSlug,
          official_email: cleanEmail,
          status: 'BELUM_KIRIM_VERIFIKASI',
          is_verified: false,
          plan_type: isTrial ? 'TRIAL' : 'YEARLY',
          admin_name: admin_name || cleanAdminUsername,
          created_at: createdAtIso
        }, { onConflict: 'slug' })
        .select('*')
        .maybeSingle();

      if (psData && psData.id) {
        insertedSchoolId = psData.id;
        newSchoolObj.id = insertedSchoolId;
      }
    } catch (sbErr: unknown) {
      console.warn('Supabase client insert warning:', sbErr instanceof Error ? sbErr.message : String(sbErr));
    }

    if (!insertedSchoolId) {
      try {
        const pgRes = await pool.query(
          `INSERT INTO prospective_schools (name, slug, official_email, status, is_verified, plan_type, admin_name, created_at)
           VALUES ($1, $2, $3, 'BELUM_KIRIM_VERIFIKASI', false, $4, $5, NOW())
           ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, official_email = EXCLUDED.official_email
           RETURNING id`,
          [cleanSchoolName, cleanSlug, cleanEmail, isTrial ? 'TRIAL' : 'YEARLY', admin_name || cleanAdminUsername]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          insertedSchoolId = pgRes.rows[0].id;
          newSchoolObj.id = insertedSchoolId;
        }
      } catch (pgErr: unknown) {
        console.error('PG Insert error during SaaS registration fallback:', pgErr instanceof Error ? pgErr.message : String(pgErr));
        return { success: false as const, statusCode: 500 as const, message: 'Gagal menyimpan data pendaftaran ke database' };
      }
    }

    newSchoolObj.school_uuid = generatedSchoolUUID;
    fontInMemSchools.set(cleanSlug, newSchoolObj);
    if (insertedSchoolId) {
      fontInMemSchools.set(String(insertedSchoolId), newSchoolObj);
    }

    // Try inserting into schools table (compatibility layer)
    try {
      await supabase.from('schools').upsert({
        name: cleanSchoolName,
        slug: cleanSlug,
        official_email: cleanEmail,
        status: 'UNVERIFIED',
        is_verified: false,
        plan_type: isTrial ? 'TRIAL' : 'YEARLY',
        admin_name: admin_name || cleanAdminUsername,
        created_at: createdAtIso
      }, { onConflict: 'slug' });
    } catch (_schoolsErr: unknown) {
      try {
        await pool.query(
          `INSERT INTO schools (name, slug, official_email, status, is_verified, plan_type, admin_name, created_at)
           VALUES ($1, $2, $3, 'UNVERIFIED', false, $4, $5, NOW())
           ON CONFLICT (slug) DO NOTHING`,
          [cleanSchoolName, cleanSlug, cleanEmail, isTrial ? 'TRIAL' : 'YEARLY', admin_name || cleanAdminUsername]
        );
      } catch (_e) {}
    }

    const hashedPassword = bcrypt.hashSync(admin_password, 10);
    const isUUID = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
    const adminSchoolRef = insertedSchoolId && isUUID(String(insertedSchoolId)) 
      ? String(insertedSchoolId) 
      : (generatedSchoolUUID || null);
    const finalAdminUsername = cleanAdminUsername || cleanAdminEmail;

    try {
      const payload: Record<string, unknown> = {
        username: finalAdminUsername,
        email: cleanAdminEmail,
        password_hash: hashedPassword,
        nama_lengkap: admin_name || cleanAdminUsername,
        role: 'superadmin'
      };
      if (adminSchoolRef) {
        payload.school_id = adminSchoolRef;
      }

      const { error: upsertErr } = await supabase.from('admin_users').upsert(payload, { onConflict: 'username' });
      if (upsertErr) {
        console.warn('Supabase admin_users upsert warning:', upsertErr.message);
        // Fallback without school_id
        delete payload.school_id;
        await supabase.from('admin_users').upsert(payload, { onConflict: 'username' });
      }
    } catch (_adminErr: unknown) {
      try {
        await pool.query(
          `INSERT INTO admin_users (username, email, password_hash, nama_lengkap, role)
           VALUES ($1, $2, $3, $4, 'superadmin')
           ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, email = EXCLUDED.email`,
          [finalAdminUsername, cleanAdminEmail, hashedPassword, admin_name || cleanAdminUsername]
        );
      } catch (_e) {}
    }

    return { 
      success: true as const, 
      statusCode: 200 as const,
      school_id: newSchoolObj.id,
      slug: cleanSlug,
      message: 'Registrasi berhasil! Account instansi aktif.'
    };
  }

  static async activateSchool(
    targetSlug: string,
    orderId?: string,
    planName?: string,
    amount?: number,
    paymentMethod?: string
  ) {
    const supabase = getSupabaseClient();
    const idOrSlug = String(targetSlug);
    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const txAmount = typeof amount === 'number' && amount > 0 ? amount : 1200000;
    const txPlan = planName || (txAmount >= 30000000 ? 'Enterprise Institution' : 'Pro Tahunan');
    const txMethod = paymentMethod || 'Midtrans (Simulasi Sandbox)';
    const finalOrderId = orderId || `CG-SIM-${Date.now()}`;

    if (orderId) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'SETTLEMENT', updated_at: now.toISOString() })
          .eq('order_id', orderId);
      } catch (_e) {}
    }

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

    let resolvedUUID: string | null = null;
    let schoolName = 'Sekolah SMK';
    let schoolSlug = idOrSlug;
    let _adminName = 'Admin Sekolah';
    let _officialEmail = `${idOrSlug}@school.id`;

    try {
      let scUpdate = supabase
        .from('schools')
        .update({
          status: 'FULL_VERIFIED',
          subscription_plan: 'PRO_YEARLY',
          subscription_end_date: oneYearLater.toISOString()
        });

      const isNumericId = !isNaN(Number(idOrSlug)) && Number(idOrSlug) > 0;
      if (isNumericId) {
        scUpdate = scUpdate.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
      } else {
        scUpdate = scUpdate.eq('slug', idOrSlug);
      }

      const { data: updatedSchool } = await scUpdate.select('*').maybeSingle();
      if (updatedSchool) {
        resolvedUUID = updatedSchool.id;
        if (updatedSchool.name) schoolName = updatedSchool.name;
        if (updatedSchool.slug) schoolSlug = updatedSchool.slug;
        if (updatedSchool.admin_name) _adminName = updatedSchool.admin_name;
        if (updatedSchool.official_email) _officialEmail = updatedSchool.official_email;
      }
    } catch (e) {
      console.warn('Supabase schools update warning:', e);
    }

    if (!resolvedUUID) {
      try {
        const { resolveSchoolUUID } = await import('../db/resolve-school');
        resolvedUUID = await resolveSchoolUUID(idOrSlug, fontInMemSchools) || null;
      } catch (_e) {}
    }

    // Try finding details in in-memory map
    fontInMemSchools.forEach((s, keySlug) => {
      if (String(s.id) === idOrSlug || String(s.slug) === idOrSlug || keySlug === idOrSlug) {
        s.status = 'FULL_VERIFIED';
        s.is_verified = true;
        s.plan_type = 'PRO';
        s.subscription_plan = 'PRO_YEARLY';
        if (s.name) schoolName = s.name;
        if (s.slug) schoolSlug = s.slug;
        if (s.admin_name) _adminName = s.admin_name;
        if (s.official_email) _officialEmail = s.official_email;
      }
    });

    const localObj = fontInMemSchools.get(idOrSlug);
    if (localObj) {
      localObj.status = 'FULL_VERIFIED';
      localObj.is_verified = true;
      localObj.plan_type = 'PRO';
      localObj.subscription_plan = 'PRO_YEARLY';
      if (localObj.name) schoolName = localObj.name;
      if (localObj.slug) schoolSlug = localObj.slug;
      if (localObj.admin_name) _adminName = localObj.admin_name;
      if (localObj.official_email) _officialEmail = localObj.official_email;
    }

    if (idOrSlug === 'smktarunabhakti' || targetSlug === 'smktarunabhakti') {
      schoolName = 'SMK Taruna Bhakti';
      schoolSlug = 'smktarunabhakti';
    } else if (idOrSlug === 'smktiglobal' || targetSlug === 'smktiglobal') {
      schoolName = 'SMK TI Bali Global Denpasar';
      schoolSlug = 'smktiglobal';
    }

    if (resolvedUUID) {
      try {
        await supabase.from('school_subscriptions').insert({
          school_id: resolvedUUID,
          plan_name: 'PRO_YEARLY',
          status: 'ACTIVE',
          started_at: now.toISOString(),
          expires_at: oneYearLater.toISOString(),
          midtrans_order_id: finalOrderId,
          amount_paid: txAmount
        });
      } catch (e) {
        console.warn('school_subscriptions insert warning:', e);
      }

      try {
        await supabase.from('orders').insert({
          order_id: finalOrderId,
          order_type: 'SCHOOL_PLAN',
          school_id: resolvedUUID,
          amount: txAmount,
          status: 'SETTLEMENT'
        });
      } catch (_ordErr) {}
    }

    // Try saving to PostgreSQL pool if available
    try {
      await pool.query(
        `INSERT INTO orders (order_id, order_type, amount, status)
         VALUES ($1, 'SCHOOL_PLAN', $2, 'SETTLEMENT')
         ON CONFLICT (order_id) DO UPDATE SET status = 'SETTLEMENT', updated_at = NOW()`,
        [finalOrderId, txAmount]
      );
    } catch (_pgErr) {}

    // Record into inMemTransactions
    const existingIndex = inMemTransactions.findIndex(t => t.order_id === finalOrderId);
    if (existingIndex >= 0) {
      inMemTransactions[existingIndex].status = 'SETTLEMENT';
      inMemTransactions[existingIndex].settlement_time = now.toISOString();
      inMemTransactions[existingIndex].amount = txAmount;
      inMemTransactions[existingIndex].plan_name = txPlan;
    } else {
      inMemTransactions.unshift({
        id: inMemTransactions.length + 1,
        order_id: finalOrderId,
        school_name: schoolName,
        school_slug: schoolSlug,
        plan_name: txPlan,
        amount: txAmount,
        payment_method: txMethod,
        status: 'SETTLEMENT',
        created_at: now.toISOString(),
        settlement_time: now.toISOString()
      });
    }

    // Invalidate Redis cache
    try {
      if (schoolSlug) await redis.del(`school:${schoolSlug}`);
      if (idOrSlug) await redis.del(`school:${idOrSlug}`);
      if (resolvedUUID) await redis.del(`school:${resolvedUUID}`);
      await redis.del(`config_${schoolSlug}`);
      await redis.del(`config_${idOrSlug}`);
      await redis.del('config_default');
    } catch (_redisErr) {}

    return {
      success: true,
      message: `Pembayaran ${txPlan} (Rp ${txAmount.toLocaleString('id-ID')}) berhasil dikonfirmasi! Riwayat transaksi tercatat di Gatekeeper & dashboard sekolah unlocked.`
    };
  }

  static async getTransactions() {
    // 1. Try fetching from Supabase orders / subscriptions table
    const transactionsList: SaasTransaction[] = [...inMemTransactions];
    const seenOrderIds = new Set<string>(inMemTransactions.map(t => t.order_id));

    try {
      const supabase = getSupabaseClient();
      const { data: dbOrders } = await supabase
        .from('orders')
        .select('*, schools(name, slug, admin_name, official_email)')
        .order('created_at', { ascending: false });

      if (dbOrders && Array.isArray(dbOrders)) {
        for (const ord of dbOrders) {
          if (!seenOrderIds.has(ord.order_id)) {
            seenOrderIds.add(ord.order_id);
            transactionsList.push({
              id: ord.id || ord.order_id,
              order_id: ord.order_id,
              school_name: ord.schools?.name || 'Sekolah Terdaftar',
              school_slug: ord.schools?.slug || 'school',
              plan_name: ord.amount >= 30000000 ? 'Enterprise Institution' : 'Pro Tahunan',
              amount: ord.amount || 1200000,
              payment_method: 'Midtrans Payment Gateway',
              status: (ord.status || 'SETTLEMENT') as SaasTransaction['status'],
              customer_name: ord.schools?.admin_name || 'Admin Instansi',
              customer_email: ord.schools?.official_email || 'admin@school.id',
              created_at: ord.created_at || new Date().toISOString(),
              settlement_time: ord.updated_at || ord.created_at
            });
          }
        }
      }
    } catch (_e) {}

    // Sort newest first
    return transactionsList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getTransactionStats() {
    const all = await this.getTransactions();
    const settlementTx = all.filter(t => t.status === 'SETTLEMENT');
    const totalRevenue = settlementTx.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalTransactions = settlementTx.length;
    const uniqueSchools = new Set(settlementTx.map(t => t.school_slug)).size;

    return {
      total_revenue: totalRevenue,
      total_transactions: totalTransactions,
      active_subscriptions: uniqueSchools,
      avg_order_value: totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0
    };
  }

  static async createMidtransOrder(params: {
    orderType: 'SCHOOL_PLAN' | 'STUDENT_FORM';
    amount: number;
    customerName: string;
    customerEmail: string;
    itemId: string;
    itemName: string;
  }) {
    const orderId = `CG-${params.orderType}-${Date.now()}`;
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: params.amount,
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: params.customerName || 'Customer',
        email: params.customerEmail || 'customer@cationgate.id',
      },
      item_details: [
        {
          id: params.itemId,
          price: params.amount,
          quantity: 1,
          name: params.itemName,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    return { token: transaction.token, redirect_url: transaction.redirect_url, order_id: orderId };
  }

  static async getPlans() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        { id: 1, name: 'Free Trial', price_monthly: 0, price_yearly: 0, features: ['Pendaftaran Online PPDB', 'Kelola Data Calon Siswa', 'Export Excel', 'Landing Page Sekolah', 'Maks 100 Pendaftar', 'Masa Aktif 30 Hari'], is_active: true },
        { id: 2, name: 'Pro Tahunan', price_monthly: 1250000, price_yearly: 15000000, features: ['Semua Fitur Free Trial', 'Unlimited Pendaftar', 'Custom Branding & Logo', 'Multi-Admin Dashboard', 'WhatsApp Notifikasi', 'Prioritas Support 24/7', 'Pembagian Kelas Otomatis', 'Laporan & Statistik Lengkap'], is_active: true },
        { id: 3, name: 'Enterprise Institution', price_monthly: 2916666, price_yearly: 35000000, features: ['Semua Fitur Pro Tahunan', 'Multi-Kampus & Cabang Yayasan', 'Integrasi Dapodik & Emis', 'Dedicated Account Manager', 'Custom Domain Pribadi', 'SLA Uptime 99.9%'], is_active: true }
      ];
    }
    return data;
  }

  static async getSubscriptionStatus(schoolId?: string, slug?: string) {
    const supabase = getSupabaseClient();
    let resolvedSchoolId = schoolId;
    if (!resolvedSchoolId && slug) {
      const { resolveSchoolUUID } = await import('../db/resolve-school');
      resolvedSchoolId = await resolveSchoolUUID(slug, fontInMemSchools) || undefined;
    }

    if (!resolvedSchoolId) {
      return {
        plan: 'FREE_TRIAL',
        status: 'ACTIVE',
        daysLeft: 30,
        isExpired: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    const { data: sub } = await supabase
      .from('school_subscriptions')
      .select('*')
      .eq('school_id', resolvedSchoolId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sub) {
      const expiresAt = new Date(sub.expires_at);
      const now = new Date();
      const diffMs = expiresAt.getTime() - now.getTime();
      const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      const isExpired = daysLeft <= 0;

      if (isExpired && sub.status === 'ACTIVE') {
        try {
          await supabase
            .from('school_subscriptions')
            .update({ status: 'EXPIRED', updated_at: new Date().toISOString() })
            .eq('id', sub.id);
        } catch (_e) {}
      }

      return {
        plan: sub.plan_name,
        status: isExpired ? 'EXPIRED' : sub.status,
        daysLeft,
        isExpired,
        expiresAt: sub.expires_at,
        startedAt: sub.started_at,
        amountPaid: sub.amount_paid || 0
      };
    }

    const { data: school } = await supabase
      .from('schools')
      .select('created_at, subscription_plan, subscription_end_date')
      .eq('id', resolvedSchoolId)
      .maybeSingle();

    if (school) {
      const createdAt = new Date(school.created_at || Date.now());
      const trialEnd = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diffMs = trialEnd.getTime() - now.getTime();
      const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      const isExpired = daysLeft <= 0;

      if (school.subscription_end_date) {
        const legacyEnd = new Date(school.subscription_end_date);
        const legacyDiff = legacyEnd.getTime() - now.getTime();
        const legacyDays = Math.max(0, Math.ceil(legacyDiff / (1000 * 60 * 60 * 24)));
        return {
          plan: school.subscription_plan || 'FREE_TRIAL',
          status: legacyDays <= 0 ? 'EXPIRED' : 'ACTIVE',
          daysLeft: legacyDays,
          isExpired: legacyDays <= 0,
          expiresAt: school.subscription_end_date
        };
      }

      return {
        plan: 'FREE_TRIAL',
        status: isExpired ? 'EXPIRED' : 'ACTIVE',
        daysLeft,
        isExpired,
        expiresAt: trialEnd.toISOString()
      };
    }

    return {
      plan: 'FREE_TRIAL',
      status: 'ACTIVE',
      daysLeft: 30,
      isExpired: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  static async submitSchoolVerification(payload: {
    school_id?: string | number;
    school_slug?: string;
    sk_document_url?: string;
    sk_document_name?: string;
    legal_sk_number?: string;
    accreditation?: string;
    official_email?: string;
    admin_name?: string;
    npsn?: string;
    dapodik_code?: string;
    whatsapp?: string;
    website_url?: string;
    instagram_url?: string;
    documents?: Array<{
      id: string;
      type: string;
      name: string;
      url: string;
      size?: number;
    }>;
  }) {
    const slug = payload.school_slug || String(payload.school_id);
    const supabase = getSupabaseClient();
    const resolvedId = await resolveSchoolUUID(slug, fontInMemSchools);

    const firstDoc = (payload.documents && payload.documents.length > 0) ? payload.documents[0] : null;

    const updates: Record<string, unknown> = {
      status: 'PENDING_VERIFICATION',
      legal_sk_number: payload.legal_sk_number || 'SK-PENDING',
      sk_document_url: payload.sk_document_url || firstDoc?.url || '',
      sk_document_name: payload.sk_document_name || firstDoc?.name || 'SK_Operasional.pdf',
      accreditation: payload.accreditation || 'A (Unggul)',
      documents: payload.documents || (payload.sk_document_name ? [{
        id: 'doc-1',
        type: 'SK_OPERASIONAL',
        name: payload.sk_document_name,
        url: payload.sk_document_url
      }] : []),
      verification_documents: payload.documents,
      updated_at: new Date().toISOString()
    };

    if (payload.npsn) updates.npsn = payload.npsn;
    if (payload.dapodik_code) updates.dapodik_code = payload.dapodik_code;
    if (payload.admin_name) updates.admin_name = payload.admin_name;
    if (payload.official_email) updates.official_email = payload.official_email;

    if (resolvedId) {
      try {
        await supabase.from('schools').update(updates).eq('id', resolvedId);
      } catch (_e) {}
    }
    try {
      await supabase.from('schools').update(updates).eq('slug', slug);
    } catch (_e) {}

    // 1. Guaranteed in-memory cache upsert
    let matchedMem = false;
    fontInMemSchools.forEach((s, k) => {
      if (k === slug || String(s.id) === String(resolvedId) || String(s.slug) === slug) {
        matchedMem = true;
        s.status = 'PENDING_VERIFICATION';
        s.legal_sk_number = (updates.legal_sk_number as string) || s.legal_sk_number;
        s.sk_document_url = (updates.sk_document_url as string) || s.sk_document_url;
        s.sk_document_name = (updates.sk_document_name as string) || s.sk_document_name;
        s.accreditation = (updates.accreditation as string) || s.accreditation;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.documents = updates.documents as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.verification_documents = updates.documents as any;
        if (payload.npsn) s.npsn = payload.npsn;
        if (payload.dapodik_code) s.dapodik_code = payload.dapodik_code;
        if (payload.admin_name) s.admin_name = payload.admin_name;
        if (payload.official_email) s.official_email = payload.official_email;
      }
    });

    if (!matchedMem) {
      fontInMemSchools.set(slug, {
        id: Math.floor(Date.now() / 1000),
        name: slug.toUpperCase(),
        slug,
        status: 'PENDING_VERIFICATION',
        legal_sk_number: updates.legal_sk_number,
        sk_document_url: updates.sk_document_url,
        sk_document_name: updates.sk_document_name,
        accreditation: updates.accreditation,
        documents: updates.documents,
        verification_documents: updates.documents,
        npsn: payload.npsn || '',
        dapodik_code: payload.dapodik_code || '',
        admin_name: payload.admin_name || '',
        official_email: payload.official_email || '',
        created_at: new Date().toISOString()
      });
    }

    // Invalidate Redis caches
    try {
      if (redis) {
        await redis.del(`school:${slug}`);
        await redis.del(`config_${slug}`);
        await redis.del('gatekeeper_schools_list');
      }
    } catch (_e) {}

    // 2. Supabase UPSERT into prospective_schools
    try {
      await supabase.from('prospective_schools').upsert({
        slug,
        name: slug.toUpperCase(),
        status: 'PENDING_VERIFICATION',
        legal_sk_number: updates.legal_sk_number,
        sk_document_url: updates.sk_document_url,
        sk_document_name: updates.sk_document_name,
        accreditation: updates.accreditation,
        npsn: payload.npsn || '',
        dapodik_code: payload.dapodik_code || '',
        admin_name: payload.admin_name || '',
        official_email: payload.official_email || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });
    } catch (_e) {}

    // 3. PostgreSQL pool UPSERT into prospective_schools
    try {
      await pool.query(
        `INSERT INTO prospective_schools (
           name, slug, official_email, status, is_verified, plan_type, admin_name,
           legal_sk_number, sk_document_url, sk_document_name, accreditation, npsn, dapodik_code, created_at
         ) VALUES (
           $1, $2, $3, 'PENDING_VERIFICATION', false, 'TRIAL', $4,
           $5, $6, $7, $8, $9, $10, NOW()
         )
         ON CONFLICT (slug) DO UPDATE SET
           status = 'PENDING_VERIFICATION',
           legal_sk_number = EXCLUDED.legal_sk_number,
           sk_document_url = EXCLUDED.sk_document_url,
           sk_document_name = EXCLUDED.sk_document_name,
           accreditation = EXCLUDED.accreditation,
           npsn = EXCLUDED.npsn,
           dapodik_code = EXCLUDED.dapodik_code,
           admin_name = EXCLUDED.admin_name,
           official_email = EXCLUDED.official_email,
           updated_at = NOW()`,
        [
          slug.toUpperCase(),
          slug,
          payload.official_email || '',
          payload.admin_name || '',
          updates.legal_sk_number,
          updates.sk_document_url,
          updates.sk_document_name,
          updates.accreditation,
          payload.npsn || '',
          payload.dapodik_code || ''
        ]
      );
    } catch (_pgErr) {}

    return {
      success: true,
      message: 'Dokumen verifikasi berhasil diajukan dan sedang diproses Gatekeeper.'
    };
  }
}

