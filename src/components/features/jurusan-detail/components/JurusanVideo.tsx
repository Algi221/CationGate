"use client";

import React from "react";
import { Video } from "lucide-react";
import { MajorDetail } from "../types";
import { sanitizeSrc } from "../defaultMajorsData";

interface JurusanVideoProps {
  major: MajorDetail;
}

export const JurusanVideo: React.FC<JurusanVideoProps> = ({ major }) => {
  if (!major.video) return null;

  return (
    <section className="py-12 px-6 max-w-5xl mx-auto w-full relative z-10 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 md:p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full major-gradient-bg opacity-10 dark:opacity-25 blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider major-bg-accent major-text-accent">
            <Video size={12} className="animate-pulse" />
            Video Profil &amp; Pengenalan Jurusan
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
            Saksikan Video Dokumenter {major.alias}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Tonton video penjelasan ruang laboratorium praktikum, kompetensi dasar, hasil karya proyek lulusan, serta suasana kolaborasi siswa {major.title}.
          </p>
        </div>

        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-center p-2">
          {major.video.startsWith("data:video") ||
          major.video.includes(".mp4") ||
          major.video.startsWith("blob:") ? (
            <video
              src={sanitizeSrc(major.video) || undefined}
              controls
              className="w-full h-full object-cover rounded-[20px]"
            >
              <track kind="captions" label="No captions" default />
            </video>
          ) : (
            <iframe
              src={sanitizeSrc(major.video) || undefined}
              className="w-full h-full rounded-[20px] border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
};
