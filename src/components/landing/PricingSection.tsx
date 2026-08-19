"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Plan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
}

const formatRupiah = (num: number) => {
  return `Rp ${num.toLocaleString('id-ID')}`;
};

export function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <section className="py-16 w-full font-sans bg-white dark:bg-slate-950 transition-colors border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider mb-4 inline-block">
            Paket & Biaya
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Paket Fleksibel untuk Kebutuhan Sekolah Anda
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
            Pilih paket yang sesuai untuk digitalisasi sistem pendaftaran dan manajemen sekolah Anda. Semua paket berlangganan berlaku tahunan.
          </p>
        </div>

        {/* Cards Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:max-w-4xl lg:mx-auto gap-8 items-stretch">
          {loading ? (
            <div className="col-span-1 md:col-span-2 py-12 flex justify-center text-slate-500 dark:text-slate-400 animate-pulse font-medium">
              Memuat harga paket...
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-12 flex justify-center text-slate-500 dark:text-slate-400 font-medium">
              Belum ada paket yang tersedia.
            </div>
          ) : (
            plans.map((plan, index) => (
              <div
                key={plan.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between space-y-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Popular Badge (Optional, can be based on index or property) */}
                {index === 1 && (
                  <div className="absolute top-0 right-8 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-b-lg uppercase tracking-widest shadow-md">
                    Terpopuler
                  </div>
                )}
                
                <div className="w-full shrink-0 flex flex-col items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-8 relative z-10">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    {plan.name}
                  </h3>
                  <div className="flex flex-col gap-1 my-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-blue-600 dark:text-blue-500 tracking-tight">
                        {formatRupiah(plan.price_yearly)}
                      </span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      / Tahun
                    </span>
                  </div>
                  <Link href="/daftar" className="w-full mt-4">
                    <Button className={`w-full font-bold py-6 rounded-xl transition-all ${index === 1 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'}`}>
                      {index === 0 ? "Mulai Sekarang" : "Pilih Paket Ini"}
                    </Button>
                  </Link>
                </div>

                <div className="flex-1 space-y-4 pt-4 relative z-10">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    Termasuk Semua Fitur:
                  </p>
                  {plan.features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" strokeWidth={2.5} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
                
                {/* Background Decor */}
                {index === 1 && (
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 dark:opacity-20 group-hover:opacity-30 transition-opacity"></div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Semua paket sudah termasuk update sistem berkala dan jaminan keamanan data.
        </div>
      </div>
    </section>
  );
}
