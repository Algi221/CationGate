import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { adminAuth } from '../middleware/auth';

const router = new Hono();

// Default demo majors used ONLY for demo mode
const DEMO_DISPLAY_NAMES: Record<string, string> = {
  "Desain Komunikasi Visual": "Desain Komunikasi Visual (DKV)",
  "Teknik Komputer dan Jaringan": "Teknik Komputer dan Jaringan (TKJ)",
  "Rekayasa Perangkat Lunak": "Rekayasa Perangkat Lunak (RPL)",
  "Broadcasting dan Perfilman": "Broadcasting dan Perfilman (BC)",
  "Animasi": "Animasi (ANM)",
  "Teknik Elektronika": "Teknik Elektronika (TE)",
  "Belum Memilih": "Belum Memilih Jurusan / Unassigned"
};

const DEMO_ORDER = [
  "Rekayasa Perangkat Lunak",
  "Teknik Komputer dan Jaringan",
  "Desain Komunikasi Visual",
  "Broadcasting dan Perfilman",
  "Animasi",
  "Teknik Elektronika"
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getTargets(supabase: any, schoolId: string | null, customOrder: string[] = []): Promise<Record<string, number>> {
  const baseTargets: Record<string, number> = {};
  customOrder.forEach((k) => {
    baseTargets[k] = 0;
  });

  if (!schoolId) return baseTargets;

  let resolvedUUID: string | null = null;
  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  if (isUUID(schoolId)) {
    resolvedUUID = schoolId;
  } else {
    try {
      const { resolveSchoolUUID } = await import('../db/resolve-school');
      const { fontInMemSchools } = await import('./saas');
      resolvedUUID = await resolveSchoolUUID(schoolId, fontInMemSchools);
    } catch (_e) {}
  }

  const matchIds = [resolvedUUID, schoolId].filter(Boolean) as string[];

  try {
    const { data } = await supabase
      .from('landing_page_config')
      .select('config_value')
      .in('school_id', matchIds)
      .eq('config_key', 'kuota_targets')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data && data.config_value) {
      const parsed = typeof data.config_value === 'string' ? JSON.parse(data.config_value) : data.config_value;
      return { ...baseTargets, ...parsed };
    }
  } catch (e) {
    console.warn('Gagal membaca kuota_targets dari DB, menggunakan default:', e);
  }

  try {
    const { pool } = await import('../db/client');
    const pgRes = await pool.query(
      `SELECT config_value FROM landing_page_config WHERE school_id::text = ANY($1::text[]) AND config_key = 'kuota_targets' ORDER BY updated_at DESC LIMIT 1`,
      [matchIds]
    );
    if (pgRes.rows && pgRes.rows.length > 0) {
      const rawVal = pgRes.rows[0].config_value;
      const parsed = typeof rawVal === 'string' ? JSON.parse(rawVal) : rawVal;
      return { ...baseTargets, ...parsed };
    }
  } catch (_pgErr) {}

  try {
    const { fontInMemSchools } = await import('./saas');
    for (const id of matchIds) {
      if (fontInMemSchools.has(id)) {
        const inMem = fontInMemSchools.get(id);
        if (inMem?.configs?.kuota_targets) {
          const parsed = typeof inMem.configs.kuota_targets === 'string' ? JSON.parse(inMem.configs.kuota_targets) : inMem.configs.kuota_targets;
          return { ...baseTargets, ...parsed };
        }
      }
    }
  } catch (_memErr) {}

  return baseTargets;
}

