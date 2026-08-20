"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ANIMATION_KEY = "cationgate_anim_done";

export default function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"video" | "reveal" | "exit">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

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

    // Play video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }

    // Transition from video to logo & brand reveal after ~2 seconds
    const timerVideoToReveal = setTimeout(() => {
      setPhase("reveal");
    }, 2000);

    // Transition to exit (gate open) after reveal completes (~3.8 seconds)
    const timerExit = setTimeout(() => {
      setPhase("exit");
    }, 4000);

    return () => {
      clearTimeout(timerVideoToReveal);
      clearTimeout(timerExit);
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

  const handleVideoEnded = () => {
    if (phase === "video") {
      setPhase("reveal");
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden select-none pointer-events-auto touch-none bg-[#F8F6F0]"
          style={{ overflow: "hidden" }}
        >
          {/* Gate Kiri */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "-100%" : "0%" }}
            transition={{ duration: 1.1, ease: premiumEasing, delay: 0.1 }}
            style={{ willChange: "transform" }}
            className="absolute top-0 left-0 w-[52vw] h-full bg-[#F8F6F0] z-40 shadow-2xl"
          />

          {/* Gate Kanan */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "100%" : "0%" }}
            transition={{ duration: 1.1, ease: premiumEasing, delay: 0.1 }}
            style={{ willChange: "transform" }}
            onAnimationComplete={handleGateDone}
            className="absolute top-0 right-0 w-[52vw] h-full bg-[#F8F6F0] z-40 shadow-2xl"
          />

          {/* Center Stage Animation */}
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none px-4"
            animate={{
              opacity: phase === "exit" ? 0 : 1,
              scale: phase === "exit" ? 0.95 : 1,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Phase 1: Video Intro */}
            {phase === "video" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative flex items-center justify-center max-w-sm sm:max-w-md w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black/5"
              >
                <video
                  ref={videoRef}
                  src="/assets/videos/animationCationGate.mp4"
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Phase 2: Morph to Logo & Typography */}
            {phase !== "video" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center text-center space-y-6"
              >
                {/* Logo with Glow & Floating Animation */}
                <motion.div
                  initial={{ scale: 0.4, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-[#FFD33B]/20 rounded-full blur-2xl animate-pulse" />
                  <Image
                    src="/assets/catpeer/logo_cationGate.svg"
                    alt="CationGate Logo"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                    priority
                  />
                </motion.div>

                {/* Staggered Typography "CationGate" */}
                <div className="overflow-hidden px-4">
                  <motion.h1
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      ease: premiumEasing,
                      delay: 0.25,
                    }}
                    className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[#1A202C] leading-tight"
                  >
                    Cation<span className="text-[#FFD33B]">Gate</span>
                    <span className="text-[#FFD33B]">.</span>
                  </motion.h1>
                </div>

                {/* Tagline Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A202C]/5 border border-[#1A202C]/10 text-xs sm:text-sm font-bold tracking-widest uppercase text-[#1A202C]/70"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FFD33B]" />
                  SPMB Digital &amp; School Platform
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
