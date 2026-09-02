"use client";

import React from "react";
import { X, FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadDocFile } from "@/lib/sanitizeUrl";
import { SchoolTenant } from "./types";

interface ActiveSchoolDetailModalProps {
  selectedSchoolModal: SchoolTenant | null;
  onClose: () => void;
  onPreviewDoc: (doc: { url: string; name: string; type?: string }) => void;
  onTakedownSchool: (school: SchoolTenant) => void;
}

export function ActiveSchoolDetailModal({
  selectedSchoolModal,
  onClose,
  onPreviewDoc,
  onTakedownSchool,
}: ActiveSchoolDetailModalProps) {
  if (!selectedSchoolModal) return null;

  const docs =
    selectedSchoolModal.documents && selectedSchoolModal.documents.length > 0
      ? selectedSchoolModal.documents
      : selectedSchoolModal.sk_document_name
      ? [
          {
            id: "doc-sk",
            type: "SK_OPERASIONAL",
            name: selectedSchoolModal.sk_document_name,
            url: selectedSchoolModal.sk_document_url,
          },
        ]
      : [];

  return (
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
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg md:text-xl">
                  {selectedSchoolModal.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">
                  TERVERIFIKASI
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                Subdomain: {selectedSchoolModal.slug}.cationgate.site
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Info Grid */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Identitas &amp; Legalitas Resmi
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">
                Nomor SK Operasional:
              </span>
              <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                {selectedSchoolModal.legal_sk_number || "-"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">
                NPSN Resmi:
              </span>
              <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                {selectedSchoolModal.npsn || "-"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">
                Akreditasi Sekolah:
              </span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                {selectedSchoolModal.accreditation || "A (Unggul)"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">
                Penanggung Jawab:
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedSchoolModal.admin_name || "Kepala Sekolah"}
              </span>
            </div>
          </div>

          {/* Document Files Preview Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" /> Berkas
                Legalitas yang Terverifikasi:
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                Dokumen Sah
              </span>
            </div>

            {docs.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                Tidak ada berkas fisik tersimpan.
              </div>
            ) : (
              <div className="space-y-3">
                {docs.map((doc, idx) => {
                  const isImage =
                    doc.url &&
                    (doc.url.startsWith("data:image/") ||
                      doc.name?.match(/\.(jpg|jpeg|png)$/i));
                  return (
                    <div
                      key={doc.id || idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase block">
                              {doc.type === "ID_CARD"
                                ? "ID Card Penanggung Jawab"
                                : doc.type === "SOSMED_PROOF"
                                ? "Bukti Akun Sosmed"
                                : "SK Izin Operasional"}
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
                                onPreviewDoc({
                                  url: doc.url!,
                                  name: doc.name || "Berkas_Verifikasi.pdf",
                                  type: doc.type,
                                });
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Buka Dokumen
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                downloadDocFile(
                                  doc.url,
                                  doc.name || "Berkas_Verifikasi.pdf",
                                );
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
                          <span className="text-slate-500 font-medium">
                            Format Gambar (JPG/PNG)
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onPreviewDoc({
                                url: doc.url!,
                                name: doc.name || "Foto_ID_Card.jpg",
                                type: doc.type,
                              })
                            }
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
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 px-5 text-xs rounded-xl font-bold cursor-pointer"
          >
            Tutup
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onTakedownSchool(selectedSchoolModal)}
              variant="outline"
              className="h-10 px-4 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900 font-bold cursor-pointer"
            >
              Takedown Instansi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