router.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;
    const schoolSlug = c.req.query('school_slug') || null;
    const periodeParam = c.req.query('periode') || null;

    const isDemo = schoolSlug === 'demo' || schoolId === 'demo';

    const { resolveAllSchoolIdentifiers } = await import('../db/resolve-school');
    const { fontInMemSchools } = await import('./saas');
    const targetIdentifier = schoolSlug || schoolId || '';
    const allIds = targetIdentifier ? await resolveAllSchoolIdentifiers(targetIdentifier, fontInMemSchools) : [];
    if (schoolId && !allIds.includes(schoolId)) allIds.push(schoolId);

    let order: string[] = [];
    let displayNames: Record<string, string> = {};

    if (isDemo) {
      order = [...DEMO_ORDER];
      displayNames = { ...DEMO_DISPLAY_NAMES };
    } else if (allIds.length > 0) {
      try {
        const { data: majorsData } = await supabase
          .from('landing_page_config')
          .select('config_value')
          .in('school_id', allIds)
          .eq('config_key', 'ppdb_majors_config')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        let majorsList = majorsData?.config_value;
        if (!majorsList) {
          try {
            const { pool } = await import('../db/client');
            const pgRes = await pool.query(
              `SELECT config_value FROM landing_page_config WHERE school_id::text = ANY($1::text[]) AND config_key = 'ppdb_majors_config' ORDER BY updated_at DESC LIMIT 1`,
              [allIds]
            );
            if (pgRes.rows && pgRes.rows.length > 0) {
              majorsList = pgRes.rows[0].config_value;
            }
          } catch (_pgErr) {}
        }

        if (typeof majorsList === 'string') {
          try {
            majorsList = JSON.parse(majorsList);
            if (typeof majorsList === 'string') majorsList = JSON.parse(majorsList);
          } catch (_e) {}
        }

        if (Array.isArray(majorsList) && majorsList.length > 0) {
          majorsList.forEach((m: { title?: string; code?: string; name?: string }) => {
            const name = (m.title || m.name || m.code || '').trim();
            const code = (m.code || '').trim();
            const key = name || code;
            if (key && !order.includes(key)) {
              order.push(key);
              displayNames[key] = code && name && code.toUpperCase() !== name.toUpperCase()
                ? `${name} (${code})`
                : name || code;
            }
          });
        }
      } catch (_e) {}
    }

    let pQuery = supabase.from('student_applicants').select('periode');
    let sQuery = supabase.from('active_students').select('periode');
    if (allIds.length > 0) {
      pQuery = pQuery.in('school_id', allIds);
      sQuery = sQuery.in('school_id', allIds);
    }

    const { data: allPeriodesPendaftar } = await pQuery;
    const { data: allPeriodesAktif } = await sQuery;

    const periodesSet = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allPeriodesPendaftar?.forEach((p: any) => { if (p.periode) periodesSet.add(p.periode); });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allPeriodesAktif?.forEach((p: any) => { if (p.periode) periodesSet.add(p.periode); });
    periodesSet.add('2026-2027');
    const availablePeriodes = Array.from(periodesSet).sort((a, b) => b.localeCompare(a));

    let pendaftarDataQuery = supabase.from('student_applicants').select('jurusan_1');
    let siswaAktifDataQuery = supabase.from('active_students').select('jurusan');

    if (allIds.length > 0) {
      pendaftarDataQuery = pendaftarDataQuery.in('school_id', allIds);
      siswaAktifDataQuery = siswaAktifDataQuery.in('school_id', allIds);
    }
    if (periodeParam) {
      pendaftarDataQuery = pendaftarDataQuery.eq('periode', periodeParam);
      siswaAktifDataQuery = siswaAktifDataQuery.eq('periode', periodeParam);
    }

    const { data: pendaftarRows } = await pendaftarDataQuery;
    const { data: siswaAktifRows } = await siswaAktifDataQuery;

    const TARGETS = await getTargets(supabase, schoolId || (allIds[0] ?? null), order);

    const matchMajorKey = (raw: string): string => {
      if (!raw || raw === 'Belum Memilih') return 'Belum Memilih';
      const clean = raw.trim();
      if (order.includes(clean)) return clean;
      const cleanUpper = clean.toUpperCase();
      for (const key of order) {
        const keyUpper = key.toUpperCase();
        const dispUpper = (displayNames[key] || '').toUpperCase();
        if (cleanUpper === keyUpper || cleanUpper === dispUpper) return key;
        if (cleanUpper.includes(keyUpper) || keyUpper.includes(cleanUpper)) return key;
      }
      return 'Belum Memilih';
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processRows = (rows: any[], keyProp: string) => {
      const counts: Record<string, number> = {};
      order.forEach((k) => { counts[k] = 0; });
      let unassignedCount = 0;

      rows?.forEach((r) => {
        const rawVal = r[keyProp];
        const matched = matchMajorKey(rawVal);
        if (matched !== 'Belum Memilih' && counts[matched] !== undefined) {
          counts[matched] += 1;
        } else {
          unassignedCount += 1;
        }
      });

      const items = order.map((key, index) => {
        const jumlah = counts[key] || 0;
        const target = TARGETS[key] || 0;
        const presentase = target > 0 ? Math.round((jumlah / target) * 100) : 0;
        return {
          no: index + 1,
          key,
          konsentrasi_keahlian: displayNames[key] || key,
          jumlah,
          target,
          presentase: `${presentase}%`
        };
      });

      if (unassignedCount > 0 && order.length === 0) {
        items.push({
          no: items.length + 1,
          key: 'Belum Memilih',
          konsentrasi_keahlian: 'Belum Memilih Jurusan',
          jumlah: unassignedCount,
          target: 0,
          presentase: '0%'
        });
      }

      return items;
    };

    const dataPendaftar = processRows(pendaftarRows || [], 'jurusan_1');
    const dataSiswaAktif = processRows(siswaAktifRows || [], 'jurusan');

    const totalTarget = order.reduce((acc, k) => acc + (TARGETS[k] || 0), 0);
    const totalPendaftarJumlah = dataPendaftar.reduce((acc, item) => acc + item.jumlah, 0);
    const totalSiswaAktifJumlah = dataSiswaAktif.reduce((acc, item) => acc + item.jumlah, 0);

    return c.json({
      success: true,
      data: {
        available_periodes: availablePeriodes,
        selected_periode: periodeParam || availablePeriodes[0] || '2026-2027',
        targets: TARGETS,
        pendaftar: {
          items: dataPendaftar,
          total: {
            jumlah: totalPendaftarJumlah,
            target: totalTarget,
            presentase: totalTarget > 0 ? `${Math.round((totalPendaftarJumlah / totalTarget) * 100)}%` : "0%"
          }
        },
        siswa_aktif: {
          items: dataSiswaAktif,
          total: {
            jumlah: totalSiswaAktifJumlah,
            target: totalTarget,
            presentase: totalTarget > 0 ? `${Math.round((totalSiswaAktifJumlah / totalTarget) * 100)}%` : "0%"
          }
        }
      }
    });
  } catch (error: unknown) {
    console.error('Error calculating kuota:', error);
    return c.json({ success: false, message: 'Gagal mengambil data kuota jurusan: ' + (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

router.post('/targets', adminAuth, async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));

    const admin = (c.get as (k: string) => unknown)('admin') as { school_id?: string; school_slug?: string; slug?: string } | undefined;
    const rawSchoolId = admin?.school_id || admin?.school_slug || admin?.slug || c.req.query('school_id') || c.req.query('school_slug');
    if (!rawSchoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }
    const body = await c.req.json();
    const { targets } = body;

    if (!targets || typeof targets !== 'object') {
      return c.json({ success: false, message: 'Data targets tidak valid' }, 400);
    }

    const { resolveSchoolUUID } = await import('../db/resolve-school');
    const { fontInMemSchools } = await import('./saas');
    const resolved = await resolveSchoolUUID(String(rawSchoolId), fontInMemSchools);
    const targetSchoolId = resolved || String(rawSchoolId);

    try {
      await supabase
        .from('landing_page_config')
        .upsert({
          school_id: targetSchoolId,
          config_key: 'kuota_targets',
          config_value: JSON.stringify(targets),
          updated_at: new Date().toISOString()
        }, { onConflict: 'school_id,config_key' });
    } catch (_sbErr) {}

    try {
      const { pool } = await import('../db/client');
      await pool.query(
        `INSERT INTO landing_page_config (school_id, config_key, config_value, updated_at)
         VALUES ($1::uuid, 'kuota_targets', $2, NOW())
         ON CONFLICT (school_id, config_key)
         DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW()`,
        [String(targetSchoolId), JSON.stringify(targets)]
      );
    } catch (_pgErr) {
      console.warn('Fallback pool query for kuota_targets error:', _pgErr);
    }

    const targetSlug = admin?.school_slug || admin?.slug || (typeof rawSchoolId === 'string' && isNaN(Number(rawSchoolId)) ? rawSchoolId : null);
    if (targetSlug && fontInMemSchools.has(targetSlug)) {
      const inMem = fontInMemSchools.get(targetSlug);
      if (inMem) {
        if (!inMem.configs) inMem.configs = {};
        inMem.configs.kuota_targets = targets;
      }
    }

    return c.json({
      success: true,
      message: 'Target kuota jurusan berhasil diperbarui.',
      data: targets
    });
  } catch (error: unknown) {
    console.error('Error saving targets:', error);
    return c.json({ success: false, message: 'Gagal menyimpan target kuota: ' + (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

export default router;
