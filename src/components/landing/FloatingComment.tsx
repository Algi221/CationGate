"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

export type TagColor = "green" | "purple" | "blue";

interface Tag {
  label: string;
  color: TagColor;
}

interface CommentProps {
  name: string;
  text: string;
  avatarUrl: string;
  tags: Tag[];
  x: string | number;
  y: string | number;
  phase: "large" | "active" | "closing";
  delay?: number;
  isBlurred?: boolean;
  emoji?: string;
}

const Typewriter = ({
  text,
  phase,
  delayStart,
}: {
  text: string;
  phase: string;
  delayStart: number;
}) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (phase !== "active") {
      setDisplayed("");
      return;
    }

    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 20); // Kecepatan ngetik
      return () => clearInterval(interval);
    }, delayStart * 1000);

    return () => clearTimeout(timeout);
  }, [phase, text, delayStart]);

  return <span>{displayed}</span>;
};

export default function FloatingComment({
  name,
  text,
  avatarUrl,
  tags,
  x,
  y,
  phase,
  delay = 0,
  isBlurred = false,
  emoji,
}: CommentProps) {
  const getTagColor = (color: TagColor) => {
    switch (color) {
      case "green":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400";
      case "purple":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400";
      case "blue":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      // z-20 (dan z-10) memastikan komentar ini selalu di BELAKANG gambar mockup (z-30)
      className={`absolute pointer-events-none ${isBlurred ? "blur-[3px] z-10" : "z-20"}`}
      initial={{
        left: "50%",
        top: "50%",
        x: "-50%",
        y: "-50%",
        opacity: 0,
        scale: 0,
      }}
      animate={{
        left: phase === "active" ? x : "50%",
        top: phase === "active" ? y : "50%",
        opacity: phase === "active" ? (isBlurred ? 0.6 : 1) : 0,
        scale: phase === "active" ? (isBlurred ? 0.75 : 1) : 0,
      }}
      transition={{
        duration: phase === "closing" ? 0.6 : 0.8,
        delay: phase === "active" ? delay : 0,
        ease: phase === "closing" ? "easeIn" : [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        animate={{ y: ["0%", "-8%", "0%"] }}
        transition={{
          duration: 4 + Math.random() * 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-start gap-3 bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800/80 p-3.5 w-[260px] md:w-[280px]"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800 mt-1 border border-gray-200 dark:border-slate-700">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0 pt-0.5">
          <span className="text-[10.5px] font-bold text-gray-900 dark:text-gray-200 mb-1 tracking-wide">
            {name}
          </span>
          <p className="text-[12px] text-gray-700 dark:text-slate-300 leading-relaxed font-medium min-h-[50px]">
            <Typewriter text={text} phase={phase} delayStart={delay + 0.3} />
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-2 py-[3px] text-[8.5px] font-bold rounded-md uppercase tracking-wider ${getTagColor(tag.color)}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Animasi Emoji Ke Atas */}
        {emoji && (
          <motion.div
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={
              phase === "active"
                ? { scale: 1, y: 0, opacity: 1 }
                : { scale: 0, y: 20, opacity: 0 }
            }
            transition={{
              type: "spring",
              bounce: 0.6,
              delay: phase === "active" ? delay + 1.8 : 0,
            }}
            className="absolute -right-3 -bottom-3 text-[26px] drop-shadow-xl z-30"
          >
            {emoji}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
