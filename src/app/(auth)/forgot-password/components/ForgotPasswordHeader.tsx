"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface ForgotPasswordHeaderProps {
  solidColor: string;
}

export const ForgotPasswordHeader: React.FC<ForgotPasswordHeaderProps> = ({ solidColor }) => {
  return (
    <div className="relative lg:absolute top-2 lg:top-8 left-2 lg:left-8 right-2 lg:right-8 flex items-center justify-between z-20 mb-4 lg:mb-0">
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-white/80 transition-all group drop-shadow-sm"
          title="Kembali ke Login"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Login</span>
        </Link>
      </div>

      {/* Center Brand */}
      <Link
        href="/"
        className="flex items-center gap-2 group lg:absolute lg:left-[45vw] lg:translate-x-[-55%] transition-transform hover:scale-102"
      >
        <Image
          src="/assets/logo_cationgate/CationGate_Logo.png"
          alt="CationGate Logo"
          width={28}
          height={28}
          className="w-6 h-6 sm:w-7 sm:h-7 object-contain transition-transform group-hover:rotate-6 drop-shadow-sm"
        />
        <div className="text-xl sm:text-2xl font-black tracking-tight font-sans select-none flex items-center">
          <span className="text-slate-950">Cation</span>
          <span style={{ color: solidColor }} className="drop-shadow-none">Gate</span>
        </div>
      </Link>

      {/* Right CTA */}
      <div className="flex items-center gap-2.5 text-xs">
        <span className="hidden text-slate-500 font-medium sm:block">Sudah ingat password?</span>
        <Link
          href="/login"
          className="rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-1.5 font-bold text-slate-700 transition-all hover:bg-white hover:text-amber-600 hover:border-amber-300 hover:shadow-sm active:scale-95 shadow-xs"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
};
