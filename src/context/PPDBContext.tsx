"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface Toast {
  id: string;
  title: string;
  message: string;
  type: string;
}

interface WsLog {
  id: string;
  timestamp: string;
  direction: string;
  event: string;
  payload: any;
}

interface PPDBContextType {
  applicants: any[];
  setApplicants: React.Dispatch<React.SetStateAction<any[]>>;
  publicApplicants: any[];
  activeStudents: any[];
  adminToken: string | null;
  adminUser: any | null;
  wsStatus: string;
  toasts: Toast[];
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
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginGatekeeper: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  fetchPublicApplicants: () => Promise<void>;
  fetchAdminApplicants: () => Promise<void>;
  fetchActiveStudents: () => Promise<void>;
  simulateRegistration: () => Promise<void>;
  addToast: (title: string, message: string, type?: string) => void;
  checkPaymentStatus: (nisn: string) => Promise<any>;
  setAdminUser: React.Dispatch<React.SetStateAction<any | null>>;
  ppdbLogo: string;
  ppdbTitle: string;
  fetchConfigs: () => Promise<void>;
  schoolId: string;
  schoolStatus: string;
  isDemoMode: boolean;
  isSchoolNotFound: boolean;
}

const PPDBContext = createContext<PPDBContextType | null>(null);

import { useParams, usePathname } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const WS_PROTOCOL = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const WS_URL = typeof window !== 'undefined' ? `${WS_PROTOCOL}//${window.location.host}/api/ws` : "ws://localhost:3000/api/ws";

