import { create } from "zustand";
import { useToastStore } from "./useToastStore";
import { useAuthStore } from "./useAuthStore";
import { useSchoolStore } from "./useSchoolStore";
import { getBrowserSupabase } from "@/lib/supabase-client";
import { WsLog, PPDBApplicant } from "./types/ppdbTypes";
import { 
  generateDemoApplicants, 
  generateDemoTrashedApplicants, 
  generateDemoActiveStudents,
  DEMO_TRASHED_APPLICANTS_SEED 
} from "./slices/demoApplicantGenerator";

export type { WsLog, PPDBApplicant };
export { 
  generateDemoApplicants, 
  generateDemoTrashedApplicants, 
  generateDemoActiveStudents,
  DEMO_TRASHED_APPLICANTS_SEED 
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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
        if (data.data.length === 0 && schoolSlug === "demo") {
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
      const url = schoolSlug ? `${BACKEND_URL}/applicants?school_slug=${encodeURIComponent(schoolSlug)}` : `${BACKEND_URL}/applicants`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
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
      const url = schoolSlug ? `${BACKEND_URL}/applicants?school_slug=${encodeURIComponent(schoolSlug)}` : `${BACKEND_URL}/applicants`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
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
