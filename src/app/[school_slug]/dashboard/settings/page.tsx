"use client";

import React, { useState } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { 
  Settings, 
  RefreshCw,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import Swal from 'sweetalert2';

export default function SettingsPage() {
  const { adminToken } = usePPDB();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

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
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/auth/change-password`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess(data.message || "Password berhasil diperbarui.");
        setCurrentPassword(""); 
        setNewPassword(""); 
        setConfirmPassword("");
        Swal.fire({
          icon: "success",
          title: "Password Berhasil Diubah",
          text: "Password akun superadmin Anda telah berhasil diperbarui.",
          confirmButtonColor: "#2563EB"
        });
      } else {
        setPasswordError(data.message || "Gagal mengubah password.");
      }
    } catch {
      setPasswordError("Gagal menghubungi server backend.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500 dark:text-blue-400" size={32} />
          <span className="text-sm font-semibold text-slate-500">Memuat pengaturan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl animate-in fade-in duration-500 text-left pb-16">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="text-blue-500 dark:text-blue-400" size={24} />
          <span>Pengaturan Akun</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Kelola kredensial login akun superadmin sekolah Anda.
        </p>
      </div>

      {/* Card: Ganti Password Superadmin */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/35 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <KeyRound size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Ganti Password Superadmin</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Perbarui kata sandi akun admin sekolah secara berkala</p>
          </div>
        </div>

        {passwordError && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs font-bold text-rose-700 dark:text-rose-400">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password lama"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Password Baru (min. 6 karakter)</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Konfirmasi Password Baru</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isChangingPassword ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
              {isChangingPassword ? "Memperbarui..." : "Simpan Password Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
