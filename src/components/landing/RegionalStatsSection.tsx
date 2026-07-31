"use build";
"use client";

import React from "react";
import { Users, BookOpen, Database, Award, Activity, Globe2 } from "lucide-react";

export function RegionalStatsSection() {
  // 4 Metric Cards specified in PRD
  const metrics = [
    {
      label: "Student Base",
      value: "420,000+",
      sub: "Active Learners Enrolled",
      badge: "K-12 & Higher Ed",
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Courses Offered",
      value: "1,250+",
      sub: "Adaptive STEM & Humanities Modules",
      badge: "Curriculum Aligned",
      icon: BookOpen,
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      label: "Data Points Processed",
      value: "1.8B+",
      sub: "Real-time Telemetry Data Points / Day",
      badge: "Sub-Second Ingestion",
      icon: Database,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      label: "Success Rate",
      value: "99.4%",
      sub: "National Exam Mastery Benchmark",
      badge: "Verified Impact",
      icon: Award,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-900/60 text-blue-300 text-xs font-bold border border-blue-700/50">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            Data & Insights
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Measured Impact At Scale
          </h2>

          <p className="text-slate-300 text-base leading-relaxed font-medium">
            Empirical data driving educational transformation across thousands of active institutions.
          </p>
        </div>

        {/* 4 Metric Cards Grid Specified in PRD */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${m.color} flex items-center justify-center font-bold border`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-700 text-slate-300 border border-slate-600">
                      {m.badge}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {m.value}
                  </div>

                  <h3 className="text-sm font-bold text-blue-400 mb-1">
                    {m.label}
                  </h3>

                  <p className="text-xs text-slate-400 font-medium">
                    {m.sub}
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
