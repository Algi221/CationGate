"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles,
  BrainCircuit,
  BarChart3,
  BookOpenCheck,
  ShieldCheck,
  Users,
  Activity,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection({ onOpenVideo }: { onOpenVideo?: () => void }) {
  const [activeTab, setActiveTab] = useState<"analytics" | "lessons">(
    "analytics",
  );

  // Ditambahkan utility dark: pada properti color
  const featureOfferCards = [
    {
      title: "AI Lesson Gen",
      desc: "Instant curriculum-aligned lesson plans.",
      icon: BrainCircuit,
      badge: "AI Engine",
      color: "text-primary bg-primary/5 border-border",
      position: "top-[-15%] left-[-5%]",
      rotation: -6,
      floatY: -15,
      duration: 6,
    },
    {
      title: "Real-time Analytics",
      desc: "Live monitoring of student comprehension.",
      icon: BarChart3,
      badge: "Live Telemetry",
      color: "text-[#45C06B] bg-[#45C06B]/10 border-border",
      position: "top-[-10%] right-[-5%]",
      rotation: 3,
      floatY: -12,
      duration: 7,
    },
    {
      title: "Resource Market",
      desc: "100K+ verified STEM & coding modules.",
      icon: BookOpenCheck,
      badge: "Ed-Tech Library",
      color: "text-[#E86BC6] bg-[#E86BC6]/10 border-border",
      position: "bottom-[40%] left-[0%]",
      rotation: -3,
      floatY: -20,
      duration: 6.5,
    },
    {
      title: "Secure Tracking",
      desc: "AES-256 encryption & Dapodik compliance.",
      icon: ShieldCheck,
      badge: "ISO 27001",
      color: "text-[#8EC9F6] bg-[#8EC9F6]/10 border-border",
      position: "bottom-[40%] right-[-5%]",
      rotation: 6,
      floatY: -10,
      duration: 5.5,
    },
  ];

  return (
    <section
      id="hero"
      className="relative pt-12 overflow-hidden bg-background transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#8EC9F6]/40 dark:to-[#2A1B1D]/20 pointer-events-none" />

      {/* <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full aspect-square rounded-b-full bg-linear-to-t from-blue-500 via-blue-400/40 to-transparent blur-[20px] dark:from-blue-900 dark:via-blue-800/40 opacity-70 pointer-events-none" />
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square rounded-b-full bg-linear-to-t from-blue-500 via-blue-400/40 to-transparent blur-[20px] dark:from-blue-900 dark:via-blue-800/40 opacity-70 pointer-events-none" />
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full max-w-5xl aspect-square rounded-b-full bg-linear-to-t from-blue-400 via-blue-200 to-white/10 dark:from-blue-800 dark:via-blue-900/50 dark:to-transparent opacity-90 shadow-[0_-20px_60px_-15px_rgba(59,130,246,0.3)] pointer-events-none" /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center py-16">
        <div className="flex justify-center mb-8 ">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-primary text-xs font-semibold shadow-sm transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Next-Generation Ed-Tech SaaS Platform</span>
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
              v2.5 AI Release
            </span>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-heading tracking-tight leading-[1.12] transition-colors">
            CationGate: {""}
            <span className="text-primary bg-gradient-to-r from-[#8EC9F6] to-[#E86BC6] bg-clip-text text-transparent">
              Accelerating Learning
            </span>{" "}
            Through Personalized AI.
          </h1>

          <p className="text-body text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium transition-colors">
            Harness the power of tailored educational experiences, real-time
            analytics, and content-rich resources designed for modern K-12
            schools, academies, and universities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/demo/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary hover:bg-primary/90 text-white font-bold text-sm sm:text-base px-8 py-6 rounded-xl shadow-lg shadow-[#2A1B1D]/20 gap-2 group transition-all"
              >
                <Sparkles className="w-5 h-5 text-[#FFD33B] animate-pulse" />
                <span>Coba Demo Live</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <button
              onClick={onOpenVideo}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-border bg-surface hover:bg-background text-heading font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* --- FLOATING CARDS SECTION (Desktop) --- */}
        <div className="hidden lg:block relative w-full max-w-[1100px] h-[550px] mt-8">
          {/* Main Central Dashboard (Anchor) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md lg:max-w-[550px] z-10"
          >
            <div className="rounded-2xl bg-[#2A1B1D] backdrop-blur-sm border border-[#6F5041] shadow-2xl p-5 space-y-4 relative overflow-hidden transition-colors">
              {/* Console Top Window Control */}
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E86BC6]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFD33B]" />
                  <div className="w-3 h-3 rounded-full bg-[#45C06B]" />
                  <span className="text-xs font-bold text-white ml-2">
                    cationgate-ai-telemetry.console
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#45C06B] bg-[#45C06B]/10 px-2.5 py-0.5 rounded-md border border-[#45C06B]/40">
                  Live Stream Active
                </span>
              </div>

              {/* Interactive Console Tabs */}
              <div className="flex gap-2 bg-[#3A2A26] p-1 rounded-xl text-xs font-bold transition-colors">
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    activeTab === "analytics"
                      ? "bg-[#FFD33B] text-[#2A1B1D] shadow-2xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Real-Time Analytics
                </button>
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    activeTab === "lessons"
                      ? "bg-[#FFD33B] text-[#2A1B1D] shadow-2xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  AI Curriculum Engine
                </button>
              </div>

              {/* Tab 1: Real-time Telemetry */}
              {activeTab === "analytics" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#3A2A26] border border-white/20">
                      <div className="flex items-center justify-between text-[#FFD33B] mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-[#45C06B] bg-[#45C06B]/10 px-2 py-0.5 rounded">
                          +24% Active
                        </span>
                      </div>
                      <div className="text-2xl font-extrabold text-white">
                        42,890
                      </div>
                      <div className="text-[11px] text-white/70 font-semibold">
                        Active Learners Stream
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#3A2A26] border border-white/20">
                      <div className="flex items-center justify-between text-[#45C06B] mb-1">
                        <Cpu className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-[#FFD33B] bg-[#FFD33B]/10 px-2 py-0.5 rounded">
                          99.2% Score
                        </span>
                      </div>
                      <div className="text-2xl font-extrabold text-white">
                        1.8M
                      </div>
                      <div className="text-[11px] text-white/70 font-semibold">
                        AI Adaptive Nodes
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#3A2A26] border border-white/20 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">
                        Learning Pathway Comprehension Benchmark
                      </span>
                      <span className="text-[#FFD33B]">94.8% Target Matched</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F8F2E9]/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#FFD33B] w-[94.8%]" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    {
                      topic: "Advanced Calculus & Neural Graphs",
                      target: "Grade 11 - STEM Track",
                      speed: "Generated in 1.2s",
                      badge: "bg-primary/5 text-primary border-border",
                    },
                    {
                      topic: "Quantum Mechanics Interactive Simulation",
                      target: "Grade 12 - Physics",
                      speed: "Generated in 0.8s",
                      badge: "bg-[#45C06B]/10 text-[#45C06B] border-border",
                    },
                    {
                      topic: "Indonesian History Data Timeline OCR",
                      target: "Grade 10 - Humanities",
                      speed: "Generated in 1.4s",
                      badge: "bg-[#E86BC6]/10 text-[#E86BC6] border-border",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#3A2A26] border border-white/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">
                          {item.topic}
                        </div>
                        <div className="text-[11px] text-white/70 font-medium">
                          {item.target}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${item.badge}`}
                      >
                        {item.speed}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Status Bar */}
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FFD33B]" />
                  <span>Multi-Tenant Node Active</span>
                </div>
                <span className="text-[#FFD33B] font-bold">
                  CationGate Kernel v2.5
                </span>
              </div>
            </div>
          </motion.div>

          {/* Floating Feature Cards */}
          {featureOfferCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ rotate: card.rotation }}
                animate={{
                  y: [0, card.floatY, 0],
                  rotate: [card.rotation, card.rotation, card.rotation],
                }}
                transition={{
                  duration: card.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute w-64 p-5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:scale-105 transition-all z-20 ${card.position}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center font-bold border transition-colors`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-body bg-background px-2 py-0.5 rounded-md border border-border transition-colors">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-heading mb-1 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-body leading-relaxed font-medium transition-colors">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* --- MOBILE FALLBACK SECTION --- */}
        <div className="lg:hidden w-full max-w-md mx-auto mt-12 space-y-8">
          <div className="rounded-2xl bg-surface border border-border shadow-xl p-5 space-y-4 relative overflow-hidden transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E86BC6]" />
                <div className="w-3 h-3 rounded-full bg-[#FFD33B]" />
                <div className="w-3 h-3 rounded-full bg-[#45C06B]" />
                <span className="text-xs font-bold text-heading ml-2">
                  cationgate-ai-telemetry.console
                </span>
              </div>
            </div>

            <div className="flex gap-2 bg-background p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === "analytics"
                    ? "bg-surface text-primary shadow-2xs"
                    : "text-body hover:text-heading"
                }`}
              >
                Real-Time Analytics
              </button>
              <button
                onClick={() => setActiveTab("lessons")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === "lessons"
                    ? "bg-surface text-primary shadow-2xs"
                    : "text-body hover:text-heading"
                }`}
              >
                AI Curriculum Engine
              </button>
            </div>

            {activeTab === "analytics" ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-background border border-border">
                    <div className="flex items-center justify-between text-primary mb-1">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-extrabold text-heading">
                      42,890
                    </div>
                    <div className="text-[10px] text-body font-semibold">
                      Active Learners Stream
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-background border border-border">
                    <div className="flex items-center justify-between text-[#45C06B] mb-1">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-extrabold text-heading">
                      1.8M
                    </div>
                    <div className="text-[10px] text-body font-semibold">
                      AI Adaptive Nodes
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-heading">Benchmark Match</span>
                    <span className="text-primary">94.8%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-background overflow-hidden">
                    <div className="h-full rounded-full bg-primary w-[94.8%]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  {
                    topic: "Advanced Calculus & Neural Graphs",
                    target: "Grade 11 - STEM Track",
                    speed: "1.2s",
                    badge: "bg-primary/5 text-primary border-border",
                  },
                  {
                    topic: "Quantum Mechanics Simulation",
                    target: "Grade 12 - Physics",
                    speed: "0.8s",
                    badge: "bg-[#45C06B]/10 text-[#45C06B] border-border",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-background border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-heading truncate max-w-[150px]">
                        {item.topic}
                      </div>
                      <div className="text-[10px] text-body font-medium">
                        {item.target}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-1 rounded-md border ${item.badge}`}
                    >
                      {item.speed}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {featureOfferCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface/40 border border-border shadow-sm flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center font-bold border`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-body bg-background px-2.5 py-0.5 rounded-md border border-border">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-heading mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-xs text-body leading-relaxed font-medium">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
