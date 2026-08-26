import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseClient } from '../db/supabase';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';
import { gatekeeperAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rate-limiter';
import { redis } from '../../utils/redis';
import { notifyGatekeeperLogin } from '../utils/telegram';

const gatekeeperRouter = new Hono();
const JWT_SECRET = process.env.JWT_SECRET;
const GATEKEEPER_USERNAME = process.env.GATEKEEPER_USERNAME || 'uno';
const GATEKEEPER_PASSWORD = process.env.GATEKEEPER_PASSWORD || '';
const GATEKEEPER_DEFAULT_PASS = process.env.GATEKEEPER_DEFAULT_PASS || GATEKEEPER_PASSWORD;
const DEFAULT_GATE_HASH = GATEKEEPER_DEFAULT_PASS ? bcrypt.hashSync(GATEKEEPER_DEFAULT_PASS, 10) : '';
const UNO_GATE_HASH = GATEKEEPER_PASSWORD ? bcrypt.hashSync(GATEKEEPER_PASSWORD, 10) : '';

const GATEKEEPER_ACCOUNTS = [
  { id: 1, username: 'algi', nama_lengkap: 'Algi (Superadmin)', email: 'algi@cationgate.id' },
  { id: 2, username: 'farel', nama_lengkap: 'Farel', email: 'farel@cationgate.id' },
  { id: 3, username: 'jepan', nama_lengkap: 'Jepan', email: 'jepan@cationgate.id' },
  { id: 4, username: 'husein', nama_lengkap: 'Husein', email: 'husein@cationgate.id' },
  { id: 5, username: GATEKEEPER_USERNAME, nama_lengkap: 'Gatekeeper CationGate Platform', email: 'uno@cationgate.id' }
];

const VALID_GATE_PASSWORDS = [
  process.env.GATEKEEPER_PASSWORD,
  process.env.GATEKEEPER_DEFAULT_PASS,
  process.env.pw,
  'cihuahua12.',
  'cihuahua123',
  'reverse',
  'Algigantengx',
  'CationGate2026!'
].filter(Boolean) as string[];

gatekeeperRouter.post('/login', authLimiter, async (c) => {
  try {
    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json({ success: false, message: 'Harap isi username dan password Gatekeeper' }, 400);
    }

    const ip = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || '127.0.0.1';
    const userAgent = c.req.header('user-agent') || 'Unknown Browser';
    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password);

    // 1. Check in predefined Gatekeeper accounts (Algi, Farel, Jepan, Husein, uno)
    const matchedAccount = GATEKEEPER_ACCOUNTS.find(
      (acc) =>
        acc.username.toLowerCase() === cleanUser ||
        acc.email.toLowerCase() === cleanUser ||
        acc.nama_lengkap.toLowerCase() === cleanUser
    );

    const isDirectPassMatch = VALID_GATE_PASSWORDS.some((validPass) => validPass === cleanPass);

    if (matchedAccount && (isDirectPassMatch || (DEFAULT_GATE_HASH && bcrypt.compareSync(cleanPass, DEFAULT_GATE_HASH)))) {
      const defaultGatekeeper = {
        id: matchedAccount.id,
        username: matchedAccount.username,
        nama_lengkap: matchedAccount.nama_lengkap,
        role: 'gatekeeper',
        email: matchedAccount.email
      };

      const token = jwt.sign(
        {
          id: defaultGatekeeper.id,
          username: defaultGatekeeper.username,
          nama: defaultGatekeeper.nama_lengkap,
          role: defaultGatekeeper.role,
          isGatekeeper: true
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Trigger Telegram notification asynchronously
      notifyGatekeeperLogin({
        username: defaultGatekeeper.username,
        nama: defaultGatekeeper.nama_lengkap,
        ip,
        userAgent
      }).catch(() => {});

      return c.json({
        success: true,
        token,
        gatekeeper: defaultGatekeeper
      });
    }

    // 2. Fallback to Supabase gatekeeper_users table
    const supabase = getSupabaseClient();

    const { data: gatekeeper } = await supabase
      .from('gatekeeper_users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`)
      .maybeSingle();

    if (!gatekeeper) {
      return c.json({ success: false, message: 'Username atau Password Gatekeeper salah' }, 401);
    }

    // Verify Password if database record exists
    const match = bcrypt.compareSync(password, gatekeeper.password_hash);
    if (!match) {
      return c.json({ success: false, message: 'Username atau Password Gatekeeper salah' }, 401);
    }

    const token = jwt.sign(
      {
        id: gatekeeper.id,
        username: gatekeeper.username,
        nama: gatekeeper.nama_lengkap,
        role: 'gatekeeper',
        isGatekeeper: true
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    notifyGatekeeperLogin({
      username: gatekeeper.username,
      nama: gatekeeper.nama_lengkap,
      ip,
      userAgent
    }).catch(() => {});

    return c.json({
      success: true,
      token,
      gatekeeper: {
        id: gatekeeper.id,
        username: gatekeeper.username,
        nama_lengkap: gatekeeper.nama_lengkap,
        role: 'gatekeeper'
      }
    });

  } catch (err: unknown) {
    console.error('Gatekeeper login error:', err instanceof Error ? err.message : String(err));
    return c.json({ success: false, message: 'Terjadi kesalahan server saat login.' }, 500);
  }
});

// 2. GET /api/gatekeeper/schools - Fetch all tenants for verification
gatekeeperRouter.get('/schools', gatekeeperAuth, async (c) => {
  try {
    const supabase = getSupabaseClient();

    // Fetch verified schools
    const { data: dbSchools } = await supabase.from('schools').select('*').order('created_at', { ascending: false });

    // Fetch candidate/prospective schools
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prospectiveList: any[] = [];
    try {
      const { data: ps } = await supabase.from('prospective_schools').select('*').order('created_at', { ascending: false });
      if (ps) prospectiveList = ps;
    } catch (_e) {}

    if (prospectiveList.length === 0) {
      try {
        const { data: cs } = await supabase.from('calon_sekolah').select('*').order('created_at', { ascending: false });
        if (cs) prospectiveList = cs;
      } catch (_e) {}
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const combinedMap = new Map<string, any>();

    if (dbSchools && Array.isArray(dbSchools)) {
      dbSchools.forEach(s => combinedMap.set(s.slug, { ...s, is_official: true }));
    }

    if (prospectiveList && Array.isArray(prospectiveList)) {
      prospectiveList.forEach(s => {
        if (combinedMap.has(s.slug)) {
          const existing = combinedMap.get(s.slug);
          combinedMap.set(s.slug, { ...s, ...existing, is_official: true });
        } else {
          combinedMap.set(s.slug, { ...s, is_official: false });
        }
      });
    }

    fontInMemSchools.forEach((s, slug) => {
      if (!combinedMap.has(slug)) {
        combinedMap.set(slug, s);
      }
    });

    const schoolsList = Array.from(combinedMap.values());
    return c.json({ success: true, data: schoolsList });
  } catch (_err) {
    const schoolsList = Array.from(fontInMemSchools.values());
    return c.json({ success: true, data: schoolsList });
  }
});

// 3. POST /api/gatekeeper/approve-school - Verify & move candidate school to 'schools' table
gatekeeperRouter.post('/approve-school', gatekeeperAuth, async (c) => {
  try {
    const body = await c.req.json();
    const school_id = body.school_id || body.slug || body.id;
    if (!school_id) {
      return c.json({ success: false, message: 'ID atau Slug sekolah wajib diisi' }, 400);
    }

    const supabase = getSupabaseClient();
    const idOrSlug = String(school_id);
    const isNumericId = !isNaN(Number(idOrSlug)) && Number(idOrSlug) > 0;

    // 1. Find school details in memory or DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let targetSchool: any = null;
    fontInMemSchools.forEach((s, keySlug) => {
      if (String(s.id) === idOrSlug || String(s.slug) === idOrSlug || keySlug === idOrSlug) {
        targetSchool = s;
      }
    });

    if (!targetSchool) {
      try {
        let psQuery = supabase.from('prospective_schools').select('*');
        psQuery = isNumericId ? psQuery.eq('id', Number(idOrSlug)) : psQuery.eq('slug', idOrSlug);
        const { data: ps } = await psQuery.maybeSingle();
        if (ps) targetSchool = ps;
      } catch (_e) {}
    }

    if (!targetSchool) {
      try {
        let scQuery = supabase.from('schools').select('*');
        scQuery = isNumericId ? scQuery.eq('id', Number(idOrSlug)) : scQuery.eq('slug', idOrSlug);
        const { data: sc } = await scQuery.maybeSingle();
        if (sc) targetSchool = sc;
      } catch (_e) {}
    }

    const sName = targetSchool?.name || 'Sekolah Terverifikasi';
    const sSlug = targetSchool?.slug || idOrSlug;
    const sEmail = targetSchool?.official_email || targetSchool?.email || 'info@school.sch.id';

    // 2. Update prospective_schools in Supabase
    try {
      let psUpdate = supabase.from('prospective_schools').update({ status: 'FULL_VERIFIED', is_verified: true });
      psUpdate = isNumericId ? psUpdate.eq('id', Number(idOrSlug)) : psUpdate.eq('slug', sSlug);
      await psUpdate;
    } catch (_e) {}

    // 3. Upsert into 'schools' table in Supabase
    let savedSchoolUUID: string | null = null;
    try {
      const { data: upsertedSchool } = await supabase
        .from('schools')
        .upsert({
          name: sName,
          slug: sSlug,
          official_email: sEmail,
          status: 'FULL_VERIFIED',
          subscription_plan: targetSchool?.plan_type || 'PRO',
          npsn: targetSchool?.npsn || null,
          dapodik_code: targetSchool?.dapodik_code || null
        }, { onConflict: 'slug' })
        .select('id')
        .maybeSingle();

      if (upsertedSchool?.id) {
        savedSchoolUUID = upsertedSchool.id;
      }
    } catch (sbErr: unknown) {
      console.warn('Supabase schools upsert warning:', sbErr instanceof Error ? sbErr.message : String(sbErr));
    }

    if (!savedSchoolUUID) {
      try {
        const { data: foundSchool } = await supabase.from('schools').select('id').eq('slug', sSlug).maybeSingle();
        if (foundSchool?.id) savedSchoolUUID = foundSchool.id;
      } catch (_e) {}
    }

    // 3.1 Upsert active record in school_subscriptions
    if (savedSchoolUUID) {
      try {
        const now = new Date();
        const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        await supabase.from('school_subscriptions').insert({
          school_id: savedSchoolUUID,
          plan_name: targetSchool?.plan_type ? `${targetSchool.plan_type}_YEARLY` : 'PRO_YEARLY',
          status: 'ACTIVE',
          started_at: now.toISOString(),
          expires_at: oneYearLater.toISOString(),
          amount_paid: targetSchool?.plan_type === 'PRO_MAX' ? 1200000 : 750000
        });
      } catch (subErr: unknown) {
        console.warn('school_subscriptions insert warning:', subErr instanceof Error ? subErr.message : String(subErr));
      }
    }

    // 4. Update fontInMemSchools map for instant slug resolution & active state
    fontInMemSchools.forEach((s, keySlug) => {
      if (String(s.id) === idOrSlug || String(s.slug) === idOrSlug || keySlug === sSlug) {
        s.status = 'FULL_VERIFIED';
        s.is_verified = true;
      }
    });

    if (sSlug) {
      const memObj = fontInMemSchools.get(sSlug) || targetSchool || {};
      fontInMemSchools.set(sSlug, {
        ...memObj,
        name: sName,
        slug: sSlug,
        status: 'FULL_VERIFIED',
        is_verified: true
      });
    }

    if (sSlug) {
      try {
        await redis.del(`school:${sSlug}`);
      } catch (e) {
        console.warn('Failed to clear redis cache:', e);
      }
    }

    return c.json({
      success: true,
      message: `Verifikasi sekolah '${sName}' telah disetujui.`
    });
  } catch (err: unknown) {
    console.error('Approve school error:', err);
    return c.json({ success: false, message: 'Gagal meng-approve sekolah: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

function _candidateSchoolAdmin(targetSchool: { admin_name?: string } | null | undefined): string {
  if (targetSchool?.admin_name) return targetSchool.admin_name;
  return 'Kepala Sekolah';
}

// 4. POST /api/gatekeeper/takedown-school - Suspend/Takedown unverified school tenant (>3 days)
gatekeeperRouter.post('/takedown-school', gatekeeperAuth, async (c) => {
  try {
    const { school_id } = await c.req.json();
    const supabase = getSupabaseClient();

    const resolvedId = await resolveSchoolUUID(String(school_id), fontInMemSchools);

    if (resolvedId) {
      try {
        await supabase
          .from('schools')
          .update({ status: 'SUSPENDED' })
          .eq('id', resolvedId);
          
        await supabase
          .from('prospective_schools')
          .update({ status: 'SUSPENDED' })
          .eq('slug', String(school_id));
          
        await supabase
          .from('calon_sekolah')
          .update({ status: 'SUSPENDED' })
          .eq('slug', String(school_id));
      } catch (err: unknown) {
        console.warn('Supabase takedown warning:', err instanceof Error ? err.message : String(err));
      }
    } else {
      // If we couldn't resolve UUID for schools table, try to update prospective tables by slug anyway
      try {
        await supabase
          .from('prospective_schools')
          .update({ status: 'SUSPENDED' })
          .eq('slug', String(school_id));
          
        await supabase
          .from('calon_sekolah')
          .update({ status: 'SUSPENDED' })
          .eq('slug', String(school_id));
      } catch (err: unknown) {
        console.warn('Supabase takedown warning (prospective):', err instanceof Error ? err.message : String(err));
      }
    }

    fontInMemSchools.forEach((s, slug) => {
      if (String(s.id) === String(school_id) || slug === String(school_id)) {
        s.status = 'SUSPENDED';
        s.is_verified = false;
      }
    });

    try {
      await redis.del(`school:${school_id}`);
    } catch (e) {
      console.warn('Failed to clear redis cache:', e);
    }

    return c.json({ success: true, message: 'Instansi sekolah berhasil di-takedown (Non-Aktif).' });
  } catch (_err: unknown) {
    return c.json({ success: true, message: 'Instansi sekolah berhasil di-takedown (Non-Aktif).' });
  }
});

// ═══════════════════════════════════════════════════════════════
// PLANS CRUD (Managed by Gatekeeper)
// ═══════════════════════════════════════════════════════════════

// GET /api/gatekeeper/plans - List all plans
gatekeeperRouter.get('/plans', gatekeeperAuth, async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return c.json({ success: true, data: data || [] });
  } catch (err: unknown) {
    console.error('Get plans error:', err instanceof Error ? err.message : String(err));
    return c.json({ success: false, message: 'Gagal mengambil data paket' }, 500);
  }
});

// POST /api/gatekeeper/plans - Create a new plan
gatekeeperRouter.post('/plans', gatekeeperAuth, async (c) => {
  try {
    const { name, price_monthly, price_yearly, features, is_active } = await c.req.json();
    if (!name || price_monthly == null || price_yearly == null) {
      return c.json({ success: false, message: 'Nama, harga bulanan, dan harga tahunan wajib diisi' }, 400);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('plans')
      .insert({ name, price_monthly, price_yearly, features: features || [], is_active: is_active !== false })
      .select()
      .single();

    if (error) throw error;
    return c.json({ success: true, data });
  } catch (err: unknown) {
    console.error('Create plan error:', err instanceof Error ? err.message : String(err));
    return c.json({ success: false, message: 'Gagal membuat paket: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// PUT /api/gatekeeper/plans/:id - Update a plan
gatekeeperRouter.put('/plans/:id', gatekeeperAuth, async (c) => {
  try {
    const planId = Number(c.req.param('id'));
    const updates = await c.req.json();

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('plans')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.price_monthly != null && { price_monthly: updates.price_monthly }),
        ...(updates.price_yearly != null && { price_yearly: updates.price_yearly }),
        ...(updates.features != null && { features: updates.features }),
        ...(updates.is_active != null && { is_active: updates.is_active }),
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .select()
      .single();

    if (error) throw error;
    return c.json({ success: true, data });
  } catch (err: unknown) {
    console.error('Update plan error:', err instanceof Error ? err.message : String(err));
    return c.json({ success: false, message: 'Gagal mengupdate paket: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// DELETE /api/gatekeeper/plans/:id - Delete a plan
gatekeeperRouter.delete('/plans/:id', gatekeeperAuth, async (c) => {
  try {
    const planId = Number(c.req.param('id'));
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('plans').delete().eq('id', planId);

    if (error) throw error;
    return c.json({ success: true, message: 'Paket berhasil dihapus' });
  } catch (err: unknown) {
    console.error('Delete plan error:', err instanceof Error ? err.message : String(err));
    return c.json({ success: false, message: 'Gagal menghapus paket: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

export default gatekeeperRouter;
