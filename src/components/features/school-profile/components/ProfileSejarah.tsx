"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface ProfileSejarahProps {
  sejarah: string;
}

const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const ProfileSejarah: React.FC<ProfileSejarahProps> = ({ sejarah }) => {
  return (
    <>
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Profil
          </h2>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-lg border border-slate-200 dark:border-slate-800">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/GR5wYYT4PJ8"
              title="Company Profile SMK Taruna Bhakti 2026"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </section>

      <section id="sejarah" className="py-12 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-blue-900 dark:border-blue-600 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Sejarah Singkat
            </h2>
          </div>
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap pt-2">
            {sejarah}
          </div>
        </motion.div>
      </section>
    </>
  );
};
