"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight, MapPin } from "lucide-react";
import ShinyText from "@/components/ShinyText";
import { MajorItem } from "../types";
import { useSchoolHref } from "@/hooks/useSchoolHref";

const DataPendaftarTable = dynamic(() => import("@/components/DataPendaftarTable"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 min-h-75">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-xs font-semibold">Memuat data pendaftar...</p>
    </div>
  )
});

interface SchoolHeroProps {
  schoolSlug?: string;
  schoolDisplayName: string;
  heroTitle: string;
  heroTitleSub: string;
  heroSubtitle: string;
  address: string;
  majors: MajorItem[];
  heroBgImage?: string;
}

export const SchoolHero: React.FC<SchoolHeroProps> = ({
  schoolSlug,
  schoolDisplayName: _schoolDisplayName,
  heroTitle,
  heroTitleSub,
  heroSubtitle,
  address,
  majors: _majors,
  heroBgImage
}) => {
  const { href } = useSchoolHref(schoolSlug);

  return (
    <div className="relative w-full overflow-hidden">
      {/* BACKGROUND IMAGE DENGAN FADE OUT GRADIENT */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-[#020617]" suppressHydrationWarning>
        {heroBgImage ? (
          <Image
            src={heroBgImage}
            alt="Background Sekolah"
            fill
            priority
            unoptimized
            className="object-cover object-top opacity-30 dark:opacity-15"
          />
        ) : null}
        {/* Gradient overlay biar atasnya kelihatan, makin ke bawah makin menyatu halus dengan body */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-50/80 to-slate-50 dark:via-[#020617]/80 dark:to-[#020617]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[90vh] flex flex-col justify-center">
        <section className="hero">
          {/* Top Info (Address Chip) */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            {address && (
              <div className="flex items-center gap-2 text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm animate-[fadeIn_0.5s_ease-out]">
                <MapPin size={14} className="text-blue-500 shrink-0" />
                <span className="max-w-xs sm:max-w-md md:max-w-none truncate md:whitespace-normal">{address}</span>
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

          {heroSubtitle && (
            <p className="hero-subtitle relative z-10 text-center mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium drop-shadow-sm break-words [overflow-wrap:anywhere]">
              {heroSubtitle}
            </p>
          )}

          <div className="hero-action flex justify-center mt-8">
            <Link
              href={href("/daftar")}
              className="inline-flex items-center gap-2 bg-[#93c5fd] hover:bg-[#60a5fa] text-blue-950 px-7 py-3 rounded-full font-medium transition-colors shadow-sm cursor-pointer"
            >
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>

          {/* RESULTS CARD SECTION (DATA PENDAFTAR TABLE) */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-12 md:mt-16 px-4 md:px-0">
            <DataPendaftarTable />
          </div>
        </section>
      </div>
    </div>
  );
};
