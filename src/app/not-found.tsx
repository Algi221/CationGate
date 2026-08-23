"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Home,
  GraduationCap,
  ArrowLeft,
  Search
} from "lucide-react";
import Image from "next/image";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "../../public/assets/lottie_animation/404 Error Page.json";

export default function GlobalNotFound() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 relative rounded-xl overflow-hidden shadow-sm">
              <Image 
                src="/assets/logo_cationgate/CationGate_Logo.png" 
                alt="CationGate Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
              Cation<span className="text-blue-600">Gate</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Home size={14} />
              <span>Beranda</span>
            </Link>
            <Link
              href="/fitur"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <GraduationCap size={14} />
              <span>Fitur</span>
            </Link>
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Kembali"
            >
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* UFO 404 Main Area */}
      <main className="grow flex items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg space-y-6"
        >
          {/* UFO Animation */}
          <div className="w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center pointer-events-none">
            <Lottie animationData={animationData} loop={true} />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
              Error 404 · Page Lost In Space
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Halaman atau tautan yang Anda tuju tidak ditemukan, sudah dipindahkan, atau alamat URL salah ketik.
            </p>
          </div>

          {pathname && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-600 dark:text-slate-400 max-w-full truncate">
              <Search size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">URL: {pathname}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home size={14} />
              <span>Kembali ke Beranda</span>
            </Link>
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-wider shadow-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Halaman Sebelumnya</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/60 py-6 text-center text-xs font-bold text-slate-400">
        <p>© {new Date().getFullYear()} CationGate. All rights reserved.</p>
      </footer>
    </div>
  );
}
