"use client";
import React, { useRef, useState, useEffect } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { TimelineAnimation } from "@/components/ui/product-packs-utils/timeline-animation";
import Link from "next/link";

export const ProductPacks = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/saas/plans");
        const json = await res.json();
        if (json.success && json.data) {
          setPlans(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section
      ref={timelineRef}
      className="py-24 px-6 bg-yellow-50/50 dark:bg-slate-950 text-neutral-900 dark:text-white min-h-screen relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <TimelineAnimation
          animationNum={1}
          timelineRef={timelineRef}
          className="text-center mb-16"
        >
          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            as="h2"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Pilihan Paket Fleksibel
          </TimelineAnimation>
          <TimelineAnimation
            animationNum={3}
            timelineRef={timelineRef}
            as="p"
            className="text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed"
          >
            Solusi manajemen PPDB terpadu untuk sekolah Anda. Mulai dari uji
            coba gratis hingga solusi profesional tanpa biaya tersembunyi.
          </TimelineAnimation>
        </TimelineAnimation>

        {loading ? (
          <div className="text-center text-neutral-500 py-12 animate-pulse">
            Memuat pilihan paket...
          </div>
        ) : (
          <TimelineAnimation
            animationNum={4}
            timelineRef={timelineRef}
            className={`grid grid-cols-1 md:grid-cols-2 ${
              plans.length >= 3 ? "xl:grid-cols-3" : "lg:grid-cols-2"
            } gap-8 max-w-5xl mx-auto items-stretch`}
          >
            {plans.map((plan, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1; // Popular Plan

              // Clean Card Styling based on CationGate's vibe (White, Yellow Accent, Dark Minimalist)
              let cardStyle =
                "rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ";
              let buttonStyle = "";
              let btnText = "Mulai Uji Coba";

              if (isFirst) {
                cardStyle +=
                  "bg-white dark:bg-slate-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md";
                buttonStyle =
                  "w-full inline-flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 py-3 px-6 text-sm font-semibold text-neutral-900 dark:text-white transition-colors";
                btnText = "Mulai Gratis";
              } else if (isSecond) {
                cardStyle +=
                  "bg-neutral-900 text-white dark:bg-neutral-900 border-2 border-yellow-400 shadow-xl scale-105 z-10";
                buttonStyle =
                  "w-full inline-flex items-center justify-center rounded-xl bg-yellow-400 hover:bg-yellow-300 py-3 px-6 text-sm font-semibold text-neutral-950 transition-colors shadow-sm";
                btnText = "Pilih Paket Pro";
              } else {
                cardStyle +=
                  "bg-white dark:bg-slate-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md";
                buttonStyle =
                  "w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3 px-6 text-sm font-semibold text-white transition-colors";
                btnText = "Pilih Paket";
              }

              return (
                <TimelineAnimation
                  key={plan.id}
                  animationNum={5 + idx}
                  timelineRef={timelineRef}
                  className={cardStyle}
                >
                  {isSecond && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                       Terpopuler
                    </div>
                  )}

                  <div>
                    {/* Plan Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold tracking-tight mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isFirst
                          ? "Uji coba fitur dasar platform"
                          : isSecond
                            ? "Solusi terbaik untuk instansi sekolah"
                            : "Fitur kustom lengkap"}
                      </p>
                    </div>

                    {/* Price Section */}
                    <div className="mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800 flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-bold tracking-tight">
                        {plan.price_yearly === 0
                          ? "Gratis"
                          : formatRupiah(plan.price_yearly)}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {plan.price_yearly === 0 ? "/ 30 hari" : "/ tahun"}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {(plan.features || []).map(
                        (feature: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 rounded-full p-0.5 ${isSecond ? "bg-yellow-400/10 text-yellow-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                            <span className="text-sm text-neutral-600 dark:text-neutral-300 leading-snug">
                              {feature}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <Link href="/daftar" className={buttonStyle}>
                      <span>{btnText}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                    </Link>
                  </div>
                </TimelineAnimation>
              );
            })}
          </TimelineAnimation>
        )}
      </div>
    </section>
  );
};

export default ProductPacks;
