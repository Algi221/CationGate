"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Testimonial disebar dengan jumlah yang pas dan proporsional
const testimonials = [
  {
    id: 1,
    name: "Pak Joy",
    role: "Pembina IT",
    text: "Sistem PPDB yang dibangun sangat solid. Kodenya clean, transisi dari manual ke digital berjalan lancar tanpa kendala.",
    cardStyle: "mt-[10vh] rotate-[-1deg] w-[85vw] md:w-[320px]",
  },
  {
    id: 2,
    name: "Bu Miranda",
    role: "Mentor Algoritma",
    text: "Logika sistem dan alur datanya sangat rapi. Sangat memudahkan sekolah dalam menyeleksi calon siswa baru tahun ini.",
    cardStyle: "mt-[38vh] rotate-[1.5deg] w-[85vw] md:w-[350px]",
  },
  {
    id: 3,
    name: "Ahmad Faishal Majdii",
    role: "Lead Developer",
    text: "Arsitektur database dan integrasi frontend ke backend berjalan mulus. UI/UX-nya juara dan responsif di semua perangkat.",
    cardStyle: "mt-[12vh] rotate-[-1.5deg] w-[85vw] md:w-[330px]",
  },
  {
    id: 4,
    name: "Farel Al Fatir Fauzan",
    role: "Frontend Engineer",
    text: "Styling dengan Tailwind dan integrasinya sangat rapi. Komponen tidak berantakan sama sekali meski di-zoom ekstrim.",
    cardStyle: "mt-[42vh] rotate-[1deg] w-[85vw] md:w-[320px]",
  },
  {
    id: 5,
    name: "Chika Julia Fairuz",
    role: "System Analyst",
    text: "Flow sistemnya luar biasa detail. CationGate benar-benar menyelamatkan banyak waktu tim saat masa pendaftaran sibuk.",
    cardStyle: "mt-[15vh] rotate-[2deg] w-[85vw] md:w-[340px]",
  },
  {
    id: 6,
    name: "Prisa Setyani",
    role: "UI/UX Designer",
    text: "Layout scattered ngasih nyawa ke websitenya. Sangat natural dan interaktif untuk user experience keseluruhan.",
    cardStyle: "mt-[35vh] rotate-[-2deg] w-[85vw] md:w-[330px]",
  },
];

// Diringkas menjadi 3 kelompok frasa utama dengan variasi warna yang estetik
const bgWords = [
  { text: "APA KATA", color: "text-foreground/[0.08]" },
  { text: "MEREKA TENTANG", color: "text-primary/[0.12]" },
  { text: "CATIONGATE?", color: "text-on-surface/[0.1]" },
];

export default function TestimonialsSection() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Spring physics untuk pergerakan yang sangat empuk, natural, dan anti patah-patah
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  // KUNCI PERBAIKAN: Menyamakan struktur string calc() agar Framer Motion bisa interpolasi animasinya!
  // Nilai ini memastikan ujung paling kanan teks dan kartu mentok sempurna di sisi kanan layar
  const xCards = useTransform(
    smoothProgress,
    [0, 1],
    ["calc(0% + 0vw)", "calc(-100% + 100vw)"],
  );
  const xBg = useTransform(
    smoothProgress,
    [0, 1],
    ["calc(0% + 0vw)", "calc(-100% + 100vw)"],
  );

  return (
    <section ref={targetRef} className="relative h-[450vh] bg-background">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-clip flex items-center bg-background">
        {/* LAYER 0: Background Text */}
        <motion.div
          style={{ x: xBg }}
          // KUNCI PERBAIKAN: Padding x-axis disamakan persis dengan kartu (px-[10vw]) agar ujung awal dan akhir selaras
          className="absolute z-0 flex h-full w-max pointer-events-none items-center px-[10vw] gap-20 md:gap-32"
        >
          {bgWords.map((item, index) => (
            <h2
              key={index}
              className={`text-6xl md:text-8xl lg:text-[10vw] font-black ${item.color} uppercase tracking-tighter shrink-0 font-heading select-none leading-none`}
            >
              {item.text}
            </h2>
          ))}
        </motion.div>

        {/* LAYER 1: Kartu Testimonial Foreground */}
        <motion.div
          style={{ x: xCards }}
          className="absolute z-10 flex w-max h-full items-start px-[10vw] gap-10 md:gap-16"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`shrink-0 flex items-start ${testimonial.cardStyle}`}
            >
              <div className="w-full bg-surface p-6 md:p-8 border border-border rounded-card shadow-ambient hover:shadow-ambient-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between min-h-[290px]">
                <div>
                  <svg
                    className="w-7 h-7 md:w-8 md:h-8 text-primary/20 group-hover:text-primary transition-colors duration-300 mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-body-md md:text-body-lg text-on-surface-variant mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Profil Karakter DiceBear */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/40">
                  <div className="w-11 h-11 rounded-full bg-secondary-container/20 border border-border/60 overflow-hidden shrink-0">
                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(testimonial.name)}&scale=120&backgroundColor=transparent`}
                      alt={testimonial.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-label-md text-on-surface font-bold leading-tight">
                      {testimonial.name}
                    </h4>
                    <span className="text-label-sm text-primary uppercase tracking-wider font-semibold">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export { TestimonialsSection };
