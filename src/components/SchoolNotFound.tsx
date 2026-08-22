"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "../../public/assets/lottie_animation/404 Error Page.json";

interface SchoolNotFoundProps {
  slug: string;
  isTakedown?: boolean;
}

export default function SchoolNotFound({ slug, isTakedown }: SchoolNotFoundProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans select-none">
      <div className="w-full max-w-md space-y-4">
        <div className="w-72 h-72 mx-auto flex items-center justify-center">
          <Lottie animationData={animationData} loop={true} />
        </div>

        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          {isTakedown ? "Akses Instansi Ditangguhkan (Taken Down) 🔒" : "Halaman Tidak Ditemukan"}
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {isTakedown
            ? `Portal instansi '/${slug}' telah ditangguhkan oleh Gatekeeper CationGate karena belum melengkapi verifikasi legalitas & SK operasional dalam batas waktu 3 hari.`
            : "Maaf, halaman instansi yang Anda cari tidak dapat ditemukan atau belum terdaftar di platform CationGate."}
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-linear-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all inline-block"
          >
            Kembali ke Beranda CationGate
          </Link>
        </div>
      </div>
    </div>
  );
}
