"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChevronRight } from "lucide-react";
import { MajorItem } from "../types";
import { useSchoolHref } from "@/hooks/useSchoolHref";

const ScrollFloat = dynamic(() => import("@/components/ScrollFloat"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: (props: any) => <div className={props.containerClassName}>{props.children}</div>
});

interface SchoolMajorsProps {
  schoolSlug: string;
  majors: MajorItem[];
  isMajorsVisible?: boolean;
}

export const SchoolMajors: React.FC<SchoolMajorsProps> = ({
  schoolSlug: _schoolSlug,
  majors,
  isMajorsVisible = true
}) => {
  const { href } = useSchoolHref();
  if (!majors || majors.length === 0) {
    return null;
  }

  return (
    <section id="majors" className="py-24 max-w-6xl mx-auto px-6 relative z-10 text-left">
      <div
        className={`text-center mb-16 transform transition-all duration-1000 ${
          isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <ScrollFloat
          containerClassName="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4"
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          Program Kompetensi Keahlian
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
          Tersedia jurusan unggulan dengan kurikulum berstandar industri nasional maupun internasional.
        </ScrollFloat>
      </div>

      <ScrollFloat containerClassName="w-full" textClassName="w-full" textMode={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {majors.map((major, index) => {
            const majorAccent = major.color || "#2563eb";
            return (
              <Link
                href={href(`/jurusan/${encodeURIComponent(major.code.toLowerCase())}`)}
                key={major.code}
                className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col justify-between relative overflow-hidden group transform ${
                  isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none z-0"
                  style={{ backgroundColor: majorAccent }}
                />
                <div 
                  className="absolute top-0 left-0 w-full h-1.5 opacity-90 group-hover:opacity-100 transition-all duration-300 z-10"
                  style={{ backgroundColor: majorAccent }}
                />

                <div className="relative z-10">
                  <div 
                    className="w-16 h-16 rounded-2xl overflow-hidden mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 shadow-md group-hover:shadow-xl"
                    style={{ borderColor: `${majorAccent}33` }}
                  >
                    {major.logo ? (
                      <Image
                        src={major.logo}
                        alt={`Logo ${major.code}`}
                        width={56}
                        height={56}
                        className="w-14 h-14 object-contain drop-shadow-xs"
                        unoptimized
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-white font-black text-xs uppercase"
                        style={{ backgroundColor: majorAccent }}
                      >
                        {major.code}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-3">
                    {major.code === "AN" ? major.title : `${major.title} (${major.code})`}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {major.desc ? `${major.desc.substring(0, 105)}...` : ""}
                  </p>
                </div>
                <span 
                  className="flex items-center gap-2 text-sm font-bold transition-all relative z-10"
                  style={{ color: majorAccent }}
                >
                  Lihat Selengkapnya{" "}
                  <ChevronRight
                    size={14}
                    className="transform group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </ScrollFloat>
    </section>
  );
};
