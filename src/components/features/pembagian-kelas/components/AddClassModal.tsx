"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import { GradeLevel } from "../types";

interface AddClassModalProps {
  isOpen: boolean;
  selectedGrade: GradeLevel;
  selectedMajor: string;
  newClassName: string;
  setNewClassName: (name: string) => void;
  onClose: () => void;
  onCreateClass: (e: React.FormEvent) => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  selectedGrade,
  selectedMajor,
  newClassName,
  setNewClassName,
  onClose,
  onCreateClass
}) => {
  if (!isOpen) return null;

  const prefix = selectedGrade === 10 ? "X" : selectedGrade === 11 ? "XI" : "XII";

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
                Tambah Rombel Kelas
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">
                Tingkat {prefix} • Jurusan {selectedMajor}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={onCreateClass} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
              Nama Rombel / Kode Kelas
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-3 bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-black text-slate-700 dark:text-white font-mono">
                {prefix} {selectedMajor}
              </span>
              <input
                type="text"
                placeholder="Contoh: 1 atau A"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all font-mono uppercase"
                autoFocus
                required
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1.5">
              Kelas akan dibuat dengan format: <span className="font-bold text-blue-500">{prefix} {selectedMajor} {newClassName || "..."}</span>
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(37,99,235,0.25)] cursor-pointer"
            >
              Simpan Kelas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
