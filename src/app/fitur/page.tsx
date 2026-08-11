"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Sparkles, FileCheck, Cpu, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      id: "ppdb",
      title: "Sistem Penerimaan Murid Baru (PPDB Online)",
      desc: "Formulir pendaftaran multi-step dinamis, verifikasi NISN/NIK otomatis, pengunggahan berkas digital, dan penerbitan kartu ujian secara instan.",
      icon: Sparkles,
      color: "bg-blue-500",
    },
    {
      id: "cbt",
      title: "Asesmen & Ujian Online (CBT Pintar)",
      desc: "Pelaksanaan tes akademik berbasis komputer bebas kecurangan, acak soal & opsi otomatis, timer pintar, serta pengolahan nilai real-time.",
      icon: FileCheck,
      color: "bg-emerald-500",
    },
    {
      id: "manajemen",
      title: "Manajemen Siswa & Pembagian Kelas",
      desc: "Fitur pengelompokan jurusan, plotting siswa ke kelas otomatis berdasarkan kuota dan nilai tes, serta pencetakan buku induk siswa.",
      icon: Cpu,
      color: "bg-purple-500",
    },
    {
      id: "analitik",
      title: "Dashboard Analitik Real-Time",
      desc: "Laporan grafis statistik pendaftar per hari, distribusi domisili calon siswa, jurusan favorit, hingga status pembayaran biaya pendaftaran.",
      icon: BarChart3,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16 flex-1">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            Fitur Unggulan
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Solusi Lengkap untuk Seluruh Kebutuhan Sekolah
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg">
            Dirancang khusus untuk memenuhi standar administrasi sekolah di Indonesia dengan antarmuka yang bersih dan cepat.
          </p>
        </div>

        <div className="space-y-12">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                id={f.id}
                className="scroll-mt-32 p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col md:flex-row gap-8 items-center justify-between"
              >
                <div className="space-y-4 max-w-2xl">
                  <div className={`w-12 h-12 rounded-2xl ${f.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon size={24} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold">{f.title}</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">{f.desc}</p>
                </div>
                <div>
                  <Link
                    href="/daftar"
                    className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
                  >
                    <span>Coba Fitur Ini</span>
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
