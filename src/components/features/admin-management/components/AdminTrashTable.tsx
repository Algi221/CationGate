"use client";

import React from "react";
import { User, KeyRound, RotateCcw } from "lucide-react";
import { AdminItem } from "../types";

interface AdminTrashTableProps {
  trashedAdmins: AdminItem[];
  trashLoading: boolean;
  handleRestoreAdmin: (id: number) => void;
}

export const AdminTrashTable: React.FC<AdminTrashTableProps> = ({
  trashedAdmins,
  trashLoading,
  handleRestoreAdmin
}) => {
  if (trashLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-red-50/50 dark:bg-red-950/20 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] font-black text-red-700 dark:text-red-400">
            <tr>
              <th className="py-4 px-6">Nama & Username Dihapus</th>
              <th className="py-4 px-6">Peran Sebelumnya</th>
              <th className="py-4 px-6">Dihapus Pada</th>
              <th className="py-4 px-6 text-right">Aksi Pemulihan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {trashedAdmins.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                  Tempat sampah kosong. Tidak ada akun admin yang dihapus.
                </td>
              </tr>
            ) : (
              trashedAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-black">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold">{admin.nama_lengkap}</div>
                        <div className="text-[11px] font-mono text-slate-400">@{admin.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <KeyRound size={10} />
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-400">
                    {admin.deleted_at
                      ? new Date(admin.deleted_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : "-"}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleRestoreAdmin(admin.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-xl text-[11px] font-extrabold transition"
                    >
                      <RotateCcw size={13} />
                      Pulihkan
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
