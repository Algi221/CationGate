"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MASCOT_ASSETS, TOOLTIP_MESSAGES } from "./types";

interface CatBotTriggerProps {
  isOpen: boolean;
  isPageLoaded: boolean;
  effectiveBottom: number;
  tooltipIndex: number;
  onOpen: () => void;
}

export function CatBotTrigger({
  isOpen,
  isPageLoaded,
  effectiveBottom,
  tooltipIndex,
  onOpen,
}: CatBotTriggerProps) {
  return (
    <AnimatePresence>
      {isPageLoaded && !isOpen && (
        <motion.div
          className="absolute right-4 sm:right-6 pointer-events-auto z-950"
          initial={{ scale: 0, opacity: 0, y: 20, bottom: effectiveBottom }}
          animate={{ scale: 1, opacity: 1, y: 0, bottom: effectiveBottom }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
            mass: 0.8,
          }}
        >
          <div className="flex items-center gap-4">
            {/* Tooltip Animasi Dinamis */}
            <div className="hidden sm:flex items-center relative bg-[#0a0a0a] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg select-none overflow-hidden h-9 min-w-42.5 justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={tooltipIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute text-slate-100 tracking-wide font-sans whitespace-nowrap"
                >
                  {TOOLTIP_MESSAGES[tooltipIndex]}
                </motion.span>
              </AnimatePresence>
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0a0a0a] rotate-45" />
            </div>

            {/* Bot Button Icon */}
            <button
              onClick={onOpen}
              className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFC000] text-black shadow-xl flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <Image
                  src={MASCOT_ASSETS.icon}
                  alt="Catpeer"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#FFC000] rounded-full" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
