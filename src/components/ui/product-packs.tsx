"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimelineAnimation } from "@/components/ui/product-packs-utils/timeline-animation";
import Link from "next/link";

export const ProductPacks = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
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
      className="py-24 px-6 bg-yellow-50 dark:bg-slate-950 text-black dark:text-white min-h-screen"
    >
      <div className="max-w-6xl mx-auto ">
        <TimelineAnimation
          animationNum={1}
          timelineRef={timelineRef}
          className="text-center mb-16"
        >
          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            as="h1"
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Pilihan Paket Fleksibel
          </TimelineAnimation>
          <TimelineAnimation
            animationNum={3}
            timelineRef={timelineRef}
            as="p"
            className="text-neutral-500 text-pretty max-w-lg leading-relaxed mx-auto"
          >
            Solusi manajemen PPDB terpadu untuk sekolah Anda. Mulai dari uji coba gratis hingga solusi pro lengkap tanpa biaya tersembunyi.
          </TimelineAnimation>
        </TimelineAnimation>

        {loading ? (
          <div className="text-center text-neutral-500 animate-pulse">Memuat paket...</div>
        ) : (
          <TimelineAnimation
            animationNum={4}
            timelineRef={timelineRef}
            className={`grid grid-cols-1 md:grid-cols-2 ${plans.length >= 3 ? 'xl:grid-cols-3' : 'lg:grid-cols-2'} gap-8 max-w-5xl mx-auto justify-center`}
          >
            {plans.map((plan, idx) => {
              // Styling logic
              const isFirst = idx === 0;
              const isSecond = idx === 1; // Popular
              
              let cardClass = "rounded-4xl p-10 flex flex-col shadow-sm space-y-6 relative transition-transform hover:-translate-y-2 ";
              let titleIcon = null;
              let borderClass = "";
              let buttonClass = "";
              let btnText = "Mulai Uji Coba";
              
              if (isFirst) {
                cardClass += "bg-amber-300 dark:bg-amber-400 text-black border border-neutral-100 dark:border-none";
                borderClass = "border-yellow-200";
                buttonClass = "w-full group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-100 border-2 border-black px-6 font-medium text-black transition-all duration-100 shadow-[5px_5px_rgb(0_0_0)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-white";
                titleIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 11.5C12.4955 11.5 12.9562 11.3015 13.8775 10.9045L14.5423 10.618C16.1808 9.91202 17 9.55902 17 9C17 8.44098 16.1808 8.08798 14.5423 7.38197L13.8775 7.09549C12.9562 6.6985 12.4955 6.5 12 6.5C11.5045 6.5 11.0438 6.6985 10.1225 7.09549L9.45768 7.38197C7.81923 8.08798 7 8.44098 7 9C7 9.55902 7.81923 9.91202 9.45768 10.618L10.1225 10.9045C11.0438 11.3015 11.5045 11.5 12 11.5ZM12 11.5V17.5" /><path d="M17 9V15C17 15.559 16.1808 15.912 14.5423 16.618L13.8775 16.9045C12.9562 17.3015 12.4955 17.5 12 17.5C11.5045 17.5 11.0438 17.3015 10.1225 16.9045L9.45768 16.618C7.81923 15.912 7 15.559 7 15V9" /><path d="M9.14426 2.5C6.48724 2.56075 4.93529 2.81456 3.87493 3.87493C2.81456 4.93529 2.56075 6.48724 2.5 9.14426M14.8557 2.5C17.5128 2.56075 19.0647 2.81456 20.1251 3.87493C21.1854 4.93529 21.4392 6.48724 21.5 9.14426M14.8557 21.5C17.5128 21.4392 19.0647 21.1854 20.1251 20.1251C21.1854 19.0647 21.4392 17.5128 21.5 14.8557M9.14426 21.5C6.48724 21.4392 4.93529 21.1854 3.87493 20.1251C2.81456 19.0647 2.56075 17.5128 2.5 14.8557" /></svg>;
              } else if (isSecond) {
                cardClass += "bg-neutral-900 text-white shadow-2xl ring-1 ring-white/10";
                borderClass = "border-neutral-800";
                buttonClass = "w-full group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-50 border-2 border-amber-300 px-6 font-medium text-black transition-all duration-100 shadow-[5px_5px_rgb(255_210_48)] active:translate-x-[3px] active:translate-y-[3px] hover:bg-neutral-100 active:shadow-none";
                titleIcon = <Box className="size-8" strokeWidth={1.5} />;
                btnText = "Beli Paket Pro";
              } else {
                cardClass += "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 shadow-xl";
                borderClass = "border-slate-200 dark:border-slate-800";
                buttonClass = "w-full group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-6 font-medium text-white transition-all duration-100 hover:bg-blue-700 active:scale-95";
                titleIcon = <Zap className="size-8" strokeWidth={1.5} />;
                btnText = "Pilih Paket";
              }

              return (
                <TimelineAnimation
                  key={plan.id}
                  animationNum={5 + idx}
                  timelineRef={timelineRef}
                  className={cardClass}
                >
                  {isSecond && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-black font-bold text-[13px] px-4 py-1.5 rounded-full flex items-center shadow-md border-2 border-neutral-900 whitespace-nowrap z-10">
                      <Sparkles className="w-4 h-4 mr-1" /> Terpopuler
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                      {titleIcon}
                      {plan.name}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-4xl md:text-5xl font-semibold ">
                      {plan.price_yearly === 0 ? "Gratis" : formatRupiah(plan.price_yearly)}
                    </span>
                    <span className={`text-xl font-medium ${isFirst ? 'text-neutral-700' : isSecond ? 'text-neutral-400' : 'text-slate-500'}`}>
                      {plan.price_yearly === 0 ? "/ 30 hari" : "/tahun"}
                    </span>
                  </div>

                  <div className={`space-y-4 pt-6 border-t ${borderClass}`}>
                    {(plan.features || []).map((feature: string, i: number) => (
                      <div key={i} className="flex justify-start items-center gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${isFirst ? 'text-black' : isSecond ? 'text-amber-300' : 'text-blue-500'}`} />
                        <span className={`text-sm font-medium ${isFirst ? 'text-neutral-800' : isSecond ? 'text-neutral-300' : 'text-slate-700 dark:text-slate-300'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex-grow flex items-end">
                    <Link
                      href="/daftar"
                      className={buttonClass}
                    >
                      {isSecond && <Sparkles className="w-5 h-5 mr-2" />}
                      {btnText}
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
