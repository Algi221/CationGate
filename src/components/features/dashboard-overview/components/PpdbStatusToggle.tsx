"use client";

import React from "react";
import { motion } from "framer-motion";
import { Power, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { useSchoolHref } from "@/hooks/useSchoolHref";

interface PpdbStatusToggleProps {
  isSpmbOpen: boolean;
  isUpdatingSpmb: boolean;
  isVerified: boolean;
  onToggleSpmbStatus: () => void;
}

export const PpdbStatusToggle: React.FC<PpdbStatusToggleProps> = ({
  isSpmbOpen,
  isUpdatingSpmb,
  isVerified,
  onToggleSpmbStatus
}) => {
  const { href } = useSchoolHref();

  return (
    <div className="space-y-4 text-left">
      {/* Kontrol Pendaftaran Publik */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Power className="w-3.5 h-3.5 text-blue-600" /> Kontrol Pendaftaran Publik
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isSpmbOpen
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                  : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
              }`}
            >
              {isSpmbOpen ? "DIBUKA (OPEN)" : "DITUTUP (CLOSED)"}
            </span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {isSpmbOpen
              ? "Pendaftaran Calon Siswa Baru Sedang Aktif"
              : "Pendaftaran Calon Siswa Baru Sedang Ditutup Sementara"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isSpmbOpen
              ? "Formulir pendaftaran dan pemilihan jurusan dapat diakses secara publik oleh seluruh calon pendaftar."
              : "Calon pendaftar yang mengakses link formulir akan melihat halaman pemberitahuan bahwa gelombang pendaftaran belum dibuka."}
          </p>
        </div>

        <button
          onClick={onToggleSpmbStatus}
          disabled={isUpdatingSpmb}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer shadow-xs disabled:opacity-50 ${
            isSpmbOpen
              ? "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
          }`}
        >
          {isUpdatingSpmb ? (
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isSpmbOpen ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Power className="w-4 h-4" />
          )}
          <span>{isSpmbOpen ? "Tutup Pendaftaran" : "Buka Pendaftaran"}</span>
        </button>
      </motion.div>

      {/* Lock Banner if Not Verified */}
      {!isVerified && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-amber-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Status Akses Dashboard: Terkunci 🔒</h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                Sekolah Anda belum diverifikasi oleh Superadmin Gatekeeper. Fitur grafik & SPMB pendaftaran fiktif dikunci.
              </p>
            </div>
          </div>
          <Link
            href={href("/dashboard/verification")}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Buka Form Verifikasi
          </Link>
        </div>
      )}
    </div>
  );
};
