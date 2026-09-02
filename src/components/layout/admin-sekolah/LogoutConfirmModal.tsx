"use client";

import React from "react";
import { LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center max-w-sm w-full mx-4 backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-500 border border-rose-100 dark:border-rose-900/40 shadow-inner">
          <LogOut size={28} className="animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">
            Konfirmasi Keluar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Apakah Anda yakin ingin keluar dari sesi admin portal PPDB? Anda
            perlu memasukkan kredensial lagi untuk masuk.
          </p>
        </div>
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 bg-linear-to-tr from-[#f43f5e] to-[#e11d48] hover:from-[#fb7185] hover:to-[#f43f5e] text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow shadow-rose-500/30 hover:shadow-rose-500/50 transition-all cursor-pointer"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
