"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight, LogIn, Mail } from "lucide-react";
import { useSchoolHref } from "@/hooks/useSchoolHref";

interface SchoolUnverifiedLandingViewProps {
  schoolSlug: string;
  schoolDisplayName: string;
  schoolStatus?: string;
}

export function SchoolUnverifiedLandingView({
  schoolSlug,
  schoolDisplayName,
  schoolStatus = "UNVERIFIED"
}: SchoolUnverifiedLandingViewProps) {
  const { href } = useSchoolHref(schoolSlug);

  const isRejected = schoolStatus === "REJECTED";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6 text-center font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6 my-auto"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <ShieldAlert size={40} strokeWidth={2.2} />
        </div>

        {/* Badge & Headings */}
        <div className="space-y-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isRejected
              ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
              : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
          }`}>
            {isRejected ? "⚠️ Dokumen Perlu Revisi" : "🔒 Portal Dalam Proses Verifikasi"}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Portal {schoolDisplayName} Belum Aktif
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {isRejected
              ? "Pengajuan legalitas instansi ini memerlukan perbaikan dokumen. Admin sekolah dapat masuk ke dashboard untuk memperbarui berkas SK operasional resmi."
              : "Instansi ini sedang dalam tahap peninjauan legalitas SK izin operasional oleh Tim Superadmin Gatekeeper. Landing page dan formulir pendaftaran PPDB akan terbuka otomatis setelah verifikasi disetujui."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={href("/login")}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/25 transition-all inline-flex items-center justify-center gap-2"
          >
            <LogIn size={15} /> Login Admin Sekolah
          </Link>

          <a
            href="mailto:support@cationgate.site"
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all inline-flex items-center justify-center gap-2"
          >
            <Mail size={15} /> Hubungi Bantuan
          </a>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <a
            href="https://cationgate.site"
            className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition inline-flex items-center gap-1"
          >
            Kembali ke Portal Utama CationGate <ArrowRight size={13} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
