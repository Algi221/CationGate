"use client";

import React from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string | null; // Tambahkan prop ini
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A1B1D]/80 backdrop-blur-md">
      {/* Background overlay klik untuk tutup */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-[#2A1B1D] rounded-3xl overflow-hidden border border-border shadow-2xl z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E86BC6]" />
            <span className="text-sm font-bold text-white">
              Video Demonstration
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <iframe
            className="w-full h-full"
            // Gunakan videoUrl dari prop di sini
            src={videoUrl ? `${videoUrl}?autoplay=1` : ""}
            title="Video Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-6 bg-[#2A1B1D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div>
            <div className="font-bold text-white text-sm">
              Transformasi Digital PPDB Bersama CationGate
            </div>
            <div>Durasi: 2 Menit 15 Detik • Panduan Setup & Demo Fitur</div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2A1B1D] font-bold transition-colors"
          >
            Tutup Video
          </button>
        </div>
      </div>
    </div>
  );
}
