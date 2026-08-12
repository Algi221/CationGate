"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "Pentingnya Digitalisasi Sekolah di Era Modern",
      date: "12 Agustus 2026",
      category: "Edukasi",
      excerpt: "Bagaimana transformasi digital mengubah cara sekolah mengelola pendaftaran, ujian, dan manajemen siswa sehari-hari.",
      image: "bg-blue-500",
    },
    {
      title: "Mengenal Fitur PPDB Terpadu CationGate",
      date: "10 Agustus 2026",
      category: "Update Fitur",
      excerpt: "Panduan lengkap menggunakan sistem PPDB CationGate untuk mengelola ribuan pendaftar dengan mudah dan cepat.",
      image: "bg-purple-500",
    },
    {
      title: "Tips Menghindari Server Down Saat Ujian Berbasis Komputer",
      date: "05 Agustus 2026",
      category: "Teknis",
      excerpt: "Infrastruktur cloud yang tepat adalah kunci kesuksesan CBT. Ketahui cara tim kami mengoptimalkan server.",
      image: "bg-emerald-500",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-extrabold uppercase tracking-wider">
            <BookOpen size={14} /> Blog CationGate
          </div>
          <h1 className="text-[42px] md:text-[56px] font-black tracking-tight text-slate-900">
            Wawasan & Kabar Terbaru
          </h1>
          <p className="text-[20px] text-slate-600 leading-relaxed">
            Temukan artikel terbaru, panduan, dan wawasan seputar teknologi pendidikan dan pembaruan sistem CationGate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div key={index} className="group rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300">
              <div className={`h-48 w-full ${post.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-6 space-y-4 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-blue-600 uppercase tracking-wider">{post.category}</span>
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar size={12} /> {post.date}
                  </span>
                </div>
                <h2 className="text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-600 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Baca artikel</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}
