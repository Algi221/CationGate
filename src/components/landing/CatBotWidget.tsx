"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  SquarePen,
  Loader2,
  GripHorizontal,
  ChevronDown,
  ChevronUp,
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
  "Integrasi ekspor ke Dapodik?",
];

const TOOLTIP_MESSAGES = [
  "Tanya Catpeer aja, miaw!",
  "Butuh bantuan PPDB?",
  "Ada yang bingung?",
  "Catpeer siap bantu!",
];

// Mapping variasi aset maskot
const MASCOT_ASSETS = {
  idle: "/assets/catpeer/catpeerStandup.svg",
  thinking: "/assets/catpeer/catpeerTodo.svg",
  writing: "/assets/catpeer/catpeerPegangsurat.svg",
  sleepy: "/assets/catpeer/catpeerBobo.svg",
  icon: "/assets/catpeer/catpeerIcon.svg",
};

export function CatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isVideoDockedBottomRight, setIsVideoDockedBottomRight] =
    useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // State untuk mengontrol panel pertanyaan populer (default: true / terbuka)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);

  // State untuk animasi tooltip
  const [tooltipIndex, setTooltipIndex] = useState(0);

  const [botMood, setBotMood] = useState<keyof typeof MASCOT_ASSETS>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Ada yang bisa saya bantu terkait pendaftaran sekolah SMK, alur SPMB mandiri, atau sistem pembayaran formulir? miaw",
      time: "09:00",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Rotasi pesan tooltip sebelum diklik
  useEffect(() => {
    const interval = setInterval(() => {
      setTooltipIndex((prev) => (prev + 1) % TOOLTIP_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Menangkap event loading-complete
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isInternalNav =
        sessionStorage.getItem("cationgate_internal_navigation") === "true";
      if (isInternalNav) {
        setIsPageLoaded(true);
      }
    }

    const handleLoadingComplete = () => setIsPageLoaded(true);
    window.addEventListener(
      "cationgate:loading-complete",
      handleLoadingComplete,
    );

    const fallbackTimer = setTimeout(() => setIsPageLoaded(true), 6000);

    return () => {
      window.removeEventListener(
        "cationgate:loading-complete",
        handleLoadingComplete,
      );
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Handle Resize (Responsive) & Floating Video Events
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    const handleVideoToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.isVisible === "boolean") {
        setIsVideoVisible(detail.isVisible);
      }
    };
    window.addEventListener("floatingVideoToggle", handleVideoToggle);

    const handlePositionChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.isDockedBottomRight === "boolean") {
        setIsVideoDockedBottomRight(detail.isDockedBottomRight);
      }
      if (typeof detail?.isVisible === "boolean") {
        setIsVideoVisible(detail.isVisible);
      }
    };
    window.addEventListener(
      "floatingVideoPositionChange",
      handlePositionChange,
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("floatingVideoToggle", handleVideoToggle);
      window.removeEventListener(
        "floatingVideoPositionChange",
        handlePositionChange,
      );
    };
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Delay fokus di mobile agar keyboard tidak langsung lompat dan merusak transisi
      setTimeout(() => {
        if (!isMobile) inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMobile]);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || inputText).trim();
      if (!text || isLoading) return;

      setBotMood("writing");
      setIsLoading(true);
      setInputText("");

      const now = new Date();
      const currentTime = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const userMsg: ChatMessage = {
        id: "usr-" + Date.now(),
        sender: "user",
        text: text,
        time: currentTime,
      };

      setMessages((prev) => [...prev, userMsg]);
      setTimeout(() => scrollToBottom("smooth"), 50);

      try {
        const historyPayload = messages.map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text,
        }));

        const res = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: historyPayload }),
        });

        const data = await res.json();

        if (data.success && data.reply) {
          setBotMood("thinking");

          const replyText = data.reply;
          const botMsgId = "bot-" + Date.now();

          setMessages((prev) => [
            ...prev,
            {
              id: botMsgId,
              sender: "bot",
              text: "",
              time: currentTime,
              source: data.source,
            },
          ]);

          let i = 0;
          let currentText = "";
          const chunkSize = 4;

          const interval = setInterval(() => {
            currentText += replyText.substring(i, i + chunkSize);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botMsgId ? { ...m, text: currentText } : m,
              ),
            );
            i += chunkSize;

            if (i % (chunkSize * 2) === 0) scrollToBottom("auto");

            if (i >= replyText.length) {
              clearInterval(interval);
              setBotMood("idle");
              setIsLoading(false);
              setTimeout(() => scrollToBottom("smooth"), 50);
            }
          }, 12);
        } else {
          throw new Error(data.message || "Gagal mendapatkan respon");
        }
      } catch {
        const errorMsg: ChatMessage = {
          id: "err-" + Date.now(),
          sender: "bot",
          text: "Maaf, koneksi ke server sedang sibuk. Silakan coba lagi beberapa saat lagi ya. miaw",
          time: currentTime,
        };
        setMessages((prev) => [...prev, errorMsg]);
        setBotMood("sleepy");
        setIsLoading(false);
        setTimeout(() => scrollToBottom("smooth"), 100);
      }
    },
    [inputText, isLoading, messages],
  );

  const handleResetChat = useCallback(() => {
    setBotMood("idle");
    setMessages([
      {
        id: "reset-" + Date.now(),
        sender: "bot",
        text: "Percakapan telah diatur ulang. Ada topik seputar CationGate yang ingin Anda ketahui? miaw",
        time: "09:00",
      },
    ]);
  }, []);

  const showSuggestions = !isLoading;

  const isVideoNearBottomRight = isVideoVisible && isVideoDockedBottomRight;
  const effectiveBottom = isMobile ? 24 : isVideoNearBottomRight ? 150 : 24;

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-9999 overflow-hidden"
    >
      {/* WIDGET SEBELUM DI-KLIK (PRE-CLICK) */}
      <AnimatePresence>
        {isPageLoaded && !isOpen && (
          <motion.div
            className="absolute right-4 sm:right-6 pointer-events-auto z-950"
            initial={{ scale: 0, opacity: 0, y: 20, bottom: effectiveBottom }}
            animate={{ scale: 1, opacity: 1, y: 0, bottom: effectiveBottom }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 24,
              mass: 0.8,
            }}
          >
            <div className="flex items-center gap-4">
              {/* Tooltip Animasi Dinamis */}
              <div className="hidden sm:flex items-center relative bg-[#0a0a0a] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg select-none overflow-hidden h-9 min-w-42.5 justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tooltipIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute text-slate-100 tracking-wide font-sans whitespace-nowrap"
                  >
                    {TOOLTIP_MESSAGES[tooltipIndex]}
                  </motion.span>
                </AnimatePresence>
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0a0a0a] rotate-45" />
              </div>

              {/* Bot Button Icon */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFC000] text-black shadow-xl flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <Image
                    src={MASCOT_ASSETS.icon}
                    alt="Catpeer"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
                {/* Online Indicator */}
                <span className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#FFC000] rounded-full" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* JENDELA CHAT (DESIGN HITAM & KUNING) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag={!isMobile}
            dragConstraints={constraintsRef}
            dragElastic={0.05}
            dragMomentum={false}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              bottom: isMobile ? 0 : effectiveBottom,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
              bottom: { type: "spring", stiffness: 280, damping: 24 },
            }}
            style={{
              height: isMobile ? "100dvh" : "auto",
              maxHeight: isMobile
                ? "100dvh"
                : `calc(100vh - ${effectiveBottom + 30}px)`,
            }}
            className={`
              pointer-events-auto absolute flex flex-col 
              shadow-2xl sm:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] 
              border-0 sm:border sm:border-slate-800
              inset-0 w-full rounded-none
              sm:inset-auto sm:right-6 sm:w-100 sm:h-170
              sm:rounded-3xl overflow-hidden bg-[#0a0a0a]
            `}
          >
            {/* Header (Black) */}
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
                  onClick={handleResetChat}
                  className="p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Obrolan Baru"
                >
                  <SquarePen className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Tutup Chat"
                >
                  <X className="w-5 h-5 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Area Chat Utama (Yellow Background) */}
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
                      <span className="font-medium text-slate-500">
                        Mengetik...
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Area Pertanyaan Populer (Default Terbuka & Bisa Ditutup/Dibuka) */}
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
                                onClick={() => handleSendMessage(sug)}
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
            </div>

            {/* Input Form (Black Background) */}
            <div className="p-3 sm:p-4 bg-[#0a0a0a] border-t border-white/10 z-30 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
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
              <div className="mt-2.5 sm:mt-3 text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                  Didukung oleh Google Gemini AI &bull; Catpeer CationGate
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CatBotWidget;
