"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2, ShieldCheck, CheckCircle2, XCircle, AlertCircle, Search,
  Filter, Eye, MessageSquare, CreditCard, Activity, Sparkles, RefreshCw,
  Users, Check, ArrowRight, Lock, Unlock, HelpCircle, FileText, Send, Trash2,
  KeyRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Initial Seed Data for CationGate Platform Management
interface SchoolTenant {
  id: number;
  name: string;
  slug: string;
  npsn: string;
  dapodik_code: string;
  official_email: string;
  plan_type: "STARTER" | "PRO" | "ENTERPRISE";
  status: "UNVERIFIED" | "PENDING_VERIFICATION" | "FULL_VERIFIED" | "SUSPENDED";
  created_at: string;
}

interface FeedbackReport {
  id: number;
  school_name: string;
  admin_name: string;
  category: "Feature Request" | "Bug Report" | "Billing Inquiry" | "General Feedback";
  message: string;
  priority: "Urgent" | "Normal" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
}

export default function GatekeeperDashboardPage() {
  const [activeTab, setActiveTab] = useState<"tenants" | "feedback" | "billing" | "health">("tenants");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // School Tenants State
  const [schools, setSchools] = useState<SchoolTenant[]>([
    {
      id: 1,
      name: "SMK Taruna Bhakti",
      slug: "smktarunabhakti",
      npsn: "20229182",
      dapodik_code: "DPD-2026-981",
      official_email: "info@smktarunabhakti.sch.id",
      plan_type: "PRO",
      status: "FULL_VERIFIED",
      created_at: "2026-07-01",
    },
    {
      id: 2,
      name: "SMK Putra Bangsa",
      slug: "smkputrabangsa",
      npsn: "20229199",
      dapodik_code: "DPD-2026-402",
      official_email: "admin@smkputrabangsa.sch.id",
      plan_type: "STARTER",
      status: "PENDING_VERIFICATION",
      created_at: "2026-07-28",
    },
    {
      id: 3,
      name: "SMA Global Mandiri",
      slug: "smaglobalmandiri",
      npsn: "20229311",
      dapodik_code: "DPD-2026-712",
      official_email: "sekretariat@smaglobalmandiri.sch.id",
      plan_type: "ENTERPRISE",
      status: "FULL_VERIFIED",
      created_at: "2026-06-15",
    },
    {
      id: 4,
      name: "SMK Telkom Depok",
      slug: "smktelkomdepok",
      npsn: "20229450",
      dapodik_code: "DPD-2026-119",
      official_email: "ppdb@smktelkomdepok.sch.id",
      plan_type: "PRO",
      status: "UNVERIFIED",
      created_at: "2026-07-30",
    },
  ]);

  // Feedback Reports State
  const [feedbacks, setFeedbacks] = useState<FeedbackReport[]>([
    {
      id: 1,
      school_name: "SMK Putra Bangsa",
      admin_name: "Bambang Sudirman",
      category: "Bug Report",
      message: "Formulir pendaftaran jalur prestasi foto Base64 belum muncul otomatis di pratinjau kartu peserta.",
      priority: "Urgent",
      status: "In Progress",
      created_at: "2026-07-30 14:20",
    },
    {
      id: 2,
      school_name: "SMA Global Mandiri",
      admin_name: "Dr. Aris Setiawan",
      category: "Feature Request",
      message: "Mohon tambahkan opsi ekspor data format khusus XLS Dapodik Kemendikbudristek 2026/2027.",
      priority: "Normal",
      status: "Open",
      created_at: "2026-07-29 10:15",
    },
    {
      id: 3,
      school_name: "SMK Taruna Bhakti",
      admin_name: "Starbhak PPDB Admin",
      category: "General Feedback",
      message: "Kecepatan HTTP Polling Engine sangat baik dan stabil. Analytics telemetry kelas X membantu guru.",
      priority: "Low",
      status: "Resolved",
      created_at: "2026-07-25 16:45",
    },
  ]);

  const [selectedSchoolDoc, setSelectedSchoolDoc] = useState<SchoolTenant | null>(null);

  // Actions
  const handleApproveSchool = (id: number) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "FULL_VERIFIED" } : s))
    );
  };

  const handleSuspendSchool = (id: number) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "SUSPENDED" } : s))
    );
  };

  const handleUpdateFeedbackStatus = (id: number, newStatus: "Open" | "In Progress" | "Resolved") => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
  };

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.npsn.includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = schools.filter((s) => s.status === "UNVERIFIED" || s.status === "PENDING_VERIFICATION").length;
  const verifiedCount = schools.filter((s) => s.status === "FULL_VERIFIED").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shadow-xs border border-slate-700">
              <KeyRound className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                <span>Cation<span className="text-blue-500">Gate</span> Gatekeeper</span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-400/30 uppercase tracking-wider">
                  Platform Console
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Multi-Tenant Command Portal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Multi-Tenant SLA Uptime 99.99%</span>
            </div>

            <Link href="/">
              <Button size="sm" variant="outline" className="text-xs font-bold border-slate-700 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
                Back to SaaS Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Tenants</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {schools.length} <span className="text-xs text-slate-500 font-medium">Sekolah</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>{verifiedCount} Diverifikasi & Aktif</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Perlu Verifikasi</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pendingCount} <span className="text-xs text-slate-500 font-medium">Sekolah Baru</span>
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              Membutuhkan persetujuan verifikasi
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Estimasi Revenue SaaS</span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rp 184.5M
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              Billed Monthly & Annually
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Feedback & Bugs</span>
              <MessageSquare className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {feedbacks.filter(f => f.status !== "Resolved").length} <span className="text-xs text-slate-500 font-medium">Open</span>
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">
              {feedbacks.filter(f => f.priority === "Urgent").length} Prioritas Tinggi
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-8">
          <button
            onClick={() => setActiveTab("tenants")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "tenants"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Verifikasi & Kelola Sekolah ({schools.length})</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "feedback"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback & Laporan Bug ({feedbacks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "billing"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Langganan & Billing</span>
          </button>

          <button
            onClick={() => setActiveTab("health")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "health"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Health & Node SLA</span>
          </button>
        </div>

        {/* TAB 1: VERIFIKASI & KELOLA SEKOLAH */}
        {activeTab === "tenants" && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  placeholder="Cari sekolah, NPSN, atau slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs rounded-xl bg-slate-50 border-slate-200"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 shrink-0">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Status ({schools.length})</option>
                  <option value="UNVERIFIED">Belum Verifikasi</option>
                  <option value="PENDING_VERIFICATION">Menunggu Verifikasi</option>
                  <option value="FULL_VERIFIED">Diverifikasi & Aktif</option>
                  <option value="SUSPENDED">Dinonaktifkan (Suspended)</option>
                </select>
              </div>
            </div>

            {/* School Tenants Table */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                      <th className="py-4 px-6">Sekolah Tenant</th>
                      <th className="py-4 px-6">NPSN & Dapodik</th>
                      <th className="py-4 px-6">Email Resmi</th>
                      <th className="py-4 px-6">Paket SaaS</th>
                      <th className="py-4 px-6">Status Verifikasi</th>
                      <th className="py-4 px-6 text-right">Aksi Gatekeeper</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredSchools.map((school) => (
                      <tr key={school.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-extrabold text-sm text-slate-900">{school.name}</div>
                          <div className="text-[11px] text-blue-600 font-semibold font-mono">
                            /{school.slug}
                          </div>
                        </td>

                        <td className="py-4 px-6 font-mono">
                          <div>NPSN: <span className="font-bold text-slate-900">{school.npsn}</span></div>
                          <div className="text-[10px] text-slate-400">{school.dapodik_code}</div>
                        </td>

                        <td className="py-4 px-6">
                          {school.official_email}
                        </td>

                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                            school.plan_type === "ENTERPRISE"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : school.plan_type === "PRO"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}>
                            {school.plan_type}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          {school.status === "FULL_VERIFIED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              FULL VERIFIED (AKTIF)
                            </span>
                          )}

                          {school.status === "PENDING_VERIFICATION" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 animate-pulse">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              MENUNGGU DIVERIFIKASI
                            </span>
                          )}

                          {school.status === "UNVERIFIED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                              <Lock className="w-3.5 h-3.5 text-slate-500" />
                              BELUM DIVERIFIKASI (LOCKED)
                            </span>
                          )}

                          {school.status === "SUSPENDED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              SUSPENDED (DINONAKTIFKAN)
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSchoolDoc(school)}
                            className="text-[11px] font-bold border-slate-200 rounded-lg py-1 px-2.5 h-auto"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> Berkas
                          </Button>

                          {school.status !== "FULL_VERIFIED" && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveSchool(school.id)}
                              className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-1 px-3 h-auto"
                            >
                              <Unlock className="w-3.5 h-3.5 mr-1" /> Approve
                            </Button>
                          )}

                          {school.status === "FULL_VERIFIED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuspendSchool(school.id)}
                              className="text-[11px] font-bold border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg py-1 px-2.5 h-auto"
                            >
                              Suspend
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: KELOLA FEEDBACK & LAPORAN BUG */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                        fb.priority === "Urgent"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {fb.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{fb.created_at}</span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                      {fb.school_name}
                    </h3>
                    <div className="text-[11px] font-bold text-blue-600 mb-3">
                      Oleh: {fb.admin_name} • <span className="text-slate-500 font-normal">{fb.category}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                      &quot;{fb.message}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Status: {fb.status}</span>
                    
                    <div className="flex gap-1">
                      {fb.status !== "Resolved" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateFeedbackStatus(fb.id, "Resolved")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1 px-2.5 h-auto rounded-lg"
                        >
                          Tandai Selesai
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LANGGANAN & BILLING */}
        {activeTab === "billing" && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Manajemen Paket SaaS & Billing</h3>
            <p className="text-xs text-slate-600">
              Pantau siklus tagihan sekolah, perpanjang trial 30 hari, dan sinkronkan Midtrans webhook log.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
              [SYSTEM OK] Midtrans Webhook Callback Active • Auto-Renew Active for Pro Institution Plan
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM HEALTH & NODE SLA */}
        {activeTab === "health" && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Multi-Tenant System Node Status</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                ✓ PostgreSQL Isolated Database: 100% HEALTHY
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                ✓ HTTP Real-Time Polling Engine: 100% HEALTHY
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                ✓ Dapodik Export API: 100% HEALTHY
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Document View Modal */}
      {selectedSchoolDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                Berkas Verifikasi: {selectedSchoolDoc.name}
              </h3>
              <button
                onClick={() => setSelectedSchoolDoc(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div><span className="font-bold">NPSN Resmi:</span> {selectedSchoolDoc.npsn}</div>
                <div><span className="font-bold">Kode Dapodik:</span> {selectedSchoolDoc.dapodik_code}</div>
                <div><span className="font-bold">Email Instansi:</span> {selectedSchoolDoc.official_email}</div>
                <div><span className="font-bold">Domain/Slug:</span> cationgate.id/{selectedSchoolDoc.slug}</div>
              </div>

              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 font-medium">
                📄 SK Izin Operasional Kemendikbudristek: <span className="font-bold">VERIFIED_SK_2026.pdf</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSchoolDoc(null)}
                className="text-xs font-bold border-slate-200 rounded-xl"
              >
                Tutup
              </Button>
              {selectedSchoolDoc.status !== "FULL_VERIFIED" && (
                <Button
                  size="sm"
                  onClick={() => {
                    handleApproveSchool(selectedSchoolDoc.id);
                    setSelectedSchoolDoc(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  Approve Verification Now
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
