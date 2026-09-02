"use client";

import React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ChatMessage, MASCOT_ASSETS } from "./types";

interface CatBotMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  botMood: keyof typeof MASCOT_ASSETS;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function CatBotMessageList({
  messages,
  isLoading,
  botMood,
  messagesEndRef,
}: CatBotMessageListProps) {
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden bg-[#FFC000]">
      {/* Background Watermark Catpeer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-10 mix-blend-luminosity">
        <Image
          src={MASCOT_ASSETS.icon}
          alt="Watermark"
          width={300}
          height={300}
          className="w-50 sm:w-70 h-auto object-contain"
        />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {messages.map((msg, index) => {
          const isBot = msg.sender === "bot";
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              key={msg.id || index}
              className={`flex flex-col ${
                isBot ? "items-start" : "items-end"
              } gap-1`}
            >
              <div
                className={`flex items-end gap-2 max-w-[92%] sm:max-w-[85%] ${!isBot && "flex-row-reverse"}`}
              >
                {/* Bot Avatar (Black Circle, Yellow Icon) */}
                {isBot && (
                  <div className="w-7 h-7 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0 mb-1">
                    <Image
                      src={MASCOT_ASSETS.icon}
                      alt="Catpeer"
                      width={18}
                      height={18}
                      className="w-4.5 h-4.5 object-contain"
                    />
                  </div>
                )}

                <div
                  className={`px-4 py-3 text-[13.5px] sm:text-[14px] leading-relaxed shadow-sm ${
                    isBot
                      ? "bg-white text-slate-900 rounded-2xl rounded-tl-sm"
                      : "bg-[#0a0a0a] text-white font-medium rounded-2xl rounded-tr-sm"
                  }`}
                >
                  <div className="whitespace-pre-line wrap-break-word font-sans">
                    {msg.text}
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold text-black/40 ${isBot ? "px-11 sm:px-9" : "px-2"}`}
              >
                {msg.time}
              </span>
            </motion.div>
          );
        })}

        {isLoading && botMood === "writing" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 max-w-[85%]"
          >
            <div className="w-7 h-7 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0 mt-1">
              <Image
                src={MASCOT_ASSETS.icon}
                alt="Catpeer"
                width={18}
                height={18}
                className="w-4.5 h-4.5 object-contain"
              />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm text-[13px] flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="font-medium text-slate-500">Mengetik...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
