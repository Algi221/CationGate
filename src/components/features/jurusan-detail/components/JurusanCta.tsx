"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { MajorDetail } from "../types";

import { useSchoolHref } from "@/hooks/useSchoolHref";

interface JurusanCtaProps {
  schoolSlug: string;
  major: MajorDetail;
  nextMajor: MajorDetail;
  nextCode: string;
}

export const JurusanCta: React.FC<JurusanCtaProps> = ({
  schoolSlug: _schoolSlug,
  major,
  nextMajor,
  nextCode
}) => {
  const { href } = useSchoolHref();
  return (
    <>
      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-16 max-w-6xl mx-auto px-6 w-full relative z-10 text-center">
        <div className="relative major-gradient-bg rounded-[40px] p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="inline-block px-3 py-1 bg-white dark:bg-[#0f172a]/20 backdrop-blur-md text-white rounded-full text-xs font-extrabold uppercase tracking-wider">
              PPDB TP. 2026/2027
            </span>

            <h2 className="text-2xl md:text-4xl font-black leading-tight">
              Siap Mengukir Prestasi Di Bidang Teknologi Informasi?
            </h2>

            <p className="text-sm md:text-base text-white/80 font-medium">
              Amankan slot pendaftaran Anda sekarang di Program Keahlian {major.title}. Dapatkan pembinaan intensif dari guru ahli dan mitra industri global.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href={href("/daftar")}
                className="bg-white text-slate-900 hover:bg-[#f8fafc] text-sm font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 w-full sm:w-auto cursor-pointer"
              >
                Daftar Sekarang
              </Link>
              <Link
                href={href("/")}
                className="border border-white/30 bg-white/10 hover:bg-white/20 text-sm font-semibold px-8 py-4 rounded-2xl backdrop-blur-md transition duration-300 w-full sm:w-auto cursor-pointer"
              >
                Kembali Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE NEXT MAJOR CTA */}
      <section className="py-16 max-w-6xl mx-auto px-6 w-full relative z-10 text-left">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full next-gradient-bg opacity-10 dark:opacity-20 blur-3xl pointer-events-none group-hover:scale-110 transition duration-700" />

          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider next-bg-accent next-text-accent">
              <Sparkles size={12} className="animate-pulse" />
              Eksplor Jurusan Lain
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
              Tertarik Melihat Jurusan{" "}
              <span className="next-text-clip">
                {nextMajor.title} ({nextMajor.alias})
              </span>
              ?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {nextMajor.desc.length > 180 ? nextMajor.desc.slice(0, 180) + "..." : nextMajor.desc}
            </p>
          </div>

          <div className="shrink-0 relative z-10 w-full md:w-auto">
            <Link
              href={href(`/jurusan/${nextCode}`)}
              className="flex items-center justify-center gap-2 next-gradient-bg hover:opacity-90 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-slate-950/5 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto group/btn cursor-pointer"
            >
              <span>Lihat Detail {nextMajor.alias}</span>
              <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
