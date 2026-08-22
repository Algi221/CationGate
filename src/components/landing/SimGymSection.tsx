"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FloatingComment, { TagColor } from "./FloatingComment";

const COMMENTS_DATA = [
  {
    id: 1,
    name: "Alex Danvers",
    text: "UI-nya sangat modern, calon siswa jadi gampang buat ngisi formulir pendaftaran lewat HP.",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Alex",
    tags: [
      { label: "Responsive", color: "green" as TagColor },
      { label: "UI Design", color: "purple" as TagColor },
    ],
    x: "18%",
    y: "18%",
    delay: 0.2,
    emoji: "🔥",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    text: "Alur pendaftarannya jelas banget, nggak bikin bingung orang tua murid pas daftar!",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
    tags: [
      { label: "User Flow", color: "green" as TagColor },
      { label: "Accessible", color: "blue" as TagColor },
    ],
    x: "80%",
    y: "22%",
    delay: 0.5,
  },
  {
    id: 3,
    name: "Michael Chang",
    text: "Dashboard adminnya lengkap. Ngerekap data pendaftar jadi hitungan detik doang.",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael",
    tags: [
      { label: "Admin Panel", color: "blue" as TagColor },
      { label: "Fast", color: "purple" as TagColor },
    ],
    x: "12%",
    y: "68%",
    delay: 0.8,
    emoji: "🚀",
  },
  {
    id: 4,
    name: "Emily R.",
    text: "Tema gelapnya keren banget, bikin web SPMB sekolah kelihatan jauh lebih premium.",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Emily",
    tags: [
      { label: "Dark Mode", color: "green" as TagColor },
      { label: "Premium", color: "purple" as TagColor },
    ],
    x: "82%",
    y: "72%",
    delay: 1.1,
    emoji: "👏",
  },
  {
    id: 5,
    name: "David Kim",
    text: "Sangat fleksibel, komponennya gampang banget disesuaikan sama branding SMK kita.",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=David",
    tags: [
      { label: "Customizable", color: "blue" as TagColor },
      { label: "Branding", color: "purple" as TagColor },
    ],
    x: "50%",
    y: "85%",
    delay: 1.4,
    emoji: "👍",
  },
  {
    id: 6,
    name: "Chris L.",
    text: "Upload dokumen kelulusan lancar tanpa kendala server.",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Chris",
    tags: [{ label: "Upload", color: "purple" as TagColor }],
    x: "45%",
    y: "12%",
    delay: 1.7,
    isBlurred: true,
  },
  {
    id: 7,
    name: "Jessica W.",
    text: "Loading super cepat, anti lemot saat server pendaftaran penuh.",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Jessica",
    tags: [{ label: "Performance", color: "green" as TagColor }],
    x: "65%",
    y: "10%",
    delay: 1.9,
    isBlurred: true,
  },
];

export default function SimGymSection() {
  const [phase, setPhase] = useState<"large" | "active" | "closing">("large");

  useEffect(() => {
    let isMounted = true;

    const runAnimationCycle = async () => {
      while (isMounted) {
        setPhase("large");
        await new Promise((r) => setTimeout(r, 2500));
        if (!isMounted) break;

        setPhase("active");
        await new Promise((r) => setTimeout(r, 8000));
        if (!isMounted) break;

        setPhase("closing");
        await new Promise((r) => setTimeout(r, 1000));
      }
    };

    runAnimationCycle();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#e6e5dd][#0b1121] flex flex-col lg:flex-row transition-colors duration-500 overflow-hidden">
      {}
      <div className="w-full lg:w-[40%] relative z-40 flex flex-col justify-center pt-24 pb-8 px-6 sm:px-12 md:px-20 lg:py-0 lg:pl-10 xl:pl-20 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 tracking-tight leading-tight mb-4 transition-colors">
          Template SPMB SMK
        </h2>
        <p className="text-gray-700 text-base md:text-lg mb-8 max-w-md transition-colors font-medium leading-relaxed">
          Sistem pendaftaran siswa baru yang modern, responsif, dan mudah
          dikelola. Dilengkapi fitur lengkap yang siap disesuaikan dengan
          identitas sekolah Anda.
        </p>
        <button className="w-fit px-7 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
          Lihat Demo ↗
        </button>
      </div>

      <div className="w-full lg:w-[60%] h-112.5 sm:h-137.5 lg:h-screen relative flex items-center justify-center">
        {/* Kontainer Utama yang membatasi luas workspace kartu agar rapi dan responsif di semua device */}
        <div className="absolute flex items-center justify-center w-250 h-200 origin-center scale-[0.48] sm:scale-[0.65] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 pointer-events-none z-30">
          {/* Main Card */}
          <motion.div
            animate={{
              scale: phase === "large" ? 1.1 : 0.75,
            }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="relative flex gap-5 z-30 origin-center pointer-events-auto"
          >
            {/* Card 1 */}
            <div className="w-[320px] h-55 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 border border-gray-200 transition-colors flex flex-col">
              <div className="w-full h-30 rounded-xl overflow-hidden mb-3 relative bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/landing/imageLanding.png"
                  alt="Formulir Interaktif"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-2">
                <p className="text-[14px] font-bold text-gray-900">
                  Halaman Landing yang Keren
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Mobile First Design
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-[320px] h-55 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 border border-gray-200 transition-colors flex flex-col">
              <div className="w-full h-30 rounded-xl overflow-hidden mb-3 relative bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/landing/imageLanding1.png"
                  alt="Landing Page Interaktif"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-2">
                <p className="text-[14px] font-bold text-gray-900">
                  Landing Page Interaktif
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Modern Design
                </p>
              </div>
            </div>
          </motion.div>

          {}
          {COMMENTS_DATA.map((comment) => (
            <FloatingComment
              key={comment.id}
              phase={phase}
              name={comment.name}
              text={comment.text}
              avatarUrl={comment.avatarUrl}
              tags={comment.tags}
              x={comment.x}
              y={comment.y}
              delay={comment.delay}
              isBlurred={comment.isBlurred}
              emoji={comment.emoji}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
