"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Globe, Award, BookOpen, GraduationCap } from "lucide-react";

const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const ProfileFaktaAngka: React.FC = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInVariant}
      >
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Fakta dan Angka
          </h2>
          <div className="w-16 h-1 bg-blue-900 dark:bg-blue-500 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Globe size={28} className="text-blue-900 dark:text-blue-400 stroke-[1.5]" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Worldrank</h3>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800">
              {[
                { label: "QS World Rankings 2025", val: "#256" },
                { label: "QS Asian Rankings 2025", val: "#59" },
                { label: "THE World Rankings 2025", val: "1201-1500" },
                { label: "THE Asia Rankings 2024", val: "401-500" },
                { label: "Lainnya", val: "" }
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm"
                >
                  <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <BookOpen size={28} className="text-blue-900 dark:text-blue-400 stroke-[1.5]" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Pendidikan dan Pengajaran
              </h3>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800">
              {[
                { label: "Multikampus", val: "4" },
                { label: "Fakultas dan Sekolah", val: "12" },
                { label: "Program Studi", val: "137" },
                { label: "Joint Degrees", val: "10" },
                { label: "Dosen", val: "1.422" },
                { label: "Mahasiswa", val: "27.506" }
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm"
                >
                  <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Award size={28} className="text-blue-900 dark:text-blue-400 stroke-[1.5]" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Riset</h3>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800">
              {[
                { label: "Pusat", val: "26" },
                { label: "Pusat Unggulan Iptek", val: "9" },
                { label: "Pusat Penelitian", val: "7" },
                { label: "Kelompok Keahlian", val: "113" },
                { label: "Laboratorium", val: "198" },
                { label: "Scopus Journal", val: "1.248" },
                { label: "International Journal", val: "421" },
                { label: "Proceedings International", val: "674" }
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm"
                >
                  <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <GraduationCap size={28} className="text-blue-900 dark:text-blue-400 stroke-[1.5]" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Inovasi</h3>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800">
              {[
                { label: "Startup", val: "244" },
                { label: "HKI", val: "1.176" },
                { label: "Inovasi", val: "212" },
                { label: "Tenant", val: "972" }
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm"
                >
                  <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
