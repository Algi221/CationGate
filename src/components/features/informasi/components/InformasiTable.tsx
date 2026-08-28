"use client";

import React from "react";
import Image from "next/image";
import { 
  Megaphone, 
  Calendar, 
  Image as ImageIcon, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  Loader2 
} from "lucide-react";
import { Informasi } from "../types";
import { parseMedia, formatDate, sanitizeSrc } from "../utils/mediaHelper";

interface InformasiTableProps {
  informasiList: Informasi[];
  loading: boolean;
  loadingDetailId: number | null;
  onOpenCreateModal?: () => void;
  onOpenEditModal: (item: Informasi) => void;
  onOpenPreview: (item: Informasi) => void;
  onDeleteConfirm: (id: number) => void;
}

export const InformasiTable: React.FC<InformasiTableProps> = ({
  informasiList,
  loading,
  loadingDetailId,
  onOpenEditModal,
  onOpenPreview,
  onDeleteConfirm
}) => {
  if (loading) {
    return (
      <div className="py-24 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800/40 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <Loader2 size={32} className="animate-spin text-blue-500 dark:text-blue-400" />
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Sedang memuat data informasi...
        </span>
      </div>
    );
  }

  if (informasiList.length === 0) {
    return (
      <div className="py-20 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center text-center p-8 transition-colors duration-300">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-400 mb-4 border border-slate-200 dark:border-slate-800/60">
          <Megaphone size={24} />
        </div>
        <h3 className="text-slate-800 dark:text-white font-black text-sm uppercase tracking-wide">
          Belum Ada Informasi
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium max-w-xs mt-2 leading-relaxed">
          Tidak ditemukan pengumuman informasi yang aktif di database saat ini. Gunakan tombol di atas untuk membuat pengumuman baru.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
      {informasiList.map((item) => {
        const media = parseMedia(item.foto_url);
        return (
          <div
            key={item.id}
            className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 hover:border-slate-400 dark:hover:border-white/10 rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative cursor-pointer ${
              loadingDetailId === item.id ? "opacity-75 pointer-events-none" : ""
            }`}
            onClick={() => {
              if (loadingDetailId === null) {
                onOpenPreview(item);
              }
            }}
          >
            {/* Floating Date Badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-md">
              <Calendar size={11} className="text-blue-400" />
              <span>{formatDate(item.tanggal)}</span>
            </div>

            {/* Floating Media Indicators */}
            <div className="absolute top-4 right-4 z-10 flex gap-1">
              {media.video && (
                <span className="px-2.5 py-1.5 bg-blue-600/90 backdrop-blur-md border border-blue-400/20 text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-md">
                  🎥 Video
                </span>
              )}
              {media.dokumen && (
                <span className="px-2.5 py-1.5 bg-emerald-600/90 backdrop-blur-md border border-emerald-400/20 text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-md">
                  📄 Dokumen
                </span>
              )}
            </div>

            <div>
              {/* Image Section */}
              <div className="h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden relative border-b border-slate-100 dark:border-white/5">
                {media.foto ? (
                  <Image
                    src={sanitizeSrc(media.foto)}
                    alt={item.judul}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-500/10 to-indigo-650/10 dark:from-blue-600/5 dark:to-indigo-500/5 flex flex-col items-center justify-center text-slate-400 dark:text-slate-650 gap-2">
                    <ImageIcon
                      size={32}
                      strokeWidth={1.5}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Media Poster Kosong
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-3">
                <h4 className="text-slate-800 dark:text-white font-extrabold text-base tracking-tight leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.judul}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                  {item.konten}
                </p>
              </div>
            </div>

            {/* Action Bar Footer */}
            <div
              className="px-6 py-4 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-white/5 flex items-center justify-between relative z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onOpenPreview(item)}
                className="text-[11px] font-extrabold uppercase tracking-wide text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1 active:scale-[0.98] transition-all cursor-pointer"
                disabled={loadingDetailId !== null}
              >
                {loadingDetailId === item.id ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" />
                    <span>Memuat...</span>
                  </span>
                ) : (
                  <>
                    <span>Pratinjau</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenEditModal(item)}
                  className="w-8 h-8 rounded-xl bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Informasi"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => onDeleteConfirm(item.id)}
                  className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center transition-colors cursor-pointer"
                  title="Hapus Informasi"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