export function PPDBProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params?.school_slug as string || "";
  const isDemoMode = slug === 'demo';
  const pathname = usePathname();

  const [schoolId, setSchoolId] = useState<string>("");
  const [schoolStatus, setSchoolStatus] = useState<string>("");
  const [isSchoolNotFound, setIsSchoolNotFound] = useState<boolean>(false);

  const [applicants, setApplicants] = useState<any[]>([]);
  const [publicApplicants, setPublicApplicants] = useState<any[]>([]);
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("ppdb_admin_token");
      // Clear legacy fake tokens (e.g. "token_admin_<id>" from /daftar registration)
      // which are NOT valid JWTs and would cause 401 on every admin API call.
      if (token && !token.includes('.')) {
        localStorage.removeItem("ppdb_admin_token");
        localStorage.removeItem("ppdb_admin_user");
        localStorage.removeItem("ppdb_admin_last_active");
        return null;
      }
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (token && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed > 60 * 60 * 1000) { // 1 hour
          localStorage.removeItem("ppdb_admin_token");
          localStorage.removeItem("ppdb_admin_user");
          localStorage.removeItem("ppdb_admin_last_active");
          return null;
        }
      }
      return token || null;
    }
    return null;
  });
  const [adminUser, setAdminUser] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("ppdb_admin_user");
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (saved && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed > 60 * 60 * 1000) {
          return null;
        }
      }
      try { return saved ? JSON.parse(saved) : null; } catch (_) { return null; }
    }
    return null;
  });
  const [wsStatus, setWsStatus] = useState<string>("DISCONNECTED");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [wsLogs, setWsLogs] = useState<WsLog[]>([]);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [ppdbLogo, setPpdbLogo] = useState<string>("");
  const [ppdbTitle, setPpdbTitle] = useState<string>("PPDB SMK TB");

  const fetchConfigs = useCallback(async () => {
    try {
      const res = await fetch(`/api/config`);
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.ppdb_logo_url) {
          setPpdbLogo(data.data.ppdb_logo_url);
        }
        if (data.data.ppdb_title) {
          setPpdbTitle(data.data.ppdb_title);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil config:", err);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  useEffect(() => {
    if (slug) {
      fetch(`/api/saas/school-by-slug/${slug}`)
        .then(async (res) => {
          if (!res.headers.get("content-type")?.includes("application/json")) {
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.notFound) {
            setIsSchoolNotFound(true);
          } else if (data && data.success && data.data) {
            setIsSchoolNotFound(false);
            // Prefer school_uuid (generated during registration for prospective schools)
            // over the integer id, since admin_users.school_id is UUID type
            setSchoolId(data.data.school_uuid || data.data.id);
            if (data.data.status) setSchoolStatus(data.data.status);
            if (data.data.logo_url) setPpdbLogo(data.data.logo_url);
            if (data.data.name) setPpdbTitle(data.data.name);
          } else if (slug !== 'smktarunabhakti' && slug !== 'demo') {
            setIsSchoolNotFound(true);
          } else {
            setIsSchoolNotFound(false);
            setSchoolId(slug);
            setPpdbTitle(slug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : slug);
          }
        })
        .catch((err) => {
          console.warn("Gagal mengambil data sekolah:", err?.message);
        });
    }
  }, [slug]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  
  const connectWsRef = useRef<(() => void) | null>(null);

  const adminTokenRef = useRef<string | null>(adminToken);
  useEffect(() => {
    adminTokenRef.current = adminToken;
  }, [adminToken]);

  const playNotificationSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      osc1.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
      osc2.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc1.start(); osc2.start();
      osc1.stop(audioCtx.currentTime + 0.5);
      osc2.stop(audioCtx.currentTime + 0.5);
    } catch (e: any) {
      console.log('AudioContext blocked or unsupported:', e.message);
    }
  }, []);

  const addToast = useCallback((title: string, message: string, type = "info") => {
    setToasts((prev) => {

      const getStudentKey = (msg: string) => {
        const idMatch = msg.match(/#\d+/);
        if (idMatch) return idMatch[0];
        
        const nameLabelMatch = msg.match(/Nama:\s*([^·\n]+)/);
        if (nameLabelMatch) return nameLabelMatch[1].trim().toLowerCase();

        const capWordMatch = msg.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/);
        if (capWordMatch) return capWordMatch[0].trim().toLowerCase();
        
        return null;
      };

      const newKey = getStudentKey(message);
      
      const filtered = prev.filter((t) => {
        if (t.message === message) return false;
        
        if (newKey) {
          const oldKey = getStudentKey(t.message);
          if (oldKey && oldKey === newKey) return false;
        }
        
        return true;
      });

      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      setTimeout(() => {
        setToasts((curr) => curr.filter((t) => t.id !== id));
      }, 5000);

      return [...filtered, { id, title, message, type }];
    });
    playNotificationSound();
  }, [playNotificationSound]);

  const addWsLog = useCallback((direction: string, event: string, payload: any) => {
    setWsLogs((prev) => [
      {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        direction,
        event,
        payload
      },
      ...prev.slice(0, 49)
    ]);
  }, []);

  const fetchPublicApplicants = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_public_applicants');
      if (localStr) {
        try { setPublicApplicants(JSON.parse(localStr)); return; } catch (e) {}
      }
      const localSeed = [
        { id: 1, nama: "Ahmad Bintang Pratama", nisn: "0081234567", sekolah_asal: "SMPN 1 Depok", jurusan_1: "Rekayasa Perangkat Lunak", status: "Approved", tgl_daftar: new Date().toISOString() },
        { id: 2, nama: "Putri Ayu Lestari", nisn: "0087654321", sekolah_asal: "SMPN 2 Depok", jurusan_1: "Desain Komunikasi Visual", status: "Pending", tgl_daftar: new Date().toISOString() }
      ];
      setPublicApplicants(localSeed);
      return;
    }
    try {
      const url = slug ? `${BACKEND_URL}/applicants/public?school_slug=${slug}` : `${BACKEND_URL}/applicants/public`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setPublicApplicants(data.data);
    } catch (err: any) {
      console.warn("Public API fetch error, using local fallback seed:", err.message);
      const localSeed = [
        { id: 1, nama: "Ahmad Bintang Pratama", nisn: "0081234567", sekolah_asal: "SMPN 1 Depok", jurusan_1: "Rekayasa Perangkat Lunak", status: "Approved", tgl_daftar: new Date().toISOString() },
        { id: 2, nama: "Putri Ayu Lestari", nisn: "0087654321", sekolah_asal: "SMPN 2 Depok", jurusan_1: "Desain Komunikasi Visual", status: "Pending", tgl_daftar: new Date().toISOString() }
      ];
      setPublicApplicants(localSeed);
    }
  }, [isDemoMode, slug]);

  const logoutAdmin = useCallback(() => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem("ppdb_admin_token");
    localStorage.removeItem("ppdb_admin_user");
    localStorage.removeItem("ppdb_admin_last_active");
  }, []);

  const fetchAdminApplicants = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_admin_applicants');
      if (localStr) {
        try { setApplicants(JSON.parse(localStr)); return; } catch (e) {}
      }
      const localSeed = [
        { id: 1, nama: "Ahmad Bintang Pratama", nisn: "0081234567", sekolah_asal: "SMPN 1 Depok", jurusan_1: "Rekayasa Perangkat Lunak", status: "Approved", tgl_daftar: new Date().toISOString() },
        { id: 2, nama: "Putri Ayu Lestari", nisn: "0087654321", sekolah_asal: "SMPN 2 Depok", jurusan_1: "Desain Komunikasi Visual", status: "Pending", tgl_daftar: new Date().toISOString() }
      ];
      setApplicants(localSeed);
      return;
    }
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/applicants`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 401) {
        console.warn("Token is invalid or expired. Logging out admin.");
        logoutAdmin();
        return;
      }
      const data = await res.json();
      if (data.success) setApplicants(data.data);
    } catch (err: any) {
      console.warn("Admin API fetch error:", err.message);
    }
  }, [adminToken, logoutAdmin, isDemoMode]);

  const fetchActiveStudents = useCallback(async () => {
    if (isDemoMode) {
      const localStr = localStorage.getItem('demo_admin_applicants');
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          setActiveStudents(parsed.filter((a: any) => a.status === 'Approved'));
          return;
        } catch (e) {}
      }
      setActiveStudents([{ id: 1, nama: "Ahmad Bintang Pratama", nisn: "0081234567", sekolah_asal: "SMPN 1 Depok", jurusan_1: "Rekayasa Perangkat Lunak", status: "Approved", tgl_daftar: new Date().toISOString() }]);
      return;
    }
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/applicants`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 401) {
        console.warn("Token is invalid or expired. Logging out admin.");
        logoutAdmin();
        return;
      }
      const data = await res.json();
      if (data.success) {
        const approved = data.data.filter((a: any) => a.status === 'Approved');
        setActiveStudents(approved);
      }
    } catch (err: any) {
      console.warn("Active students API fetch error:", err.message);
    }
  }, [adminToken, logoutAdmin, isDemoMode]);


  const registerApplicant = useCallback(async (formData: any) => {
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchPublicApplicants();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      console.error("API registration error, adding to memory fallback:", err.message);
      const newId = Date.now();
      const mockSaved = {
        id: newId,
        nama: formData.nama || "Pendaftar Baru",
        nisn: formData.nisn || "0000000000",
        sekolah_asal: formData.sekolahAsal || "SMP Asal",
        jurusan_1: formData.jurusan1 || "PPLG",
        status: "Pending",
        tgl_daftar: new Date().toISOString()
      };
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
      const res = await fetch(`${BACKEND_URL}/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: "Approved" })
      });
      const data = await res.json();
      if (data.success) {
        if (wsStatus !== "CONNECTED") {
          addToast("Applicant Approved", `Pendaftar #${id} telah berhasil diverifikasi!`, "success");
        }
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        await fetchActiveStudents();
      } else {
        addToast("Gagal Memverifikasi", data.message || "Gagal memperbarui status pendaftar.", "danger");
      }
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
      const res = await fetch(`${BACKEND_URL}/applicants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: "Rejected", alasan_ditolak })
      });
      const data = await res.json();
      if (data.success) {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');
        if (wsStatus !== "CONNECTED" && isAdminPath) {
          addToast("Applicant Rejected", `Calon siswa #${id} telah ditolak.`, "warning");
        }
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        await fetchActiveStudents();
      } else {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');
        if (isAdminPath) {
          addToast("Gagal Menolak", data.message || "Gagal memperbarui status pendaftar.", "danger");
        }
      }
    } catch (err: any) {
      console.error("API status update error:", err.message);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected", alasan_ditolak } : a));
      setPublicApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected", alasan_ditolak } : a));
      const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');
      if (isAdminPath) {
        addToast("Applicant Rejected (Offline)", `Calon siswa #${id} ditolak.`, "warning");
      }
    }
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus, isDemoMode]);

  const deleteApplicant = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token && !isDemoMode) return;
    try {
      if (isDemoMode) throw new Error("Demo Mode");
      const res = await fetch(`${BACKEND_URL}/applicants/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (wsStatus !== "CONNECTED") {
          addToast("Applicant Deleted", `Data pendaftar #${id} telah dihapus permanen.`, "danger");
        }
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        await fetchActiveStudents();
      } else {
        addToast("Gagal Menghapus", data.message || "Gagal menghapus data pendaftar.", "danger");
      }
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
      const res = await fetch(`${BACKEND_URL}/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success) {
        addToast("Data Diperbarui", `Data pendaftar ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchAdminApplicants();
        await fetchPublicApplicants();
        await fetchActiveStudents();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
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
      const res = await fetch(`/api/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
        return { success: false, message: "Gagal memperbarui data siswa aktif." };
      }
      const data = await res.json();
      if (data.success) { 
        addToast("Data Diperbarui", `Data siswa aktif ${updatedData.nama || '#' + id} berhasil disimpan.`, "success");
        await fetchActiveStudents();
        await fetchAdminApplicants();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
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
      const res = await fetch(`/api/applicants/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
      const data = await res.json();
      if (data.success) {
        addToast("Siswa Dihapus", `Siswa aktif #${id} telah dihapus.`, "danger");
        await fetchActiveStudents();
        await fetchAdminApplicants();
      } else {
        addToast("Gagal Menghapus", data.message || "Gagal menghapus siswa aktif.", "danger");
      }
    } catch (err: any) {
      console.error("API active student delete error:", err.message);
      setActiveStudents(prev => prev.filter(a => a.id !== id));
      addToast("Siswa Dihapus (Offline)", `Siswa aktif #${id} dihapus.`, "danger");
    }
  }, [adminToken, fetchActiveStudents, fetchAdminApplicants, addToast]);

  const loginAdmin = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch(`/api/auth/login${schoolId ? '?school_id=' + schoolId : ''}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ success: false, message: "Login gagal" }));
        return { success: false, message: errorData.message || "Username atau password salah" };
      }

      const data = await res.json();
      if (data && data.success) {
        setAdminToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem("ppdb_admin_token", data.token);
        localStorage.setItem("ppdb_admin_user", JSON.stringify(data.admin));
        localStorage.setItem("ppdb_admin_last_active", Date.now().toString());
        addToast("Login Berhasil", `Selamat datang, ${data.admin?.nama || username}!`, "success");
        return { success: true };
      } else {
        return { success: false, message: data.message || "Username atau password salah" };
      }
    } catch (err: any) {
      console.error("Login error:", err.message);
      return { success: false, message: "Terjadi kesalahan koneksi. Silakan coba lagi." };
    }
  }, [addToast, schoolId]);

  const loginGatekeeper = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch(`/api/gatekeeper/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ success: false, message: "Login gatekeeper gagal" }));
        return { success: false, message: errorData.message || "Username atau password salah" };
      }

      const data = await res.json();
      if (data && data.success) {
        setAdminToken(data.token);
        setAdminUser(data.gatekeeper);
        localStorage.setItem("ppdb_admin_token", data.token);
        localStorage.setItem("ppdb_admin_user", JSON.stringify(data.gatekeeper));
        localStorage.setItem("ppdb_admin_last_active", Date.now().toString());
        addToast("Login Gatekeeper Berhasil", `Selamat datang, ${data.gatekeeper?.nama_lengkap || username}!`, "success");
        return { success: true };
      } else {
        return { success: false, message: data.message || "Username atau password salah" };
      }
    } catch (err: any) {
      console.error("Login Gatekeeper error:", err.message);
      return { success: false, message: "Terjadi kesalahan koneksi. Silakan coba lagi." };
    }
  }, [addToast]);

  const connectWs = useCallback(() => {
    // Replace WebSocket with Light Real-Time HTTP Polling Engine
    setWsStatus("CONNECTED");
    addWsLog("SYSTEM", "CONNECTED", { message: "Real-Time HTTP Polling Engine active." });
  }, [addWsLog]);

  useEffect(() => {
    // Real-time background sync interval (every 15s)
    const interval = setInterval(() => {
      fetchPublicApplicants();
      if (adminToken) fetchAdminApplicants();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchPublicApplicants, fetchAdminApplicants, adminToken]);

  useEffect(() => {
    connectWsRef.current = connectWs;
  }, [connectWs]);

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
      nama: randomNama,
      nisn: "008" + Math.floor(1000000 + Math.random() * 9000000).toString(),
      nik: "3276" + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      tempatLahir: "Depok",
      tglLahir: "2010-06-15",
      jenisKelamin: Math.random() > 0.5 ? "Laki-laki" : "Perempuan",
      agama: "Islam",
      alamat: "Jl. Pekapuran No. " + Math.floor(Math.random() * 100),
      rtRw: "03/05",
      kelurahan: "Curug",
      kecamatan: "Cimanggis",
      kodePos: "16453",
      whatsapp: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      email: randomNama.toLowerCase().replace(" ", "") + "@email.com",
      sekolahAsal: randomItem(schools),
      tglLulus: "2026-06-10",
      jurusan1: randomMajor,
      jurusan2: randomMajorAlt,
      teleponOrtu: "0812" + Math.floor(10000000 + Math.random() * 90000000).toString(),
      janjiTaat: true,
      janjiSanksi: true,
      janjiAkrab: true,
      janjiBelajar: true,
      janjiNamaBaik: true
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

  useEffect(() => {
    if (!simulationActive) return;
    const intervalId = setInterval(() => {
      simulateRegistration();
    }, 25000);
    return () => clearInterval(intervalId);
  }, [simulationActive, simulateRegistration]);

  useEffect(() => {

    fetchPublicApplicants();
  }, [fetchPublicApplicants]);

  useEffect(() => {

    connectWs();
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [adminToken, connectWs]);

  useEffect(() => {
    if (!adminToken) return;

    fetchAdminApplicants();
    fetchActiveStudents();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [adminToken, fetchAdminApplicants, fetchActiveStudents]);



  return (
    <PPDBContext.Provider
      value={{
        applicants,
        setApplicants,
        publicApplicants,
        activeStudents,
        adminToken,
        adminUser,
        setAdminUser,
        wsStatus,
        toasts,
        wsLogs,
        simulationActive,
        setSimulationActive,
        registerApplicant,
        verifyApplicant,
        rejectApplicant,
        deleteApplicant,
        updateApplicant,
        updateActiveStudent,
        deleteActiveStudent,
        loginAdmin,
        loginGatekeeper,
        logoutAdmin,
        fetchPublicApplicants,
        fetchAdminApplicants,
        fetchActiveStudents,
        simulateRegistration,
        addToast,
        checkPaymentStatus,
        ppdbLogo,
        ppdbTitle,
        fetchConfigs,
        schoolId,
        schoolStatus,
        isDemoMode,
        isSchoolNotFound
      }}
    >
      {children}

      {/* Toast Alert Portal */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 w-full ${
              toast.type === "success"
                ? "bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : toast.type === "warning"
                ? "bg-amber-50/90 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                : toast.type === "danger"
                ? "bg-rose-50/90 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                : "bg-blue-50/90 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
              toast.type === "success"
                ? "bg-emerald-200/55 dark:bg-emerald-800/40"
                : toast.type === "warning"
                ? "bg-amber-200/55 dark:bg-amber-800/40"
                : toast.type === "danger"
                ? "bg-rose-200/55 dark:bg-rose-800/40"
                : "bg-blue-200/55 dark:bg-blue-800/40"
            }`}>
              {toast.type === "success" ? "✓" : toast.type === "warning" ? "⚠" : toast.type === "danger" ? "✕" : "ℹ"}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-0.5">{toast.title}</h4>
              <p className="text-xs font-medium leading-relaxed opacity-90">{toast.message}</p>
            </div>
            {/* Close Button */}
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </PPDBContext.Provider>
  );
}

export function usePPDB() {
  const context = useContext(PPDBContext);
  if (!context) {
    throw new Error("usePPDB must be used within a PPDBProvider");
  }
  return context;
}

