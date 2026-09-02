import { getSupabaseClient } from '../../db/supabase';
import { pool } from '../../db/client';
import { resolveSchoolUUID } from '../../db/resolve-school';
import { redis } from '../../../utils/redis';
import midtransClient from 'midtrans-client';
import { SaasTransaction, inMemTransactions, fontInMemSchools } from './SaasTypes';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
});

export class SaasBillingService {
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
          school_id: resolvedUUID || schoolSlug || String(idOrSlug),
          amount: txAmount,
          status: 'SETTLEMENT'
        });
      } catch (_ordErr) {}
    }

    // Try saving to PostgreSQL pool if available
    try {
      await pool.query(
        `INSERT INTO orders (order_id, order_type, school_id, amount, status, created_at, updated_at)
         VALUES ($1, 'SCHOOL_PLAN', $2, $3, 'SETTLEMENT', NOW(), NOW())
         ON CONFLICT (order_id) DO UPDATE SET status = 'SETTLEMENT', school_id = COALESCE(EXCLUDED.school_id, orders.school_id), updated_at = NOW()`,
        [finalOrderId, resolvedUUID || schoolSlug || String(idOrSlug), txAmount]
      );
    } catch (_pgErr) {}

    // Record into inMemTransactions
    const existingIndex = inMemTransactions.findIndex(t => t.order_id === finalOrderId);
    if (existingIndex >= 0) {
      inMemTransactions[existingIndex].status = 'SETTLEMENT';
      inMemTransactions[existingIndex].settlement_time = now.toISOString();
      inMemTransactions[existingIndex].amount = txAmount;
      inMemTransactions[existingIndex].plan_name = txPlan;
      inMemTransactions[existingIndex].school_slug = schoolSlug;
      inMemTransactions[existingIndex].school_name = schoolName;
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
    const transactionsList: SaasTransaction[] = [...inMemTransactions];
    const seenOrderIds = new Set<string>(inMemTransactions.map(t => t.order_id));

    // 1. Fetch from PostgreSQL pool orders
    try {
      const pgOrders = await pool.query(
        `SELECT o.*, 
                COALESCE(s.name, ps.nama_sekolah, o.school_id, 'Sekolah Terdaftar') as school_name,
                COALESCE(s.slug, ps.slug, o.school_id, 'school') as school_slug,
                COALESCE(s.admin_name, ps.nama_admin, 'Admin Instansi') as admin_name,
                COALESCE(s.official_email, ps.email_admin, 'admin@school.id') as official_email
         FROM orders o
         LEFT JOIN schools s ON (s.id::text = o.school_id::text OR s.slug = o.school_id::text)
         LEFT JOIN prospective_schools ps ON (ps.id::text = o.school_id::text OR ps.slug = o.school_id::text)
         ORDER BY o.created_at DESC`
      );
      if (pgOrders.rows && pgOrders.rows.length > 0) {
        for (const ord of pgOrders.rows) {
          if (!seenOrderIds.has(ord.order_id)) {
            seenOrderIds.add(ord.order_id);
            const ordAmt = Number(ord.amount) || 0;
            transactionsList.push({
              id: ord.id || ord.order_id,
              order_id: ord.order_id,
              school_name: ord.school_name,
              school_slug: ord.school_slug,
              plan_name: ordAmt >= 30000000 ? 'Enterprise Institution' : (ordAmt > 0 ? 'Pro Tahunan' : 'Free Trial'),
              amount: ordAmt,
              payment_method: 'Midtrans Payment Gateway',
              status: (ord.status || 'SETTLEMENT') as SaasTransaction['status'],
              customer_name: ord.admin_name,
              customer_email: ord.official_email,
              created_at: ord.created_at ? new Date(ord.created_at).toISOString() : new Date().toISOString(),
              settlement_time: ord.updated_at ? new Date(ord.updated_at).toISOString() : new Date().toISOString()
            });
          }
        }
      }
    } catch (_pgErr) {}

    // 2. Try fetching from Supabase orders table
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
            const ordAmt = Number(ord.amount) || 0;
            transactionsList.push({
              id: ord.id || ord.order_id,
              order_id: ord.order_id,
              school_name: ord.schools?.name || ord.school_id || 'Sekolah Terdaftar',
              school_slug: ord.schools?.slug || ord.school_id || 'school',
              plan_name: ordAmt >= 30000000 ? 'Enterprise Institution' : (ordAmt > 0 ? 'Pro Tahunan' : 'Free Trial'),
              amount: ordAmt,
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
        {
          id: 1,
          name: 'Free Trial',
          price_monthly: 0,
          price_yearly: 0,
          features: [
            'Mendapatkan subdomain',
            'Landing page sekolah',
            'Profil sekolah',
            'Export & import excel data siswa aktif',
            'Masa aktif 30 hari',
            'Belum bisa membuka SPMB'
          ],
          is_active: true
        },
        {
          id: 2,
          name: 'Pro Tahunan',
          price_monthly: 100000,
          price_yearly: 1200000,
          features: [
            'Semua fitur Free Trial',
            'Semua data Dinamis',
            'Bisa membuat akun admin baru',
            'Unlimited Pendaftar',
            'Custom Tampilan profil sekolah',
            'Masa aktif 365 hari/setahun'
          ],
          is_active: true
        },
        {
          id: 3,
          name: 'Enterprise Institution',
          price_monthly: 2916666,
          price_yearly: 35000000,
          features: [
            'Semua Fitur Pro Tahunan',
            'Multi-Kampus & Cabang Yayasan',
            'Integrasi Dapodik & Emis',
            'Dedicated Account Manager',
            'Custom Domain Pribadi',
            'SLA Uptime 99.9%'
          ],
          is_active: true
        }
      ];
    }
    return data;
  }

  static async getSubscriptionStatus(schoolId?: string | null, slug?: string | null) {
    if (slug === 'demo' || schoolId === 'demo') {
      return {
        plan: 'PRO_YEARLY',
        status: 'ACTIVE',
        daysLeft: 365,
        isExpired: false,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    let resolvedUUID: string | null = null;
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    if (schoolId && isUUID(schoolId)) {
      resolvedUUID = schoolId;
    } else {
      const targetIdentifier = slug || schoolId;
      if (targetIdentifier) {
        try {
          resolvedUUID = await resolveSchoolUUID(targetIdentifier, fontInMemSchools);
        } catch (_e) {}
      }
    }

    const matchIds = [resolvedUUID, schoolId, slug].filter(Boolean) as string[];

    // 1. Check landing_page_config for subscription_data
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('landing_page_config')
        .select('config_value, updated_at')
        .in('school_id', matchIds)
        .eq('config_key', 'subscription_data')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && data.config_value) {
        const parsed = typeof data.config_value === 'string' ? JSON.parse(data.config_value) : data.config_value;
        if (parsed && parsed.expiresAt) {
          const daysLeft = Math.max(0, Math.ceil((new Date(parsed.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const isExpired = daysLeft <= 0;
          return {
            plan: parsed.plan || 'PRO_YEARLY',
            status: isExpired ? 'EXPIRED' : (parsed.status || 'ACTIVE'),
            daysLeft,
            isExpired,
            expiresAt: parsed.expiresAt
          };
        }
      }
    } catch (_sbErr) {}

    // 2. Check schools / prospective_schools table
    try {
      const supabase = getSupabaseClient();
      let sQuery = supabase.from('schools').select('subscription_plan, subscription_end_date, plan_type');
      if (resolvedUUID) {
        sQuery = sQuery.eq('id', resolvedUUID);
      } else if (slug) {
        sQuery = sQuery.eq('slug', slug);
      }
      const { data: sc } = await sQuery.maybeSingle();
      const plan = sc?.subscription_plan || sc?.plan_type;
      if (plan && (plan === 'PRO_YEARLY' || plan === 'PRO' || plan === 'ENTERPRISE')) {
        const expiresAt = sc?.subscription_end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        const daysLeft = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        const isExpired = daysLeft <= 0;
        return {
          plan: plan === 'PRO' ? 'PRO_YEARLY' : plan,
          status: isExpired ? 'EXPIRED' : 'ACTIVE',
          daysLeft,
          isExpired,
          expiresAt
        };
      }
    } catch (_scErr) {}

    // 3. Check PostgreSQL pool
    try {
      const pgRes = await pool.query(
        `SELECT config_value FROM landing_page_config WHERE school_id::text = ANY($1::text[]) AND config_key = 'subscription_data' ORDER BY updated_at DESC LIMIT 1`,
        [matchIds]
      );
      if (pgRes.rows && pgRes.rows.length > 0) {
        const raw = pgRes.rows[0].config_value;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (parsed && parsed.expiresAt) {
          const daysLeft = Math.max(0, Math.ceil((new Date(parsed.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const isExpired = daysLeft <= 0;
          return {
            plan: parsed.plan || 'PRO_YEARLY',
            status: isExpired ? 'EXPIRED' : (parsed.status || 'ACTIVE'),
            daysLeft,
            isExpired,
            expiresAt: parsed.expiresAt
          };
        }
      }
    } catch (_pgErr) {}

    // 4. Check in-memory store
    for (const id of matchIds) {
      if (fontInMemSchools.has(id)) {
        const mem = fontInMemSchools.get(id);
        if (mem?.subscription) {
          const s = mem.subscription;
          const daysLeft = s.expiresAt ? Math.max(0, Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 365;
          return {
            plan: s.plan || 'PRO_YEARLY',
            status: daysLeft <= 0 ? 'EXPIRED' : (s.status || 'ACTIVE'),
            daysLeft,
            isExpired: daysLeft <= 0,
            expiresAt: s.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          };
        }
      }
    }

    // Default: 30-day Free Trial
    return {
      plan: 'FREE_TRIAL',
      status: 'TRIAL',
      daysLeft: 30,
      isExpired: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  static async activateSubscription(data: {
    school_id?: string | null;
    slug?: string | null;
    plan_name?: string;
    order_id?: string;
  }) {
    const { school_id, slug, plan_name = 'PRO_YEARLY', order_id = `ORD-${Date.now()}` } = data;

    let resolvedUUID: string | null = null;
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    if (school_id && isUUID(school_id)) {
      resolvedUUID = school_id;
    } else {
      const targetIdentifier = slug || school_id;
      if (targetIdentifier) {
        try {
          resolvedUUID = await resolveSchoolUUID(targetIdentifier, fontInMemSchools);
        } catch (_e) {}
      }
    }

    const targetSchoolId = resolvedUUID || school_id || slug || 'default';
    const targetSlug = slug || (school_id && !isUUID(school_id) ? school_id : 'school');

    const oneYearExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const subRecord = {
      plan: plan_name,
      status: 'ACTIVE',
      daysLeft: 365,
      isExpired: false,
      expiresAt: oneYearExpiry,
      order_id,
      activated_at: new Date().toISOString()
    };

    // 1. Save to landing_page_config in Supabase
    try {
      const supabase = getSupabaseClient();
      await supabase.from('landing_page_config').upsert([
        {
          school_id: String(targetSchoolId),
          config_key: 'subscription_data',
          config_value: subRecord,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'school_id,config_key' });

      if (targetSlug && targetSlug !== targetSchoolId) {
        await supabase.from('landing_page_config').upsert([
          {
            school_id: targetSlug,
            config_key: 'subscription_data',
            config_value: subRecord,
            updated_at: new Date().toISOString()
          }
        ], { onConflict: 'school_id,config_key' });
      }

      // Update schools table & prospective_schools table
      if (resolvedUUID) {
        await supabase.from('schools').update({
          subscription_plan: plan_name,
          subscription_end_date: oneYearExpiry
        }).eq('id', resolvedUUID);
      }
      if (targetSlug) {
        await supabase.from('schools').update({
          subscription_plan: plan_name,
          subscription_end_date: oneYearExpiry
        }).eq('slug', targetSlug);

        await supabase.from('prospective_schools').update({
          plan_type: plan_name === 'PRO_YEARLY' ? 'PRO' : plan_name
        }).eq('slug', targetSlug);
      }
    } catch (_sbErr) {}

    // 2. Save to landing_page_config in PostgreSQL pool
    try {
      await pool.query(
        `INSERT INTO landing_page_config (school_id, config_key, config_value, updated_at)
         VALUES ($1, 'subscription_data', $2, NOW())
         ON CONFLICT (school_id, config_key)
         DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW()`,
        [String(targetSchoolId), JSON.stringify(subRecord)]
      );
      if (targetSlug && targetSlug !== targetSchoolId) {
        await pool.query(
          `INSERT INTO landing_page_config (school_id, config_key, config_value, updated_at)
           VALUES ($1, 'subscription_data', $2, NOW())
           ON CONFLICT (school_id, config_key)
           DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW()`,
          [targetSlug, JSON.stringify(subRecord)]
        );
      }
      if (targetSlug) {
        await pool.query(
          `UPDATE prospective_schools SET plan_type = $1, updated_at = NOW() WHERE slug = $2`,
          [plan_name === 'PRO_YEARLY' ? 'PRO' : plan_name, targetSlug]
        );
      }
    } catch (_pgErr) {}

    // 3. Update in-memory store
    const keysToUpdate = [targetSchoolId, targetSlug, slug, school_id].filter(Boolean) as string[];
    keysToUpdate.forEach((k) => {
      let mem = fontInMemSchools.get(k);
      if (!mem) {
        mem = { slug: k, name: k.toUpperCase() };
        fontInMemSchools.set(k, mem);
      }
      mem.subscription = subRecord;
      mem.plan_type = plan_name === 'PRO_YEARLY' ? 'PRO' : plan_name;
    });

    // 4. Record Transaction History
    const newTx: SaasTransaction = {
      id: Date.now(),
      order_id,
      school_name: targetSlug.toUpperCase().replace(/-/g, ' '),
      school_slug: targetSlug,
      plan_name: plan_name === 'PRO_YEARLY' ? 'Pro Tahunan' : (plan_name === 'ENTERPRISE' ? 'Enterprise Institution' : plan_name),
      amount: 1200000,
      payment_method: 'Simulasi Sistem (Instan)',
      status: 'SETTLEMENT',
      created_at: new Date().toISOString(),
      settlement_time: new Date().toISOString()
    };
    inMemTransactions.unshift(newTx);

    // Redis Invalidation
    try {
      await redis.del(`school:${targetSlug}`);
      await redis.del(`school:${targetSchoolId}`);
    } catch (_rErr) {}

    return {
      success: true,
      message: 'Langganan berhasil diaktifkan.',
      data: subRecord
    };
  }

  static async simulatePayment(data: {
    school_slug?: string;
    plan_name?: string;
    amount?: number;
    order_id?: string;
  }) {
    const { school_slug, plan_name, order_id } = data;
    const normalizedPlan = (plan_name || 'PRO_YEARLY').toUpperCase().includes('ENTERPRISE') ? 'ENTERPRISE' : 'PRO_YEARLY';
    return await this.activateSubscription({
      slug: school_slug,
      plan_name: normalizedPlan,
      order_id: order_id || `SIM-${Date.now()}`
    });
  }
}
