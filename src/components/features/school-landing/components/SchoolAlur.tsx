"use client";

import React from "react";
import dynamic from "next/dynamic";
import { AlurItem } from "../types";
import { getAlurIconComponent } from "@/utils/alurIcons";

const ScrollFloat = dynamic(() => import("@/components/ScrollFloat"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: (props: any) => <div className={props.containerClassName}>{props.children}</div>
});

interface SchoolAlurProps {
  schoolPeriod: string;
  alurList: AlurItem[];
}

export const SchoolAlur: React.FC<SchoolAlurProps> = ({ schoolPeriod, alurList }) => {
  const styles = [
    { color: "blue", bg: "bg-blue-600", text: "text-blue-700 dark:text-blue-300", bgLight: "bg-blue-50 dark:bg-blue-950/60", shadow: "shadow-[0_0_20px_rgba(37,99,235,0.4)]", borderHover: "hover:border-blue-500/20" },
    { color: "amber", bg: "bg-amber-500", text: "text-amber-800 dark:text-amber-300", bgLight: "bg-amber-50 dark:bg-amber-950/60", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]", borderHover: "hover:border-amber-500/20" },
    { color: "teal", bg: "bg-teal-500", text: "text-teal-700 dark:text-teal-300", bgLight: "bg-teal-50 dark:bg-teal-950/60", shadow: "shadow-[0_0_20px_rgba(20,184,166,0.4)]", borderHover: "hover:border-teal-500/20" },
    { color: "rose", bg: "bg-rose-500", text: "text-rose-700 dark:text-rose-300", bgLight: "bg-rose-50 dark:bg-rose-950/60", shadow: "shadow-[0_0_20px_rgba(244,63,94,0.4)]", borderHover: "hover:border-rose-500/20" },
    { color: "indigo", bg: "bg-indigo-600", text: "text-indigo-700 dark:text-indigo-300", bgLight: "bg-indigo-50 dark:bg-indigo-950/60", shadow: "shadow-[0_0_20px_rgba(79,70,229,0.4)]", borderHover: "hover:border-indigo-500/20" },
    { color: "emerald", bg: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300", bgLight: "bg-emerald-50 dark:bg-emerald-950/60", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]", borderHover: "hover:border-emerald-500/20" },
  ];

  return (
    <section id="alur" className="py-24 relative z-10 border-b border-slate-200 dark:border-slate-800 text-left">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <ScrollFloat
            containerClassName="inline-block mb-2"
            textClassName="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="top 90%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.02}
          >
            Proses Mudah &amp; Transparan · TP. {schoolPeriod}
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-xs pb-2"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="top 90%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            Alur Pendaftaran PPDB
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
            Ikuti 6 langkah sederhana berikut untuk menjadi bagian dari calon peserta didik baru.
          </ScrollFloat>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-blue-500 via-sky-400 to-indigo-500 transform -translate-x-1/2 z-0 rounded-full opacity-70"></div>
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 border-l-2 border-dashed border-white/40 dark:border-slate-950/40 transform -translate-x-1/2 z-0"></div>

          <div className="space-y-16 relative z-10 w-full">
            {alurList.map((item, index) => {
              const isLeft = index % 2 === 0;
              const stepStyle = styles[index % styles.length];
              const Icon = getAlurIconComponent(item.icon, index);

              return (
                <ScrollFloat
                  key={item.id}
                  containerClassName="w-full"
                  textClassName="w-full"
                  textMode={false}
                  scrollStart="top 85%"
                  scrollEnd="bottom 60%"
                >
                  <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                    {isLeft ? (
                      <>
                        <div className="pl-20 md:pl-0 md:pr-12 md:text-right">
                          <div
                            className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl ${stepStyle.borderHover} hover:-translate-y-1 transition-all duration-300`}
                          >
                            <span
                              className={`inline-block px-3 py-1 ${stepStyle.bgLight} ${stepStyle.text} rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3`}
                            >
                              Tahap 0{item.id}
                            </span>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <div className="hidden md:block"></div>
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block"></div>
                        <div className="pl-20 md:pl-12 md:text-left">
                          <div
                            className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl ${stepStyle.borderHover} hover:-translate-y-1 transition-all duration-300`}
                          >
                            <span
                              className={`inline-block px-3 py-1 ${stepStyle.bgLight} ${stepStyle.text} rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3`}
                            >
                              Tahap 0{item.id}
                            </span>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                    <div
                      className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${stepStyle.bg} border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 ${stepStyle.shadow} transition-all duration-300`}
                    >
                      <Icon size={22} />
                    </div>
                  </div>
                </ScrollFloat>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
