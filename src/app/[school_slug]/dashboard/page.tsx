"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Pencil, BarChart2, ShieldCheck } from "lucide-react";
import KuotaTab from "@/components/KuotaTab";
import { useDashboardOverviewState } from "@/components/features/dashboard-overview/hooks/useDashboardOverviewState";
import { ExecutiveMetrics } from "@/components/features/dashboard-overview/components/ExecutiveMetrics";
import { PpdbStatusToggle } from "@/components/features/dashboard-overview/components/PpdbStatusToggle";
import { RegistrationAreaChart } from "@/components/features/dashboard-overview/components/RegistrationAreaChart";
import { DistributionBarChart } from "@/components/features/dashboard-overview/components/DistributionBarChart";
import { RecentApplicantsTable } from "@/components/features/dashboard-overview/components/RecentApplicantsTable";

export default function DashboardOverview() {
  const {
    schoolSlug,
    applicants,
    computedStats,
    counterTrigger,
    isVerified,
    isSpmbOpen,
    isUpdatingSpmb,
    handleToggleSpmbStatus,
    trendView,
    setTrendView,
    trend,
    majorsList,
    barData
  } = useDashboardOverviewState();

  return (
    <div className="space-y-6">
      {/* 1. Status SPMB & Akses Lock Banner */}
      <PpdbStatusToggle
        isSpmbOpen={isSpmbOpen}
        isUpdatingSpmb={isUpdatingSpmb}
        isVerified={isVerified}
        onToggleSpmbStatus={handleToggleSpmbStatus}
      />

      {/* 2. Metrik Eksekutif KPI */}
      <ExecutiveMetrics
        total={computedStats.total}
        verified={computedStats.approved}
        pending={computedStats.pending}
        rejected={computedStats.rejected}
        countsLoaded={counterTrigger}
      />

      {/* 3. Area Chart Tren Pendaftaran + Kuota Keseluruhan */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Area Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-xs flex flex-col gap-4 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">
                Tren Registrasi
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Statistik pendaftaran –{" "}
                {trendView === "hari"
                  ? "7 hari terakhir"
                  : trendView === "minggu"
                  ? "4 minggu terakhir"
                  : trendView === "bulan"
                  ? "6 bulan terakhir"
                  : "per periode"}
              </p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800/40 shrink-0">
              {(["hari", "minggu", "bulan", "periode"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setTrendView(v)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    trendView === v
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs border border-slate-200 dark:border-slate-800/30"
                      : "text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <RegistrationAreaChart data={trend.counts} labels={trend.labels} color="#2563eb" />
        </div>

        {/* Kuota Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-xs flex flex-col text-left">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">
                Data Keseluruhan
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Status kuota seluruh jurusan</p>
            </div>
            <Link
              href={`/${schoolSlug}/dashboard/pendaftar?tab=kuota`}
              className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-xl transition-all cursor-pointer"
              title="Edit Target Kuota"
            >
              <Pencil size={13} />
            </Link>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <KuotaTab type="keseluruhan" variant="minimal" />
          </div>
        </div>
      </motion.div>

      {/* 4. Distribusi Pendaftar per Jurusan */}
      <motion.div
        className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-xs text-left"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase flex items-center gap-2">
              <BarChart2 size={14} className="text-indigo-500" />
              Distribusi Pendaftar per Jurusan
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Jumlah calon siswa berdasarkan pilihan jurusan pertama
            </p>
          </div>
          {/* Legend */}
          <div className="hidden sm:flex items-center flex-wrap gap-x-4 gap-y-1">
            {majorsList.slice(0, 6).map((m) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
        <DistributionBarChart data={barData} />
      </motion.div>

      {/* 5. Tabel Pendaftar Terbaru + Kuota Progress */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Recent Applicants Table */}
        <div className="lg:col-span-3">
          <RecentApplicantsTable
            schoolSlug={schoolSlug}
            applicants={applicants}
            majorsList={majorsList}
          />
        </div>

        {/* Kuota Progress Bars */}
        <div className="lg:col-span-2 flex flex-col gap-4 text-left">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs flex flex-col flex-1">
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white tracking-wider uppercase mb-3 flex items-center gap-2">
              <BarChart2 size={12} className="text-blue-500" /> Progress Calon Siswa
            </h3>
            <KuotaTab type="pendaftar" variant="minimal" />
          </div>
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs flex flex-col flex-1">
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white tracking-wider uppercase mb-3 flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500" /> Progress Siswa Aktif
            </h3>
            <KuotaTab type="siswa-aktif" variant="minimal" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
