"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Interface diperbarui agar menerima properti warna kustom
export interface HoverExpandImageItem {
  src: string;
  alt: string;
  code: string;
  badgeBg?: string;
  badgeText?: string;
  accentColor?: string;
  headingColor?: string;
  bodyColor?: string;
  borderColor?: string;
}

export const HoverExpand_001 = ({
  images,
  className,
}: {
  images: HoverExpandImageItem[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(0); // Default aktif di index 0

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn("relative w-full max-w-7xl mx-auto px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-3">
          {images.map((image, index) => {
            const isActive = activeImage === index;
            const borderCol = image.borderColor || "#E7E1D6";
            const headingCol = image.headingColor || "#23191C";
            const bodyCol = image.bodyColor || "#58504E";
            const badgeBgCol = image.badgeBg || "#FFD33B";
            const badgeTextCol = image.badgeText || "#23191C";

            return (
              <motion.div
                key={index}
                className="relative cursor-pointer overflow-hidden rounded-3xl shadow-md transition-shadow duration-300 hover:shadow-xl"
                style={{
                  border: `2px solid ${isActive ? image.accentColor || borderCol : borderCol}`,
                }}
                initial={{ width: "4.5rem", height: "26rem" }}
                animate={{
                  width: isActive ? "100%" : "4.5rem",
                  maxWidth: isActive ? "48rem" : "4.5rem",
                  height: "26rem",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onClick={() => setActiveImage(index)}
                onHoverStart={() => setActiveImage(index)}
              >
                {/* Visual Accent Top Bar untuk Card Aktif */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 z-30 transition-all duration-300"
                    style={{ backgroundColor: image.accentColor || badgeBgCol }}
                  />
                )}

                {/* Gradient Overlay saat Aktif */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(253, 251, 247, 0.95) 0%, rgba(253, 251, 247, 0.6) 45%, transparent 100%)",
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Konten Teks & Badge saat Card Aktif */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="absolute flex h-full w-full flex-col items-start justify-end p-6 z-20"
                    >
                      {/* Title Badge Kustom */}
                      <span
                        className="px-3 py-1 rounded-full text-xs font-black tracking-wide mb-2 shadow-sm uppercase"
                        style={{
                          backgroundColor: badgeBgCol,
                          color: badgeTextCol,
                        }}
                      >
                        {image.code}
                      </span>

                      {/* Heading */}
                      <h3
                        className="text-2xl font-black mb-1 leading-snug"
                        style={{ color: headingCol }}
                      >
                        {image.code}
                      </h3>

                      {/* Deskripsi Body */}
                      <p
                        className="text-left text-sm font-medium line-clamp-2 leading-relaxed max-w-xl"
                        style={{ color: bodyCol }}
                      >
                        {image.alt}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gambar Fitur */}
                <img
                  src={image.src}
                  className="size-full object-cover object-top"
                  alt={image.alt}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};