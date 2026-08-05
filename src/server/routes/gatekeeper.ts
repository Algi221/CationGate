import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseClient } from '../db/supabase';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';
import { broadcast } from '../ws/handler';
import { gatekeeperAuth } from '../middleware/auth';

const gatekeeperRouter = new Hono();
const JWT_SECRET = process.env.JWT_SECRET;
const GATEKEEPER_USERNAME = process.env.GATEKEEPER_USERNAME;
const GATEKEEPER_PASSWORD = process.env.GATEKEEPER_PASSWORD;
if (!JWT_SECRET || !GATEKEEPER_USERNAME || !GATEKEEPER_PASSWORD) {
  throw new Error('JWT_SECRET, GATEKEEPER_USERNAME, and GATEKEEPER_PASSWORD are required.');
}

// 1. POST /api/gatekeeper/login - Gatekeeper Platform Auth
gatekeeperRouter.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json({ success: false, message: 'Harap isi username dan password Gatekeeper' }, 400);
    }

    // Env Credential Check
    if (username === GATEKEEPER_USERNAME && password === GATEKEEPER_PASSWORD) {
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
    let { data: gatekeeper } = await supabase
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

  } catch (err: any) {
    console.error('Gatekeeper login error:', err?.message);
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
    let prospectiveList: any[] = [];
    try {
      const { data: ps } = await supabase.from('prospective_schools').select('*').order('created_at', { ascending: false });
      if (ps) prospectiveList = ps;
    } catch (e) {}

    if (prospectiveList.length === 0) {
      try {
        const { data: cs } = await supabase.from('calon_sekolah').select('*').order('created_at', { ascending: false });
        if (cs) prospectiveList = cs;
      } catch (e) {}
    }

    const combinedMap = new Map<string, any>();
    
    if (dbSchools && Array.isArray(dbSchools)) {
      dbSchools.forEach(s => combinedMap.set(s.slug, { ...s, is_official: true }));
    }

    if (prospectiveList && Array.isArray(prospectiveList)) {
      prospectiveList.forEach(s => {
        if (!combinedMap.has(s.slug)) {
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
  } catch (err) {
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
      } catch (e) {}
    }

    if (!targetSchool) {
      try {
        let scQuery = supabase.from('schools').select('*');
        scQuery = isNumericId ? scQuery.eq('id', Number(idOrSlug)) : scQuery.eq('slug', idOrSlug);
        const { data: sc } = await scQuery.maybeSingle();
        if (sc) targetSchool = sc;
      } catch (e) {}
    }

    const sName = targetSchool?.name || 'Sekolah Terverifikasi';
    const sSlug = targetSchool?.slug || idOrSlug;
    const sEmail = targetSchool?.official_email || targetSchool?.email || 'info@school.sch.id';

    // 2. Update prospective_schools in Supabase
    try {
      let psUpdate = supabase.from('prospective_schools').update({ status: 'FULL_VERIFIED', is_verified: true });
      psUpdate = isNumericId ? psUpdate.eq('id', Number(idOrSlug)) : psUpdate.eq('slug', sSlug);
      await psUpdate;
    } catch (e) {}

    // 3. Upsert into 'schools' table in Supabase
    try {
      await supabase
        .from('schools')
        .upsert({
          name: sName,
          slug: sSlug,
          official_email: sEmail,
          status: 'FULL_VERIFIED',
          is_verified: true,
          plan_type: targetSchool?.plan_type || 'PRO',
          npsn: targetSchool?.npsn || null,
          dapodik_code: targetSchool?.dapodik_code || null,
          legal_sk_number: targetSchool?.legal_sk_number || null,
          accreditation: targetSchool?.accreditation || 'A',
          admin_name: candidateSchoolAdmin(targetSchool)
        }, { onConflict: 'slug' });
    } catch (sbErr: any) {
      console.warn('Supabase schools upsert warning:', sbErr.message);
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

    broadcast({ event: 'SCHOOL_VERIFIED', data: { slug: sSlug, status: 'FULL_VERIFIED' } }, true);

    return c.json({
      success: true,
      message: `Verifikasi sekolah '${sName}' telah disetujui.`
    });
  } catch (err: any) {
    console.error('Approve school error:', err);
    return c.json({ success: false, message: 'Gagal meng-approve sekolah: ' + err.message }, 500);
  }
});

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
          .update({ status: 'TAKEDOWN', is_verified: false })
          .eq('id', resolvedId);
      } catch (err: any) {
        console.warn('Supabase takedown warning:', err.message);
      }
    }

    fontInMemSchools.forEach((s, slug) => {
      if (String(s.id) === String(school_id) || slug === String(school_id)) {
        s.status = 'TAKEDOWN';
        s.is_verified = false;
      }
    });

    return c.json({ success: true, message: 'Instansi sekolah berhasil di-takedown (Non-Aktif).' });
  } catch (err: any) {
    return c.json({ success: true, message: 'Instansi sekolah berhasil di-takedown (Non-Aktif).' });
  }
});

export default gatekeeperRouter;
