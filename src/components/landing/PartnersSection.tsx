"use client";

import React from "react";
import {
  Library,
  FileCheck2,
  LineChart,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calculator,
  Microscope,
  Globe2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PartnersSection() {
  const capabilities = [
    {
      title: "Curated Content Library",
      tagline: "Comprehensive STEM, Humanities & Vocational Modules",
      desc: "Instant access to 100,000+ curriculum-mapped learning objects, interactive labs, and multi-language study materials.",
      badge: "Resource Repository",
      subItems: [
        { label: "Mathematics & Statistics", icon: Calculator },
        { label: "Physical & Natural Sciences", icon: Microscope },
        { label: "Global Languages & Literature", icon: Globe2 },
      ],
      badgeColor: "bg-[#8EC9F6]/20 text-[#2A1B1D] border-border",
      accentColor: "border-border hover:border-[#8EC9F6]",
      btnBg: "bg-primary hover:bg-[#F3C625]",
      icon: Library,
    },
    {
      title: "Adaptive Learning Assessments",
      tagline: "AI Quiz Generation & Anti-Cheating Proctoring",
      desc: "Generate automated, difficulty-scaling tests with automated grading, web proctoring, and instant diagnostic feedback.",
      badge: "Automated Evaluation",
      subItems: [
        { label: "Adaptive Difficulty Scaling", icon: FileCheck2 },
        { label: "Automated Scoring Engine", icon: Sparkles },
        { label: "Webcam & Tab Proctoring", icon: BookOpen },
      ],
      badgeColor: "bg-[#45C06B]/20 text-[#45C06B] border-border",
      accentColor: "border-border hover:border-[#45C06B]",
      btnBg: "bg-[#45C06B] hover:bg-[#317C45]",
      icon: FileCheck2,
    },
    {
      title: "Real-Time Progress Dashboard",
      tagline: "Telemetry Insights for Teachers & Parents",
      desc: "Single-pane dashboard visualizing student progress, skill gaps, learning velocity, and Dapodik export metrics.",
      badge: "Predictive Analytics",
      subItems: [
        { label: "Classroom Velocity Tracking", icon: LineChart },
        { label: "Skill Mastery Heatmaps", icon: Sparkles },
        { label: "Automated Weekly Reports", icon: Library },
      ],
      badgeColor: "bg-[#E86BC6]/20 text-[#E86BC6] border-border",
      accentColor: "border-border hover:border-[#E86BC6]",
      btnBg: "bg-[#E86BC6] hover:bg-[#B85A9F]",
      icon: LineChart,
    },
  ];

  return (
    <section
      id="capabilities"
      className="py-20 bg-background border-b border-border relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8EC9F6]/20 text-[#2A1B1D] text-xs font-bold border border-border">
            <Sparkles className="w-3.5 h-3.5 text-[#2A1B1D]" />
            Core Capabilities
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
            Our Core Educational Capabilities
          </h2>

          <p className="text-body text-base leading-relaxed font-medium">
            Empowering schools, academies, and universities with modern AI
            infrastructure for effective learning delivery.
          </p>
        </div>

        {/* 3 Core Capability Cards Specified in PRD */}
        <div className="grid md:grid-cols-3 gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl bg-surface border border-border p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-background text-[#2A1B1D] flex items-center justify-center border border-border">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-md border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-heading mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs font-bold text-primary mb-3">
                    {item.tagline}
                  </p>

                  <p className="text-xs text-body leading-relaxed font-medium mb-6">
                    {item.desc}
                  </p>

                  {/* Sub-item Badges */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-border">
                    {item.subItems.map((sub, sIdx) => {
                      const SubIcon = sub.icon;
                      return (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 text-xs font-semibold text-heading bg-background p-2.5 rounded-lg border border-border"
                        >
                          <SubIcon className="w-4 h-4 text-primary shrink-0" />
                          <span>{sub.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Link href="#pricing" className="w-full">
                  <Button className="w-full bg-primary hover:bg-[#F3C625] text-white font-bold text-xs rounded-xl py-5 gap-1.5 shadow-2xs">
                    <span>Explore {item.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
