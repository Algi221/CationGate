"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { PartnerItem } from "../types";

const ScrollFloat = dynamic(() => import("@/components/ScrollFloat"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: (props: any) => <div className={props.containerClassName}>{props.children}</div>
});

const sanitizeSrc = (src: string | undefined | null): string | undefined => {
  if (!src) return undefined;
  if (/^(?:https?:\/\/|\/|data:image\/)/i.test(src)) {
    if (src.toLowerCase().includes("javascript:")) return undefined;
    return src;
  }
  return undefined;
};

interface SchoolKemitraanProps {
  partnersList: Array<PartnerItem & { id?: number; url?: string; h?: string }>;
}

export const SchoolKemitraan: React.FC<SchoolKemitraanProps> = ({ partnersList }) => {
  const [showAllPartners, setShowAllPartners] = useState(false);

  if (!partnersList || partnersList.length === 0) return null;

  const displayedPartners = showAllPartners ? partnersList : partnersList.slice(0, 10);

  const getPartnerDimensions = (hClass?: string) => {
    switch (hClass) {
      case "h-20":
        return { width: 150, height: 80 };
      case "h-16":
        return { width: 120, height: 64 };
      case "h-14":
        return { width: 105, height: 56 };
      case "h-12":
        return { width: 90, height: 48 };
      case "h-10":
        return { width: 75, height: 40 };
      case "h-8":
        return { width: 60, height: 32 };
      default:
        return { width: 120, height: 60 };
    }
  };

  return (
    <section id="kemitraan" className="py-24 max-w-6xl mx-auto px-6 relative z-10 border-t border-slate-200 dark:border-slate-800/30 text-left">
      <div className="text-center mb-16">
        <ScrollFloat
          containerClassName="inline-block mb-2"
          textClassName="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full"
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.02}
        >
          Kemitraan Industri
        </ScrollFloat>
        <ScrollFloat
          containerClassName="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mt-4 mb-4"
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          Gerbang Karir Global &amp; Sertifikasi
        </ScrollFloat>
        <ScrollFloat
          containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.01}
          textMode={false}
        >
          Kurikulum berstandar internasional yang diselaraskan langsung dengan mitra teknologi industri.
        </ScrollFloat>
      </div>

      <ScrollFloat
        containerClassName="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 mb-12 shadow-xs w-full"
        textClassName="w-full"
        textMode={false}
      >
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
          Partner Industri Utama &amp; Sertifikasi Internasional &middot;
        </p>

        <div className="w-full">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10 max-w-5xl mx-auto animate-in fade-in duration-500">
            {displayedPartners.map((partner, idx) => {
              const { width, height } = getPartnerDimensions(partner.h);
              return (
                <a
                  key={partner.id || idx}
                  href={partner.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center p-2 transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                  title={partner.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sanitizeSrc(partner.logo) || undefined}
                    alt={partner.name}
                    className={`w-auto object-contain ${partner.h || "h-12"} max-w-37.5 transition-all duration-300 drop-shadow-xs`}
                    loading="lazy"
                    width={width}
                    height={height}
                  />
                </a>
              );
            })}
          </div>

          {partnersList.length > 10 && (
            <div className="flex justify-center items-center mt-12">
              <button
                onClick={() => setShowAllPartners(!showAllPartners)}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {showAllPartners ? (
                  <>
                    Sembunyikan
                    <ChevronLeft size={16} className="rotate-90" />
                  </>
                ) : (
                  <>
                    Lihat Selengkapnya
                    <ChevronRight size={16} className="rotate-90" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </ScrollFloat>
    </section>
  );
};
