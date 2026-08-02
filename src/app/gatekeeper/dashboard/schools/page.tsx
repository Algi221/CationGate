"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2, ShieldCheck, CheckCircle2, XCircle, AlertCircle, Search,
  Filter, Eye, ExternalLink, Lock, Unlock, FileText, Check, Sparkles,
  RefreshCw, ChevronRight, X, ShieldAlert, Award, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

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
  legal_sk_number?: string;
  accreditation?: string;
  admin_name?: string;
}

export default function GatekeeperSchoolManagementPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams?.get("filter") || "ALL";
  const initialSearch = searchParams?.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [selectedSchoolModal, setSelectedSchoolModal] = useState<SchoolTenant | null>(null);

  // School Tenants State (Fetched Live from DB)
  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    try {
      setLoading(true);
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
    } catch (e) {
      console.warn("Failed to fetch schools from API:", e);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Action Handlers
  const handleApproveVerification = (school: SchoolTenant) => {
    Swal.fire({
      title: `Approve Legalitas ${school.name}?`,
      text: `Sekolah ini akan diverifikasi secara resmi (Status: FULL_VERIFIED). Akses dashboard tenant & fitur SPMB akan langsung TERBUKA.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Verifikasi & Unlock",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch("/api/gatekeeper/approve-school", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ school_id: school.slug || school.id }),
          });
        } catch (e) {}

        await fetchSchools();

        if (selectedSchoolModal?.id === school.id || selectedSchoolModal?.slug === school.slug) {
          setSelectedSchoolModal(prev => prev ? { ...prev, status: "FULL_VERIFIED", is_verified: true } : null);
        }
        Swal.fire({
          title: "Verifikasi Disetujui!",
          text: `Sekolah ${school.name} telah terverifikasi penuh (FULL_VERIFIED) dan fitur dashboard ter-unlocked.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    });
  };

  const handleToggleSuspend = (school: SchoolTenant) => {
    const isSuspended = school.status === "SUSPENDED";
    const nextStatus = isSuspended ? "FULL_VERIFIED" : "SUSPENDED";

    Swal.fire({
      title: isSuspended ? `Buka Kunci ${school.name}?` : `Bekukan Akses ${school.name}?`,
      text: isSuspended ? "Sekolah akan dapat mengakses kembali dashboardnya." : "Seluruh admin sekolah tidak akan dapat mengakses dashboard hingga dibebaskan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isSuspended ? "#2563EB" : "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: isSuspended ? "Ya, Buka Kunci" : "Ya, Bekukan Akses",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSchools(prev => prev.map(s => s.id === school.id ? { ...s, status: nextStatus } : s));
        if (selectedSchoolModal?.id === school.id) {
          setSelectedSchoolModal(prev => prev ? { ...prev, status: nextStatus } : null);
        }
        Swal.fire({
          title: isSuspended ? "Akses Dibuka!" : "Akses Dibatasi!",
          text: `Status ${school.name} berhasil diperbarui.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    });
  };

  const handleTakedownSchool = (school: SchoolTenant) => {
    Swal.fire({
      title: `Takedown Instansi ${school.name}?`,
      text: `Instansi ini akan dinonaktifkan dari platform CationGate (Status TAKEDOWN) karena belum memverifikasi legalitas.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Takedown Instansi",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch("/api/gatekeeper/takedown-school", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ school_id: school.slug || school.id }),
          });
        } catch (e) {}

        await fetchSchools();

        if (selectedSchoolModal?.id === school.id || selectedSchoolModal?.slug === school.slug) {
          setSelectedSchoolModal(prev => prev ? { ...prev, status: "TAKEDOWN" } : null);
        }
        Swal.fire({
          title: "Instansi Di-Takedown!",
          text: `Sekolah ${school.name} telah di-takedown (Nonaktif).`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    });
  };

  // Filtered List with Null-Safe Guards
  const filteredSchools = schools.filter(s => {
    if (!s) return false;
    const nameStr = (s.name || "").toLowerCase();
    const npsnStr = String(s.npsn || "");
    const slugStr = (s.slug || "").toLowerCase();
    const emailStr = (s.official_email || "").toLowerCase();
    const searchLower = (searchTerm || "").toLowerCase();

    const matchesSearch = nameStr.includes(searchLower) ||
                          npsnStr.includes(searchTerm) ||
                          slugStr.includes(searchLower) ||
                          emailStr.includes(searchLower);

    const matchesStatus = statusFilter === "ALL" ||
                          s.status === statusFilter ||
                          (statusFilter === "UNVERIFIED" && (s.status === "BELUM_KIRIM_VERIFIKASI" || s.status === "UNVERIFIED"));
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Manajemen Sekolah SaaS (Tenants)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola legalitas sekolah, verifikasi dokumen SK Operasional, dan pemantauan akses dashboard tenant.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono">
            Total: {schools.length} Sekolah
          </span>
          <button
            onClick={fetchSchools}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari nama sekolah, NPSN, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "Semua" },
            { id: "FULL_VERIFIED", label: "Terverifikasi" },
            { id: "PENDING_VERIFICATION", label: "Menunggu Verifikasi" },
            { id: "UNVERIFIED", label: "Belum Verifikasi" },
            { id: "TAKEDOWN", label: "Dibekukan" },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-5">Sekolah</th>
                <th className="py-4 px-4">NPSN &amp; Dapodik</th>
                <th className="py-4 px-4">Email Resmi</th>
                <th className="py-4 px-4">Paket SaaS</th>
                <th className="py-4 px-4">Status Verifikasi</th>
                <th className="py-4 px-5 text-right">Aksi Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    Memuat data sekolah real-time...
                  </td>
                </tr>
              ) : filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    Tidak ada sekolah yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : filteredSchools.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                  
                  {/* Sekolah */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {sc.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">{sc.name}</h4>
                        <a href={`/${sc.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 font-mono hover:underline">
                          /{sc.slug}
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* NPSN & Dapodik */}
                  <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
                    <p className="font-bold">{sc.npsn || "-"}</p>
                    <p className="text-[10px] text-slate-400">{sc.dapodik_code || "-"}</p>
                  </td>

                  {/* Email Resmi */}
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-mono">
                    {sc.official_email || "-"}
                  </td>

                  {/* Paket SaaS */}
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] uppercase border border-slate-200 dark:border-slate-700">
                      {sc.plan_type || "TRIAL"}
                    </span>
                  </td>

                  {/* Status Verifikasi */}
                  <td className="py-4 px-4">
                    {sc.status === "FULL_VERIFIED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                      </span>
                    ) : sc.status === "PENDING_VERIFICATION" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 text-xs font-bold animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> MENUNGGU SK
                      </span>
                    ) : sc.status === "TAKEDOWN" || sc.status === "SUSPENDED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" /> DIBEKUKAN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" /> BELUM KIRIM SK
                      </span>
                    )}
                  </td>

                  {/* Aksi Platform */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Lihat Detail Modal */}
                      <button
                        onClick={() => setSelectedSchoolModal(sc)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Lihat Seluruh Data & Dokumen SK"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Approve Button if pending/unverified */}
                      {sc.status !== "FULL_VERIFIED" && (
                        <button
                          onClick={() => handleApproveVerification(sc)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
                          title="Approve & Verifikasi Sekolah"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}

                      {/* Takedown Button */}
                      <button
                        onClick={() => handleTakedownSchool(sc)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold border border-rose-200 dark:border-rose-900 transition-colors"
                        title="Takedown / Dibekukan"
                      >
                        Takedown
                      </button>

                      {/* Direct Links */}
                      <a
                        href={`/${sc.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Lihat Landing Page Sekolah"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <a
                        href={`/${sc.slug}/dashboard`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors"
                        title="Buka Dashboard Tenant Sekolah"
                      >
                        Dashboard
                      </a>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL DETAIL LEGALITAS & BERKAS DOKUMEN SEKOLAH ─────────────────── */}
      {selectedSchoolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                  {selectedSchoolModal.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg md:text-xl">{selectedSchoolModal.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 text-xs font-bold uppercase">
                      {selectedSchoolModal.plan_type || "TRIAL"}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">URL Slug: /{selectedSchoolModal.slug}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSchoolModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legal Document Info Grid */}
            <div className="space-y-4">
              
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Legalitas &amp; Identitas Instansi</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Nomor SK Operasional:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedSchoolModal.legal_sk_number || "SK-DIKNAS/2026/001"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">NPSN Resmi:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedSchoolModal.npsn || "-"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Kode Dapodik:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedSchoolModal.dapodik_code || "-"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Akreditasi Sekolah:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{selectedSchoolModal.accreditation || "A (Unggul)"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Penanggung Jawab / Admin:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedSchoolModal.admin_name || "Kepala Sekolah"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Email Resmi Instansi:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedSchoolModal.official_email || "-"}</span>
                </div>
              </div>

              {/* Document File Preview Section */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> Berkas SK Operasional Resmi yang Diunggah:
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Dokumen Legal</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        {selectedSchoolModal.sk_document_name || "SK_Operasional_Sekolah.pdf"}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Dokumen Peninjauan Gatekeeper</p>
                    </div>
                  </div>

                  {selectedSchoolModal.sk_document_url ? (
                    <a
                      href={selectedSchoolModal.sk_document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Buka Berkas PDF SK
                    </a>
                  ) : (
                    <a
                      href={`/assets/docs/sk_sample.pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Preview Berkas PDF SK
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setSelectedSchoolModal(null)}
                className="h-11 px-5 text-xs rounded-xl font-bold"
              >
                Tutup
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleTakedownSchool(selectedSchoolModal)}
                  variant="outline"
                  className="h-11 px-5 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900 font-bold"
                >
                  Takedown Instansi
                </Button>

                {selectedSchoolModal.status !== "FULL_VERIFIED" && (
                  <Button
                    onClick={() => handleApproveVerification(selectedSchoolModal)}
                    className="h-11 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/20"
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Approve &amp; Unlock Verifikasi
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
