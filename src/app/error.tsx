"use client";

import React, { useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../public/assets/lottie_animation/404 Error Page.json";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to an error reporting service if needed
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md">
        <div className="w-72 h-72 mx-auto">
          <Lottie animationData={animationData} loop={true} />
        </div>

        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-6">
          Terjadi Kesalahan Sistem
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
          Maaf, halaman mengalami masalah atau tidak dapat dimuat saat ini.
        </p>

        {(error as any).message && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-[11px] font-mono text-red-600 dark:text-red-400 break-words max-w-xs mx-auto">
            {(error as any).message}
          </div>
        )}

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all cursor-pointer"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
