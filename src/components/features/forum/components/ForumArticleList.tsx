"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Calendar, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import { InformasiItem } from "../types";
import { ForumMiniCalendar } from "./ForumMiniCalendar";

interface ForumArticleListProps {
  filteredInformasi: InformasiItem[];
  loading: boolean;
  searchQuery: string;
  loadingDetailId: number | null;
  handleOpenDetail: (item: InformasiItem) => void;
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDateShort = (dateStr: string | null | undefined) => {
  if (!dateStr) return { day: "-", month: "---" };
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  return { day: d.getDate(), month: months[d.getMonth()] };
};

const timeAgo = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} hari yang lalu`;
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

export const ForumArticleList: React.FC<ForumArticleListProps> = ({
  filteredInformasi,
  loading,
  searchQuery,
  loadingDetailId,
  handleOpenDetail
}) => {
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  const displayedArticles = React.useMemo(() => {
    if (!selectedCalendarDate) return filteredInformasi;
    return filteredInformasi.filter((item) => {
      if (!item.tanggal) return false;
      const d = new Date(item.tanggal);
      if (isNaN(d.getTime())) return false;
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return dateKey === selectedCalendarDate;
    });
  }, [filteredInformasi, selectedCalendarDate]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Pengumuman &amp; Berita Resmi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Menampilkan {displayedArticles.length} informasi resmi sekolah.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content: Announcements Grid (8 Columns) */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm animate-pulse flex flex-col gap-4"
                >
                  <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : displayedArticles.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">
                Tidak ada pengumuman ditemukan
              </h3>
              <p className="text-xs text-slate-400">
                {selectedCalendarDate
                  ? `Tidak ada pengumuman pada tanggal ${selectedCalendarDate}.`
                  : searchQuery
                    ? `Tidak ada hasil untuk kata kunci "${searchQuery}". Coba kata kunci lain.`
                    : "Belum ada pengumuman atau artikel yang dipublikasikan saat ini."}
              </p>
              {selectedCalendarDate && (
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDate(null)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  Tampilkan Semua Pengumuman
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedArticles.map((item, index) => {
                const media = parseMedia(item.foto_url);
                const dateShort = formatDateShort(item.tanggal);

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleOpenDetail(item)}
                    className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                  >
                    {/* Media Box */}
                    <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                      {media.foto ? (
                        <Image
                          src={media.foto}
                          alt={item.judul}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
                          <Megaphone className="w-12 h-12 mb-2 stroke-[1.5]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Pengumuman Resmi
                          </span>
                        </div>
                      )}

                      {/* Date Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-3 py-1.5 shadow-md flex flex-col items-center text-center">
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 leading-none">
                          {dateShort.day}
                        </span>
                        <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">
                          {dateShort.month}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-bold text-white">
                        {timeAgo(item.tanggal)}
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-snug">
                          {item.judul}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {item.konten}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                          <Calendar size={13} />
                          {formatDate(item.tanggal)}
                        </span>
                        <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {loadingDetailId === item.id ? "Memuat..." : "Baca Selengkapnya"}
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Mini Calendar (4 Columns) */}
        <aside className="lg:col-span-4 w-full">
          <ForumMiniCalendar
            informasiList={filteredInformasi}
            selectedDate={selectedCalendarDate}
            onSelectDate={setSelectedCalendarDate}
          />
        </aside>
      </div>
    </section>
  );
};
