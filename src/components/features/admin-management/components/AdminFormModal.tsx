"use client";

import React from "react";
import { motion } from "framer-motion";
import { Save, User, KeyRound, Eye, EyeOff } from "lucide-react";

interface AdminFormModalProps {
  editAdminId: number | null;
  formData: { username: string; password: string; nama_lengkap: string; role: string };
  setFormData: React.Dispatch<React.SetStateAction<{ username: string; password: string; nama_lengkap: string; role: string }>>;
  formLoading: boolean;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

export const AdminFormModal: React.FC<AdminFormModalProps> = ({
  editAdminId,
  formData,
  setFormData,
  formLoading,
  showPassword,
  setShowPassword,
  handleSubmit,
  handleCancel
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-[#0f172a] border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 shadow-md"
    >
      <h2 className="text-base font-extrabold text-slate-800 dark:text-white mb-4">
        {editAdminId ? "Edit Akun Admin" : "Buat Akun Admin / Staf Baru"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={formData.nama_lengkap}
                onChange={(e) => setFormData((prev) => ({ ...prev, nama_lengkap: e.target.value }))}
                placeholder="Contoh: Budi Santoso, S.Kom"
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value.toLowerCase().replace(/\s+/g, "")
                  }))
                }
                placeholder="Contoh: panitia_budi"
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Password {editAdminId && "(Kosongkan jika tidak ingin diubah)"}
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required={!editAdminId}
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={editAdminId ? "••••••••" : "Buat kata sandi akun"}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Hak Akses / Peran
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin / Panitia PPDB</option>
              <option value="superadmin">Superadmin Sekolah</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={formLoading}
            className="px-6 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save size={15} />
            {formLoading ? "Menyimpan..." : editAdminId ? "Simpan Perubahan" : "Buat Akun"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
