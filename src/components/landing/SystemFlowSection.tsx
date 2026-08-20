import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Register",
    desc: "Daftarkan akun sekolah Anda. Mulai dari sistem yang terpadu, aman, dan dirancang khusus untuk kebutuhan pendaftaran siswa.",
    bg: "bg-[#FAF8F5]",
    text: "text-[#2e3749]",
    direction: "bottom",
    layout: "image-left",
    image:
      "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=800&q=80",
    waveColor: "text-[#FFD33B]/20",
  },
  {
    id: "02",
    title: "Klaim Subdomain",
    desc: "Pilih nama subdomain unik untuk halaman pendaftaran sekolah Anda. Buat identitas yang mudah dikenali.",
    bg: "bg-white",
    text: "text-[#2e3749]",
    direction: "right",
    layout: "image-right",
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    waveColor: "text-[#2e3749]/10",
  },
  {
    id: "03",
    title: "Verifikasi Data",
    desc: "Lengkapi data legalitas sekolah dan verifikasi agar sistem pendaftaran terjamin keamanannya.",
    bg: "bg-[#FAF8F5]",
    text: "text-[#2e3749]",
    direction: "bottom",
    layout: "image-left",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    waveColor: "text-[#FFD33B]/20",
  },
  {
    id: "04",
    title: "Bayar & Mulai",
    desc: "Selesaikan pembayaran paket dan aktifkan website SPMB Anda secara instan tanpa menunggu lama.",
    bg: "bg-[#2e3749]",
    text: "text-[#FAF8F5]",
    direction: "right",
    layout: "image-right",
    image:
      "https://images.unsplash.com/photo-1556742049-0a67d553c295?auto=format&fit=crop&w=800&q=80",
    waveColor: "text-white/10",
  },
  {
    id: "05",
    title: "Edit & Atur UI",
    desc: "Sesuaikan tampilan, warna, dan kelola formulir pendaftaran persis seperti branding sekolah Anda.",
    bg: "bg-[#FFD33B]",
    text: "text-[#2e3749]",
    direction: "bottom",
    layout: "image-left",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    waveColor: "text-[#2e3749]/15",
  },
];

const WaveDecoration = ({ colorClass, flip }) => (
  <div
    className={`absolute ${flip ? "top-0 rotate-180" : "bottom-0"} left-0 w-full h-[30vh] md:h-[65vh] pointer-events-none overflow-hidden z-0`}
  >
    <svg
      className={`absolute bottom-0 w-full h-full object-cover ${colorClass}`}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <path
        opacity="0.4"
        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,160C960,139,1056,149,1152,170.7C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
      <path
        opacity="0.8"
        d="M0,256L48,245.3C96,235,192,213,288,181.3C384,149,480,107,576,112C672,117,768,165,864,197.3C960,229,1056,245,1152,240C1248,235,1344,208,1392,194.7L1440,181.3L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  </div>
);

