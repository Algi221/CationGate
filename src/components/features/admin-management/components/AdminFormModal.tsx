"use client";

import React from "react";
import { motion } from "framer-motion";
import { Save, User, KeyRound, Eye, EyeOff, Mail, ShieldAlert, Sparkles } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface AdminFormModalProps {
  editAdminId: number | null;
  formData: { username: string; email: string; password: string; nama_lengkap: string; role: string };
  setFormData: React.Dispatch<React.SetStateAction<{ username: string; email: string; password: string; nama_lengkap: string; role: string }>>;
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
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500" />
            {editAdminId ? "Edit Akun Admin / Staf" : "Tambah Akun Admin / Staf Baru"}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {editAdminId
              ? "Perbarui kredensial dan hak akses staf pengelola portal."
              : "Kredensial dan tautan aktivasi akan dikirimkan langsung ke Gmail staf panitia."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={formData.nama_lengkap ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, nama_lengkap: e.target.value }))}
                placeholder="Contoh: Budi Santoso, S.Kom"
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Email / Gmail Staf <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value.trim().toLowerCase() }))}
                placeholder="Contoh: budi.panitia@gmail.com"
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Username <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.username ?? ""}
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
              Hak Akses / Peran
            </label>
            <Select value={formData.role ?? "admin"} onValueChange={(val) => setFormData((prev) => ({ ...prev, role: val }))}>
              <SelectTrigger className="w-full h-11 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 rounded-xl px-4 text-xs font-bold text-slate-800 dark:text-white">
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin / Panitia PPDB (Lengkap)</SelectItem>
                <SelectItem value="panitia">Panitia Verifikator Berkas</SelectItem>
                <SelectItem value="viewer">Pengawas / Viewer Saja</SelectItem>
                <SelectItem value="superadmin">Superadmin Sekolah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Kata Sandi Awal {editAdminId ? "(Kosongkan jika tidak diubah)" : "(Opsional - Staf dapat set saat aktivasi link Gmail)"}
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={editAdminId ? "••••••••" : "Buat password awal atau biarkan kosong"}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {!editAdminId && (
          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 flex items-start gap-2.5">
            <ShieldAlert size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
              Setelah akun dibuat, sistem akan membuat <strong>Tautan Aktivasi Aman</strong> yang terikat eksklusif dengan <strong>ID Instansi Sekolah Anda</strong>. Staf dapat mengklik link dari Gmail atau Anda dapat menyalin link secara langsung.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={formLoading}
            className="px-6 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            {formLoading ? "Menyimpan..." : editAdminId ? "Simpan Perubahan" : "Buat Akun & Kirim Link"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
