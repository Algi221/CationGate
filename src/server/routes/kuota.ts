import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';

const router = new Hono();

const DEFAULT_TARGETS: Record<string, number> = {
  "Desain Komunikasi Visual": 108,
  "Teknik Komputer dan Jaringan": 144,
  "Rekayasa Perangkat Lunak": 144,
  "Broadcasting dan Perfilman": 108,
  "Teknik Transmisi Telekomunikasi": 36,
  "Belum Memilih": 0
};

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

async function getTargets(supabase: any, schoolId: string | null): Promise<Record<string, number>> {
  if (!schoolId) return DEFAULT_TARGETS;
  try {
    const { data } = await supabase
      .from('landing_page_config')
      .select('config_value')
      .eq('school_id', schoolId)
      .eq('config_key', 'kuota_targets')
      .maybeSingle();
    
    if (data && data.config_value) {
      return typeof data.config_value === 'string' ? JSON.parse(data.config_value) : data.config_value;
    }
  } catch (e) {
    console.warn('Gagal membaca kuota_targets dari DB, menggunakan default:', e);
  }
  return DEFAULT_TARGETS;
}

router.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;
    const periodeParam = c.req.query('periode') || null;

    const TARGETS = await getTargets(supabase, schoolId);

    let pQuery = supabase.from('student_applicants').select('periode');
    let sQuery = supabase.from('active_students').select('periode');
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

    const pendaftarGroups = groupRows(pendaftarRows || [], 'jurusan_1');
    const siswaAktifGroups = groupRows(siswaAktifRows || [], 'jurusan');

    const dataPendaftar = processGroups(pendaftarGroups, 'jurusan_1');
    const dataSiswaAktif = processGroups(siswaAktifGroups, 'jurusan');

    const totalTarget = ORDER.reduce((acc, k) => acc + (TARGETS[k] || 0), 0);
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
  } catch (error: any) {
    console.error('Error calculating kuota:', error);
    return c.json({ success: false, message: 'Gagal mengambil data kuota jurusan: ' + error.message }, 500);
  }
});

router.post('/targets', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;
    const body = await c.req.json();
    const { targets } = body;

    if (!targets || typeof targets !== 'object') {
      return c.json({ success: false, message: 'Data targets tidak valid' }, 400);
    }

    if (schoolId) {
      await supabase
        .from('landing_page_config')
        .upsert({
          school_id: schoolId,
          config_key: 'kuota_targets',
          config_value: JSON.stringify(targets),
          updated_at: new Date().toISOString()
        }, { onConflict: 'school_id,config_key' });
    }

    return c.json({
      success: true,
      message: 'Target kuota jurusan berhasil diperbarui.',
      data: targets
    });
  } catch (error: any) {
    console.error('Error saving targets:', error);
    return c.json({ success: false, message: 'Gagal menyimpan target kuota: ' + error.message }, 500);
  }
});

export default router;
