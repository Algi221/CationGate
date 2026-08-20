"use client";

import React, { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function SystemFlowSection() {
  const steps = [
    {
      num: "01",
      label: "REGISTRASI",
      title: "DAFTARKAN",
      subtitle: "SEKOLAHMU",
      desc: "Langkah pertama menuju digitalisasi. Isi formulir pendaftaran dengan data resmi sekolah dan identitas perwakilan sah untuk memulai.",
      bg: "bg-[#8EC9F6]",
      text: "text-[#111111]",
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

  const targetRef = useRef<HTMLDivElement>(null);

  // Pantau progres scroll di dalam area 400vh
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // 1. Animasi Geser Background & Konten ke Kiri (300vw karena layar pertama hitungannya 0vw)
  const containerX = useTransform(scrollYProgress, [0, 1], ["0vw", "-300vw"]);

  // 2. Animasi Posisi X Pesawat (Pesawat maju ke kanan di dalam container agar terlihat stay di kiri layar user)
  const planeX = useTransform(scrollYProgress, [0, 1], ["15vw", "315vw"]);

  // 3. Animasi Y Pesawat (Membentuk 3 gelombang sinus naik turun)
  const planeY = useTransform(
    scrollYProgress,
    [0, 0.133, 0.3, 0.466, 0.633, 0.8, 0.966, 1],
    ["0vh", "-20vh", "0vh", "20vh", "0vh", "-20vh", "0vh", "0vh"]
  );

  // 4. Animasi Rotasi Pesawat (Menukik ke atas dan ke bawah ngikutin jalur)
  const planeRotate = useTransform(
    scrollYProgress,
    [0, 0.066, 0.133, 0.216, 0.3, 0.383, 0.466, 0.55, 0.633, 0.716, 0.8, 0.883, 0.966, 1],
    [0, -25, 0, 25, 0, 25, 0, -25, 0, -25, 0, 25, 0, 0]
  );

  return (
    // Section utama setinggi 4x viewport agar user bisa scroll panjang
    <section ref={targetRef} className="relative w-full h-[400vh] bg-[#FAF8F2]">
      
      {/* Sticky container nahan frame di layar */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col">
        
        {/* HEADER TETAP (Fixed) - Pakai mix-blend-difference biar warnanya auto-invers pas lewat background hitam/terang */}
        <div className="absolute top-8 md:top-12 left-0 w-full z-50 text-center px-4 pointer-events-none mix-blend-difference text-white">
          <span className="px-4 py-1.5 rounded-full bg-white/10 font-extrabold text-xs uppercase tracking-widest inline-block border border-white/20 backdrop-blur-md mb-3">
            Alur & Cara Kerja
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-sm">
            4 Langkah Mudah Bergabung
          </h2>
          <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold animate-bounce mt-2 opacity-80">
            <span>Scroll ke bawah terus</span>
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* CONTAINER HORIZONTAL SCROLL */}
        <motion.div
          className="flex h-full relative w-[400vw]"
          style={{ x: containerX }}
        >
          {/* 1. LAYER BACKGROUND */}
          <div className="flex h-full w-[400vw] absolute inset-0 z-0">
            {steps.map((step, idx) => (
              <div key={idx} className={`w-[100vw] h-full ${step.bg}`} />
            ))}
          </div>

          {/* 2. LAYER JALUR PUTUS-PUTUS (SVG Wave) */}
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center w-[400vw] mix-blend-difference">
            {/* SVG ini melukiskan 3 gelombang penuh secara matematis menyambung dari kiri ke kanan */}
            <svg className="w-full h-[50vh]" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path
                d="M 0 50 C 25 10, 75 10, 100 50 C 125 90, 175 90, 200 50 C 225 10, 275 10, 300 50 C 325 90, 375 90, 400 50"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* 3. LAYER PESAWAT KERTAS */}
          <motion.div
            className="absolute z-40 w-12 h-12 md:w-16 md:h-16 -mt-6 md:-mt-8 origin-center pointer-events-none"
            style={{
              top: "50%",
              left: planeX,
              y: planeY,
              rotate: planeRotate,
            }}
          >
            {/* Ikon pesawat div-nya di-rotate 45deg supaya moncongnya mengarah lurus ke kanan */}
            <div className="w-full h-full rotate-45 text-[#FF3366] drop-shadow-[0_10px_10px_rgba(255,51,102,0.5)]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
              </svg>
            </div>
          </motion.div>

          {/* 4. LAYER KONTEN TEKS SETIAP STEP */}
          <div className="absolute inset-0 z-30 flex h-full pointer-events-none w-[400vw]">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`w-[100vw] h-full flex flex-col justify-center px-6 sm:px-12 md:px-24 pointer-events-auto ${step.text}`}
              >
                {/* Posisi teks ditaruh agak ke kanan (ml-auto) supaya nggak nabrak visual pesawat */}
                <div className="max-w-4xl ml-auto w-full flex flex-col gap-4 mt-16 md:mt-24">
                  <div className="flex items-center gap-4 font-extrabold tracking-widest uppercase text-xs md:text-sm">
                    <span className="px-3 py-1 rounded-md bg-black/10 backdrop-blur-sm shadow-sm">
                      Langkah {step.num}
                    </span>
                    <span className="opacity-80 font-bold">{step.label}</span>
                  </div>

                  <h3 className="text-4xl sm:text-5xl md:text-[5rem] lg:text-[7rem] font-black uppercase leading-[0.9] tracking-tighter mt-4">
                    {step.title} <br /> {step.subtitle}
                  </h3>

                  <p className="max-w-xl text-base md:text-xl font-medium leading-relaxed opacity-90 mt-4 bg-white/10 p-5 sm:p-6 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}