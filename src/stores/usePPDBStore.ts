import { create } from "zustand";
import { useToastStore } from "./useToastStore";
import { useAuthStore } from "./useAuthStore";
import { useSchoolStore } from "./useSchoolStore";
import { getBrowserSupabase } from "@/lib/supabase-client";
import { formatNoPendaftaran } from "@/components/features/pendaftar/components/detail-sections/sanitizeUrl";

export interface WsLog {
  id: string;
  timestamp: string;
  direction: string;
  event: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const NAMES_FIRST = [
  "Ahmad", "Budi", "Cinta", "Dewi", "Eka", "Fahri", "Gita", "Hani", "Indra", "Joko",
  "Kartika", "Lestari", "Muhammad", "Nabila", "Oktavia", "Putri", "Qori", "Rizky",
  "Siti", "Taufik", "Umar", "Vina", "Wahyu", "Xena", "Yusuf", "Zahra", "Dimas", "Farhan",
  "Anisa", "Rian", "Bayu", "Tiara", "Kevin", "Salsabila", "Reza", "Melati", "Aditya", "Nurul"
];
const NAMES_LAST = [
  "Pratama", "Wijaya", "Santoso", "Lestari", "Putra", "Kusuma", "Hidayat", "Saputra",
  "Ramadhan", "Nugraha", "Permana", "Wibowo", "Utami", "Sari", "Firmansyah", "Syahputra",
  "Subagyo", "Setiawan", "Bahri", "Hasanah", "Mahendra", "Wahyudi", "Gunawan", "Siregar"
];
const MAJORS_LIST = [
  "Rekayasa Perangkat Lunak",
  "Teknik Komputer dan Jaringan",
  "Desain Komunikasi Visual",
  "Broadcasting dan Perfilman",
  "Animasi",
  "Teknik Elektronika"
];
const SCHOOLS_ORIGIN = [
  "SMPN 1 Depok", "SMPN 2 Depok", "SMPN 4 Jakarta", "SMP Al-Azhar 9",
  "SMPN 1 Bogor", "SMP YPB Depok", "SMP PGRI 1", "SMPN 3 Bekasi",
  "SMP IT Nurul Fikri", "SMPN 1 Cibinong", "SMP Mardi Yuana"
];

const TRANSFER_ORIGINS = [
  "SMK Negeri 1 Jakarta",
  "SMA Negeri 8 Jakarta",
  "SMK Telkom Sandhy Putra",
  "SMA Negeri 1 Bogor",
  "SMK Negeri 2 Depok",
  "SMA Labschool Cibubur",
  "SMK Taruna Terpadu 1",
  "SMA Negeri 3 Bekasi"
];

const TRANSFER_REASONS = [
  "Mengikuti perpindahan dinas tugas kerja orang tua ke wilayah Depok",
  "Penyesuaian kurikulum peminatan kejuruan vokasi industri",
  "Pindah domisili keluarga dari luar daerah ke Kota Depok",
  "Mencari program vokasi yang memiliki kerja sama sertifikasi industri"
];

export function generateDemoApplicants() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  const statuses = ["Approved", "Approved", "Pending", "Approved", "Pending", "Approved", "Rejected", "Approved"];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const currentPeriode = "2026-2027";

