"use client";

import React, { useState } from "react";
import {
  Check,
  Zap,
  Sliders,
  TrendingUp,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FeaturesShowcase() {
  const [activeAdvantage, setActiveAdvantage] = useState(0);

  // The 4 Core Advantages specified in PRD
  const advantages = [
    {
      id: 0,
      title: "Efficiency",
      subtitle: "Automate 85% of Manual Lesson Planning",
      desc: "Save hundreds of administrative hours per teacher with automated grading, AI content synthesis, and instant report card exports.",
      icon: Zap,
      metric: "85% Time Saved",
    },
    {
      id: 1,
      title: "Customization",
      subtitle: "Personalized Adaptive Pathways for Every Student",
      desc: "Dynamically adjust content difficulty, pacing, and learning format based on individual student skill metrics and learning speed.",
      icon: Sliders,
      metric: "100% Adaptive",
    },
    {
      id: 2,
      title: "Proven Results",
      subtitle: "Empirically Verified Grade Improvement",
      desc: "Partner institutions report an average 32% increase in national exam scores and 4.2x higher student engagement rates.",
      icon: TrendingUp,
      metric: "+32% Exam Score",
    },
    {
      id: 3,
      title: "Accessibility",
      subtitle: "Multi-Platform Cloud Infrastructure",
      desc: "Accessible on desktop, tablet, or smartphone with low-bandwidth offline caching and multi-language support.",
      icon: Globe,
      metric: "99.99% SLA Uptime",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-background border-b border-border relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Secondary Content Block: Unlock Peak Academic Performance */}
        <div
          id="about"
          className="grid lg:grid-cols-12 gap-12 items-center bg-surface border border-border p-8 sm:p-12 rounded-2xl shadow-xs"
        >
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold border border-border">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              Empowering Modern Institutions
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight leading-tight">
              Unlock Peak Academic Performance
            </h2>

            <p className="text-body text-base leading-relaxed font-medium">
              Combine cutting-edge artificial intelligence with proven
              pedagogical strategies to elevate outcomes across your entire
              student body.
            </p>

            {/* Sub-points specified in PRD */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-background border border-border">
                <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-heading">
                    Personalized Pathways
                  </h4>
                  <p className="text-xs text-body font-medium">
                    Tailored learning maps engineered specifically for each
                    student's strengths and areas of growth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-background border border-border">
                <div className="w-6 h-6 rounded-lg bg-[#45C06B] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-heading">
                    Engaging, Tech-Driven Lessons
                  </h4>
                  <p className="text-xs text-body font-medium">
                    Interactive simulations, instant AI feedback, and gamified
                    mastery benchmarks.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link href="#pricing">
                <Button className="bg-primary hover:bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 py-5 text-xs shadow-xs gap-2">
                  <span>Deploy CationGate Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Visualization Card */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-xl bg-[#2A1B1D] text-white p-6 shadow-md space-y-4 font-mono text-xs border border-[#6F5041]">
              <div className="flex items-center justify-between pb-3 border-b border-white/20 text-white/75">
                <span>// CationGate Learning Engine Pipeline</span>
                <span className="text-[#45C06B] font-bold">STATUS: 200 OK</span>
              </div>

              <div className="space-y-2">
                <div className="text-[#8EC9F6] font-bold">
                  [STEP 1] Ingesting Student Baseline Telemetry...
                </div>
                <div className="text-white/80 pl-3">
                  ↳ StudentID: #CG-8921 | Mastery Level: 92% | Speed: 1.4x
                </div>
                <div className="text-[#FFD33B] font-bold">
                  [STEP 2] Generating Adaptive Lesson Module...
                </div>
                <div className="text-white/80 pl-3">
                  ↳ Subject: STEM Calculus II | Topic: Multivariable Derivatives
                </div>
                <div className="text-[#45C06B] font-bold">
                  [STEP 3] Optimizing Evaluation Quiz...
                </div>
                <div className="text-white/80 pl-3">
                  ↳ Difficulty Matrix: Scaled +15% | Proctoring Guard: ACTIVE
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-white/75">
                <span>Latency: 14ms</span>
                <span className="text-[#8EC9F6] font-bold">
                  AES-256 Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: The CationGate Advantage */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8EC9F6]/20 text-[#2A1B1D] text-xs font-bold border border-border">
              <Sparkles className="w-3.5 h-3.5 text-[#2A1B1D]" />
              Core Benefits
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
              The CationGate Advantage
            </h2>

            <p className="text-body text-base leading-relaxed font-medium">
              Why leading educational institutions trust CationGate to power
              their AI learning infrastructure.
            </p>
          </div>

          {/* 4 Advantage Benefit Cards Specified in PRD */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-surface border border-border shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold border border-border">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#45C06B] bg-[#45C06B]/10 px-2.5 py-0.5 rounded-md border border-border">
                        {adv.metric}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-heading mb-1">
                      {adv.title}
                    </h3>

                    <p className="text-xs font-bold text-primary mb-2">
                      {adv.subtitle}
                    </p>

                    <p className="text-xs text-body leading-relaxed font-medium">
                      {adv.desc}
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
