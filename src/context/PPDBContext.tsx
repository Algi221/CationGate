"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";

import { ToastProvider, useToast } from "./ToastContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { SchoolProvider, useSchool } from "./SchoolContext";
import { getBrowserSupabase } from "@/lib/supabase-client";

export { useToast } from "./ToastContext";
export { useAuth } from "./AuthContext";
export { useSchool } from "./SchoolContext";

interface WsLog {
  id: string;
  timestamp: string;
  direction: string;
  event: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

interface PPDBContextType {
  isLoaded: boolean;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;

  adminToken: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminUser: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAdminUser: React.Dispatch<React.SetStateAction<any | null>>;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginGatekeeper: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  logoutGatekeeper: () => void;
  gatekeeperToken: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gatekeeperUser: any | null;

  schoolId: string;
  schoolStatus: string;
  isDemoMode: boolean;
  isSchoolNotFound: boolean;
  isConfigLoaded: boolean;
  ppdbLogo: string;
  ppdbTitle: string;
  ppdbFooterDesc: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profilSekolah: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProfilSekolah: React.Dispatch<React.SetStateAction<any>>;
  fetchConfigs: () => Promise<void>;

  toasts: { id: string; title: string; message: string; type: string }[];
  addToast: (title: string, message: string, type?: string) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicants: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setApplicants: React.Dispatch<React.SetStateAction<any[]>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicApplicants: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeStudents: any[];
  wsStatus: string;
  wsLogs: WsLog[];
  simulationActive: boolean;
  setSimulationActive: React.Dispatch<React.SetStateAction<boolean>>;

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
  fetchPublicApplicants: () => Promise<void>;
  fetchAdminApplicants: () => Promise<void>;
  fetchActiveStudents: () => Promise<void>;
  simulateRegistration: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkPaymentStatus: (nisn: string) => Promise<any>;
}

const PPDBContext = createContext<PPDBContextType | null>(null);

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const NAMES_FIRST = ["Ahmad", "Budi", "Cinta", "Dewi", "Eka", "Fahri", "Gita", "Hani", "Indra", "Joko", "Kartika", "Lestari", "Muhammad", "Nabila", "Oktavia", "Putri", "Qori", "Rizky", "Siti", "Taufik", "Umar", "Vina", "Wahyu", "Xena", "Yusuf", "Zahra"];
const NAMES_LAST = ["Pratama", "Wijaya", "Santoso", "Lestari", "Putra", "Kusuma", "Hidayat", "Saputra", "Ramadhan", "Nugraha", "Permana", "Wibowo", "Utami", "Sari", "Firmansyah", "Syahputra", "Subagyo", "Setiawan", "Bahri", "Hasanah"];
const MAJORS_LIST = ["Rekayasa Perangkat Lunak", "Teknik Komputer dan Jaringan", "Desain Komunikasi Visual", "Broadcasting dan Perfilman", "Animasi", "Teknik Elektronika"];
const SCHOOLS_ORIGIN = ["SMPN 1 Depok", "SMPN 2 Depok", "SMPN 4 Jakarta", "SMP Al-Azhar 9", "SMPN 1 Bogor", "SMP YPB Depok", "SMP PGRI 1", "SMPN 3 Bekasi"];

function generateDemoApplicants() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  const statuses = ["Approved", "Approved", "Pending", "Approved", "Pending", "Rejected"];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  for (let i = 1; i <= 50; i++) {
    const fn = NAMES_FIRST[i % NAMES_FIRST.length];
    const ln = NAMES_LAST[(i * 3) % NAMES_LAST.length];
    const nisn = `008${1000000 + i * 12345}`.slice(0, 10);
    const major = MAJORS_LIST[i % MAJORS_LIST.length];
    const status = statuses[i % statuses.length];
    const school = SCHOOLS_ORIGIN[i % SCHOOLS_ORIGIN.length];
    const daysAgo = (i % 7);
    const dateStr = new Date(now - daysAgo * dayMs - (i * 3600000)).toISOString();
    const gender = (i % 2 === 0) ? "L" : "P";
    result.push({ id: i, nama: `${fn} ${ln}`, nisn, sekolah_asal: school, jurusan_1: major, status, tgl_daftar: dateStr, jenis_kelamin: gender, jenisKelamin: gender, alasan_ditolak: status === "Rejected" ? "Berkas administrasi tidak memenuhi kelengkapan NISN" : null });
  }
  return result;
}

