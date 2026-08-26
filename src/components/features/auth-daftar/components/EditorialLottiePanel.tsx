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
  animationsData
}) => {
  return (
    <>
      {/* DESKTOP VIEW (LEFT 50% OF THE GRID) */}
      <div className="hidden lg:flex lg:col-span-6 items-center justify-between relative pl-6 lg:pl-12 pr-4 z-10">
        {/* TEXT TITLE & STEP BADGE */}
        <div className="z-10 w-1/2 pr-4 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVisual.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4 border border-white/25 shadow-xs">
                Langkah 0{currentVisual.step} / 03
              </span>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[0.98] whitespace-pre-line drop-shadow-md">
                {currentVisual.title}
              </h2>
              <p className="text-xs lg:text-sm text-white/90 mt-4 font-medium leading-relaxed max-w-xs">
                {currentVisual.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* LOTTIE ANIMATION & FLOATING CAPSULE */}
        <div className="z-10 w-1/2 flex items-center justify-center relative">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute -right-2 top-0 w-16 h-8 rounded-full bg-white/30 backdrop-blur-md shadow-lg z-30 border border-white/20"
          />

          <div className="w-full max-w-75 h-75 z-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVisual.step}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
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

      {/* MOBILE VIEW (COMPACT HEADER) */}
      <div className="lg:hidden w-full z-10 mb-4 px-2 text-left">
        <span className="inline-block px-3 py-1 bg-white/60 backdrop-blur-md rounded-full text-slate-900 text-[10px] font-black uppercase tracking-widest mb-1.5 border border-white/20">
          Langkah 0{currentVisual.step} / 03
        </span>
        <h2 className="text-2xl font-black text-white leading-tight drop-shadow-sm">
          {currentVisual.title.replace("\n", " ")}
        </h2>
      </div>
    </>
  );
};
