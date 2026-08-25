"use client";

import React from "react";
import Image from "next/image";
import { X, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { InformasiItem } from "../types";

interface ForumDetailModalProps {
  selectedPost: InformasiItem | null;
  onClose: () => void;
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const parseMedia = (raw: string | null | undefined) => {
  if (!raw) return { foto: "", video: "", videoName: "", dokumen: "", dokumenName: "" };
  if (raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw);
      return {
        foto: parsed.foto || "",
        video: parsed.video || "",
        videoName: parsed.video_name || "",
        dokumen: parsed.dokumen || "",
        dokumenName: parsed.dokumen_name || ""
      };
    } catch (_e) {
      // fallback
    }
  }
  return { foto: raw, video: "", videoName: "", dokumen: "", dokumenName: "" };
};

export const ForumDetailModal: React.FC<ForumDetailModalProps> = ({ selectedPost, onClose }) => {
  if (!selectedPost) return null;

  const detailMedia = parseMedia(selectedPost.foto_url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Detail Pengumuman
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-3">
              {selectedPost.judul}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-500" />
                {formatDate(selectedPost.tanggal)}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-blue-500" />
                Panitia SPMB
              </span>
            </div>
          </div>

          {detailMedia.foto && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Image
                src={detailMedia.foto}
                alt={selectedPost.judul}
                fill
                className="object-contain"
              />
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {selectedPost.konten}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-500/20"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
