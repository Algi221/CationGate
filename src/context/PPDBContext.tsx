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
}

const PPDBContext = createContext<PPDBContextType | null>(null);

const BACKEND_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
const WS_URL = typeof window !== 'undefined' ? `ws://${window.location.hostname}:5000/ws` : "ws://localhost:5000/ws";

export function PPDBProvider({ children }: { children: React.ReactNode }) {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [publicApplicants, setPublicApplicants] = useState<any[]>([]);
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("ppdb_admin_token");
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
  const [ppdbLogo, setPpdbLogo] = useState<string>("/logo_smktb.png");
  const [ppdbTitle, setPpdbTitle] = useState<string>("PPDB SMK TB");

  const fetchConfigs = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/config`);
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
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/public`);
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
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem("ppdb_admin_token");
    localStorage.removeItem("ppdb_admin_user");
    localStorage.removeItem("ppdb_admin_last_active");
  }, []);

  const fetchAdminApplicants = useCallback(async () => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants`, {
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
  }, [adminToken, logoutAdmin]);

  const fetchActiveStudents = useCallback(async () => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants`, {
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
  }, [adminToken, logoutAdmin]);


  const registerApplicant = useCallback(async (formData: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants`, {
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
  }, [fetchPublicApplicants, addToast]);

  const verifyApplicant = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}/status`, {
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
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus]);

  const rejectApplicant = useCallback(async (id: number, alasan_ditolak?: string) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}/status`, {
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
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus]);

  const deleteApplicant = useCallback(async (id: number) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
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
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast, wsStatus]);

  const updateApplicant = useCallback(async (id: number, updatedData: any) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return { success: false, message: "Tidak terautentikasi." };
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
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
  }, [adminToken, fetchAdminApplicants, fetchPublicApplicants, fetchActiveStudents, addToast]);

  const updateActiveStudent = useCallback(async (id: number, updatedData: any) => {
    const token = adminToken || localStorage.getItem("ppdb_admin_token");
    if (!token) return { success: false, message: "Tidak terautentikasi." };
    try {
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
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
      const res = await fetch(`${BACKEND_URL}/api/applicants/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
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
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setAdminToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem("ppdb_admin_token", data.token);
        localStorage.setItem("ppdb_admin_user", JSON.stringify(data.admin));
        localStorage.setItem("ppdb_admin_last_active", Date.now().toString());
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      console.error("Auth API error:", err.message);
      return { success: false, message: "Koneksi ke server backend gagal." };
    }
  }, []);

  const connectWs = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    console.log("Attempting to connect to Hono WebSocket channel...");
    setWsStatus("CONNECTING");
    
    const currentToken = adminTokenRef.current;
    const wsUrlWithToken = currentToken ? `${WS_URL}?token=${currentToken}` : WS_URL;
    addWsLog("SYSTEM", "CONNECTING", { url: wsUrlWithToken });

    const ws = new WebSocket(wsUrlWithToken);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Hono WebSocket connection established.");
      setWsStatus("CONNECTED");
      addWsLog("SYSTEM", "CONNECTED", { message: "Established connection successfully." });
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("WebSocket event received:", parsed);
        addWsLog("INCOMING", parsed.event, parsed.data);

        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');

        if (parsed.event === 'NEW_APPLICANT') {
          const newStudent = parsed.data;
          setPublicApplicants((prev) => {
            if (prev.some(a => a.id === newStudent.id)) return prev;
            return [newStudent, ...prev];
          });
          setApplicants((prev) => {
            if (prev.some(a => a.id === newStudent.id)) return prev;
            return [newStudent, ...prev];
          });
          if (isAdminPath) {
            addToast(
              "Pendaftaran Baru!",
              `Nama: ${newStudent.nama} · Asal: ${newStudent.sekolah_asal || newStudent.sekolahAsal} · Jurusan: ${newStudent.jurusan_1 || newStudent.jurusan1}`,
              "success"
            );
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('Pendaftaran Baru!', {
                body: `Nama: ${newStudent.nama} (${newStudent.jurusan_1 || newStudent.jurusan1})`
              });
            }
          }
        } else if (parsed.event === 'NEW_APPLICANT_PUBLIC') {
          const newStudent = parsed.data;
          setPublicApplicants((prev) => {
            if (prev.some(a => a.id === newStudent.id)) return prev;
            return [newStudent, ...prev];
          });
        } else if (parsed.event === 'STATUS_UPDATE') {
          const update = parsed.data;
          setApplicants((prev) =>
            prev.map(a => a.id === update.id ? { ...a, status: update.status, alasan_ditolak: update.alasan_ditolak } : a)
          );
          setPublicApplicants((prev) =>
            prev.map(a => a.id === update.id ? { ...a, status: update.status, alasan_ditolak: update.alasan_ditolak } : a)
          );
          if (isAdminPath) {
            if (update.status === 'Rejected') {
              addToast("Pendaftar Ditolak", `${update.nama} ditolak.`, "warning");
            } else {
              addToast("Pendaftar Disetujui", `${update.nama} telah terverifikasi!`, "success");
            }
          }
        } else if (parsed.event === 'APPLICANT_DELETED') {
          const { id } = parsed.data;
          setApplicants((prev) => prev.filter(a => a.id !== id));
          setPublicApplicants((prev) => prev.filter(a => a.id !== id));
          if (isAdminPath) {
            addToast("Pendaftar Dihapus", `Data pendaftar #${id} dihapus dari sistem.`, "danger");
          }
        } else if (parsed.event === 'APPLICANT_UPDATED') {
          const updatedStudent = parsed.data;
          setApplicants((prev) =>
            prev.map(a => a.id === updatedStudent.id ? { ...a, ...updatedStudent } : a)
          );
          setPublicApplicants((prev) =>
            prev.map(a => a.id === updatedStudent.id ? { ...a, ...updatedStudent } : a)
          );
        } else if (parsed.event === 'REFRESH_INFORMASI') {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('ws_refresh_informasi'));
          }
        }
      } catch (err) {
        console.warn("Failed to parse incoming WS message:", event.data, err);
      }
    };

    ws.onclose = () => {
      console.log("Hono WebSocket connection closed.");
      setWsStatus("DISCONNECTED");
      addWsLog("SYSTEM", "DISCONNECTED", { message: "Connection closed." });
      reconnectTimeoutRef.current = setTimeout(() => {
        
        if (connectWsRef.current) connectWsRef.current();
      }, 5000);
    };

    ws.onerror = () => {
      
      setWsStatus("ERROR");
      addWsLog("SYSTEM", "ERROR", { message: "Encountered networking error." });
    };
  }, [addToast, addWsLog]);

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
      const res = await fetch(`${BACKEND_URL}/api/applicants/check-payment/${nisn}`);
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
        logoutAdmin,
        fetchPublicApplicants,
        fetchAdminApplicants,
        fetchActiveStudents,
        simulateRegistration,
        addToast,
        checkPaymentStatus,
        ppdbLogo,
        ppdbTitle,
        fetchConfigs
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
