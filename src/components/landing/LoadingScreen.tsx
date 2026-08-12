"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"start" | "drop" | "exit">("start");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeen = sessionStorage.getItem("cationgate_has_seen_loading");
    if (hasSeen) {
      setIsMounted(false);
      return;
    }

    setIsMounted(true);
    sessionStorage.setItem("cationgate_has_seen_loading", "true");

    // 1. Langsung mulai turun ke bawah tanpa jeda
    const t1 = setTimeout(() => setPhase("drop"), 100);

    // 2. Tepat saat ujung ombak menyentuh bawah layar, teks langsung bereaksi menutup!
    const t2 = setTimeout(() => setPhase("exit"), 4500);

    // 3. Setelah animasi teks menghilang selesai, langsung bersihkan DOM
    const t3 = setTimeout(() => setIsMounted(false), 5300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Varian animasi untuk tirai biru
  const curtainVariants: Variants = {
    start: { y: "-20vh" },
    drop: {
      y: "110vh",
      transition: {
        duration: 5,
        ease: [0.3, 0.0, 0.2, 1],
      },
    },
  };

  // Varian animasi untuk teks agar menutup dengan smooth
  const textVariants: Variants = {
    visible: { opacity: 1, scale: 1 },
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          key="loading-screen"
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] w-screen h-screen flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* SUNTIKAN CSS LANGSUNG */}
          <style>{`
            @keyframes animateWave {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .wave-layer-slow {
              animation: animateWave 6s linear infinite;
              width: 200%;
            }
            .wave-layer-fast {
              animation: animateWave 3.5s linear infinite;
              width: 200%;
            }
          `}</style>

          {/* TEKS MEMENTO MORI (PERBAIKAN DARK MODE) */}
          <motion.div
            variants={textVariants}
            initial="visible"
            animate={phase === "exit" ? "hidden" : "visible"}
            className="relative z-10 text-center select-none mb-[10vh]"
          >
            <h1 className="mb-3 font-serif text-3xl md:text-6xl text-[#2A1B1D] tracking-widest">
              Cation Gate
            </h1>
          </motion.div>

          {/* TIRAI BIRU */}
          <motion.div
            variants={curtainVariants}
            initial="start"
            animate={phase === "exit" ? "drop" : phase}
            className="absolute top-0 left-0 w-full h-[200vh] z-20 flex flex-col"
          >
            <div className="relative w-full h-[15vh] overflow-hidden">
              {/* Gelombang Belakang */}
              <div className="absolute bottom-0 left-0 h-full wave-layer-slow">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1440 320"
                  preserveAspectRatio="none"
                >
                  <path
                    fill="#F3C625"
                    fillOpacity="0.6"
                    d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,197.3C672,213,768,203,864,181.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
              </div>

              {/* Gelombang Depan */}
              <div className="absolute bottom-0 left-0 h-full wave-layer-fast">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1440 320"
                  preserveAspectRatio="none"
                >
                  <path
                    fill="#F3C625"
                    fillOpacity="1"
                    d="M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,213.3C672,213,768,171,864,149.3C960,128,1056,128,1152,144C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
              </div>
            </div>

            {/* Kotak Biru Solid */}
            <div className="flex-1 bg-[#FFD33B] w-full -mt-[1px]"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
