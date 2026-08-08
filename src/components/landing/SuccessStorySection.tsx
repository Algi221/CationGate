"use client";

import React from "react";
import {
  ArrowRight,
  Play,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SuccessStorySection({
  onOpenVideo,
}: {
  onOpenVideo: () => void;
}) {
  return (
    <section className="py-16 bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Book A Call / Demo CTA Box specified in PRD */}
        <div className="rounded-2xl bg-[#2A1B1D] text-white p-8 sm:p-12 lg:p-14 shadow-xl border border-[#2A1B1D] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD33B]/20 text-[#FFD33B] border border-[#FFD33B]/40 text-xs font-bold uppercase tracking-wider">
              <CalendarCheck className="w-4 h-4" />
              1-on-1 Consultation
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Ready to Transform Your School's Learning Experience?
            </h2>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-medium">
              Schedule a personalized walkthrough with our Ed-Tech specialists.
              Learn how CationGate integrates seamlessly with your existing
              curriculum and Dapodik setup.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-white/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#45C06B]" />
                <span>30-Minute Live Demo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#45C06B]" />
                <span>Custom Architecture Review</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="z-10 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Link href="#pricing" className="w-full">
              <Button
                size="lg"
                className="w-full bg-[#FFD33B] hover:bg-[#F3C625] text-[#2A1B1D] font-bold text-sm rounded-xl py-6 px-8 shadow-xs gap-2"
              >
                <span>Book A Personalized Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <button
              onClick={onOpenVideo}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#8EC9F6]" />
              <span>Watch Platform Overview (3m)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
