"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Palette } from "lucide-react";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { useJurusanDetailState } from "@/components/features/jurusan-detail/hooks/useJurusanDetailState";
import { JurusanHero } from "@/components/features/jurusan-detail/components/JurusanHero";
import { JurusanVideo } from "@/components/features/jurusan-detail/components/JurusanVideo";
import { JurusanCurriculum } from "@/components/features/jurusan-detail/components/JurusanCurriculum";
import { JurusanGallery } from "@/components/features/jurusan-detail/components/JurusanGallery";
import { JurusanCareers } from "@/components/features/jurusan-detail/components/JurusanCareers";
import { JurusanFacilities } from "@/components/features/jurusan-detail/components/JurusanFacilities";
import { JurusanCta } from "@/components/features/jurusan-detail/components/JurusanCta";

export default function JurusanDetailPage() {
  const {
    schoolSlug,
    nextCode,
    major,
    nextMajor,
    kuotaData,
    accentColor,
    accentRgb,
    darkerColor,
    glowColor,
    nextAccentColor,
    nextAccentRgb,
    nextDarkerColor
  } = useJurusanDetailState();

  if (!major) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 p-6 transition-colors duration-300">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-10 rounded-4xl max-w-md w-full text-center shadow-2xl relative z-10">
          <div className="w-20 h-20 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Palette size={40} />
          </div>
          <h1 className="text-2xl font-black mb-3">Jurusan Tidak Ditemukan</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Program keahlian yang Anda cari tidak terdaftar atau telah diupdate. Silakan kembali ke beranda untuk melihat daftar jurusan lengkap.
          </p>
          <Link href={`/${schoolSlug}`} className="btn-primary-pill w-full flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-x-hidden bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300"
      style={
        {
          "--major-accent": accentColor,
          "--major-accent-rgb": accentRgb,
          "--major-darker": darkerColor,
          "--major-glow": glowColor,
          "--next-accent": nextAccentColor,
          "--next-accent-rgb": nextAccentRgb,
          "--next-darker": nextDarkerColor
        } as React.CSSProperties
      }
    >
      <style>{`
        .major-gradient-bg {
          background-image: linear-gradient(135deg, var(--major-accent) 0%, var(--major-darker) 100%) !important;
        }
        .major-text-clip {
          background-image: linear-gradient(135deg, var(--major-accent) 0%, var(--major-darker) 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .major-bg-accent {
          background-color: rgba(var(--major-accent-rgb), 0.1) !important;
        }
        .dark .major-bg-accent {
          background-color: rgba(var(--major-accent-rgb), 0.2) !important;
        }
        .major-text-accent {
          color: var(--major-accent) !important;
        }
        .next-gradient-bg {
          background-image: linear-gradient(135deg, var(--next-accent) 0%, var(--next-darker) 100%) !important;
        }
        .next-text-clip {
          background-image: linear-gradient(135deg, var(--next-accent) 0%, var(--next-darker) 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .next-bg-accent {
          background-color: rgba(var(--next-accent-rgb), 0.1) !important;
        }
        .dark .next-bg-accent {
          background-color: rgba(var(--next-accent-rgb), 0.2) !important;
        }
        .next-text-accent {
          color: var(--next-accent) !important;
        }
      `}</style>

      {/* Floating Action Buttons */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href={`/${schoolSlug}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all group cursor-pointer"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <ToggleTheme
          animationType="circle-spread"
          duration={1000}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
        />
      </div>

      {/* MAIN SECTIONS */}
      <main className="grow w-full">
        {/* 1. HERO SECTION */}
        <JurusanHero schoolSlug={schoolSlug} major={major} kuotaData={kuotaData} />

        {/* 2. PROFILE VIDEO */}
        <JurusanVideo major={major} />

        {/* 3. CORE CURRICULUM */}
        <JurusanCurriculum major={major} />

        {/* 4. ACTIVITY GALLERY */}
        <JurusanGallery major={major} />

        {/* 5. CAREER OPPORTUNITIES */}
        <JurusanCareers major={major} />

        {/* 6. FACILITIES & PARTNERS */}
        <JurusanFacilities major={major} accentColor={accentColor} />

        {/* 7. FINAL CTA & NEXT MAJOR PREVIEW */}
        {nextMajor && (
          <JurusanCta
            schoolSlug={schoolSlug}
            major={major}
            nextMajor={nextMajor}
            nextCode={nextCode}
          />
        )}
      </main>

      {/* FOOTER */}
      <SchoolFooter schoolSlug={schoolSlug} />
    </div>
  );
}
