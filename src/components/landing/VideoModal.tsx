"use client";

import React from "react";
import { X, Play } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string | null;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#FFD33B]/10 text-[#FFD33B] flex items-center justify-center">
              <Play size={12} className="fill-[#FFD33B]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Video Demonstrasi Platform
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <iframe
            className="w-full h-full"
            src={videoUrl ? `${videoUrl}?autoplay=1` : ""}
            title="Video Demo CationGate"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-white text-sm tracking-tight">
              Transformasi Digital PPDB Bersama CationGate
            </div>
            <div className="text-slate-400 text-xs mt-0.5">
              Durasi: 2 Menit 15 Detik • Panduan Setup & Demonstrasi Fitur
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            Tutup Video
          </button>
        </div>

      </div>
    </div>
  );
}