  for (let i = 1; i <= 50; i++) {
    const fn = NAMES_FIRST[i % NAMES_FIRST.length];
    const ln = NAMES_LAST[(i * 3) % NAMES_LAST.length];
    const nisn = `008${1000000 + i * 13579}`.slice(0, 10);
    const nik = `327601${String(10 + (i % 20)).padStart(2, "0")}0409${String(i).padStart(4, "0")}`;
    const major = MAJORS_LIST[i % MAJORS_LIST.length];
    const secondaryMajor = MAJORS_LIST[(i + 1) % MAJORS_LIST.length];
    const status = statuses[i % statuses.length];
    const school = SCHOOLS_ORIGIN[i % SCHOOLS_ORIGIN.length];
    const daysAgo = i % 7;
    const dateStr = new Date(now - daysAgo * dayMs - i * 3600000).toISOString();
    const gender = i % 2 === 0 ? "L" : "P";
    const regNo = formatNoPendaftaran(currentPeriode, i, "demo");

    let diterimaKelas: string | null = null;
    if (status === "Approved") {
      if (i <= 20) {
        if (major === "Rekayasa Perangkat Lunak") {
          diterimaKelas = i % 2 === 0 ? "X RPL 1" : "X RPL 2";
        } else if (major === "Teknik Komputer dan Jaringan") {
          diterimaKelas = i % 2 === 0 ? "X TJKT 1" : "X TJKT 2";
        } else if (major === "Desain Komunikasi Visual") {
          diterimaKelas = "X DKV 1";
        } else if (major === "Broadcasting dan Perfilman") {
          diterimaKelas = "X BC 1";
        } else if (major === "Animasi") {
          diterimaKelas = "X ANM 1";
        } else {
          diterimaKelas = "X TE 1";
        }
      }
    }

    const payMethod =
      i % 3 === 0
        ? "Bayar Tunai di TU (Cash)"
        : i % 3 === 1
          ? "Transfer Manual"
          : "Midtrans Payment Gateway";

    result.push({
      id: i,
      nama: `${fn} ${ln}`,
      nisn,
      nik,
      registration_no: regNo,
      no_pendaftaran: regNo,
      periode: currentPeriode,
      sekolah_asal: school,
      sekolahAsal: school,
      jurusan_1: major,
      jurusan_2: secondaryMajor,
      jurusan1: major,
      jurusan2: secondaryMajor,
      status,
      tipe_pendaftar: "REGULER",
      jalur_pendaftaran: "REGULER",
      is_pindahan: false,
      pindahan_dari: "",
      pindahanDari: "",
      metode_pembayaran: payMethod,
      status_pembayaran:
        status === "Rejected" ? "BELUM_BAYAR" : i % 5 === 0 ? "PENDING" : "LUNAS",
      bukti_bayar:
        payMethod === "Transfer Manual"
          ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400"
          : null,
      diterima_kelas: diterimaKelas,
      diterimaKelas,
      tgl_daftar: dateStr,
      createdAt: dateStr,
      jenis_kelamin: gender,
      jenisKelamin: gender,
      tempat_lahir: i % 2 === 0 ? "Depok" : "Jakarta",
      tgl_lahir: "2009-05-14",
      gelombang: i % 3 === 0 ? "Gelombang 2" : "Gelombang 1",
      no_telepon: `08129${1000000 + i * 4567}`.slice(0, 12),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`,
      nama_ayah: `Bpk. ${ln} ${fn}`,
      nama_ibu: `Ibu Siti ${ln}`,
      pekerjaan_ayah: i % 2 === 0 ? "Karyawan Swasta" : "Wiraswasta",
      alamat_jalan: `Jl. Margonda Raya No. ${i * 3}, Kota Depok`,
      alasan_ditolak:
        status === "Rejected"
          ? "Berkas administrasi tidak memenuhi kelengkapan NISN & Surat Keterangan Lulus."
          : null,
      verified_by: status === "Approved" ? "Admin PPDB" : null,
    });
  }

  for (let j = 1; j <= 15; j++) {
    const id = 50 + j;
    const fn = NAMES_FIRST[(id * 2) % NAMES_FIRST.length];
    const ln = NAMES_LAST[(id * 4) % NAMES_LAST.length];
    const nisn = `007${1000000 + id * 24680}`.slice(0, 10);
    const nik = `327601${String(20 + (j % 10)).padStart(2, "0")}0408${String(id).padStart(4, "0")}`;
    const major = MAJORS_LIST[(j - 1) % MAJORS_LIST.length];
    const transferSchool = TRANSFER_ORIGINS[(j - 1) % TRANSFER_ORIGINS.length];
    const transferReason = TRANSFER_REASONS[(j - 1) % TRANSFER_REASONS.length];
    const status = j % 6 === 0 ? "Rejected" : j % 4 === 0 ? "Pending" : "Approved";
    const gradeLevel = j % 2 === 0 ? "XI" : "XII";
    const majorCode =
      major === "Rekayasa Perangkat Lunak"
        ? "RPL"
        : major === "Teknik Komputer dan Jaringan"
          ? "TJKT"
          : major === "Desain Komunikasi Visual"
            ? "DKV"
            : major === "Broadcasting dan Perfilman"
              ? "BC"
              : major === "Animasi"
                ? "ANM"
                : "TE";
    const assignedClass = status === "Approved" ? `${gradeLevel} ${majorCode} 1` : null;
    const regNo = formatNoPendaftaran(currentPeriode, id, "demo");
    const dateStr = new Date(now - (j + 2) * dayMs).toISOString();
    const gender = j % 2 === 0 ? "L" : "P";

    result.push({
      id,
      nama: `${fn} ${ln}`,
      nisn,
      nik,
      registration_no: regNo,
      no_pendaftaran: regNo,
      periode: currentPeriode,
      sekolah_asal: transferSchool,
      sekolahAsal: transferSchool,
      pindahan_dari: transferSchool,
      pindahanDari: transferSchool,
      alasan_pindah: transferReason,
      is_pindahan: true,
      tipe_pendaftar: "PINDAHAN",
      jalur_pendaftaran: "PINDAHAN",
      jurusan_1: major,
      jurusan_2: major,
      jurusan1: major,
      jurusan2: major,
      status,
      metode_pembayaran: "Transfer Manual",
      status_pembayaran: status === "Rejected" ? "BELUM_BAYAR" : "LUNAS",
      bukti_bayar: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
      diterima_kelas: assignedClass,
      diterimaKelas: assignedClass,
      tgl_daftar: dateStr,
      createdAt: dateStr,
      jenis_kelamin: gender,
      jenisKelamin: gender,
      tempat_lahir: "Jakarta",
      tgl_lahir: "2008-03-20",
      gelombang: "Jalur Mutasi Pindahan",
      no_telepon: `08138${2000000 + j * 6789}`.slice(0, 12),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${id}@gmail.com`,
      nama_ayah: `Bpk. ${ln} ${fn}`,
      nama_ibu: `Ibu ${fn} ${ln}`,
      pekerjaan_ayah: "PNS / Pegawai BUMN",
      alamat_jalan: `Jl. Raya Sawangan No. ${j * 5}, Kota Depok`,
      alasan_ditolak:
        status === "Rejected"
          ? "Akreditasi sekolah asal dan kesesuaian kurikulum mata pelajaran vokasi belum terpenuhi."
          : null,
      verified_by: status === "Approved" ? "Admin PPDB" : null,
    });
  }

