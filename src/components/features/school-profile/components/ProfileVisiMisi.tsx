"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface ProfileVisiMisiProps {
  visi?: string;
  misi?: string;
  tujuan?: string;
}

const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const ProfileVisiMisi: React.FC<ProfileVisiMisiProps> = ({ visi, misi, tujuan }) => {
  const hasVisi = Boolean(visi && visi.trim());
  const hasMisi = Boolean(misi && misi.trim());
  const hasTujuan = Boolean(tujuan && tujuan.trim());

  return (
    <>
      <section id="visimisi" className="py-12 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 border-b border-blue-900 dark:border-blue-600 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Visi & Misi
            </h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visi Sekolah</h3>
            {hasVisi ? (
              <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed italic border-l-2 border-blue-900 dark:border-blue-500 pl-4 py-1 wrap-break-word">
                &quot;{visi}&quot;
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base italic border-l-2 border-slate-300 dark:border-slate-700 pl-4 py-1">
                Visi sekolah belum ditambahkan oleh pihak sekolah.
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Misi Sekolah</h3>
            {hasMisi ? (
              <div className="text-slate-700 dark:text-slate-300 text-base sm:text-lg whitespace-pre-wrap leading-relaxed pt-1 wrap-break-word">
                {misi}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base pt-1">
                Misi sekolah belum ditambahkan oleh pihak sekolah.
              </p>
            )}
          </div>
        </motion.div>
      </section>

      <section id="tujuan" className="py-12 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-blue-900 dark:border-blue-600 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Tujuan Sekolah
            </h2>
          </div>
          {hasTujuan ? (
            <div className="text-slate-700 dark:text-slate-300 text-base sm:text-lg whitespace-pre-wrap leading-relaxed pt-2 wrap-break-word">
              {tujuan}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              Tujuan institusi belum ditambahkan oleh pihak sekolah.
            </div>
          )}
        </motion.div>
      </section>
    </>
  );
};
