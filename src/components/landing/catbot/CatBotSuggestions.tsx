"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_SUGGESTIONS } from "./types";

interface CatBotSuggestionsProps {
  showSuggestions: boolean;
  isSuggestionsOpen: boolean;
  setIsSuggestionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectSuggestion: (sug: string) => void;
}

export function CatBotSuggestions({
  showSuggestions,
  isSuggestionsOpen,
  setIsSuggestionsOpen,
  onSelectSuggestion,
}: CatBotSuggestionsProps) {
  return (
    <AnimatePresence>
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="relative z-20 px-4 sm:px-5 pb-3.5 pt-2.5 bg-linear-to-t from-black/10 via-black/5 to-transparent border-t border-black/10 shrink-0"
        >
          {/* Header Panel Pertanyaan dengan Tombol Toggle */}
          <button
            onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
            className="w-full flex items-center justify-between text-left text-[10px] uppercase font-black text-black/80 tracking-wider mb-2.5 cursor-pointer select-none group"
          >
            <span>Pertanyaan Populer</span>
            <span className="p-1 rounded-full bg-black/10 group-hover:bg-black/20 transition-colors">
              {isSuggestionsOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-black" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-black" />
              )}
            </span>
          </button>

          {/* Daftar Tombol Pertanyaan yang Bisa Disembunyikan/Ditampilkan */}
          <AnimatePresence>
            {isSuggestionsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex sm:flex-wrap overflow-x-auto sm:overflow-visible gap-2 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  {DEFAULT_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectSuggestion(sug)}
                      className="shrink-0 sm:shrink text-[11px] bg-[#0a0a0a] hover:bg-black text-white font-medium px-4 py-2 rounded-full transition-all border border-white/20 active:scale-95 cursor-pointer shadow-sm text-left whitespace-nowrap sm:whitespace-normal"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
