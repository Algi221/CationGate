"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"start" | "show" | "exit">("start");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const premiumEasing = [0.85, 0, 0.15, 1] as const;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const navType = navEntries.length > 0 ? navEntries[0].type : "";

    if (navType === "back_forward") {
      setIsMounted(false);
      return;
    }

    setIsMounted(true);
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setPhase("show"), 200);
    const t2 = setTimeout(() => setPhase("exit"), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleGateAnimationComplete = () => {
    if (phase === "exit") {
      setIsMounted(false);
      document.body.style.overflow = "auto";
      window.dispatchEvent(new CustomEvent("cationgate:loading-complete"));
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isMounted && (
        <motion.div 
          className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* GERBANG KIRI */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "-100%" : "0%" }}
            transition={{ duration: 1.2, ease: premiumEasing, delay: 0.3 }}
            style={{ willChange: "transform" }}
            className="absolute top-0 left-0 w-[52vw] h-full bg-[#F8F6F0] z-40 pointer-events-auto shadow-xl"
          />

          {/* GERBANG KANAN */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "100%" : "0%" }}
            transition={{ duration: 1.2, ease: premiumEasing, delay: 0.3 }}
            style={{ willChange: "transform" }}
            onAnimationComplete={handleGateAnimationComplete}
            className="absolute top-0 right-0 w-[52vw] h-full bg-[#F8F6F0] z-40 pointer-events-auto shadow-xl"
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

            <div className="w-[60vw] max-w-3xl h-[3px] bg-[#1A202C]/10 mt-6 md:mt-10 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.8, ease: premiumEasing, delay: 0.2 }}
                className="h-full bg-[#1A202C]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