function generateDemoActiveStudents() {
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
      const kelasCode = major === "Rekayasa Perangkat Lunak" ? "RPL" : major.slice(0, 4).toUpperCase();
      const gender = (i % 2 === 0) ? "P" : "L";
      result.push({ id: idCounter, nama: `${fn} ${ln}`, nisn, periode, kelas: `${kelasGrade} ${kelasCode} ${(i % 3) + 1}`, jurusan_1: major, sekolah_asal: SCHOOLS_ORIGIN[i % SCHOOLS_ORIGIN.length], status: "Approved", jenis_kelamin: gender, jenisKelamin: gender, tgl_daftar: "2025-07-15T08:00:00.000Z" });
      idCounter++;
    }
  });
  return result;
}

const DEMO_APPLICANTS_SEED = generateDemoApplicants();
const DEMO_ACTIVE_STUDENTS_SEED = generateDemoActiveStudents();

// ─── Inner Provider (has access to sub-contexts) ──────────────────────────────
function PPDBInnerProvider({ children }: { children: React.ReactNode }) {
  const { adminToken, adminUser, setAdminUser, loginAdmin, loginGatekeeper, logoutAdmin, logoutGatekeeper, gatekeeperToken, gatekeeperUser } = useAuth();
  const { schoolId, schoolStatus, isDemoMode, isSchoolNotFound, isConfigLoaded, ppdbLogo, ppdbTitle, ppdbFooterDesc, profilSekolah, setProfilSekolah, fetchConfigs } = useSchool();
  const { toasts, addToast } = useToast();

  const [isLoaded, setIsLoaded] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("cationgate_loading_session") !== "active";
    }
    return true;
  });
  const params = useParams();
  const slug = (params?.school_slug as string) || "";

  useEffect(() => {
    const handleLoadingComplete = () => setIsLoaded(true);
    window.addEventListener("cationgate:loading-complete", handleLoadingComplete);
    return () => window.removeEventListener("cationgate:loading-complete", handleLoadingComplete);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [applicants, setApplicants] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [publicApplicants, setPublicApplicants] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [wsStatus, setWsStatus] = useState<string>("SYNCING (15s)");
  const [wsLogs, setWsLogs] = useState<WsLog[]>([]);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);

  useEffect(() => {
    if (applicants.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('demo_admin_applicants', JSON.stringify(applicants));
    }
  }, [applicants]);

  useEffect(() => {
    if (publicApplicants.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('demo_public_applicants', JSON.stringify(publicApplicants));
    }
  }, [publicApplicants]);

  useEffect(() => {
    if (activeStudents.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('demo_active_students', JSON.stringify(activeStudents));
    }
  }, [activeStudents]);

  const adminTokenRef = useRef<string | null>(adminToken);

  useEffect(() => { adminTokenRef.current = adminToken; }, [adminToken]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _addWsLog = useCallback((direction: string, event: string, payload: any) => {
    setWsLogs((prev) => [{ id: Date.now() + Math.random().toString(36).substr(2, 9), timestamp: new Date().toLocaleTimeString(), direction, event, payload }, ...prev.slice(0, 49)]);
  }, []);

  // ── Fetch Functions ─────────────────────────────────────────────────────────
  const fetchPublicApplicants = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_public_applicants');
      if (localStr) { try { setPublicApplicants(JSON.parse(localStr)); return; } catch (_e) {} }
      setPublicApplicants(DEMO_APPLICANTS_SEED);
      return;
    }
    try {
      const url = slug ? `${BACKEND_URL}/applicants/public?school_slug=${slug}` : `${BACKEND_URL}/applicants/public`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) setPublicApplicants(data.data);
    } catch (err: unknown) {
      console.warn("Public API fetch error, using local fallback seed:", err instanceof Error ? err.message : String(err));
      setPublicApplicants(prev => prev.length > 0 ? prev : DEMO_APPLICANTS_SEED);
    }
  }, [isDemoMode, slug]);

  // Merge offline class-assignment overrides into API data so refreshes don't wipe them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyClassOverrides = (list: any[]): any[] => {
    try {
      const raw = localStorage.getItem('ppdb_class_overrides');
      if (!raw) return list;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const overrides: Record<string, any> = JSON.parse(raw);
      if (!Object.keys(overrides).length) return list;
      return list.map(a => {
        const o = overrides[String(a.id)];
        return o ? { ...a, ...o } : a;
      });
    } catch { return list; }
  };

  const fetchAdminApplicants = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_admin_applicants');
      if (localStr) { try { setApplicants(JSON.parse(localStr)); return; } catch (_e) {} }
      setApplicants(DEMO_APPLICANTS_SEED);
      return;
    }
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/applicants`, { headers: { "Authorization": `Bearer ${token}` } });
      if (res.status === 401) { console.warn("Token is invalid or expired. Logging out admin."); logoutAdmin(); return; }
      const data = await res.json();
      if (data.success) setApplicants(applyClassOverrides(data.data));
    } catch (err: unknown) {
      console.warn("Admin API fetch error:", err instanceof Error ? err.message : String(err));
      setApplicants(DEMO_APPLICANTS_SEED);
    }
  }, [adminToken, logoutAdmin, isDemoMode]);

  const fetchActiveStudents = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_active_students');
      if (localStr) { try { setActiveStudents(JSON.parse(localStr)); return; } catch (_e) {} }
      setActiveStudents(DEMO_ACTIVE_STUDENTS_SEED);
      return;
    }
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/applicants`, { headers: { "Authorization": `Bearer ${token}` } });
      if (res.status === 401) { console.warn("Token is invalid or expired. Logging out admin."); logoutAdmin(); return; }
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (data.success) { setActiveStudents(applyClassOverrides(data.data.filter((a: any) => a.status === 'Approved'))); }
    } catch (err: unknown) {
      console.warn("Active students API fetch error:", err instanceof Error ? err.message : String(err));
    }
  }, [adminToken, logoutAdmin, isDemoMode]);

  // ── CRUD Operations ─────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registerApplicant = useCallback(async (formData: any) => {
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { await fetchPublicApplicants(); return { success: true, data: data.data }; }
      else { return { success: false, message: data.message }; }
    } catch (err: unknown) {
      console.error("API registration error, adding to memory fallback:", err instanceof Error ? err.message : String(err));
      const mockSaved = { id: Date.now(), nama: formData.nama || "Pendaftar Baru", nisn: formData.nisn || "0000000000", sekolah_asal: formData.sekolahAsal || "SMP Asal", jurusan_1: formData.jurusan1 || "PPLG", status: "Pending", tgl_daftar: new Date().toISOString() };
      setPublicApplicants(prev => [mockSaved, ...prev]);
      setApplicants(prev => [mockSaved, ...prev]);
      addToast("Pendaftaran Baru (Offline)", `Nama: ${mockSaved.nama} - Jurusan: ${mockSaved.jurusan_1}`, "success");
      return { success: true, data: mockSaved };
    }
  }, [fetchPublicApplicants, addToast, isDemoMode]);

  const verifyApplicant = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token && !isDemoMode) return;
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ status: "Approved" }) });
      if (!res.ok) throw new Error("Gagal memperbarui status");
      const data = await res.json();
      if (data.success) {
        if (wsStatus !== "CONNECTED") addToast("Applicant Approved", `Pendaftar #${id} telah berhasil diverifikasi!`, "success");
        await fetchAdminApplicants(); await fetchPublicApplicants(); await fetchActiveStudents();
      } else { throw new Error(data.message || "Gagal memperbarui status pendaftar."); }
    } catch (err: unknown) {
      console.error("API status update error:", err instanceof Error ? err.message : String(err));
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
      addToast("Applicant Approved (Offline)", `Pendaftar #${id} disetujui.`, "success");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus, isDemoMode]);

  const rejectApplicant = useCallback(async (id: number, alasan_ditolak?: string) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token && !isDemoMode) return;
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ status: "Rejected", alasan_ditolak }) });
      if (!res.ok) throw new Error("Gagal memperbarui status");
      const data = await res.json();
      if (data.success) {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard');
        if (wsStatus !== "CONNECTED" && isAdminPath) addToast("Applicant Rejected", `Calon siswa #${id} telah ditolak.`, "warning");
        await fetchAdminApplicants(); await fetchPublicApplicants(); await fetchActiveStudents();
      } else {
        throw new Error(data.message || "Gagal memperbarui status pendaftar.");
      }
    } catch (err: unknown) {
      console.error("API status update error:", err instanceof Error ? err.message : String(err));
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected", alasan_ditolak } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected", alasan_ditolak } : a));
      const isAdminPath = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard');
      if (isAdminPath) addToast("Applicant Rejected (Offline)", `Calon siswa #${id} ditolak.`, "warning");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus, isDemoMode]);

  const deleteApplicant = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token && !isDemoMode) return;
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      if (!res.ok) throw new Error("Gagal menghapus data");
      const data = await res.json();
      if (data.success) {
        if (wsStatus !== "CONNECTED") addToast("Applicant Deleted", `Data pendaftar #${id} telah dihapus permanen.`, "danger");
        await fetchAdminApplicants(); await fetchPublicApplicants(); await fetchActiveStudents();
      } else { throw new Error(data.message || "Gagal menghapus data pendaftar."); }
    } catch (err: unknown) {
      console.error("API delete error:", err instanceof Error ? err.message : String(err));
      setApplicants(prev => prev.filter(a => a.id !== id));
      setPublicApplicants(prev => prev.filter(a => a.id !== id));
      addToast("Applicant Deleted (Offline)", `Pendaftar #${id} dihapus.`, "danger");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus, isDemoMode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateApplicant = useCallback(async (id: number, updatedData: any) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token && !isDemoMode) return { success: false, message: "Tidak terautentikasi." };
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(updatedData) });
      if (!res.ok) throw new Error("Gagal memperbarui data");
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data pendaftar ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchAdminApplicants(); await fetchPublicApplicants(); await fetchActiveStudents();
        return { success: true, data: data.data };
      } else { throw new Error(data.message || "Gagal memperbarui data"); }
    } catch (err: unknown) {
      console.error("API update error:", err instanceof Error ? err.message : String(err));
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, isDemoMode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateActiveStudent = useCallback(async (id: number, updatedData: any) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token && !isDemoMode) return { success: false, message: "Tidak terautentikasi." };
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`/api/applicants/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(updatedData) });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) throw new Error("Gagal memperbarui data siswa aktif.");
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data siswa aktif ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchActiveStudents(); await fetchAdminApplicants();
        return { success: true, data: data.data };
      } else { throw new Error(data.message || "Gagal memperbarui data siswa aktif."); }
    } catch (err: unknown) {
      // API unavailable or demo mode — apply update locally and persist
      console.warn("Active student update falling back to local:", err instanceof Error ? err.message : String(err));
      // Save override so it survives re-fetch from real API on refresh
      try {
        const raw = localStorage.getItem('ppdb_class_overrides') || '{}';
        const overrides = JSON.parse(raw);
        overrides[String(id)] = { ...overrides[String(id)], ...updatedData };
        localStorage.setItem('ppdb_class_overrides', JSON.stringify(overrides));
      } catch (_) {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updater = (prev: any[]) => prev.map((a: any) => a.id === id ? { ...a, ...updatedData } : a);
      setActiveStudents(prev => {
        const next = updater(prev);
        try { localStorage.setItem('demo_active_students', JSON.stringify(next)); } catch (_) {}
        return next;
      });
      setApplicants(prev => {
        const next = updater(prev);
        try { localStorage.setItem('demo_admin_applicants', JSON.stringify(next)); } catch (_) {}
        return next;
      });
      setPublicApplicants(prev => updater(prev));
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  }, [adminToken, fetchActiveStudents, fetchAdminApplicants, addToast, isDemoMode]);

  const deleteActiveStudent = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token && !isDemoMode) return;
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`/api/applicants/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) throw new Error("Gagal menghapus siswa aktif.");
      const data = await res.json();
      if (data.success) {
        addToast("Siswa Dihapus", `Siswa aktif #${id} telah dihapus.`, "danger");
        await fetchActiveStudents(); await fetchAdminApplicants();
      } else { throw new Error(data.message || "Gagal menghapus siswa aktif."); }
    } catch (err: unknown) {
      console.error("API active student delete error:", err instanceof Error ? err.message : String(err));
      setActiveStudents(prev => prev.filter(a => a.id !== id));
      setApplicants(prev => prev.filter(a => a.id !== id));
      setPublicApplicants(prev => prev.filter(a => a.id !== id));
      addToast("Siswa Dihapus (Offline)", `Siswa aktif #${id} dihapus.`, "danger");
    }
  }, [adminToken, fetchActiveStudents, fetchAdminApplicants, addToast, isDemoMode]);

  // ── Supabase Realtime Subscription ──────────────────────────────────────────
  useEffect(() => {
    if (isDemoMode || typeof window === "undefined") return;
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    const channelName = schoolId ? `ppdb:applicants:${schoolId}` : "ppdb:applicants:all";
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "student_applicants",
          ...(schoolId ? { filter: `school_id=eq.${schoolId}` } : {})
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const newApp = payload.new;
            setApplicants((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
            setPublicApplicants((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
            addToast("Pendaftaran Baru", `${newApp.nama} - ${newApp.jurusan_1 || newApp.jurusan || "Baru"}`, "success");
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new;
            setApplicants((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setPublicApplicants((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            if (updated.status === "Approved") {
              setActiveStudents((prev) => [updated, ...prev.filter((a) => a.id !== updated.id)]);
            } else {
              setActiveStudents((prev) => prev.filter((a) => a.id !== updated.id));
            }
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old?.id;
            if (oldId) {
              setApplicants((prev) => prev.filter((a) => a.id !== oldId));
              setPublicApplicants((prev) => prev.filter((a) => a.id !== oldId));
              setActiveStudents((prev) => prev.filter((a) => a.id !== oldId));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setWsStatus("CONNECTED");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setWsStatus("DISCONNECTED");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [schoolId, isDemoMode, addToast]);

  // ── Simulation ──────────────────────────────────────────────────────────────
  const simulateRegistration = useCallback(async () => {
    const mockCandidate = {
      nama: "Siswa Simulasi " + Math.floor(Math.random() * 1000),
      nisn: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      nik: "3276" + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      sekolahAsal: "SMP Negeri " + Math.floor(Math.random() * 20 + 1) + " Depok",
      jurusan1: ["RPL", "TJKT", "DKV", "BC", "ANM", "TE"][Math.floor(Math.random() * 6)],
      jurusan2: ["RPL", "TJKT", "DKV", "BC", "ANM", "TE"][Math.floor(Math.random() * 6)],
      tempatLahir: "Depok", tanggalLahir: "2009-05-12", jenisKelamin: Math.random() > 0.5 ? "Laki-laki" : "Perempuan",
      agama: "Islam", alamat: "Jl. Margonda Raya No. " + Math.floor(Math.random() * 100 + 1),
      telepon: "08" + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      email: `simulasi${Date.now()}@example.com`, namaOrtu: "Orang Tua Siswa", pekerjaanOrtu: "Karyawan Swasta",
      teleponOrtu: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      janjiTaat: true, janjiSanksi: true, janjiAkrab: true, janjiBelajar: true, janjiNamaBaik: true
    };
    await registerApplicant(mockCandidate);
  }, [registerApplicant]);

  const checkPaymentStatus = useCallback(async (nisn: string) => {
    try {
      const res = await fetch(`/applicants/check-payment/${nisn}`);
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      console.error("Check payment status failed:", err instanceof Error ? err.message : String(err));
      return { success: false, message: err instanceof Error ? err.message : String(err) };
    }
  }, []);

  // ── Side Effects ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!simulationActive) return;
    const intervalId = setInterval(() => simulateRegistration(), 25000);
    return () => clearInterval(intervalId);
  }, [simulationActive, simulateRegistration]);

  useEffect(() => {
    let ignore = false;
    const loadPublic = async () => {
      if (!ignore) {
        await fetchPublicApplicants();
      }
    };
    loadPublic();
    return () => {
      ignore = true;
    };
  }, [fetchPublicApplicants]);

  useEffect(() => {
    let ignore = false;
    const loadAdmin = async () => {
      if (!ignore) {
        if (isDemoMode) {
          await fetchAdminApplicants();
          await fetchActiveStudents();
        } else if (adminToken && (!adminUser || (adminUser.role !== 'gatekeeper' && !adminUser.isGatekeeper))) {
          await fetchAdminApplicants();
          await fetchActiveStudents();
        }
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
    };
    loadAdmin();
    return () => {
      ignore = true;
    };
  }, [adminToken, adminUser, fetchAdminApplicants, fetchActiveStudents, isDemoMode]);

  return (
    <PPDBContext.Provider
      value={{
        isLoaded, setIsLoaded,
        applicants, setApplicants, publicApplicants, activeStudents,
        adminToken, adminUser, setAdminUser,
        wsStatus, toasts, wsLogs,
        simulationActive, setSimulationActive,
        registerApplicant, verifyApplicant, rejectApplicant, deleteApplicant,
        updateApplicant, updateActiveStudent, deleteActiveStudent,
        loginAdmin, loginGatekeeper, logoutAdmin, logoutGatekeeper,
        gatekeeperToken, gatekeeperUser,
        fetchPublicApplicants, fetchAdminApplicants, fetchActiveStudents,
        simulateRegistration, addToast, checkPaymentStatus,
        ppdbLogo, ppdbTitle, ppdbFooterDesc, profilSekolah, setProfilSekolah, fetchConfigs,
        schoolId, schoolStatus, isDemoMode, isSchoolNotFound, isConfigLoaded
      }}
    >
      {children}
    </PPDBContext.Provider>
  );
}

// ─── Public Provider (wraps all sub-providers) ────────────────────────────────
export function PPDBProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SchoolProvider>
        <PPDBInnerWithAuth>{children}</PPDBInnerWithAuth>
      </SchoolProvider>
    </ToastProvider>
  );
}

// AuthProvider needs schoolId from SchoolContext, so we bridge it
function PPDBInnerWithAuth({ children }: { children: React.ReactNode }) {
  const { schoolId } = useSchool();
  return (
    <AuthProvider schoolId={schoolId}>
      <PPDBInnerProvider>{children}</PPDBInnerProvider>
    </AuthProvider>
  );
}

// ─── Hook (unchanged API for all consumers) ──────────────────────────────────
export function usePPDB() {
  const context = useContext(PPDBContext);
  if (!context) {
    throw new Error("usePPDB must be used within a PPDBProvider");
  }
  return context;
}
