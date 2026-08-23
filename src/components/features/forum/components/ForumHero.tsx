"use client";

import React from "react";
import { Search } from "lucide-react";
import BlurText from "@/components/BlurText";

interface ForumHeroProps {
  ppdbTitle: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export const ForumHero: React.FC<ForumHeroProps> = ({
  ppdbTitle,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <section className="relative pt-24 pb-16 bg-slate-900 overflow-hidden border-b border-slate-800">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
          Pusat Informasi & Diskusi PPDB
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto mb-4">
          <BlurText
            text={`Forum & Pengumuman Resmi ${ppdbTitle}`}
            delay={30}
            animateBy="words"
            direction="top"
          />
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 font-medium">
          Dapatkan pembaruan terkini seputar alur pendaftaran, jadwal seleksi, kuota jurusan, dan info penting lainnya.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengumuman, jadwal, atau topik..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm backdrop-blur-sm transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
