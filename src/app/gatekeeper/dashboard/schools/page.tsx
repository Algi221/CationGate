"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { SchoolTenant, SchoolDetailsModal } from "./components/SchoolDetailsModal";
import { SchoolTenantRow } from "./components/SchoolTenantRow";
import { GatekeeperDocPreviewModal } from "./components/GatekeeperDocPreviewModal";

const getSchoolSubdomainUrl = (slug: string, path: string = "") => {
  if (typeof window !== "undefined") {
    const host = window.location.host.toLowerCase();
    const isLocalhost = host.includes("localhost");
    const port = window.location.port ? `:${window.location.port}` : "";
    const cleanPath = path.startsWith("/") ? path : (path ? `/${path}` : "");
    if (isLocalhost) {
      return `http://${slug}.localhost${port}${cleanPath}`;
    }
    return `https://${slug}.cationgate.site${cleanPath}`;
  }
  return `https://${slug}.cationgate.site${path ? `/${path}` : ""}`;
};

function GatekeeperSchoolManagementContent() {
  const searchParams = useSearchParams();
  const rawFilter = searchParams?.get("filter") || "ALL";
  const initialFilter = rawFilter === "TAKEDOWN" ? "SUSPENDED" : rawFilter;
  const initialSearch = searchParams?.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [selectedSchoolModal, setSelectedSchoolModal] = useState<SchoolTenant | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string; type?: string } | null>(null);
  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rf = searchParams?.get("filter") || "ALL";
    const nextFilter = rf === "TAKEDOWN" ? "SUSPENDED" : rf;
    requestAnimationFrame(() => {
      setStatusFilter(prev => prev !== nextFilter ? nextFilter : prev);
    });
  }, [searchParams]);

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
        setSchools([]);
        return;
      }

      if (json && json.success && Array.isArray(json.data)) {
        setSchools(json.data);
      } else {
        setSchools([]);
      }
    } catch (_e) {
      setSchools([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

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
          title: "Berhasil!",
          text: `Status ${school.name} kini telah aktif dan terverifikasi resmi.`,
          icon: "success",
          confirmButtonColor: "#10B981",
          customClass: {
            popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
          }
        });
      }
    });
  };

  const handleRejectVerification = (school: SchoolTenant) => {
    Swal.fire({
      title: "Tolak Pengajuan Verifikasi?",
      text: `Apakah Anda yakin ingin menolak berkas pendaftaran ${school.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F43F5E",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Tolak",
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
            body: JSON.stringify({ school_id: school.slug || school.id }),
          });
        } catch (_e) {}

        await fetchSchools();

        if (selectedSchoolModal?.id === school.id || selectedSchoolModal?.slug === school.slug) {
          setSelectedSchoolModal(prev => prev ? { ...prev, status: "REJECTED" } : null);
        }

        Swal.fire({
          title: "Ditolak",
          text: `Pengajuan verifikasi ${school.name} telah ditolak.`,
          icon: "info",
          confirmButtonColor: "#2563EB",
          customClass: {
            popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
          }
        });
      }
    });
  };

  const handleTakedownSchool = (school: SchoolTenant) => {
    Swal.fire({
      title: "Takedown Instansi Sekolah?",
      text: `Apakah Anda yakin ingin men-takedown ${school.name}? Seluruh akses publik dan login panitia akan dibekukan sementara.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F43F5E",
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
          title: "Instansi Dibekukan",
          text: `Subdomain ${school.slug}.cationgate.site telah berhasil di-takedown.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: {
            popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
          }
        });
      }
    });
  };

  const handlePurgeSchool = (school: SchoolTenant) => {
    Swal.fire({
      title: "Hapus Permanen Instansi (Purge)?",
      text: `Tindakan ini TIDAK DAPAT DIBATALKAN. Seluruh database, akun admin, pendaftar, dan konfigurasi ${school.name} (/${school.slug}) akan dimusnahkan secara permanen.`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Hapus Permanen Sekarang",
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

        if (selectedSchoolModal?.id === school.id || selectedSchoolModal?.slug === school.slug) {
          setSelectedSchoolModal(null);
        }

        await fetchSchools();

        Swal.fire({
          title: "Instansi Dimusnahkan",
          text: `Seluruh data instansi ${school.name} telah dihapus permanen dari sistem.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: {
            popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
          }
        });
      }
    });
  };

  // Helper to categorize school status accurately matching StatusBadge
  const getSchoolCategory = (s: SchoolTenant): "VERIFIED" | "SUSPENDED" | "UNVERIFIED" | "PENDING" => {
    const norm = (s.status || "").toLowerCase().trim();
    if (s.is_verified === true || norm === "full_verified" || norm === "verified" || norm === "success") {
      return "VERIFIED";
    }
    if (norm === "suspended" || norm === "takedown" || norm === "dibekukan" || norm === "expired") {
      return "SUSPENDED";
    }
    if (norm === "unverified" || norm === "belum_verifikasi") {
      return "UNVERIFIED";
    }
    // All other schools waiting for Gatekeeper review (pending, pending_verification, submitted, etc.)
    return "PENDING";
  };

  // Filtered List
  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.npsn && s.npsn.includes(searchTerm)) ||
      (s.dapodik_code && s.dapodik_code.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "ALL") return true;
    const cat = getSchoolCategory(s);
    if (statusFilter === "PENDING") return cat === "PENDING";
    if (statusFilter === "VERIFIED") return cat === "VERIFIED";
    if (statusFilter === "UNVERIFIED") return cat === "UNVERIFIED";
    if (statusFilter === "SUSPENDED" || statusFilter === "TAKEDOWN") return cat === "SUSPENDED";
    return cat === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-[#FFD33B]" />
            Daftar Seluruh Instansi Sekolah
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola akses, status verifikasi legalitas, takedown, dan database multi-tenant CationGate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchSchools()}
            variant="outline"
            size="sm"
            className="h-10 rounded-xl gap-2 font-bold cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh Data
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Cari nama sekolah, slug, NPSN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { label: "Semua Instansi", val: "ALL" },
            { label: "Menunggu Verifikasi", val: "PENDING" },
            { label: "Terverifikasi", val: "VERIFIED" },
            { label: "Belum Verifikasi", val: "UNVERIFIED" },
            { label: "Dibekukan / Takedown", val: "SUSPENDED" }
          ].map((tab) => (
            <button
              key={tab.val}
              type="button"
              onClick={() => setStatusFilter(tab.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.val
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table List Sekolah */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-400">
                <th className="py-3 px-5">Nama Instansi & Subdomain</th>
                <th className="py-3 px-4">NPSN / Dapodik</th>
                <th className="py-3 px-4">Email Resmi</th>
                <th className="py-3 px-4">Paket SaaS</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Aksi Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                <SchoolTenantRow
                  key={sc.id}
                  school={sc}
                  getSubdomainUrl={getSchoolSubdomainUrl}
                  onSelect={setSelectedSchoolModal}
                  onApprove={handleApproveVerification}
                  onTakedown={handleTakedownSchool}
                  onPurge={handlePurgeSchool}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* School Details Modal */}
      <SchoolDetailsModal
        school={selectedSchoolModal}
        onClose={() => setSelectedSchoolModal(null)}
        onOpenPreview={setPreviewDoc}
        onPurge={handlePurgeSchool}
        onTakedown={handleTakedownSchool}
        onReject={handleRejectVerification}
        onApprove={handleApproveVerification}
      />

      {/* Embedded Document Preview Modal */}
      <GatekeeperDocPreviewModal
        previewDoc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}

export default function GatekeeperSchoolManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono">Memuat database sekolah...</div>}>
      <GatekeeperSchoolManagementContent />
    </Suspense>
  );
}
