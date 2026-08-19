"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/saas/plans");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setPlans(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:max-w-5xl lg:mx-auto gap-8 items-stretch">
          {loading ? (
            <div className="col-span-1 md:col-span-2 py-12 flex justify-center text-slate-500 dark:text-slate-400 animate-pulse font-medium">
              Memuat harga paket...
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-12 flex justify-center text-slate-500 dark:text-slate-400 font-medium">
              Belum ada paket yang tersedia.
            </div>
          ) : (
            plans.map((pkg, i) => {
              const isFree = Number(pkg.price_yearly) === 0;
              const isPopular = pkg.name.toLowerCase().includes("pro") && !pkg.name.toLowerCase().includes("max");

              return (
                <div 
                  key={pkg.id} 
                  className={`bg-white dark:bg-slate-800 rounded-3xl p-8 border ${
                    isPopular 
                      ? 'border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-900/20 relative transform md:-translate-y-4' 
                      : 'border-slate-200 dark:border-slate-700 shadow-lg'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                      Paling Populer
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{pkg.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {isFree ? "Mulai gunakan CationGate gratis selama 20 Hari." : `Maksimalkan potensi PPDB Anda dengan ${pkg.name}.`}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {isFree ? "Rp 0" : `Rp ${Number(pkg.price_yearly).toLocaleString("id-ID")}`}
                      <span className="text-slate-500">{isFree ? "/ 20 Hari" : "/ Tahun"}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
                    {pkg.features.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <Check size={16} className="text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href="/daftar"
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-all ${
                      i === 1
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white"
                    }`}
                  >
                    {i === 0 ? "Mulai Sekarang" : "Pilih Paket Ini"}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}
