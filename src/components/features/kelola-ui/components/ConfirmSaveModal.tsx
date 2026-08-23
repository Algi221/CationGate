"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface ConfirmSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changeDescription: string;
  onChangeDescription: (desc: string) => void;
}

export const ConfirmSaveModal: React.FC<ConfirmSaveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  changeDescription,
  onChangeDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-lg w-full text-left animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Konfirmasi Simpan Perubahan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Setiap perubahan konfigurasi akan dicatat ke dalam riwayat revisi sistem.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Catatan Perubahan (Wajib Diisi)
          </label>
          <textarea
            value={changeDescription}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="Contoh: Memperbarui tanggal pendaftaran Gelombang 1 dan menambahkan jurusan baru..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 transition resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={!changeDescription.trim()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            <span>Simpan & Catat Revisi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
