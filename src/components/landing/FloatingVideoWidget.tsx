"use client";

import React from "react";

interface FloatingVideoWidgetProps {
  onClick: () => void;
}

export const FloatingVideoWidget: React.FC<FloatingVideoWidgetProps> = ({
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="fixed bottom-6 right-6 w-[200px] aspect-video rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)] z-[90] cursor-pointer group transition-transform duration-300 hover:scale-105 bg-slate-900 border border-slate-700"
    >
      {/* 
        TRIK SKALA IFRAME:
        1. Kita buat container iframe 2x lebih besar lebarnya (w-[400px]).
        2. Kita perkecil seluruh elemennya menjadi setengahnya menggunakan `scale-50` dan `origin-top-left`.
        Hasil: Video tetap utuh tidak di-zoom, tapi UI YouTube (teks & ikon) mengecil 50%.
      */}
      <div className="absolute inset-0 pointer-events-none w-[400px] origin-top-left scale-50">
        <iframe
          src="https://www.youtube-nocookie.com/embed/1FcVJxxPWh4?autoplay=1&mute=1&loop=1&playlist=1FcVJxxPWh4&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1"
          title="Floating Background Video"
          className="w-full aspect-video object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
      </div>

      {/* Overlay Gradient agar teks buatan kita tetap terbaca */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

      {/* Teks "Watch Demo" kustom dari kamu */}
      <div className="absolute bottom-2 left-2 flex items-center text-white z-20 pointer-events-none">
        <div className="w-6 h-6 border border-white/50 rounded-full flex items-center justify-center mr-2 bg-black/40 backdrop-blur-md">
          <span className="text-[8px] ml-[2px]">▶</span>
        </div>
        <span className="text-xs font-semibold tracking-wide drop-shadow-lg">
          Watch Demo
        </span>
      </div>
    </div>
  );
};
