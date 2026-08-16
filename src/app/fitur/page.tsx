"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Users, Layers, GraduationCap, Megaphone, Palette, Paintbrush, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      id: "data-calon-siswa",
      title: "Data Calon Siswa",
      desc: "Kelola data pendaftar, status seleksi, verifikasi berkas, dan informasi calon siswa secara terpusat dari dashboard.",
      icon: Users,
      color: "bg-blue-500",
      gradient: "from-blue-500/20 to-cyan-500/5",
    },
    {
      id: "pembagian-kelas",
      title: "Pembagian Kelas",
      desc: "Atur pembagian siswa ke kelas atau rombel sesuai kebutuhan sekolah, kapasitas, dan alur administrasi internal.",
      icon: Layers,
      color: "bg-indigo-500",
      gradient: "from-indigo-500/20 to-blue-500/5",
    },
    {
      id: "siswa-aktif",
      title: "Siswa Aktif",
      desc: "Pantau dan kelola daftar siswa aktif yang sudah diterima agar data akademik dan administrasi tetap rapi.",
      icon: GraduationCap,
      color: "bg-emerald-500",
      gradient: "from-emerald-500/20 to-teal-500/5",
    },
    {
      id: "kelola-informasi",
      title: "Kelola Informasi",
      desc: "Buat, ubah, dan publikasikan pengumuman, berita, atau informasi penting sekolah ke halaman publik.",
      icon: Megaphone,
      color: "bg-rose-500",
      gradient: "from-rose-500/20 to-pink-500/5",
    },
    {
      id: "kelola-ui-data",
      title: "Kelola UI/Data",
      desc: "Sesuaikan isi portal, data profil sekolah, konten pendukung, dan pengaturan informasi yang tampil ke pengguna.",
      icon: Palette,
      color: "bg-purple-500",
      gradient: "from-purple-500/20 to-fuchsia-500/5",
    },
    {
      id: "tema-tampilan",
      title: "Tema dan Tampilan",
      desc: "Atur tema visual, warna, logo, dan tampilan antarmuka agar portal sekolah terlihat konsisten dan sesuai identitas.",
      icon: Paintbrush,
      color: "bg-amber-500",
      gradient: "from-amber-500/20 to-orange-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16 flex-1">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
Menu Dashboard
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
Isi Fitur Mengikuti Menu yang Ada di Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg">
Seluruh isi di bawah ini mengikuti menu yang sudah tersedia di halaman dashboard demo, tanpa mengubah layout atau desain halaman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                id={f.id}
                className={`scroll-mt-32 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden group flex flex-col`}
              >
                {/* Premium Image Frame / Bingkai Foto */}
                <div className={`w-full h-48 sm:h-64 bg-gradient-to-br ${f.gradient} border-b border-slate-100 dark:border-slate-800 relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  
                  {/* Mockup UI Element Container */}
                  <div className="relative w-3/4 h-3/4 rounded-t-2xl bg-white dark:bg-slate-950 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 border-b-0 overflow-hidden translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                    {/* Fake Browser Toolbar */}
                    <div className="h-6 w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-3 gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    </div>
                    {/* Fake Content Area */}
                    <div className="p-4 flex flex-col gap-3">
                      <div className="w-1/3 h-4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                      <div className="w-5/6 h-2 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${f.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                      <Icon size={24} />
                    </div>
                    <h2 className="text-xl font-extrabold">{f.title}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 flex-1">{f.desc}</p>
                  
                  <Link
                    href="/daftar"
                    className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                      <span>Lihat Detail</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}
