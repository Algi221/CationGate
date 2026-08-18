"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Users, Layers, Megaphone, Palette, Paintbrush } from "lucide-react";
import { HoverExpand_001 } from "@/components/landing/expand-on-hover";

export default function FeaturesPage() {
  const features = [
    {
      id: "Profile Sekolah",
      title: "Tema dan Tampilan",
      desc: "Atur tema visual, warna, logo, dan tampilan antarmuka agar portal sekolah terlihat konsisten dan sesuai identitas.",
      icon: Paintbrush,
      badgeBg: "#FFD33B",       // Yellow
      badgeText: "#23191C",     // Dark Heading
      accentColor: "#FFD33B",   // Accent Yellow
      image: "/assets/landing/imageLanding.png",
    },
    {
      id: "data-calon-siswa",
      title: "Data Calon Siswa",
      desc: "Kelola data pendaftar, status seleksi, verifikasi berkas, dan informasi calon siswa secara terpusat dari dashboard.",
      icon: Users,
      badgeBg: "#FF2F8B",       // Pink
      badgeText: "#FFFFFF",
      accentColor: "#FF2F8B",   // Accent Pink
      image: "/assets/landing/calon-siswa.png",
    },
    {
      id: "pembagian-kelas",
      title: "Pembagian Kelas",
      desc: "Atur pembagian siswa ke kelas atau rombel sesuai kebutuhan sekolah, kapasitas, dan alur administrasi internal.",
      icon: Layers,
      badgeBg: "#8EC9F6",       // Blue
      badgeText: "#23191C",     // Dark Heading
      accentColor: "#8EC9F6",   // Accent Blue
      image: "/assets/landing/pembagian-kelas.png",
    },
    {
      id: "kelola-informasi",
      title: "Kelola Informasi",
      desc: "Buat, ubah, dan publikasikan pengumuman, berita, atau informasi penting sekolah ke halaman publik.",
      icon: Megaphone,
      badgeBg: "#FF9D67",       // Orange
      badgeText: "#23191C",
      accentColor: "#FF9D67",
      image: "/assets/landing/kelola-informasi.png",
    },
    {
      id: "kelola-ui-data",
      title: "Kelola UI/Data",
      desc: "Sesuaikan isi portal, data profil sekolah, konten pendukung, dan pengaturan informasi yang tampil ke pengguna.",
      icon: Palette,
      badgeBg: "#E86BC6",       // Purple
      badgeText: "#FFFFFF",
      accentColor: "#E86BC6",
      image: "/assets/landing/kelola-u.png",
    },
  ];

  // Map data untuk dikirim ke komponen HoverExpand_001
  const hoverExpandImages = features.map((f) => ({
    src: f.image,
    alt: f.desc,
    code: f.title,
    badgeBg: f.badgeBg,
    badgeText: f.badgeText,
    accentColor: f.accentColor,
    headingColor: "#23191C",
    bodyColor: "#58504E",
    borderColor: "#E7E1D6",
  }));

  return (
    <div 
      className="min-h-screen flex flex-col justify-between transition-colors duration-300"
      style={{
        backgroundColor: "#FDFBF7", // Background terang natural yang cocok dengan border #E7E1D6
        color: "#23191C"
      }}
    >
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 flex-1">
        {/* Header Teks */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span 
            className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider inline-block shadow-sm"
            style={{
              backgroundColor: "#FFD33B",
              color: "#23191C",
              border: "1px solid #E7E1D6"
            }}
          >
            Menu Dashboard
          </span>
          
          <h1 
            className="text-4xl md:text-5xl font-black tracking-tight"
            style={{ color: "#23191C" }}
          >
            Isi Fitur Mengikuti Menu yang Ada di Dashboard
          </h1>
          
          <p 
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#58504E" }}
          >
            Seluruh isi di bawah ini mengikuti menu yang sudah tersedia di halaman dashboard demo.
          </p>
        </div>

        {/* 🌟 Section Hover Expand Card 🌟 */}
        <div 
          className="w-full p-4 md:p-8"
        >
          <HoverExpand_001 images={hoverExpandImages} />
        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}