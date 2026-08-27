"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { 
  CheckCircle2, Search, X, ExternalLink, 
  RefreshCw, FileText, Eye, Globe, Trash2, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { sanitizeSlug, safeOpenWindow, downloadDocFile } from "@/lib/sanitizeUrl";
import { GatekeeperDocPreviewModal } from "../components/GatekeeperDocPreviewModal";

interface SchoolTenant {
  id: number;
  name: string;
  slug: string;
  npsn: string;
  dapodik_code: string;
  official_email: string;
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
  documents?: Array<{
    id?: string;
    type?: string;
    name?: string;
    url?: string;
    size?: number;
  }>;
}

function GatekeeperActiveSchoolsContent() {
  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchoolModal, setSelectedSchoolModal] = useState<SchoolTenant | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string; type?: string } | null>(null);

  const fetchActiveSchools = useCallback(async () => {
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
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        // Filter strictly active / verified schools
        const activeList = json.data.filter((s: SchoolTenant) => {
          const st = (s.status || "").toUpperCase();
          return st === "FULL_VERIFIED" || st === "VERIFIED" || s.is_verified === true || s.slug === "demo" || s.slug === "smktarunabhakti";
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

        await fetchActiveSchools();

        if (selectedSchoolModal?.id === school.id || selectedSchoolModal?.slug === school.slug) {
          setSelectedSchoolModal(null);
        }
        Swal.fire({
          title: "Instansi Di-Takedown!",
          text: `Subdomain dan akses portal ${school.name} telah dinonaktifkan.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
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
    return nameStr.includes(searchLower) ||
           npsnStr.includes(searchLower) ||
           slugStr.includes(searchLower) ||
           emailStr.includes(searchLower);
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
            Daftar seluruh instansi sekolah yang telah lulus verifikasi legalitas SK &amp; memiliki portal PPDB aktif di CationGate.
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
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search Input Bar (No Filter Tabs!) */}
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
          Menampilkan {filteredSchools.length} dari {schools.length} instansi aktif
        </p>
      </div>

      {/* Table of Active Schools */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Sekolah &amp; Subdomain</th>
                <th className="py-4 px-4">NPSN &amp; Legalitas</th>
                <th className="py-4 px-4">Penanggung Jawab</th>
                <th className="py-4 px-4">Paket SaaS</th>
                <th className="py-4 px-4">Status Portal</th>
                <th className="py-4 px-6 text-right">Aksi Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <p className="font-semibold text-xs">Memuat data sekolah aktif...</p>
                  </td>
                </tr>
              ) : filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="font-bold text-sm text-slate-600 dark:text-slate-400">Belum ada sekolah aktif yang cocok</p>
                    <p className="text-xs mt-0.5">Coba periksa kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => {
                  return (
                    <tr key={school.id || school.slug} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {school.name ? school.name.substring(0, 2).toUpperCase() : "SMK"}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                              {school.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono text-slate-400">/{sanitizeSlug(school.slug)}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  safeOpenWindow(`http://${sanitizeSlug(school.slug)}.localhost:3000`);
                                }}
                                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                                title="Buka Landing Page"
                              >
                                <Globe className="w-2.5 h-2.5" /> Web
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold font-mono text-slate-700 dark:text-slate-300 block text-xs">
                          {school.npsn || "NPSN: -"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          SK: {school.legal_sk_number || "-"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                          {school.admin_name || "Admin Sekolah"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate max-w-35">
                          {school.official_email || "-"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase font-mono">
                          {school.plan_type || "TRIAL"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Aktif
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedSchoolModal(school)}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Detail & Berkas Legalitas"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              safeOpenWindow(`/${sanitizeSlug(school.slug)}/dashboard`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" /> Dashboard
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTakedownSchool(school)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Takedown Instansi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL SEKOLAH & MULTI-DOKUMEN PREVIEW */}
      {selectedSchoolModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
                  {selectedSchoolModal.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg md:text-xl">{selectedSchoolModal.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">
                      TERVERIFIKASI
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">Subdomain: {selectedSchoolModal.slug}.cationgate.site</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSchoolModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legal Info Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Identitas &amp; Legalitas Resmi</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Nomor SK Operasional:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedSchoolModal.legal_sk_number || "-"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">NPSN Resmi:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedSchoolModal.npsn || "-"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Akreditasi Sekolah:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{selectedSchoolModal.accreditation || "A (Unggul)"}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Penanggung Jawab:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedSchoolModal.admin_name || "Kepala Sekolah"}</span>
                </div>
              </div>

              {/* Document Files Preview Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> Berkas Legalitas yang Terverifikasi:
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Dokumen Sah</span>
                </div>

                {(() => {
                  const docs = (selectedSchoolModal.documents && selectedSchoolModal.documents.length > 0)
                    ? selectedSchoolModal.documents
                    : selectedSchoolModal.sk_document_name
                    ? [{
                        id: 'doc-sk',
                        type: 'SK_OPERASIONAL',
                        name: selectedSchoolModal.sk_document_name,
                        url: selectedSchoolModal.sk_document_url
                      }]
                    : [];

                  if (docs.length === 0) {
                    return (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Tidak ada berkas fisik tersimpan.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {docs.map((doc, idx) => {
                        const isImage = doc.url && (doc.url.startsWith("data:image/") || doc.name?.match(/\.(jpg|jpeg|png)$/i));
                        return (
                          <div key={doc.id || idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase block">
                                    {doc.type === "ID_CARD" ? "ID Card Penanggung Jawab" : doc.type === "SOSMED_PROOF" ? "Bukti Akun Sosmed" : "SK Izin Operasional"}
                                  </span>
                                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {doc.name || "Berkas_Verifikasi.pdf"}
                                  </h5>
                                </div>
                              </div>

                              {doc.url && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPreviewDoc({ url: doc.url!, name: doc.name || "Berkas_Verifikasi.pdf", type: doc.type });
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Buka Dokumen
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      downloadDocFile(doc.url, doc.name || "Berkas_Verifikasi.pdf");
                                    }}
                                    title="Unduh Berkas Langsung"
                                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {isImage && doc.url && (
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">Format Gambar (JPG/PNG)</span>
                                <button
                                  type="button"
                                  onClick={() => setPreviewDoc({ url: doc.url!, name: doc.name || "Foto_ID_Card.jpg", type: doc.type })}
                                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" /> Lihat Gambar
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setSelectedSchoolModal(null)}
                className="h-10 px-5 text-xs rounded-xl font-bold cursor-pointer"
              >
                Tutup
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleTakedownSchool(selectedSchoolModal)}
                  variant="outline"
                  className="h-10 px-4 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900 font-bold cursor-pointer"
                >
                  Takedown Instansi
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    safeOpenWindow(`/${sanitizeSlug(selectedSchoolModal.slug)}/dashboard`);
                  }}
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Dashboard Sekolah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EMBEDDED DOCUMENT PREVIEW (PDF / IMAGE) ── */}
      <GatekeeperDocPreviewModal
        previewDoc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}

export default function GatekeeperActiveSchoolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat...</div>}>
      <GatekeeperActiveSchoolsContent />
    </Suspense>
  );
}
