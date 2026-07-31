"use client";

import React, { useState } from "react";
import {
  User, ShieldCheck, Key, Lock, Mail, Save, RefreshCw, CheckCircle2, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function GatekeeperProfilePage() {
  const [fullName, setFullName] = useState("Gatekeeper CationGate Platform");
  const [email, setEmail] = useState("uno@cationgate.id");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = () => {
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      Swal.fire({
        title: "Profil Diperbarui!",
        text: "Informasi nama dan email Gatekeeper berhasil disimpan.",
        icon: "success",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    }, 500);
  };

  const handleChangePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
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
        title: "Password Diperbarui!",
        text: "Password Gatekeeper berhasil diperbarui.",
        icon: "success",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            UN
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Gatekeeper uno
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Platform Superadmin
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Superadministrator Utama Platform SaaS CationGate Multi-Tenant.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Info Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Informasi Identitas Admin
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Username System</label>
              <Input value="uno" disabled className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-bold" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Resmi Gatekeeper</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleUpdateProfile}
              disabled={savingProfile}
              className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              {savingProfile ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Profil
            </Button>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" /> Ubah Password Gatekeeper
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password Saat Ini</label>
              <Input
                type="password"
                placeholder="Masukkan password 'reverse'"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password Baru</label>
              <Input
                type="password"
                placeholder="Masukkan password baru..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password Baru</label>
              <Input
                type="password"
                placeholder="Ulangi password baru..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              {savingPassword ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
              Perbarui Password
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}
