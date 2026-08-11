"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Radix Icons untuk MagicUI Bento
import {
  StarIcon,
  LockClosedIcon,
  LightningBoltIcon,
  MagicWandIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

// --- MAGIC UI FEATURES DATA ---
const features = [
  {
    Icon: PersonIcon,
    name: "500K+ Sekolah",
    description:
      "Pilihan utama manajemen instansi pendidikan dengan sistem otomatis.",
    href: "/",
    cta: "Lihat Detail",
    background: (
      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
        className="absolute inset-0 h-full w-full object-cover opacity-20 transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
        alt="Students dummy"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: StarIcon,
    name: "95% Diskon",
    description: "Diskon langganan khusus untuk pengguna baru.",
    href: "/",
    cta: "Klaim Promo",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-[#8EC9F6]/30 to-transparent" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: LockClosedIcon,
    name: "CationGate Secure",
    description: "Data dan dana dienkripsi aman. Terhubung langsung Dapodik.",
    href: "/",
    cta: "Pelajari Keamanan",
    background: (
      <img
        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop"
        className="absolute -right-10 -top-10 h-[150%] w-[150%] object-cover opacity-10 transition-all duration-300 group-hover:opacity-20"
        alt="Security dummy"
      />
    ),
    className: "lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: MagicWandIcon,
    name: "Fitur Pintar Web",
    description:
      "Ubah data mentah jadi laporan berharga untuk kesehatan operasional dengan AI.",
    href: "/",
    cta: "Coba Fitur",
    background: (
      <img
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
        className="absolute -bottom-10 -right-10 h-full w-full object-cover opacity-15 transition-all duration-300 group-hover:scale-110"
        alt="Dashboard dummy"
      />
    ),
    className: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: LightningBoltIcon,
    name: "Rp 45rb",
    description: "Paket operasional termurah per bulan.",
    href: "/",
    cta: "Langganan",
    background: (
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD33B]/20 to-[#FF9D67]/10" />
    ),
    className: "lg:col-start-4 lg:col-end-5 lg:row-start-2 lg:row-end-3",
  },
];

export default function HeroSection() {
  return (
    <main>
      <div className="flex min-h-screen items-center justify-center py-20 bg-white">
        <div className="w-full text-center px-4">
          {/* --- HEADER SECTION --- */}
          <div className="relative inline-block mb-12 md:mb-16">
            {/* Ornamen kuning */}
            <div className="absolute -left-12 top-4 w-12 md:-left-20 md:w-16 hidden md:block">
              <svg
                viewBox="0 0 100 30"
                fill="none"
                stroke="#FDE047"
                strokeWidth="6"
                strokeLinecap="round"
              >
                <path d="M5,15 Q15,0 25,15 T45,15 T65,15 T85,15" />
              </svg>
            </div>

            {/* Ornamen hitam */}
            <div className="absolute -right-8 -top-4 w-10 md:-right-16 md:w-12 hidden md:block">
              <svg
                viewBox="0 0 50 60"
                fill="none"
                stroke="#111827"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10,10 L40,20 L10,30 L40,40 L10,50 L40,60" />
              </svg>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Build up your <br className="hidden md:block" /> business together
            </h2>
          </div>

          {/* --- MAIN HERO BANNER --- */}
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col md:flex-row items-stretch w-full">
              {/* --- BAGIAN KIRI (GAMBAR) --- */}
              <div
                className="relative w-full md:w-1/2 min-h-[350px] md:min-h-[450px] overflow-hidden 
                                rounded-t-[2.5rem] md:rounded-t-none 
                                md:rounded-tl-[3rem] md:rounded-tr-none md:rounded-bl-none md:rounded-br-[8rem] z-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
                  alt="Team collaboration"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              {/* --- BAGIAN KANAN (KOTAK BIRU) --- */}
              {/* Perubahan di sini: md:rounded-br-none agar kanan bawah jadi siku/lancip */}
              <div
                className="relative flex w-full md:w-1/2 flex-col justify-center bg-[#CBEBFF] 
                                p-10 md:p-14 lg:p-20 text-left 
                                rounded-b-[2.5rem] md:rounded-b-none 
                                md:rounded-tl-none md:rounded-tr-[3rem] md:rounded-bl-[8rem] rounded-br-none md:rounded-br-none z-0"
              >
                {/* Ornamen Gelombang Putih */}
                <div className="absolute bottom-6 right-6 w-32 opacity-70">
                  <svg
                    viewBox="0 0 100 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" />
                  </svg>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-4 relative z-10">
                  <div>
                    <h3 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                      5000+
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      satisfied clients
                    </p>
                  </div>
                  <div>
                    <h3 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                      10-year
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      experience
                    </p>
                  </div>
                </div>

                <p className="mb-10 text-base md:text-lg font-medium leading-relaxed text-gray-800/80 max-w-sm relative z-10">
                  A startup company is a newly formed business with particular
                  momentum behind it based on perceived demand for its product.
                </p>

                <div className="flex flex-wrap items-center gap-6 relative z-10">
                  <button className="rounded-full bg-black px-8 py-3.5 text-base font-semibold text-white transition hover:bg-gray-800">
                    Hire us
                  </button>
                  <button className="group flex items-center gap-3 rounded-full bg-transparent px-2 py-2 text-base font-semibold text-gray-900 transition hover:bg-white/30">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-105">
                      <svg
                        className="ml-1 h-4 w-4 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    Show case
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
