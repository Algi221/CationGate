"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Bell, CreditCard, LayoutTemplate, Shield, FileOutput } from "lucide-react";

export function FeaturesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      title: "Pencarian Cerdas",
      desc: "Temukan data siswa, tagihan, atau nilai hanya dengan satu kata kunci.",
      icon: <Search className="w-5 h-5 text-blue-600" />,
      colSpan: "col-span-1 md:col-span-2",
      bg: "bg-blue-50/50",
    },
    {
      title: "Notifikasi Otomatis",
      desc: "Kirim pengingat pembayaran dan pengumuman kelulusan langsung ke WhatsApp orang tua.",
      icon: <Bell className="w-5 h-5 text-amber-600" />,
      colSpan: "col-span-1 md:col-span-2",
      bg: "bg-amber-50/50",
    },
    {
      title: "Pembayaran Terintegrasi",
      desc: "Dukung Virtual Account, e-Wallet, dan transfer bank untuk kemudahan SPP.",
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
      colSpan: "col-span-1 md:col-span-4",
      bg: "bg-emerald-50/50",
    },
    {
      title: "White-label Platform",
      desc: "Tampilan disesuaikan sepenuhnya dengan identitas dan warna sekolah Anda.",
      icon: <LayoutTemplate className="w-5 h-5 text-purple-600" />,
      colSpan: "col-span-1 md:col-span-2",
      bg: "bg-purple-50/50",
    },
    {
      title: "Manajemen Akses",
      desc: "Atur hak akses berjenjang untuk Kepala Sekolah, Guru, dan Tata Usaha.",
      icon: <Shield className="w-5 h-5 text-rose-600" />,
      colSpan: "col-span-1 md:col-span-1",
      bg: "bg-rose-50/50",
    },
    {
      title: "Laporan Satu Klik",
      desc: "Ekspor data Dapodik dan rekap nilai ke format Excel atau PDF.",
      icon: <FileOutput className="w-5 h-5 text-slate-600" />,
      colSpan: "col-span-1 md:col-span-1",
      bg: "bg-slate-100/50",
    },
  ];

  return (
    <section className="py-24 bg-white relative" ref={containerRef}>
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-4">
            Keunggulan Platform CationGate
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Menjadi platform penyedia layanan sistem penerimaan murid baru dan manajemen siswa yang baik, kami merancang setiap fitur agar intuif dan siap pakai.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {features.map((feat, i) => (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`${feat.colSpan} ${feat.bg} rounded-3xl p-6 border border-slate-200/50 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                {feat.icon}
              </div>
              <div className="mt-auto">
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{feat.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[85%]">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
