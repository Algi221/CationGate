"use client";

import React from "react";
import { Briefcase } from "lucide-react";
import { MajorDetail } from "../types";

interface JurusanCareersProps {
  major: MajorDetail;
}

export const JurusanCareers: React.FC<JurusanCareersProps> = ({ major }) => {
  return (
    <section className="py-20 bg-slate-100 dark:bg-slate-900/30 relative border-y border-slate-200 dark:border-slate-800 text-left">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Masa Depan Karir
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
            Peluang Kerja &amp; Prospek Profesional
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
            Lulusan dibekali dengan kompetensi matang sehingga siap diserap langsung oleh industri teknologi atau melanjutkan studi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {major.careers.map((career, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0f172a] border border-white/50 dark:border-slate-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 flex items-start gap-5 relative group"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 major-bg-accent major-text-accent">
                <Briefcase size={22} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {career.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {career.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
