"use client";

import React, { useState, useRef } from "react";
import { Check, Building2, Sparkles } from "lucide-react";
import Link from "next/link";
import { TimelineAnimation } from "@/components/ui/product-packs-utils/timeline-animation";

export const ProductPacks = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={timelineRef}
      className="py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 text-[#2e3749] dark:text-white min-h-screen flex flex-col justify-center font-sans"
    >
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <TimelineAnimation
            animationNum={1}
            timelineRef={timelineRef}
            as="h1"
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#2e3749] dark:text-white"
          >
            Pilihan Paket Fleksibel
          </TimelineAnimation>

          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            as="p"
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            Mulai dari uji coba gratis hingga solusi pro terpadu tanpa biaya tersembunyi untuk digitalisasi sekolah Anda.
          </TimelineAnimation>

          {/* Toggle Monthly / Annual */}
          <TimelineAnimation
            animationNum={3}
            timelineRef={timelineRef}
            className="flex items-center justify-center gap-3 mt-8"
          >
            <span className={`text-xs sm:text-sm font-semibold ${!isAnnual ? "text-[#2e3749] dark:text-white" : "text-slate-400"}`}>
              BULANAN
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-[#FFD33B] shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${isAnnual ? "text-[#2e3749] dark:text-white" : "text-slate-400"}`}>
              TAHUNAN
              <span className="text-[10px] bg-[#FFD33B] text-[#2e3749] font-bold px-2 py-0.5 rounded-full shadow-sm">
                HEMAT 20%
              </span>
            </span>
          </TimelineAnimation>
        </div>

        {/* Pricing Layout (2 Rows on Left + Big Box on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Starter & Pro Rows */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Row 1: STARTER / FREE */}
            <TimelineAnimation
              animationNum={4}
              timelineRef={timelineRef}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full sm:w-1/3 space-y-4">
                <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-wider rounded-md uppercase">
                  FREE TRIAL
                </span>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#2e3749] dark:text-white">Rp 0</span>
                    <span className="text-slate-400 text-sm">/ 30 Hari</span>
                  </div>
                </div>
                <Link
                  href="/daftar"
                  className="inline-flex justify-center items-center w-full py-2.5 px-4 bg-[#2e3749] hover:bg-[#202735] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  Coba Gratis
                </Link>
              </div>

              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-8 space-y-3">
                {[
                  "Kuota hingga 100 Pendaftar",
                  "Formulir pendaftaran standar",
                  "Verifikasi data calon siswa manual",
                  "Export data pendaftar ke Excel",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#2e3749] dark:text-[#FFD33B] flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </TimelineAnimation>

            {/* Row 2: PRO / MOST POPULAR */}
            <TimelineAnimation
              animationNum={5}
              timelineRef={timelineRef}
              className="bg-white dark:bg-slate-900 border-2 border-[#FFD33B] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shadow-md relative overflow-hidden"
            >
              <div className="w-full sm:w-1/3 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 bg-[#FFD33B] text-[#2e3749] text-xs font-bold tracking-wider rounded-md uppercase">
                    PRO
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#2e3749] dark:text-white">
                      {isAnnual ? "Rp 60rb" : "Rp 75rb"}
                    </span>
                    <span className="text-slate-400 text-sm">/ Bulan</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isAnnual ? "Ditagih Rp 720.000 / tahun" : "Ditagih bulanan"}
                  </p>
                </div>

                <Link
                  href="/daftar"
                  className="inline-flex justify-center items-center w-full py-2.5 px-4 bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Pilih Paket Pro
                </Link>
              </div>

              <div className="w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-8 space-y-3 relative">
                <span className="hidden sm:inline-block absolute -top-4 right-0 text-[11px] font-semibold text-[#2e3749] bg-[#FFD33B]/30 px-3 py-1 rounded-full">
                  Paling Populer
                </span>

                {[
                  "Semua fitur di paket Free Trial",
                  "Kuota pendaftar siswa tanpa batas",
                  "CBT Ujian Online & Plotting Kelas otomatis",
                  "Format Export Data Dapodik Ready",
                  "Notifikasi WhatsApp Broadcast ke Orang Tua",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-[#FFD33B] text-[#2e3749] flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </TimelineAnimation>

          </div>

          {/* Right Column: Custom Enterprise / Big School Box */}
          <TimelineAnimation
            animationNum={6}
            timelineRef={timelineRef}
            className="lg:col-span-4 bg-[#2e3749] text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden border border-slate-800 min-h-[380px]"
          >
            {/* Decorative Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FFD33B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-[#FFD33B]">
                <Building2 size={24} />
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Kebutuhan Khusus / Yayasan Besar?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Dapatkan kustomisasi domain (.sch.id), integrasi Payment Gateway, server dedicated, serta pendampingan sistem langsung oleh tim ahli kami.
                </p>
              </div>
            </div>

            <div className="pt-8 relative z-10 space-y-3">
              <Link
                href="/kontak"
                className="w-full py-3.5 px-6 bg-white hover:bg-slate-100 text-[#2e3749] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Sparkles size={16} className="text-[#FFD33B] fill-[#FFD33B]" />
                Konsultasi Kebutuhan
              </Link>
              <p className="text-[11px] text-center text-slate-400">
                • Solusi kustom khusus multi-sekolah & yayasan
              </p>
            </div>
          </TimelineAnimation>

        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-10">
          Semua paket sudah termasuk update sistem berkala, perlindungan data, dan panduan penggunaan.
        </p>

      </div>
    </section>
  );
};

export default ProductPacks;