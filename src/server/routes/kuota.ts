import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';

const router = new Hono();

const DEFAULT_TARGETS: Record<string, number> = {
  "Teknik Jaringan Komputer & Telekomunikasi": 160,
  "Rekayasa Perangkat Lunak": 200,
  "Animasi": 80,
  "Broadcasting & Perfilman": 120,
  "Teknik Elektronika": 80,
  "Desain Komunikasi Visual": 40,
  "Belum Memilih": 0
};

const DISPLAY_NAMES: Record<string, string> = {
  "Teknik Jaringan Komputer & Telekomunikasi": "TKJ",
  "Rekayasa Perangkat Lunak": "RPL",
  "Animasi": "ANIMASI",
  "Broadcasting & Perfilman": "PSPT",
  "Teknik Elektronika": "TEI",
  "Desain Komunikasi Visual": "DKV",
  "Belum Memilih": "BELUM MEMILIH JURUSAN"
};

const ORDER = [
  "Teknik Jaringan Komputer & Telekomunikasi",
  "Rekayasa Perangkat Lunak",
  "Animasi",
  "Broadcasting & Perfilman",
  "Teknik Elektronika",
  "Desain Komunikasi Visual",
  "Belum Memilih"
];

const getTargets = async (supabase: any, schoolId: string | null) => {
  let query = supabase.from('landing_page_config').select('config_value').eq('config_key', 'kuota_targets');
  if (schoolId) query = query.eq('school_id', schoolId);
  const { data, error } = await query.single();
  
  if (data && data.config_value) {
    return { ...DEFAULT_TARGETS, ...(data.config_value as Record<string, number>) };
  }
  return DEFAULT_TARGETS;
};

router.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;
    const periodeParam = c.req.query('periode') || null;

    const TARGETS = await getTargets(supabase, schoolId);

    // Fetch periods
    let pQuery = supabase.from('calon_siswa').select('periode');
    let sQuery = supabase.from('siswa_aktif').select('periode');
    if (schoolId) {
      pQuery = pQuery.eq('school_id', schoolId);
      sQuery = sQuery.eq('school_id', schoolId);
    }

    const { data: allPeriodesPendaftar } = await pQuery;
    const { data: allPeriodesAktif } = await sQuery;

    const periodesSet = new Set<string>();
    allPeriodesPendaftar?.forEach((p: any) => { if (p.periode) periodesSet.add(p.periode); });
    allPeriodesAktif?.forEach((p: any) => { if (p.periode) periodesSet.add(p.periode); });
    periodesSet.add('2026-2027');
    const availablePeriodes = Array.from(periodesSet).sort((a, b) => b.localeCompare(a));

    // Fetch data for grouping
    let pendaftarDataQuery = supabase.from('calon_siswa').select('jurusan_1');
    let siswaAktifDataQuery = supabase.from('siswa_aktif').select('jurusan');
    
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

    const groupRows = (rows: any[], keyName: string) => {
      const groups: Record<string, number> = {};
      rows?.forEach((r: any) => {
        const val = r[keyName];
        groups[val] = (groups[val] || 0) + 1;
      });
      return Object.keys(groups).map(k => ({ [keyName]: k, _count: { _all: groups[k] } }));
    };

    const processGroups = (groups: any[], jurusanKey: string) => {
      const counts: Record<string, number> = {};
      groups.forEach(g => {
        let key = g[jurusanKey] || "Belum Memilih";
        if (!DEFAULT_TARGETS.hasOwnProperty(key) && key !== "Belum Memilih") {
          key = "Belum Memilih";
        }
        counts[key] = (counts[key] || 0) + g._count._all;
      });

      return ORDER.map((key, index) => {
        const jumlah = counts[key] || 0;
        const target = TARGETS[key] || 0;
        const presentase = target > 0 ? Math.round((jumlah / target) * 100) : (jumlah > 0 ? jumlah * 100 : 0);
        return {
          no: index + 1,
          key: key,
          konsentrasi_keahlian: DISPLAY_NAMES[key] || key,
          jumlah,
          target,
          presentase: target > 0 ? `${presentase}%` : presentase.toString()
        };
      });
    };

    const pendaftarData = processGroups(groupRows(pendaftarRows || [], 'jurusan_1'), 'jurusan_1');
    const siswaAktifData = processGroups(groupRows(siswaAktifRows || [], 'jurusan'), 'jurusan');

    return c.json({
      success: true,
      data: {
        pendaftar: pendaftarData,
        siswaAktif: siswaAktifData,
        totalPendaftar: pendaftarData.reduce((acc, curr) => acc + curr.jumlah, 0),
        totalSiswaAktif: siswaAktifData.reduce((acc, curr) => acc + curr.jumlah, 0),
        totalTarget: Object.values(TARGETS).reduce((acc, curr) => acc + Number(curr), 0),
        availablePeriodes,
        selectedPeriode: periodeParam || 'all'
      }
    });
  } catch (error: any) {
    console.error('Error fetching kuota:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

router.post('/targets', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;
    const body = await c.req.json();
    const newTargets = body.targets;
    
    if (!newTargets || typeof newTargets !== 'object') {
      return c.json({ success: false, message: 'Invalid targets data. Expected targets object.' }, 400);
    }

    const payload: any = {
      config_key: "kuota_targets",
      config_value: newTargets
    };
    if (schoolId) payload.school_id = schoolId;

    const { error } = await supabase
      .from('landing_page_config')
      .upsert(payload, { onConflict: 'config_key' });

    if (error) throw error;

    return c.json({ success: true, message: "Kuota targets updated successfully" });
  } catch (error: any) {
    console.error('Error updating kuota targets:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default router;
