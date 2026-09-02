"use client";

import React from "react";
import Link from "next/link";
import { Bell, ShieldCheck, Clock, Building2, RefreshCw } from "lucide-react";

interface GatekeeperHeaderBannerProps {
  pendingCount: number;
  totalSchoolsCount: number;
  loading: boolean;
  onRefresh: () => void;
}

export function GatekeeperHeaderBanner({
  pendingCount,
  totalSchoolsCount,
  loading,
  onRefresh,
}: GatekeeperHeaderBannerProps) {
  return (
    <>
      {/* Real-time Notification Banner */}
      {pendingCount > 0 && (
        <div className="bg-[#FFD33B] text-[#2e3749] rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in border border-[#F3C625]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2e3749]/10 shrink-0">
              <Bell className="w-6 h-6 text-[#2e3749] animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider">
                Notifikasi Gatekeeper: Berkas SK Baru Diterima!
              </h4>
              <p className="text-xs font-semibold opacity-90">
                Terdapat <strong className="underline">{pendingCount} sekolah</strong> yang baru saja mengunggah dokumen SK Operasional &amp; menunggu verifikasi Anda.
              </p>
            </div>
          </div>
          <Link
            href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
            className="px-4 py-2.5 bg-[#2e3749] hover:bg-[#222937] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs shrink-0 self-start sm:self-center"
          >
            Tinjau Verifikasi Sekarang →
          </Link>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-white dark:bg-[#2e3749] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-10 pointer-events-none">
          <ShieldCheck className="w-96 h-96 text-slate-900 dark:text-white" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Selamat Datang, Gatekeeper <span className="text-[#FFD33B]">Superadmin</span> 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-white/70 leading-relaxed font-medium">
            Kelola verifikasi legalitas sekolah pendaftar, tanggapan feedback admin sekolah, dan pantau kesehatan infrastruktur SaaS CationGate secara terpusat.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
              className="px-4 py-2.5 rounded-2xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] text-xs font-bold transition-all shadow-md shadow-[#FFD33B]/20 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" /> Tinjau {pendingCount} Sekolah Menunggu Verifikasi
            </Link>
            <Link
              href="/gatekeeper/dashboard/schools"
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all border border-slate-200 dark:border-white/10 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" /> Kelola Semua Sekolah ({totalSchoolsCount})
            </Link>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all border border-slate-200 dark:border-white/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh Data Live"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Live
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
