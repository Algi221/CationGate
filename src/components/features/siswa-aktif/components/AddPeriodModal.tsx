"use client";

import React from "react";
import { Plus, X } from "lucide-react";

interface AddPeriodModalProps {
  isOpen: boolean;
  newPeriodValue: string;
  setNewPeriodValue: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  isOpen,
  newPeriodValue,
  setNewPeriodValue,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wide">
                Tambah Periode Baru
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">Contoh: 2027-2028 atau 2028-2029</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
              Format Tahun Ajaran / Angkatan
            </label>
            <input
              type="text"
              placeholder="YYYY-YYYY (misal: 2027-2028)"
              value={newPeriodValue}
              onChange={(e) => setNewPeriodValue(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(37,99,235,0.25)] cursor-pointer"
            >
              Simpan Periode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
