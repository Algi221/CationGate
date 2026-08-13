"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { 
  Settings, 
  RefreshCw,
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
  Users,
  Globe,
  Newspaper,
  Palette,
  Check,
  Copy,
  Mail
} from "lucide-react";
import Swal from 'sweetalert2';
import { useSearchParams, useRouter } from "next/navigation";

/* ─── Sub-components for each Settings Tab ─── */

function GeneralSettingsSection() {
  const [lang, setLang] = useState("id");
  return (
    <div className="space-y-6">
      {/* Bahasa Sistem */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/35 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Bahasa Sistem</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Pilih bahasa utama antarmuka CationGate</p>
          </div>
        </div>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full max-w-xs px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
          <option value="id">🇮🇩 Bahasa Indonesia</option>
          <option value="en">🇺🇸 English (US)</option>
        </select>
      </div>

      {/* Log Pembaruan CationGate */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/35 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Newspaper size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Log Pembaruan CationGate</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Riwayat fitur baru, perbaikan, dan peningkatan keamanan</p>
          </div>
        </div>
        <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <li className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="inline-block px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md text-[10px] font-black mr-2">TERBARU</span>
            <strong>v2.4.0</strong> — Integrasi Pengaturan UI Terpusat & Fitur Verifikasi OTP Email untuk perubahan akun sensitif.
          </li>
          <li className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-[10px] font-black mr-2">SECURITY</span>
            <strong>v2.3.5</strong> — Peningkatan Keamanan Hono API, Rate Limiting adaptif, dan patch XSS pada input formulir.
          </li>
          <li className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="inline-block px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-md text-[10px] font-black mr-2">FEATURE</span>
            <strong>v2.3.0</strong> — Fitur Multi-Sekolah, Dashboard Real-time WebSocket, dan sinkronisasi Siswa Aktif.
          </li>
          <li>
            <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-black mr-2">FIX</span>
            <strong>v2.2.8</strong> — Perbaikan bug kuota pendaftaran & optimasi query Supabase batch.
          </li>
        </ul>
      </div>
    </div>
  );
}

function AppearanceSettingsSection() {
  const { adminToken, addToast, schoolId } = usePPDB();
  const [themeColor, setThemeColor] = useState("#2563EB");
  const [isSaving, setIsSaving] = useState(false);

  const PRESET_COLORS = [
    { name: "Biru (Default)", hex: "#2563EB" },
    { name: "Merah", hex: "#EF4444" },
    { name: "Hijau", hex: "#10B981" },
    { name: "Kuning", hex: "#F59E0B" }
  ];

  const handleSaveTheme = async () => {
    if (!adminToken) return;
    try {
      setIsSaving(true);
      const url = schoolId ? `/api/config?school_id=${schoolId}` : `/api/config`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ key: 'ppdb_school_theme_color', value: themeColor })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ title: "Tersimpan!", text: "Tema sekolah berhasil diperbarui.", icon: "success", confirmButtonColor: themeColor })
          .then(() => window.location.reload());
      }
    } catch {
      if (typeof addToast === "function") addToast("Error", "Gagal menyimpan tema", "danger");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/35 flex items-center justify-center shrink-0" style={{ color: themeColor }}>
          <Palette size={20} />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Tema & Tampilan Warna</h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Pilih aksen warna untuk button, text highlight, dan latar belakang elemen aktif.</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Pilihan Warna Aksen:</label>
        <div className="flex flex-wrap gap-4">
          {PRESET_COLORS.map(c => (
            <button
              key={c.hex}
              onClick={() => setThemeColor(c.hex)}
              title={c.name}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 shadow-sm ${
                themeColor.toLowerCase() === c.hex.toLowerCase() ? "scale-110 border-slate-800 dark:border-white shadow-lg" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c.hex, boxShadow: themeColor.toLowerCase() === c.hex.toLowerCase() ? `0 4px 14px ${c.hex}60` : undefined }}
            >
              {themeColor.toLowerCase() === c.hex.toLowerCase() && <Check size={18} className="text-white drop-shadow-md" />}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Preview</span>
          <span className="text-sm font-bold block" style={{ color: themeColor }}>Teks Aksen & Button</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColor }}></div>
          <button className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all hover:brightness-110 active:scale-95" style={{ backgroundColor: themeColor, boxShadow: `0 6px 20px ${themeColor}35` }}>
            Tombol Sample
          </button>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSaveTheme}
          disabled={isSaving}
          className="px-6 py-3 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 disabled:opacity-50 hover:brightness-110 active:scale-95"
          style={{ backgroundColor: themeColor, boxShadow: `0 6px 20px ${themeColor}30` }}
        >
          {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Palette size={14} />}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan Tampilan"}
        </button>
      </div>
    </div>
  );
}

