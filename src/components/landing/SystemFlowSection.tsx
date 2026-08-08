"use client";

import React, { useState } from "react";
import {
  Clock,
  BrainCircuit,
  ChevronDown,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Sliders,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SystemFlowSection() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // 3 Detailed Accordions specified in PRD
  const serviceBreakdowns = [
    {
      title: "Smart Content Generation",
      desc: "Automatically synthesize lesson plans, interactive slide decks, and reading modules customized to national curriculum requirements in seconds.",
      features: [
        "Curriculum Standards Mapping",
        "Multi-Language Support",
        "Interactive Diagram Synthesis",
      ],
    },
    {
      title: "Adaptive Learning Paths",
      desc: "Algorithmic adjustment of student learning tracks based on real-time quiz performance, reading speed, and concept retentiveness.",
      features: [
        "Dynamic Difficulty Scaling",
        "Remediation Auto-Assignment",
        "Enrichment Modules",
      ],
    },
    {
      title: "Advanced Teacher Dashboard",
      desc: "Centralized command center giving educators total visibility over classroom progress, grading queues, and automated Dapodik exports.",
      features: [
        "Single-Click Grade Exports",
        "Early Warning Dropout Indicators",
        "Parent Progress Portal Sync",
      ],
    },
  ];

  // CationGate Platform Workflow / Schedule specified in PRD
  const workflowSchedule = [
    {
      time: "08:00 AM",
      phase: "Content Selection",
      desc: "Teacher selects learning goals; CationGate AI generates tailored lesson modules & slides.",
      status: "AI Ready",
      color: "bg-[#8EC9F6]/25 text-[#2A1B1D] border-[#8EC9F6]",
    },
    {
      time: "09:30 AM",
      phase: "Class Delivery",
      desc: "Students complete interactive lessons & adaptive exercises on desktop/tablets.",
      status: "Live Stream",
      color: "bg-[#45C06B]/20 text-[#45C06B] border-[#45C06B]",
    },
    {
      time: "01:00 PM",
      phase: "Analytics Review",
      desc: "Teacher inspects real-time telemetry dashboard to spot skill gaps & student velocity.",
      status: "Telemetry Active",
      color: "bg-[#E86BC6]/20 text-[#E86BC6] border-[#E86BC6]",
    },
    {
      time: "03:30 PM",
      phase: "Assessment Generation",
      desc: "CationGate auto-grades assessments & dispatches diagnostic reports to parents & Dapodik.",
      status: "Completed",
      color: "bg-[#45C06B]/20 text-[#45C06B] border-[#45C06B]",
    },
  ];

  return (
    <section className="py-20 bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Part 1: Detailed Service Breakdown Accordions */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8EC9F6]/20 text-[#2A1B1D] text-xs font-bold border border-border">
              <BrainCircuit className="w-3.5 h-3.5 text-[#2A1B1D]" />
              Detailed Breakdown
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
              Deep-Dive Into The AI Experience
            </h2>

            <p className="text-body text-base leading-relaxed font-medium">
              Explore how CationGate powers smart content generation, adaptive
              learning paths, and teacher telemetry.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Accordions */}
            <div className="lg:col-span-7 space-y-3">
              {serviceBreakdowns.map((service, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-200 shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between font-extrabold text-base text-heading hover:text-primary transition-colors cursor-pointer"
                    >
                      <span>{service.title}</span>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${isOpen ? "rotate-180 bg-[#FFD33B]/30 text-primary" : "bg-background text-body"}`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 space-y-3 text-xs sm:text-sm text-body leading-relaxed border-t border-border pt-3 font-medium">
                        <p>{service.desc}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {service.features.map((f, fIdx) => (
                            <span
                              key={fIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-background text-heading text-xs font-semibold border border-border"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                              <span>{f}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#2A1B1D] text-white space-y-4 shadow-md border border-border">
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <span className="text-xs font-mono text-white/70">
                  CationGate Architecture Spec
                </span>
                <span className="text-xs font-bold text-[#45C06B]">
                  High Reliability
                </span>
              </div>
              <div className="text-xs leading-relaxed space-y-2 text-white/80">
                <p>
                  ✓ Microservices Architecture running on isolated tenant nodes.
                </p>
                <p>✓ Sub-second latency for dynamic quiz evaluation.</p>
                <p>✓ Automated backup and instant rollback capabilities.</p>
              </div>
              <div className="pt-2">
                <Link href="#pricing">
                  <Button
                    size="sm"
                    className="w-full bg-[#FFD33B] hover:bg-[#F3C625] text-[#2A1B1D] font-bold text-xs rounded-xl py-4"
                  >
                    Request Full Technical Whitepaper
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: CationGate Platform Schedule / Workflow Sequence in Action */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#45C06B]/20 text-[#45C06B] text-xs font-bold border border-border">
              <Clock className="w-3.5 h-3.5 text-[#45C06B]" />
              Daily Workflow Journey
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
              A Day In The Life With CationGate
            </h2>

            <p className="text-body text-base leading-relaxed font-medium">
              See how educators and students interact with CationGate throughout
              a typical academic schedule.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface border border-border shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-extrabold font-mono text-heading bg-background px-3 py-1 rounded-lg border border-border">
                      {item.time}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${item.color}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-heading mb-2">
                    {item.phase}
                  </h3>

                  <p className="text-xs text-body leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border text-[11px] font-bold text-primary">
                  Step {idx + 1} of 4 Complete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
