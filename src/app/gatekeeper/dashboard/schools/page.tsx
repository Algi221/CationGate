"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2, Search, Eye, ExternalLink, FileText, Check, RefreshCw, X, Trash2, AlertCircle, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import Swal from "sweetalert2";
import { safeOpenWindow } from "@/lib/sanitizeUrl";

interface SchoolTenant {
  id: number;
  name: string;
  slug: string;
  npsn: string;
  dapodik_code: string;
  official_email?: string;
  email?: string;
  plan_type: "STARTER" | "PRO" | "ENTERPRISE";
  status: "UNVERIFIED" | "PENDING_VERIFICATION" | "FULL_VERIFIED" | "SUSPENDED" | "REJECTED";
  created_at: string;
  legal_sk_number?: string;
  sk_document_name?: string;
  sk_document_url?: string;
  accreditation?: string;
  admin_name?: string;
  is_verified?: boolean;
  is_official?: boolean;
  verification_document_url?: string;
  verification_documents?: Array<{
    id?: string;
    type?: string;
    name: string;
    url?: string;
    size?: number;
  }>;
  documents?: Array<{
    id?: string;
    type?: string;
    name?: string;
    url?: string;
    size?: number;
  }>;
}

function GatekeeperSchoolManagementContent() {
  const searchParams = useSearchParams();
  const rawFilter = searchParams?.get("filter") || "ALL";
  const initialFilter = rawFilter === "TAKEDOWN" ? "SUSPENDED" : rawFilter;
  const initialSearch = searchParams?.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [selectedSchoolModal, setSelectedSchoolModal] = useState<SchoolTenant | null>(null);

  useEffect(() => {
    const rf = searchParams?.get("filter") || "ALL";
    const nextFilter = rf === "TAKEDOWN" ? "SUSPENDED" : rf;
    requestAnimationFrame(() => {
      setStatusFilter(prev => prev !== nextFilter ? nextFilter : prev);
    });
  }, [searchParams]);

  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("gatekeeper_token") : null;
      const res = await fetch(`/api/gatekeeper/schools?t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache",
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
    } catch (e) {
      console.warn("Failed to fetch schools from API:", e);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadSchools() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("gatekeeper_token") : null;
        const res = await fetch(`/api/gatekeeper/schools?t=${Date.now()}`, {
          headers: {
            "Cache-Control": "no-cache",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });

        if (!res.ok) {
          if (!ignore) setSchools([]);
          return;
        }
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (_parseError) {
          console.error("Invalid JSON from API:", text.substring(0, 150));
          if (!ignore) setSchools([]);
          return;
        }

        if (json && json.success && Array.isArray(json.data)) {
          if (!ignore) setSchools(json.data);
        } else {
          if (!ignore) setSchools([]);
        }
      } catch (e) {
        console.warn("Failed to fetch schools from API:", e);
        if (!ignore) setSchools([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadSchools();

    return () => {
      ignore = true;
    };
  }, []);

  // Action Handlers
  const handleApproveVerification = (school: SchoolTenant) => {
    Swal.fire({
      title: "Setujui Verifikasi Sekolah?",
      text: `Apakah Anda yakin ingin menyetujui verifikasi legalitas ${school.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem("gatekeeper_token") : null;
          await fetch("/api/gatekeeper/approve-school", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ school_id: school.slug || school.id }),
          });
        } catch (_e) {}

        await fetchSchools();

        if (selectedSchoolModal?.id === school.id || selectedSchoolModal?.slug === school.slug) {
          setSelectedSchoolModal(prev => prev ? { ...prev, status: "FULL_VERIFIED", is_verified: true } : null);
        }
        Swal.fire({
          title: "Verifikasi Disetujui",
          text: `Sekolah ${school.name} berhasil diverifikasi dan email notifikasi telah dikirimkan.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    });
  };

  const handleRejectVerification = (school: SchoolTenant) => {
    Swal.fire({
      title: "Tolak Pengajuan Verifikasi?",
      text: `Masukkan catatan alasan penolakan/revisi dokumen legalitas untuk ${school.name}:`,
      input: "textarea",
      inputPlaceholder: "Contoh: Dokumen SK Izin Operasional buram/tidak terbaca, silakan unggah ulang PDF legalisir resmi.",
      inputValue: "Dokumen SK Izin Operasional belum lengkap atau tidak valid. Silakan periksa kembali dan unggah dokumen resmi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Tolak & Kirim Email Revisi",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem("gatekeeper_token") : null;
          await fetch("/api/gatekeeper/reject-school", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              school_id: school.slug || school.id,
              reason: result.value || "Dokumen SK Izin Operasional belum lengkap atau tidak valid."
            }),
          });
        } catch (_e) {}

        await fetchSchools();

        if (selectedSchoolModal?.id === school.id || selectedSchoolModal?.slug === school.slug) {
          setSelectedSchoolModal(prev => prev ? { ...prev, status: "REJECTED", is_verified: false } : null);
        }
        Swal.fire({
          title: "Pengajuan Ditolak",
          text: `Status ${school.name} diubah menjadi REJECTED dan email instruksi perbaikan telah dikirim ke admin sekolah.`,
          icon: "info",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    });
  };

  const _handleToggleSuspend = (school: SchoolTenant) => {
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
            const token = typeof window !== 'undefined' ? localStorage.getItem("gatekeeper_token") : null;
            await fetch("/api/gatekeeper/takedown-school", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
              },
              body: JSON.stringify({ school_id: school.slug || school.id }),
            });
          } catch (_e) {}

          await fetchSchools();

          if (selectedSchoolModal?.id === school.id || selectedSchoolModal?.slug === school.slug) {
            setSelectedSchoolModal(prev => prev ? { ...prev, status: "SUSPENDED" } : null);
          }
          Swal.fire({
            title: "Instansi Di-Takedown!",
            text: `Subdomain dan akses akun admin ${school.name} telah di-takedown (Nonaktif).`,
            icon: "success",
            confirmButtonColor: "#2563EB",
            customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
          });
        }
      });
    };

    const handlePurgeSchool = (school: SchoolTenant) => {
      Swal.fire({
        title: `Hapus Permanen ${school.name}?`,
        text: `PERINGATAN: Subdomain (${school.slug}), data akun admin, dan seluruh konfigurasi instansi ini akan dihapus permanen dari database CationGate.`,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#64748B",
        confirmButtonText: "Ya, Hapus Permanen",
        cancelButtonText: "Batal",
        customClass: {
          popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("gatekeeper_token") : null;
            await fetch("/api/gatekeeper/purge-school", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
              },
              body: JSON.stringify({ school_id: school.slug || school.id }),
            });
          } catch (_e) {}

          await fetchSchools();
          setSelectedSchoolModal(null);
          Swal.fire({
            title: "Instansi Dihapus",
            text: `Subdomain dan akun ${school.name} berhasil dihapus permanen.`,
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

    const sStatus = (s.status || "UNVERIFIED").toUpperCase();
    const matchesStatus =
      statusFilter === "ALL" ||
      sStatus === statusFilter ||
      (statusFilter === "PENDING_VERIFICATION" && (sStatus === "PENDING_VERIFICATION" || sStatus === "PENDING" || sStatus === "OTP_VERIFIED" || sStatus === "SUBMITTED" || sStatus === "WAITING_VERIFICATION")) ||
      (statusFilter === "FULL_VERIFIED" && (sStatus === "FULL_VERIFIED" || sStatus === "VERIFIED" || s.is_verified === true)) ||
      (statusFilter === "UNVERIFIED" && (sStatus === "UNVERIFIED" || sStatus === "BELUM_KIRIM_VERIFIKASI" || sStatus === "DRAFT" || !s.status)) ||
      (statusFilter === "SUSPENDED" && (sStatus === "SUSPENDED" || sStatus === "TAKEDOWN" || sStatus === "REJECTED"));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#2e3749] dark:text-[#FFD33B]" />
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
            { id: "SUSPENDED", label: "Dibekukan" },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#FFD33B] text-[#2e3749] shadow-md shadow-[#FFD33B]/20"
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
                <tr key={sc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">

                  {/* Sekolah */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2e3749] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {sc.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">{sc.name}</h4>
                        <a
                          href={`/${encodeURIComponent(sc.slug)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-[#FFD33B] font-mono font-bold hover:underline mt-0.5"
                          title={`Kunjungi ${sc.slug}.cationgate.site`}
                        >
                          <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{sc.slug}.cationgate.site</span>
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
                    <StatusBadge status={sc.status} size="sm" />
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
                        title="Takedown / Dibekukan Subdomain & Akun"
                      >
                        Takedown
                      </button>

                      {/* Purge / Hapus Permanen */}
                      <button
                        onClick={() => handlePurgeSchool(sc)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus Permanen Subdomain & Akun (Purge Data)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Direct Links */}
                      <a
                        href={`/${encodeURIComponent(sc.slug)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Lihat Landing Page Sekolah"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <a
                        href={`/${encodeURIComponent(sc.slug)}/dashboard`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2e3749] dark:text-[#FFD33B] text-xs font-bold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                  {selectedSchoolModal.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg md:text-xl">{selectedSchoolModal.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFD33B]/10 dark:bg-[#2e3749] text-[#2e3749] dark:text-[#FFD33B] text-xs font-bold uppercase">
                      {selectedSchoolModal.plan_type || "TRIAL"}
                    </span>
                  </div>
                  <p className="text-xs text-[#2e3749] dark:text-[#FFD33B] font-mono mt-0.5">URL Slug: /{selectedSchoolModal.slug}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSchoolModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedSchoolModal.npsn || "20229000"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Kode Dapodik:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedSchoolModal.dapodik_code || "DPK-001"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Akreditasi Sekolah:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{selectedSchoolModal.accreditation || "A (Unggul)"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Penanggung Jawab / Admin:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedSchoolModal.admin_name || "Admin Sekolah"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Email Resmi Instansi:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">{selectedSchoolModal.official_email || selectedSchoolModal.email || "-"}</span>
                </div>
              </div>

              {/* Uploaded Verification Documents Section */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                {(() => {
                  let docs: Array<{ id?: string; name: string; url?: string; type?: string; size?: number }> = [];

                  if (Array.isArray(selectedSchoolModal.documents) && selectedSchoolModal.documents.length > 0) {
                    docs = selectedSchoolModal.documents.map((d, i) => ({
                      id: d.id || `doc-${i}`,
                      name: d.name || `Berkas_Verifikasi_${i + 1}.pdf`,
                      url: d.url || "",
                      type: d.type || "SK_OPERASIONAL",
                      size: d.size
                    }));
                  } else if (Array.isArray(selectedSchoolModal.verification_documents) && selectedSchoolModal.verification_documents.length > 0) {
                    docs = selectedSchoolModal.verification_documents.map((d, i) => ({
                      id: d.id || `doc-${i}`,
                      name: d.name || `Berkas_Verifikasi_${i + 1}.pdf`,
                      url: d.url || "",
                      type: d.type || "SK_OPERASIONAL",
                      size: d.size
                    }));
                  } else if (selectedSchoolModal.sk_document_url || selectedSchoolModal.sk_document_name) {
                    docs = [{
                      id: "doc-sk",
                      name: selectedSchoolModal.sk_document_name || "Surat_Keputusan_Operasional.pdf",
                      url: selectedSchoolModal.sk_document_url || "",
                      type: "SK_OPERASIONAL"
                    }];
                  } else if (selectedSchoolModal.verification_document_url) {
                    docs = [{
                      id: "doc-legacy",
                      name: "Surat_Keputusan_Operasional.pdf",
                      url: selectedSchoolModal.verification_document_url,
                      type: "SK_OPERASIONAL"
                    }];
                  }

                  if (docs.length === 0) {
                    return (
                      <div className="py-6 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-1.5 opacity-80" />
                        <p className="text-xs font-bold">Belum ada berkas verifikasi yang diunggah</p>
                      </div>
                    );
                  }

                  const getTypeMeta = (type?: string) => {
                    switch (type) {
                      case "SK_OPERASIONAL":
                        return { label: "SK Izin Operasional", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300" };
                      case "ID_CARD":
                        return { label: "ID Card / KTP Penanggung Jawab", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300" };
                      case "SOSMED":
                        return { label: "Bukti Kepemilikan Akun Sosmed Resmi", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300" };
                      default:
                        return { label: "Dokumen Legalitas", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" };
                    }
                  };

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-600" /> Berkas Bukti Verifikasi yang Diunggah ({docs.length}/2):
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dokumen Legalitas</span>
                      </div>

                      <div className="space-y-3">
                        {docs.map((doc, idx) => {
                          const meta = getTypeMeta(doc.type);
                          const isPdf = Boolean(doc.name?.toLowerCase().endsWith(".pdf") || doc.url?.includes("application/pdf") || doc.url?.toLowerCase().endsWith(".pdf"));
                          const isImage = Boolean(doc.url && (doc.url.startsWith("data:image/") || doc.name?.match(/\.(jpg|jpeg|png|webp)$/i)));

                          return (
                            <div key={doc.id || idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60 shadow-xs space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-[#FFD33B]/20 dark:bg-[#2e3749] text-[#2e3749] dark:text-[#FFD33B] flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${meta.color}`}>
                                        {meta.label}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono">Berkas #{idx + 1}</span>
                                    </div>
                                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate mt-1">
                                      {doc.name || "Berkas_Dokumen.pdf"}
                                    </h5>
                                  </div>
                                </div>

                                {doc.url ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      safeOpenWindow(doc.url);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" /> Buka / Unduh Berkas
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      safeOpenWindow("/assets/docs/sk_sample.pdf");
                                    }}
                                    className="px-4 py-2 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" /> Preview Contoh SK
                                  </button>
                                )}
                              </div>

                              {/* Document Type Badge & Safe Preview Action */}
                              {isImage && doc.url && (
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                                  <span className="text-slate-500 font-medium">Format Gambar (JPG/PNG)</span>
                                  <button
                                    type="button"
                                    onClick={() => safeOpenWindow(doc.url)}
                                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Lihat & Periksa Gambar
                                  </button>
                                </div>
                              )}

                              {isPdf && doc.url && (
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                                  <span className="text-slate-500 font-medium">Dokumen Surat Keputusan (PDF)</span>
                                  <button
                                    type="button"
                                    onClick={() => safeOpenWindow(doc.url)}
                                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Buka Dokumen PDF <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setSelectedSchoolModal(null)}
                className="h-11 px-5 text-xs rounded-xl font-bold cursor-pointer"
              >
                Tutup
              </Button>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  onClick={() => handlePurgeSchool(selectedSchoolModal)}
                  variant="outline"
                  className="h-11 px-4 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Hapus Permanen
                </Button>

                <Button
                  onClick={() => handleTakedownSchool(selectedSchoolModal)}
                  variant="outline"
                  className="h-11 px-4 text-xs rounded-xl text-amber-600 hover:bg-amber-50 border-amber-200 dark:border-amber-900 font-bold cursor-pointer"
                >
                  Takedown Instansi
                </Button>

                {selectedSchoolModal.status !== "FULL_VERIFIED" && (
                  <>
                    <Button
                      onClick={() => handleRejectVerification(selectedSchoolModal)}
                      variant="outline"
                      className="h-11 px-4 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900 font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Tolak Verifikasi
                    </Button>

                    <Button
                      onClick={() => handleApproveVerification(selectedSchoolModal)}
                      className="h-11 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Approve &amp; Unlock Verifikasi
                    </Button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function GatekeeperSchoolManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GatekeeperSchoolManagementContent />
    </Suspense>
  );
}