function SecuritySettingsSection() {
  const { adminToken, addToast } = usePPDB();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async () => {
    if (!newEmail) return;
    setIsSendingOtp(true);
    try {
      // TODO: Call backend /api/auth/send-otp
      setOtpSent(true);
      if (typeof addToast === "function") addToast("OTP Terkirim", `Kode verifikasi dikirim ke ${newEmail}`, "success");
    } catch {
      if (typeof addToast === "function") addToast("Gagal", "Gagal mengirim OTP", "danger");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!currentPassword) { setPasswordError("Password saat ini wajib diisi."); return; }
    if (newPassword.length < 6) { setPasswordError("Password baru harus minimal 6 karakter."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Konfirmasi password baru tidak cocok."); return; }
    setIsChangingPassword(true);
    try {
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/api/auth/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof addToast === "function") addToast("Password Diubah", data.message || "Password berhasil diperbarui.", "success");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        setPasswordError(data.message || "Gagal mengubah password.");
      }
    } catch {
      setPasswordError("Gagal menghubungi server backend.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ganti Email */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/35 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Ganti Email Admin</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Perubahan email memerlukan verifikasi OTP untuk keamanan</p>
          </div>
        </div>
        <div className="space-y-3">
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email.baru@sekolah.sch.id" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          {!otpSent ? (
            <button onClick={handleSendOtp} disabled={isSendingOtp || !newEmail} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
              {isSendingOtp ? <RefreshCw size={14} className="animate-spin" /> : <Mail size={14} />}
              Kirim Kode OTP
            </button>
          ) : (
            <div className="flex gap-2">
              <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Masukkan 6-digit OTP" maxLength={6} className="w-40 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">Verifikasi</button>
            </div>
          )}
        </div>
      </div>

      {/* Ganti Password */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/35 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Ganti Password</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Perbarui kata sandi secara berkala untuk perlindungan data</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordError && (
            <div className="p-3 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
              <span>{passwordError}</span>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><KeyRound size={13} /> Password Saat Ini</label>
            <div className="relative">
              <input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Masukkan password saat ini..." className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Lock size={13} /> Password Baru</label>
              <input type={showPasswords ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><ShieldCheck size={13} /> Konfirmasi</label>
              <input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={isChangingPassword} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(59,130,246,0.15)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2">
              {isChangingPassword ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
              {isChangingPassword ? "Memproses..." : "Simpan Password Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApiSettingsSection() {
  const [apiKey, setApiKey] = useState("sk_live_51xyz...");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/35 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <Zap size={20} />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Integrasi API & Kunci Akses</h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Kelola API Key untuk Tenaga Pendidik, Guru, dan Staff TU</p>
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">API Key Tenaga Pendidik (Guru/TU):</label>
        <div className="flex gap-2">
          <input type="text" value={apiKey} readOnly className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-200" />
          <button onClick={handleCopy} className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-[10px] text-slate-400">Gunakan key ini untuk mengakses data guru & staff TU via REST API eksternal.</p>
      </div>
    </div>
  );
}

/* ─── Main Settings Page ─── */

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams ? (searchParams.get("tab") || "general") : "general";
  const { adminToken, addToast, simulationActive, setSimulationActive, simulateRegistration, wsStatus, applicants } = usePPDB();
  const [mounted, setMounted] = useState<boolean>(false);
  const [seederInterval, setSeederInterval] = useState(5);
  const [seederRunning, setSeederRunning] = useState(false);
  const [seederCount, setSeederCount] = useState(0);
  const [isSingleInserting, setIsSingleInserting] = useState(false);
  const seederRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => { if (seederRef.current) clearInterval(seederRef.current); };
  }, []);

  const handleSingleInsert = async () => {
    try {
      setIsSingleInserting(true);
      await simulateRegistration();
      setSeederCount(prev => prev + 1);
      if (typeof addToast === "function") addToast("Siswa Ditambahkan", "1 data pendaftar dummy berhasil dimasukkan.", "success");
    } catch {
      if (typeof addToast === "function") addToast("Gagal", "Gagal memasukkan data dummy.", "danger");
    } finally {
      setIsSingleInserting(false);
    }
  };

  const handleStartAutoGenerate = () => {
    if (seederRunning) return;
    setSeederRunning(true);
    setSeederCount(0);
    simulateRegistration().then(() => setSeederCount(1)).catch(console.error);
    seederRef.current = setInterval(async () => {
      try { await simulateRegistration(); setSeederCount(prev => prev + 1); } catch (err) { console.error(err); }
    }, seederInterval * 1000);
  };

  const handleStopAutoGenerate = () => {
    if (seederRef.current) { clearInterval(seederRef.current); seederRef.current = null; }
    setSeederRunning(false);
    if (typeof addToast === "function" && seederCount > 0) addToast("Auto-Generate Dihentikan", `Total ${seederCount} data pendaftar dummy telah dimasukkan.`, "success");
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500 dark:text-blue-400" size={32} />
          <span className="text-sm font-semibold text-slate-500">Memuat konfigurasi...</span>
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
          <span>Pengaturan</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Kelola pengaturan sistem, tampilan, keamanan akun, dan integrasi API.
        </p>

        {/* Tab Switcher Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { id: "general", label: "Utama / General" },
            { id: "appearance", label: "Tema & Tampilan" },
            { id: "security", label: "Keamanan" },
            { id: "api", label: "Integrasi API" }
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

      {/* Tab Content */}
      <div className="space-y-6">
        {currentTab === 'general' && <GeneralSettingsSection />}
        {currentTab === 'appearance' && <AppearanceSettingsSection />}
        {currentTab === 'security' && <SecuritySettingsSection />}
        {currentTab === 'api' && <ApiSettingsSection />}
      </div>

      {/* Dev Tools Section (always visible) */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none"></div>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/35 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Mode Pengujian Data</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Masukkan data pendaftar dummy untuk simulasi dan pengujian sistem</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                seederRunning ? "bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200/40 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 animate-pulse" : "bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800/40 text-slate-500 dark:text-slate-400"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${seederRunning ? "bg-emerald-500" : "bg-slate-400"}`}></div>
                {seederRunning ? "Active" : "Idle"}
              </span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Masukkan Satu Siswa</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tekan tombol untuk memasukkan 1 data pendaftar dummy secara instan.</p>
              </div>
              <button onClick={handleSingleInsert} disabled={isSingleInserting || seederRunning} className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(16,185,129,0.15)] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer shrink-0">
                {isSingleInserting ? <><RefreshCw size={14} className="animate-spin" />Menambahkan...</> : <><UserPlus size={14} />Tambah 1 Siswa</>}
              </button>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800/60"></div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Auto-Generate Siswa</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Masukkan data pendaftar secara otomatis dengan interval waktu yang bisa diatur.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex-1">
                  <Timer size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Interval:</span>
                  <input type="number" min={1} max={120} value={seederInterval} onChange={(e) => setSeederInterval(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))} disabled={seederRunning} className="w-16 text-center bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 text-xs font-black text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50 transition-all" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">detik</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!seederRunning ? (
                  <button onClick={handleStartAutoGenerate} className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(59,130,246,0.15)] active:scale-[0.98] flex items-center gap-2 cursor-pointer">
                    <Play size={14} />Mulai Auto-Generate
                  </button>
                ) : (
                  <button onClick={handleStopAutoGenerate} className="px-5 py-3 bg-gradient-to-r from-rose-600 to-pink-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(244,63,94,0.15)] active:scale-[0.98] flex items-center gap-2 cursor-pointer">
                    <Square size={14} />Stop Auto-Generate
                  </button>
                )}
                {(seederRunning || seederCount > 0) && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 rounded-2xl">
                    <Users size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                      {seederCount} <span className="font-bold text-emerald-500">siswa ditambahkan</span>
                    </span>
                    {seederRunning && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