  return result;
}

export function generateDemoTrashedApplicants() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  const currentPeriode = "2026-2027";
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const reasons = [
    "Permintaan pembatalan pendaftaran resmi dari orang tua karena diterima di SMA Negeri",
    "Data pendaftaran ganda / duplikasi data calon siswa",
    "Mengundurkan diri karena kendala perpindahan lokasi domisili keluarga",
    "Salah input jurusan dan mengajukan pendaftaran ulang",
    "Tidak melengkapi berkas fisik persyaratan hingga batas akhir penutupan gelombang",
    "Pindah domisili ke luar provinsi mengikuti dinas orang tua"
  ];

  for (let k = 1; k <= 6; k++) {
    const id = 90 + k;
    const fn = NAMES_FIRST[(id * 3) % NAMES_FIRST.length];
    const ln = NAMES_LAST[(id * 7) % NAMES_LAST.length];
    const nisn = `008${9000000 + k * 12345}`.slice(0, 10);
    const major = MAJORS_LIST[(k + 2) % MAJORS_LIST.length];
    const school = SCHOOLS_ORIGIN[k % SCHOOLS_ORIGIN.length];
    const regNo = formatNoPendaftaran(currentPeriode, id, "demo");
    const dateStr = new Date(now - (k + 5) * dayMs).toISOString();
    const deletedStr = new Date(now - k * dayMs).toISOString();

    result.push({
      id,
      nama: `${fn} ${ln}`,
      nisn,
      registration_no: regNo,
      no_pendaftaran: regNo,
      periode: currentPeriode,
      sekolah_asal: school,
      sekolahAsal: school,
      jurusan_1: major,
      jurusan1: major,
      status: "Rejected",
      deleted_at: deletedStr,
      deleted_by: "Admin PPDB",
      alasan_hapus: reasons[k - 1] || "Pembatalan berkas pendaftaran",
      alasan_ditolak: reasons[k - 1] || "Pembatalan berkas pendaftaran",
      tgl_daftar: dateStr,
      jenis_kelamin: k % 2 === 0 ? "L" : "P",
      jenisKelamin: k % 2 === 0 ? "L" : "P",
      gelombang: "Gelombang 1",
    });
  }
  return result;
}

export const DEMO_TRASHED_APPLICANTS_SEED = generateDemoTrashedApplicants();

