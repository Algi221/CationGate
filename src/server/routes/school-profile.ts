import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { adminAuth, requireTenantId } from '../middleware/auth';
import { getCached, setCached, delCached } from '../db/redis';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';

export const schoolProfileRouter = new Hono();

// Helper to validate UUID
const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/**
 * GET /api/school-profile
 * Public / Authenticated fetch for school profile
 */
schoolProfileRouter.get('/', async (c) => {
  try {
    const rawSchoolId = c.req.query('school_id');
    const schoolSlug = c.req.query('school_slug');
    const isBypassCache = Boolean(c.req.query('_t') || c.req.query('t'));

    if (!rawSchoolId && !schoolSlug) {
      return c.json({ success: false, message: 'Parameter school_id atau school_slug wajib disertakan.' }, 400);
    }

    const targetIdentifier = schoolSlug || rawSchoolId!;
    let resolvedUUID: string | null = null;
    if (isValidUUID(targetIdentifier)) {
      resolvedUUID = targetIdentifier;
    } else {
      resolvedUUID = await resolveSchoolUUID(targetIdentifier, fontInMemSchools);
    }

    const cacheKey = resolvedUUID ? `school_profile_${resolvedUUID}` : `school_profile_${schoolSlug || rawSchoolId}`;

    if (!isBypassCache) {
      const cached = await getCached<Record<string, unknown>>(cacheKey);
      if (cached) {
        return c.json({ success: true, data: cached, source: 'cache' });
      }
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    let profileData: Record<string, unknown> | null = null;

    // 1. Query school_profiles table by UUID or Identifier
    const matchIds = [resolvedUUID, targetIdentifier, schoolSlug, rawSchoolId].filter(Boolean) as string[];

    try {
      const { data, error } = await supabase
        .from('school_profiles')
        .select('*')
        .in('school_id', matchIds)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        profileData = data;
      }
    } catch (_sbErr) {}

    // Pool fallback
    if (!profileData) {
      try {
        const pgRes = await pool.query(
          `SELECT * FROM school_profiles WHERE school_id = ANY($1::text[]) ORDER BY updated_at DESC LIMIT 1`,
          [matchIds]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          profileData = pgRes.rows[0];
        }
      } catch (_pgErr) {}
    }

    // 2. If not found in school_profiles, auto-seed from schools + legacy landing_page_config
    if (!profileData) {
      let saasSchool: Record<string, unknown> | null = null;
      try {
        const { data: sch } = await supabase
          .from('schools')
          .select('*')
          .or(`id.eq.${isValidUUID(resolvedUUID || '') ? resolvedUUID : '00000000-0000-0000-0000-000000000000'},slug.eq.${schoolSlug || targetIdentifier}`)
          .maybeSingle();
        if (sch) saasSchool = sch;
      } catch (_) {}

      // Check legacy config
      let legacyProfil: Record<string, unknown> | null = null;
      try {
        const { data: cfg } = await supabase
          .from('landing_page_config')
          .select('config_value')
          .in('school_id', matchIds)
          .eq('config_key', 'ppdb_profil_sekolah')
          .maybeSingle();

        if (cfg?.config_value) {
          let val = cfg.config_value;
          if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
            try { val = JSON.parse(val); } catch (_) {}
          }
          if (val && typeof val === 'object') legacyProfil = val as Record<string, unknown>;
        }
      } catch (_) {}

      const legacyIdentitas = (legacyProfil?.identitas as Record<string, unknown>) || {};
      const legacyVisiMisi = (legacyProfil?.visi_misi as Record<string, unknown>) || {};
      const legacyPimpinan = (legacyProfil?.pimpinan as Record<string, unknown>) || {};

      const defaultSchoolName = String(saasSchool?.name || legacyIdentitas.nama || (schoolSlug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : 'Institusi Pendidikan'));

      profileData = {
        school_id: resolvedUUID || targetIdentifier,
        nama: defaultSchoolName,
        npsn: String(saasSchool?.npsn || legacyIdentitas.npsn || (schoolSlug === 'smktarunabhakti' ? '20229182' : '')),
        akreditasi: String(saasSchool?.accreditation || legacyIdentitas.akreditasi || (schoolSlug === 'smktarunabhakti' ? 'A (Unggul)' : '-')),
        status: String(legacyIdentitas.status || 'Swasta'),
        kurikulum: String(legacyIdentitas.kurikulum || 'Kurikulum Merdeka'),
        tahun_berdiri: String(legacyIdentitas.tahun_berdiri || (schoolSlug === 'smktarunabhakti' ? '1998' : '')),
        nis: String(legacyIdentitas.nis || ''),
        nss: String(legacyIdentitas.nss || ''),
        alamat: String(saasSchool?.address || legacyIdentitas.alamat || (schoolSlug === 'smktarunabhakti' ? 'Jl. Pekapuran RT 02/06 Curug, Cimanggis, Kota Depok' : '')),
        telepon: String(saasSchool?.phone || legacyIdentitas.telepon || ''),
        email: String(saasSchool?.official_email || legacyIdentitas.email || ''),
        logo_url: String(saasSchool?.logo_url || legacyProfil?.logo_url || ''),
        hero_image: String(legacyProfil?.hero_image || ''),
        video_profil_url: String(legacyProfil?.video_profil_url || ''),
        sejarah: String(legacyProfil?.sejarah || `${defaultSchoolName} merupakan institusi pendidikan terdepan yang didirikan dengan komitmen tinggi dalam mencerdaskan kehidupan bangsa.`),
        ringkasan: String(legacyProfil?.ringkasan || ''),
        visi: String(legacyVisiMisi.visi || legacyProfil?.visi || `Menjadi institusi pendidikan yang unggul, berkarakter, dan berdaya saing global.`),
        misi: String(legacyVisiMisi.misi || legacyProfil?.misi || `1. Menyelenggarakan proses pembelajaran yang inovatif dan relevan.\n2. Membangun integritas dan kepemimpinan berakhlak mulia.`),
        tujuan: String(legacyProfil?.tujuan || `1. Menghasilkan lulusan yang kompeten.\n2. Mewujudkan tata kelola institusi yang transparan dan akuntabel.`),
        pimpinan: legacyPimpinan.nama ? legacyPimpinan : {
          nama: String(saasSchool?.admin_name || 'Kepala Sekolah'),
          jabatan: 'Kepala Sekolah',
          sambutan: 'Selamat datang di portal resmi institusi pendidikan kami.',
          foto: ''
        },
        fasilitas: Array.isArray(legacyProfil?.fasilitas) ? legacyProfil?.fasilitas : [],
        sosial_media: legacyProfil?.sosial_media && typeof legacyProfil.sosial_media === 'object' ? legacyProfil.sosial_media : {
          instagram: '',
          youtube: '',
          facebook: '',
          tiktok: ''
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Background persist to school_profiles so future queries are instant
      try {
        await supabase.from('school_profiles').upsert(profileData, { onConflict: 'school_id' });
      } catch (_) {
        try {
          await pool.query(
            `INSERT INTO school_profiles (school_id, nama, npsn, akreditasi, status, kurikulum, tahun_berdiri, nis, nss, alamat, telepon, email, logo_url, hero_image, video_profil_url, sejarah, ringkasan, visi, misi, tujuan, pimpinan, fasilitas, sosial_media, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), NOW())
             ON CONFLICT (school_id) DO NOTHING`,
            [
              profileData.school_id, profileData.nama, profileData.npsn, profileData.akreditasi, profileData.status,
              profileData.kurikulum, profileData.tahun_berdiri, profileData.nis, profileData.nss, profileData.alamat,
              profileData.telepon, profileData.email, profileData.logo_url, profileData.hero_image, profileData.video_profil_url,
              profileData.sejarah, profileData.ringkasan, profileData.visi, profileData.misi, profileData.tujuan,
              JSON.stringify(profileData.pimpinan), JSON.stringify(profileData.fasilitas), JSON.stringify(profileData.sosial_media)
            ]
          );
        } catch (_) {}
      }
    }

    // Format structured response for frontend
    const structuredData = {
      ...profileData,
      identitas: {
        nama: profileData.nama || '',
        npsn: profileData.npsn || '',
        akreditasi: profileData.akreditasi || '',
        status: profileData.status || 'Swasta',
        kurikulum: profileData.kurikulum || 'Kurikulum Merdeka',
        tahun_berdiri: profileData.tahun_berdiri || '',
        nis: profileData.nis || '',
        nss: profileData.nss || '',
        alamat: profileData.alamat || '',
        telepon: profileData.telepon || '',
        email: profileData.email || ''
      },
      visi_misi: {
        visi: profileData.visi || '',
        misi: profileData.misi || ''
      }
    };

    await setCached(cacheKey, structuredData, 3600);
    if (schoolSlug) await setCached(`school_profile_${schoolSlug}`, structuredData, 3600);

    return c.json({
      success: true,
      data: structuredData,
      source: 'db'
    });
  } catch (err: unknown) {
    console.error('Error fetching school profile:', err);
    return c.json({ success: false, message: 'Gagal mengambil data profil sekolah.' }, 500);
  }
});

/**
 * PUT /api/school-profile
 * Protected Admin endpoint to update school profile and identity
 */
schoolProfileRouter.put('/', adminAuth, async (c) => {
  try {
    const schoolId = await requireTenantId(c);
    const body = await c.req.json();
    const supabase = getSupabaseClient(c.req.header('Authorization'));

    const {
      identitas = {},
      sejarah = '',
      ringkasan = '',
      video_profil_url = '',
      hero_image = '',
      logo_url = '',
      pimpinan = {},
      visi_misi = {},
      visi = '',
      misi = '',
      tujuan = '',
      fasilitas = [],
      sosial_media = {}
    } = body;

    const resolvedVisi = visi_misi?.visi || visi || '';
    const resolvedMisi = visi_misi?.misi || misi || '';

    const payload = {
      school_id: String(schoolId),
      nama: identitas.nama || body.nama || '',
      npsn: identitas.npsn || body.npsn || '',
      akreditasi: identitas.akreditasi || body.akreditasi || '',
      status: identitas.status || body.status || 'Swasta',
      kurikulum: identitas.kurikulum || body.kurikulum || 'Kurikulum Merdeka',
      tahun_berdiri: identitas.tahun_berdiri || body.tahun_berdiri || '',
      nis: identitas.nis || body.nis || '',
      nss: identitas.nss || body.nss || '',
      alamat: identitas.alamat || body.alamat || '',
      telepon: identitas.telepon || body.telepon || '',
      email: identitas.email || body.email || '',
      logo_url: logo_url || identitas.logo_url || body.logo_url || '',
      hero_image: hero_image || body.hero_image || '',
      video_profil_url: video_profil_url || body.video_profil_url || '',
      sejarah: sejarah || body.sejarah || '',
      ringkasan: ringkasan || body.ringkasan || '',
      visi: resolvedVisi,
      misi: resolvedMisi,
      tujuan: tujuan || body.tujuan || '',
      pimpinan: typeof pimpinan === 'object' ? pimpinan : {},
      fasilitas: Array.isArray(fasilitas) ? fasilitas : [],
      sosial_media: typeof sosial_media === 'object' ? sosial_media : {},
      updated_at: new Date().toISOString()
    };

    // 1. Upsert into school_profiles table
    let saved = false;
    try {
      const { error: sbErr } = await supabase
        .from('school_profiles')
        .upsert(payload, { onConflict: 'school_id' });
      if (!sbErr) saved = true;
    } catch (_) {}

    if (!saved) {
      try {
        await pool.query(
          `INSERT INTO school_profiles (
            school_id, nama, npsn, akreditasi, status, kurikulum, tahun_berdiri,
            nis, nss, alamat, telepon, email, logo_url, hero_image, video_profil_url,
            sejarah, ringkasan, visi, misi, tujuan, pimpinan, fasilitas, sosial_media, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW()
          ) ON CONFLICT (school_id) DO UPDATE SET
            nama = EXCLUDED.nama,
            npsn = EXCLUDED.npsn,
            akreditasi = EXCLUDED.akreditasi,
            status = EXCLUDED.status,
            kurikulum = EXCLUDED.kurikulum,
            tahun_berdiri = EXCLUDED.tahun_berdiri,
            nis = EXCLUDED.nis,
            nss = EXCLUDED.nss,
            alamat = EXCLUDED.alamat,
            telepon = EXCLUDED.telepon,
            email = EXCLUDED.email,
            logo_url = EXCLUDED.logo_url,
            hero_image = EXCLUDED.hero_image,
            video_profil_url = EXCLUDED.video_profil_url,
            sejarah = EXCLUDED.sejarah,
            ringkasan = EXCLUDED.ringkasan,
            visi = EXCLUDED.visi,
            misi = EXCLUDED.misi,
            tujuan = EXCLUDED.tujuan,
            pimpinan = EXCLUDED.pimpinan,
            fasilitas = EXCLUDED.fasilitas,
            sosial_media = EXCLUDED.sosial_media,
            updated_at = NOW()`,
          [
            payload.school_id, payload.nama, payload.npsn, payload.akreditasi, payload.status,
            payload.kurikulum, payload.tahun_berdiri, payload.nis, payload.nss, payload.alamat,
            payload.telepon, payload.email, payload.logo_url, payload.hero_image, payload.video_profil_url,
            payload.sejarah, payload.ringkasan, payload.visi, payload.misi, payload.tujuan,
            JSON.stringify(payload.pimpinan), JSON.stringify(payload.fasilitas), JSON.stringify(payload.sosial_media)
          ]
        );
        saved = true;
      } catch (pgErr) {
        console.error('Direct pool query failed for school_profiles:', pgErr);
      }
    }

    // 2. Also keep schools table metadata in sync
    try {
      const updateSchools: Record<string, unknown> = {};
      if (payload.nama) updateSchools.name = payload.nama;
      if (payload.logo_url) updateSchools.logo_url = payload.logo_url;
      if (payload.alamat) updateSchools.address = payload.alamat;
      if (payload.telepon) updateSchools.phone = payload.telepon;
      if (payload.email) updateSchools.official_email = payload.email;
      if (payload.npsn) updateSchools.npsn = payload.npsn;
      if (payload.akreditasi) updateSchools.accreditation = payload.akreditasi;

      if (Object.keys(updateSchools).length > 0) {
        if (isValidUUID(String(schoolId))) {
          await supabase.from('schools').update(updateSchools).eq('id', schoolId);
        } else {
          await supabase.from('schools').update(updateSchools).eq('slug', schoolId);
        }
      }
    } catch (_) {}

    // 3. Invalidate Redis Caches
    const schoolSlug = (c.req.query('school_slug') || c.req.header('x-school-slug') || '') as string;
    await delCached(`school_profile_${schoolId}`);
    if (schoolSlug) {
      await delCached(`school_profile_${schoolSlug}`);
      await delCached(`config_${schoolSlug}`);
      await delCached(`school:${schoolSlug}`);
    }
    await delCached(`config_${schoolId}`);
    await delCached(`school:${schoolId}`);

    return c.json({
      success: true,
      message: 'Profil dan identitas sekolah berhasil disimpan secara permanen!',
      data: payload
    });
  } catch (err: unknown) {
    console.error('Error saving school profile:', err);
    return c.json({ success: false, message: err instanceof Error ? err.message : 'Gagal menyimpan profil sekolah.' }, 500);
  }
});
