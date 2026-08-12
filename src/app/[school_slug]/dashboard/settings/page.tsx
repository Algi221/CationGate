"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { 
  Settings, 
  Database, 
  Wifi, 
  CheckCircle, 
  HardDrive, 
  RefreshCw,
  Sparkles,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  ShieldAlert,
  Zap,
  Play,
  Square,
  Timer,
  UserPlus,
  Users
} from "lucide-react";
import Swal from 'sweetalert2';

import { useSearchParams, useRouter } from "next/navigation";

export default function SimulationSettings() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams ? (searchParams.get("tab") || "umum") : "umum";

  const { 
    simulationActive, 
    setSimulationActive, 
    simulateRegistration, 
    wsStatus, 
    applicants,
    adminToken,
    addToast 
  } = usePPDB();

  const [mounted, setMounted] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [seederInterval, setSeederInterval] = useState(5);
  const [seederRunning, setSeederRunning] = useState(false);
  const [seederCount, setSeederCount] = useState(0);
  const [isSingleInserting, setIsSingleInserting] = useState(false);
  const seederRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (seederRef.current) clearInterval(seederRef.current);
    };
  }, []);

  const handleSingleInsert = async () => {
    try {
      setIsSingleInserting(true);
      await simulateRegistration();
      setSeederCount(prev => prev + 1);
      if (typeof addToast === "function") {
        addToast("Siswa Ditambahkan", "1 data pendaftar dummy berhasil dimasukkan.", "success");
      }
    } catch (err) {
      console.error(err);
      if (typeof addToast === "function") {
        addToast("Gagal", "Gagal memasukkan data dummy.", "danger");
      }
    } finally {
      setIsSingleInserting(false);
    }
  };

  const handleStartAutoGenerate = () => {
    if (seederRunning) return;
    setSeederRunning(true);
    setSeederCount(0);

    // Immediately insert one
    simulateRegistration().then(() => setSeederCount(1)).catch(console.error);

    seederRef.current = setInterval(async () => {
      try {
        await simulateRegistration();
        setSeederCount(prev => prev + 1);
      } catch (err) {
        console.error(err);
      }
    }, seederInterval * 1000);
  };

  const handleStopAutoGenerate = () => {
    if (seederRef.current) {
      clearInterval(seederRef.current);
      seederRef.current = null;
    }
    setSeederRunning(false);
    if (typeof addToast === "function" && seederCount > 0) {
      addToast("Auto-Generate Dihentikan", `Total ${seederCount} data pendaftar dummy telah dimasukkan.`, "success");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Password saat ini wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password baru harus minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const BACKEND_URL = typeof window !== 'undefined' ? `/api` : "/api";
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      
      const res = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof addToast === "function") {
          addToast(
            "Password Diubah",
            data.message || "Password admin berhasil diperbarui.",
            "success"
          );
        }
        
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.message || "Gagal mengubah password.");
        if (typeof addToast === "function") {
          addToast("Gagal", data.message || "Gagal mengubah password.", "warning");
        }
      }
    } catch (err: any) {
      setPasswordError("Gagal menghubungi server backend.");
      if (typeof addToast === "function") {
        addToast("Error", "Koneksi ke server terputus.", "danger");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500 dark:text-blue-400" size={32} />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-455">Memuat konfigurasi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-500 text-left pb-16">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="text-blue-500 dark:text-blue-400" size={24} />
          <span>Pengaturan Sistem &amp; Keamanan</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-455 mt-1">
          Perbarui keamanan akun administrator dan kendalikan konfigurasi biaya pendaftaran serta link WhatsApp.
        </p>

        {/* Tab Switcher Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { id: "umum", label: "Umum & Simulasi" },
            { id: "tampilan", label: "Tampilan & Logo" },
            { id: "keamanan", label: "Keamanan & Password" },
            { id: "integrasi", label: "Integrasi & API" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("tab", t.id);
                router.push(`?${params.toString()}`);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                currentTab === t.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER COLUMN: Integration Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Keamanan & Ganti Password Admin Card */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/35 flex items-center justify-center text-blue-600 dark:text-blue-450 shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
                    Keamanan & Ganti Password
                  </h3>
                  <p className="text-xs text-slate-455 font-semibold mt-0.5">
                    Perbarui kata sandi akun administrator secara berkala untuk perlindungan data
                  </p>
                </div>
              </div>
              
              <div className="hidden sm:block">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/45 border border-blue-200/40 dark:border-blue-800/40 rounded-full text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 tracking-wider flex items-center gap-1">
                  <ShieldCheck size={10} /> Secure Hash
                </span>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5">
              {passwordError && (
                <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold leading-relaxed flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Password saat ini */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 flex items-center gap-1.5">
                  <KeyRound size={13} className="text-slate-455" />
                  Password Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini..."
                    className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-[#020617]/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 dark:hover:text-white transition-colors"
                  >
                    {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password baru */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 flex items-center gap-1.5">
                    <Lock size={13} className="text-slate-455" />
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter..."
                      className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-[#020617]/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Konfirmasi password baru */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-455 flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-slate-455" />
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru..."
                      className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-[#020617]/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Tombol submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_15_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20_rgba(59,130,246,0.25)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer font-black"
                >
                  {isChangingPassword ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Simpan Password Baru
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Student Seeder / Test Data Generator ──────────────────────── */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/35 flex items-center justify-center text-emerald-600 dark:text-emerald-450 shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
                    Mode Pengujian Data
                  </h3>
                  <p className="text-xs text-slate-455 font-semibold mt-0.5">
                    Masukkan data pendaftar dummy untuk simulasi dan pengujian sistem
                  </p>
                </div>
              </div>
              
              <div className="hidden sm:block">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                  seederRunning 
                    ? "bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200/40 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 animate-pulse" 
                    : "bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800/40 dark:border-slate-700/40 text-slate-500 dark:text-slate-400"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${seederRunning ? "bg-emerald-500" : "bg-slate-400"}`}></div>
                  {seederRunning ? "Active" : "Idle"}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Single insert */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Masukkan Satu Siswa</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tekan tombol untuk memasukkan 1 data pendaftar dummy secara instan.</p>
                </div>
                <button
                  onClick={handleSingleInsert}
                  disabled={isSingleInserting || seederRunning}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.25)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {isSingleInserting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Menambahkan...
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Tambah 1 Siswa
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800/60"></div>

              {/* Auto Generate */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Auto-Generate Siswa</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Masukkan data pendaftar secara otomatis dengan interval waktu yang bisa diatur.</p>
                </div>

                {/* Interval config */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-[#020617]/30 border border-slate-200 dark:border-slate-800 rounded-2xl flex-1">
                    <Timer size={14} className="text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Interval:</span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={seederInterval}
                      onChange={(e) => setSeederInterval(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                      disabled={seederRunning}
                      className="w-16 text-center bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 text-xs font-black text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50 transition-all"
                    />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">detik</span>
                  </div>
                </div>

                {/* Start / Stop + counter */}
                <div className="flex items-center gap-3">
                  {!seederRunning ? (
                    <button
                      onClick={handleStartAutoGenerate}
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                    >
                      <Play size={14} />
                      Mulai Auto-Generate
                    </button>
                  ) : (
                    <button
                      onClick={handleStopAutoGenerate}
                      className="px-5 py-3 bg-gradient-to-r from-rose-600 to-pink-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(244,63,94,0.15)] hover:shadow-[0_4px_20px_rgba(244,63,94,0.25)] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                    >
                      <Square size={14} />
                      Stop Auto-Generate
                    </button>
                  )}

                  {/* Live counter */}
                  {(seederRunning || seederCount > 0) && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 rounded-2xl">
                      <Users size={14} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                        {seederCount} <span className="font-bold text-emerald-500">siswa ditambahkan</span>
                      </span>
                      {seederRunning && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Panduan & Status Sistem */}
        <div className="space-y-6">
          
          {/* Kartu tips keamanan */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/85 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] rounded-full bg-blue-500/5 blur-[50px] pointer-events-none"></div>

            <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-blue-500 animate-pulse" />
              Keamanan Akun & Tips
            </h4>
            
            <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-355 leading-relaxed">
              <p>Jaga keamanan dashboard administrator PPDB dengan mengikuti panduan dasar berikut:</p>
              
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    1
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Ganti Sandi Berkala</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Lakukan penggantian kata sandi secara rutin setiap 3-6 bulan untuk mencegah akses yang tidak sah.</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    2
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Kombinasi Karakter</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Gunakan kombinasi huruf besar, huruf kecil, angka, dan karakter spesial untuk kekuatan sandi maksimal.</p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    3
                  </span>
                  <p className="font-extrabold text-slate-800 dark:text-white">Hindari Berbagi Akun</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pastikan kredensial login disimpan secara aman dan tidak dibagikan ke pihak luar demi menjaga integritas data pendaftar.</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-455 flex items-center gap-1">
                  <Sparkles size={11} /> Menggunakan enkripsi satu arah BCrypt di level database.
                </span>
              </div>
            </div>
          </div>



        </div>

      </div>

    </div>
  );
}