export function generateDemoActiveStudents() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  const periodes = ["2024-2025", "2025-2026", "2026-2027"];
  let idCounter = 1;

  periodes.forEach((periode, pIdx) => {
    for (let i = 1; i <= 25; i++) {
      const fn = NAMES_FIRST[(idCounter * 2) % NAMES_FIRST.length];
      const ln = NAMES_LAST[(idCounter * 5) % NAMES_LAST.length];
      const nisn = `007${2000000 + idCounter * 54321}`.slice(0, 10);
      const major = MAJORS_LIST[i % MAJORS_LIST.length];
      const kelasGrade = pIdx === 0 ? "XII" : pIdx === 1 ? "XI" : "X";
      const kelasCode =
        major === "Rekayasa Perangkat Lunak"
          ? "RPL"
          : major === "Teknik Komputer dan Jaringan"
            ? "TJKT"
            : major === "Desain Komunikasi Visual"
              ? "DKV"
              : major === "Broadcasting dan Perfilman"
                ? "BC"
                : major === "Animasi"
                  ? "ANM"
                  : "TE";
      const gender = (i % 2 === 0) ? "P" : "L";
      const regNo = formatNoPendaftaran(periode, idCounter, "demo");
      const assignedClass = `${kelasGrade} ${kelasCode} ${(i % 2) + 1}`;

      result.push({
        id: idCounter,
        nama: `${fn} ${ln}`,
        nisn,
        nipd: regNo,
        registration_no: regNo,
        no_pendaftaran: regNo,
        periode,
        kelas: assignedClass,
        diterima_kelas: assignedClass,
        jurusan_1: major,
        sekolah_asal: SCHOOLS_ORIGIN[i % SCHOOLS_ORIGIN.length],
        status: "Approved",
        status_pembayaran: "LUNAS",
        jenis_kelamin: gender,
        jenisKelamin: gender,
        tgl_daftar: "2025-07-15T08:00:00.000Z",
      });
      idCounter++;
    }
  });
  return result;
}

export const DEMO_APPLICANTS_SEED = generateDemoApplicants();
export const DEMO_ACTIVE_STUDENTS_SEED = generateDemoActiveStudents();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyClassOverrides = (list: any[]): any[] => {
  if (typeof window === "undefined") return list;
  try {
    const raw = localStorage.getItem("ppdb_class_overrides");
    if (!raw) return list;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const overrides: Record<string, any> = JSON.parse(raw);
    if (!Object.keys(overrides).length) return list;
    return list.map((a) => {
      const o = overrides[String(a.id)];
      return o ? { ...a, ...o } : a;
    });
  } catch {
    return list;
  }
};

const checkIsDemo = () => {
  if (typeof window === "undefined") return false;
  return (
    window.location.pathname.startsWith("/demo") ||
    window.location.pathname.includes("/demo") ||
    window.location.host.startsWith("demo.")
  );
};

const getInitialApplicants = () => {
  if (typeof window !== "undefined") {
    const isDemo = checkIsDemo();
    if (isDemo) {
      const localStr = localStorage.getItem("demo_admin_applicants");
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
      return DEMO_APPLICANTS_SEED;
    }
  }
  return [];
};

const getInitialPublicApplicants = () => {
  if (typeof window !== "undefined") {
    const isDemo = checkIsDemo();
    if (isDemo) {
      const localStr = localStorage.getItem("demo_public_applicants");
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
      return DEMO_APPLICANTS_SEED;
    }
  }
  return [];
};

const getInitialActiveStudents = () => {
  if (typeof window !== "undefined") {
    const isDemo = checkIsDemo();
    if (isDemo) {
      const localStr = localStorage.getItem("demo_active_students");
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
      return DEMO_ACTIVE_STUDENTS_SEED;
    }
  }
  return [];
};

interface PPDBState {
  isLoaded: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicants: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicApplicants: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeStudents: any[];
  wsStatus: string;
  wsLogs: WsLog[];
  simulationActive: boolean;

  setIsLoaded: (loaded: boolean | ((prev: boolean) => boolean)) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setApplicants: (apps: any[] | ((prev: any[]) => any[])) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPublicApplicants: (apps: any[] | ((prev: any[]) => any[])) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setActiveStudents: (students: any[] | ((prev: any[]) => any[])) => void;
  setWsStatus: (status: string) => void;
  setSimulationActive: (active: boolean | ((prev: boolean) => boolean)) => void;

