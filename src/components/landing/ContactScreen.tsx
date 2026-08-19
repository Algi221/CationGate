"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ContactScreen() {
  return (
    <section className="w-full px-4 md:px-6 py-16 md:py-24 max-w-6xl mx-auto flex justify-center items-center">
      <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-[2.5rem] p-10 md:p-20 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/[0.03] to-transparent pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6 relative z-10">
          Bantuan & Diskusi
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tight max-w-2xl relative z-10">
          Punya Pertanyaan Lain Terkait Sistem?
        </h2>

        <div className="relative z-10 h-14 flex items-center justify-center">
          <Link
            href="/kontak"
            className="cursor-pointer flex items-center gap-2 bg-yellow-400 text-zinc-950 px-8 py-4 rounded-full font-bold text-base transition-all hover:bg-yellow-300 hover:scale-105 shadow-lg shadow-yellow-400/10 group will-change-transform"
          >
            <span>Hubungi Tim Teknis</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}


