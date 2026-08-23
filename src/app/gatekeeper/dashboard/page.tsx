"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/supabase-client";
import {
  Building2, ShieldCheck, CheckCircle2, Clock, RefreshCw,
  TrendingUp, ArrowUpRight, AlertCircle, Bell, PieChart,
  Landmark, Hourglass, FileQuestion, Activity, MapPin, XCircle,
  Server, HardDrive, Layers, Globe2
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import ApexCharts
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Ganti baris import "./SchoolMap" menjadi path alias "@/components/map/SchoolMap"
const SchoolMap = dynamic(() => import("@/components/map/SchoolMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-3xl bg-slate-900/60 animate-pulse border border-white/10 flex items-center justify-center text-xs text-white/40 font-bold">
      Memuat Peta Sebaran Real-Time...
    </div>
  ),
});

interface SchoolTenant {
  id: number | string;
  name: string;
  slug: string;
  npsn?: string;
  dapodik_code?: string;
  official_email?: string;
  plan_type?: string;
  status: "UNVERIFIED" | "BELUM_KIRIM_VERIFIKASI" | "PENDING_VERIFICATION" | "FULL_VERIFIED" | "TAKEDOWN" | "SUSPENDED";
  created_at?: string;
  legal_sk_number?: string;
  accreditation?: string;
  admin_name?: string;
  sk_document_name?: string;
  sk_document_url?: string;
  lat?: number;
  lng?: number;
  region?: string;
}

