"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface ProfilePimpinanProps {
  ppdbTitle: string;
  pimpinan?: {
    nama?: string;
    jabatan?: string;
    foto?: string;
    sambutan?: string;
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

export const ProfilePimpinan: React.FC<ProfilePimpinanProps> = ({ ppdbTitle, pimpinan }) => {
  const hasLeader = Boolean(pimpinan?.nama && pimpinan.nama.trim());
  const leaderName = pimpinan?.nama || "Pimpinan Sekolah";
  const leaderRole = pimpinan?.jabatan || "Kepala Sekolah";
  const leaderPhoto = pimpinan?.foto || "";
  const leaderSpeech =
    pimpinan?.sambutan ||
    `${leaderName}, sebagai ${leaderRole} yang memimpin arah kebijakan akademik, pengembangan teknologi, serta pengabdian masyarakat guna membawa ${ppdbTitle} unggul di tingkat nasional maupun global.`;

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

        {!hasLeader ? (
          <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Informasi pimpinan sekolah belum dikonfigurasikan oleh pihak sekolah.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-blue-900 dark:border-blue-500 shadow-md flex items-center justify-center">
                {leaderPhoto ? (
                  <Image
                    src={leaderPhoto}
                    alt={leaderName}
                    fill
                    sizes="(max-width: 640px) 224px, 256px"
                    className="object-cover object-top"
                    unoptimized={leaderPhoto.startsWith("http") || leaderPhoto.startsWith("/assets")}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <span className="text-4xl font-black text-blue-600 dark:text-blue-400">
                      {(leaderName || "P").substring(0, 2).toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold mt-1 opacity-75">{leaderRole}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-8 space-y-3 text-center md:text-left">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-widest block">
                {leaderRole}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {leaderName}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base pt-2 whitespace-pre-wrap wrap-break-word">
                {leaderSpeech}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};
