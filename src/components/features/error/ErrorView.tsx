"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Home } from "lucide-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "../../../../public/assets/lottie_animation/404 Error Page.json";

export interface ErrorViewProps {
  title?: string;
  description?: string;
  urlPath?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function ErrorView({
  title = "Halaman Tidak Ditemukan",
  description = "Halaman atau tautan yang Anda tuju tidak ditemukan, sudah dipindahkan, atau alamat URL salah ketik.",
  urlPath,
  ctaText = "Kembali ke Beranda",
  ctaHref = "/"
}: ErrorViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center p-6 text-center font-sans selection:bg-amber-400 selection:text-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg space-y-6 my-auto"
      >
        {/* UFO Animation */}
        <div className="w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center pointer-events-none">
          <Lottie animationData={animationData} loop={true} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {urlPath && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-600 dark:text-slate-400 max-w-full truncate">
            <span className="truncate">URL: {urlPath}</span>
          </div>
        )}

        {/* Single Yellow Action CTA */}
        <div className="pt-2 flex items-center justify-center">
          <Link
            href={ctaHref}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 border border-amber-300 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={15} className="stroke-[2.5]" />
            <span>{ctaText}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ErrorView;
