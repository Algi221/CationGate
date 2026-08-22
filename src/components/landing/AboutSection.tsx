"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden relative border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }} 
            className="space-y-6"
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
              Solusi Pendidikan
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Lebih Dari Sekadar Sistem Pendaftaran
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
              <p>
                Administrasi sekolah yang rumit dan tumpukan berkas pendaftaran seringkali menyita waktu berharga yang seharusnya bisa difokuskan pada peningkatan kualitas pendidikan itu sendiri.
              </p>
              <p>
                <strong>CationGate</strong> lahir dari visi untuk menjembatani institusi pendidikan dengan teknologi masa kini. Kami tidak hanya membuat sistem PPDB *online*, tetapi merancang ekosistem digital terpadu yang dirancang untuk mempermudah panitia, menenangkan orang tua, dan memperlancar langkah calon siswa baru.
              </p>
              <p>
                Dengan antarmuka yang bersih, alur kerja yang intuitif, dan manajemen data yang terpusat, kami hadir untuk mengubah kerumitan birokrasi menjadi pengalaman digital yang mulus, elegan, dan tanpa hambatan.
              </p>
            </div>

            {}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
               <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="text-blue-500" size={20} /> Antarmuka Modern
               </div>
               <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="text-blue-500" size={20} /> Data Terpusat
               </div>
               <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="text-blue-500" size={20} /> Keamanan Terjamin
               </div>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Image Card */}
            <div className="relative w-full aspect-square md:aspect-4/3 lg:aspect-4/5 rounded-3xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 group">
               {/* Gunakan gambar representatif sekolah/teknologi */}
              <Image
                src="/assets/landing/school.jpeg" 
                alt="Tentang CationGate"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              {/* Overlay styling */}
              <div className="absolute inset-0 bg-linear-to-tr from-blue-600/10 to-transparent mix-blend-overlay"></div>
            </div>

            {}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}