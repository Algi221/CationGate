"use client";

import React from "react";
import { Edit, Lock } from "lucide-react";

interface ProfileInfoCardsProps {
  displayNama: string;
  username: string;
  email: string;
  displayRole: string;
  displaySchool: string;
  onOpenEditProfile: () => void;
  onOpenEditPassword: () => void;
}

export function ProfileInfoCards({
  displayNama,
  username,
  email,
  displayRole,
  displaySchool,
  onOpenEditProfile,
  onOpenEditPassword,
}: ProfileInfoCardsProps) {
  return (
    <div className="space-y-6">
      {/* --- CARD: PERSONAL INFORMATION --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800">Profil Saya</h3>
          <button
            onClick={onOpenEditProfile}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors w-full md:w-auto shadow-sm cursor-pointer"
          >
            <Edit size={16} /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Nama Lengkap
            </span>
            <p className="text-base font-semibold text-slate-800">{displayNama}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Username
            </span>
            <p className="text-base font-semibold text-slate-800">
              {username || "-"}
            </p>
          </div>

          <div className="md:col-span-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Email Address
            </span>
            <p className="text-base font-semibold text-slate-800">
              {email || "-"}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Role Pengguna
            </span>
            <p className="text-base font-semibold text-slate-800">
              {displayRole}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Instansi
            </span>
            <p className="text-base font-semibold text-slate-800">
              {displaySchool}
            </p>
          </div>
        </div>
      </div>

      {/* --- CARD: SECURITY --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800">Security</h3>
          <button
            onClick={onOpenEditPassword}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors w-full md:w-auto shadow-sm cursor-pointer"
          >
            <Lock size={16} /> Change Password
          </button>
        </div>
        <p className="text-sm text-slate-500">
          Amankan akun administrator Anda dengan rutin memperbarui kata sandi secara berkala.
        </p>
      </div>
    </div>
  );
}
