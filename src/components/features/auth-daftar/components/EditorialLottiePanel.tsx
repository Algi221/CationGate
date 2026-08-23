"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { StepVisual } from "../types";

interface EditorialLottiePanelProps {
  currentVisual: StepVisual;
  isMobile: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationsData: { [key: number]: any };
}

export const EditorialLottiePanel: React.FC<EditorialLottiePanelProps> = ({
  currentVisual,
  isMobile,
  animationsData
}) => {
  return (
    <div className="lg:col-span-6 relative flex flex-col justify-between p-6 sm:p-8 lg:p-14 overflow-hidden min-h-60 sm:min-h-75 lg:min-h-160 rounded-3xl lg:rounded-none">
      {/* Dynamic Background SVG Curves */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          viewBox={isMobile ? "0 0 414 200" : "0 0 700 800"}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <motion.path
            key={currentVisual.step}
            initial={{ fill: currentVisual.solidColor }}
            animate={{
              d: isMobile ? currentVisual.svgPathMobile : currentVisual.svgPathDesktop,
              fill: currentVisual.solidColor
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* TEXT TITLE & SUBTITLE */}
      <div className="z-10 relative max-w-sm text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVisual.step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-3">
              Langkah 0{currentVisual.step} / 03
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight whitespace-pre-line">
              {currentVisual.title}
            </h2>
            <p className="text-white/80 text-xs font-semibold mt-2 max-w-xs leading-relaxed">
              {currentVisual.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* LOTTIE ANIMATION & FLOATING CAPSULE */}
      <div className="z-10 w-full lg:w-1/2 flex items-center justify-center relative self-end">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute -right-2 top-0 w-16 h-8 rounded-full bg-white/30 backdrop-blur-md shadow-lg z-30"
        />

        <div className="w-full max-w-80 h-80 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVisual.step}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full flex items-center justify-center"
            >
              {animationsData[currentVisual.step] && (
                <Lottie
                  animationData={animationsData[currentVisual.step]}
                  loop
                  autoplay
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
