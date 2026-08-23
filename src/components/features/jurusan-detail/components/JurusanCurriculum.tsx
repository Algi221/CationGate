"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { MajorDetail } from "../types";

interface JurusanCurriculumProps {
  major: MajorDetail;
}

export const JurusanCurriculum: React.FC<JurusanCurriculumProps> = ({ major }) => {
  return (
    <section className="py-20 bg-slate-100 dark:bg-slate-900/30 relative border-y border-slate-200 dark:border-slate-800 text-left">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Materi Pembelajaran
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
            Kurikulum Berbasis Kompetensi
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
            Materi pembelajaran terstruktur yang diintegrasikan langsung dengan standard kebutuhan industri nasional maupun global.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {major.syllabus.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0f172a] border border-white/50 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-500/20 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 major-gradient-bg opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-300" />

              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 major-bg-accent major-text-accent">
                <BookOpen size={20} />
              </div>

              <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                {item.subject}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
