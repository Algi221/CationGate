"use client";

import React from "react";
import Image from "next/image";
import { GripHorizontal, SquarePen, X } from "lucide-react";
import { MASCOT_ASSETS } from "./types";

interface CatBotHeaderProps {
  botMood: keyof typeof MASCOT_ASSETS;
  onResetChat: () => void;
  onClose: () => void;
}

export function CatBotHeader({
  botMood,
  onResetChat,
  onClose,
}: CatBotHeaderProps) {
  return (
    <div className="p-3 sm:p-4 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between z-30 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing p-0.5">
          <GripHorizontal className="w-4 h-4" />
        </div>
        <div className="relative w-10 h-10 rounded-full bg-[#FFC000] flex items-center justify-center shrink-0">
          <Image
            src={MASCOT_ASSETS[botMood]}
            alt="Catpeer Mood"
            width={32}
            height={32}
            className="w-7 h-7 object-contain transition-all duration-300 drop-shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-[1.5px] border-[#FFC000] rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-[15px] text-white tracking-tight">
              Catpeer
            </h3>
            <span className="text-[9px] font-bold uppercase bg-[#FFC000] text-black px-1.5 py-0.5 rounded-md">
              AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium transition-all duration-300 mt-0.5">
            {botMood === "writing"
              ? "Menerima pesan..."
              : botMood === "thinking"
                ? "Mengetik balasan..."
                : "Asisten Cerdas CationGate"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onResetChat}
          className="p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Obrolan Baru"
        >
          <SquarePen className="w-4 h-4 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Tutup Chat"
        >
          <X className="w-5 h-5 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
