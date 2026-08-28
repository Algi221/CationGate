"use client";

import React, { useState } from "react";
import {
  User, Save, RefreshCw, CheckCircle2, Camera
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

  // Statuses
  const [savingProfile, setSavingProfile] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: "Ukuran File Terlalu Besar",
        text: "Maksimal ukuran foto adalah 2 MB.",
        icon: "warning",
        confirmButtonColor: "#FFD33B",
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
        confirmButtonColor: "#FFD33B",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    }, 500);
  };

  return (
    <div className="min-h-screen w-full space-y-6 text-left pb-16">
      {/* ─── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-blue dark:text-white tracking-tight">
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
              <User className="w-5 h-5 text-yellow dark:text-yellow" />
              Informasi Pengguna
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Data diri dan kontak resmi penanggung jawab platform Gatekeeper.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-yellow/10 dark:bg-yellow/20 text-dark-blue dark:text-yellow text-xs font-bold border border-yellow/30 dark:border-yellow/40">
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
              <div className="w-20 h-20 rounded-2xl bg-dark-blue text-yellow font-extrabold text-2xl flex items-center justify-center shadow-sm">
                UN
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-yellow-hover shadow-md cursor-pointer transition-colors"
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
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 px-3 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 rounded-l-xl flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 select-none">
                  +62
                </div>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={13}
                  value={phone ? phone.replace(/^(\+?62|0)/, "") : ""}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "");
                    if (val.startsWith("0")) val = val.slice(1);
                    if (val.startsWith("62")) val = val.slice(2);
                    val = val.slice(0, 13);
                    setPhone(val ? `0${val}` : "");
                  }}
                  placeholder="81234567890"
                  className="h-10 pl-14 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              disabled={savingProfile}
              className="h-10 px-5 rounded-xl bg-yellow text-dark-blue hover:bg-yellow-hover font-bold text-xs shadow-sm shadow-yellow/20 cursor-pointer"
            >
              {savingProfile ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
