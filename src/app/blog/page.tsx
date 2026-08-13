"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Clock, ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string[];
  author: string;
  authorRole: string;
  authorBio: string;
  authorImg: string;
  excerpt: string;
  image: string;
  content: React.ReactNode;
}

export default function BlogPage() {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const posts: BlogPost[] = [
    {
      id: "startup-taruna-bhakti",
      title:
        "4 Siswa SMK Taruna Bhakti Mengembangkan Start Up Digital CationGate",
      date: "13 Agustus 2026",
      readTime: "5 min read",
      category: ["Inovasi", "Kisah Sukses"],
      author: "Admin CationGate",
      authorRole: "Editor in Chief",
      authorBio:
        "Tim redaksi CationGate yang berdedikasi meliput perkembangan teknologi pendidikan dan karya-karya inovatif dari siswa vokasi di seluruh Indonesia.",
      authorImg:
        "https://ui-avatars.com/api/?name=Admin+CG&background=18181b&color=fff",
      excerpt:
        "Berawal dari tugas sekolah, empat siswa SMK Taruna Bhakti berhasil merancang ekosistem digital yang menghubungkan manajemen sekolah dalam satu pintu.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600",
      content: (
        <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
          <p>
            Inovasi teknologi tidak hanya lahir dari perusahaan raksasa, tetapi
            juga dari ruang kelas. Empat developer muda SMK Taruna Bhakti, yakni
            Ahmad Faishal Majdii, Farel Al Fatir Fauzan, Hafiz Alviansyah, dan
            Satria Arief Wibowo, membuktikan hal tersebut dengan membangun
            ekosistem digital CationGate.
          </p>
          <p>
            Mereka mengawali perjalanan dari proyek e-commerce hingga akhirnya
            menyadari adanya kebutuhan mendesak di sektor pendidikan. Proses
            manajemen sekolah dan pendaftaran siswa baru yang masih manual
            memicu mereka untuk menciptakan solusi terintegrasi.
          </p>
          <blockquote className="border-l-[3px] border-zinc-900 pl-6 py-2 my-10 text-xl md:text-2xl font-medium text-zinc-900 italic tracking-tight">
            "Kami ingin membuktikan bahwa siswa SMK tidak hanya bisa menjadi
            pengguna teknologi, tetapi juga pencipta solusi nyata yang bisa
            dipakai institusi secara luas."
          </blockquote>
          <p>
            Dengan pembagian tugas yang jelas dalam pengembangan{" "}
            <i className="font-sans">front-end</i> menggunakan Next.js dan{" "}
            <i className="font-sans">back-end</i> yang kokoh, tim ini sukses
            merancang antarmuka yang modern, cepat, dan responsif untuk berbagai
            kebutuhan sekolah.
          </p>
        </div>
      ),
    },
    {
      id: "digitalisasi-perpustakaan",
      title:
        "Transformasi Digital: Mengubah Wajah Perpustakaan SMK Menjadi Sistem Modern",
      date: "10 Agustus 2026",
      readTime: "4 min read",
      category: ["Edukasi", "Studi Kasus"],
      author: "Tech Contributor",
      authorRole: "System Analyst",
      authorBio:
        "Menganalisis dan merancang alur sistem informasi yang efektif untuk berbagai kebutuhan institusi pendidikan.",
      authorImg:
        "https://ui-avatars.com/api/?name=Tech+C&background=18181b&color=fff",
      excerpt:
        "Meninggalkan pencatatan manual, implementasi sistem perpustakaan digital terbukti mempercepat sirkulasi buku dan manajemen data.",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600",
      content: (
        <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
          <p>
            Salah satu tonggak awal dari digitalisasi sekolah adalah modernisasi
            perpustakaan. Menggunakan metodologi Agile, peralihan dari
            pencatatan buku besar manual ke sistem digital membuahkan hasil yang
            signifikan.
          </p>
          <p>
            Dengan dukungan dan arahan mentor teknis untuk implementasi web
            serta struktur logika algoritma, sistem ini dirancang agar mudah
            digunakan oleh pustakawan maupun siswa.
          </p>
          <p>
            Proyek ini menjadi batu loncatan penting dalam memahami alur basis
            data relasional kompleks yang kemudian diadaptasi ke skala yang
            lebih besar di sistem SPMB.
          </p>
        </div>
      ),
    },
    {
      id: "mobile-learning-tracker",
      title:
        "Inovasi 'Strava untuk Siswa': Memantau Progres Belajar Lewat Aplikasi Mobile",
      date: "08 Agustus 2026",
      readTime: "6 min read",
      category: ["Fitur", "Inovasi"],
      author: "Mobile Dev Team",
      authorRole: "App Developer",
      authorBio:
        "Fokus pada pengembangan aplikasi mobile cross-platform yang interaktif dan berkinerja tinggi.",
      authorImg:
        "https://ui-avatars.com/api/?name=Mobile+Dev&background=18181b&color=fff",
      excerpt:
        "Konsep unik menggabungkan timer belajar, bukti upload, dan global feed layaknya media sosial kebugaran untuk memotivasi siswa.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1600",
      content: (
        <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
          <p>
            Bagaimana jika kita bisa melacak jam belajar sama seperti kita
            melacak jarak lari? Itulah konsep di balik Mobile Learning Tracker
            yang sedang dikembangkan.
          </p>
          <p>
            Dibangun dengan memanfaatkan kapabilitas React Native dan sistem
            backend dari Supabase, aplikasi ini memungkinkan siswa mengaktifkan
            timer belajar, mengunggah foto bukti (proof-of-study), dan melihat
            aktivitas belajar teman-teman mereka dalam sebuah global feed.
          </p>
          <h3 className="text-2xl font-sans font-bold text-zinc-900 mt-10 mb-4 tracking-tight">
            Membangun Ekosistem yang Sehat
          </h3>
          <p>
            Gamifikasi ini terbukti mampu meningkatkan retensi dan motivasi
            belajar mandiri. Fitur ini rencananya akan diintegrasikan sebagai
            nilai tambah bagi sekolah-sekolah yang menggunakan ekosistem
            CationGate.
          </p>
        </div>
      ),
    },
    {
      id: "lumeria-ke-edtech",
      title:
        "Dari E-Commerce Kuliner ke Ed-Tech: Kekuatan Kolaborasi Multidisiplin",
      date: "05 Agustus 2026",
      readTime: "5 min read",
      category: ["Kisah Sukses", "Edukasi"],
      author: "Project Manager",
      authorRole: "Product Lead",
      authorBio:
        "Mengorkestrasi kerja sama tim dari berbagai disiplin ilmu untuk menciptakan produk digital yang berdampak.",
      authorImg:
        "https://ui-avatars.com/api/?name=Project+M&background=18181b&color=fff",
      excerpt:
        "Pengalaman membangun platform e-commerce sukses menjadi fondasi kuat tim dalam mengarsiteki sistem manajemen pendidikan CationGate.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600",
      content: (
        <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
          <p>
            Sebelum menyelami dunia teknologi pendidikan, fondasi engineering
            tim terbentuk dari proyek Lumeria—sebuah platform e-commerce
            terintegrasi untuk produk kuliner lokal.
          </p>
          <p>
            Keberhasilan Lumeria tak lepas dari kolaborasi luar biasa antara
            Developers, Cooks, dan Designers yang melibatkan banyak talenta
            muda.
          </p>
          <p>
            Pengalaman mengelola deployment, optimalisasi UI/UX, hingga
            menangani logika transaksi yang rumit inilah yang pada akhirnya
            dipinjam dan diimprovisasi ulang untuk membangun arsitektur
            CationGate yang andal.
          </p>
        </div>
      ),
    },
    {
      id: "fitur-ppdb",
      title: "Mengenal Fitur PPDB Terpadu CationGate untuk Tahun Ajaran Baru",
      date: "01 Agustus 2026",
      readTime: "4 min read",
      category: ["Fitur", "Panduan"],
      author: "Zac Hall",
      authorRole: "Product Manager",
      authorBio:
        "Fokus pada pengembangan pengalaman pengguna (UX) untuk produk-produk CationGate.",
      authorImg:
        "https://ui-avatars.com/api/?name=Zac+H&background=18181b&color=fff",
      excerpt:
        "Panduan lengkap menggunakan sistem PPDB CationGate untuk mengelola ribuan pendaftar dengan mudah, cepat, dan tanpa kendala server.",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1600",
      content: (
        <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
          <p>
            Sistem Penerimaan Peserta Didik Baru (PPDB) seringkali menjadi momen
            krusial yang menguras tenaga panitia sekolah. CationGate hadir
            dengan fitur dasbor pendaftar yang tersentralisasi.
          </p>
        </div>
      ),
    },
    {
      id: "pentingnya-digitalisasi",
      title: "Menyiapkan Infrastruktur Digital Sekolah di Era Modern",
      date: "28 Juli 2026",
      readTime: "3 min read",
      category: ["Opini"],
      author: "Ryan Christoffel",
      authorRole: "System Architect",
      authorBio:
        "Arsitek infrastruktur cloud yang memastikan keandalan server CationGate.",
      authorImg:
        "https://ui-avatars.com/api/?name=Ryan+C&background=18181b&color=fff",
      excerpt:
        "Bagaimana transformasi digital mengubah cara sekolah mengelola operasional sehari-hari dan meningkatkan kualitas pelayanan mutu pendidikan.",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1600",
      content: (
        <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
          <p>
            Dunia pendidikan kini berada di titik balik. Tuntutan untuk memiliki
            database yang aman, cepat diakses, dan transparan membuat solusi
            cloud menjadi sebuah keharusan mutlak bagi sekolah kejuruan modern.
          </p>
        </div>
      ),
    },
  ];

  const categories = [
    "Semua",
    ...Array.from(new Set(posts.flatMap((p) => p.category))),
  ];

  const filteredPosts = useMemo(() => {
    return activeCategory === "Semua"
      ? posts
      : posts.filter((post) => post.category.includes(activeCategory));
  }, [activeCategory, posts]);

  const activePost = posts.find((p) => p.id === activePostId);
  const mainPost = filteredPosts[0];
  const sidePosts = filteredPosts.slice(1);

  if (!isMounted) return null; // Mencegah hidration mismatch

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col justify-between font-sans selection:bg-zinc-200 selection:text-zinc-900">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full flex-1">
        {/* ========================================= */}
        {/* VIEW: DAFTAR ARTIKEL */}
        {/* ========================================= */}
        {!activePost ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
            {/* Header & Kategori Editorial */}
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-200 pb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
                  Journal
                </h1>
                <p className="text-zinc-500 mt-2 text-lg">
                  Berita, wawasan, & pembaruan dari CationGate.
                </p>
              </div>

              <div className="flex flex-wrap gap-1 md:gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Highlight Utama Kiri */}
                {mainPost && (
                  <div
                    className="lg:col-span-8 group cursor-pointer"
                    onClick={() => setActivePostId(mainPost.id)}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden mb-6 bg-zinc-100">
                      <Image
                        src={mainPost.image}
                        alt={mainPost.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="space-y-4 max-w-2xl">
                      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
                        <span>{mainPost.category[0]}</span>
                      </div>
                      <h2 className="text-3xl md:text-[40px] font-bold tracking-tight leading-[1.1] text-zinc-900 group-hover:text-zinc-600 transition-colors">
                        {mainPost.title}
                      </h2>
                      <p className="text-zinc-500 text-lg line-clamp-2 leading-relaxed">
                        {mainPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium pt-2">
                        <span className="text-zinc-800">{mainPost.author}</span>
                        <span>—</span>
                        <span>{mainPost.date}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sidebar Kanan (List) */}
                <div className="lg:col-span-4 flex flex-col">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 pb-4 border-b border-zinc-200">
                    Artikel Lainnya
                  </h3>

                  <div className="flex flex-col divide-y divide-zinc-200/60">
                    {sidePosts.map((post) => (
                      <div
                        key={post.id}
                        className="group flex gap-5 cursor-pointer py-5 first:pt-0"
                        onClick={() => setActivePostId(post.id)}
                      >
                        <div className="flex flex-col justify-center flex-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                            {post.category[0]}
                          </span>
                          <h4 className="text-base font-bold leading-snug group-hover:text-zinc-500 transition-colors mb-2 text-zinc-900">
                            {post.title}
                          </h4>
                          <span className="text-xs text-zinc-400 font-medium mt-auto">
                            {post.date}
                          </span>
                        </div>
                        <div className="relative w-24 aspect-square shrink-0 bg-zinc-100 overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-32 text-center text-zinc-400">
                <p>Belum ada jurnal di kategori ini.</p>
              </div>
            )}
          </div>
        ) : (
          /* ========================================= */
          /* VIEW: DETAIL ARTIKEL */
          /* ========================================= */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out max-w-5xl mx-auto">
            <button
              onClick={() => setActivePostId(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 transition-colors mb-12 group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Kembali ke Jurnal
            </button>

            <header className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {activePost.category[0]}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Clock size={14} /> {activePost.readTime}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-zinc-900 mb-8 max-w-4xl">
                {activePost.title}
              </h1>

              <div className="flex items-center gap-4 text-sm">
                <img
                  src={activePost.authorImg}
                  alt={activePost.author}
                  className="w-12 h-12 rounded-full bg-zinc-200"
                />
                <div>
                  <div className="text-zinc-900 font-bold">
                    {activePost.author}
                  </div>
                  <div className="text-zinc-500">{activePost.date}</div>
                </div>
              </div>
            </header>

            <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] bg-zinc-100 mb-14">
              <Image
                src={activePost.image}
                alt={activePost.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
              {/* Kolom Konten Teks */}
              <article className="lg:col-span-8">
                <p className="text-xl md:text-[22px] font-medium text-zinc-800 leading-relaxed mb-10 pb-10 border-b border-zinc-200 tracking-tight">
                  {activePost.excerpt}
                </p>

                {activePost.content}

                {/* Author Info Minimalist */}
                <div className="mt-20 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row gap-6 items-start">
                  <img
                    src={activePost.authorImg}
                    alt={activePost.author}
                    className="w-16 h-16 rounded-full bg-zinc-200 grayscale"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">
                      {activePost.author}
                    </h3>
                    <span className="text-sm font-medium text-zinc-500 block mb-3">
                      {activePost.authorRole}
                    </span>
                    <p className="text-zinc-600 text-sm leading-relaxed max-w-md">
                      {activePost.authorBio}
                    </p>
                  </div>
                </div>
              </article>

              {/* Sidebar Detail (Sticky Minimalist) */}
              <aside className="lg:col-span-4 relative">
                <div className="sticky top-32 space-y-12">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 pb-4 border-b border-zinc-200">
                      Baca Selanjutnya
                    </h3>

                    <div className="flex flex-col space-y-6">
                      {posts
                        .filter((p) => p.id !== activePost.id)
                        .slice(0, 3)
                        .map((post) => (
                          <div
                            key={post.id}
                            className="group cursor-pointer"
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              setActivePostId(post.id);
                            }}
                          >
                            <h4 className="text-base font-bold leading-snug group-hover:text-zinc-500 transition-colors mb-2 text-zinc-900">
                              {post.title}
                            </h4>
                            <span className="text-xs text-zinc-400 font-medium">
                              {post.readTime}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* CTA Widget Bersih (Tanpa Gradien Norak) */}
                  <div className="bg-zinc-900 text-white p-8 group cursor-pointer hover:bg-zinc-800 transition-colors">
                    <h3 className="text-xl font-bold mb-3">
                      Siap Beralih ke CationGate?
                    </h3>
                    <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                      Jelajahi bagaimana ekosistem kami dapat mendigitalisasi
                      institusi pendidikan Anda.
                    </p>
                    <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-zinc-300 transition-colors">
                      Mulai Demo <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      <CinematicFooter />
    </div>
  );
}
