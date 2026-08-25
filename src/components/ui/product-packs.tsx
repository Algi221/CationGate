"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, Building2 } from "lucide-react";
import Link from "next/link";
import { TimelineAnimation } from "@/components/ui/product-packs-utils/timeline-animation";

interface SaaSPlan {
  id: number;
  name: string;
  price_monthly?: number;
  price_yearly: number;
  features?: string[];
  is_active?: boolean;
}

const DEFAULT_FREE_FEATURES = [
  "Pendaftaran Online PPDB",
  "Kelola Data Calon Siswa",
  "Export Excel",
  "Landing Page Sekolah",
  "Maks 100 Pendaftar",
  "Masa Aktif 30 Hari",
];

const DEFAULT_STARTER_FEATURES = [
  "Pendaftaran Online PPDB",
  "Kelola Data Calon Siswa",
  "Export Excel",
  "Landing Page Sekolah",
  "Notifikasi Email Sistem",
  "Dukungan Teknis Standar",
];

const DEFAULT_PRO_FEATURES = [
  "Semua Fitur Free Trial",
  "Unlimited Pendaftar",
  "Custom Branding & Logo",
  "Multi-Admin Dashboard",
  "WhatsApp Notifikasi",
  "Prioritas Support 24/7",
  "Pembagian Kelas Otomatis",
  "Laporan & Statistik Lengkap",
];

