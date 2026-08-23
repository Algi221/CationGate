"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface ProfileHeroProps {
  ppdbTitle: string;
  ringkasan?: string;
  heroImage?: string;
}

const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const ProfileHero: React.FC<ProfileHeroProps> = ({ ppdbTitle, ringkasan, heroImage }) => {
  const bgImg = heroImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop";

  return (
    <>
      <div className="relative w-full h-[50vh] min-h-95 flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImg}
            alt="Campus Background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 scale-105"
            unoptimized={bgImg.startsWith("http") || bgImg.startsWith("/assets")}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-2"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Tentang {ppdbTitle}
          </h1>
        </motion.div>
      </div>

      <section className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80 py-12 px-4 sm:px-8 transition-colors duration-300">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg font-normal leading-relaxed whitespace-pre-wrap">
            {ringkasan ||
              `${ppdbTitle} merupakan institusi pendidikan teknik dan kejuruan yang didirikan dengan misi pengabdian ilmu pengetahuan dan teknologi untuk memajukan bangsa. ${ppdbTitle} hadir untuk mengoptimalkan pembangunan pendidikan yang maju dan bermartabat.`}
          </p>
        </motion.div>
      </section>
    </>
  );
};
