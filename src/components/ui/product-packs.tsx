"use client";

import React, { useRef } from "react";
import { Check, Building2 } from "lucide-react";
import Link from "next/link";
import { TimelineAnimation } from "@/components/ui/product-packs-utils/timeline-animation";

export const ProductPacks = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={timelineRef}
      className="py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 text-[#2e3749] dark:text-white min-h-screen flex flex-col justify-center font-sans"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-14">
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
            Mulai dari uji coba gratis hingga solusi pro terpadu tanpa biaya
            tersembunyi untuk digitalisasi sekolah Anda.
          </TimelineAnimation>
        </div>

        {/* Pricing Layout (2 Rows on Left + Big Box on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Kolom Kiri: Starter & Pro Rows */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Row 1: STARTER / FREE */}
            <TimelineAnimation
              animationNum={3}
              timelineRef={timelineRef}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-sm"
            >
              {/* Info Kiri - Diperlebar menjadi 5/12 agar tidak patah */}
              <div className="w-full md:w-5/12 flex flex-col h-full justify-between space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-wider rounded-md uppercase mb-4">
                    FREE TRIAL
                  </span>
                  <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-4xl font-bold text-[#2e3749] dark:text-white">
                      Gratis
                    </span>
                    <span className="text-slate-400 text-sm">/ 30 Hari</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Uji coba fitur dasar platform
                  </p>
                </div>

                <Link
                  href="/daftar"
                  className="inline-flex justify-center items-center w-full py-3 px-4 bg-[#2e3749] hover:bg-[#202735] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                >
                  Mulai Gratis
                </Link>
              </div>

              {/* Fitur Kanan */}
              <div className="w-full md:w-7/12 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                <div className="space-y-3.5">
                  {[
                    "Pendaftaran Online PPDB",
                    "Kelola Data Calon Siswa",
                    "Export Excel",
                    "Landing Page Sekolah",
                    "Maks 100 Pendaftar",
                    "Masa Aktif 30 Hari",
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </TimelineAnimation>

            {/* Row 2: PRO TAHUNAN */}
            <TimelineAnimation
              animationNum={4}
              timelineRef={timelineRef}
              className="bg-white dark:bg-slate-900 border-2 border-[#FFD33B] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-md relative overflow-hidden"
            >
              {/* Badge Paling Populer - Dipindah ke pojok kanan atas agar rapi */}
              <div className="absolute top-0 right-0 bg-[#FFD33B] text-[#2e3749] text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-sm">
                Paling Populer
              </div>

              {/* Info Kiri - Diperlebar menjadi 5/12 agar teks harga muat 1 baris */}
              <div className="w-full md:w-5/12 flex flex-col h-full justify-between space-y-6 pt-2">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#FFD33B] text-[#2e3749] text-xs font-bold tracking-wider rounded-md uppercase mb-4">
                    PRO TAHUNAN
                  </span>
                  <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-4xl font-bold text-[#2e3749] dark:text-white">
                      Rp 750.000
                    </span>
                    <span className="text-slate-400 text-sm">/ Tahun</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Solusi terbaik untuk instansi sekolah
                  </p>
                </div>

                <Link
                  href="/daftar"
                  className="inline-flex justify-center items-center w-full py-3 px-4 bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                  Pilih Paket Pro
                </Link>
              </div>

              {/* Fitur Kanan */}
              <div className="w-full md:w-7/12 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                <div className="space-y-3.5">
                  {[
                    "Semua Fitur Free Trial",
                    "Unlimited Pendaftar",
                    "Custom Branding & Logo",
                    "Multi-Admin Dashboard",
                    "WhatsApp Notifikasi",
                    "Prioritas Support 24/7",
                    "Pembagian Kelas Otomatis",
                    "Laporan & Statistik Lengkap",
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#FFD33B] text-[#2e3749] flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </TimelineAnimation>
          </div>

          {/* Kolom Kanan: Kebutuhan Khusus - Desain Dibuat Clean & Solid */}
          <TimelineAnimation
            animationNum={5}
            timelineRef={timelineRef}
            className="lg:col-span-4 bg-[#2e3749] text-white rounded-3xl p-8 flex flex-col shadow-lg border border-slate-700/50"
          >
            {/* Ikon dan Judul */}
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#FFD33B] mb-6">
                <Building2 size={24} strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white leading-snug">
                Kebutuhan Khusus / Yayasan Besar?
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                Dapatkan kustomisasi domain (.sch.id), integrasi Payment
                Gateway, server dedicated, serta pendampingan sistem langsung
                oleh tim ahli kami.
              </p>
            </div>

            {/* Tombol Aksi di Bawah (Dibersihkan dari ikon AI Slop) */}
            <div className="mt-10 space-y-4">
              <Link
                href="/kontak"
                className="w-full py-3.5 px-6 bg-white hover:bg-slate-100 text-[#2e3749] text-sm font-bold rounded-xl flex items-center justify-center transition-colors active:scale-95"
              >
                Konsultasi Kebutuhan
              </Link>
              <p className="text-[11px] text-center text-slate-400 font-medium">
                Solusi kustom khusus multi-sekolah & yayasan
              </p>
            </div>
          </TimelineAnimation>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-12">
          Semua paket sudah termasuk update sistem berkala, perlindungan data,
          dan panduan penggunaan.
        </p>
      </div>
    </section>
  );
};

export default ProductPacks;
