"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePPDB } from "@/context/PPDBContext";
import {
  Users, ShieldCheck, Clock, AlertTriangle, BarChart2,
  Pencil, ArrowRight, Lock, Power
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import KuotaTab from "@/components/KuotaTab";
import Swal from "sweetalert2";
import type { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MajorItem {
  name: string;
  dbName: string;
  color: string;
  count?: number;
}

interface MajorConfigItem {
  code?: string;
  title?: string;
  name?: string;
  color?: string;
}

interface ApplicantItem {
  id?: number | string;
  nama?: string;
  nisn?: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan_1?: string;
  jurusan1?: string;
  status?: string;
  tgl_daftar?: string;
  created_at?: string;
}

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

function StatCard({
  label, value, sub, color, icon, delay = 0, trigger = false
}: {
  label: string; value: number; sub: string; color: string;
  icon: React.ReactNode; delay?: number; trigger?: boolean;
}) {
  const displayValue = useCountUp(value, 1300 + delay * 80, trigger);
  const colorMap: Record<string, { iconBg: string; iconText: string; }> = {
    blue:    { iconBg: "bg-blue-50 dark:bg-blue-900/20",    iconText: "text-blue-600 dark:text-blue-400" },
    emerald: { iconBg: "bg-emerald-50 dark:bg-emerald-900/20", iconText: "text-emerald-600 dark:text-emerald-400" },
    amber:   { iconBg: "bg-amber-50 dark:bg-amber-900/20",   iconText: "text-amber-600 dark:text-amber-400" },
    rose:    { iconBg: "bg-rose-50 dark:bg-rose-900/20",    iconText: "text-rose-600 dark:text-rose-400" },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{label}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.iconBg} ${c.iconText}`}>{icon}</div>
      </div>
      <h3 className="text-3xl font-bold leading-none mb-1 tabular-nums text-slate-900 dark:text-white">{displayValue}</h3>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{sub}</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Area Chart using ApexCharts (Tailadmin style)
// ─────────────────────────────────────────────────────────────────────────────
function AreaChart({
  data,
  labels,
  color = "#2563eb",
}: {
  data: number[];
  labels: string[];
  color?: string;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const id = requestAnimationFrame(checkDark);
    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, []);

  const series = [
    {
      name: "Pendaftar",
      data: data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      fontFamily: "inherit",
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
    },
    colors: [color],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    grid: {
      borderColor: isDark ? "#1e293b" : "#f1f5f9",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 10, bottom: 0, left: 10 },
    },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDark ? "#64748b" : "#94a3b8",
          fontSize: "11px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#64748b" : "#94a3b8",
          fontSize: "11px",
          fontWeight: 500,
        },
        formatter: (val: number) => `${Math.round(val)}`,
      },
      min: 0,
      forceNiceScale: true,
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
  };

  return (
    <div className="w-full h-75">
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
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "demo";
  const [trendView, setTrendView] = useState<"hari" | "minggu" | "bulan" | "periode">("hari");
  const counterTrigger = (applicants?.length || 0) > 0;

  const isVerified = !schoolStatus || schoolStatus === 'FULL_VERIFIED' || schoolStatus === 'VERIFIED' || schoolStatus === 'verified' || isDemoMode;

  const [majorsList, setMajorsList] = useState<MajorItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_majors_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {   
            return parsed.map((m: MajorConfigItem) => ({
              name: m.code === "RPL" ? "PPLG" : (m.code === "ANM" ? "Animasi" : (m.code === "BC" ? "Broadcasting" : (m.code || m.name || ""))),
              dbName: m.title || m.name || "",
              color: m.color || "#2E7CF6",
            }));
          }
        } catch { /* ignore */ }
      }
    }
    return [
      { name: "PPLG", dbName: "Rekayasa Perangkat Lunak", color: "#2E7CF6" },
      { name: "TJKT", dbName: "Teknik Jaringan Komputer & Telekomunikasi", color: "#0BB0CE" },
      { name: "DKV", dbName: "Desain Komunikasi Visual", color: "#7957F5" },
      { name: "Broadcasting", dbName: "Broadcasting & Perfilman", color: "#F7A325" },
      { name: "Elektronika", dbName: "Teknik Elektronika", color: "#16C172" },
      { name: "Animasi", dbName: "Animasi", color: "#EC4E9E" },
    ];
  });

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.ppdb_majors_config) {
          const dbMajors = json.data.ppdb_majors_config;
          if (Array.isArray(dbMajors) && dbMajors.length > 0) {
            const hasLocalMajors = !!localStorage.getItem("ppdb_majors_config");
            const slugPath = window.location.pathname.split('/')[1] || "";
            if (slugPath === "demo" || !hasLocalMajors) {
              const mapped = dbMajors.map((m: MajorConfigItem) => ({
                name: m.code === "RPL" ? "PPLG" : (m.code === "ANM" ? "Animasi" : (m.code === "BC" ? "Broadcasting" : (m.code || m.name || ""))),
                dbName: m.title || m.name || "",
                color: m.color || "#2E7CF6",
              }));
              setMajorsList(mapped);
              localStorage.setItem("ppdb_majors_config", JSON.stringify(dbMajors));
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  // ── Derived Stats (computed dari data pendaftar) ───────────────────────────
  const computedStats = useMemo(() => {
    const list: ApplicantItem[] = applicants || [];
    const approved = list.filter((a: ApplicantItem) => a.status === "Approved").length;
    const pending = list.filter((a: ApplicantItem) => a.status === "Pending").length;
    const rejected = list.filter((a: ApplicantItem) => a.status === "Rejected").length;
    return { total: list.length, approved, pending, rejected };
  }, [applicants]);

  const majorsMap = useMemo(() => {
    const counts: Record<string, number> = {};
    (applicants || []).forEach((a: ApplicantItem) => {
      const name = a.jurusan_1 || a.jurusan1 || "";
      if (name) counts[name] = (counts[name] || 0) + 1;
    });
    return counts;
  }, [applicants]);

  const barData = useMemo(() => {
    return Object.entries(majorsMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => {
        const conf = majorsList.find((ml) => ml.dbName === name || ml.name === name);
        return { label: conf?.name || name, color: conf?.color || "#2E7CF6", value };
      });
  }, [majorsMap, majorsList]);

  const trend = useMemo(() => {
    const now = new Date(); 
    const dayMs = 86400000;
    const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

    const nowTime = now.getTime();
    const registeredAt = (a: { tgl_daftar?: string; created_at?: string }) => {
      const dateStr = a.tgl_daftar || a.created_at;
      if (!dateStr) return nowTime;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? nowTime : d.getTime();
    };

    let buckets: { label: string; from: number; to: number }[] = [];

    if (trendView === "hari") {
      const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      for (let i = 6; i >= 0; i--) {
        const d = startOfDay(new Date(now.getTime() - i * dayMs));
        buckets.push({ label: dayNames[d.getDay()], from: d.getTime(), to: d.getTime() + dayMs });
      }
    } else if (trendView === "minggu") {
      const startOfWeek = (d: Date) => {
        const x = startOfDay(d);
        const diff = x.getDay() === 0 ? -6 : 1 - x.getDay();
        return new Date(x.getTime() + diff * dayMs);
      };
      const weekStart = startOfWeek(now);
      for (let i = 3; i >= 0; i--) {
        const from = new Date(weekStart.getTime() - i * 7 * dayMs);
        buckets.push({
          label: `${from.getDate()}/${from.getMonth() + 1}`,
          from: from.getTime(),
          to: from.getTime() + 7 * dayMs,
        });
      }
    } else if (trendView === "bulan") {
      for (let i = 5; i >= 0; i--) {
        const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        buckets.push({
          label: from.toLocaleDateString("id-ID", { month: "short" }),
          from: from.getTime(),
          to: to.getTime(),
        });
      }
    } else {
      const months = new Map<string, { from: number; to: number }>();

      (applicants || []).forEach((a: ApplicantItem) => {
        const t = registeredAt(a);
        const d = new Date(t);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!months.has(key)) {
          months.set(key, {
            from: new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
            to: new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime(),
          });
        }
      });
      buckets = [...months.entries()]
        .sort((a, b) => a[1].from - b[1].from)
        .map(([, r]) => {
          const d = new Date(r.from);
          return {
            label: d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
            from: r.from,
            to: r.to,
          };
        });
    }

    const counts = buckets.map((b) =>
      (applicants || []).filter((a: ApplicantItem) => {
        const t = registeredAt(a);
        return t >= b.from && t < b.to;
      }).length
    );
    return { labels: buckets.map((b) => b.label), counts };
  }, [applicants, trendView]);

  // ── Status SPMB (persisted via config key ppdb_portal_status) ──────────────
  const [isSpmbOpen, setIsSpmbOpen] = useState(true);
  const [isUpdatingSpmb, setIsUpdatingSpmb] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    fetch(`/api/config?school_id=${schoolId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const status = json.data.ppdb_portal_status;
          if (status === "closed") setIsSpmbOpen(false);
          else if (status === "open") setIsSpmbOpen(true);
        }
      })
      .catch(() => {});
  }, [schoolId]);

  const handleToggleSpmbStatus = async () => {
    const nextStatus = !isSpmbOpen;
    const statusText = nextStatus ? "DIBUKA" : "DITUTUP";
    const statusDesc = nextStatus
      ? "Formulir pendaftaran publik akan kembali menerima calon peserta didik baru."
      : "Formulir pendaftaran publik akan di-nonaktifkan dan pengunjung tidak dapat mendaftar.";

    const { isConfirmed } = await Swal.fire({
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
    });
    if (!isConfirmed) return;

    setIsUpdatingSpmb(true);
    try {
      const res = await fetch(`/api/config?school_id=${schoolId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          key: "ppdb_portal_status",
          value: nextStatus ? "open" : "closed"
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSpmbOpen(nextStatus);
        Swal.fire({
          title: `Status SPMB ${statusText}!`,
          text: `Pendaftaran SPMB sekolah telah resmi di-${statusText.toLowerCase()}.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      } else {
        Swal.fire({
          title: "Gagal Menyimpan",
          text: data.message || "Gagal mengubah status pendaftaran SPMB.",
          icon: "error",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    } catch {
      Swal.fire({
        title: "Kesalahan Koneksi",
        text: "Terjadi kesalahan saat menghubungi server. Status belum berubah.",
        icon: "error",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    } finally {
      setIsUpdatingSpmb(false);
    }
  };

  const stats = [
    { label: "Total Pendaftar",   value: computedStats.total,    sub: "Calon Siswa Baru",          color: "blue",    icon: <Users size={20} /> },
    { label: "Terverifikasi",     value: computedStats.approved, sub: "Berkas Lolos Validasi",      color: "emerald", icon: <ShieldCheck size={20} /> },
    { label: "Menunggu",          value: computedStats.pending,  sub: "Perlu Pemeriksaan",          color: "amber",   icon: <Clock size={20} /> },
    { label: "Ditolak / Gugur",   value: computedStats.rejected, sub: "Tidak Memenuhi Syarat",      color: "rose",    icon: <AlertTriangle size={20} /> },
  ];

  return (
    <div className="space-y-6">

      {/* ── Kontrol Pendaftaran Publik (Simple & Functional Banner) ────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
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
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {isSpmbOpen
              ? "Pendaftaran Calon Siswa Baru Sedang Aktif"
              : "Pendaftaran Calon Siswa Baru Sedang Ditutup Sementara"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isSpmbOpen
              ? "Formulir pendaftaran dan pemilihan jurusan dapat diakses secara publik oleh seluruh calon pendaftar."
              : "Calon pendaftar yang mengakses link formulir akan melihat halaman pemberitahuan bahwa gelombang pendaftaran belum dibuka."}
          </p>
        </div>

        <button
          onClick={handleToggleSpmbStatus}
          disabled={isUpdatingSpmb}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer shadow-sm disabled:opacity-50 ${
            isSpmbOpen
              ? "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
          }`}
        >
          {isUpdatingSpmb ? (
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isSpmbOpen ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Power className="w-4 h-4" />
          )}
          <span>{isSpmbOpen ? "Tutup Pendaftaran" : "Buka Pendaftaran"}</span>
        </button>
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
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Tren Registrasi</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold mt-0.5">
                Statistik pendaftaran – {trendView === "hari" ? "7 hari terakhir" : trendView === "minggu" ? "4 minggu terakhir" : trendView === "bulan" ? "6 bulan terakhir" : "per periode"}
              </p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800/40 shrink-0">
              {(["hari", "minggu", "bulan", "periode"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setTrendView(v)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${trendView === v
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800/30"
                    : "text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <AreaChart data={trend.counts} labels={trend.labels} color="#2563eb" />
        </div>

        {/* Kuota Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Data Keseluruhan</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold mt-0.5">Status kuota seluruh jurusan</p>
            </div>
            <Link
              href={`/${schoolSlug}/dashboard/pendaftar?tab=kuota`}
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
        className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm"
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
            <p className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold mt-0.5">Jumlah calon siswa berdasarkan pilihan jurusan pertama</p>
          </div>
          {/* Legend */}
          <div className="hidden sm:flex items-center flex-wrap gap-x-4 gap-y-1">
            {majorsList.slice(0, 6).map((m) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{m.name}</span>
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
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">Pendaftar Terbaru</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold mt-0.5">7 calon siswa yang baru mendaftar</p>
            </div>
            <Link href={`/${schoolSlug}/dashboard/pendaftar`} className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors uppercase tracking-wider">
              Lihat Semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-400 text-[9px] uppercase tracking-widest">
                  <th className="pb-2 pt-1 pl-2">Nama</th>
                  <th className="pb-2 pt-1">Asal Sekolah</th>
                  <th className="pb-2 pt-1">Jurusan</th>
                  <th className="pb-2 pt-1 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {(applicants as ApplicantItem[]).slice(0, 7).map((a: ApplicantItem, idx: number) => (
                  <motion.tr
                    key={a.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.06, duration: 0.35 }}
                    className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    <td className="py-2.5 pl-2 font-bold text-slate-800 dark:text-white max-w-32.5 truncate">{a.nama}</td>
                    <td className="py-2.5 truncate max-w-27.5 text-slate-500 dark:text-slate-400 font-medium">{a.sekolah_asal || a.sekolahAsal}</td>
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
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white tracking-wider uppercase mb-3 flex items-center gap-2">
              <BarChart2 size={12} className="text-blue-500" /> Progress Calon Siswa
            </h3>
            <KuotaTab type="pendaftar" variant="minimal" />
          </div>
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
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
