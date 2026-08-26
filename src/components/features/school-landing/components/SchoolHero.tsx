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
    <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
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
  majors
}) => {
  const { href } = useSchoolHref();
  return (
    <div className="relative w-full overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-linear-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="w-full h-full bg-linear-to-br from-blue-600/10 via-indigo-500/5 to-slate-900/10 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-950" />
        <div className="absolute inset-0 bg-white/50 dark:bg-[#020617] backdrop-blur-none pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[90vh] flex flex-col justify-center">
        <section className="hero">
          {/* Floating elements representing major names dynamically */}
          <div className="badges-container">
            {majors.map((m, index) => {
              const isEven = index % 2 === 0;
              const sideIndex = Math.floor(index / 2);
              const topPos = isEven ? 100 + sideIndex * 150 : 110 + sideIndex * 180;
              const horizPos = isEven ? 2 + (sideIndex % 3) * 2 : 1 + (sideIndex % 3) * 1.5;
              const animName = `float${(index % 4) + 1}`;
              const animDuration = `${6 + (index % 3) * 1.5}s`;
              const animDelay = `-${(index % 5) * 1}s`;

              const routeCode = encodeURIComponent(
                m.code.toLowerCase() === "anm" ? "an" : m.code.toLowerCase()
              );
              const routeLink = href(`/jurusan/${routeCode}`);
              const displayAlias =
                m.code === "RPL"
                  ? "PPLG"
                  : m.code === "ANM"
                  ? "Animasi"
                  : m.code === "BC"
                  ? "Broadcasting"
                  : m.code;

              return (
                <Link
                  key={m.code}
                  href={routeLink}
                  className="floating-badge animate-[fadeIn_0.5s_ease-out]"
                  style={{
                    top: `${topPos}px`,
                    [isEven ? "left" : "right"]: `${horizPos}%`,
                    animation: `${animName} ${animDuration} infinite alternate ease-in-out ${animDelay}`
                  }}
                >
                  <div className="badge-icon overflow-hidden bg-transparent">
                    {m.logo ? (
                      <Image
                        src={m.logo}
                        alt=""
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-[10px] rounded-full">
                        {displayAlias.substring(0, 3).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="badge-info">
                    <span>{displayAlias}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Hero Copy */}
          <div className="badge-wrapper relative z-10 flex flex-col items-center gap-3">
            <span className="badge-pill">SPMB {schoolDisplayName.toUpperCase()}</span>
            {address && (
              <div className="flex items-center gap-2 text-[11px] md:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0f172a] px-4 py-2 rounded-full backdrop-blur-md border border-slate-200 dark:border-slate-800/50 shadow-sm animate-[fadeIn_0.8s_ease-out_0.2s_both]">
                <MapPin size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="max-w-70 md:max-w-none truncate md:whitespace-normal">{address}</span>
              </div>
            )}
          </div>

          <h1 className="hero-title relative z-10">
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

          <p className="hero-subtitle relative z-10">{heroSubtitle}</p>

          <div className="hero-action">
            <Link href={href("/daftar")} className="btn-hero-action">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>

          {/* MAC BROWSER MOCKUP WRAPPER */}
          <div className="mockup-container relative z-10 w-full max-w-5xl mx-auto mt-8 md:mt-10 px-2 md:px-0">
            <div className="relative rounded-2xl md:rounded-4xl bg-[#0f172a] p-1.5 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-slate-900/50">
              <div className="w-full h-full bg-[#0f172a] overflow-hidden rounded-xl md:rounded-[1.25rem] relative flex flex-col">
                {/* Mockup Browser Top bar */}
                <div className="flex items-center px-3 md:px-4 py-2 md:py-3 bg-[#0f172a] relative z-20 border-b border-slate-800/80">
                  <div className="flex gap-1.5 md:gap-2 w-12 md:w-20">
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-slate-900/80 text-slate-400 text-[9px] md:text-[10px] font-medium px-4 md:px-6 py-1 md:py-1.5 rounded-md flex items-center justify-center min-w-30 md:min-w-50 shadow-inner border border-slate-800 truncate max-w-37.5 md:max-w-none">
                      cationgate/{schoolSlug}
                    </div>
                  </div>
                  <div className="w-12 md:w-20"></div>
                </div>

                {/* Data Pendaftar Table View */}
                <div className="dashboard-view block w-full p-2 md:p-6 h-100 md:h-150 bg-slate-50 dark:bg-[#020617] relative z-10 transition-colors duration-300 overflow-auto">
                  <DataPendaftarTable />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
