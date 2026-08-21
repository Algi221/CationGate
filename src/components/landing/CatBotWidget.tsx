"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  SquarePen, 
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  source?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Apa itu CationGate?",
  "Cara mendaftarkan sekolah SMK?",
  "Metode pembayaran formulir?",
  "Alur pendaftaran siswa mandiri di HP?",
  "Integrasi ekspor ke Dapodik?"
];

export function CatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Halo! Saya Catpeer, asisten cerdas resmi dari CationGate.\n\nAda yang bisa saya bantu terkait pendaftaran sekolah SMK, alur SPMB mandiri, atau sistem pembayaran formulir? miaw",
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen to Floating Video visibility to dynamically adjust FAB and Modal position
  useEffect(() => {
    const handleVideoToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.isVisible === "boolean") {
        setIsVideoVisible(detail.isVisible);
      }
    };
    window.addEventListener("floatingVideoToggle", handleVideoToggle);
    return () => window.removeEventListener("floatingVideoToggle", handleVideoToggle);
  }, []);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }));

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      const data = await res.json();

      if (data.success && data.reply) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          source: data.source
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.message || "Gagal mendapatkan respon");
      }
    } catch (_err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Maaf, koneksi ke server sedang sibuk. Anda dapat membaca panduan lengkap di menu Fitur Unggulan atau mendaftar di halaman Daftar Sekolah. miaw",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Percakapan telah diatur ulang. Ada topik seputar CationGate yang ingin Anda ketahui? miaw",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON (FAB) - DYNAMIC POSITION ABOVE VIDEO */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              bottom: isVideoVisible ? 150 : 24 
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed right-6 z-[950] flex items-center gap-3"
          >
            {/* Sleek Minimalist Speech Bubble (Balon Chat) */}
            <div className="hidden sm:flex items-center relative bg-black text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl border border-slate-800 pointer-events-none select-none">
              <span className="text-slate-100 tracking-tight font-sans">
                Tanya Catpeer aja miaw
              </span>
              {/* Balon Chat Pointer Tail */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-black border-t border-r border-slate-800 rotate-45" />
            </div>

            {/* Main Trigger Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFC000] hover:bg-[#FFD33B] text-black shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer border-2 border-white ring-4 ring-black/15 hover:ring-black/25"
              title="Buka Asisten Catpeer"
              aria-label="Buka Chatbot Catpeer"
            >
              {/* Mascot Icon */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/assets/catpeer/catpeerStandup.svg"
                  alt="Catpeer"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Status Indicator */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHATBOT WINDOW (POSITIONED CLEANLY ABOVE VIDEO IF ACTIVE + EXTRA TALL) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              bottom: isVideoVisible ? 148 : 24
            }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
              fixed z-[9999] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-2 border-black
              inset-0 w-full h-full rounded-none
              sm:inset-auto sm:right-6 sm:w-[500px] lg:w-[520px]
              sm:rounded-[2.5rem]
              overflow-hidden bg-black
            `}
            style={{
              height: isVideoVisible 
                ? "min(640px, calc(100vh - 170px))" 
                : "min(780px, 92vh)"
            }}
          >
            {/* 1. SOLID BLACK HEADER (NO TRANSPARENCY) */}
            <div className="p-4 sm:p-5 bg-black text-white border-b border-slate-800 flex items-center justify-between z-30 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="relative w-11 h-11 rounded-full bg-[#FFC000] p-1 border-2 border-white/40 flex items-center justify-center shrink-0 shadow-md">
                  <Image
                    src="/assets/catpeer/catpeerStandup.svg"
                    alt="Catpeer"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg text-white tracking-tight">
                      Catpeer
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-[#FFC000] text-black px-2 py-0.5 rounded-full">
                      AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Asisten Cerdas CationGate
                  </p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetChat}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Obrolan Baru"
                  aria-label="Obrolan Baru"
                >
                  <SquarePen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Tutup Chat"
                  aria-label="Tutup Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. CHAT CANVAS WITH SOLID YELLOW BACKGROUND & FULLY VISIBLE CATPEER ILLUSTRATION */}
            <div className="relative flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 z-10 flex flex-col bg-[#FFC000]">
              
              {/* CLEARLY VISIBLE CATPEER STANDUP MASCOT IN THE BACKGROUND */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-85">
                <img
                  src="/assets/catpeer/catpeerStandup.svg"
                  alt="Catpeer Mascot"
                  className="w-[280px] sm:w-[320px] h-auto max-h-[80%] object-contain"
                />
              </div>

              {/* Messages Container */}
              <div className="relative z-10 space-y-4 flex-1">
                {messages.map((msg) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBot ? "items-start" : "items-end"} gap-1`}
                    >
                      <div className="flex items-end gap-2.5 max-w-[90%] sm:max-w-[85%]">
                        {isBot && (
                          <div className="w-8 h-8 rounded-full bg-black p-1.5 flex items-center justify-center shrink-0 mb-1 shadow-md border border-slate-800">
                            <Image
                              src="/assets/catpeer/catpeerStandup.svg"
                              alt="Catpeer"
                              width={24}
                              height={24}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}

                        <div
                          className={`
                            px-4.5 py-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed
                            ${isBot 
                              ? "bg-white text-slate-950 font-normal rounded-tl-xs shadow-xl border border-slate-200/90" 
                              : "bg-black text-white font-medium rounded-tr-xs shadow-xl border border-slate-900"
                            }
                          `}
                        >
                          <div className="whitespace-pre-line break-words font-sans">
                            {msg.text}
                          </div>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <span className={`text-[10px] font-bold px-11 ${isBot ? "text-slate-900" : "text-slate-900"}`}>
                        {msg.time}
                      </span>
                    </div>
                  );
                })}

                {/* Loading Bubble */}
                {isLoading && (
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-black p-1.5 flex items-center justify-center shrink-0 shadow-md border border-slate-800">
                      <Image
                        src="/assets/catpeer/catpeerStandup.svg"
                        alt="Catpeer"
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="bg-white border border-slate-200 px-4.5 py-3.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-slate-900 flex items-center gap-2.5 shadow-xl">
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span className="font-semibold text-slate-950">Catpeer sedang mengetik...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions (Solid Black High-Contrast Pills) */}
              {messages.length <= 3 && !isLoading && (
                <div className="relative z-10 pt-3 border-t border-black/20">
                  <p className="text-[11px] uppercase font-black text-black tracking-wider mb-2">
                    Pertanyaan Populer:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="text-xs bg-black hover:bg-slate-900 text-white font-bold px-3.5 py-2 rounded-full transition-all shadow-md active:scale-95 cursor-pointer text-left border border-slate-800"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* 3. SOLID BLACK FOOTER / INPUT AREA (NO TRANSPARENCY) */}
            <div className="p-3.5 sm:p-4.5 bg-black border-t border-slate-800 z-30 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2.5"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik pertanyaan seputar CationGate..."
                  className="flex-1 h-12 bg-[#121824] text-white placeholder:text-slate-400 text-xs sm:text-sm px-4 rounded-xl border border-slate-800 focus:outline-none focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20 transition-all font-medium"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-[#FFC000] hover:bg-[#FFD33B] text-black flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg font-bold"
                  title="Kirim Pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-2.5 text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  Didukung oleh Google Gemini AI &bull; Catpeer CationGate
                </span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default CatBotWidget;
