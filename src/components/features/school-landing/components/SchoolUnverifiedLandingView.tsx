"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

interface SchoolUnverifiedLandingViewProps {
  schoolSlug: string;
  schoolDisplayName: string;
  schoolStatus?: string;
}

export function SchoolUnverifiedLandingView({
  schoolSlug: _schoolSlug,
  schoolDisplayName,
  schoolStatus = "UNVERIFIED"
}: SchoolUnverifiedLandingViewProps) {
  const isRejected = schoolStatus === "REJECTED";

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#020617] flex items-center justify-center p-4 sm:p-6 text-center font-sans relative overflow-hidden selection:bg-slate-900 selection:text-white">
      {/* Subtle geometric background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 my-auto"
      >
        {/* Minimalist Top Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
          <span>{isRejected ? "Dokumen Perlu Penyesuaian" : "Tahap Peninjauan Resmi"}</span>
        </div>

        {/* Minimalist Monochrome Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={28} strokeWidth={2.2} />
        </div>

        {/* Headings & Informative Content */}
        <div className="space-y-2.5">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Portal {schoolDisplayName} Belum Aktif
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            {isRejected
              ? "Pengajuan legalitas instansi ini sedang dalam tahap penyesuaian dokumen izin operasional oleh pihak sekolah."
              : "Instansi ini sedang dalam tahap peninjauan legalitas SK izin operasional resmi. Seluruh formulir pendaftaran PPDB dan informasi sekolah akan terbuka otomatis setelah verifikasi selesai."}
          </p>
        </div>

        {/* Informative Footer Badge */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Sistem Penerimaan Peserta Didik Baru Terpadu
          </p>
        </div>
      </motion.div>
    </div>
  );
}

