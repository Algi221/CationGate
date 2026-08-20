"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Users, GraduationCap, Layers3, Megaphone, Palette, Globe2, ArrowRight } from "lucide-react";
import Link from "next/link";

// 1. IMPORT KOMPONEN CAROUSEL-NYA DI SINI
import FeatureCarousel from "@/components/ui/feature-carousel";

export default function FeaturesPage() {
  const features = [
    {
      id: "calon-siswa",
      title: "Data Calon Siswa",
      desc: "Kelola calon siswa dari pendaftaran sampai verifikasi data, lengkap dengan status, dokumen, dan progres masuk sekolah.",
      icon: Users,
      color: "bg-sky-500",
      gradient: "from-sky-500/20 to-cyan-500/5",
    },
    {
      id: "siswa-aktif",
      title: "Siswa Aktif",
      desc: "Lihat dan perbarui data siswa aktif secara terpusat agar administrasi, riwayat kelas, dan data penting tetap rapi.",
      icon: GraduationCap,
      color: "bg-emerald-500",
      gradient: "from-emerald-500/20 to-teal-500/5",
    },
    {
      id: "pembagian-kelas",
      title: "Pembagian Kelas",
      desc: "Atur pembagian kelas dengan cepat berdasarkan kuota, jurusan, dan kebutuhan operasional sekolah.",
      icon: Layers3,
      color: "bg-indigo-500",
      gradient: "from-indigo-500/20 to-blue-500/5",
    },
    {
      id: "kelola-informasi",
      title: "Kelola Informasi",
      desc: "Publikasikan pengumuman, informasi sekolah, dan konten penting langsung dari dashboard tanpa ribet.",
      icon: Megaphone,
      color: "bg-amber-500",
      gradient: "from-amber-500/20 to-orange-500/5",
    },
    {
      id: "kelola-ui",
      title: "Kelola UI",
      desc: "Sesuaikan tampilan dashboard dan halaman sekolah supaya konsisten dengan identitas visual CationGate.",
      icon: Palette,
      color: "bg-fuchsia-500",
      gradient: "from-fuchsia-500/20 to-pink-500/5",
    },
    {
      id: "landing-page",
      title: "Landing Page Gratis",
      desc: "Dapatkan landing page gratis untuk sekolah agar informasi utama bisa langsung ditampilkan ke publik.",
      icon: Globe2,
      color: "bg-cyan-500",
      gradient: "from-cyan-500/20 to-sky-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16 flex-1">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            Fitur Unggulan
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Solusi Lengkap untuk Seluruh Kebutuhan Sekolah
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg">
            Fokus ke kebutuhan dashboard CationGate: data calon siswa, siswa aktif, pembagian kelas, kelola informasi, kelola UI, dan landing page gratis.
          </p>
        </div>

        {/* 2. TARUH FEATURE CAROUSEL DI SINI SEBAGAI HERO INTERAKTIF */}
        <div className="w-full h-[600px] max-w-6xl mx-auto relative z-10 hidden md:block">
         <FeatureCarousel
  title="Ekosistem Dashboard CationGate"
  description="Lihat ringkasan fitur inti yang paling sering dipakai sekolah"
  bgClass="!text-white dark:!text-white"
  image={{
    alt: "Fitur dashboard CationGate",
    
    // Fitur 1: Calon Siswa
    step1light1: "/assets/fitur/calon-siswa.png",       // Ganti dengan file mockup Desktop
    step1light2: "/assets/fitur/calon-siswa-mobile.png", // Ganti dengan file mockup Mobile

    // Fitur 2: Siswa Aktif
    step2light1: "/assets/fitur/siswa-aktif.png",
    step2light2: "/assets/fitur/siswa-aktif-mobile.png",

    // Fitur 3: Pembagian Kelas
    step3light1: "/assets/fitur/pembagian-kelas.png",
    step3light2: "/assets/fitur/pembagian-kelas-mobile.png",

    // Fitur 4: Kelola Informasi
    step4light1: "/assets/fitur/kelola-informasi.png",
    step4light2: "/assets/fitur/kelola-informasi-mobile.png",

    // Fitur 5: Kelola UI
    step5light1: "/assets/fitur/kelola-ui.png",
    step5light2: "/assets/fitur/kelola-ui-mobile.png",

    // Fitur 6: Landing Page
    step6light1: "/assets/fitur/imageLanding.png",
    step6light2: "/assets/fitur/imageLanding-mobile.png",
  }}
/>
        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}