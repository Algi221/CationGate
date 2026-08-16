"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, usePathname } from "next/navigation";

// ─── Sub-context imports ──────────────────────────────────────────────────────
import { ToastProvider, useToast } from "./ToastContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { SchoolProvider, useSchool } from "./SchoolContext";

// Re-export sub-context hooks for direct usage
export { useToast } from "./ToastContext";
export { useAuth } from "./AuthContext";
export { useSchool } from "./SchoolContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WsLog {
  id: string;
  timestamp: string;
  direction: string;
  event: string;
  payload: any;
}

interface PPDBContextType {
  isLoaded: boolean;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  // Auth (proxied from AuthContext)
  adminToken: string | null;
  adminUser: any | null;
  setAdminUser: React.Dispatch<React.SetStateAction<any | null>>;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginGatekeeper: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  // School (proxied from SchoolContext)
  schoolId: string;
  schoolStatus: string;
  isDemoMode: boolean;
  isSchoolNotFound: boolean;
  ppdbLogo: string;
  ppdbTitle: string;
  profilSekolah: any;
  setProfilSekolah: React.Dispatch<React.SetStateAction<any>>;
  fetchConfigs: () => Promise<void>;
  // Toast (proxied from ToastContext)
  toasts: { id: string; title: string; message: string; type: string }[];
  addToast: (title: string, message: string, type?: string) => void;
  // Applicant Data
  applicants: any[];
  setApplicants: React.Dispatch<React.SetStateAction<any[]>>;
  publicApplicants: any[];
  activeStudents: any[];
  wsStatus: string;
  wsLogs: WsLog[];
  simulationActive: boolean;
  setSimulationActive: React.Dispatch<React.SetStateAction<boolean>>;
  registerApplicant: (formData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  verifyApplicant: (id: number) => Promise<void>;
  rejectApplicant: (id: number, alasan_ditolak?: string) => Promise<void>;
  deleteApplicant: (id: number) => Promise<void>;
  updateApplicant: (id: number, updatedData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  updateActiveStudent: (id: number, updatedData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  deleteActiveStudent: (id: number) => Promise<void>;
  fetchPublicApplicants: () => Promise<void>;
  fetchAdminApplicants: () => Promise<void>;
  fetchActiveStudents: () => Promise<void>;
  simulateRegistration: () => Promise<void>;
  checkPaymentStatus: (nisn: string) => Promise<any>;
}

const PPDBContext = createContext<PPDBContextType | null>(null);

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// ─── Demo Data Generators ─────────────────────────────────────────────────────
const NAMES_FIRST = ["Ahmad", "Budi", "Cinta", "Dewi", "Eka", "Fahri", "Gita", "Hani", "Indra", "Joko", "Kartika", "Lestari", "Muhammad", "Nabila", "Oktavia", "Putri", "Qori", "Rizky", "Siti", "Taufik", "Umar", "Vina", "Wahyu", "Xena", "Yusuf", "Zahra"];
const NAMES_LAST = ["Pratama", "Wijaya", "Santoso", "Lestari", "Putra", "Kusuma", "Hidayat", "Saputra", "Ramadhan", "Nugraha", "Permana", "Wibowo", "Utami", "Sari", "Firmansyah", "Syahputra", "Subagyo", "Setiawan", "Bahri", "Hasanah"];
const MAJORS_LIST = ["Rekayasa Perangkat Lunak", "Teknik Komputer dan Jaringan", "Desain Komunikasi Visual", "Broadcasting dan Perfilman", "Animasi", "Teknik Elektronika"];
const SCHOOLS_ORIGIN = ["SMPN 1 Depok", "SMPN 2 Depok", "SMPN 4 Jakarta", "SMP Al-Azhar 9", "SMPN 1 Bogor", "SMP YPB Depok", "SMP PGRI 1", "SMPN 3 Bekasi"];

function generateDemoApplicants() {
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
    result.push({ id: i, nama: `${fn} ${ln}`, nisn, sekolah_asal: school, jurusan_1: major, status, tgl_daftar: dateStr, alasan_ditolak: status === "Rejected" ? "Berkas administrasi tidak memenuhi kelengkapan NISN" : null });
  }
  return result;
}

function generateDemoActiveStudents() {
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
      result.push({ id: idCounter, nama: `${fn} ${ln}`, nisn, periode, kelas: `${kelasGrade} ${kelasCode} ${(i % 3) + 1}`, jurusan_1: major, sekolah_asal: SCHOOLS_ORIGIN[i % SCHOOLS_ORIGIN.length], status: "Approved", tgl_daftar: "2025-07-15T08:00:00.000Z" });
      idCounter++;
    }
  });
  return result;
}

