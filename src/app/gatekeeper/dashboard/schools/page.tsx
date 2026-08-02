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
      title: `Setujui Verifikasi ${school.name}?`,
      text: `Status sekolah akan diubah menjadi FULL_VERIFIED dan seluruh fitur dashboard sekolah akan langsung terbuka (UNLOCKED).`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Setujui Verifikasi",
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
            body: JSON.stringify({ school_id: school.id }),
          });
        } catch (e) {}

        setSchools(prev => prev.map(s => s.id === school.id ? { ...s, status: "FULL_VERIFIED" } : s));
        if (selectedSchoolModal?.id === school.id) {
          setSelectedSchoolModal(prev => prev ? { ...prev, status: "FULL_VERIFIED" } : null);
        }
        Swal.fire({
          title: "Verifikasi Disetujui!",
          text: `Sekolah ${school.name} telah terverifikasi penuh dan fitur ter-unlocked.`,
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
      title: isSuspended ? `Buka Kunci (Un-suspend) ${school.name}?` : `Bekukan Akses (Suspend) ${school.name}?`,
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
    }).then((result) => {
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
            body: JSON.stringify({ school_id: school.id }),
          });
        } catch (e) {}

        setSchools(prev => prev.map(s => s.id === school.id ? { ...s, status: "SUSPENDED" } : s));
        if (selectedSchoolModal?.id === school.id) {
          setSelectedSchoolModal(prev => prev ? { ...prev, status: "SUSPENDED" } : null);
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

  const getDaysRegistered = (createdAtStr?: string) => {
    if (!createdAtStr) return 0;
    const created = new Date(createdAtStr).getTime();
    if (isNaN(created)) return 0;
    return Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Total: {filteredSchools.length} Sekolah
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            type="text"
            placeholder="Cari nama sekolah, NPSN, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { label: "Semua", value: "ALL" },
            { label: "Terverifikasi", value: "FULL_VERIFIED" },
            { label: "Menunggu Verifikasi", value: "PENDING_VERIFICATION" },
            { label: "Belum Verifikasi", value: "UNVERIFIED" },
            { label: "Dibekukan", value: "SUSPENDED" },
          ].map((fl) => (
            <button
              key={fl.value}
              onClick={() => setStatusFilter(fl.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === fl.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {fl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800 select-none">
              <tr>
                <th className="py-3.5 px-4">Sekolah</th>
                <th className="py-3.5 px-4">NPSN & Dapodik</th>
                <th className="py-3.5 px-4">Email Resmi</th>
                <th className="py-3.5 px-4">Paket SaaS</th>
                <th className="py-3.5 px-4">Status Verifikasi</th>
                <th className="py-3.5 px-4 text-center">Aksi Platform</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSchools.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                  
                  {/* School Identity */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {sc.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm leading-none">{sc.name}</p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-1">/{sc.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* NPSN & Dapodik */}
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                    <p className="font-bold">{sc.npsn}</p>
                    <p className="text-[10px] text-slate-400">{sc.dapodik_code}</p>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {sc.official_email}
                  </td>

                  {/* Plan Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      sc.plan_type === "ENTERPRISE"
                        ? "bg-purple-50 dark:bg-purple-950/60 text-purple-600 border-purple-200 dark:border-purple-900"
                        : sc.plan_type === "PRO"
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 border-blue-200 dark:border-blue-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                    }`}>
                      {sc.plan_type}
                    </span>
                  </td>

                  {/* Status Badge & Registration Age */}
                  <td className="py-3.5 px-4 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {sc.status === "FULL_VERIFIED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      )}
                      {sc.status === "PENDING_VERIFICATION" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                          <AlertCircle className="w-3 h-3 animate-pulse" /> PENDING SK
                        </span>
                      )}
                      {(sc.status === "UNVERIFIED" || (sc.status as string) === "BELUM_KIRIM_VERIFIKASI") && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                          <Clock className="w-3 h-3" /> BELUM KIRIM SK
                        </span>
                      )}
                      {(sc.status === "SUSPENDED" || (sc.status as string) === "TAKEDOWN") && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                          <XCircle className="w-3 h-3" /> TAKEDOWN
                        </span>
                      )}
                    </div>
                    {(sc.status === "UNVERIFIED" || (sc.status as string) === "BELUM_KIRIM_VERIFIKASI") && getDaysRegistered(sc.created_at) >= 3 && (
                      <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900/50 w-fit">
                        <ShieldAlert className="w-3 h-3 shrink-0" /> Belum Verifikasi &gt;3 Hari (Perlu Takedown)
                      </p>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      
                      {/* Detail Legalitas Modal */}
                      <button
                        onClick={() => setSelectedSchoolModal(sc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                        title="Tinjau SK & Detail Legalitas"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* 1-Click Approve */}
                      {sc.status !== "FULL_VERIFIED" && (
                        <button
                          onClick={() => handleApproveVerification(sc)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                          title="Setujui Verifikasi Legalitas"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                      )}

                      {/* Takedown Button */}
                      {sc.status !== "FULL_VERIFIED" && sc.status !== "SUSPENDED" && (sc.status as string) !== "TAKEDOWN" && (
                        <button
                          onClick={() => handleTakedownSchool(sc)}
                          className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 text-[11px] font-bold transition-all flex items-center gap-1"
                          title="Takedown Instansi (Tidak Verifikasi > 3 Hari)"
                        >
                          <XCircle className="w-3 h-3" /> Takedown
                        </button>
                      )}

                      {/* Suspend / Unsuspend */}
                      <button
                        onClick={() => handleToggleSuspend(sc)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          sc.status === "SUSPENDED"
                            ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                            : "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                        }`}
                        title={sc.status === "SUSPENDED" ? "Buka Akses Dashboard" : "Bekukan Akses Dashboard"}
                      >
                        {sc.status === "SUSPENDED" ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>

                      {/* External Direct Links */}
                      <a
                        href={`/${sc.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Lihat Landing Page Sekolah"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <a
                        href={`/${sc.slug}/dashboard`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors"
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

      {/* Modal Detail Legalitas Sekolah */}
      {selectedSchoolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {selectedSchoolModal.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{selectedSchoolModal.name}</h3>
                  <p className="text-xs text-blue-600 font-mono">/{selectedSchoolModal.slug}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSchoolModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legal Document Info */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor SK Operasional:</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedSchoolModal.legal_sk_number || "SK-DIKNAS/2026/001"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NPSN Resmi:</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedSchoolModal.npsn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kode Dapodik:</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedSchoolModal.dapodik_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Akreditasi:</span>
                  <span className="font-bold text-emerald-600">{selectedSchoolModal.accreditation || "A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Penanggung Jawab:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSchoolModal.admin_name || "Kepala Sekolah"}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-blue-900 dark:text-blue-200 leading-relaxed">
                <p className="font-bold flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Status Verifikasi Gatekeeper:
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  {selectedSchoolModal.status === "FULL_VERIFIED"
                    ? "Sekolah ini telah diperiksa legalitasnya dan memiliki akses penuh (UNLOCKED)."
                    : "Sekolah ini dalam antrean verifikasi legalitas. Klik tombol di bawah untuk menyetujui akses."}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setSelectedSchoolModal(null)}
                className="h-9 px-4 text-xs rounded-xl"
              >
                Tutup
              </Button>

              {selectedSchoolModal.status !== "FULL_VERIFIED" && (
                <Button
                  onClick={() => handleApproveVerification(selectedSchoolModal)}
                  className="h-9 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  <Check className="w-4 h-4 mr-1" /> Approve Verifikasi
                </Button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
