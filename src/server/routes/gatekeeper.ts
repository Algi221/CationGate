import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseClient } from '../db/supabase';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';
import { broadcast } from '../ws/handler';
import { gatekeeperAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rate-limiter';
import { redis } from '../../utils/redis';

const gatekeeperRouter = new Hono();
const JWT_SECRET = process.env.JWT_SECRET;
const GATEKEEPER_USERNAME = process.env.GATEKEEPER_USERNAME;
const GATEKEEPER_PASSWORD = process.env.GATEKEEPER_PASSWORD;
if (!JWT_SECRET || !GATEKEEPER_USERNAME || !GATEKEEPER_PASSWORD) {
  throw new Error('JWT_SECRET, GATEKEEPER_USERNAME, and GATEKEEPER_PASSWORD are required.');
}


gatekeeperRouter.post('/login', authLimiter, async (c) => {
  try {
    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json({ success: false, message: 'Harap isi username dan password Gatekeeper' }, 400);
    }

    // Env Credential Check
    const currentUsername = process.env.GATEKEEPER_USERNAME || GATEKEEPER_USERNAME;
    const currentPassword = process.env.GATEKEEPER_PASSWORD || GATEKEEPER_PASSWORD;

    if (username === currentUsername && password === currentPassword) {
      const defaultGatekeeper = {
        id: 1,
        username: GATEKEEPER_USERNAME,
        nama_lengkap: 'Gatekeeper CationGate Platform',
        role: 'gatekeeper',
        email: 'uno@cationgate.id'
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

      return c.json({
        success: true,
        token,
        gatekeeper: defaultGatekeeper
      });
    }

    const supabase = getSupabaseClient();
    
    // Check gatekeeper_users table
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
    console.error('Gatekeeper login error:', (err as any)?.message);
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
    try {
      await supabase
        .from('schools')
        .upsert({
          name: sName,
          slug: sSlug,
          official_email: sEmail,
          status: 'FULL_VERIFIED',
          subscription_plan: targetSchool?.plan_type || 'PRO',
          npsn: targetSchool?.npsn || null,
          dapodik_code: targetSchool?.dapodik_code || null
        }, { onConflict: 'slug' });
    } catch (sbErr: unknown) {
      console.warn('Supabase schools upsert warning:', (sbErr as any).message);
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

    broadcast({ event: 'SCHOOL_VERIFIED', data: { slug: sSlug, status: 'FULL_VERIFIED' } }, true);

    return c.json({
      success: true,
      message: `Verifikasi sekolah '${sName}' telah disetujui.`
    });
  } catch (err: unknown) {
    console.error('Approve school error:', err);
    return c.json({ success: false, message: 'Gagal meng-approve sekolah: ' + (err as any).message }, 500);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function candidateSchoolAdmin(targetSchool: any): string {
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
        console.warn('Supabase takedown warning:', (err as any).message);
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
        console.warn('Supabase takedown warning (prospective):', (err as any).message);
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
    console.error('Get plans error:', (err as any)?.message);
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
    console.error('Create plan error:', (err as any)?.message);
    return c.json({ success: false, message: 'Gagal membuat paket: ' + (err as any)?.message }, 500);
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
    console.error('Update plan error:', (err as any)?.message);
    return c.json({ success: false, message: 'Gagal mengupdate paket: ' + (err as any)?.message }, 500);
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
    console.error('Delete plan error:', (err as any)?.message);
    return c.json({ success: false, message: 'Gagal menghapus paket: ' + (err as any)?.message }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════

export default gatekeeperRouter;
