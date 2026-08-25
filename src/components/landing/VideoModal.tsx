"use client";

import React, { useEffect } from "react";
import { X, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string | null;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  // Mencegah scroll pada background saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        // PERBAIKAN: Mengubah z-[100] menjadi z-[99999] agar menutupi Navbar & Chatbot
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur Tipis & Gelap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Kontainer Utama Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10 flex flex-col"
          >
            {/* Header Clean Minimalis */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center gap-2.5">
                <PlayCircle className="w-5 h-5 text-[#FFC000]" />
                <span className="text-sm font-semibold text-white tracking-wide">
                  Video Demonstrasi
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Tutup Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Area Player Video (Edge-to-Edge) */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {videoUrl ? (
                <iframe
                  className="w-full h-full border-none outline-none"
                  src={`${videoUrl}?autoplay=1`}
                  title="Video Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-slate-500 text-sm font-medium">
                  Memuat video...
                </div>
              )}
            </div>

            {/* Footer Detail Deskripsi Video */}
            <div className="px-6 py-5 bg-[#0a0a0a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base sm:text-lg tracking-tight">
                  Transformasi Digital PPDB Bersama CationGate
                </h4>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="text-[#FFC000]">
                    Panduan Setup & Demo Fitur
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>2 Menit 15 Detik</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#e5ac00] text-black font-bold text-xs sm:text-sm transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                Tutup Video
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default VideoModal;
