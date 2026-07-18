"use client";

import React from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import animationData from "../../public/assets/lottie_animation/404 Error Page.json";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md">
        <div className="w-72 h-72 mx-auto">
          <Lottie animationData={animationData} loop={true} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-6">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all inline-block"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
