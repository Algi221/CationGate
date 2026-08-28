"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface ProfileIdentitasProps {
  identitas: {
    nama: string;
    akreditasi: string;
    alamat: string;
    npsn: string;
    tahun_berdiri: string;
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

export const ProfileIdentitas: React.FC<ProfileIdentitasProps> = ({ identitas }) => {
  return (
    <section
      id="identitas"
      className="py-12 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24 border-t border-slate-100 dark:border-slate-800 pt-16 transition-colors duration-300"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInVariant}
        className="space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-blue-900 dark:border-blue-600 pb-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Identitas Sekolah
          </h2>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
          {[
            { label: "Nama Sekolah", value: identitas.nama },
            { label: "Status Akreditasi", value: identitas.akreditasi },
            { label: "Alamat Lengkap", value: identitas.alamat },
            { label: "NPSN", value: identitas.npsn },
            { label: "Tahun Berdiri", value: identitas.tahun_berdiri },
            { label: "Email Resmi", value: identitas.email }
          ].map((row, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row py-3.5">
              <div className="w-full sm:w-1/3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {row.label}
              </div>
              <div className="w-full sm:w-2/3 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-pre-wrap wrap-break-word">
                {row.value || "-"}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
