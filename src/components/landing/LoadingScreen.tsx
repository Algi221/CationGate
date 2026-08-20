"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Image from "next/image";

const ANIMATION_KEY = "cationgate_anim_done";

export default function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"intro" | "exit">("intro");

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

    // Play subtle pleasant sound effect on roll & settle
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          580,
          ctx.currentTime + 0.35
        );

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + 0.5
        );

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.05);
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Audio policy safe fallback
    }

    // Pacing yang nyaman dan elegan: 2.8 detik sebelum gerbang membelah
    const timer = setTimeout(() => {
      setPhase("exit");
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Kurva perlambatan mewah untuk gerbang & brand
  const silkyGateEasing = [0.76, 0, 0.24, 1] as const;

  const handleGateDone = () => {
    if (phase === "exit") {
      setShow(false);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  };

  // Huruf untuk efek ketik per-karakter
  const lettersCation = ["C", "a", "t", "i", "o", "n"];
  const lettersGate = ["G", "a", "t", "e", "."];

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.065,
        delayChildren: 0.65, // Mulai mengetik tepat setelah logo mendarat
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 18,
      },
    },
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden select-none pointer-events-auto touch-none"
          style={{ overflow: "hidden" }}
        >
          {/* ─── GERBANG KIRI (SPLIT TO LEFT) ─────────────────────────── */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "-100%" : "0%" }}
            transition={{ duration: 1.2, ease: silkyGateEasing, delay: 0.08 }}
            style={{ willChange: "transform" }}
            className="absolute top-0 left-0 w-[52vw] h-full bg-[#F8F6F0] z-40"
          />

          {/* ─── GERBANG KANAN (SPLIT TO RIGHT) ────────────────────────── */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: phase === "exit" ? "100%" : "0%" }}
            transition={{ duration: 1.2, ease: silkyGateEasing, delay: 0.08 }}
            style={{ willChange: "transform" }}
            onAnimationComplete={handleGateDone}
            className="absolute top-0 right-0 w-[52vw] h-full bg-[#F8F6F0] z-40"
          />

          {/* ─── CENTER BRAND STAGE: LOGO & LETTER-BY-LETTER TEXT ─────── */}
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none px-4"
            animate={{
              opacity: phase === "exit" ? 0 : 1,
              scale: phase === "exit" ? 0.94 : 1,
              y: phase === "exit" ? -25 : 0,
            }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              
              {/* LOGO: Berguling dari atas layar ke tengah dengan rotasi dan efek membal elastis */}
              <motion.div
                initial={{
                  y: -260,
                  rotate: -360,
                  scale: 0.4,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 12,
                  mass: 0.9,
                  duration: 1.0,
                }}
                className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center"
              >
                {/* Glow Aura & Floating Pulse di belakang Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0.35, 0.7, 0.35],
                    scale: [0.95, 1.15, 0.95],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.0,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute inset-0 bg-[#FFD33B]/35 rounded-full blur-2xl"
                />

                <Image
                  src="/assets/catpeer/logo_cationGate.svg"
                  alt="CationGate Logo"
                  width={144}
                  height={144}
                  className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                  priority
                />
              </motion.div>

              {/* TEXT: Muncul per huruf secara ketik tanpa kursor/garis kuning */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-center px-4"
              >
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none flex items-center">
                  {/* Cation */}
                  <span className="flex text-[#1A202C]">
                    {lettersCation.map((char, index) => (
                      <motion.span
                        key={`cation-${index}`}
                        variants={letterVariants}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>

                  {/* Gate. */}
                  <span className="flex text-[#FFD33B]">
                    {lettersGate.map((char, index) => (
                      <motion.span
                        key={`gate-${index}`}
                        variants={letterVariants}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </h1>
              </motion.div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
