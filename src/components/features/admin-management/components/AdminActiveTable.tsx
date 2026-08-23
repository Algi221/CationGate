"use client";

import React from "react";
import { User, KeyRound, Edit3, Trash2 } from "lucide-react";
import { AdminItem } from "../types";

interface AdminActiveTableProps {
  admins: AdminItem[];
  loading: boolean;
  adminUser: { id?: number; username?: string; role?: string } | null;
  handleEditClick: (admin: AdminItem) => void;
  handleDeleteAdmin: (id: number, nama: string) => void;
}

export const AdminActiveTable: React.FC<AdminActiveTableProps> = ({
  admins,
  loading,
  adminUser,
  handleEditClick,
  handleDeleteAdmin
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] font-black text-slate-500">
            <tr>
              <th className="py-4 px-6">Nama Staf & Username</th>
              <th className="py-4 px-6">Hak Akses / Peran</th>
              <th className="py-4 px-6">Dibuat Tanggal</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                  Belum ada staf panitia atau admin terdaftar.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold">{admin.nama_lengkap}</div>
                        <div className="text-[11px] font-mono text-slate-400">@{admin.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        admin.role === "superadmin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                      }`}
                    >
                      <KeyRound size={10} />
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-400">
                    {admin.created_at
                      ? new Date(admin.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      : "-"}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(admin)}
                        className="p-2 rounded-xl text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Edit Admin"
                      >
                        <Edit3 size={15} />
                      </button>
                      {admin.id !== adminUser?.id && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, admin.nama_lengkap)}
                          className="p-2 rounded-xl text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Hapus ke Sampah"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
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
};
