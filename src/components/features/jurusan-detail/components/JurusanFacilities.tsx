"use client";

import React from "react";
import { Check, Award } from "lucide-react";
import { MajorDetail } from "../types";

interface JurusanFacilitiesProps {
  major: MajorDetail;
  accentColor: string;
}

export const JurusanFacilities: React.FC<JurusanFacilitiesProps> = ({ major, accentColor }) => {
  return (
    <section className="py-20 max-w-6xl mx-auto px-6 relative text-left">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Facilities Column */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 major-bg-accent major-text-accent">
              Fasilitas Praktik
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
              Laboratorium Standar Industri
            </h2>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Untuk menjamin penyerapan kompetensi secara maksimal, praktikum dilakukan di ruangan laboratorium eksklusif dengan perangkat berspesifikasi tinggi.
          </p>

          <div className="space-y-3.5 pt-2">
            {major.facilities.map((fac, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 text-slate-700 dark:text-slate-300 font-semibold text-sm"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-emerald-500 shadow-xs shrink-0">
                  <Check size={18} className="shrink-0 stroke-3" style={{ color: accentColor }} />
                </div>
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partners Column */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 backdrop-blur-md rounded-4xl p-8 flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
              Sertifikasi &amp; Mitra Industri
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Penyelarasan kurikulum nasional dan pemberian materi sertifikasi bertaraf internasional langsung dari principal terkemuka:
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
              Key Industrial Partners
            </span>
            <p className="text-base font-extrabold text-slate-800 dark:text-white leading-relaxed">
              {major.partners}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
