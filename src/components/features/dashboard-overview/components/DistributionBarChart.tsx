"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DistributionBarChartProps {
  data: { label: string; value: number; color: string }[];
}

export const DistributionBarChart: React.FC<DistributionBarChartProps> = ({ data }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  const W = 1000;
  const H = 260;
  const PAD_L = 40;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 48;

  const barW = Math.min(80, ((W - PAD_L - PAD_R) / (data.length || 1)) * 0.55);
  const gap = (W - PAD_L - PAD_R) / (data.length || 1);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
    val: Math.round(maxVal * frac),
    y: PAD_T + (1 - frac) * (H - PAD_T - PAD_B)
  }));

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
        {/* Grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              y1={t.y}
              x2={W - PAD_R}
              y2={t.y}
              stroke="currentColor"
              strokeOpacity="0.06"
              strokeWidth="1"
              className="text-slate-900 dark:text-white"
            />
            <text
              x={PAD_L - 6}
              y={t.y + 4}
              textAnchor="end"
              fontSize="11"
              className="fill-slate-400 dark:fill-slate-600"
              opacity="0.75"
            >
              {t.val}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = PAD_L + gap * i + gap / 2;
          const fullBarH = (d.value / maxVal) * (H - PAD_T - PAD_B);
          const barH = animated ? fullBarH : 0;
          const barY = H - PAD_B - (animated ? fullBarH : 0);
          const isHov = hovered === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Ghost bg */}
              <rect
                x={cx - barW / 2}
                y={PAD_T}
                width={barW}
                height={H - PAD_T - PAD_B}
                rx="6"
                fill={d.color}
                opacity={isHov ? 0.08 : 0}
                className="transition-opacity duration-200"
              />
              {/* Bar - animated height */}
              <rect
                x={cx - barW / 2}
                y={barY}
                width={barW}
                height={barH}
                rx="6"
                fill={d.color}
                opacity={isHov ? 1 : 0.78}
                style={{
                  transition:
                    "height 0.7s cubic-bezier(0.22,1,0.36,1), y 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.2s"
                }}
              />
              {/* Value on hover */}
              {isHov && animated && (
                <text
                  x={cx}
                  y={H - PAD_B - fullBarH - 7}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill={d.color}
                >
                  {d.value}
                </text>
              )}
              {/* X label */}
              <text
                x={cx}
                y={H - PAD_B + 16}
                textAnchor="middle"
                fontSize="11"
                className="fill-slate-500 dark:fill-slate-400"
              >
                {d.label}
              </text>
              {/* Percentage */}
              <text
                x={cx}
                y={H - PAD_B + 30}
                textAnchor="middle"
                fontSize="10"
                className="fill-slate-400 dark:fill-slate-600"
              >
                {Math.round((d.value / total) * 100)}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hovered !== null && data[hovered] && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute pointer-events-none bg-slate-900/95 dark:bg-slate-950 border border-slate-700/50 backdrop-blur-xs rounded-xl px-3.5 py-2.5 shadow-xl z-20 flex flex-col gap-0.5"
            style={{
              left: `${((PAD_L + gap * hovered + gap / 2) / W) * 100}%`,
              top: "10%",
              transform: "translate(-50%, -100%)"
            }}
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              {data[hovered].label}
            </span>
            <span className="text-sm font-black text-white">
              {data[hovered].value}{" "}
              <span className="text-[10px] text-slate-400 font-bold">pendaftar</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              {Math.round((data[hovered].value / total) * 100)}% dari total
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
