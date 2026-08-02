"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import {
  Users, ShieldCheck, Clock, AlertTriangle, BarChart2,
  Pencil, TrendingUp, TrendingDown, ArrowRight, Lock, ShieldAlert, Power
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import KuotaTab from "@/components/KuotaTab";
import Swal from "sweetalert2";

import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MajorItem {
  name: string;
  dbName: string;
  color: string;
  count?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter hook
// ─────────────────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, trigger = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger || target === 0) { setValue(target); return; }
    let start: number | null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, trigger]);
  return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated Stat Card
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, color, icon, delay = 0, trigger = false
}: {
  label: string; value: number; sub: string; color: string;
  icon: React.ReactNode; delay?: number; trigger?: boolean;
}) {
  const displayValue = useCountUp(value, 1300 + delay * 80, trigger);
  const colorMap: Record<string, { text: string; iconBg: string; iconText: string; border: string }> = {
    blue:    { text: "text-blue-600",    iconBg: "bg-blue-50 border border-blue-100",    iconText: "text-blue-600",    border: "border-slate-200 hover:border-blue-300" },
    emerald: { text: "text-emerald-600", iconBg: "bg-emerald-50 border border-emerald-100", iconText: "text-emerald-600", border: "border-slate-200 hover:border-emerald-300" },
    amber:   { text: "text-amber-600",   iconBg: "bg-amber-50 border border-amber-100",   iconText: "text-amber-600",   border: "border-slate-200 hover:border-amber-300" },
    rose:    { text: "text-rose-600",    iconBg: "bg-rose-50 border border-rose-100",    iconText: "text-rose-600",    border: "border-slate-200 hover:border-rose-300" },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      className={`bg-white border ${c.border} rounded-2xl p-5 shadow-xs transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.iconBg} ${c.iconText}`}>{icon}</div>
      </div>
      <h3 className={`text-3xl font-extrabold leading-none mb-1 tabular-nums ${c.text}`}>{displayValue}</h3>
      <span className="text-[11px] text-slate-500 font-semibold">{sub}</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Area Chart using ApexCharts (Tailadmin style)
// ─────────────────────────────────────────────────────────────────────────────
function AreaChart({
  data,
  labels,
  color = "#3b82f6",
}: {
  data: number[];
  labels: string[];
  color?: string;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  
  const series = [
    {
      name: "Pendaftar",
      data: data,
    },
  ];

  const options: any = {
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: [color],
    chart: {
      fontFamily: "inherit",
      height: 335,
      type: "area",
      toolbar: {
        show: true,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.55,
        opacityTo: 0.15,
        stops: [0, 90, 100]
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#64748b",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
        },
      },
    },
    grid: {
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      borderColor: isDark ? "#334155" : "#e2e8f0",
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
  };

  return (
    <div className="w-full h-[300px]">
      <div className="-ml-3">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={320}
          width={"100%"}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bar Chart with animated grow-up bars
// ─────────────────────────────────────────────────────────────────────────────
function BarChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  const W = 1000;
  const H = 260;
  const PAD_L = 40;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 48;

  const barW = Math.min(80, ((W - PAD_L - PAD_R) / data.length) * 0.55);
  const gap = (W - PAD_L - PAD_R) / data.length;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
    val: Math.round(maxVal * frac),
    y: PAD_T + (1 - frac) * (H - PAD_T - PAD_B),
  }));

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
        {/* Grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD_L} y1={t.y} x2={W - PAD_R} y2={t.y}
              stroke="currentColor" strokeOpacity="0.06" strokeWidth="1"
              className="text-slate-900 dark:text-white" />
            <text x={PAD_L - 6} y={t.y + 4} textAnchor="end"
              fontSize="11" className="fill-slate-400 dark:fill-slate-600" opacity="0.75">
              {t.val}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = PAD_L + gap * i + gap / 2;
          const fullBarH = ((d.value / maxVal) * (H - PAD_T - PAD_B));
          const barH = animated ? fullBarH : 0;
          const barY = H - PAD_B - (animated ? fullBarH : 0);
          const isHov = hovered === i;

          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Ghost bg */}
              <rect x={cx - barW / 2} y={PAD_T} width={barW}
                height={H - PAD_T - PAD_B}
                rx="6" fill={d.color} opacity={isHov ? 0.08 : 0}
                className="transition-opacity duration-200" />
              {/* Bar - animated height */}
              <rect
                x={cx - barW / 2}
                y={barY}
                width={barW}
                height={barH}
                rx="6"
                fill={d.color}
                opacity={isHov ? 1 : 0.78}
                style={{
                  transition: "height 0.7s cubic-bezier(0.22,1,0.36,1), y 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.2s"
                }}
              />
              {/* Value on hover */}
              {isHov && animated && (
                <text x={cx} y={H - PAD_B - fullBarH - 7} textAnchor="middle"
                  fontSize="12" fontWeight="bold" fill={d.color}>
                  {d.value}
                </text>
              )}
              {/* X label */}
              <text x={cx} y={H - PAD_B + 16} textAnchor="middle"
                fontSize="11" className="fill-slate-500 dark:fill-slate-400">
                {d.label}
              </text>
              {/* Percentage */}
              <text x={cx} y={H - PAD_B + 30} textAnchor="middle"
                fontSize="10" className="fill-slate-400 dark:fill-slate-600">
                {Math.round((d.value / total) * 100)}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute pointer-events-none bg-slate-900/95 dark:bg-slate-950 border border-slate-700/50 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-xl z-20 flex flex-col gap-0.5"
            style={{
              left: `${((PAD_L + gap * hovered + gap / 2) / W) * 100}%`,
              top: "10%",
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{data[hovered].label}</span>
            <span className="text-sm font-black text-white">{data[hovered].value} <span className="text-[10px] text-slate-400 font-bold">pendaftar</span></span>
            <span className="text-[10px] text-slate-400 font-semibold">{Math.round((data[hovered].value / total) * 100)}% dari total</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const { applicants, schoolId, adminToken, schoolStatus, isDemoMode } = usePPDB();
  const [trendView, setTrendView] = useState<"hari" | "minggu" | "bulan" | "periode">("hari");
  const [counterTrigger, setCounterTrigger] = useState(false);

  const isVerified = !schoolStatus || schoolStatus === 'FULL_VERIFIED' || schoolStatus === 'VERIFIED' || schoolStatus === 'verified' || isDemoMode;

  // States from RPC
  const [statsData, setStatsData] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    majors: [] as { name: string, value: number }[],
    trendHari: [] as { label: string, count: number }[]
  });
  const [isLoading, setIsLoading] = useState(true);

  const [majorsList, setMajorsList] = useState<MajorItem[]>([
    { name: "PPLG", dbName: "Rekayasa Perangkat Lunak", color: "#3b82f6" },
    { name: "TJKT", dbName: "Teknik Jaringan Komputer & Telekomunikasi", color: "#0ea5e9" },
    { name: "DKV", dbName: "Desain Komunikasi Visual", color: "#6366f1" },
    { name: "Broadcasting", dbName: "Broadcasting & Perfilman", color: "#f59e0b" },
    { name: "Elektronika", dbName: "Teknik Elektronika", color: "#10b981" },
    { name: "Animasi", dbName: "Animasi", color: "#ec4899" },
  ]);

  useEffect(() => {
    if (!schoolId || !adminToken) return;
    setIsLoading(true);
    fetch(`/api/dashboard/stats?school_id=${schoolId}`, {
      headers: { "Authorization": `Bearer ${adminToken}` }
    })
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) {
          setStatsData(json.data);
        }
        setIsLoading(false);
        setTimeout(() => setCounterTrigger(true), 100);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats", err);
        setIsLoading(false);
      });
  }, [schoolId, adminToken]);

  useEffect(() => {
    const saved = localStorage.getItem("ppdb_majors_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMajorsList(parsed.map((m: any) => ({
            name: m.code === "RPL" ? "PPLG" : (m.code === "ANM" ? "Animasi" : (m.code === "BC" ? "Broadcasting" : m.code)),
            dbName: m.title,
            color: m.color || "#3b82f6",
          })));
        }
      } catch { /* ignore */ }
    }
    fetch("/api/config")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.ppdb_majors_config) {
          const dbMajors = json.data.ppdb_majors_config;
          if (Array.isArray(dbMajors) && dbMajors.length > 0) {
            const mapped = dbMajors.map((m: any) => ({
              name: m.code === "RPL" ? "PPLG" : (m.code === "ANM" ? "Animasi" : (m.code === "BC" ? "Broadcasting" : m.code)),
              dbName: m.title,
              color: m.color || "#3b82f6",
            }));
            setMajorsList(mapped);
            localStorage.setItem("ppdb_majors_config", JSON.stringify(dbMajors));
          }
        }
      })
      .catch(() => {});
  }, []);

  // ── Trend Data ──────────────────────────────────────────────────────────────
  const getTrendData = () => {
    // Gunakan data dari RPC untuk tren hari
    if (trendView === "hari" && statsData.trendHari && statsData.trendHari.length > 0) {
       return {
         labels: statsData.trendHari.map((t: any) => t.label),
         counts: statsData.trendHari.map((t: any) => t.count)
       };
    }
    
    // Fallback dummy for other views if RPC doesn't support them yet
    const baseLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const baseCounts = [8, 14, 11, 23, 19, 32, statsData.total || 5];
    return { labels: baseLabels, counts: baseCounts };
  };

  const [isSpmbOpen, setIsSpmbOpen] = useState(true);
  const [isUpdatingSpmb, setIsUpdatingSpmb] = useState(false);

  const handleToggleSpmbStatus = () => {
    const nextStatus = !isSpmbOpen;
    const statusText = nextStatus ? "DIBUKA" : "DITUTUP";
    const statusDesc = nextStatus
      ? "Formulir pendaftaran publik akan kembali menerima calon peserta didik baru."
      : "Formulir pendaftaran publik akan di-nonaktifkan dan pengunjung tidak dapat mendaftar.";

    Swal.fire({
      title: `Ubah Status SPMB ke ${statusText}?`,
      text: statusDesc,
      icon: nextStatus ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus ? "#10B981" : "#F43F5E",
      cancelButtonColor: "#64748B",
      confirmButtonText: `Ya, ${statusText} SPMB`,
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsUpdatingSpmb(true);
        setTimeout(() => {
          setIsSpmbOpen(nextStatus);
          setIsUpdatingSpmb(false);
          Swal.fire({
            title: `Status SPMB ${statusText}!`,
            text: `Pendaftaran SPMB sekolah telah resmi di-${statusText.toLowerCase()}.`,
            icon: "success",
            confirmButtonColor: "#2563EB",
            customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
          });
        }, 400);
      }
    });
  };

  const trend = getTrendData();

  // Combine RPC major stats with our major colors
  const barData = statsData.majors ? statsData.majors.map((m: any) => {
     // find color
     const conf = majorsList.find(ml => ml.dbName === m.name || ml.name === m.name);
     return {
       label: conf?.name || m.name,
       color: conf?.color || "#3b82f6",
       value: m.value
     };
  }) : [];

  const stats = [
    { label: "Total Pendaftar",   value: Number(statsData.total || (statsData as any).total_pendaftar || 0), sub: "Calon Siswa Baru",          color: "blue",    icon: <Users size={20} /> },
    { label: "Terverifikasi",      value: Number(statsData.approved || 0), sub: "Berkas Lolos Validasi",      color: "emerald", icon: <ShieldCheck size={20} /> },
    { label: "Menunggu",           value: Number(statsData.pending || 0),  sub: "Perlu Pemeriksaan",          color: "amber",   icon: <Clock size={20} /> },
    { label: "Ditolak / Gugur",    value: Number(statsData.rejected || 0), sub: "Tidak Memenuhi Syarat",      color: "rose",    icon: <AlertTriangle size={20} /> },
  ];

  return (
    <div className="space-y-6">

      {/* ── Kontrol Pendaftaran Publik (Simple & Functional Banner) ────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Power className="w-3.5 h-3.5 text-blue-600" /> Kontrol Pendaftaran Publik
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isSpmbOpen
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
            }`}>
              {isSpmbOpen ? "DIBUKA (OPEN)" : "DITUTUP (CLOSED)"}
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Status Resmi Pendaftaran SPMB
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isSpmbOpen
              ? "Pendaftaran calon siswa baru saat ini aktif. Pengunjung landing page dapat mengisi formulir pendaftaran secara langsung."
              : "Pendaftaran publik saat ini non-aktif. Pengunjung landing page tidak dapat mengisi formulir pendaftaran."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isSpmbOpen ? "Matikan Pendaftaran" : "Buka Pendaftaran"}
            </p>
            <p className="text-[11px] text-slate-400">
              Ubah akses formulir publik instansi
            </p>
          </div>
          <button
            onClick={handleToggleSpmbStatus}
            disabled={isUpdatingSpmb}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto ${
              isSpmbOpen
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10"
            }`}
          >
            <Power className="w-4 h-4" />
            {isSpmbOpen ? "Matikan Pendaftaran" : "Buka Pendaftaran"}
          </button>
        </div>
      </motion.div>

      {!isVerified && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-amber-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Status Akses Dashboard: Terkunci 🔒</h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                Sekolah Anda belum diverifikasi oleh Superadmin Gatekeeper. Fitur grafik & SPMB pendaftaran fiktif dikunci.
              </p>
            </div>
          </div>
          <Link
            href={`./verification`}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" /> Buka Form Verifikasi
          </Link>
        </div>
      )}

      {/* ── Stats Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            sub={s.sub}
            color={s.color}
            icon={s.icon}
            delay={i}
            trigger={counterTrigger}
          />
        ))}
      </div>

      {/* ── Area Chart + Kuota ──────────────────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Area Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Tren Registrasi</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                Statistik pendaftaran – {trendView === "hari" ? "7 hari terakhir" : trendView === "minggu" ? "4 minggu terakhir" : trendView === "bulan" ? "6 bulan terakhir" : "per periode"}
              </p>
            </div>
            <div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-white/5 shrink-0">
              {(["hari", "minggu", "bulan", "periode"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setTrendView(v)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${trendView === v
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-white"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <AreaChart data={trend.counts} labels={trend.labels} color="#3b82f6" />
        </div>

        {/* Kuota Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Data Keseluruhan</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Status kuota seluruh jurusan</p>
            </div>
            <Link
              href="/dashboard/pendaftar?tab=kuota"
              className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-xl transition-all"
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

      {/* ── Bar Chart – Distribusi Jurusan ──────────────────────────────────── */}
      <motion.div
        className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm"
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
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Jumlah calon siswa berdasarkan pilihan jurusan pertama</p>
          </div>
          {/* Legend */}
          <div className="hidden sm:flex items-center flex-wrap gap-x-4 gap-y-1">
            {majorsList.slice(0, 6).map((m) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
        <BarChart data={barData} />
      </motion.div>

      {/* ── Recent Applicants + Kuota Progress ──────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Recent Table */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Pendaftar Terbaru</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">7 calon siswa yang baru mendaftar</p>
            </div>
            <Link href="/dashboard/pendaftar" className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors uppercase tracking-wider">
              Lihat Semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-600 text-[9px] uppercase tracking-widest">
                  <th className="pb-2 pt-1 pl-2">Nama</th>
                  <th className="pb-2 pt-1">Asal Sekolah</th>
                  <th className="pb-2 pt-1">Jurusan</th>
                  <th className="pb-2 pt-1 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {applicants.slice(0, 7).map((a: any, idx: number) => (
                  <motion.tr
                    key={a.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.06, duration: 0.35 }}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/3 transition-all"
                  >
                    <td className="py-2.5 pl-2 font-bold text-slate-800 dark:text-white max-w-[130px] truncate">{a.nama}</td>
                    <td className="py-2.5 truncate max-w-[110px] text-slate-500 dark:text-slate-400 font-medium">{a.sekolah_asal || a.sekolahAsal}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-[9px] font-bold uppercase tracking-wide">
                        {majorsList.find((m) => m.dbName === a.jurusan_1 || m.dbName === a.jurusan1)?.name || a.jurusan_1 || "PPLG"}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wide ${
                        a.status === "Approved" ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                        : a.status === "Rejected" ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                        : "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                      }`}>
                        {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {applicants.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-400 font-bold uppercase tracking-wider text-[10px]">Belum ada data pendaftar</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kuota Progress Charts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white tracking-wider uppercase mb-3 flex items-center gap-2">
              <BarChart2 size={12} className="text-blue-500" /> Progress Calon Siswa
            </h3>
            <KuotaTab type="pendaftar" variant="minimal" />
          </div>
          <div className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
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
