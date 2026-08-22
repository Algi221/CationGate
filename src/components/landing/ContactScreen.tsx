"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ContactScreen() {
  return (
    <section className="w-full px-4 md:px-6 py-16 md:py-24 max-w-6xl mx-auto flex justify-center items-center">
      {/* Main Rounded Box */}
      <div className="relative w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex min-h-100 md:min-h-112.5">
        {/* Blue Curved Background Shape */}
        <div className="absolute top-[-50%] bottom-[-50%] left-[-20%] w-[130%] md:w-[85%] bg-[#007AC3] rounded-r-[100%] md:rounded-[100%] z-0 pointer-events-none"></div>

        {/* Decorative Floating Arc Indicator */}
        <div className="hidden md:block absolute top-1/2 right-[12%] transform -translate-y-1/2 w-16 h-8 bg-linear-to-r from-white/80 to-white/10 backdrop-blur-md rounded-l-full z-0 opacity-80 pointer-events-none shadow-sm"></div>

        {}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between px-8 py-12 md:px-16 md:py-0">
          {}
          <div className="w-full md:w-3/5 flex flex-col items-start text-left mb-12 md:mb-0">
            <div className="inline-flex items-center gap-2 px-0 py-1.5 text-white/90 text-sm font-bold tracking-widest mb-4">
              Bantuan & Diskusi
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
              Butuh Penjelasan <br />
              <span className="text-[#FFD33B]">Lebih Lanjut?</span>
            </h2>

            <Link href="/kontak" className="inline-block mt-2">
              <div className="inline-flex items-center gap-3 bg-[#FFD33B] hover:bg-[#E5BC35] text-[#111] px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 shadow-lg shadow-black/10 group cursor-pointer">
                <span>Hubungi Tim Teknis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {}
          <div className="w-full md:w-2/5 flex justify-center md:justify-end items-center relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              {}
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-110 pointer-events-none"></div>

              <Image
                src="/assets/catpeer/catpeerTodo.svg"
                alt="Bantuan & Diskusi"
                width={320}
                height={320}
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
