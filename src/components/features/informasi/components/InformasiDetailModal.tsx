"use client";

import React from "react";
import Image from "next/image";
import { Calendar, FileText, Edit3, X } from "lucide-react";
import { Informasi } from "../types";
import { parseMedia, formatDate, sanitizeSrc, sanitizeUrl } from "../utils/mediaHelper";

interface InformasiDetailModalProps {
  previewItem: Informasi | null;
  onClose: () => void;
  onOpenEditModal: (item: Informasi) => void;
}

export const InformasiDetailModal: React.FC<InformasiDetailModalProps> = ({
  previewItem,
  onClose,
  onOpenEditModal
}) => {
  if (!previewItem) return null;

  const media = parseMedia(previewItem.foto_url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 my-8 transition-colors duration-300 text-left">
        {/* Poster Header */}
        {media.foto ? (
          <div className="h-80 relative border-b border-slate-100 dark:border-white/5">
            <Image
              src={sanitizeSrc(media.foto)}
              alt={previewItem.judul}
              width={800}
              height={400}
              className="w-full h-full object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />

            {/* Floating Date Over Image */}
            <div className="absolute bottom-6 left-6 z-10 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-md border border-blue-500">
              <Calendar size={11} />
              <span>{formatDate(previewItem.tanggal)}</span>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-slate-900 flex items-center justify-center transition-all font-bold cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-xs">
              <Calendar size={11} />
              <span>{formatDate(previewItem.tanggal)}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all font-bold cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Content Details */}
        <div className="p-8 space-y-6">
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase leading-snug tracking-tight">
            {previewItem.judul}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold whitespace-pre-line">
            {previewItem.konten}
          </p>

          {/* Additional Media in Preview */}
          {(media.video || media.dokumen) && (
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-6">
              <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                Lampiran Media Forum
              </h5>

              <div className="space-y-6">
                {/* Video Player */}
                {media.video && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      🎥 Video Lampiran:
                    </span>
                    <div className="rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden bg-slate-950 shadow-md">
                      <video src={sanitizeSrc(media.video)} controls className="w-full max-h-72 object-contain" />
                    </div>
                  </div>
                )}

                {/* Document Preview & Download Button */}
                {media.dokumen && (
                  <div className="space-y-3 w-full">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      📄 Pratinjau Dokumen Resmi:
                    </span>
                    {media.dokumen.startsWith("data:application/pdf") ? (
                      <div className="rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-md bg-white dark:bg-[#0f172a]">
                        <iframe src={sanitizeSrc(media.dokumen)} className="w-full h-112.5 border-0" />
                      </div>
                    ) : media.dokumen.startsWith("data:image/") ? (
                      <div className="rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
                        <Image
                          src={sanitizeSrc(media.dokumen)}
                          alt="Dokumen Preview"
                          width={800}
                          height={600}
                          className="max-w-full max-h-96 object-contain rounded-xl"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {media.dokumenName || "dokumen.pdf"}
                          </h6>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            Pratinjau langsung tidak tersedia untuk format berkas ini. Silakan unduh dokumen untuk melihat isi berkas.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <a
                        href={sanitizeUrl(media.dokumen)}
                        download={media.dokumenName || "dokumen.pdf"}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
                      >
                        Unduh Dokumen ({media.dokumenName || "dokumen.pdf"})
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Detail Actions Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/15 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            ID Publikasi: #{previewItem.id}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const item = previewItem;
                onClose();
                onOpenEditModal(item);
              }}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/10 dark:hover:bg-blue-500/10 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200 dark:border-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Ubah Data</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
