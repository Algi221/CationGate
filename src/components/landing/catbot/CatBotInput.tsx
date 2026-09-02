"use client";

import React from "react";
import { Send } from "lucide-react";

interface CatBotInputProps {
  inputText: string;
  setInputText: (val: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSendMessage: () => void;
}

export function CatBotInput({
  inputText,
  setInputText,
  isLoading,
  inputRef,
  onSendMessage,
}: CatBotInputProps) {
  return (
    <div className="p-3 sm:p-4 bg-[#0a0a0a] border-t border-white/10 z-30 shrink-0">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
        className="flex items-center gap-2 sm:gap-2.5"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pertanyaan seputar CationGate..."
          className="flex-1 h-12 bg-[#161b22] text-white placeholder:text-slate-500 text-[13px] sm:text-sm px-4 rounded-xl border border-white/10 outline-none focus:border-[#FFC000] focus:ring-1 focus:ring-[#FFC000] transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-12 h-12 rounded-xl bg-[#FFC000] hover:bg-[#e5ac00] text-black flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
