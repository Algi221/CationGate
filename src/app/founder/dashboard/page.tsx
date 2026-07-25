"use client";

import React, { useState, useEffect } from "react";
import { Building, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Hook for animated numbers
function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatCard({ label, value, sub, color, icon, delay = 0 }: any) {
  const displayValue = useCountUp(value, 1300 + delay * 80);
  const colorMap: any = {
    blue:    { bg: "bg-blue-50/70 dark:bg-blue-950/30",    text: "text-blue-600 dark:text-blue-400",    icon: "bg-blue-100 dark:bg-blue-950/60 text-blue-500 dark:text-blue-400",    border: "hover:border-blue-200 dark:hover:border-blue-800" },
    emerald: { bg: "bg-emerald-50/70 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", icon: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 dark:text-emerald-400", border: "hover:border-emerald-200 dark:hover:border-emerald-800" },
    amber:   { bg: "bg-amber-50/70 dark:bg-amber-950/30",   text: "text-amber-600 dark:text-amber-400",   icon: "bg-amber-100 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400",   border: "hover:border-amber-200 dark:hover:border-amber-800" },
    rose:    { bg: "bg-rose-50/70 dark:bg-rose-950/30",     text: "text-rose-600 dark:text-rose-400",     icon: "bg-rose-100 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400",     border: "hover:border-rose-200 dark:hover:border-rose-800" },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-lg ${c.border} transition-all duration-300 group cursor-default`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${c.bg}`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>{icon}</div>
        </div>
        <h3 className={`text-3xl font-black leading-none mb-1 tabular-nums ${c.text}`}>
          {label.includes("PENDAPATAN") ? `Rp ${displayValue.toLocaleString('id-ID')}` : displayValue}
        </h3>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{sub}</span>
      </div>
    </motion.div>
  );
}

function AreaChart({ data, labels, color = "#3b82f6" }: any) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const options: any = {
    legend: { show: false },
    colors: [color],
    chart: { fontFamily: "inherit", height: 335, type: "area", toolbar: { show: false }, background: 'transparent' },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.55, opacityTo: 0.15, stops: [0, 90, 100] } },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { categories: labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: "#64748b" } } },
    yaxis: { labels: { style: { colors: "#64748b" } } },
    grid: { strokeDashArray: 5, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, borderColor: isDark ? "#334155" : "#e2e8f0" },
    dataLabels: { enabled: false },
    theme: { mode: isDark ? "dark" : "light" },
    tooltip: { theme: isDark ? "dark" : "light" }
  };
  return <div className="w-full h-[300px] -ml-3"><ReactApexChart options={options} series={[{ name: "Instansi Terdaftar", data }]} type="area" height={320} width={"100%"} /></div>;
}

function DonutChart() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const options: any = {
    chart: { type: 'donut', background: 'transparent' },
    colors: ['#10b981', '#f59e0b', '#3b82f6'],
    labels: ['Instansi Aktif', 'Menunggu', 'Sisa Kapasitas'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { show: true, color: '#64748b', fontSize: '10px', fontWeight: 600 },
            value: { show: true, color: isDark ? '#fff' : '#000', fontSize: '24px', fontWeight: 800 },
            total: { show: true, showAlways: true, label: 'TOTAL SERVER', color: '#64748b' }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { show: false },
    theme: { mode: isDark ? "dark" : "light" }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ReactApexChart options={options} series={[120, 15, 865]} type="donut" height={280} />
      <div className="w-full mt-4 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="font-bold text-slate-500">INSTANSI AKTIF</span></div>
          <span className="font-bold text-slate-900 dark:text-white">120 <span className="text-[9px] text-slate-400">(12%)</span></span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="font-bold text-slate-500">MENUNGGU PEMBAYARAN</span></div>
          <span className="font-bold text-slate-900 dark:text-white">15 <span className="text-[9px] text-slate-400">(1.5%)</span></span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="font-bold text-slate-500">SISA KAPASITAS SERVER</span></div>
          <span className="font-bold text-slate-900 dark:text-white">865 <span className="text-[9px] text-slate-400">(86.5%)</span></span>
        </div>
      </div>
    </div>
  );
}

export default function FounderDashboard() {
  const [trendView, setTrendView] = useState("hari");

  const stats = [
    { label: "TOTAL INSTANSI", value: 135, sub: "SEKOLAH TERDAFTAR", color: "blue", icon: <Building size={20} /> },
    { label: "BERLANGGANAN", value: 120, sub: "PEMBAYARAN LUNAS", color: "emerald", icon: <CheckCircle size={20} /> },
    { label: "PENDING PAYMENT", value: 15, sub: "BELUM BAYAR", color: "amber", icon: <Clock size={20} /> },
    { label: "PENDAPATAN (Bulan Ini)", value: 90000000, sub: "ESTIMASI REVENUE", color: "rose", icon: <TrendingUp size={20} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i} />
        ))}
      </div>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.45 }}
      >
        {/* Area Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Tren Registrasi SaaS</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Statistik pertumbuhan instansi baru</p>
            </div>
            <div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-white/5 shrink-0">
              {["hari", "minggu", "bulan", "periode"].map((v) => (
                <button
                  key={v} onClick={() => setTrendView(v)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${trendView === v ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200/30" : "text-slate-400"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <AreaChart data={[2, 5, 3, 10, 8, 15, 12]} labels={["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]} color="#3b82f6" />
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Data Keseluruhan Server</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Kapasitas cluster SaaS (Max 1000)</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <DonutChart />
          </div>
        </div>
      </motion.div>

    </div>
  );
}