export const ProductPacks = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [plans, setPlans] = useState<SaaSPlan[]>([]);
  const [proPrice, setProPrice] = useState("Rp 1.200.000");

  useEffect(() => {
    fetch("/api/saas/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const activeList = data.data.filter(
            (p: SaaSPlan) => p.is_active !== false
          );
          setPlans(activeList.slice(0, 3));

          const proPlan = activeList.find(
            (p: SaaSPlan) =>
              p.name?.toLowerCase().includes("pro") || p.id === 2
          );
          if (proPlan && typeof proPlan.price_yearly === "number") {
            setProPrice(`Rp ${proPlan.price_yearly.toLocaleString("id-ID")}`);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Kondisi apakah terdapat 3 paket
  const isThreePlans = plans.length === 3;

  // Pemetaan untuk 3 paket
  let freePlan: SaaSPlan = {
    id: 0,
    name: "Free Trial",
    price_yearly: 0,
    features: DEFAULT_FREE_FEATURES,
  };
  let paidPlan1: SaaSPlan = {
    id: 1,
    name: "Paket Starter",
    price_yearly: 500000,
    features: DEFAULT_STARTER_FEATURES,
  };
  let paidPlan2: SaaSPlan = {
    id: 2,
    name: "Pro Tahunan",
    price_yearly: 1200000,
    features: DEFAULT_PRO_FEATURES,
  };

  if (isThreePlans) {
    const identifiedFree = plans.find(
      (p) =>
        p.price_yearly === 0 ||
        p.name.toLowerCase().includes("free") ||
        p.name.toLowerCase().includes("gratis")
    );
    if (identifiedFree) {
      freePlan = identifiedFree;
      const remainingPaid = plans.filter((p) => p.id !== identifiedFree.id);
      if (remainingPaid[0]) paidPlan1 = remainingPaid[0];
      if (remainingPaid[1]) paidPlan2 = remainingPaid[1];
    } else {
      // Jika semua memiliki harga, ambil paket pertama untuk free trial / starter card di kanan
      freePlan = plans[0];
      paidPlan1 = plans[1] || paidPlan1;
      paidPlan2 = plans[2] || paidPlan2;
    }
  }

  return (
    <section
      ref={timelineRef}
      className="py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 text-[#2e3749] dark:text-white min-h-screen flex flex-col justify-center font-sans"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-14">
          <TimelineAnimation
            animationNum={1}
            timelineRef={timelineRef}
            as="h1"
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#2e3749] dark:text-white"
          >
            Pilihan Paket Fleksibel
          </TimelineAnimation>

          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            as="p"
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            Mulai dari uji coba gratis hingga solusi pro terpadu tanpa biaya
            tersembunyi untuk digitalisasi sekolah Anda.
          </TimelineAnimation>
        </div>

        {/* Pricing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Kolom Kiri: 2 Baris Paket */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {isThreePlans ? (
              // JIKA ADA 3 PAKET: Baris Atas adalah Paid Plan 1 (Starter)
              <TimelineAnimation
                animationNum={3}
                timelineRef={timelineRef}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-sm"
              >
                <div className="w-full md:w-5/12 flex flex-col h-full justify-between space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-wider rounded-md uppercase mb-4">
                      {paidPlan1.name?.toUpperCase() || "PAKET STARTER"}
                    </span>
                    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                      <span className="text-4xl font-bold text-[#2e3749] dark:text-white">
                        {paidPlan1.price_yearly === 0
                          ? "Gratis"
                          : `Rp ${paidPlan1.price_yearly.toLocaleString("id-ID")}`}
                      </span>
                      <span className="text-slate-400 text-sm">/ Tahun</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Solusi esensial untuk instansi sekolah
                    </p>
                  </div>

                  <Link
                    href="/daftar"
                    className="inline-flex justify-center items-center w-full py-3 px-4 bg-[#2e3749] hover:bg-[#202735] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                  >
                    Pilih {paidPlan1.name || "Paket Starter"}
                  </Link>
                </div>

                <div className="w-full md:w-7/12 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                  <div className="space-y-3.5">
                    {(paidPlan1.features && paidPlan1.features.length > 0
                      ? paidPlan1.features
                      : DEFAULT_STARTER_FEATURES
                    ).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </TimelineAnimation>
            ) : (
              // JIKA ADA 2 PAKET (DEFAULT): Baris Atas adalah Free Trial
              <TimelineAnimation
                animationNum={3}
                timelineRef={timelineRef}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-sm"
              >
                <div className="w-full md:w-5/12 flex flex-col h-full justify-between space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-wider rounded-md uppercase mb-4">
                      FREE TRIAL
                    </span>
                    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                      <span className="text-4xl font-bold text-[#2e3749] dark:text-white">
                        Gratis
                      </span>
                      <span className="text-slate-400 text-sm">/ 30 Hari</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Uji coba fitur dasar platform
                    </p>
                  </div>

                  <Link
                    href="/daftar"
                    className="inline-flex justify-center items-center w-full py-3 px-4 bg-[#2e3749] hover:bg-[#202735] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                  >
                    Mulai Gratis
                  </Link>
                </div>

                <div className="w-full md:w-7/12 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                  <div className="space-y-3.5">
                    {DEFAULT_FREE_FEATURES.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </TimelineAnimation>
            )}

            {/* Baris Bawah: PRO TAHUNAN (Paling Populer) */}
            <TimelineAnimation
              animationNum={4}
              timelineRef={timelineRef}
              className="bg-white dark:bg-slate-900 border-2 border-[#FFD33B] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-[#FFD33B] text-[#2e3749] text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-sm">
                Paling Populer
              </div>

              <div className="w-full md:w-5/12 flex flex-col h-full justify-between space-y-6 pt-2">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#FFD33B] text-[#2e3749] text-xs font-bold tracking-wider rounded-md uppercase mb-4">
                    {isThreePlans
                      ? paidPlan2.name?.toUpperCase() || "PRO TAHUNAN"
                      : "PRO TAHUNAN"}
                  </span>
                  <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-4xl font-bold text-[#2e3749] dark:text-white">
                      {isThreePlans
                        ? paidPlan2.price_yearly === 0
                          ? "Gratis"
                          : `Rp ${paidPlan2.price_yearly.toLocaleString("id-ID")}`
                        : proPrice}
                    </span>
                    <span className="text-slate-400 text-sm">/ Tahun</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Solusi terbaik untuk instansi sekolah
                  </p>
                </div>

                <Link
                  href="/daftar"
                  className="inline-flex justify-center items-center w-full py-3 px-4 bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                  Pilih {isThreePlans ? paidPlan2.name || "Paket Pro" : "Paket Pro"}
                </Link>
              </div>

              <div className="w-full md:w-7/12 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                <div className="space-y-3.5">
                  {(isThreePlans && paidPlan2.features && paidPlan2.features.length > 0
                    ? paidPlan2.features
                    : DEFAULT_PRO_FEATURES
                  ).map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#FFD33B] text-[#2e3749] flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </TimelineAnimation>
          </div>

          {/* Kolom Kanan: 
              - Jika 3 Paket: Menjadi Kartu Free Trial
              - Jika 2 Paket: Menjadi Kartu Kebutuhan Khusus / Yayasan Besar */}
          {isThreePlans ? (
            <TimelineAnimation
              animationNum={5}
              timelineRef={timelineRef}
              className="lg:col-span-4 bg-[#2e3749] text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg border border-slate-700/50"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-white/10 text-[#FFD33B] text-xs font-bold tracking-wider rounded-md uppercase mb-4">
                  {freePlan.name?.toUpperCase() || "FREE TRIAL"}
                </span>

                <div className="flex items-baseline gap-1.5 whitespace-nowrap mb-2">
                  <span className="text-4xl font-bold text-white">Gratis</span>
                  <span className="text-slate-400 text-sm">/ 30 Hari</span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  Uji coba seluruh fitur dasar platform tanpa komitmen untuk
                  memulai digitalisasi sekolah.
                </p>

                <div className="space-y-3 pt-5 border-t border-white/10">
                  {(freePlan.features && freePlan.features.length > 0
                    ? freePlan.features
                    : DEFAULT_FREE_FEATURES
                  ).map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-xs font-medium text-slate-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-white/10 text-[#FFD33B] flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  href="/daftar"
                  className="w-full py-3.5 px-6 bg-white hover:bg-slate-100 text-[#2e3749] text-sm font-bold rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-sm"
                >
                  Mulai Gratis
                </Link>
                <p className="text-[11px] text-center text-slate-400 font-medium">
                  Tanpa kartu kredit · Langsung aktif
                </p>
              </div>
            </TimelineAnimation>
          ) : (
            <TimelineAnimation
              animationNum={5}
              timelineRef={timelineRef}
              className="lg:col-span-4 bg-[#2e3749] text-white rounded-3xl p-8 flex flex-col shadow-lg border border-slate-700/50"
            >
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#FFD33B] mb-6">
                  <Building2 size={24} strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white leading-snug">
                  Kebutuhan Khusus / Yayasan Besar?
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Dapatkan kustomisasi domain (.sch.id), integrasi Payment
                  Gateway, server dedicated, serta pendampingan sistem langsung
                  oleh tim ahli kami.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <Link
                  href="/kontak"
                  className="w-full py-3.5 px-6 bg-white hover:bg-slate-100 text-[#2e3749] text-sm font-bold rounded-xl flex items-center justify-center transition-colors active:scale-95"
                >
                  Konsultasi Kebutuhan
                </Link>
                <p className="text-[11px] text-center text-slate-400 font-medium">
                  Solusi kustom khusus multi-sekolah & yayasan
                </p>
              </div>
            </TimelineAnimation>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-12">
          Semua paket sudah termasuk update sistem berkala, perlindungan data,
          dan panduan penggunaan.
        </p>
      </div>
    </section>
  );
};

export default ProductPacks;