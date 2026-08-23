"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const _LOADING_KEY = "cationgate_loading_session";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"start" | "show" | "exit">("start");
  const [isMounted, setIsMounted] = useState<boolean>(true);

  const premiumEasing = [0.85, 0, 0.15, 1] as const;

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("cationgate_internal_navigation");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const isInternalNav = sessionStorage.getItem("cationgate_internal_navigation") === "true";
    if (isInternalNav) {
      setIsMounted(false);
      window.dispatchEvent(new CustomEvent("cationgate:loading-complete"));
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setPhase("show"), 50);
    const t2 = setTimeout(() => setPhase("exit"), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleGateAnimationComplete = () => {
    if (phase === "exit") {
      setIsMounted(false);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

      sessionStorage.setItem("cationgate_internal_navigation", "true");
      window.dispatchEvent(new CustomEvent("cationgate:loading-complete"));
    }
  };

  return (
    <AnimatePresence>
      {isMounted && (
        <div className="fixed inset-0 z-9999 w-screen h-screen overflow-hidden pointer-events-none">
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
            onAnimationComplete={handleGateAnimationComplete}
            style={{ willChange: "transform" }}
            className="absolute top-0 right-0 w-[52vw] h-full bg-[#F8F6F0] z-40 pointer-events-auto shadow-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: phase === "exit" ? 0 : 1,
              scale: phase === "exit" ? 1.05 : 1,
            }}
            transition={{ duration: 0.8, ease: premiumEasing }}
            style={{ willChange: "transform, opacity" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ x: "80vw", rotate: 720, opacity: 0, scale: 0.85 }}
              animate={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 mb-6 md:mb-8 -translate-x-2 sm:-translate-x-3 md:-translate-x-4"
            >
              <Image
                src="/assets/logo_cationgate/CationGate_Logo.png"
                alt="CationGate"
                fill
                sizes="(max-width: 768px) 112px, 144px"
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

            <div className="w-[60vw] max-w-3xl h-0.75 bg-[#1A202C]/10 mt-6 md:mt-10 overflow-hidden rounded-full">
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
