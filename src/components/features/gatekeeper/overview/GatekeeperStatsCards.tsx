"use client";

import React from "react";
import { StatItem } from "./types";

interface GatekeeperStatsCardsProps {
  stats: StatItem[];
  loading: boolean;
}

export function GatekeeperStatsCards({ stats, loading }: GatekeeperStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((st, i) => {
        const Icon = st.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white dark:bg-[#2e3749] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider">
                {st.label}
              </span>
              <div className={`p-2.5 rounded-2xl ${st.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {loading ? "..." : st.value}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-white/60 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 dark:text-[#FFD33B] font-bold">
                  {st.change}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
