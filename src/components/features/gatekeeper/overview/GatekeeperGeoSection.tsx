"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Database, Globe2, MapPin } from "lucide-react";
import { MapSchoolItem, RegionDemographicItem } from "./types";

const SchoolMap = dynamic(() => import("@/components/map/SchoolMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-3xl bg-slate-900/60 animate-pulse border border-white/10 flex items-center justify-center text-xs text-white/40 font-bold">
      Memuat Peta Sebaran Real-Time...
    </div>
  ),
});

interface GatekeeperGeoSectionProps {
  mapSchools: MapSchoolItem[];
  regionDemographics: RegionDemographicItem[];
}

export function GatekeeperGeoSection({
  mapSchools,
  regionDemographics,
}: GatekeeperGeoSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {/* Supabase Free Plan Usage (CationGate Themed) */}
      <div className="bg-white dark:bg-[#2e3749] text-slate-800 dark:text-slate-200 rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between transition-colors duration-300 relative overflow-hidden">
        <div>
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-2">
                <Database className="w-4 h-4 text-[#FFD33B]" /> Free Plan Usage
              </h3>
              <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-0.5">
                Current billing cycle
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-xl bg-[#FFD33B]/15 dark:bg-[#FFD33B]/20 text-[#2e3749] dark:text-[#FFD33B] border border-[#FFD33B]/40 transition-all hover:bg-[#FFD33B]/25 shadow-xs">
              Upgrade to Pro
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Egress */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 shrink-0"></span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    EGRESS
                  </span>
                </div>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-xs">
                  106 MB / 5 GB
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[2%]"></div>
              </div>
            </div>

            {/* Database Size (Supabase 500 MB Limit) */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 shrink-0"></span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    DATABASE SIZE
                  </span>
                </div>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-xs">
                  30 MB / 500 MB
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[6%]"></div>
              </div>
            </div>

            {/* Monthly Active Users */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD33B] ring-2 ring-[#FFD33B]/20 shrink-0"></span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    MONTHLY ACTIVE USERS
                  </span>
                </div>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-xs">
                  0 / 50,000
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#FFD33B] rounded-full w-[1%]"></div>
              </div>
            </div>

            {/* File Storage */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-sky-500/20 shrink-0"></span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    FILE STORAGE
                  </span>
                </div>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-xs">
                  2 MB / 1 GB
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full w-[1%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-white/60">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Supabase Postgres DB
          </span>
          <span className="font-mono text-slate-700 dark:text-white font-bold">
            Uptime 99.9%
          </span>
        </div>
      </div>

      {/* Sebaran Wilayah (Interactive Map 2/3) */}
      <div className="lg:col-span-2 bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#2e3749] dark:text-[#FFD33B]" /> Sebaran Wilayah Institusi
              </h3>
              <p className="text-xs text-slate-500 dark:text-white/60">
                Demografi lokasi sekolah terdaftar
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <SchoolMap schools={mapSchools} />

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1.5 scrollbar-thin [scrollbar-color:#cbd5e1_transparent] dark:[scrollbar-color:#475569_transparent]">
            {regionDemographics.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200/70 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-white shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {item.region}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-white/40">
                      {item.percentage} dari total sekolah
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    {item.count}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 block">
                    Sekolah
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
