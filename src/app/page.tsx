"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { SystemFlowSection } from "@/components/landing/SystemFlowSection";
import { RegionalStatsSection } from "@/components/landing/RegionalStatsSection";
import { SuccessStorySection } from "@/components/landing/SuccessStorySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";
import { VideoModal } from "@/components/landing/VideoModal";

export default function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col relative">
      
      {/* Top Header Bar */}
      <Navbar />

      {/* Main Ed-Tech SaaS Content Flow */}
      <main className="flex-1">
        {/* 1. Hero Section & 4 Feature Offer Cards */}
        <HeroSection onOpenVideo={() => setIsVideoOpen(true)} />

        {/* 2. Core Capabilities (Content Library, Assessments, Progress Dashboard) */}
        <PartnersSection />

        {/* 3. Secondary Content Block (Unlock Peak Performance) & The CationGate Advantage */}
        <FeaturesShowcase />

        {/* 4. Detailed Service List (3 Accordions) & Daily Workflow Schedule */}
        <SystemFlowSection />

        {/* 5. Data & Insights Metric Cards */}
        <RegionalStatsSection />

        {/* 6. Book A Call / Demo CTA Box */}
        <SuccessStorySection onOpenVideo={() => setIsVideoOpen(true)} />

        {/* 7. The Minds Behind the Technology (Team) & Verified Testimonials Grid */}
        <TestimonialsSection />

        {/* 8. Transparent SaaS Pricing & Plans */}
        <PricingSection />

        {/* 9. Ed-Tech Platform FAQ */}
        <FaqSection />

        {/* 10. Insights & Ed-Tech Best Practices (Blog) & Bottom CTA Banner */}
        <CtaBanner />
      </main>

      {/* Modern SaaS Footer */}
      <Footer />

      {/* Video Demo Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

    </div>
  );
}
