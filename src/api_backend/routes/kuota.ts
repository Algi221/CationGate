import { Hono } from 'hono';
import prisma from '../db/prisma';

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

// Ensure consistent order based on the image
const ORDER = [
  "Teknik Jaringan Komputer & Telekomunikasi",
  "Rekayasa Perangkat Lunak",
  "Animasi",
  "Broadcasting & Perfilman",
  "Teknik Elektronika",
  "Desain Komunikasi Visual",
  "Belum Memilih"
];

const getTargets = async () => {
  const config = await prisma.landingPageConfig.findUnique({
    where: { config_key: "kuota_targets" }
  });
  if (config && config.config_value) {
    return { ...DEFAULT_TARGETS, ...(config.config_value as Record<string, number>) };
  }
  return DEFAULT_TARGETS;
};

router.get('/', async (c) => {
  try {
    const TARGETS = await getTargets();
    const periodeParam = c.req.query('periode') || null;

    // Get all distinct periods for the dropdown
    const allPeriodesPendaftar = await prisma.calonSiswa.findMany({
      where: { deleted_at: null },
      select: { periode: true },
      distinct: ['periode']
    });
    const allPeriodesAktif = await prisma.siswaAktif.findMany({
      select: { periode: true },
      distinct: ['periode']
    });
    const periodesSet = new Set<string>();
    allPeriodesPendaftar.forEach(p => { if (p.periode) periodesSet.add(p.periode); });
    allPeriodesAktif.forEach(p => { if (p.periode) periodesSet.add(p.periode); });
    // Always include default
    periodesSet.add('2026-2027');
    const availablePeriodes = Array.from(periodesSet).sort((a, b) => b.localeCompare(a));

    // Build where clause
    const pendaftarWhere: any = { deleted_at: null };
    const siswaAktifWhere: any = {};
    if (periodeParam) {
      pendaftarWhere.periode = periodeParam;
      siswaAktifWhere.periode = periodeParam;
    }

    const pendaftarGroups = await prisma.calonSiswa.groupBy({
      by: ['jurusan_1'],
      _count: {
        _all: true,
      },
      where: pendaftarWhere
    });

    const siswaAktifGroups = await prisma.siswaAktif.groupBy({
      by: ['jurusan'],
      _count: {
        _all: true,
      },
      where: siswaAktifWhere
    });

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

    const pendaftarData = processGroups(pendaftarGroups, 'jurusan_1');
    const siswaAktifData = processGroups(siswaAktifGroups, 'jurusan');

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
    const body = await c.req.json();
    const newTargets = body.targets; // Expected: Record<string, number>
    
    if (!newTargets || typeof newTargets !== 'object') {
      return c.json({ success: false, message: 'Invalid targets data. Expected targets object.' }, 400);
    }

    await prisma.landingPageConfig.upsert({
      where: { config_key: "kuota_targets" },
      update: { config_value: newTargets },
      create: {
        config_key: "kuota_targets",
        config_value: newTargets
      }
    });

    return c.json({ success: true, message: "Kuota targets updated successfully" });
  } catch (error: any) {
    console.error('Error updating kuota targets:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default router;
