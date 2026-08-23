"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Clock, AlertTriangle } from "lucide-react";

function useCountUp(target: number, duration = 1400, trigger = false) {
  const [value, setValue] = useState(() => (!trigger || target === 0 ? target : 0));
  useEffect(() => {
    if (!trigger || target === 0) {
      return;
    }
    let start: number | null = null;
    let animId: number;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) {
        animId = requestAnimationFrame(raf);
      }
    };
    animId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(animId);
  }, [target, duration, trigger]);
  return !trigger || target === 0 ? target : value;
}

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  color: "blue" | "emerald" | "amber" | "rose";
  icon: React.ReactNode;
  delay?: number;
  trigger?: boolean;
}

export function StatCard({
  label,
  value,
  sub,
  color,
  icon,
  delay = 0,
  trigger = false
}: StatCardProps) {
  const displayValue = useCountUp(value, 1300 + delay * 80, trigger);
  const colorMap: Record<string, { iconBg: string; iconText: string }> = {
    blue: { iconBg: "bg-blue-50 dark:bg-blue-900/20", iconText: "text-blue-600 dark:text-blue-400" },
    emerald: { iconBg: "bg-emerald-50 dark:bg-emerald-900/20", iconText: "text-emerald-600 dark:text-emerald-400" },
    amber: { iconBg: "bg-amber-50 dark:bg-amber-900/20", iconText: "text-amber-600 dark:text-amber-400" },
    rose: { iconBg: "bg-rose-50 dark:bg-rose-900/20", iconText: "text-rose-600 dark:text-rose-400" }
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-all duration-200 text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{label}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.iconBg} ${c.iconText}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold leading-none mb-1 tabular-nums text-slate-900 dark:text-white">
        {displayValue}
      </h3>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{sub}</span>
    </motion.div>
  );
}

interface ExecutiveMetricsProps {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  countsLoaded: boolean;
}

export const ExecutiveMetrics: React.FC<ExecutiveMetricsProps> = ({
  total,
  verified,
  pending,
  rejected,
  countsLoaded
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Total Pendaftar"
        value={total}
        sub="Semua pendaftar tercatat"
        color="blue"
        icon={<Users size={20} />}
        delay={0}
        trigger={countsLoaded}
      />
      <StatCard
        label="Terverifikasi"
        value={verified}
        sub="Pendaftar berstatus lolos"
        color="emerald"
        icon={<ShieldCheck size={20} />}
        delay={1}
        trigger={countsLoaded}
      />
      <StatCard
        label="Menunggu Verifikasi"
        value={pending}
        sub="Memerlukan tindakan admin"
        color="amber"
        icon={<Clock size={20} />}
        delay={2}
        trigger={countsLoaded}
      />
      <StatCard
        label="Ditolak"
        value={rejected}
        sub="Berkas tidak memenuhi syarat"
        color="rose"
        icon={<AlertTriangle size={20} />}
        delay={3}
        trigger={countsLoaded}
      />
    </div>
  );
};
