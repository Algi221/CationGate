"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, SquarePen, Loader2, GripHorizontal } from "lucide-react";
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

const MASCOT_ASSETS = {
  idle: "/assets/catpeer/catpeerStandup.svg",
  thinking: "/assets/catpeer/catpeerTodo.svg",
  writing: "/assets/catpeer/catpeerPegangsurat.svg",
  sleepy: "/assets/catpeer/catpeerBobo.svg",
  icon: "/assets/catpeer/catpeerIcon.svg",
};

const generateId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9));

export function CatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [botMood, setBotMood] = useState<keyof typeof MASCOT_ASSETS>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Halo! Saya Catpeer, asisten cerdas resmi dari CationGate.\n\nAda yang bisa saya bantu terkait pendaftaran sekolah SMK, alur SPMB mandiri, atau sistem pembayaran formulir? miaw",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleVideoToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.isVisible === "boolean") {
        setIsVideoVisible(detail.isVisible);
      }
    };
    window.addEventListener("floatingVideoToggle", handleVideoToggle);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("floatingVideoToggle", handleVideoToggle);
    };
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setBotMood("writing");
    setIsLoading(true);
    setInputText("");

    const userMsg: ChatMessage = {
      id: generateId(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
        const botMsgId = generateId();
        const currentTime = new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

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
        const chunkSize = 3;

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
        }, 10);
      } else {
        throw new Error(data.message || "Gagal mendapatkan respon");
      }
    } catch (_err) {
      const errorMsg: ChatMessage = {
        id: generateId(),
        sender: "bot",
        text: "Maaf, koneksi ke server sedang sibuk. Silakan coba lagi beberapa saat lagi ya. miaw",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setBotMood("sleepy");
      setIsLoading(false);
      setTimeout(() => scrollToBottom("smooth"), 100);
    }
  };

  const handleResetChat = () => {
    setBotMood("idle");
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Percakapan telah diatur ulang. Ada topik seputar CationGate yang ingin Anda ketahui? miaw",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-9999 overflow-hidden"
    >
      <AnimatePresence>
        {isPageLoaded && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              bottom: isVideoVisible ? 150 : 24,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-6 pointer-events-auto flex items-center gap-3 z-950"
          >
            <div className="hidden sm:flex items-center relative bg-black text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl border border-slate-800 select-none">
              <span className="text-slate-100 tracking-tight font-sans">
                Tanya Catpeer aja miaw
              </span>
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-black border-t border-r border-slate-800 rotate-45" />
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFC000] hover:bg-[#FFD33B] text-black shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer border-2 border-white ring-4 ring-black/15 hover:ring-black/25"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src={MASCOT_ASSETS.icon}
                  alt="Catpeer AI"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag={!isMobile}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              touchAction: "none",
            }}
            className={`
              pointer-events-auto absolute flex flex-col 
              shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-800
              inset-0 w-full h-full rounded-none
              sm:inset-auto sm:right-6 sm:w-105 sm:h-180
              sm:rounded-4xl overflow-hidden bg-black
            `}
          >
            <div className="p-4 bg-black text-white border-b border-slate-800 flex items-center justify-between z-30 shrink-0 select-none">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing p-0.5">
                  <GripHorizontal className="w-4 h-4" />
                </div>
                <div className="relative w-10 h-10 rounded-full bg-[#FFC000] p-1 border border-white/20 flex items-center justify-center shrink-0 shadow-md">
                  <Image
                    src={MASCOT_ASSETS[botMood]}
                    alt="Catpeer Mood"
                    width={32}
                    height={32}
                    className="w-7 h-7 object-contain transition-all duration-300"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-[15px] text-white tracking-tight">
                      Catpeer
                    </h3>
                    <span className="text-[9px] font-black uppercase bg-[#FFC000] text-black px-1.5 py-0.5 rounded-md">
                      AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium transition-all duration-300">
                    {botMood === "writing"
                      ? "Menerima pesan..."
                      : botMood === "thinking"
                        ? "Mengetik..."
                        : "Asisten Cerdas CationGate"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={handleResetChat}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Obrolan Baru"
                >
                  <SquarePen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Tutup Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-[#FFC000] flex flex-col overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.08]">
                <Image
                  src={MASCOT_ASSETS.icon}
                  alt="Watermark"
                  width={240}
                  height={240}
                  className="w-50 h-auto object-contain"
                />
              </div>

              <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                {messages.map((msg, index) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      key={msg.id || index}
                      className={`flex flex-col ${isBot ? "items-start" : "items-end"} gap-1`}
                    >
                      <div className="flex items-end gap-2 max-w-[90%] sm:max-w-[85%]">
                        {isBot && (
                          <div className="w-7 h-7 rounded-full bg-black p-1 flex items-center justify-center shrink-0 mb-1 shadow-md border border-slate-800">
                            <Image
                              src={MASCOT_ASSETS.icon}
                              alt="Catpeer"
                              width={20}
                              height={20}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}

                        <div
                          className={`px-4 py-3 rounded-2xl text-[13px] sm:text-[14px] leading-relaxed ${isBot ? "bg-white text-slate-900 font-normal rounded-tl-sm shadow-sm" : "bg-black text-white font-medium rounded-tr-sm shadow-md"}`}
                        >
                          <div className="whitespace-pre-line wrap-break-word font-sans">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-9 text-slate-900/40">
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
                    <div className="w-7 h-7 rounded-full bg-black p-1 flex items-center justify-center shrink-0 shadow-md border border-slate-800">
                      <Image
                        src={MASCOT_ASSETS.icon}
                        alt="Catpeer"
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm text-[13px] sm:text-sm text-slate-900 flex items-center gap-2 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      <span className="font-semibold text-slate-600">
                        Catpeer menerima pesan...
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 3 && !isLoading && (
                <div className="relative z-20 px-4 py-3 bg-linear-to-t from-[#FFC000] via-[#FFC000]/95 to-transparent shrink-0">
                  <p className="text-[10px] uppercase font-black text-black/80 tracking-wider mb-2">
                    Pertanyaan Populer:
                  </p>
                  <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-25 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    {DEFAULT_SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] bg-black/90 hover:bg-black text-white font-bold px-3.5 py-1.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer text-left border border-slate-800"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3.5 sm:p-4 bg-black border-t border-slate-800 z-30 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik pertanyaan seputar CationGate..."
                  className="flex-1 h-11 bg-[#121824] text-white placeholder:text-slate-500 text-[13px] sm:text-sm px-4 rounded-xl border-none outline-none focus:outline-none focus:ring-0 transition-all font-medium"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="w-11 h-11 rounded-xl bg-[#FFC000] hover:bg-[#FFD33B] text-black flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-2 text-center">
                <span className="text-[9px] text-slate-500 font-medium">
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
