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
  Globe2
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
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      accentColor: "border-blue-200 hover:border-blue-400",
      btnBg: "bg-blue-600 hover:bg-blue-700",
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
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      accentColor: "border-teal-200 hover:border-teal-400",
      btnBg: "bg-teal-600 hover:bg-teal-700",
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
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      accentColor: "border-indigo-200 hover:border-indigo-400",
      btnBg: "bg-indigo-600 hover:bg-indigo-700",
      icon: LineChart,
    },
  ];

  return (
    <section id="capabilities" className="py-20 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Core Capabilities
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Core Educational Capabilities
          </h2>

          <p className="text-slate-600 text-base leading-relaxed font-medium">
            Empowering schools, academies, and universities with modern AI infrastructure for effective learning delivery.
          </p>
        </div>

        {/* 3 Core Capability Cards Specified in PRD */}
        <div className="grid md:grid-cols-3 gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl bg-white border ${item.accentColor} p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs font-bold text-blue-600 mb-3">
                    {item.tagline}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-6">
                    {item.desc}
                  </p>

                  {/* Sub-item Badges */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                    {item.subItems.map((sub, sIdx) => {
                      const SubIcon = sub.icon;
                      return (
                        <div key={sIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                          <SubIcon className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{sub.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Link href="#pricing" className="w-full">
                  <Button 
                    className={`w-full ${item.btnBg} text-white font-bold text-xs rounded-xl py-5 gap-1.5 shadow-2xs`}
                  >
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
