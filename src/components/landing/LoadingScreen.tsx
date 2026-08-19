"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_KEY = "cationgate_loading_session";

let hasShownLoading = false;
let loadingActive = true;

export function isActiveLoading() {
  return loadingActive;
}

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"start" | "show" | "exit">("start");
  const [isMounted, setIsMounted] = useState<boolean>(true);

  // Solusi error: Tambahin 'as const' di akhir array biar tipe data TypeScript-nya valid
  const premiumEasing = [0.85, 0, 0.15, 1] as const;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (hasShownLoading) {
      setIsMounted(false);
      return;
    }

    hasShownLoading = true;
    loadingActive = false;
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setPhase("show"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleGateAnimationComplete = () => {
    if (phase === "exit") {
      setIsMounted(false);
      document.body.style.overflow = "auto";
      sessionStorage.removeItem(LOADING_KEY);
      window.dispatchEvent(new CustomEvent("cationgate:loading-complete"));
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(LOADING_KEY);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <AnimatePresence>
      {isMounted && (
        <div className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden pointer-events-none">
          {/* GERBANG KIRI */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "-100%" : "0%" }}
            transition={{ duration: 1.2, ease: premiumEasing, delay: 0.3 }}
            style={{ willChange: "transform" }}
            className="absolute top-0 left-0 w-[51vw] h-full bg-[#F8F6F0] z-40 pointer-events-auto border-r border-black/5"
          />

          {/* GERBANG KANAN */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "100%" : "0%" }}
            transition={{ duration: 1.2, ease: premiumEasing, delay: 0.3 }}
            style={{ willChange: "transform" }}
            onAnimationComplete={handleGateAnimationComplete}
            className="absolute top-0 right-0 w-[51vw] h-full bg-[#F8F6F0] z-40 pointer-events-auto border-l border-black/5"
          />

          {/* KONTEN TENGAH */}
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            animate={{
              opacity: phase === "exit" ? 0 : 1,
              y: phase === "exit" ? -40 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeIn" }}
          >
            {/* Teks Raksasa */}
            <div className="overflow-hidden pb-4 px-4">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: premiumEasing }}
                className="text-6xl sm:text-7xl md:text-[9rem] font-extrabold tracking-tighter text-[#1A202C] leading-none"
              >
                CationGate<span className="text-[#FFD33B]">.</span>
              </motion.h1>
            </div>

            {/* Garis Loading */}
            <div className="w-[60vw] max-w-3xl h-[3px] bg-[#1A202C]/10 mt-6 md:mt-10 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: premiumEasing, delay: 0.2 }}
                className="h-full bg-[#1A202C]"
              />
            </div>

            {/* Teks Status */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6 text-xs md:text-sm tracking-[0.3em] text-[#1A202C]/50 uppercase font-bold"
            >
              System Initialization
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
