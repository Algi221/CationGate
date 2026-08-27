"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import FeatureCarousel from "@/components/ui/feature-carousel";

function FeaturesContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const stepIndex = parseInt(hash) - 1;
        if (stepIndex >= 0 && stepIndex < 6) {
          setCurrentStep(stepIndex);
          setTimeout(() => {
            const carouselElement = document.getElementById("feature-carousel");
            if (carouselElement) {
              carouselElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 50);
        }
      }
    };

    // Handle hash saat pertama kali load
    handleHashChange();

    // Handle hash change saat user klik link dengan hash berbeda
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [searchParams]);

  return (
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
      <div className="w-full min-h-125 max-w-6xl mx-auto relative z-10 block" id="feature-carousel">
        <FeatureCarousel
          initialStep={currentStep ?? undefined}
          title="Ekosistem Dashboard CationGate"
          description="Lihat ringkasan fitur inti yang paling sering dipakai sekolah"
          bgClass="!text-white dark:!text-white"
          image={{
            alt: "Fitur dashboard CationGate",

            step1light1: "/assets/fitur/data_calon_siswa.png",
            step1light2: "/assets/fitur/data_calon_siswa_mobile.png",

            step2light1: "/assets/fitur/siswa_aktif_desktop.png",
            step2light2: "/assets/fitur/siswa_aktif_mobile.png",

            step3light1: "/assets/fitur/pembagian_kelas_desktop.png",
            step3light2: "/assets/fitur/pembagian_kelas.png",

            step4light1: "/assets/fitur/kelola_informasi.png",
            step4light2: "/assets/fitur/kelola_informasi_mobile.png",

            step5light1: "/assets/fitur/landing_page.png",
            step5light2: "/assets/fitur/landing_mobile.png",
          }}
        />
      </div>
    </main>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-[#2e3749] dark:text-white flex flex-col justify-between">
      <Navbar />
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-400 font-mono">Memuat Fitur...</div>}>
        <FeaturesContent />
      </Suspense>
      <CinematicFooter />
    </div>
  );
}