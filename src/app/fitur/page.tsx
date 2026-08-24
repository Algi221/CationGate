"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import FeatureCarousel from "@/components/ui/feature-carousel";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-[#2e3749] dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16 flex-1">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-[#FFD33B]/20 dark:bg-[#FFD33B]/10 text-[#2e3749] dark:text-[#FFD33B] text-xs font-extrabold uppercase tracking-wider">
            Fitur Unggulan
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#2e3749] dark:text-white">
            Solusi Lengkap untuk Seluruh Kebutuhan Sekolah
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg">
            Fokus ke kebutuhan dashboard CationGate: data calon siswa, siswa aktif, pembagian kelas, kelola informasi, kelola UI, dan landing page gratis.
          </p>
        </div>

        {/* BUNGKUS CAROUSEL: "hidden md:block" DIHAPUS agar muncul di mobile */}
        <div className="w-full min-h-[500px] max-w-6xl mx-auto relative z-10 block">
          <FeatureCarousel
            title="Ekosistem Dashboard CationGate"
            description="Lihat ringkasan fitur inti yang paling sering dipakai sekolah"
            bgClass="!text-white dark:!text-white"
            image={{
              alt: "Fitur dashboard CationGate",

              step1light1: "/assets/fitur/calon-siswa.png",
              step1light2: "/assets/fitur/calon-siswa-mobile.png",

              step2light1: "/assets/fitur/siswa-aktif.png",
              step2light2: "/assets/fitur/siswa-aktif-mobile.png",

              step3light1: "/assets/fitur/pembagian-kelas.png",
              step3light2: "/assets/fitur/pembagian-kelas-mobile.png",

              step4light1: "/assets/fitur/kelola-informasi.png",
              step4light2: "/assets/fitur/kelola-informasi-mobile.png",

              step5light1: "/assets/fitur/kelola-ui.png",
              step5light2: "/assets/fitur/kelola-ui-mobile.png",

              step6light1: "/assets/fitur/imageLanding.png",
              step6light2: "/assets/fitur/imageLanding-mobile.png",
            }}
          />
        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}