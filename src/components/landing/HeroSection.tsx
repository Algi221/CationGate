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
    description: "Pilihan utama manajemen instansi pendidikan dengan sistem otomatis.",
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
    description: "Ubah data mentah jadi laporan berharga untuk kesehatan operasional dengan AI.",
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

// --- MAIN HERO COMPONENT ---
export function HeroSection({ onOpenVideo }: { onOpenVideo?: () => void }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#FAF8F2] text-[#23191C] pb-32"
    >
      {/* Warm Glow Effect */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#FFD33B]/10 blur-[140px]" />

      {/* Main Content - Diperlebar menggunakan max-w-[1400px] */}
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center px-5 pt-28 sm:px-6 lg:px-8">
        
        {/* ================= BAGIAN ATAS (TEKS & TOMBOL) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex w-full max-w-5xl flex-col items-center text-center"
        >

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#23191C] whitespace-nowrap">
            The intelligent platform for{" "}
            <span className="relative inline-block">
              <span className="relative z-10">modern schools</span>
              <span className="absolute bottom-[4px] left-0 z-0 h-[30%] w-full rounded-[3px] bg-[#FFD33B]" />
            </span>
          </h1>

          {/* Description - Single Line */}
          <p className="mt-6 max-w-4xl text-base sm:text-lg font-medium leading-relaxed text-[#58504E]">
            One platform to manage learning, monitor progress, and empower teachers with intelligent tools.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/demo/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group h-12 w-full rounded-lg border-0 bg-[#23191C] px-8 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3D3235] hover:shadow-xl active:scale-95 sm:w-auto"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
            </Link>

            <button
              type="button"
              onClick={onOpenVideo}
              className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-[#E7E1D6] bg-white px-7 text-sm font-semibold text-[#23191C] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D9D3C7] hover:bg-[#F7F4ED] hover:shadow-md sm:w-auto"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#23191C] text-white transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
              </span>
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* ================= BAGIAN BAWAH (MAGIC UI BENTO GRID) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="mt-16 w-full"
        >
          {/* Rahasianya di lg:auto-rows-[320px] dan gap-6 biar gede dan longgar */}
          <BentoGrid className="w-full max-w-7xl justify-center h-160 lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-[320px] gap-4 sm:gap-6">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}