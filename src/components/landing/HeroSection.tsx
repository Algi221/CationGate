"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroSPMB() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/assets/lottie_animation/Dunia.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Gagal memuat animasi:", err));
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-white overflow-hidden flex flex-col justify-between px-6 sm:px-12 pt-28 pb-8 font-sans selection:bg-amber-200">
      <div className="w-full max-w-[1550px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 my-auto z-20">
        <div className="lg:col-span-4 text-center lg:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.8rem] font-black text-gray-900 leading-[1.02] tracking-tight">
            BIKIN WEBSITE <br />
            <span className="text-amber-500">SPMB SEKOLAH</span> <br />
            JADI LEBIH MUDAH.
          </h1>

          <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto lg:mx-0 font-medium leading-relaxed">
            Sediakan sistem penerimaan siswa baru digital berstandar tinggi
            untuk SMK dan sekolah Anda. Siap pakai, transparan, dan profesional.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" /> Setup
              Kilat
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" /> Custom
              Domain
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", damping: 20 }}
            className="w-[320px] sm:w-100 lg:w-115 h-80 sm:h-100 lg:h-115 flex items-center justify-center relative my-2"
          >
            <div className="absolute inset-0 bg-linear-to-tr from-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                className="w-full h-full object-contain relative z-10 drop-shadow-lg"
              />
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-4 text-center lg:text-left space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight tracking-tight">
            TAMPILAN MODERN, <br />
            <span className="text-amber-500">FITUR LENGKAP.</span>
          </h2>

          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
            Dilengkapi manajemen siswa pendaftar dan siswa aktif, export data,
            hingga integrasi pembayaran digital.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-gray-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"></span>
              <span>Eksplorasi langsung tanpa perlu login:</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/demo/dashboard"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#172A35] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#172A35]/20 flex items-center justify-center gap-2 hover:bg-black hover:scale-105 active:scale-95 transition-all"
              >
                Dashboard Demo <ArrowRight size={15} />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:border-gray-900 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <Play size={14} className="fill-gray-900" /> Landingpage Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-[1550px] mx-auto pt-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-200/60 gap-4 px-2 z-30 bg-white">
        <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Dipercaya oleh puluhan SMK & instansi pendidikan di Indonesia
          </span>
        </div>

        {/* Indikator Scroll: Disembunyikan di Mobile (hidden), dimunculkan di Desktop (md:flex) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 hidden md:flex flex-col items-center gap-1 pointer-events-none">
          <span className="text-[9px] font-black tracking-[0.25em] text-gray-400 uppercase">
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-[1.5px] h-4 bg-linear-to-b from-gray-400 to-transparent rounded-full"
          />
        </div>

        <div className="flex items-center justify-around w-full md:w-auto gap-8 sm:gap-14">
          <div className="text-center md:text-right">
            <div className="text-lg sm:text-xl font-black text-gray-900">
              120+
            </div>
            <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
              Sekolah Mitra
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-lg sm:text-xl font-black text-amber-500">
              99.9%
            </div>
            <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
              Server Uptime
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-lg sm:text-xl font-black text-gray-900">
              24/7
            </div>
            <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
              Support Teknis
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
