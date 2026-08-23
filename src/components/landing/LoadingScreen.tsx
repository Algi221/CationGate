"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const _LOADING_KEY = "cationgate_loading_session";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"start" | "show" | "exit">("start");
  const [isMounted, setIsMounted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const isInternalNav = sessionStorage.getItem("cationgate_internal_navigation") === "true";
      return !isInternalNav;
    }
    return true;
  });

  const premiumEasing = [0.85, 0, 0.15, 1] as const;

  useEffect(() => {
    if (typeof window !== "undefined") {

      const handleBeforeUnload = () => {
        sessionStorage.removeItem("cationgate_internal_navigation");
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      const isInternalNav = sessionStorage.getItem("cationgate_internal_navigation") === "true";
      if (isInternalNav) {
        window.dispatchEvent(new CustomEvent("cationgate:loading-complete"));
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
      }

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      const t1 = setTimeout(() => setPhase("show"), 100);
      const t2 = setTimeout(() => setPhase("exit"), 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        window.removeEventListener("beforeunload", handleBeforeUnload);
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: premiumEasing }}
              className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 mb-6 md:mb-8"
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
