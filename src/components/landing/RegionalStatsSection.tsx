"use build";
"use client";

import React from "react";
import {
  Users,
  BookOpen,
  Database,
  Award,
  Activity,
  Globe2,
} from "lucide-react";

export function RegionalStatsSection() {
  // 4 Metric Cards specified in PRD
  const metrics = [
    {
      label: "Student Base",
      value: "420,000+",
      sub: "Active Learners Enrolled",
      badge: "K-12 & Higher Ed",
      icon: Users,
      color: "text-[#8EC9F6] bg-[#8EC9F6]/10 border-[#8EC9F6]",
    },
    {
      label: "Courses Offered",
      value: "1,250+",
      sub: "Adaptive STEM & Humanities Modules",
      badge: "Curriculum Aligned",
      icon: BookOpen,
      color: "text-[#FFD33B] bg-[#FFD33B]/10 border-[#FFD33B]",
    },
    {
      label: "Data Points Processed",
      value: "1.8B+",
      sub: "Real-time Telemetry Data Points / Day",
      badge: "Sub-Second Ingestion",
      icon: Database,
      color: "text-[#E86BC6] bg-[#E86BC6]/10 border-[#E86BC6]",
    },
    {
      label: "Success Rate",
      value: "99.4%",
      sub: "National Exam Mastery Benchmark",
      badge: "Verified Impact",
      icon: Award,
      color: "text-[#45C06B] bg-[#45C06B]/10 border-[#45C06B]",
    },
  ];

  return (
    <section className="py-20 bg-[#2A1B1D] text-white relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD33B]/20 text-[#FFD33B] text-xs font-bold border border-[#FFD33B]/60">
            <Activity className="w-3.5 h-3.5 text-[#FFD33B]" />
            Data & Insights
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Measured Impact At Scale
          </h2>

          <p className="text-white/75 text-base leading-relaxed font-medium">
            Empirical data driving educational transformation across thousands
            of active institutions.
          </p>
        </div>

        {/* 4 Metric Cards Grid Specified in PRD */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/10 border border-white/30 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FFD33B]/20 border border-[#FFD33B]/30 text-[#FFD33B] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-white border border-white/30">
                      {m.badge}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {m.value}
                  </div>

                  <h3 className="text-sm font-bold text-[#8EC9F6] mb-1">
                    {m.label}
                  </h3>

                  <p className="text-xs text-white/75 font-medium">{m.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
