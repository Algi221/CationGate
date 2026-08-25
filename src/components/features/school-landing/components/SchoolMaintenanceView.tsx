"use client";

import React from "react";
import Link from "next/link";
import { Wrench, MessageCircle, ArrowLeft, ShieldAlert, Lock } from "lucide-react";

interface SchoolMaintenanceViewProps {
  schoolSlug: string;
  schoolDisplayName: string;
  waAdmin?: string;
  schoolPeriod?: string;
  address?: string;
}

export function SchoolMaintenanceView({
  schoolSlug,
  schoolDisplayName,
  waAdmin,
  schoolPeriod,
  address,
}: SchoolMaintenanceViewProps) {
  const cleanWaNumber = waAdmin?.replace(/[^\d]/g, "") || "";
  const waLink = cleanWaNumber
    ? `https://wa.me/${cleanWaNumber.startsWith("0") ? "62" + cleanWaNumber.slice(1) : cleanWaNumber}?text=${encodeURIComponent(
        `Halo Panitia PPDB ${schoolDisplayName}, saya ingin menanyakan informasi pendaftaran.`
      )}`
    : null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white p-4 sm:p-6 lg:p-8">
      {/* Top Navbar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/20 text-sm">
            {schoolDisplayName.charAt(0)}
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
              {schoolDisplayName}
            </h2>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              PPDB {schoolPeriod || "2026-2027"}
            </span>
          </div>
        </div>

        <Link
          href={`/${schoolSlug}/dashboard`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-xs transition"
        >
          <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Login Admin</span>
        </Link>
      </header>

      {/* Main Content Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-10 text-center">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-lg border border-amber-200 dark:border-amber-900/50">
            <Wrench className="w-9 h-9" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 text-[11px] font-bold uppercase tracking-wider mb-4">
          <ShieldAlert size={13} />
          <span>Under Maintenance</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
          Portal PPDB Sedang Dinonaktifkan
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-8 font-medium">
          Halaman website dan formulir pendaftaran online <strong className="text-slate-800 dark:text-slate-200">{schoolDisplayName}</strong> saat ini sedang dalam pemeliharaan sistem atau belum dibuka oleh panitia sekolah.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Panitia Sekolah</span>
            </a>
          ) : (
            <Link
              href="/"
              className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/20 active:scale-98"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ke Beranda Utama</span>
            </Link>
          )}

          <Link
            href={`/${schoolSlug}/dashboard`}
            className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 transition shadow-xs active:scale-98"
          >
            <span>Masuk Dashboard Admin</span>
          </Link>
        </div>

        {address && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-8 max-w-sm mx-auto">
            📍 {address}
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-4 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} {schoolDisplayName}. Didukung oleh Platform CationGate.</p>
      </footer>
    </div>
  );
}

export default SchoolMaintenanceView;
