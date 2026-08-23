"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface ProfileKunjunganProps {
  identitas: {
    alamat: string;
    email: string;
  };
}

const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const ProfileKunjungan: React.FC<ProfileKunjunganProps> = ({ identitas }) => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 mt-12 transition-colors duration-300">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInVariant}
      >
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Kunjungan</h2>
          <div className="w-16 h-1 bg-blue-900 dark:bg-blue-500 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Kampus Utama
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {identitas.alamat}
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-900 dark:text-blue-400">
              {identitas.email}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Pusat Inovasi & Praktikum
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Fasilitas laboratorium komputer terpadu, studio multimedia, dan workshop teknik
              berstandar industri.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Layanan PPDB
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pusat informasi pendaftaran siswa baru setiap hari kerja pukul 08.00 - 15.00 WIB.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
