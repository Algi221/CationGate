"use client";

import React from "react";
import { X, FileText, Eye, Download, ExternalLink, AlertCircle, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadDocFile } from "@/lib/sanitizeUrl";

export interface SchoolTenant {
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

interface SchoolDetailsModalProps {
  school: SchoolTenant | null;
  onClose: () => void;
  onOpenPreview: (doc: { url: string; name: string; type?: string }) => void;
  onPurge: (school: SchoolTenant) => void;
  onTakedown: (school: SchoolTenant) => void;
  onReject: (school: SchoolTenant) => void;
  onApprove: (school: SchoolTenant) => void;
}

export const SchoolDetailsModal: React.FC<SchoolDetailsModalProps> = ({
  school,
  onClose,
  onOpenPreview,
  onPurge,
  onTakedown,
  onReject,
  onApprove
}) => {
  if (!school) return null;

  let docs: Array<{ id?: string; name: string; url?: string; type?: string; size?: number }> = [];

  if (Array.isArray(school.documents) && school.documents.length > 0) {
    docs = school.documents.map((d, i) => ({
      id: d.id || `doc-${i}`,
      name: d.name || `Berkas_Verifikasi_${i + 1}.pdf`,
      url: d.url || "",
      type: d.type || "SK_OPERASIONAL",
      size: d.size
    }));
  } else if (Array.isArray(school.verification_documents) && school.verification_documents.length > 0) {
    docs = school.verification_documents.map((d, i) => ({
      id: d.id || `doc-${i}`,
      name: d.name || `Berkas_Verifikasi_${i + 1}.pdf`,
      url: d.url || "",
      type: d.type || "SK_OPERASIONAL",
      size: d.size
    }));
  } else if (school.sk_document_url || school.sk_document_name) {
    docs = [{
      id: "doc-sk",
      name: school.sk_document_name || "Surat_Keputusan_Operasional.pdf",
      url: school.sk_document_url || "",
      type: "SK_OPERASIONAL"
    }];
  } else if (school.verification_document_url) {
    docs = [{
      id: "doc-legacy",
      name: "Surat_Keputusan_Operasional.pdf",
      url: school.verification_document_url,
      type: "SK_OPERASIONAL"
    }];
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
              {school.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg md:text-xl">{school.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFD33B]/10 dark:bg-[#2e3749] text-[#2e3749] dark:text-[#FFD33B] text-xs font-bold uppercase">
                  {school.plan_type || "TRIAL"}
                </span>
              </div>
              <p className="text-xs text-[#2e3749] dark:text-[#FFD33B] font-mono mt-0.5">URL Slug: /{school.slug}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
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
              <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{school.legal_sk_number || "SK-DIKNAS/2026/001"}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">NPSN Resmi:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{school.npsn || "20229000"}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Kode Dapodik:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{school.dapodik_code || "DPK-001"}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Akreditasi Sekolah:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{school.accreditation || "A (Unggul)"}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Penanggung Jawab / Admin:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{school.admin_name || "Admin Sekolah"}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Email Resmi Instansi:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">{school.official_email || school.email || "-"}</span>
            </div>
          </div>

          {/* Uploaded Verification Documents Section */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            {docs.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-1.5 opacity-80" />
                <p className="text-xs font-bold">Belum ada berkas verifikasi yang diunggah</p>
              </div>
            ) : (
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
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenPreview({ url: doc.url!, name: doc.name || "Berkas_Dokumen.pdf", type: doc.type });
                                }}
                                className="px-4 py-2 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" /> Buka / Unduh Berkas
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  downloadDocFile(doc.url, doc.name || "Berkas_Dokumen.pdf");
                                }}
                                title="Unduh Berkas Langsung"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenPreview({ url: "/assets/docs/sk_sample.pdf", name: "Contoh_SK_Operasional.pdf", type: "SK_OPERASIONAL" });
                              }}
                              className="px-4 py-2 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Preview Contoh SK
                            </button>
                          )}
                        </div>

                        {/* Image preview helper */}
                        {isImage && doc.url && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Format Gambar (JPG/PNG)</span>
                            <button
                              type="button"
                              onClick={() => onOpenPreview({ url: doc.url!, name: doc.name || "Foto_ID_Card.jpg", type: doc.type })}
                              className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Lihat & Periksa Gambar
                            </button>
                          </div>
                        )}

                        {/* PDF preview helper */}
                        {isPdf && doc.url && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Dokumen Surat Keputusan (PDF)</span>
                            <button
                              type="button"
                              onClick={() => onOpenPreview({ url: doc.url!, name: doc.name || "Dokumen_SK.pdf", type: doc.type })}
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
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-11 px-5 text-xs rounded-xl font-bold cursor-pointer"
          >
            Tutup
          </Button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              onClick={() => onPurge(school)}
              variant="outline"
              className="h-11 px-4 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Hapus Permanen
            </Button>

            <Button
              onClick={() => onTakedown(school)}
              variant="outline"
              className="h-11 px-4 text-xs rounded-xl text-amber-600 hover:bg-amber-50 border-amber-200 dark:border-amber-900 font-bold cursor-pointer"
            >
              Takedown Instansi
            </Button>

            {school.status !== "FULL_VERIFIED" && (
              <>
                <Button
                  onClick={() => onReject(school)}
                  variant="outline"
                  className="h-11 px-4 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Tolak Verifikasi
                </Button>

                <Button
                  onClick={() => onApprove(school)}
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
  );
};
