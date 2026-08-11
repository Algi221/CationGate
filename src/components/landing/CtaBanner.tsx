"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  const blogArticles = [
    {
      title: "Cara Meningkatkan Efisiensi Pendaftaran PPDB Sekolah Up to 80%",
      category: "Panduan PPDB",
      date: "28 Juli 2026",
      desc: "Strategi praktis mengotomatisasi formulir pendaftaran dan verifikasi dokumen calon siswa baru.",
    },
    {
      title: "Integrasi Sistem Sekolah dengan Format Laporan Resmi Dapodik",
      category: "Administrasi Sekolah",
      date: "24 Juli 2026",
      desc: "Panduan lengkap bagi tim IT sekolah untuk mengekspor data murid dan nilai tanpa kesalahan manual.",
    },
    {
      title: "Masa Depan Ujian Berbasis Komputer (CBT) Yang Bebas Kecurangan",
      category: "Teknologi CBT",
      date: "19 Juli 2026",
      desc: "Menyeimbangkan kemudahan asesmen digital dengan sistem pengawasan ujian terenkripsi.",
    },
  ];

  return (
    <div className="bg-surface border-b border-border">
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8EC9F6]/20 text-[#2A1B1D] text-xs font-bold border border-border">
            <BookOpen className="w-3.5 h-3.5 text-[#2A1B1D]" />
            Pusat Informasi & Artikel
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
            Wawasan & Edukasi Manajemen Sekolah
          </h2>

          <p className="text-body text-base font-medium">
            Jelajahi artikel dan panduan praktis yang ditulis oleh praktisi teknologi pendidikan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogArticles.map((article, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-background border border-border shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3 text-body font-medium">
                  <span className="font-bold text-[#2A1B1D] bg-[#FFD33B]/30 px-2.5 py-0.5 rounded-md border border-border">
                    {article.category}
                  </span>
                  <span>{article.date}</span>
                </div>

                <h3 className="text-base font-extrabold text-heading mb-2 leading-snug hover:text-primary transition-colors cursor-pointer">
                  {article.title}
                </h3>

                <p className="text-xs text-body leading-relaxed font-medium">
                  {article.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border flex items-center gap-1 text-xs font-bold text-primary hover:text-[#F3C625] cursor-pointer">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#2A1B1D] text-white p-8 sm:p-12 lg:p-14 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD33B]/30 text-white text-xs font-bold uppercase tracking-wider border border-border">
              <Sparkles className="w-4 h-4 text-[#FFD33B]" />
              Implementasi Cepat
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Bergabunglah dengan Ekosistem Digital CationGate.
            </h2>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-medium">
              Permudah panitia PPDB, permudah tata kelola sekolah, dan berikan pengalaman pendaftaran terbaik untuk calon siswa baru Anda.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <Link href="/daftar">
              <Button
                size="lg"
                className="bg-[#FFD33B] hover:bg-[#F3C625] text-[#2A1B1D] font-bold text-sm rounded-xl py-6 px-8 gap-2 shadow-sm"
              >
                <span>Daftar Sekolah Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
