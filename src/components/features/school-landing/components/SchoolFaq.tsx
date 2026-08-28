"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronRight, HelpCircle } from "lucide-react";
import { FaqItem } from "../types";

const ScrollFloat = dynamic(() => import("@/components/ScrollFloat"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: (props: any) => <div className={props.containerClassName}>{props.children}</div>
});

interface SchoolFaqProps {
  faqTitle?: string;
  faqSubtitle?: string;
  faqList: FaqItem[];
}

export const SchoolFaq: React.FC<SchoolFaqProps> = ({
  faqTitle = "Pertanyaan yang Sering Diajukan",
  faqSubtitle = "Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru.",
  faqList
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const hasFaq = Boolean(faqList && faqList.length > 0);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-950 relative z-10 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-300 text-left">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <ScrollFloat
            containerClassName="inline-block mb-2"
            textClassName="text-blue-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="top 90%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.02}
          >
            FAQ PPDB
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-xs"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {faqTitle}
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="top 90%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.01}
            textMode={false}
          >
            {faqSubtitle}
          </ScrollFloat>
        </div>

        {!hasFaq ? (
          <div className="max-w-2xl mx-auto bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
              <HelpCircle size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5">
              Belum Ada FAQ yang Ditambahkan
            </h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Pertanyaan umum seputar proses pendaftaran siswa baru akan segera diperbarui oleh panitia.
            </p>
          </div>
        ) : (

        <div className="space-y-6 w-full">
          {faqList.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <ScrollFloat
                key={idx}
                containerClassName="w-full"
                textClassName="w-full"
                textMode={false}
                scrollStart="top 90%"
                scrollEnd="bottom 75%"
              >
                <div className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden transition-all duration-300 shadow-xs">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-black text-sm md:text-base text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`text-blue-500 transform transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronRight size={20} className="rotate-90" />
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-60 border-t border-slate-200 dark:border-slate-800/50" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 py-5 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </ScrollFloat>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
