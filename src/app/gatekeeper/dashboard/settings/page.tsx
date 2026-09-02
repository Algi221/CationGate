"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import Swal from "sweetalert2";
import {
  ChangePasswordCard,
  ActiveSessionsCard,
  GatekeeperAdminsTable,
  MaintenanceModeCard,
} from "./components";

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
        const res = await fetch(
          `/api/gatekeeper/maintenance-status?_t=${Date.now()}`,
        );
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
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("gatekeeper_token")
            : null;
        const res = await fetch(`/api/gatekeeper/admins?_t=${Date.now()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" },
      });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      Swal.fire({
        title: "Kata Sandi Kurang Kuat",
        text: "Kata sandi baru minimal harus 8 karakter.",
        icon: "warning",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" },
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Kata Sandi Tidak Cocok",
        text: "Konfirmasi kata sandi baru tidak sama.",
        icon: "error",
        confirmButtonColor: "#DC2626",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" },
      });
      return;
    }

    setSavingPassword(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("gatekeeper_token")
          : null;
      const res = await fetch("/api/gatekeeper/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
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
          customClass: {
            popup: "rounded-2xl dark:bg-slate-900 dark:text-white",
          },
        });
      } else {
        Swal.fire({
          title: "Gagal Mengubah Kata Sandi",
          text: json.message || "Kata sandi saat ini tidak sesuai.",
          icon: "error",
          confirmButtonColor: "#DC2626",
          customClass: {
            popup: "rounded-2xl dark:bg-slate-900 dark:text-white",
          },
        });
      }
    } catch (_err) {
      Swal.fire({
        title: "Kesalahan Server",
        text: "Terjadi kesalahan saat menghubungkan ke server.",
        icon: "error",
        confirmButtonColor: "#DC2626",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" },
      });
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle Maintenance Toggle with SweetAlert confirmation
  const handleToggleMaintenance = () => {
    const nextState = !maintenanceMode;

    Swal.fire({
      title: nextState
        ? "Aktifkan Mode Maintenance?"
        : "Nonaktifkan Mode Maintenance?",
      text: nextState
        ? "Seluruh landing page sekolah tenant akan dialihkan ke halaman pemeliharaan sistem (UFO). Akses Gatekeeper tetap dapat berjalan normal."
        : "Platform akan kembali online untuk seluruh publik dan sekolah tenant.",
      icon: nextState ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: nextState ? "#F59E0B" : "#10B981",
      cancelButtonColor: "#64748B",
      confirmButtonText: nextState
        ? "Ya, Aktifkan Maintenance"
        : "Ya, Kembalikan Live",
      cancelButtonText: "Batal",
      customClass: {
        popup:
          "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setMaintenanceLoading(true);
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("gatekeeper_token")
              : null;
          const res = await fetch("/api/gatekeeper/maintenance-mode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ enabled: nextState }),
          });

          const json = await res.json();
          if (res.ok && json.success) {
            setMaintenanceMode(nextState);
            Swal.fire({
              title: nextState ? "Mode Maintenance Aktif!" : "Platform Live!",
              text: json.message,
              icon: "success",
              confirmButtonColor: "#2563EB",
              customClass: {
                popup: "rounded-2xl dark:bg-slate-900 dark:text-white",
              },
            });
          }
        } catch (_err) {
          Swal.fire({
            title: "Gagal Mengubah Mode",
            text: "Terjadi kesalahan koneksi server.",
            icon: "error",
            confirmButtonColor: "#DC2626",
            customClass: {
              popup: "rounded-2xl dark:bg-slate-900 dark:text-white",
            },
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
        popup:
          "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("gatekeeper_token")
              : null;
          await fetch("/api/gatekeeper/logout-other-sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
        } catch (_e) {}

        Swal.fire({
          title: "Sesi Berhasil Diputus",
          text: "Hanya sesi di perangkat ini yang tetap aktif.",
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: {
            popup: "rounded-2xl dark:bg-slate-900 dark:text-white",
          },
        });
      }
    });
  };

  return (
    <div className="space-y-6 w-full transition-colors pb-12 animate-in fade-in duration-500">
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

      {/* ── CARD 1: UBAH KATA SANDI ────────────────────── */}
      <ChangePasswordCard
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showCurrentPassword={showCurrentPassword}
        setShowCurrentPassword={setShowCurrentPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        savingPassword={savingPassword}
        onSubmit={handleUpdatePassword}
      />

      {/* ── CARD 2: KEAMANAN TAMBAHAN & SESI LOGIN ─────── */}
      <ActiveSessionsCard
        onLogoutOtherSessions={handleLogoutOtherSessions}
      />

      {/* ── CARD 3: DAFTAR ADMIN GATEKEEPER ─────────────── */}
      <GatekeeperAdminsTable
        adminsList={adminsList}
        loadingAdmins={loadingAdmins}
      />

      {/* ── CARD 4: MODE PEMELIHARAAN PLATFORM ─────────────── */}
      <MaintenanceModeCard
        maintenanceMode={maintenanceMode}
        maintenanceLoading={maintenanceLoading}
        onToggleMaintenance={handleToggleMaintenance}
      />
    </div>
  );
}
