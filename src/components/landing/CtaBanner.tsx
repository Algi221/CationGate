"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  // Blog / Resource cards specified in PRD
  const blogArticles = [
    {
      title: "How AI Personalization Boosts K-12 Student Retention",
      category: "Ed-Tech Insights",
      date: "July 28, 2026",
      desc: "Discover empirical strategies for deploying adaptive learning algorithms to keep students engaged.",
    },
    {
      title: "Streamlining Dapodik Compliance & School Telemetry",
      category: "School Administration",
      date: "July 24, 2026",
      desc: "A comprehensive guide for IT directors on automating state reporting without manual errors.",
    },
    {
      title: "The Future of AI Assessment & Academic Integrity",
      category: "AI & Assessment",
      date: "July 19, 2026",
      desc: "Balancing dynamic difficulty generation with robust web proctoring and anti-cheating protocols.",
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80">
      
      {/* Blog / Resource Section specified in PRD */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Knowledge Base
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Insights and Ed-Tech Best Practices
          </h2>

          <p className="text-slate-600 text-base font-medium">
            Explore articles and whitepapers written by top educational researchers and AI architects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogArticles.map((article, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3 text-slate-500 font-medium">
                  <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {article.category}
                  </span>
                  <span>{article.date}</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug hover:text-blue-600 transition-colors cursor-pointer">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {article.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner specified in PRD */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-blue-600 text-white p-8 sm:p-12 lg:p-14 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-white text-xs font-bold uppercase tracking-wider border border-blue-400/40">
              <Sparkles className="w-4 h-4" />
              Deploy In Minutes
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Join the Future of Education with CationGate.
            </h2>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium">
              Empower your teachers, engage your students, and transform learning outcomes with personalized AI.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-blue-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>30-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>

          <div className="z-10 flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <Link href="/daftar" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-blue-600 font-bold text-sm rounded-xl py-6 px-8 shadow-xs gap-2"
              >
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
