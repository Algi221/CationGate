"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2, ShieldCheck, CheckCircle2, XCircle, AlertCircle, Search,
  Filter, Eye, MessageSquare, CreditCard, Activity, Sparkles, RefreshCw,
  Users, Check, ArrowRight, Lock, Unlock, HelpCircle, FileText, Send, Trash2,
  KeyRound, ArrowUpRight, TrendingUp, Clock, AlertTriangle, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GatekeeperOverviewPage() {
  const [loading, setLoading] = useState(false);

  // Summary Metrics
  const stats = [
    { label: "Total Sekolah SaaS", value: "48", change: "+12% bulan ini", icon: Building2, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900" },
    { label: "Verifikasi Aktif", value: "42", change: "87.5% Terverifikasi", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900" },
    { label: "Menunggu Verifikasi", value: "6", change: "Perlu Tindakan", icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900" },
    { label: "Estimasi Revenue (MTD)", value: "Rp 184.500.000", change: "+18.4% YoY", icon: TrendingUp, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900" },
  ];

  // High priority Pending Schools
  const pendingSchools = [
    { id: 2, name: "SMK Putra Bangsa", slug: "smkputrabangsa", npsn: "20229199", email: "admin@smkputrabangsa.sch.id", date: "28 Juli 2026", plan: "STARTER" },
    { id: 4, name: "SMK Telkom Depok", slug: "smktelkomdepok", npsn: "20229450", email: "ppdb@smktelkomdepok.sch.id", date: "30 Juli 2026", plan: "PRO" },
    { id: 5, name: "SMA Nusantara 1", slug: "smanusantara1", npsn: "20229810", email: "info@smanusantara1.sch.id", date: "31 Juli 2026", plan: "PRO" },
  ];

  // Recent System Logs
  const auditLogs = [
    { time: "10 menit yang lalu", user: "uno", action: "Menyetujui Verifikasi Sekolah SMK Genesis Depok", icon: CheckCircle2, color: "text-emerald-500" },
    { time: "1 jam yang lalu", user: "System", action: "Auto-backup database multi-tenant selesai (48 node OK)", icon: Activity, color: "text-blue-500" },
    { time: "3 jam yang lalu", user: "Admin Sekolah", action: "Pendaftaran baru sekolah SMA Nusantara 1", icon: Building2, color: "text-indigo-500" },
    { time: "5 jam yang lalu", user: "uno", action: "Membalas tiket feedback #FB-2026-089 (SMK Putra Bangsa)", icon: MessageSquare, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <ShieldCheck className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Platform Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang, Gatekeeper <span className="text-blue-400">uno</span> 👋
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Kelola verifikasi legalitas sekolah pendaftar, tanggapan feedback admin sekolah, dan pantau kesehatan infrastruktur SaaS CationGate secara terpusat.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" /> Tinjau 6 Sekolah Menunggu Verifikasi
            </Link>
            <Link
              href="/gatekeeper/dashboard/schools"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" /> Kelola Semua Sekolah
            </Link>
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
                <div className={`p-2.5 rounded-xl border ${st.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                  {st.value}
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
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Antrean Verifikasi Sekolah</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sekolah yang telah mengunggah SK Operasional & NPSN</p>
              </div>
            </div>

            <Link
              href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 py-2">
            {pendingSchools.map((sc) => (
              <div key={sc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-850/50 p-2 rounded-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {sc.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{sc.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-100 dark:border-blue-900">
                        {sc.plan}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      NPSN: {sc.npsn} • {sc.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/gatekeeper/dashboard/schools?search=${sc.name}`}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Tinjau SK & Verifikasi
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Platform Health & System Activity */}
        <div className="space-y-6">
          
          {/* Health Telemetry Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Platform Infrastructure Health
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Supabase Postgres DB</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Healthy (18ms)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Supabase Storage CDN</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 99.99% Uptime
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Active Admin Sessions</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  128 Online
                </span>
              </div>
            </div>
          </div>

          {/* Audit Logs Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Aktivitas Terkini</h3>
            <div className="space-y-3">
              {auditLogs.map((lg, i) => {
                const Icon = lg.icon;
                return (
                  <div key={i} className="flex gap-3 text-xs">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${lg.color}`} />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">{lg.action}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lg.time} • oleh {lg.user}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
