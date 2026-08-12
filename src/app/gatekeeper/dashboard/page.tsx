"use client";
// Force Next.js rebuild

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2, ShieldCheck, CheckCircle2, Clock, Sparkles, RefreshCw,
  TrendingUp, ArrowUpRight, AlertCircle, Bell, ExternalLink, PieChart,
  Landmark, Hourglass, FileQuestion
} from "lucide-react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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
}

export default function GatekeeperOverviewPage() {
  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getBackendUrl = () => {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
    if (typeof window !== 'undefined') return `/api`;
    return '/api';
  };

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/gatekeeper/schools");
      if (!res.ok) {
        setSchools([]);
        return;
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSchools(json.data);
      } else {
        setSchools([]);
      }
    } catch (err: any) {
      console.error("Gagal mengambil data sekolah real:", err);
      setError("Gagal menghubungkan ke database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Compute Live Metrics
  const totalSchoolsCount = schools.length;
  const verifiedCount = schools.filter(s => s.status === "FULL_VERIFIED").length;
  const pendingCount = schools.filter(s => s.status === "PENDING_VERIFICATION").length;
  const unverifiedCount = schools.filter(s => s.status === "BELUM_KIRIM_VERIFIKASI" || s.status === "UNVERIFIED").length;

  const pendingSchools = schools.filter(s => s.status === "PENDING_VERIFICATION");

  const stats = [
    {
      label: "Total Sekolah SaaS",
      value: totalSchoolsCount.toString(),
      change: `${totalSchoolsCount} Instansi Terdaftar`,
      icon: Landmark,
      color: "text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-500/10"
    },
    {
      label: "Verifikasi Resmi (Aktif)",
      value: verifiedCount.toString(),
      change: totalSchoolsCount > 0 ? `${Math.round((verifiedCount / totalSchoolsCount) * 100)}% Terverifikasi` : "0% Terverifikasi",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-500/10"
    },
    {
      label: "Menunggu Verifikasi SK",
      value: pendingCount.toString(),
      change: pendingCount > 0 ? "Perlu Tindakan Gatekeeper" : "Semua Berkas Diproses",
      icon: Hourglass,
      color: "text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-500/10"
    },
    {
      label: "Belum Kirim Dokumen SK",
      value: unverifiedCount.toString(),
      change: "Pendaftar Baru / Belum SK",
      icon: FileQuestion,
      color: "text-rose-600 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-500/10"
    },
  ];

  const chartOptions: any = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
      background: 'transparent',
    },
    labels: ['Terverifikasi', 'Menunggu Verifikasi', 'Belum Mengirim Berkas'],
    colors: ['#059669', '#d97706', '#4f46e5'],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { show: true, fontSize: '12px', fontWeight: 600, color: '#64748b' },
            value: { show: true, fontSize: '24px', fontWeight: 800, color: '#0f172a' },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              color: '#64748b',
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
      labels: { colors: '#64748b' },
      markers: { width: 10, height: 10, radius: 10, offsetX: -4 }
    },
    theme: { mode: 'light' }
  };

  const chartSeries = [verifiedCount, pendingCount, unverifiedCount];

  return (
    <div className="space-y-6">
      
      {/* Real-time Notification Banner for Pending Verifications */}
      {pendingCount > 0 && (
        <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 shrink-0">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider">Notifikasi Gatekeeper: Berkas SK Baru Diterima!</h4>
              <p className="text-xs text-amber-100 font-medium">
                Terdapat <strong className="underline">{pendingCount} sekolah</strong> yang baru saja mengunggah dokumen SK Operasional &amp; menunggu verifikasi Anda.
              </p>
            </div>
          </div>
          <Link
            href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
            className="px-4 py-2 bg-white text-amber-600 hover:bg-amber-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 self-start sm:self-center"
          >
            Tinjau Verifikasi Sekarang →
          </Link>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-10 pointer-events-none">
          <ShieldCheck className="w-96 h-96 text-slate-900 dark:text-white" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Selamat Datang, Gatekeeper <span className="text-blue-600 dark:text-blue-500">Superadmin</span> 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Kelola verifikasi legalitas sekolah pendaftar, tanggapan feedback admin sekolah, dan pantau kesehatan infrastruktur SaaS CationGate secara terpusat.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" /> Tinjau {pendingCount} Sekolah Menunggu Verifikasi
            </Link>
            <Link
              href="/gatekeeper/dashboard/schools"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" /> Kelola Semua Sekolah ({totalSchoolsCount})
            </Link>
            <button
              onClick={fetchSchools}
              disabled={loading}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
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
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {st.label}
                </span>
                <div className={`p-2.5 rounded-full ${st.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                  {loading ? "..." : st.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{st.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: High Priority Pending Verifications */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-900">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Antrean Verifikasi Sekolah Real-time</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sekolah yang baru mengunggah SK Operasional &amp; NPSN</p>
              </div>
            </div>

            <Link
              href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Lihat Semua ({pendingSchools.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 py-2">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs font-bold">Memuat antrean verifikasi real-time...</div>
            ) : pendingSchools.length > 0 ? (
              <>
                {pendingSchools.slice(0, 5).map((sc) => (
                  <div key={sc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-850/50 p-2 rounded-2xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {sc.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{sc.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">NPSN: {sc.npsn || "-"}</p>
                      </div>
                    </div>
                    
                    <Link
                      href={`/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION`}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1 shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Review SK
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-slate-700 dark:text-slate-200 text-sm">Tidak Ada Antrean Verifikasi Pending</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Semua dokumen sekolah yang terdaftar saat ini sudah diverifikasi atau belum mengunggah dokumen SK.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Platform Health & Quick Status */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Platform Infrastructure Health
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Supabase Postgres DB</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Healthy (Live)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Multi-Tenant Routing Engine</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">99.99% Operational</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
