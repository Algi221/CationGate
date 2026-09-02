"use client";

import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

interface LoginHeroPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData: any;
}

export function LoginHeroPanel({ animationData }: LoginHeroPanelProps) {
  return (
    <div className="hidden lg:flex lg:col-span-6 items-center justify-between relative pl-2 lg:pl-4 pr-2">
      {/* TEKS UTAMA DENGAN ENTRANCE ANIMATION */}
      <div className="z-10 w-[54%] pr-2 text-left">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] drop-shadow-md">
            Portal <br />
            <span className="text-[#FFE27A] drop-shadow-sm">Admin</span>
          </h2>
          <p className="text-xs lg:text-sm text-white/95 mt-5 font-medium leading-relaxed max-w-55">
            Masuk untuk mengelola sistem <strong className="text-white font-bold">PPDB</strong> &amp; operasional sekolah Anda.
          </p>
        </motion.div>
      </div>

      {/* AREA LOTTIE & FLOATING CAPSULE DENGAN ENTRANCE ANIMATION */}
      <div className="z-10 w-1/2 flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
            rotate: [0, 6, 0],
          }}
          transition={{
            opacity: { duration: 0.4, delay: 0.1 },
            scale: { duration: 0.4, delay: 0.1 },
            y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
          }}
          className="absolute -right-2 top-0 w-16 h-8 rounded-full bg-white/30 backdrop-blur-md shadow-lg z-30 border border-white/20"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full max-w-80 h-80 z-20"
        >
          {animationData && (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