const DEMO_APPLICANTS_SEED = generateDemoApplicants();
const DEMO_ACTIVE_STUDENTS_SEED = generateDemoActiveStudents();

// ─── Inner Provider (has access to sub-contexts) ──────────────────────────────
function PPDBInnerProvider({ children }: { children: React.ReactNode }) {
  const { adminToken, adminUser, setAdminUser, loginAdmin, loginGatekeeper, logoutAdmin } = useAuth();
  const { schoolId, schoolStatus, isDemoMode, isSchoolNotFound, ppdbLogo, ppdbTitle, profilSekolah, setProfilSekolah, fetchConfigs } = useSchool();
  const { toasts, addToast } = useToast();

  const [isLoaded, setIsLoaded] = useState(false);
  const params = useParams();
  const slug = (params?.school_slug as string) || "";

  useEffect(() => {
    const handleLoadingComplete = () => setIsLoaded(true);
    if (sessionStorage.getItem("cationgate_loading_session") !== "active") {
        setIsLoaded(true);
    }
    window.addEventListener("cationgate:loading-complete", handleLoadingComplete);
    return () => window.removeEventListener("cationgate:loading-complete", handleLoadingComplete);
  }, []);

  const [applicants, setApplicants] = useState<any[]>([]);
  const [publicApplicants, setPublicApplicants] = useState<any[]>([]);
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [wsStatus, setWsStatus] = useState<string>("SYNCING (15s)");
  const [wsLogs, setWsLogs] = useState<WsLog[]>([]);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const connectWsRef = useRef<(() => void) | null>(null);
  const adminTokenRef = useRef<string | null>(adminToken);

  useEffect(() => { adminTokenRef.current = adminToken; }, [adminToken]);

  const addWsLog = useCallback((direction: string, event: string, payload: any) => {
    setWsLogs((prev) => [{ id: Date.now() + Math.random().toString(36).substr(2, 9), timestamp: new Date().toLocaleTimeString(), direction, event, payload }, ...prev.slice(0, 49)]);
  }, []);

  // ── Fetch Functions ─────────────────────────────────────────────────────────
  const fetchPublicApplicants = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_public_applicants');
      if (localStr) { try { setPublicApplicants(JSON.parse(localStr)); return; } catch (e) {} }
      setPublicApplicants(DEMO_APPLICANTS_SEED);
      return;
    }
    try {
      const url = slug ? `${BACKEND_URL}/applicants/public?school_slug=${slug}` : `${BACKEND_URL}/applicants/public`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) setPublicApplicants(data.data);
    } catch (err: any) {
      console.warn("Public API fetch error, using local fallback seed:", err.message);
      setPublicApplicants(prev => prev.length > 0 ? prev : DEMO_APPLICANTS_SEED);
    }
  }, [isDemoMode, slug]);

  const fetchAdminApplicants = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_admin_applicants');
      if (localStr) { try { setApplicants(JSON.parse(localStr)); return; } catch (e) {} }
      setApplicants(DEMO_APPLICANTS_SEED);
      return;
    }
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/applicants`, { headers: { "Authorization": `Bearer ${token}` } });
      if (res.status === 401) { console.warn("Token is invalid or expired. Logging out admin."); logoutAdmin(); return; }
      const data = await res.json();
      if (data.success) setApplicants(data.data);
    } catch (err: any) {
      console.warn("Admin API fetch error:", err.message);
      setApplicants(DEMO_APPLICANTS_SEED);
    }
  }, [adminToken, logoutAdmin, isDemoMode]);

  const fetchActiveStudents = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_active_students');
      if (localStr) { try { setActiveStudents(JSON.parse(localStr)); return; } catch (e) {} }
      setActiveStudents(DEMO_ACTIVE_STUDENTS_SEED);
      return;
    }
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/applicants`, { headers: { "Authorization": `Bearer ${token}` } });
      if (res.status === 401) { console.warn("Token is invalid or expired. Logging out admin."); logoutAdmin(); return; }
      const data = await res.json();
      if (data.success) { setActiveStudents(data.data.filter((a: any) => a.status === 'Approved')); }
    } catch (err: any) {
      console.warn("Active students API fetch error:", err.message);
    }
  }, [adminToken, logoutAdmin, isDemoMode]);

  // ── CRUD Operations ─────────────────────────────────────────────────────────
  const registerApplicant = useCallback(async (formData: any) => {
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { await fetchPublicApplicants(); return { success: true, data: data.data }; }
      else { return { success: false, message: data.message }; }
    } catch (err: any) {
      console.error("API registration error, adding to memory fallback:", err.message);
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
      const data = await res.json();
      if (data.success) {
        if (wsStatus !== "CONNECTED") addToast("Applicant Approved", `Pendaftar #${id} telah berhasil diverifikasi!`, "success");
        await fetchAdminApplicants(); await fetchPublicApplicants(); await fetchActiveStudents();
      } else { addToast("Gagal Memverifikasi", data.message || "Gagal memperbarui status pendaftar.", "danger"); }
    } catch (err: any) {
      console.error("API status update error:", err.message);
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
      const data = await res.json();
      if (data.success) {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard');
        if (wsStatus !== "CONNECTED" && isAdminPath) addToast("Applicant Rejected", `Calon siswa #${id} telah ditolak.`, "warning");
        await fetchAdminApplicants(); await fetchPublicApplicants(); await fetchActiveStudents();
      } else {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard');
        if (isAdminPath) addToast("Gagal Menolak", data.message || "Gagal memperbarui status pendaftar.", "danger");
      }
    } catch (err: any) {
      console.error("API status update error:", err.message);
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
      const data = await res.json();
      if (data.success) {
        if (wsStatus !== "CONNECTED") addToast("Applicant Deleted", `Data pendaftar #${id} telah dihapus permanen.`, "danger");
        await fetchAdminApplicants(); await fetchPublicApplicants(); await fetchActiveStudents();
      } else { addToast("Gagal Menghapus", data.message || "Gagal menghapus data pendaftar.", "danger"); }
    } catch (err: any) {
      console.error("API delete error:", err.message);
      setApplicants(prev => prev.filter(a => a.id !== id));
      setPublicApplicants(prev => prev.filter(a => a.id !== id));
      addToast("Applicant Deleted (Offline)", `Pendaftar #${id} dihapus.`, "danger");
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus, isDemoMode]);

  const updateApplicant = useCallback(async (id: number, updatedData: any) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token && !isDemoMode) return { success: false, message: "Tidak terautentikasi." };
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(updatedData) });
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data pendaftar ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchAdminApplicants(); await fetchPublicApplicants(); await fetchActiveStudents();
        return { success: true, data: data.data };
      } else { return { success: false, message: data.message }; }
    } catch (err: any) {
      console.error("API update error:", err.message);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, isDemoMode]);

  const updateActiveStudent = useCallback(async (id: number, updatedData: any) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return { success: false, message: "Tidak terautentikasi." };
    try {
      const res = await fetch(`/api/applicants/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(updatedData) });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return { success: false, message: "Gagal memperbarui data siswa aktif." };
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data siswa aktif ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchActiveStudents(); await fetchAdminApplicants();
        return { success: true, data: data.data };
      } else { return { success: false, message: data.message }; }
    } catch (err: any) {
      console.error("API active student update error:", err.message);
      setActiveStudents(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
      addToast("Data Diperbarui (Offline)", `Perubahan data tersimpan lokal.`, "success");
      return { success: true, data: { id, ...updatedData } };
    }
  }, [adminToken, fetchActiveStudents, fetchAdminApplicants, addToast]);

  const deleteActiveStudent = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`/api/applicants/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
      const data = await res.json();
      if (data.success) {
        addToast("Siswa Dihapus", `Siswa aktif #${id} telah dihapus.`, "danger");
        await fetchActiveStudents(); await fetchAdminApplicants();
      } else { addToast("Gagal Menghapus", data.message || "Gagal menghapus siswa aktif.", "danger"); }
    } catch (err: any) {
      console.error("API active student delete error:", err.message);
      setActiveStudents(prev => prev.filter(a => a.id !== id));
      addToast("Siswa Dihapus (Offline)", `Siswa aktif #${id} dihapus.`, "danger");
    }
  }, [adminToken, fetchActiveStudents, fetchAdminApplicants, addToast]);

  // ── WebSocket / Real-Time ───────────────────────────────────────────────────
  const connectWs = useCallback(() => {
    setWsStatus("CONNECTED");
    addWsLog("SYSTEM", "CONNECTED", { message: "Real-Time HTTP Polling Engine active." });
  }, [addWsLog]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey && schoolId) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const channel = supabase
        .channel(`public:applicants:school_id=eq.${schoolId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'student_applicants', filter: `school_id=eq.${schoolId}` }, (payload) => {
          console.log('Real-Time Supabase Change Received (Applicants):', payload);
          fetchPublicApplicants();
          if (adminToken && (!adminUser || (adminUser.role !== 'gatekeeper' && !adminUser.isGatekeeper))) fetchAdminApplicants();
        })
        .subscribe((status) => { if (status === 'SUBSCRIBED') setWsStatus("CONNECTED"); });
      return () => { supabase.removeChannel(channel); };
    } else {
      const interval = setInterval(() => {
        fetchPublicApplicants();
        if (adminToken && (!adminUser || (adminUser.role !== 'gatekeeper' && !adminUser.isGatekeeper))) fetchAdminApplicants();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [fetchPublicApplicants, fetchAdminApplicants, adminToken, adminUser, schoolId]);

  useEffect(() => { connectWsRef.current = connectWs; }, [connectWs]);

  // ── Simulation ──────────────────────────────────────────────────────────────
  const simulateRegistration = useCallback(async () => {
    const firstNames = ["Ahmad", "Dian", "Budi", "Siti", "Kevin", "Rina", "Fajar", "Ayu", "Giri", "Reza", "Lutfi", "Indah"];
    const lastNames = ["Saputra", "Pratama", "Lestari", "Maharani", "Wijaya", "Siddiq", "Santoso", "Hidayat", "Kusuma", "Utami"];
    const schools = ["SMPN 1 Depok", "SMPN 2 Depok", "SMPN 3 Depok", "SMP IT Al-Hikmah", "SMP Mardi Yuana", "MTsN 1 Depok", "SMP Budi Kharisma", "SMPN 4 Depok"];
    const majorsCodes = ["Rekayasa Perangkat Lunak", "Teknik Jaringan Komputer & Telekomunikasi", "Desain Komunikasi Visual", "Broadcasting & Perfilman", "Teknik Elektronika", "Animasi"];
    const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const randomNama = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
    const randomMajor = randomItem(majorsCodes);
    const randomMajorAlt = majorsCodes.find(m => m !== randomMajor);
    const mockCandidate = {
      nama: randomNama, nisn: "008" + Math.floor(1000000 + Math.random() * 9000000).toString(),
      nik: "3276" + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      tempatLahir: "Depok", tglLahir: "2010-06-15", jenisKelamin: Math.random() > 0.5 ? "Laki-laki" : "Perempuan",
      agama: "Islam", alamat: "Jl. Pekapuran No. " + Math.floor(Math.random() * 100),
      rtRw: "03/05", kelurahan: "Curug", kecamatan: "Cimanggis", kodePos: "16453",
      whatsapp: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      email: randomNama.toLowerCase().replace(" ", "") + "@email.com",
      sekolahAsal: randomItem(schools), tglLulus: "2026-06-10",
      jurusan1: randomMajor, jurusan2: randomMajorAlt,
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
    } catch (err: any) {
      console.error("Check payment status failed:", err.message);
      return { success: false, message: err.message };
    }
  }, []);

  // ── Side Effects ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!simulationActive) return;
    const intervalId = setInterval(() => simulateRegistration(), 25000);
    return () => clearInterval(intervalId);
  }, [simulationActive, simulateRegistration]);

  useEffect(() => { fetchPublicApplicants(); }, [fetchPublicApplicants]);

  useEffect(() => {
    connectWs();
    return () => {
      if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [adminToken, connectWs]);

  useEffect(() => {
    if (isDemoMode) { fetchAdminApplicants(); fetchActiveStudents(); return; }
    if (!adminToken) return;
    if (adminUser && (adminUser.role === 'gatekeeper' || adminUser.isGatekeeper)) return;
    fetchAdminApplicants();
    fetchActiveStudents();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission();
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
        loginAdmin, loginGatekeeper, logoutAdmin,
        fetchPublicApplicants, fetchAdminApplicants, fetchActiveStudents,
        simulateRegistration, addToast, checkPaymentStatus,
        ppdbLogo, ppdbTitle, profilSekolah, setProfilSekolah, fetchConfigs,
        schoolId, schoolStatus, isDemoMode, isSchoolNotFound
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
