"use client";

import React from "react";
import Image from "next/image";
import { MajorDetail } from "../types";

interface JurusanGalleryProps {
  major: MajorDetail;
}

export const JurusanGallery: React.FC<JurusanGalleryProps> = ({ major }) => {
  if (!major.gallery || major.gallery.length === 0) return null;

  return (
    <section className="py-20 max-w-6xl mx-auto px-6 relative text-left">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          Aktivitas Kelas &amp; Praktik
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
          Galeri Kegiatan Taruna Bhakti
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
          Melihat lebih dekat keseruan suasana praktikum, kolaborasi proyek mandiri, dan evaluasi hasil karya taruna-taruni.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {major.gallery.map((img, index) => (
          <div
            key={index}
            className="group bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-md hover:shadow-xl transition-all duration-500 relative overflow-hidden"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#1e293b]">
              <Image
                src={img.url}
                alt={img.caption}
                width={400}
                height={400}
                unoptimized
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-x-2 bottom-2 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md border border-white/10 p-3 rounded-xl transition duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[10px] font-extrabold text-white uppercase tracking-wide">
                  Aktivitas {major.alias}
                </p>
                <p className="text-xs text-slate-200 font-medium leading-snug mt-0.5">
                  {img.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
