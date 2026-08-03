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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      {/* Background overlay klik untuk tutup */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm font-bold text-white">
              Video Demonstration
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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

        <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <div className="font-bold text-white text-sm">
              Transformasi Digital PPDB Bersama CationGate
            </div>
            <div>Durasi: 2 Menit 15 Detik • Panduan Setup & Demo Fitur</div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
          >
            Tutup Video
          </button>
        </div>
      </div>
    </div>
  );
}