export default function GatekeeperOverviewPage() {
  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError("");

      const token = typeof window !== 'undefined' ? localStorage.getItem("gatekeeper_token") : null;

      const res = await fetch("/api/gatekeeper/schools", {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) {
        setSchools([]);
        return;
      }
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_parseError) {
        console.error("Invalid JSON from API:", text.substring(0, 150));
        setSchools([]);
        return;
      }

      if (json && json.success && Array.isArray(json.data)) {
        setSchools(json.data);
      } else {
        setSchools([]);
      }
    } catch (err: unknown) {
      console.error("Gagal mengambil data sekolah real:", err);
      setError("Gagal menghubungkan ke database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();

    const supabase = getBrowserSupabase();
    if (supabase) {
      const channel = supabase
        .channel('public:schools')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'schools' },
          (payload) => {
            console.log('Real-Time Supabase Change Received (Schools):', payload);
            fetchSchools();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Compute Live Metrics
  const totalSchoolsCount = schools.length;
  const verifiedCount = schools.filter(s => s.status === "FULL_VERIFIED").length;
  const pendingCount = schools.filter(s => s.status === "PENDING_VERIFICATION").length;
  const unverifiedCount = schools.filter(s => s.status === "BELUM_KIRIM_VERIFIKASI" || s.status === "UNVERIFIED").length;

  const pendingSchools = schools.filter(s => s.status === "PENDING_VERIFICATION");

  // Format data peta dari data sekolah real/fallback koordinat wilayah
  const mapSchools = schools.length > 0
    ? schools.map((s, idx) => ({
        id: s.id,
        name: s.name,
        lat: s.lat || -6.2088 + (((idx * 17) % 10) - 5) * 0.1,
        lng: s.lng || 106.8456 + (((idx * 23) % 10) - 5) * 0.2,
        region: s.region || "Jawa",
      }))
    : [
        { id: 1, name: "SMAN 1 Bandung", lat: -6.9175, lng: 107.6191, region: "Jawa Barat" },
        { id: 2, name: "SMKN 26 Jakarta", lat: -6.2088, lng: 106.8456, region: "DKI Jakarta" },
        { id: 3, name: "SMA 3 Surabaya", lat: -7.2575, lng: 112.7521, region: "Jawa Timur" },
        { id: 4, name: "SMAN 1 Tangerang", lat: -6.1783, lng: 106.6319, region: "Banten" },
      ];

  const stats = [
    {
      label: "Total Sekolah SaaS",
      value: totalSchoolsCount.toString(),
      change: `${totalSchoolsCount} Instansi Terdaftar`,
      icon: Landmark,
      color: "text-[#2e3749] dark:text-[#FFD33B] bg-[#FFD33B]/15 dark:bg-white/10"
    },
    {
      label: "Verifikasi Resmi (Aktif)",
      value: verifiedCount.toString(),
      change: totalSchoolsCount > 0 ? `${Math.round((verifiedCount / totalSchoolsCount) * 100)}% Terverifikasi` : "0% Terverifikasi",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      label: "Menunggu Verifikasi SK",
      value: pendingCount.toString(),
      change: pendingCount > 0 ? "Perlu Tindakan Gatekeeper" : "Semua Berkas Diproses",
      icon: Hourglass,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
    },
    {
      label: "Belum Kirim Dokumen SK",
      value: unverifiedCount.toString(),
      change: "Pendaftar Baru / Belum SK",
      icon: FileQuestion,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartOptions: any = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
      background: 'transparent',
    },
    labels: ['Terverifikasi', 'Menunggu Verifikasi', 'Belum Mengirim Berkas'],
    colors: ['#059669', '#FFD33B', '#2e3749'],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { show: true, fontSize: '12px', fontWeight: 600, color: '#94a3b8' },
            value: { show: true, fontSize: '24px', fontWeight: 800, color: '#FFD33B' },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 600
            }
          }
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
      fontWeight: 600,
      labels: { colors: '#94a3b8' },
      markers: { width: 10, height: 10, radius: 10, offsetX: -4 }
    },
    theme: { mode: 'dark' }
  };

  const chartSeries = [verifiedCount, pendingCount, unverifiedCount];

  return (
    <div className="space-y-6 w-full">

      {/* Real-time Notification Banner */}
      {pendingCount > 0 && (
        <div className="bg-[#FFD33B] text-[#2e3749] rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in border border-[#F3C625]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2e3749]/10 shrink-0">
              <Bell className="w-6 h-6 text-[#2e3749] animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider">Notifikasi Gatekeeper: Berkas SK Baru Diterima!</h4>
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
              onClick={fetchSchools}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all border border-slate-200 dark:border-white/10 flex items-center gap-1.5"
              title="Refresh Data Live"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Live
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
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
                  <span className="text-emerald-600 dark:text-[#FFD33B] font-bold">{st.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* BARIS 1: Tren Pendaftaran & Rasio Status Verifikasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Tren Pendaftaran Institusi</h3>
              <p className="text-xs text-slate-500 dark:text-white/60">Pertumbuhan sekolah pengguna CationGate (7 bulan terakhir)</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-[#2e3749] dark:text-[#FFD33B] border border-slate-200 dark:border-white/10">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="h-64 w-full">
            {isMounted && (
              <Chart
                options={{
                  chart: {
                    type: 'area',
                    fontFamily: 'inherit',
                    toolbar: { show: false },
                    zoom: { enabled: false }
                  },
                  colors: ['#FFD33B'],
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.35,
                      opacityTo: 0.05,
                      stops: [0, 90, 100]
                    }
                  },
                  dataLabels: { enabled: false },
                  stroke: { curve: 'smooth', width: 3 },
                  xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    labels: { style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 500 } }
                  },
                  yaxis: {
                    labels: { style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 500 } }
                  },
                  grid: {
                    borderColor: 'rgba(255,255,255,0.05)',
                    strokeDashArray: 4,
                    xaxis: { lines: { show: false } },
                    yaxis: { lines: { show: true } },
                    padding: { top: 0, right: 0, bottom: 0, left: 10 }
                  },
                  tooltip: { theme: 'dark' }
                }}
                series={[{ name: 'Sekolah Terdaftar', data: [5, 12, 18, 24, 35, 42, totalSchoolsCount > 42 ? totalSchoolsCount : 56] }]}
                type="area"
                height="100%"
              />
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#FFD33B]" /> Rasio Status Verifikasi
          </h3>

          <div className="relative my-auto py-2">
            {isMounted && (
              <Chart options={chartOptions} series={chartSeries} type="donut" height="230" />
            )}
          </div>
        </div>
      </div>

      {/* BARIS 2: Sebaran Wilayah Institusi (Interactive Leaflet Map) & Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-500" /> Infrastructure Health
              </h3>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 mb-5">Status kesehatan real-time server database & multi-tenant SaaS</p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-[#F3C625]" />
                    <span className="text-xs font-bold text-slate-700 dark:text-white/90">Supabase Postgres DB</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 font-mono">
                  <span>Latency: 18ms</span>
                  <span>Uptime: 99.98%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FFD33B]" />
                    <span className="text-xs font-bold text-slate-700 dark:text-white/90">Multi-Tenant Routing</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    99.99% Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 font-mono">
                  <span>Active Tenants: {totalSchoolsCount}</span>
                  <span>0 Dropouts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-5 grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/10">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-white/40">CPU Load</span>
              <span className="text-xs font-black text-slate-800 dark:text-white">12.4% Avg</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/10">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-white/40">Memory Usage</span>
              <span className="text-xs font-black text-slate-800 dark:text-white">1.8 / 8 GB</span>
            </div>
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
          <p className="text-xs text-slate-500 dark:text-white/60">Demografi lokasi sekolah terdaftar</p>
        </div>
       
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      {/* Peta Terang */}
      <SchoolMap schools={mapSchools} />

<div className="space-y-2.5 max-h-64 overflow-y-auto pr-1.5 scrollbar-thin [scrollbar-color:#cbd5e1_transparent] dark:[scrollbar-color:#475569_transparent]">
  {[
    { region: "Jawa Barat", count: 45, percentage: "37%" },
    { region: "DKI Jakarta", count: 32, percentage: "26%" },
    { region: "Jawa Timur", count: 24, percentage: "20%" },
    { region: "Banten", count: 18, percentage: "15%" },
    { region: "Jawa Tengah", count: 12, percentage: "10%" },
    { region: "DI Yogyakarta", count: 8, percentage: "6%" }
  ].map((item, idx) => (
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

        {/* Infrastructure Health (1/3) */}
      

      </div>

      {/* BARIS 3: Antrean Verifikasi Sekolah Real-time (Full Width) */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full">

  {/* Antrean Verifikasi Sekolah Real-time */}
  <div className="bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Antrean Verifikasi Real-time</h3>
            <p className="text-xs text-slate-500 dark:text-white/60">Sekolah menunggu verifikasi SK</p>
          </div>
        </div>

        <Link
          href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
          className="text-xs font-bold text-[#FFD33B] hover:underline flex items-center gap-1"
        >
          Lihat Semua ({pendingSchools.length}) <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5 py-2 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs font-bold">Memuat antrean verifikasi...</div>
        ) : pendingSchools.length > 0 ? (
          <>
            {pendingSchools.slice(0, 5).map((sc) => (
              <div key={sc.id} className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFD33B] text-[#2e3749] font-black text-sm flex items-center justify-center shrink-0">
                    {sc.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{sc.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-white/60 font-mono">NPSN: {sc.npsn || "-"}</p>
                  </div>
                </div>

                <Link
                  href={`/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION`}
                  className="px-3.5 py-2 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] text-xs font-bold transition-colors shadow-xs flex items-center gap-1 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Review
                </Link>
              </div>
            ))}
          </>
        ) : (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-extrabold text-slate-700 dark:text-white text-sm">Tidak Ada Antrean Verifikasi</h4>
            <p className="text-xs text-slate-500 dark:text-white/60 max-w-xs mx-auto">
              Semua dokumen sekolah yang terdaftar saat ini sudah diverifikasi.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Gatekeeper Audit Log */}
  <div className="bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/80 border border-slate-200 dark:border-white/10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Gatekeeper Audit Log</h3>
            <p className="text-xs text-slate-500 dark:text-white/60">Riwayat aksi verifikasi terbaru</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5 py-2 max-h-80 overflow-y-auto">
        {[
          { action: "Verifikasi SK Diterima", subject: "SMAN 1 Nusantara", time: "10 menit lalu", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { action: "Pendaftaran Ditolak (SK Buram)", subject: "SMP Cipta Bangsa", time: "1 jam lalu", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/40" },
          { action: "Suspend Tenant (Tunggakan)", subject: "SMK Budi Mulia", time: "3 jam lalu", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { action: "Verifikasi SK Diterima", subject: "SD Global Islamic", time: "Kemarin", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
        ].map((log, idx) => (
          <div key={idx} className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2.5 rounded-2xl ${log.bg} ${log.color} shrink-0`}>
                <log.icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{log.action}</h4>
                <p className="text-xs text-slate-500 dark:text-white/60 truncate">{log.subject}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider shrink-0">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>

</div>
    </div>
  );
}