const StepCard = ({ step, index, smoothProgress }) => {
  const totalSections = steps.length + 1;
  const startVisible = index / totalSections + (1 / totalSections) * 0.3;
  const finishEntering = startVisible + (1 / totalSections) * 0.7;

  let initialX = "0%";
  let initialY = "0%";

  if (step.direction === "right") initialX = "100%";
  if (step.direction === "bottom") initialY = "100%";

  const x = useTransform(
    smoothProgress,
    [startVisible, finishEntering],
    [initialX, "0%"],
  );
  const y = useTransform(
    smoothProgress,
    [startVisible, finishEntering],
    [initialY, "0%"],
  );

  const renderLayout = () => {
    if (step.layout === "image-left") {
      return (
        <div className="w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-16 px-6 md:px-16 pt-24 md:pt-0 relative z-10">
          <div className="w-full md:w-1/2 h-[35vh] md:h-[70vh] relative p-2 md:p-8 shrink-0">
            <div className="absolute inset-0 bg-black/5 rounded-3xl transform -rotate-2 hidden md:block"></div>
            <img
              src={step.image}
              alt={step.title}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-md md:shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3 md:space-y-6 relative">
            <div className="flex items-baseline gap-3 md:gap-4">
              <span className="text-lg md:text-2xl font-bold tracking-widest uppercase opacity-70">
                Part.
              </span>
              <span className="text-6xl md:text-[10rem] lg:text-[12rem] font-black leading-none tracking-tighter opacity-90">
                {step.id}
              </span>
            </div>
            <div className="pl-4 md:pl-6 border-l-2 md:border-l-4 border-current mt-2 md:mt-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6">
                {step.title}
              </h2>
              <p className="text-sm md:text-lg lg:text-2xl opacity-80 leading-relaxed max-w-md font-serif">
                {step.desc}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (step.layout === "image-right") {
      return (
        <div className="w-full h-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-6 md:gap-16 px-6 md:px-16 pt-24 md:pt-0 relative z-10">
          <div className="w-full md:w-1/2 flex items-center gap-12 relative">
            <div
              className="hidden md:block transform -rotate-180"
              style={{ writingMode: "vertical-rl" }}
            >
              <span className="text-2xl font-black tracking-[0.5em] uppercase opacity-40">
                ORIGINALITY
              </span>
            </div>
            <div className="flex flex-col space-y-3 md:space-y-6">
              <div className="flex items-baseline gap-3 md:gap-4 opacity-50">
                <span className="text-lg md:text-xl font-bold tracking-widest uppercase">
                  Part.
                </span>
                <span className="text-6xl md:text-8xl font-black leading-none">
                  {step.id}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight">
                {step.title}
              </h2>
              <p className="text-sm md:text-lg lg:text-2xl opacity-80 leading-relaxed max-w-md font-serif mt-2 md:mt-4">
                {step.desc}
              </p>
              <div className="w-12 md:w-16 h-[2px] md:h-[3px] bg-current mt-4 md:mt-8 opacity-50"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[35vh] md:h-[70vh] relative p-2 md:p-8 shrink-0">
            <div className="absolute inset-0 bg-black/5 rounded-3xl transform rotate-2 hidden md:block"></div>
            <img
              src={step.image}
              alt={step.title}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-md md:shadow-lg"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div
      style={{ x, y, zIndex: index + 10 }}
      className={`absolute inset-0 h-screen w-screen flex items-center justify-center overflow-hidden ${step.bg} ${step.text} border-t border-black/5 shadow-none md:shadow-2xl transform-gpu will-change-transform`}
    >
      <WaveDecoration colorClass={step.waveColor} flip={index % 2 !== 0} />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      {renderLayout()}
    </motion.div>
  );
};

export default function SystemFlowSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.1,
    restDelta: 0.0001,
  });

  return (
    <div ref={containerRef} className="relative h-[1500vh] w-full bg-[#FAF8F5]">
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        {/* HERO SECTION */}
        <div className="absolute inset-0 h-screen w-screen bg-[#FAF8F5] text-[#2e3749] z-0 flex flex-col justify-between p-6 md:p-16 overflow-hidden transform-gpu will-change-transform">
          <WaveDecoration colorClass="text-[#FFD33B]/30" flip={false} />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "40px 40px",
            }}
          ></div>

          <div className="flex justify-between items-start w-full relative z-10 pt-16 md:pt-0">
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl italic">
                System
              </span>
              <span className="font-serif text-lg md:text-xl italic">Flow</span>
            </div>
            <div
              className="hidden md:flex gap-4 transform rotate-180"
              style={{ writingMode: "vertical-rl" }}
            >
              <span className="text-xl font-bold tracking-[0.3em] uppercase">
                CationGate Engine
              </span>
              <span className="text-xl font-bold tracking-[0.3em] uppercase opacity-50">
                SPMB Digital
              </span>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <h1 className="text-[4rem] sm:text-[6rem] md:text-[10rem] lg:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] text-center drop-shadow-sm md:drop-shadow-md">
              HANYA <br />
              <span className="text-[#FFD33B] drop-shadow-none">5 TAHAP</span>
            </h1>
          </div>

          <div className="flex justify-between items-end w-full relative z-10 pb-6 md:pt-0">
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl tracking-widest">
                CATION
              </span>
              <span className="font-black text-2xl tracking-widest">GATE</span>
            </div>
            <div className="flex flex-col items-end gap-2 animate-bounce">
              <span className="text-xs md:text-sm font-bold tracking-widest uppercase">
                Scroll Perlahan
              </span>
            </div>
          </div>
        </div>

        {/* FLOW STEPS MAP */}
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            smoothProgress={smoothProgress}
          />
        ))}
      </div>
    </div>
  );
}
