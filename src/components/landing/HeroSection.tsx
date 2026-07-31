"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  BrainCircuit, 
  BarChart3, 
  BookOpenCheck, 
  ShieldCheck, 
  CheckCircle2,
  Users,
  Activity,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection({ onOpenVideo }: { onOpenVideo?: () => void }) {
  const [activeTab, setActiveTab] = useState<"analytics" | "lessons">("analytics");

  // 4 Feature / Offer Cards specified in PRD
  const featureOfferCards = [
    {
      title: "AI-Powered Lesson Generation",
      desc: "Instant curriculum-aligned lesson plans tailored to learner profiles.",
      icon: BrainCircuit,
      badge: "AI Engine",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Real-time Student Analytics",
      desc: "Live monitoring of student comprehension, speed, and focus benchmarks.",
      icon: BarChart3,
      badge: "Live Telemetry",
      color: "text-teal-600 bg-teal-50 border-teal-100",
    },
    {
      title: "Curated Resource Marketplace",
      desc: "100,000+ verified STEM, humanities, and coding modules ready to deploy.",
      icon: BookOpenCheck,
      badge: "Ed-Tech Library",
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Secure Data & Progress Tracking",
      desc: "Enterprise-grade AES-256 encryption & Dapodik Kemendikbud compliance.",
      icon: ShieldCheck,
      badge: "ISO 27001",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <section id="hero" className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
      
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Generation Ed-Tech SaaS Platform</span>
            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
              v2.5 AI Release
            </span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              CationGate: <br />
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Accelerating Learning
              </span>{" "}
              Through Personalized AI.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Harness the power of tailored educational experiences, real-time analytics, and content-rich resources designed for modern K-12 schools, academies, and universities.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-7 py-6 rounded-xl shadow-sm gap-2 group transition-all"
                >
                  <span>Discover Your Plan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <button 
                onClick={onOpenVideo}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm shadow-2xs transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Quick Proof Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4 text-xs font-semibold text-slate-600 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Personalization Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Downtime SLA</span>
              </div>
            </div>

          </div>

          {/* Right Column: Modern Tech Dashboard Illustration */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Console Frame */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-5 space-y-4 relative overflow-hidden">
                
                {/* Console Top Window Control */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      cationgate-ai-telemetry.console
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Live Stream Active
                  </span>
                </div>

                {/* Interactive Console Tabs */}
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      activeTab === "analytics"
                        ? "bg-white text-blue-600 shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Real-Time Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab("lessons")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      activeTab === "lessons"
                        ? "bg-white text-blue-600 shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    AI Curriculum Engine
                  </button>
                </div>

                {/* Tab 1: Real-time Telemetry */}
                {activeTab === "analytics" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center justify-between text-blue-600 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">+24% Active</span>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">42,890</div>
                        <div className="text-[11px] text-slate-500 font-semibold">Active Learners Stream</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center justify-between text-teal-600 mb-1">
                          <Cpu className="w-4 h-4" />
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">99.2% Score</span>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">1.8M</div>
                        <div className="text-[11px] text-slate-500 font-semibold">AI Adaptive Nodes</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">Learning Pathway Comprehension Benchmark</span>
                        <span className="text-blue-600">94.8% Target Matched</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-600 w-[94.8%]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[
                      { topic: "Advanced Calculus & Neural Graphs", target: "Grade 11 - STEM Track", speed: "Generated in 1.2s", badge: "bg-blue-50 text-blue-700 border-blue-200" },
                      { topic: "Quantum Mechanics Interactive Simulation", target: "Grade 12 - Physics", speed: "Generated in 0.8s", badge: "bg-teal-50 text-teal-700 border-teal-200" },
                      { topic: "Indonesian History Data Timeline OCR", target: "Grade 10 - Humanities", speed: "Generated in 1.4s", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{item.topic}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{item.target}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${item.badge}`}>
                          {item.speed}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Status Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Multi-Tenant Node Active</span>
                  </div>
                  <span className="text-blue-600 font-bold">CationGate Kernel v2.5</span>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* 4 Core Value Cards Grid (PRD Spec) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureOfferCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center font-bold border`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
