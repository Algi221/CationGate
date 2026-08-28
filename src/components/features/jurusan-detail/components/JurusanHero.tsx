"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MajorDetail, KuotaItem } from "../types";
import { sanitizeSrc } from "../defaultMajorsData";

import { useSchoolHref } from "@/hooks/useSchoolHref";

interface JurusanHeroProps {
  schoolSlug: string;
  major: MajorDetail;
  kuotaData: KuotaItem[] | null;
}

export const JurusanHero: React.FC<JurusanHeroProps> = ({
  schoolSlug,
  major,
  kuotaData
}) => {
  const { href } = useSchoolHref(schoolSlug);
  let isFull = false;
  if (Array.isArray(kuotaData) && major) {
    const k = kuotaData.find(
      (item: KuotaItem) =>
        item &&
        (item.key === major.title ||
          item.key === major.code ||
          item.konsentrasi_keahlian?.includes(major.code) ||
          item.konsentrasi_keahlian?.includes(major.title))
    );
    if (k && k.target > 0) {
      isFull = k.jumlah >= k.target;
    }
  }

  const hasBanner = Boolean(major.banner && major.banner.trim() !== "");

  return (
    <section className={`pt-32 pb-16 px-6 max-w-6xl mx-auto w-full relative z-10 flex flex-col ${hasBanner ? "lg:flex-row gap-12" : "gap-8 max-w-4xl"} items-center text-left`}>
      {/* Left Copy Column */}
      <div className={`w-full ${hasBanner ? "lg:w-1/2" : "max-w-3xl"} space-y-6`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
            <Image
              src={sanitizeSrc(major.logo) || "/icon.png"}
              alt={`Logo ${major.code}`}
              width={56}
              height={56}
              unoptimized
              className="w-14 h-14 object-contain drop-shadow-xs"
            />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 major-bg-accent major-text-accent">
              Program Unggulan {major.code}
            </span>
            <h2 className="text-sm font-semibold text-slate-400">{major.subtitle}</h2>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
          Jurusan <br />
          <span className="major-text-clip">{major.title}</span>
        </h1>

        <p className="text-lg font-bold text-slate-600 dark:text-slate-300 italic border-l-4 border-blue-500 pl-4">
          &ldquo;{major.tagline}&rdquo;
        </p>

        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
          {major.desc}
        </p>

        <div className="pt-2 flex flex-wrap gap-4 items-center">
          <div className="flex flex-col w-full gap-5 mt-2">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={href("/")}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors py-3.5 px-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 backdrop-blur-md cursor-pointer"
              >
                <ArrowLeft size={16} /> Lihat Jurusan Lain
              </Link>

              <div className="relative group/btn">
                <Link
                  href={isFull ? "#" : href("/daftar")}
                  className={`btn-primary-pill py-3.5 px-8 flex items-center gap-2 rounded-2xl ${
                    isFull ? "opacity-50 cursor-not-allowed pointer-events-none grayscale" : ""
                  }`}
                >
                  {isFull ? "Pendaftaran Ditutup" : "Daftar Jurusan Ini"} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Hero Visual Column (Render ONLY when banner is provided) */}
      {hasBanner && (
        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute -inset-1.5 major-gradient-bg rounded-[36px] blur-lg opacity-40 group-hover:opacity-60 transition duration-700 pointer-events-none" />

          <div className="relative bg-white dark:bg-[#0f172a] rounded-4xl p-3 border border-slate-200 dark:border-slate-800/40 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
            <Image
              src={sanitizeSrc(major.banner) || "/icon.png"}
              alt={`${major.title} Banner`}
              width={800}
              height={450}
              unoptimized
              className="w-full h-full object-cover rounded-3xl transform group-hover:scale-[1.02] transition duration-700"
            />
          </div>
        </div>
      )}
    </section>
  );
};
