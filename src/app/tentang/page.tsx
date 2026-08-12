"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Target, Users, BookOpen, Sparkles, Award, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20 flex-1">
        {/* Hero About Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={14} /> Tentang CationGate
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            Membangun masa depan digital pendidikan Indonesia.
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            CationGate adalah platform SaaS terpadu yang membantu ratusan sekolah di seluruh Indonesia menyederhanakan penerimaan murid baru (PPDB), ujian CBT, dan manajemen akademik.
          </p>
        </div>

        {/* Visi & Misi Section */}
        <section id="visi-misi" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-extrabold">Visi Kami</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Menjadi standar infrastruktur digital utama bagi setiap lembaga pendidikan di Indonesia, mewujudkan tata kelola sekolah yang transparan, cepat, dan modern berbasis cloud.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-extrabold">Misi Kami</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Menghadirkan perangkat lunak sekolah berstandar enterprise yang ramah pengguna, aman, serta terintegrasi langsung dengan ekosistem Dapodik dan sistem kementerian.
            </p>
          </div>
        </section>

        {/* Tim Section */}
        <section id="tim" className="scroll-mt-32 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black">Tim & Pendidik Kunci</h2>
            <p className="text-slate-500 text-sm">Orang-orang di balik inovasi tiada henti CationGate.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: "Algifahri Tri Ramadhan", role: "Founder & Lead Architect", bg: "bg-blue-50 dark:bg-slate-800" },
              { name: "Pak Joy", role: "Pembina IT & Advisor", bg: "bg-emerald-50 dark:bg-slate-800" },
              { name: "Bu Miranda", role: "Mentor Algoritma & QA", bg: "bg-purple-50 dark:bg-slate-800" },
            ].map((member, i) => (
              <div key={i} className={`p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col items-center text-center space-y-3 ${member.bg}`}>
                <img
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(member.name)}`}
                  alt={member.name}
                  className="w-20 h-20 rounded-full border-2 border-white shadow-sm"
                />
                <h3 className="font-extrabold text-lg">{member.name}</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{member.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Kisah CationGate */}
        <section id="kisah" className="scroll-mt-32 p-8 md:p-12 rounded-3xl bg-slate-900 text-white space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-amber-400" size={28} />
            <h2 className="text-2xl md:text-3xl font-black">Kisah CationGate</h2>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl">
            Berawal dari kebutuhan SMK Taruna Bhakti Depok untuk mengotomatisasi antrean berkas calon murid baru yang membludak setiap tahun ajaran baru. CationGate kini berkembang menjadi ekosistem manajemen pendidikan terpadu yang digunakan oleh puluhan SMK dan SMA di berbagai provinsi.
          </p>
        </section>
      </main>

      <CinematicFooter />
    </div>
  );
}
