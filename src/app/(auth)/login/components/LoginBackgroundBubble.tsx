"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoginBackgroundBubbleProps {
  isMobile: boolean;
}

export function LoginBackgroundBubble({ isMobile }: LoginBackgroundBubbleProps) {
  const svgPathMobileInitial =
    "M 0 0 L 414 0 L 414 70 C 260 100, 120 90, 0 110 Z";
  const svgPathMobile =
    "M 0 0 L 414 0 L 414 125 C 290 165, 150 155, 0 185 Z";

  const svgPathDesktopInitial =
    "M 0 0 L 420 0 C 480 220, 360 380, 200 520 C 90 600, 0 540, 0 540 Z";
  const svgPathDesktop =
    "M 0 0 L 540 0 C 620 300, 460 500, 280 670 C 130 740, 0 670, 0 670 Z";
  const solidColor = "#0077c8";

  return (
    <div className="absolute top-0 left-0 w-full lg:w-[50vw] h-45 lg:h-[92vh] pointer-events-none z-0">
      <svg
        viewBox={isMobile ? "0 0 414 200" : "0 0 600 700"}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{
            d: isMobile ? svgPathMobileInitial : svgPathDesktopInitial,
            fill: solidColor,
            opacity: 0,
          }}
          animate={{
            d: isMobile ? svgPathMobile : svgPathDesktop,
            fill: solidColor,
            opacity: 1,
          }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </svg>
    </div>
  );
}
