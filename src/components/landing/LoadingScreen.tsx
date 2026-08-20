"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANIMATION_KEY = "cationgate_anim_done";

export default function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"start" | "exit">("start");

  useEffect(() => {
    // Check if current load is a hard refresh / reload
    const navEntries = performance.getEntriesByType("navigation");
    const isReload =
      navEntries.length > 0 &&
      (navEntries[0] as PerformanceNavigationTiming).type === "reload";

    if (isReload) {
      sessionStorage.removeItem(ANIMATION_KEY);
    }

    // Skip if already animated in this session (e.g. client back/forward navigation)
    if (sessionStorage.getItem(ANIMATION_KEY)) {
      setShow(false);
      return;
    }

    // First time or hard refresh -> show loading screen
    sessionStorage.setItem(ANIMATION_KEY, "1");
    setShow(true);

    // Lock page scroll while loading screen is active
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setPhase("exit");
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const premiumEasing = [0.85, 0, 0.15, 1] as const;

  const handleGateDone = () => {
    if (phase === "exit") {
      setShow(false);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden select-none pointer-events-auto touch-none"
          style={{ overflow: "hidden" }}
        >
          {/* Gate Kiri */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "-100%" : "0%" }}
            transition={{ duration: 1.2, ease: premiumEasing, delay: 0.3 }}
            style={{ willChange: "transform" }}
            className="absolute top-0 left-0 w-[52vw] h-full bg-[#F8F6F0] z-40 shadow-2xl"
          />

          {/* Gate Kanan */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "100%" : "0%" }}
            transition={{ duration: 1.2, ease: premiumEasing, delay: 0.3 }}
            style={{ willChange: "transform" }}
            onAnimationComplete={handleGateDone}
            className="absolute top-0 right-0 w-[52vw] h-full bg-[#F8F6F0] z-40 shadow-2xl"
          />

          {/* Konten Tengah */}
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
                transition={{ duration: 2.5, ease: premiumEasing, delay: 0.2 }}
                className="h-full bg-[#1A202C]"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

