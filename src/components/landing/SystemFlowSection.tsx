"use client";

import React from "react";
import { ArrowDown } from "lucide-react";

export function SystemFlowSection() {
  const steps = [
    {
      num: "01",
      label: "REGISTRASI",
      title: "DAFTARKAN",
      subtitle: "SEKOLAHMU",
      desc: "Langkah pertama menuju digitalisasi. Isi formulir pendaftaran dengan data resmi sekolah dan identitas perwakilan sah untuk memulai.",
      bg: "bg-[#8EC9F6]",
      text: "text-[#111111]", // Diganti ke hitam biar lebih terbaca jelas (high contrast)
    },
    {
      num: "02",
      label: "INFRASTRUKTUR",
      title: "KLAIM",
      subtitle: "SUBDOMAIN",
      desc: "Sistem otomatis membuatkan environment khusus (misal: sman1.cationgate.com). Semua data sekolahmu terisolasi, privat, dan aman.",
      bg: "bg-[#111111]",
      text: "text-white",
    },
    {
      num: "03",
      label: "KEAMANAN",
      title: "VERIFIKASI",
      subtitle: "DATA",
      desc: "Tim CationGate akan meninjau legalitas dan keabsahan data. Proses ini krusial untuk menjaga integritas dan keamanan ekosistem edukasi.",
      bg: "bg-[#F3EFEA]",
      text: "text-[#111111]",
    },
    {
      num: "04",
      label: "AKTIVASI",
      title: "BAYAR &",
      subtitle: "MULAI",
      desc: "Setelah terverifikasi, selesaikan pembayaran subscription. Subdomain akan aktif penuh dan siap digunakan oleh seluruh guru serta siswa.",
      bg: "bg-[#FFD33B]",
      text: "text-[#111111]",
    },
  ];

  return (
    <section className="relative w-full bg-[#FAF8F2]">
      {/* HEADER PENJELAS SUPAYA ORANG TUA PAHAM INI FLOW/ALUR PROSES */}
      <div className="pt-24 pb-16 text-center max-w-3xl mx-auto px-4 space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-[#23191C]/10 text-[#23191C] font-extrabold text-xs uppercase tracking-widest inline-block border border-[#23191C]/20">
          Alur & Cara Kerja
        </span>

        <h2 className="text-3xl sm:text-5xl font-black text-[#23191C] tracking-tight">
          4 Langkah Mudah Bergabung
        </h2>

        <p className="text-[#58504E] text-base sm:text-lg leading-relaxed font-medium max-w-xl mx-auto">
          Sistem onboarding CationGate dirancang transparan. Gulir (scroll) ke
          bawah untuk melihat urutan pendaftaran hingga sekolah aktif.
        </p>

        {/* Petunjuk Visual Scroll */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold text-[#58504E] animate-bounce">
          <span>Gulir ke bawah</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* STACKING CARDS */}
      <div className="relative w-full">
        {steps.map((step, index) => {
          return (
            <div
              key={index}
              className={`sticky w-full h-[100dvh] flex flex-col justify-center px-6 sm:px-12 md:px-24 overflow-hidden rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.12)] ${step.bg} ${step.text}`}
              style={{
                top: `${index * 40}px`,
                height: `calc(100dvh - ${index * 40}px)`,
                zIndex: index + 1,
              }}
            >
              <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between py-12 md:py-16">
                {/* Indikator Langkah yang Jelas untuk Pengguna/Orang Tua */}
                <div className="flex items-center justify-between font-extrabold tracking-widest uppercase text-xs md:text-sm pt-4">
                  <span className="px-3 py-1 rounded-md bg-black/10 backdrop-blur-xs">
                    Langkah {step.num} dari 04 &mdash; {step.label}
                  </span>
                  <span className="opacity-60 hidden sm:inline">
                    PROSES ONBOARDING
                  </span>
                </div>

                {/* Judul Utama */}
                <div className="flex flex-col my-auto">
                  <h3 className="text-[16vw] md:text-[9vw] lg:text-[7.5rem] font-black uppercase leading-[0.85] tracking-tighter m-0">
                    {step.title}
                  </h3>
                  <h3 className="text-[16vw] md:text-[9vw] lg:text-[7.5rem] font-black uppercase leading-[0.85] tracking-tighter m-0">
                    {step.subtitle}
                  </h3>
                </div>

                {/* Deskripsi */}
                <div className="max-w-xl md:ml-auto text-sm md:text-xl font-medium leading-relaxed opacity-90 pb-8">
                  <p>{step.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
