import React from "react";
import { KuotaData, KuotaItem } from "../types";

interface KuotaDonutProps {
  title?: string;
  rawItems: KuotaItem[];
  totalJumlah: number;
}

export const KuotaDonutChart: React.FC<KuotaDonutProps> = ({ rawItems, totalJumlah }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = Array.isArray(rawItems) ? rawItems : ((rawItems as any)?.items || []);
  const colors = ["#ec4899", "#3b82f6", "#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#14b8a6"];
  const validItems = items.filter(i => i && i.jumlah > 0 && i.key !== "Belum Memilih");
  const totalValid = validItems.reduce((acc, curr) => acc + curr.jumlah, 0) || 1;

  type DonutSlice = KuotaItem & { percent: number; startPercent: number; color: string };
  const donutData: DonutSlice[] = [];
  let currentOffset = 0;
  for (let i = 0; i < validItems.length; i++) {
    const item = validItems[i];
    const percent = Math.round((item.jumlah / totalValid) * 100);
    donutData.push({
      ...item,
      percent,
      startPercent: currentOffset,
      color: colors[i % colors.length]
    });
    currentOffset += percent;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-6">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg width="192" height="192" viewBox="0 0 42 42" className="transform -rotate-90 filter drop-shadow-md">
          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800/40" strokeWidth="6" />
          {donutData.map((d, idx) => {
            if (d.percent === 0) return null;
            return (
              <circle key={idx} cx="21" cy="21" r="15.915" fill="transparent" stroke={d.color} strokeWidth="6"
                strokeDasharray={`${d.percent} ${100 - d.percent}`}
                strokeDashoffset={100 - d.startPercent}
                className="transition-all duration-700 ease-in-out cursor-pointer hover:stroke-[8px]"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Total</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white leading-none tracking-tighter">{totalJumlah}</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-sm px-4">
        {donutData.map((d, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-default">
            <div className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: d.color }}></div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{d.key}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">{d.jumlah}</span>
                <span className="text-[9px] font-bold text-slate-400">({d.percent}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const KuotaOverallDonutChart: React.FC<{ data: KuotaData }> = ({ data }) => {
  const target = data.totalTarget || 0;
  const aktif = data.totalSiswaAktif || 0;
  const pendaftar = data.totalPendaftar || 0;
  const proses = Math.max(0, pendaftar - aktif);
  const sisa = Math.max(0, target - Math.max(pendaftar, aktif));

  const overallData = [
    { key: "Siswa Aktif", jumlah: aktif, color: "#10b981" },
    { key: "Calon Siswa", jumlah: proses, color: "#f59e0b" },
    { key: "Sisa Kuota", jumlah: sisa, color: "#cbd5e1" }
  ];

  let accumulatedPercent = 0;
  const donutData = overallData.map((item) => {
    const percent = target > 0 ? Math.round((item.jumlah / target) * 100) : 0;
    const startPercent = accumulatedPercent;
    accumulatedPercent += percent;
    return { ...item, percent, startPercent };
  });

  return (
    <div className="w-full flex flex-col items-center justify-center py-6">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg width="192" height="192" viewBox="0 0 42 42" className="transform -rotate-90 filter drop-shadow-md">
          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800/40" strokeWidth="6" />
          {donutData.map((d, idx) => {
            if (d.percent === 0) return null;
            return (
              <circle key={idx} cx="21" cy="21" r="15.915" fill="transparent" stroke={d.color} strokeWidth="6"
                strokeDasharray={`${d.percent} ${100 - d.percent}`}
                strokeDashoffset={100 - d.startPercent}
                className="transition-all duration-700 ease-in-out cursor-pointer hover:stroke-[8px]"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Kapasitas</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white leading-none tracking-tighter">{target}</span>
          {target === 0 && <span className="text-[9px] font-bold text-amber-500 mt-1">Belum disetting</span>}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs px-4 mx-auto">
        {donutData.map((d, idx) => (
          <div key={idx} className="flex flex-row justify-between items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: d.color }}></div>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{d.key}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">{d.jumlah}</span>
              <span className="text-[9px] font-bold text-slate-400">({d.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
