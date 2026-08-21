"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const LOADING_KEY = "cationgate_loading_session";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"start" | "show" | "exit">("start");
  const [isMounted, setIsMounted] = useState<boolean>(true);

  const premiumEasing = [0.85, 0, 0.15, 1] as const;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if user came back from internal navigation (e.g. clicking 'Beranda' from /daftar or /masuk)
      const shouldSkip = sessionStorage.getItem("cationgate_skip_splash") === "true";
      if (shouldSkip) {
        sessionStorage.removeItem("cationgate_skip_splash");
        setIsMounted(false);
        window.dispatchEvent(new CustomEvent("cationgate:loading-complete"));
        return;
      }

      // Lock scroll while splash is active
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      const t1 = setTimeout(() => setPhase("show"), 100);
      const t2 = setTimeout(() => setPhase("exit"), 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };
    }
  }, []);

  const handleGateAnimationComplete = () => {
    if (phase === "exit") {
      setIsMounted(false);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("cationgate:loading-complete"));
    }
  };

  return (
    <AnimatePresence>
      {isMounted && (
        <div className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden pointer-events-none">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "-100%" : "0%" }}
            transition={{ duration: 1.2, ease: premiumEasing, delay: 0.3 }}
            style={{ willChange: "transform" }}
            className="absolute top-0 left-0 w-[52vw] h-full bg-[#F8F6F0] z-40 pointer-events-auto shadow-xl"
          />

          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "100%" : "0%" }}
            transition={{ duration: 1.2, ease: premiumEasing, delay: 0.3 }}
            style={{ willChange: "transform" }}
            onAnimationComplete={handleGateAnimationComplete}
            className="absolute top-0 right-0 w-[52vw] h-full bg-[#F8F6F0] z-40 pointer-events-auto shadow-xl"
          />

          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            animate={{
              opacity: phase === "exit" ? 0 : 1,
              y: phase === "exit" ? -40 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeIn" }}
          >
            {/* Animated Logo (Rolling from right to center) */}
            <motion.div
              initial={{ x: "100vw", rotate: 720, opacity: 0 }}
              animate={{ x: 0, rotate: 0, opacity: 1 }}
              transition={{
                duration: 1.6,
                ease: premiumEasing,
                delay: 0.1
              }}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-6 flex items-center justify-center drop-shadow-xl"
            >
              <Image
                src="/assets/logo_cationgate/CationGate_Logo.png"
                alt="CationGate Logo"
                fill
                sizes="(max-width: 768px) 160px, 192px"
                priority
                className="object-contain"
              />
            </motion.div>

            <div className="overflow-hidden pb-4 px-4">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: premiumEasing, delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-[#1A202C] leading-none text-center"
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
        </div>
      )}
    </AnimatePresence>
  );
}
