"use client";

import React from "react";

export function SystemFlowSection() {
  const steps = [
    {
      num: "01",
      label: "REGISTRASI",
      title: "DAFTARKAN",
      subtitle: "SEKOLAHMU",
      desc: "Langkah pertama menuju digitalisasi. Isi formulir pendaftaran dengan data resmi sekolah dan identitas perwakilan sah untuk memulai.",
      bg: "bg-[#FF5A1F]",
      text: "text-white",
    },
    {
      num: "02",
      label: "INFRASTRUKTUR",
      title: "KLAIM",
      subtitle: "SUBDOMAIN",
      desc: "Sistem otomatis membuatkan environment khusus. Semua data sekolahmu terisolasi, privat, dan aman.",
      bg: "bg-[#111111]",
      text: "text-white",
    },
    {
      num: "03",
      label: "KEAMANAN",
      title: "VERIFIKASI",
      subtitle: "DATA",
      desc: "Tim CationGate meninjau legalitas dan keabsahan data untuk menjaga integritas ekosistem edukasi.",
      bg: "bg-[#F3EFEA]",
      text: "text-[#111111]",
    },
    {
      num: "04",
      label: "AKTIVASI",
      title: "BAYAR &",
      subtitle: "MULAI",
      desc: "Setelah terverifikasi, selesaikan pembayaran subscription. Subdomain aktif penuh dan siap digunakan.",
      bg: "bg-[#FFD33B]",
      text: "text-[#111111]",
    },
  ];

  return (
    <section className="relative w-full bg-slate-50">
      <div className="py-24 text-center max-w-3xl mx-auto px-4 space-y-4">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Jalur Onboarding CationGate
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed font-medium">
          Proses transparan dari pendaftaran awal hingga aktivasi penuh platform.
        </p>
      </div>

      <div className="relative w-full">
        {steps.map((step, index) => (
          <div
            key={step.num}
            className={`sticky w-full h-[100dvh] flex flex-col justify-center px-6 sm:px-12 md:px-24 overflow-hidden rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] ${step.bg} ${step.text}`}
            style={{ top: `${index * 40}px`, height: `calc(100dvh - ${index * 40}px)`, zIndex: index }}
          >
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-center gap-8 md:gap-16 py-12">
              <div className="flex items-center gap-3 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mt-8">
                <span>{step.num} &mdash; {step.label}</span>
              </div>
              <div className="flex flex-col -space-y-2 md:-space-y-6">
                <h3 className="text-[18vw] md:text-[10vw] lg:text-[9rem] font-black uppercase leading-[0.85] tracking-tighter m-0">
                  {step.title}
                </h3>
                <h3 className="text-[18vw] md:text-[10vw] lg:text-[9rem] font-black uppercase leading-[0.85] tracking-tighter m-0">
                  {step.subtitle}
                </h3>
              </div>
              <div className="max-w-xl md:ml-auto md:-mt-12 lg:-mt-24 text-base md:text-2xl font-medium leading-relaxed opacity-90 z-10 relative">
                <p>{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
