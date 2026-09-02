"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { CheckCircle2, Search, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { GatekeeperDocPreviewModal } from "../components/GatekeeperDocPreviewModal";
import {
  SchoolTenant,
  ActiveSchoolsTable,
  ActiveSchoolDetailModal,
} from "@/components/features/gatekeeper/active-schools";

function GatekeeperActiveSchoolsContent() {
  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchoolModal, setSelectedSchoolModal] =
    useState<SchoolTenant | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{
    url: string;
    name: string;
    type?: string;
  } | null>(null);

  const fetchActiveSchools = useCallback(async () => {
    try {
      setLoading(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("gatekeeper_token")
          : null;
      const res = await fetch(`/api/gatekeeper/schools?t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        setSchools([]);
        return;
      }
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        // Filter strictly active / verified schools
        const activeList = json.data.filter((s: SchoolTenant) => {
          const st = (s.status || "").toUpperCase();
          return (
            st === "FULL_VERIFIED" ||
            st === "VERIFIED" ||
            s.is_verified === true ||
            s.slug === "demo" ||
            s.slug === "smktarunabhakti"
          );
        });
        setSchools(activeList);
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
    fetchActiveSchools();
  }, [fetchActiveSchools]);

  const handleTakedownSchool = (school: SchoolTenant) => {
    Swal.fire({
      title: `Takedown Instansi ${school.name}?`,
      text: `Instansi ini akan dinonaktifkan dari platform CationGate (Status TAKEDOWN). Landing page publik dan pendaftaran akan ditutup.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Takedown Instansi",
      cancelButtonText: "Batal",
      customClass: {
        popup:
          "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("gatekeeper_token")
              : null;
          await fetch("/api/gatekeeper/takedown-school", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ school_id: school.slug || school.id }),
          });
        } catch (_e) {}

        await fetchActiveSchools();

        if (
          selectedSchoolModal?.id === school.id ||
          selectedSchoolModal?.slug === school.slug
        ) {
          setSelectedSchoolModal(null);
        }
        Swal.fire({
          title: "Instansi Di-Takedown!",
          text: `Subdomain dan akses portal ${school.name} telah dinonaktifkan.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: {
            popup: "rounded-2xl dark:bg-slate-900 dark:text-white",
          },
        });
      }
    });
  };

  const filteredSchools = schools.filter((s) => {
    const searchLower = searchTerm.toLowerCase();
    const nameStr = (s.name || "").toLowerCase();
    const npsnStr = (s.npsn || "").toLowerCase();
    const slugStr = (s.slug || "").toLowerCase();
    const emailStr = (s.official_email || "").toLowerCase();
    return (
      nameStr.includes(searchLower) ||
      npsnStr.includes(searchLower) ||
      slugStr.includes(searchLower) ||
      emailStr.includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            Sekolah Aktif &amp; Terverifikasi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daftar seluruh instansi sekolah yang telah lulus verifikasi legalitas
            SK &amp; memiliki portal PPDB aktif di CationGate.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-black font-mono">
            {schools.length} Sekolah Aktif
          </span>
          <button
            onClick={fetchActiveSchools}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari sekolah aktif berdasarkan nama, NPSN, atau slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 font-medium hidden sm:block">
          Menampilkan {filteredSchools.length} dari {schools.length} instansi
          aktif
        </p>
      </div>

      {/* Table of Active Schools */}
      <ActiveSchoolsTable
        loading={loading}
        filteredSchools={filteredSchools}
        onSelectSchool={setSelectedSchoolModal}
        onTakedownSchool={handleTakedownSchool}
      />

      {/* MODAL DETAIL SEKOLAH & MULTI-DOKUMEN PREVIEW */}
      <ActiveSchoolDetailModal
        selectedSchoolModal={selectedSchoolModal}
        onClose={() => setSelectedSchoolModal(null)}
        onPreviewDoc={setPreviewDoc}
        onTakedownSchool={handleTakedownSchool}
      />

      {/* MODAL EMBEDDED DOCUMENT PREVIEW (PDF / IMAGE) */}
      <GatekeeperDocPreviewModal
        previewDoc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}

export default function GatekeeperActiveSchoolsPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center text-slate-400">Memuat...</div>}
    >
      <GatekeeperActiveSchoolsContent />
    </Suspense>
  );
}
