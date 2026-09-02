"use client";

import React, { useState } from "react";
import { X, Loader2, Users, BookOpen, CheckCircle2, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DummyApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  majorsList: string[];
  isGenerating: boolean;
  onGenerate: (count: number, statusPreference: "random" | "Pending" | "Approved" | "Rejected") => Promise<void>;
}

export const DummyApplicantModal: React.FC<DummyApplicantModalProps> = ({
  isOpen,
  onClose,
  majorsList,
  isGenerating,
  onGenerate
}) => {
  const [selectedCount, setSelectedCount] = useState<number>(5);
  const [selectedStatus, setSelectedStatus] = useState<"random" | "Pending" | "Approved" | "Rejected">("random");

  if (!isOpen) return null;

  const countOptions = [1, 5, 10, 20];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    await onGenerate(selectedCount, selectedStatus);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-left"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
                <UserPlus size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Test Tambah Calon Siswa
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tambahkan contoh data pendaftar untuk simulasi sistem
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Majors Context Info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <BookOpen size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Jurusan Terdaftar di Sekolah Ini:</span>
              </div>
              {majorsList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {majorsList.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50 rounded-lg shadow-2xs"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  Belum ada jurusan kustom, data akan menggunakan jurusan kejuruan standar.
                </p>
              )}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                * Data contoh calon siswa akan dibuat secara otomatis berdasarkan jurusan di atas.
              </p>
            </div>

            {/* Jumlah Siswa Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <Users size={14} />
                <span>Jumlah Calon Siswa:</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {countOptions.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSelectedCount(cnt)}
                    disabled={isGenerating}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedCount === cnt
                        ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    +{cnt} Siswa
                  </button>
                ))}
              </div>
            </div>

            {/* Status Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Distribusi Status Awal:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: "random" as const,
                    title: "Campur / Realistis (Rekomendasi)",
                    desc: "60% Menunggu Verifikasi (Pending), 30% Terverifikasi, 10% Ditolak"
                  },
                  {
                    id: "Pending" as const,
                    title: "Semua Pending",
                    desc: "Semua siswa dalam status Menunggu Verifikasi berkas"
                  },
                  {
                    id: "Approved" as const,
                    title: "Semua Terverifikasi (Approved)",
                    desc: "Semua berkas dan pembayaran otomatis lunas"
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedStatus(opt.id)}
                    disabled={isGenerating}
                    className={`w-full p-3 rounded-2xl text-left transition-all border flex items-start justify-between gap-3 cursor-pointer ${
                      selectedStatus === opt.id
                        ? "bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 dark:border-blue-500 shadow-2xs"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {opt.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    {selectedStatus === opt.id && (
                      <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Menambahkan Data...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Tambahkan {selectedCount} Calon Siswa</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
