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
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection({ onOpenVideo }: { onOpenVideo?: () => void }) {
  const [activeTab, setActiveTab] = useState<"analytics" | "lessons">("analytics");

  // Ditambahkan utility dark: pada properti color
  const featureOfferCards = [
    {
      title: "AI Lesson Gen",
      desc: "Instant curriculum-aligned lesson plans.",
      icon: BrainCircuit,
      badge: "AI Engine",
      color: "text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800",
      position: "top-[-15%] left-[-5%]",
      rotation: -6,
      floatY: -15,
      duration: 6
    },
    {
      title: "Real-time Analytics",
      desc: "Live monitoring of student comprehension.",
      icon: BarChart3,
      badge: "Live Telemetry",
      color: "text-teal-600 bg-teal-50 border-teal-100 dark:text-teal-400 dark:bg-teal-900/30 dark:border-teal-800",
      position: "top-[-10%] right-[-5%]",
      rotation: 3,
      floatY: -12,
      duration: 7
    },
    {
      title: "Resource Market",
      desc: "100K+ verified STEM & coding modules.",
      icon: BookOpenCheck,
      badge: "Ed-Tech Library",
      color: "text-indigo-600 bg-indigo-50 border-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30 dark:border-indigo-800",
      position: "bottom-[40%] left-[0%]",
      rotation: -3,
      floatY: -20,
      duration: 6.5
    },
    {
      title: "Secure Tracking",
      desc: "AES-256 encryption & Dapodik compliance.",
      icon: ShieldCheck,
      badge: "ISO 27001",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-800",
      position: "bottom-[40%] right-[-5%]",
      rotation: 6,
      floatY: -10,
      duration: 5.5
    },
  ];

  return (
    <section id="hero" className="relative pt-12 overflow-hidden bg-[#FAF8F2] transition-colors duration-300">
      
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-blue-100/50 dark:to-blue-900/20 pointer-events-none" />


      {/* <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full aspect-square rounded-b-full bg-linear-to-t from-blue-500 via-blue-400/40 to-transparent blur-[20px] dark:from-blue-900 dark:via-blue-800/40 opacity-70 pointer-events-none" />
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square rounded-b-full bg-linear-to-t from-blue-500 via-blue-400/40 to-transparent blur-[20px] dark:from-blue-900 dark:via-blue-800/40 opacity-70 pointer-events-none" />
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full max-w-5xl aspect-square rounded-b-full bg-linear-to-t from-blue-400 via-blue-200 to-white/10 dark:from-blue-800 dark:via-blue-900/50 dark:to-transparent opacity-90 shadow-[0_-20px_60px_-15px_rgba(59,130,246,0.3)] pointer-events-none" /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center py-16">
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-semibold shadow-sm transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Next-Generation Ed-Tech SaaS Platform</span>
            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
              v2.5 AI Release
            </span>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] transition-colors">
            CationGate: {""}
            <span className="text-blue-600 dark:text-blue-500 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Accelerating Learning
            </span>{" "}
            Through Personalized AI.
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium transition-colors">
            Harness the power of tailored educational experiences, real-time analytics, and content-rich resources designed for modern K-12 schools, academies, and universities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/demo/dashboard" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-sm sm:text-base px-8 py-6 rounded-xl shadow-lg shadow-blue-600/20 gap-2 group transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>Coba Demo Live</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <button 
              onClick={onOpenVideo}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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
            <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 relative overflow-hidden transition-colors">
                
              {/* Console Top Window Control */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    cationgate-ai-telemetry.console
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  Live Stream Active
                </span>
              </div>

              {/* Interactive Console Tabs */}
              <div className="flex gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl text-xs font-bold transition-colors">
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    activeTab === "analytics"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Real-Time Analytics
                </button>
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    activeTab === "lessons"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  AI Curriculum Engine
                </button>
              </div>

              {/* Tab 1: Real-time Telemetry */}
              {activeTab === "analytics" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">+24% Active</span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">42,890</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Active Learners Stream</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center justify-between text-teal-600 dark:text-teal-400 mb-1">
                        <Cpu className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">99.2% Score</span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">1.8M</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">AI Adaptive Nodes</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200">Learning Pathway Comprehension Benchmark</span>
                      <span className="text-blue-600 dark:text-blue-400">94.8% Target Matched</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500 w-[94.8%]" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { topic: "Advanced Calculus & Neural Graphs", target: "Grade 11 - STEM Track", speed: "Generated in 1.2s", badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
                    { topic: "Quantum Mechanics Interactive Simulation", target: "Grade 12 - Physics", speed: "Generated in 0.8s", badge: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800" },
                    { topic: "Indonesian History Data Timeline OCR", target: "Grade 10 - Humanities", speed: "Generated in 1.4s", badge: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.topic}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{item.target}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${item.badge}`}>
                        {item.speed}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Status Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Multi-Tenant Node Active</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-bold">CationGate Kernel v2.5</span>
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
                  rotate: [card.rotation, card.rotation, card.rotation]
                }}
                transition={{ 
                  duration: card.duration, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className={`absolute w-64 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] hover:scale-105 transition-all z-20 ${card.position}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center font-bold border transition-colors`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium transition-colors">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* --- MOBILE FALLBACK SECTION --- */}
        <div className="lg:hidden w-full max-w-md mx-auto mt-12 space-y-8">
          
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-5 space-y-4 relative overflow-hidden transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                  cationgate-ai-telemetry.console
                </span>
              </div>
            </div>

            <div className="flex gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === "analytics"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Real-Time Analytics
              </button>
              <button
                onClick={() => setActiveTab("lessons")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === "lessons"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                AI Curriculum Engine
              </button>
            </div>

            {activeTab === "analytics" ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white">42,890</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Active Learners Stream</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center justify-between text-teal-600 dark:text-teal-400 mb-1">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white">1.8M</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">AI Adaptive Nodes</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">Benchmark Match</span>
                    <span className="text-blue-600 dark:text-blue-400">94.8%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500 w-[94.8%]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  { topic: "Advanced Calculus & Neural Graphs", target: "Grade 11 - STEM Track", speed: "1.2s", badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
                  { topic: "Quantum Mechanics Simulation", target: "Grade 12 - Physics", speed: "0.8s", badge: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{item.topic}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.target}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${item.badge}`}>
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
                <div key={idx} className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center font-bold border`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">{card.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{card.desc}</p>
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