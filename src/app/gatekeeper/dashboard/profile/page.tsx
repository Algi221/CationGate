"use client";

import React, { useState } from "react";
import {
  User, Key, Lock, Save, RefreshCw, Smartphone, Laptop,
  CheckCircle2, Eye, EyeOff, ShieldCheck, Camera, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function GatekeeperProfilePage() {
  // Profile Form States
  const [fullName, setFullName] = useState("Gatekeeper Platform");
  const [email, setEmail] = useState("uno@cationgate.id");
  const [phone, setPhone] = useState("+62 812-9988-7766");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Statuses
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: "Ukuran File Terlalu Besar",
        text: "Maksimal ukuran foto adalah 2 MB.",
        icon: "warning",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      Swal.fire({
        title: "Profil Berhasil Disimpan",
        text: "Informasi profil Anda telah berhasil diperbarui.",
        icon: "success",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    }, 500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      Swal.fire({
        title: "Password Saat Ini Wajib Diisi",
        text: "Masukkan password lama Anda untuk konfirmasi perubahan.",
        icon: "warning",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        title: "Password Kurang Kuat",
        text: "Password baru minimal harus 8 karakter.",
        icon: "warning",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Password Tidak Cocok",
        text: "Password baru dan konfirmasi password harus sama.",
        icon: "error",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Swal.fire({
        title: "Password Diperbarui",
        text: "Kata sandi akun Anda berhasil diganti.",
        icon: "success",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    }, 600);
  };

  const handleTerminateOtherSessions = () => {
    Swal.fire({
      title: "Keluar dari Sesi Lain?",
      text: "Akun Anda akan keluar dari seluruh perangkat dan browser lain.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#DC2626",
      customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: "Berhasil",
          text: "Semua sesi di perangkat lain telah dihentikan.",
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    });
  };

  // Password strength
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (/[A-Z]/.test(newPassword)) score += 25;
    if (/[0-9]/.test(newPassword)) score += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 25;
    return score;
  };
  const passStrength = getPasswordStrength();

  return (
    <div className="space-y-6 max-w-4xl text-left pb-16">
      {/* ─── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profil Saya
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Kelola informasi identitas akun, kredensial login, dan pengaturan keamanan Anda.
        </p>
      </div>

      {/* ─── 1. INFORMASI PRIBADI & FOTO PROFIL ────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Informasi Pengguna
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Data diri dan kontak resmi penanggung jawab platform Gatekeeper.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-900">
            Superadmin Platform
          </span>
        </div>

        {/* Photo Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-1">
          <div className="relative group">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Foto Profil"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-sm">
                UN
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 shadow-md cursor-pointer transition-colors"
              title="Ganti Foto"
            >
              <Camera size={14} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Foto Profil
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Format yang didukung: JPG, PNG, atau WebP. Maksimal 2 MB.
            </p>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="text-xs text-red-600 hover:underline font-semibold pt-1 cursor-pointer"
              >
                Hapus foto
              </button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Username Akun
              </label>
              <Input
                value="uno"
                disabled
                className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Lengkap
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Alamat Email Resmi
                </label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Terverifikasi
                </span>
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nomor Telepon / WhatsApp
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              disabled={savingProfile}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              {savingProfile ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>

      {/* ─── 2. KEAMANAN & UBAH KATA SANDI ─────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Ubah Kata Sandi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gunakan kombinasi minimal 8 karakter dengan angka dan simbol untuk menjaga keamanan akun.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Kata Sandi Saat Ini
            </label>
            <div className="relative max-w-lg">
              <Input
                type={showCurrentPass ? "text" : "password"}
                placeholder="Masukkan kata sandi lama"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 pr-10 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Input
                  type={showNewPass ? "text" : "password"}
                  placeholder="Minimal 8 karakter..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 pr-10 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passStrength <= 25
                          ? "w-1/4 bg-red-500"
                          : passStrength <= 50
                            ? "w-2/4 bg-amber-500"
                            : passStrength <= 75
                              ? "w-3/4 bg-blue-500"
                              : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Kekuatan: {passStrength <= 25 ? "Lemah" : passStrength <= 50 ? "Sedang" : passStrength <= 75 ? "Kuat" : "Sangat Kuat"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Ulangi kata sandi baru..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 pr-10 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              disabled={savingPassword}
              className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              {savingPassword ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
              Perbarui Kata Sandi
            </Button>
          </div>
        </form>
      </div>

      {/* ─── 3. KEAMANAN DUA LANGKAH (2FA) & SESI AKTIF ────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Keamanan Tambahan & Sesi Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kontrol otentikasi dua langkah dan kelola daftar perangkat yang sedang terhubung.
          </p>
        </div>

        {/* 2FA Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white text-xs">
              Verifikasi Dua Langkah (2FA) via OTP Email
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Setiap login dari perangkat baru akan memerlukan kode OTP yang dikirim ke alamat email resmi Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ml-4 ${
              twoFactorEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                twoFactorEnabled ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Active Sessions List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop size={14} className="text-blue-500" /> Perangkat Terhubung (Sesi Aktif)
            </h3>
            <button
              type="button"
              onClick={handleTerminateOtherSessions}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={12} /> Keluar dari Sesi Lain
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Device 1 (Current) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">
                    Chrome di Windows <span className="text-blue-600 font-bold ml-1.5 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md text-[10px] border border-blue-200 dark:border-blue-900">Perangkat Ini</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Jakarta, Indonesia • IP: 103.144.18.24 • Aktif Sekarang
                  </p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Aktif" />
            </div>

            {/* Device 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                    Safari di Apple iPhone
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Depok, Indonesia • IP: 182.253.11.8 • Terakhir aktif 2 hari lalu
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Siaga</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
