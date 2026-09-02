"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatMessage,
  MASCOT_ASSETS,
  CatBotTrigger,
  CatBotHeader,
  CatBotSuggestions,
  CatBotMessageList,
  CatBotInput,
} from "./catbot";

export function CatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isVideoDockedBottomRight, setIsVideoDockedBottomRight] =
    useState(false);
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
      setTooltipIndex((prev) => (prev + 1) % 4);
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
      {/* TRIGGER FLOATING BUTTON SEBELUM KLIK */}
      <CatBotTrigger
        isOpen={isOpen}
        isPageLoaded={isPageLoaded}
        effectiveBottom={effectiveBottom}
        tooltipIndex={tooltipIndex}
        onOpen={() => setIsOpen(true)}
      />

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
              sm:inset-auto sm:right-6 sm:w-100 sm:min-h-120 sm:max-h-170
              sm:rounded-3xl overflow-hidden bg-[#0a0a0a]
            `}
          >
            {/* Header */}
            <CatBotHeader
              botMood={botMood}
              onResetChat={handleResetChat}
              onClose={() => setIsOpen(false)}
            />

            {/* Area Balon Chat & Watermark */}
            <div className="relative flex-1 flex flex-col overflow-hidden bg-[#FFC000]">
              <CatBotMessageList
                messages={messages}
                isLoading={isLoading}
                botMood={botMood}
                messagesEndRef={messagesEndRef}
              />

              {/* Suggestions Accordion */}
              <CatBotSuggestions
                showSuggestions={showSuggestions}
                isSuggestionsOpen={isSuggestionsOpen}
                setIsSuggestionsOpen={setIsSuggestionsOpen}
                onSelectSuggestion={handleSendMessage}
              />
            </div>

            {/* Input Bar */}
            <CatBotInput
              inputText={inputText}
              setInputText={setInputText}
              isLoading={isLoading}
              inputRef={inputRef}
              onSendMessage={() => handleSendMessage()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CatBotWidget;
