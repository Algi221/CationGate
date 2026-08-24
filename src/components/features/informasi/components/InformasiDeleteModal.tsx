"use client";

import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";

interface InformasiDeleteModalProps {
  deleteConfirmId: number | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const InformasiDeleteModal: React.FC<InformasiDeleteModalProps> = ({
  deleteConfirmId,
  onCancel,
  onConfirm
}) => {
  if (!deleteConfirmId) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 my-8 transition-colors duration-300 text-center relative p-8">
        <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 dark:text-rose-400 mx-auto mb-6 border border-rose-200 dark:border-rose-900/30">
          <AlertCircle size={36} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-3">
          Hapus Informasi?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
          Apakah Anda yakin ingin menghapus pengumuman informasi ini secara permanen? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider border border-slate-200 dark:border-white/5 transition-all w-full sm:w-auto cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(225,29,72,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Ya, Hapus Permanen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
