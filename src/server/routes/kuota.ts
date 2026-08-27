import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { adminAuth } from '../middleware/auth';

const router = new Hono();

const DISPLAY_NAMES: Record<string, string> = {
  "Desain Komunikasi Visual": "Desain Komunikasi Visual (DKV)",
  "Teknik Komputer dan Jaringan": "Teknik Komputer dan Jaringan (TKJ)",
  "Rekayasa Perangkat Lunak": "Rekayasa Perangkat Lunak (RPL)",
  "Broadcasting dan Perfilman": "Broadcasting dan Perfilman (BC)",
  "Teknik Transmisi Telekomunikasi": "Teknik Transmisi Telekomunikasi (TJA)",
  "Belum Memilih": "Belum Memilih Jurusan / Unassigned"
};

const ORDER = [
  "Desain Komunikasi Visual",
  "Teknik Komputer dan Jaringan",
  "Rekayasa Perangkat Lunak",
  "Broadcasting dan Perfilman",
  "Teknik Transmisi Telekomunikasi",
  "Belum Memilih"
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getTargets(supabase: any, schoolId: string | null, customOrder: string[] = ORDER): Promise<Record<string, number>> {
  const baseTargets: Record<string, number> = {};
  customOrder.forEach((k) => {
    baseTargets[k] = 0;
  });

  if (!schoolId) return baseTargets;
  try {
    const { data } = await supabase
      .from('landing_page_config')
      .select('config_value')
      .eq('school_id', schoolId)
      .eq('config_key', 'kuota_targets')
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
      `SELECT config_value FROM landing_page_config WHERE school_id::text = $1::text AND config_key = 'kuota_targets'`,
      [String(schoolId)]
    );
    if (pgRes.rows && pgRes.rows.length > 0) {
      const rawVal = pgRes.rows[0].config_value;
      const parsed = typeof rawVal === 'string' ? JSON.parse(rawVal) : rawVal;
      return { ...baseTargets, ...parsed };
    }
  } catch (_pgErr) {}

  try {
    const { fontInMemSchools } = await import('./saas');
    if (fontInMemSchools.has(String(schoolId))) {
      const inMem = fontInMemSchools.get(String(schoolId));
      if (inMem?.configs?.kuota_targets) {
        const parsed = typeof inMem.configs.kuota_targets === 'string' ? JSON.parse(inMem.configs.kuota_targets) : inMem.configs.kuota_targets;
        return { ...baseTargets, ...parsed };
      }
    }
  } catch (_memErr) {}

  return baseTargets;
}

router.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    let schoolId = c.req.query('school_id') || null;
    const schoolSlug = c.req.query('school_slug') || null;
    const periodeParam = c.req.query('periode') || null;

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    if (schoolSlug || (schoolId && !isUUID(schoolId))) {
      try {
        const { resolveSchoolUUID } = await import('../db/resolve-school');
        const { fontInMemSchools } = await import('./saas');
        const targetIdentifier = schoolSlug || schoolId!;
        const resolved = await resolveSchoolUUID(targetIdentifier, fontInMemSchools);
        if (resolved) schoolId = resolved;
      } catch (_err) {}
    }

    let order = [...ORDER];
    let displayNames = { ...DISPLAY_NAMES };

    if (schoolId) {
      try {
        const { data: majorsData } = await supabase
          .from('landing_page_config')
          .select('config_value')
          .eq('school_id', schoolId)
          .eq('config_key', 'ppdb_majors_config')
          .maybeSingle();

        if (majorsData && majorsData.config_value) {
          const majorsList = typeof majorsData.config_value === 'string'
            ? JSON.parse(majorsData.config_value)
            : majorsData.config_value;
          if (Array.isArray(majorsList) && majorsList.length > 0) {
            order = majorsList.map((m: { title?: string; code?: string }) => m.title || m.code || '');
            displayNames = {};
            majorsList.forEach((m: { title?: string; code?: string }) => {
              const name = m.title || m.code || '';
              displayNames[name] = m.code && m.title ? `${m.title} (${m.code})` : name;
            });
            order.push("Belum Memilih");
            displayNames["Belum Memilih"] = "Belum Memilih Jurusan / Unassigned";
          }
        }
      } catch (_e) {}
    }

    const TARGETS = await getTargets(supabase, schoolId, order);

    let pQuery = supabase.from('student_applicants').select('periode');
    let sQuery = supabase.from('active_students').select('periode');
    if (schoolId) {
      pQuery = pQuery.eq('school_id', schoolId);
      sQuery = sQuery.eq('school_id', schoolId);
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

    if (schoolId) {
      pendaftarDataQuery = pendaftarDataQuery.eq('school_id', schoolId);
      siswaAktifDataQuery = siswaAktifDataQuery.eq('school_id', schoolId);
    }
    if (periodeParam) {
      pendaftarDataQuery = pendaftarDataQuery.eq('periode', periodeParam);
      siswaAktifDataQuery = siswaAktifDataQuery.eq('periode', periodeParam);
    }

    const { data: pendaftarRows } = await pendaftarDataQuery;
    const { data: siswaAktifRows } = await siswaAktifDataQuery;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groupRows = (rows: any[], keyName: string) => {
      const groups: Record<string, number> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rows?.forEach((r: any) => {
        const val = r[keyName];
        groups[val] = (groups[val] || 0) + 1;
      });
      return Object.keys(groups).map(k => ({ [keyName]: k, _count: { _all: groups[k] } }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processGroups = (groups: any[], jurusanKey: string) => {
      const counts: Record<string, number> = {};
      groups.forEach(g => {
        let key = g[jurusanKey] || "Belum Memilih";
        if (!order.includes(key) && key !== "Belum Memilih") {
          key = "Belum Memilih";
        }
        counts[key] = (counts[key] || 0) + g._count._all;
      });

      return order.map((key, index) => {
        const jumlah = counts[key] || 0;
        const target = TARGETS[key] || 0;
        const presentase = target > 0 ? Math.round((jumlah / target) * 100) : 0;
        return {
          no: index + 1,
          key: key,
          konsentrasi_keahlian: displayNames[key] || key,
          jumlah,
          target,
          presentase: `${presentase}%`
        };
      });
    };

    const dataPendaftar = processGroups(groupRows(pendaftarRows || [], 'jurusan_1'), 'jurusan_1');
    const dataSiswaAktif = processGroups(groupRows(siswaAktifRows || [], 'jurusan'), 'jurusan');

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
         VALUES ($1::text, 'kuota_targets', $2, NOW())
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
