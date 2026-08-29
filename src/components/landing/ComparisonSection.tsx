"use client";

import React from "react";
import { ArrowRight, XCircle } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

export function ComparisonSection() {
  const comparisonItems = [
    {
      aspect: "Pengisian Formulir",
      conventional: {
        title: "Beli Map & Tulis Tangan Fisik",
        desc: "Wajib datang ke sekolah, membeli formulir kertas, dan mengisi data manual di loket.",
      },
      cationgate: {
        title: "Isi Mandiri dari Device Pengguna",
        desc: "Formulir digital responsif yang dapat diakses dari mana saja, lengkap dengan validasi NISN & NIK.",
      },
    },
    {
      aspect: "Pembayaran Formulir",
      conventional: {
        title: "Antre di Loket TU / Foto Struk Manual",
        desc: "Pembayaran tunai di tempat yang membutuhkan antrean panjang dan verifikasi manual satu per satu.",
      },
      cationgate: {
        title: "Multi-Metode: VA, QRIS & Tunai",
        desc: "Mendukung pembayaran online real-time maupun tunai sekolah dengan pencatatan otomatis di dashboard.",
      },
    },
    {
      aspect: "Manajemen Data & Database",
      conventional: {
        title: "Ketik Manual Satu per Satu ke Excel",
        desc: "Panitia harus lembur memindahkan data, sangat rentan kesalahan input, data ganda, dan file rusak.",
      },
      cationgate: {
        title: "Dashboard Admin Terpusat",
        desc: "Data pendaftar masuk otomatis, dilengkapi filter instan, status real-time, dan ekspor siap Dapodik.",
      },
    },
    {
      aspect: "Verifikasi Berkas Calon Siswa",
      conventional: {
        title: "Periksa Tumpukan Kertas Fisik",
        desc: "Sulit melacak dokumen siswa mana saja yang sudah lengkap atau belum terkumpul sepenuhnya.",
      },
      cationgate: {
        title: "Validasi Digital dengan Todo-List",
        desc: "Panitia dapat langsung mencentang kelengkapan berkas syarat secara digital dalam satu panel.",
      },
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-[#FFC000]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 tracking-wide uppercase shadow-sm"
          >
            <span>Transformasi SPMB Sekolah</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-950 dark:text-white tracking-tight leading-tight">
            Tinggalkan Cara Lama, Beralih ke{" "}
            <span className="text-[#FFC000]">Ekosistem Cerdas</span>.
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            Bandingkan kompleksitas pengelolaan manual dengan efisiensi tinggi
            menggunakan portal cloud modern CationGate.
          </p>
        </motion.div>
        {/* Comparison Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card Konvensional (Metode Tradisional) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-8 transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 mb-6 relative z-10">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-200/60 dark:bg-neutral-800 px-3 py-1 rounded-md">
                  Metode Tradisional
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-2">
                  Cara Tradisional
                </h3>
              </div>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-10 h-10 rounded-xl bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0"
              >
                <XCircle className="w-5 h-5 text-rose-500" />
              </motion.div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 flex-1 relative z-10"
            >
              {comparisonItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="space-y-1"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    {item.aspect}
                  </span>
                  <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {item.conventional.title}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {item.conventional.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8 pt-5 border-t border-neutral-200 dark:border-neutral-800 relative z-10">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium text-center">
                Waktu terbuang, biaya cetak tinggi, dan rawan kesalahan manusia.
              </p>
            </div>
          </motion.div>

          {/* Card CationGate (Solusi Unggulan dengan Maskot di Header/Bagian Atas) */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7 flex flex-col rounded-2xl bg-[#080808] text-white border border-[#FFC000]/40 p-8 sm:p-10 shadow-xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFC000]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between pb-6 border-b border-neutral-800 mb-6 relative z-10 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-950 bg-[#FFC000] px-3 py-1 rounded-md inline-block">
                  Solusi CationGate
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Portal Cloud Terintegrasi
                </h3>
              </div>

              {/* Maskot dipindah ke bagian header atas kanan (aman dari tombol dan teks list) */}
              <motion.div
                initial={{ y: 0, rotate: -5 }}
                animate={{ y: [-3, 3, -3], rotate: [-5, 0, -5] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 relative shrink-0 -mt-2"
              >
                <Image
                  src="/assets/catpeer/catpeerJatuh.svg"
                  alt="Catpeer CationGate"
                  fill
                  className="object-contain drop-shadow-[0_0_12px_rgba(255,192,0,0.35)]"
                />
              </motion.div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 flex-1 relative z-10"
            >
              {comparisonItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FFC000]">
                      {item.aspect}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    {item.cationgate.title}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {item.cationgate.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <span className="text-xs text-neutral-400 font-medium">
                100% Paperless • Siap Impor Dapodik
              </span>
              <Link href="/daftar" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FFC000] hover:bg-[#e5ac00] text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer group shadow-lg shadow-[#FFC000]/10"
                >
                  <span>Daftar Sekolah Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Note Box Bawah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center max-w-3xl mx-auto"
        >
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <strong className="font-semibold text-neutral-900 dark:text-white">
              Catatan Transparansi:
            </strong>{" "}
            CationGate memfasilitasi pencatatan dan verifikasi biaya formulir
            atau administrasi pendaftaran secara transparan, mendukung
            pembayaran transfer online maupun tunai langsung di loket sekolah.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default ComparisonSection;