  fetchPublicApplicants: () => Promise<void>;
  fetchAdminApplicants: () => Promise<void>;
  fetchActiveStudents: () => Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerApplicant: (formData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  verifyApplicant: (id: number) => Promise<void>;
  rejectApplicant: (id: number, alasan_ditolak?: string) => Promise<void>;
  deleteApplicant: (id: number) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateApplicant: (id: number, updatedData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateActiveStudent: (id: number, updatedData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  deleteActiveStudent: (id: number) => Promise<void>;
  simulateRegistration: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkPaymentStatus: (nisn: string) => Promise<any>;
  initRealtimeSubscription: (schoolId?: string) => () => void;
}

export const usePPDBStore = create<PPDBState>((set, get) => ({
  isLoaded: typeof window !== "undefined" ? sessionStorage.getItem("cationgate_loading_session") !== "active" : true,
  applicants: getInitialApplicants(),
  publicApplicants: getInitialPublicApplicants(),
  activeStudents: getInitialActiveStudents(),
  wsStatus: "SYNCING (15s)",
  wsLogs: [],
  simulationActive: false,

  setIsLoaded: (loadedOrUpdater) => {
    set((state) => ({
      isLoaded: typeof loadedOrUpdater === "function" ? loadedOrUpdater(state.isLoaded) : loadedOrUpdater,
    }));
  },

  setApplicants: (appsOrUpdater) => {
    set((state) => {
      const next = typeof appsOrUpdater === "function" ? appsOrUpdater(state.applicants) : appsOrUpdater;
      const isDemo = useSchoolStore.getState().isDemoMode || checkIsDemo();
      if (isDemo && typeof window !== "undefined" && next.length > 0) {
        try { localStorage.setItem("demo_admin_applicants", JSON.stringify(next)); } catch {}
      }
      return { applicants: next };
    });
  },

  setPublicApplicants: (appsOrUpdater) => {
    set((state) => {
      const next = typeof appsOrUpdater === "function" ? appsOrUpdater(state.publicApplicants) : appsOrUpdater;
      const isDemo = useSchoolStore.getState().isDemoMode || checkIsDemo();
      if (isDemo && typeof window !== "undefined" && next.length > 0) {
        try { localStorage.setItem("demo_public_applicants", JSON.stringify(next)); } catch {}
      }
      return { publicApplicants: next };
    });
  },

  setActiveStudents: (studentsOrUpdater) => {
    set((state) => {
      const next = typeof studentsOrUpdater === "function" ? studentsOrUpdater(state.activeStudents) : studentsOrUpdater;
      const isDemo = useSchoolStore.getState().isDemoMode || checkIsDemo();
      if (isDemo && typeof window !== "undefined" && next.length > 0) {
        try { localStorage.setItem("demo_active_students", JSON.stringify(next)); } catch {}
      }
      return { activeStudents: next };
    });
  },

  setWsStatus: (status) => set({ wsStatus: status }),
  setSimulationActive: (activeOrUpdater) => {
    set((state) => ({
      simulationActive: typeof activeOrUpdater === "function" ? activeOrUpdater(state.simulationActive) : activeOrUpdater,
    }));
  },

  fetchPublicApplicants: async () => {
    const { isDemoMode, schoolSlug } = useSchoolStore.getState();
    const isDemo = isDemoMode || schoolSlug === "demo" || checkIsDemo();
    if (isDemo) {
      const localStr = typeof window !== "undefined" ? localStorage.getItem("demo_public_applicants") : null;
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ publicApplicants: parsed });
            return;
          }
        } catch {}
      }
      set({ publicApplicants: DEMO_APPLICANTS_SEED });
      if (typeof window !== "undefined") {
        try { localStorage.setItem("demo_public_applicants", JSON.stringify(DEMO_APPLICANTS_SEED)); } catch {}
      }
      return;
    }

    try {
      const url = schoolSlug ? `${BACKEND_URL}/applicants/public?school_slug=${schoolSlug}` : `${BACKEND_URL}/applicants/public`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        if (data.data.length === 0 && (schoolSlug === "demo" || schoolSlug === "smktarunabhakti")) {
          set({ publicApplicants: DEMO_APPLICANTS_SEED });
        } else {
          set({ publicApplicants: data.data });
        }
      }
    } catch (err: unknown) {
      console.warn("Public API fetch error:", err instanceof Error ? err.message : String(err));
      set((state) => ({
        publicApplicants: state.publicApplicants.length > 0 ? state.publicApplicants : isDemo ? DEMO_APPLICANTS_SEED : [],
      }));
    }
  },

  fetchAdminApplicants: async () => {
    const { isDemoMode, schoolSlug } = useSchoolStore.getState();
    const { adminToken, logoutAdmin } = useAuthStore.getState();
    const isDemo = isDemoMode || schoolSlug === "demo" || checkIsDemo();

    if (isDemo) {
      const localStr = typeof window !== "undefined" ? localStorage.getItem("demo_admin_applicants") : null;
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ applicants: parsed });
            return;
          }
        } catch {}
      }
      set({ applicants: DEMO_APPLICANTS_SEED });
      if (typeof window !== "undefined") {
        try { localStorage.setItem("demo_admin_applicants", JSON.stringify(DEMO_APPLICANTS_SEED)); } catch {}
      }
      return;
    }

    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/applicants`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        console.warn("Token is invalid or expired. Logging out admin.");
        logoutAdmin();
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        set({ applicants: applyClassOverrides(data.data) });
      } else {
        set({ applicants: [] });
      }
    } catch (err: unknown) {
      console.warn("Admin API fetch error:", err instanceof Error ? err.message : String(err));
      set({ applicants: [] });
    }
  },

  fetchActiveStudents: async () => {
    const { isDemoMode, schoolSlug } = useSchoolStore.getState();
    const { adminToken, logoutAdmin } = useAuthStore.getState();
    const isDemo = isDemoMode || schoolSlug === "demo" || checkIsDemo();

    if (isDemo) {
      const localStr = typeof window !== "undefined" ? localStorage.getItem("demo_active_students") : null;
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ activeStudents: parsed });
            return;
          }
        } catch {}
      }
      set({ activeStudents: DEMO_ACTIVE_STUDENTS_SEED });
      if (typeof window !== "undefined") {
        try { localStorage.setItem("demo_active_students", JSON.stringify(DEMO_ACTIVE_STUDENTS_SEED)); } catch {}
      }
      return;
    }

    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/applicants`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        console.warn("Token is invalid or expired. Logging out admin.");
        logoutAdmin();
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        set({
          activeStudents: applyClassOverrides(data.data.filter((a: { status?: string }) => a.status === "Approved")),
        });
      } else {
        set({ activeStudents: [] });
      }
    } catch (err: unknown) {
      console.warn("Active students API fetch error:", err instanceof Error ? err.message : String(err));
      set({ activeStudents: [] });
    }
  },

  registerApplicant: async (formData) => {
    const { isDemoMode, schoolSlug } = useSchoolStore.getState();
    const { addToast } = useToastStore.getState();
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const targetSlug = schoolSlug || formData.school_slug || "smktarunabhakti";
      const payload = { ...formData, school_slug: targetSlug };
      const res = await fetch(`${BACKEND_URL}/applicants?school_slug=${encodeURIComponent(targetSlug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchPublicApplicants();
        await get().fetchAdminApplicants();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: unknown) {
      console.error("API registration error, adding to memory fallback:", err instanceof Error ? err.message : String(err));
      const mockSaved = {
        id: Date.now(),
        nama: formData.nama || "Pendaftar Baru",
        nisn: formData.nisn || "0000000000",
        sekolah_asal: formData.sekolahAsal || "SMP Asal",
        jurusan_1: formData.jurusan1 || "PPLG",
        status: "Pending",
        tgl_daftar: new Date().toISOString(),
      };
      set((state) => ({
        publicApplicants: [mockSaved, ...state.publicApplicants],
        applicants: [mockSaved, ...state.applicants],
      }));
      addToast("Pendaftaran Baru (Offline)", `Nama: ${mockSaved.nama} - Jurusan: ${mockSaved.jurusan_1}`, "success");
      return { success: true, data: mockSaved };
    }
  },

  verifyApplicant: async (id: number) => {
    const { adminToken } = useAuthStore.getState();
    const { isDemoMode } = useSchoolStore.getState();
    const { addToast } = useToastStore.getState();
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);
    if (!token && !isDemoMode) return;

    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "Approved" }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui status");
      const data = await res.json();
      if (data.success) {
        if (get().wsStatus !== "CONNECTED") addToast("Applicant Approved", `Pendaftar #${id} telah berhasil diverifikasi!`, "success");
        await get().fetchAdminApplicants();
        await get().fetchPublicApplicants();
        await get().fetchActiveStudents();
      } else {
        throw new Error(data.message || "Gagal memperbarui status pendaftar.");
      }
    } catch (err: unknown) {
      console.error("API status update error:", err instanceof Error ? err.message : String(err));
      set((state) => ({
        applicants: state.applicants.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)),
        publicApplicants: state.publicApplicants.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)),
      }));
      addToast("Applicant Approved (Offline)", `Pendaftar #${id} disetujui.`, "success");
    }
  },

  rejectApplicant: async (id: number, alasan_ditolak?: string) => {
    const { adminToken } = useAuthStore.getState();
    const { isDemoMode } = useSchoolStore.getState();
    const { addToast } = useToastStore.getState();
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);
    if (!token && !isDemoMode) return;

    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "Rejected", alasan_ditolak }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui status");
      const data = await res.json();
      if (data.success) {
        const isAdminPath = typeof window !== "undefined" && window.location.pathname.includes("/dashboard");
        if (get().wsStatus !== "CONNECTED" && isAdminPath) addToast("Applicant Rejected", `Calon siswa #${id} telah ditolak.`, "warning");
        await get().fetchAdminApplicants();
        await get().fetchPublicApplicants();
        await get().fetchActiveStudents();
      } else {
        throw new Error(data.message || "Gagal memperbarui status pendaftar.");
      }
    } catch (err: unknown) {
      console.error("API status update error:", err instanceof Error ? err.message : String(err));
      set((state) => ({
        applicants: state.applicants.map((a) => (a.id === id ? { ...a, status: "Rejected", alasan_ditolak } : a)),
        publicApplicants: state.publicApplicants.map((a) => (a.id === id ? { ...a, status: "Rejected", alasan_ditolak } : a)),
      }));
      const isAdminPath = typeof window !== "undefined" && window.location.pathname.includes("/dashboard");
      if (isAdminPath) addToast("Applicant Rejected (Offline)", `Calon siswa #${id} ditolak.`, "warning");
    }
  },

  deleteApplicant: async (id: number) => {
    const { adminToken } = useAuthStore.getState();
    const { isDemoMode } = useSchoolStore.getState();
    const { addToast } = useToastStore.getState();
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);
    if (!token && !isDemoMode) return;

    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      const data = await res.json();
      if (data.success) {
        if (get().wsStatus !== "CONNECTED") addToast("Applicant Deleted", `Data pendaftar #${id} telah dihapus permanen.`, "danger");
        await get().fetchAdminApplicants();
        await get().fetchPublicApplicants();
        await get().fetchActiveStudents();
      } else {
        throw new Error(data.message || "Gagal menghapus data pendaftar.");
      }
    } catch (err: unknown) {
      console.error("API delete error:", err instanceof Error ? err.message : String(err));
      set((state) => ({
        applicants: state.applicants.filter((a) => a.id !== id),
        publicApplicants: state.publicApplicants.filter((a) => a.id !== id),
      }));
      addToast("Applicant Deleted (Offline)", `Pendaftar #${id} dihapus.`, "danger");
    }
  },

  updateApplicant: async (id: number, updatedData) => {
    const { adminToken } = useAuthStore.getState();
    const { isDemoMode } = useSchoolStore.getState();
    const { addToast } = useToastStore.getState();
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);
    if (!token && !isDemoMode) return { success: false, message: "Tidak terautentikasi." };

    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Gagal memperbarui data");
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data pendaftar ${updatedData.nama || "#" + id} berhasil disimpan.`, "success");
        await get().fetchAdminApplicants();
        await get().fetchPublicApplicants();
        await get().fetchActiveStudents();
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || "Gagal memperbarui data");
      }
    } catch (err: unknown) {
      console.error("API update error:", err instanceof Error ? err.message : String(err));
      set((state) => ({
        applicants: state.applicants.map((a) => (a.id === id ? { ...a, ...updatedData } : a)),
        publicApplicants: state.publicApplicants.map((a) => (a.id === id ? { ...a, ...updatedData } : a)),
      }));
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  },

  updateActiveStudent: async (id: number, updatedData) => {
    const { adminToken } = useAuthStore.getState();
    const { isDemoMode } = useSchoolStore.getState();
    const { addToast } = useToastStore.getState();
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);
    if (!token && !isDemoMode) return { success: false, message: "Tidak terautentikasi." };

    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`/api/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) throw new Error("Gagal memperbarui data siswa aktif.");
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data siswa aktif ${updatedData.nama || "#" + id} berhasil disimpan.`, "success");
        await get().fetchActiveStudents();
        await get().fetchAdminApplicants();
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || "Gagal memperbarui data siswa aktif.");
      }
    } catch (err: unknown) {
      console.warn("Active student update falling back to local:", err instanceof Error ? err.message : String(err));
      try {
        const raw = localStorage.getItem("ppdb_class_overrides") || "{}";
        const overrides = JSON.parse(raw);
        overrides[String(id)] = { ...overrides[String(id)], ...updatedData };
        localStorage.setItem("ppdb_class_overrides", JSON.stringify(overrides));
      } catch {}

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updater = (prev: any[]) => prev.map((a: any) => (a.id === id ? { ...a, ...updatedData } : a));
      get().setActiveStudents(updater);
      get().setApplicants(updater);
      get().setPublicApplicants(updater);
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  },

  deleteActiveStudent: async (id: number) => {
    const { adminToken } = useAuthStore.getState();
    const { isDemoMode } = useSchoolStore.getState();
    const { addToast } = useToastStore.getState();
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);
    if (!token && !isDemoMode) return;

    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`/api/applicants/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) throw new Error("Gagal menghapus siswa aktif.");
      const data = await res.json();
      if (data.success) {
        addToast("Siswa Dihapus", `Siswa aktif #${id} telah dihapus.`, "danger");
        await get().fetchActiveStudents();
        await get().fetchAdminApplicants();
      } else {
        throw new Error(data.message || "Gagal menghapus siswa aktif.");
      }
    } catch (err: unknown) {
      console.error("API active student delete error:", err instanceof Error ? err.message : String(err));
      set((state) => ({
        activeStudents: state.activeStudents.filter((a) => a.id !== id),
        applicants: state.applicants.filter((a) => a.id !== id),
        publicApplicants: state.publicApplicants.filter((a) => a.id !== id),
      }));
      addToast("Siswa Dihapus (Offline)", `Siswa aktif #${id} dihapus.`, "danger");
    }
  },

  simulateRegistration: async () => {
    const mockCandidate = {
      nama: "Siswa Simulasi " + Math.floor(Math.random() * 1000),
      nisn: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      nik: "3276" + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      sekolahAsal: "SMP Negeri " + Math.floor(Math.random() * 20 + 1) + " Depok",
      jurusan1: ["RPL", "TJKT", "DKV", "BC", "ANM", "TE"][Math.floor(Math.random() * 6)],
      jurusan2: ["RPL", "TJKT", "DKV", "BC", "ANM", "TE"][Math.floor(Math.random() * 6)],
      tempatLahir: "Depok",
      tanggalLahir: "2009-05-12",
      jenisKelamin: Math.random() > 0.5 ? "Laki-laki" : "Perempuan",
      agama: "Islam",
      alamat: "Jl. Margonda Raya No. " + Math.floor(Math.random() * 100 + 1),
      telepon: "08" + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      email: `simulasi${Date.now()}@example.com`,
      namaOrtu: "Orang Tua Siswa",
      pekerjaanOrtu: "Karyawan Swasta",
      teleponOrtu: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      janjiTaat: true,
      janjiSanksi: true,
      janjiAkrab: true,
      janjiBelajar: true,
      janjiNamaBaik: true,
    };
    await get().registerApplicant(mockCandidate);
  },

  checkPaymentStatus: async (nisn: string) => {
    try {
      const res = await fetch(`/applicants/check-payment/${nisn}`);
      return await res.json();
    } catch (err: unknown) {
      console.error("Check payment status failed:", err instanceof Error ? err.message : String(err));
      return { success: false, message: err instanceof Error ? err.message : String(err) };
    }
  },

  initRealtimeSubscription: (schoolIdParam?: string) => {
    if (typeof window === "undefined") return () => {};
    const { isDemoMode, schoolId: storeSchoolId } = useSchoolStore.getState();
    const effectiveSchoolId = schoolIdParam || storeSchoolId;

    if (isDemoMode) return () => {};
    const supabase = getBrowserSupabase();
    if (!supabase) return () => {};

    const channelName = effectiveSchoolId ? `ppdb:applicants:${effectiveSchoolId}` : "ppdb:applicants:all";
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "student_applicants",
          ...(effectiveSchoolId ? { filter: `school_id=eq.${effectiveSchoolId}` } : {}),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const newApp = payload.new;
            set((state) => ({
              applicants: [newApp, ...state.applicants.filter((a) => a.id !== newApp.id)],
              publicApplicants: [newApp, ...state.publicApplicants.filter((a) => a.id !== newApp.id)],
            }));
            useToastStore.getState().addToast("Pendaftaran Baru", `${newApp.nama} - ${newApp.jurusan_1 || newApp.jurusan || "Baru"}`, "success");
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new;
            set((state) => ({
              applicants: state.applicants.map((a) => (a.id === updated.id ? updated : a)),
              publicApplicants: state.publicApplicants.map((a) => (a.id === updated.id ? updated : a)),
              activeStudents:
                updated.status === "Approved"
                  ? [updated, ...state.activeStudents.filter((a) => a.id !== updated.id)]
                  : state.activeStudents.filter((a) => a.id !== updated.id),
            }));
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old?.id;
            if (oldId) {
              set((state) => ({
                applicants: state.applicants.filter((a) => a.id !== oldId),
                publicApplicants: state.publicApplicants.filter((a) => a.id !== oldId),
                activeStudents: state.activeStudents.filter((a) => a.id !== oldId),
              }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          set({ wsStatus: "CONNECTED" });
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          set({ wsStatus: "DISCONNECTED" });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
