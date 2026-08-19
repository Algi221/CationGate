"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DemoPage() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="/assets/videos/vid1.webm" type="video/webm" />
        <source src="/assets/videos/vid2.webm" type="video/webm" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
          SPMB DEMO
        </h1>
        <p className="text-white/80 mt-4 text-lg md:text-xl font-medium tracking-widest uppercase">
          Eksplorasi Sistem Pendaftaran Baru
        </p>
      </motion.div>
    </div>
  );
}
