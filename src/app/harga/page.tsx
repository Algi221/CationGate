"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter Sekolah",
      price: "Gratis Uji Coba",
      desc: "Cocok untuk uji coba sistem PPDB awal sekolah.",
      features: [
        "Hingga 100 Calon Siswa",
        "Formulir Pendaftaran Standar",
        "Verifikasi Berkas Manual",
        "Export Data ke Excel",
        "Dukungan Komunitas",
      ],
      popular: false,
      buttonText: "Mulai Uji Coba",
      href: "/daftar",
    },
    {
      name: "Pro PPDB & CBT",
      price: "Rp 1.500.000 / thn",
      desc: "Solusi lengkap pendaftaran & ujian CBT online.",
      features: [
        "Pendaftaran Siswa Tanpa Batas",
        "Modul CBT Ujian Bebas Kecurangan",
        "Plotting & Pembagian Kelas Otomatis",
        "Export Format Dapodik",
        "WhatsApp Broadcast Notifikasi",
        "Dukungan Prioritas 24/7",
      ],
      popular: true,
      buttonText: "Pilih Paket Pro",
      href: "/daftar",
    },
    {
      name: "Enterprise Instansi",
      price: "Kustom / Hubungi",
      desc: "Untuk yayasan multi-sekolah atau dinas daerah.",
      features: [
        "Multi-School Tenant Dashboard",
        "Integrasi Payment Gateway Custom",
        "Domain Kustom sekolah.sch.id",
        "Dedicated Server & SLA 99.9%",
        "Pelatihan Staf Admin Sekolah",
      ],
      popular: false,
      buttonText: "Hubungi Tim Sales",
      href: "/kontak",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16 flex-1">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            Paket & Biaya
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Biaya Transparan Tanpa Biaya Tersembunyi
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg">
            Pilih paket yang paling sesuai dengan kebutuhan jumlah pendaftar dan skala sekolah Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between space-y-6 shadow-xl ${
                plan.popular
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-slate-200/80 dark:border-slate-800"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                  Paling Populer
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-extrabold">{plan.name}</h3>
                <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {plan.price}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{plan.desc}</p>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <Check size={16} className="text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href={plan.href}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-all ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}
