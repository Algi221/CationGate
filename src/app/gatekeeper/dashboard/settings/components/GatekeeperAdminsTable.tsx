"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface AdminUserItem {
  id: string | number;
  nama_lengkap: string;
  username: string;
  email: string;
  role: string;
  avatar_text?: string;
}

interface GatekeeperAdminsTableProps {
  adminsList: AdminUserItem[];
  loadingAdmins: boolean;
}

export function GatekeeperAdminsTable({
  adminsList,
  loadingAdmins,
}: GatekeeperAdminsTableProps) {
  return (
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
              <th className="py-3.5 px-4">Username &amp; Email</th>
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
                <tr
                  key={adm.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs shrink-0">
                        {adm.avatar_text ||
                          adm.nama_lengkap.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{adm.nama_lengkap}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    <div>@{adm.username}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {adm.email}
                    </div>
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
  );
}
