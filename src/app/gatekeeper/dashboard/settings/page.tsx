"use client";

import React, { useState, useEffect } from "react";
import {
  Settings, Lock, KeyRound, Eye, EyeOff, ShieldCheck,
  Laptop, LogOut, AlertTriangle, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function GatekeeperSettingsPage() {
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Maintenance Mode State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  // Gatekeeper Admins State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  // Fetch initial maintenance status and admins
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const res = await fetch(`/api/gatekeeper/maintenance-status?_t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setMaintenanceMode(Boolean(json.is_maintenance));
          }
        }
      } catch (_e) {}
    };

    const fetchAdmins = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("gatekeeper_token") : null;
        const res = await fetch(`/api/gatekeeper/admins?_t=${Date.now()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setAdminsList(json.data);
          }
        }
      } catch (_e) {} finally {
        setLoadingAdmins(false);
      }
    };

    fetchMaintenanceStatus();
    fetchAdmins();
  }, []);

  // Handle Change Password (Submit form)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      Swal.fire({
        title: "Perhatian",
        text: "Harap masukkan kata sandi saat ini.",
        icon: "warning",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      Swal.fire({
        title: "Kata Sandi Kurang Kuat",
        text: "Kata sandi baru minimal harus 8 karakter.",
        icon: "warning",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Kata Sandi Tidak Cocok",
        text: "Konfirmasi kata sandi baru tidak sama.",
        icon: "error",
        confirmButtonColor: "#DC2626",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    setSavingPassword(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gatekeeper_token") : null;
      const res = await fetch("/api/gatekeeper/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Swal.fire({
          title: "Kata Sandi Diperbarui!",
          text: "Kata sandi akun Gatekeeper berhasil diubah.",
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      } else {
        Swal.fire({
          title: "Gagal Mengubah Kata Sandi",
          text: json.message || "Kata sandi saat ini tidak sesuai.",
          icon: "error",
          confirmButtonColor: "#DC2626",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    } catch (_err) {
      Swal.fire({
        title: "Kesalahan Server",
        text: "Terjadi kesalahan saat menghubungkan ke server.",
        icon: "error",
        confirmButtonColor: "#DC2626",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle Maintenance Toggle with SweetAlert confirmation
  const handleToggleMaintenance = () => {
    const nextState = !maintenanceMode;

    Swal.fire({
      title: nextState ? "Aktifkan Mode Maintenance?" : "Nonaktifkan Mode Maintenance?",
      text: nextState
        ? "Seluruh landing page sekolah tenant akan dialihkan ke halaman pemeliharaan sistem (UFO). Akses Gatekeeper tetap dapat berjalan normal."
        : "Platform akan kembali online untuk seluruh publik dan sekolah tenant.",
      icon: nextState ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: nextState ? "#F59E0B" : "#10B981",
      cancelButtonColor: "#64748B",
      confirmButtonText: nextState ? "Ya, Aktifkan Maintenance" : "Ya, Kembalikan Live",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setMaintenanceLoading(true);
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("gatekeeper_token") : null;
          const res = await fetch("/api/gatekeeper/maintenance-mode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ enabled: nextState })
          });

          const json = await res.json();
          if (res.ok && json.success) {
            setMaintenanceMode(nextState);
            Swal.fire({
              title: nextState ? "Mode Maintenance Aktif!" : "Platform Live!",
              text: json.message,
              icon: "success",
              confirmButtonColor: "#2563EB",
              customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
            });
          }
        } catch (_err) {
          Swal.fire({
            title: "Gagal Mengubah Mode",
            text: "Terjadi kesalahan koneksi server.",
            icon: "error",
            confirmButtonColor: "#DC2626",
            customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
          });
        } finally {
          setMaintenanceLoading(false);
        }
      }
    });
  };

  // Handle Logout Other Sessions
  const handleLogoutOtherSessions = () => {
    Swal.fire({
      title: "Keluar dari Sesi Lain?",
      text: "Seluruh perangkat lain yang sedang login dengan akun Gatekeeper ini akan diputus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Putus Sesi Lain",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("gatekeeper_token") : null;
          await fetch("/api/gatekeeper/logout-other-sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          });
        } catch (_e) {}

        Swal.fire({
          title: "Sesi Berhasil Diputus",
          text: "Hanya sesi di perangkat ini yang tetap aktif.",
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    });
  };

  return (
    <div className="space-y-6 w-full transition-colors duration-300 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#2e3749] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#2e3749] dark:text-[#FFD33B]" />
            Pengaturan Sistem &amp; Keamanan Akun
          </h1>
          <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-1">
            Kelola kata sandi akun Gatekeeper, pantau sesi login aktif, dan kontrol mode pemeliharaan platform.
          </p>
        </div>
      </div>

      {/* ── CARD 1: UBAH KATA SANDI (MATCHING FOTO 1) ────────────────────── */}
      <div className="bg-white dark:bg-[#2e3749] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs space-y-6 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-[#FFD33B] border border-blue-200/60 dark:border-white/10 shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
              Ubah Kata Sandi
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-0.5">
              Gunakan kombinasi minimal 8 karakter dengan angka dan simbol untuk menjaga keamanan akun.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Kata Sandi Saat Ini */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Kata Sandi Saat Ini
            </label>
            <div className="relative max-w-lg">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi lama"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium pr-10 focus-visible:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Grid Kata Sandi Baru & Konfirmasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium pr-10 focus-visible:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi baru..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium pr-10 focus-visible:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Button Simpan Perbarui Kata Sandi */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={savingPassword}
              className="h-11 px-6 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              {savingPassword ? (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}
              Perbarui Kata Sandi
            </Button>
          </div>
        </form>
      </div>

      {/* ── CARD 2: KEAMANAN TAMBAHAN & SESI LOGIN (MATCHING FOTO 1) ─────── */}
      <div className="bg-white dark:bg-[#2e3749] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs space-y-6 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-white/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-white/10 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
              Keamanan Tambahan &amp; Sesi Login
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-0.5">
              Pantau dan kelola daftar perangkat yang sedang terhubung ke akun Gatekeeper.
            </p>
          </div>
        </div>

        {/* Sesi Login Aktif List */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-slate-500" /> Perangkat Terhubung (Sesi Aktif)
            </h4>
            <button
              onClick={handleLogoutOtherSessions}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar dari Sesi Lain
            </button>
          </div>

          {/* Sesi 1: Perangkat Ini (Dynamic) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900 dark:text-white text-xs">
                    {typeof window !== "undefined" && navigator.userAgent.includes("Windows") ? "Chrome di Windows" : typeof window !== "undefined" && navigator.userAgent.includes("Mac") ? "Safari di macOS" : "Browser Web"}
                  </p>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-300 dark:border-slate-700">
                    Perangkat Ini
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-white/60 font-mono mt-0.5">
                  IP: 103.144.18.24 • Indonesia • Aktif Sekarang
                </p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0" title="Online Sekarang" />
          </div>
        </div>
      </div>

      {/* ── CARD 3: DAFTAR ADMIN GATEKEEPER & STATUS ONLINE ─────────────── */}
      <div className="bg-white dark:bg-[#2e3749] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs space-y-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-white/10 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                Daftar Admin Gatekeeper Platform
              </h3>
              <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-0.5">
                Pantau seluruh administrator sistem Gatekeeper dan status aktivitas real-time.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
            {adminsList.length} Administrator
          </span>
        </div>

        {/* Table of Gatekeeper Admins */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Nama Administrator</th>
                <th className="py-3.5 px-4">Username & Email</th>
                <th className="py-3.5 px-4">Hak Akses</th>
                <th className="py-3.5 px-4 text-right">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {loadingAdmins ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Memuat data admin...
                  </td>
                </tr>
              ) : adminsList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Tidak ada admin terdaftar
                  </td>
                </tr>
              ) : (
                adminsList.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs shrink-0">
                          {adm.avatar_text || adm.nama_lengkap.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{adm.nama_lengkap}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      <div>@{adm.username}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{adm.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {adm.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Online (Aktif)</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CARD 4: MODE PEMELIHARAAN PLATFORM (MAINTENANCE) ─────────────── */}
      <div className="bg-white dark:bg-[#2e3749] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs space-y-4 transition-colors duration-300">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2 tracking-tight">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Mode Pemeliharaan Platform (Maintenance)
        </h3>
        <p className="text-xs text-slate-500 dark:text-white/60 leading-relaxed font-medium">
          Mengaktifkan mode ini akan menampilkan pesan pemeliharaan sistem pada seluruh landing page sekolah tenant. Akses Gatekeeper tetap dapat berjalan normal.
        </p>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-xs">Status Maintenance System</p>
            <p className="text-[11px] text-slate-500 dark:text-white/60 mt-0.5 font-medium flex items-center gap-1.5">
              {maintenanceMode ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  🚨 System saat ini dalam mode maintenance (Landing page dialihkan ke error UFO)
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  🟢 Platform berjalan normal (Live Production)
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            disabled={maintenanceLoading}
            onClick={handleToggleMaintenance}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              maintenanceMode ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                maintenanceMode ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
