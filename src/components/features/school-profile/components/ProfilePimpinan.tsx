"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface ProfilePimpinanProps {
  ppdbTitle: string;
}

const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const ProfilePimpinan: React.FC<ProfilePimpinanProps> = ({ ppdbTitle }) => {
  return (
    <section
      id="pimpinan"
      className="py-16 max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-24 border-t border-slate-100 dark:border-slate-800 mt-8 transition-colors duration-300"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInVariant}
      >
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Pimpinan</h2>
          <div className="w-16 h-1 bg-blue-900 dark:bg-blue-500 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-blue-900 dark:border-blue-500 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                alt="Kepala Sekolah"
                fill
                sizes="(max-width: 640px) 224px, 256px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="md:col-span-8 space-y-3 text-center md:text-left">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-widest block">
              Rektor / Kepala Sekolah
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Dr. H. Ahmad Fauzi, M.Pd.
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base pt-2">
              Dr. H. Ahmad Fauzi, M.Pd., sebagai Kepala Sekolah periode 2023-2028 yang memimpin arah
              kebijakan akademik, pengembangan teknologi, serta pengabdian masyarakat guna membawa{" "}
              {ppdbTitle} unggul di tingkat nasional maupun global.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
