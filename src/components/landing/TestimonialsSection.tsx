"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Miranda",
    role: "Mentor Algoritma",
    text: "Sistem PPDB yang dibangun sangat solid. Kodenya clean, transisi dari manual ke digital berjalan lancar tanpa kendala.",
    cardStyle: "mt-[10vh] rotate-[-1deg] w-[85vw] md:w-[340px]",
  },
  {
    id: 2,
    name: "Joy widi wibowo",
    role: "Pembina IT",
    text: "Logika sistem dan alur datanya sangat rapi. Sangat memudahkan sekolah dalam menyeleksi calon siswa baru tahun ini.",
    cardStyle: "mt-[38vh] rotate-[1.5deg] w-[85vw] md:w-[370px]",
  },
  {
    id: 3,
    name: "Ahmad Faishal Majdii",
    role: "Siswa Teladan",
    text: "Arsitektur database dan integrasi frontend ke backend berjalan mulus. UI/UX-nya juara dan responsif di semua perangkat.",
    cardStyle: "mt-[12vh] rotate-[-1.5deg] w-[85vw] md:w-[350px]",
  },
  {
    id: 4,
    name: "Rezky Setiansyah",
    role: "Bug Hunter",
    text: "Kuat banget keamanannya, saya cari bugnya tapi gak nemu.",
    cardStyle: "mt-[42vh] rotate-[1deg] w-[85vw] md:w-[340px]",
  },
  {
    id: 5,
    name: "Rakha Zuhdi Naufal",
    role: "Pro Player",
    text: "Mantap banget buat sekolah yang pengen go digital.",
    cardStyle: "mt-[15vh] rotate-[2deg] w-[85vw] md:w-[360px]",
  },
  {
    id: 6,
    name: "Hafiz Alfiansyah",
    role: "UI/UX Designer",
    text: "Gue suka banget sama animasinya,interaktif banget!.",
    cardStyle: "mt-[35vh] rotate-[-2deg] w-[85vw] md:w-[350px]",
  },
];

const bgWords = [
  { text: "APA KATA", color: "text-zinc-900/[0.08]" },
  { text: "MEREKA TENTANG", color: "text-zinc-900/[0.08]" },
  { text: "CATIONGATE?", color: "text-zinc-900/[0.08]" },
];

export default function TestimonialsSection() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.0001,
  });

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
    <div className="w-full bg-white border-t border-zinc-200">
      {}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2  bg-zinc-50 text-zinc-900 text-xs font-black uppercase tracking-[0.2em] mb-8 ">

          Ulasan & Feedback
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-950 tracking-tighter mb-6 leading-[1.1]">
          INI KATA{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#007AC3] to-[#40A8E6]">
            MEREKA.
          </span>
        </h2>

        <p className="text-zinc-500 max-w-2xl font-medium text-base md:text-lg leading-relaxed">
          Lihat bagaimana sistem kami membantu mempercepat alur kerja, merapikan
          data, dan memberikan pengalaman pendaftaran terbaik dari kacamata tim
          dan mentor.
        </p>
      </div>

      {}
      <section ref={targetRef} className="relative h-[450vh] bg-white">
        {}
        <div className="sticky top-0 h-screen w-full overflow-clip flex items-center bg-white">
          {}
          <motion.div
            style={{ x: xBg }}
            className="absolute z-0 flex h-full w-max pointer-events-none items-center px-[10vw] gap-20 md:gap-32 will-change-transform"
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
            className="absolute z-10 flex w-max h-full items-start px-[10vw] gap-10 md:gap-16 will-change-transform"
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`shrink-0 flex items-start ${testimonial.cardStyle}`}
              >
                <div className="w-full bg-white p-7 md:p-9 border border-zinc-200/80 rounded-4xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-zinc-300 transition-all duration-500 hover:-translate-y-2 cursor-pointer group flex flex-col justify-between min-h-77.5">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-[#FFD33B] group-hover:text-zinc-950 group-hover:border-[#FFD33B] transition-colors duration-300 mb-5">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-6 font-medium">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                  </div>

                  {/* Profil Karakter DiceBear */}
                  <div className="flex items-center gap-3.5 mt-auto pt-4 border-t border-zinc-100">
                    <div className="w-11 h-11 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(testimonial.name)}&scale=120&backgroundColor=transparent`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-zinc-900 font-bold text-sm leading-tight">
                        {testimonial.name}
                      </h4>
                      <span className="text-xs text-[#FFD33B] uppercase tracking-wider font-extrabold">
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
    </div>
  );
}

export { TestimonialsSection };
