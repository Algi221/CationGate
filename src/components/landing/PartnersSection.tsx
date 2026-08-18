"use client";

import React from "react";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image"; // Jangan lupa import Image

export function PartnersSection() {
  // Array data gambar sesuai folder /public/assets/partners/
  const partners = [
    { src: "/assets/partners/disdik.png", alt: "Dinas Pendidikan" },
    { src: "/assets/partners/download.jpg", alt: "Mitra" },
    { src: "/assets/partners/luwes.png", alt: "Luwes" },
    // Catatan: Nama file midtrans di bawah ini disesuaikan aja sama nama file aslinya yang lengkap ya bre
    { src: "/assets/partners/midtrans-logo-png_se.png", alt: "Midtrans" }, 
    { src: "/assets/partners/pionicon.jpg", alt: "Pionicon" },
    { src: "/assets/partners/yayasan.png", alt: "Yayasan Cendekia" },
  ];

  return (
    <section className="py-10 bg-transparent relative overflow-hidden">
      
      {/* Efek gradien putih/gelap di sisi kiri & kanan agar animasi memudar di ujung */}
      <div className="pointer-events-none absolute inset-0 z-10 h-full w-full bg-gradient-to-r from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-0 flex flex-col items-center gap-6">
        
        {/* Label Header Partner */}
        <p className="text-sm font-bold text-slate-400/80 dark:text-slate-500 uppercase tracking-widest text-center">
          Telah Dipercaya Oleh 120+ Institusi Pendidikan & Mitra
        </p>

        <Marquee className="[--duration:40s]">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="mx-8 relative h-12 w-32 md:h-16 md:w-40 flex items-center justify-center opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}