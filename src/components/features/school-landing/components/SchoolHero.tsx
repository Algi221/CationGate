"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, MapPin } from "lucide-react";
import ShinyText from "@/components/ShinyText";
import { MajorItem } from "../types";

const DataPendaftarTable = dynamic(() => import("@/components/DataPendaftarTable"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-xs font-semibold">Memuat data pendaftar...</p>
    </div>
  )
});

interface SchoolHeroProps {
  schoolSlug: string;
  schoolDisplayName: string;
  heroTitle: string;
  heroTitleSub: string;
  heroSubtitle: string;
  address: string;
  majors: MajorItem[];
}

export const SchoolHero: React.FC<SchoolHeroProps> = ({
  schoolSlug,
  schoolDisplayName,
  heroTitle,
  heroTitleSub,
  heroSubtitle,
  address,
  majors // Props original tetap aman, walau gak dirender jadi bubble lagi
}) => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-linear-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="w-full h-full bg-linear-to-br from-blue-600/10 via-indigo-500/5 to-slate-900/10 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-950" />
        <div className="absolute inset-0 bg-white/50 dark:bg-[#020617] backdrop-blur-none pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[90vh] flex flex-col justify-center">
        <section className="hero">
          
          {/* Top Info (Address Only - Badge SPMB Dihapus) */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            {address && (
              <div className="flex items-center gap-2 text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm animate-[fadeIn_0.5s_ease-out]">
                <MapPin size={14} className="text-blue-500 shrink-0" />
                <span>{address}</span>
              </div>
            )}
          </div>

          {/* Hero Titles */}
          <h1 className="hero-title relative z-10 text-center mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            {heroTitle} <br />
            <ShinyText
              text={heroTitleSub}
              speed={3}
              delay={1}
              color="var(--heading)"
              shineColor="#0ea5e9"
              spread={135}
            />
          </h1>

          <p className="hero-subtitle relative z-10 text-center mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>

          <div className="hero-action flex justify-center mt-8">
            <Link href={`/${schoolSlug}/daftar`} className="inline-flex items-center gap-2 bg-[#93c5fd] hover:bg-[#60a5fa] text-blue-950 px-7 py-3 rounded-full font-medium transition-colors shadow-sm">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>

          {/* RESULTS CARD SECTION */}
          {/* Langsung manggil DataPendaftarTable karena dia udah punya UI Card dan Search-nya sendiri */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-12 md:mt-16 px-4 md:px-0">
            <DataPendaftarTable />
          </div>
          
        </section>
      </div>
    </div>
  );
};