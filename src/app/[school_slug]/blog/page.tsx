"use client";

import React, { use } from "react";
import Link from "next/link";
import { SchoolNavbar } from "@/components/landing/SchoolNavbar";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { Calendar, User, ChevronRight } from "lucide-react";
import SafeImage from "@/components/SafeImage";

export default function BlogPage({ params }: { params: Promise<{ school_slug: string }> }) {
  const resolvedParams = use(params);
  const schoolSlug = resolvedParams.school_slug;

  const dummyPosts = [
    {
      id: 1,
      title: "Prestasi Gemilang di Olimpiade Sains Nasional 2026",
      excerpt: "Siswa-siswi kami berhasil meraih medali emas dalam ajang bergengsi Olimpiade Sains Nasional tahun ini, membuktikan komitmen sekolah terhadap keunggulan akademik.",
      date: "12 Agustus 2026",
      author: "Admin Sekolah",
      category: "Prestasi",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Pentingnya Pendidikan Karakter di Era Digital",
      excerpt: "Di tengah pesatnya perkembangan teknologi, pendidikan karakter menjadi benteng utama agar generasi muda tetap memiliki integritas dan empati.",
      date: "05 Agustus 2026",
      author: "Kepala Sekolah",
      category: "Artikel Pendidikan",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Kegiatan Ekstrakurikuler Baru: Robotika dan AI",
      excerpt: "Merespons kebutuhan industri masa depan, sekolah kami secara resmi membuka ekstrakurikuler Robotika dan Artificial Intelligence bagi seluruh siswa.",
      date: "28 Juli 2026",
      author: "Tim Kurikulum",
      category: "Informasi",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Tips Persiapan Menghadapi Ujian Akhir",
      excerpt: "Berbagai tips dan strategi efektif dari para guru berpengalaman untuk membantu siswa memaksimalkan potensi mereka saat menghadapi ujian.",
      date: "15 Juli 2026",
      author: "Guru Bimbingan Konseling",
      category: "Tips Belajar",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] selection:bg-blue-500/30 font-sans flex flex-col">
      <SchoolNavbar schoolSlug={schoolSlug} />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Blog & Artikel
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Berita terbaru, artikel pendidikan, dan informasi seputar kegiatan sekolah kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-[#1e293b]/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative h-56 w-full overflow-hidden">
                  <SafeImage 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/10">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  <Link 
                    href={`/${schoolSlug}/blog/${post.id}`} 
                    className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-auto"
                  >
                    Baca Selengkapnya
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      <SchoolFooter schoolSlug={schoolSlug} />
    </div>
  );
}
