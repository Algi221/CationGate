"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import ScrollExpandSection  from "@/components/landing/ScrollExpandSection";
import HeroSection from "@/components/landing/HeroSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { SystemFlowSection } from "@/components/landing/SystemFlowSection";
import HeroPPDB from "@/components/landing/HeroSection";
import SimGymSection from "@/components/landing/SimGymSection"; 
import { TestimonialsSection } from "@/components/landing";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { VideoModal } from "@/components/landing/VideoModal";
import { FloatingVideoWidget } from "@/components/landing/FloatingVideoWidget";
import LoadingScreen from "@/components/landing/LoadingScreen";
import { ContactScreen } from "@/components/landing/ContactScreen";
import { AboutSection } from "@/components/landing/AboutSection";

const VIDEO_COLLECTION = {
  trailerAnime: "https://www.youtube-nocookie.com/embed/1FcVJxxPWh4",
  videoLama: "https://www.youtube-nocookie.com/embed/VIDEO_LAMA_ID_DISINI",
  rickroll: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
};

export default function LandingPage() {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col relative overflow-x-clip">
      <LoadingScreen />
      <Navbar />

      <main className="flex-1">
        {/* <ScrollExpandSection/> */}
        <HeroPPDB />
        <PartnersSection/>
        <AboutSection/>
        <SystemFlowSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <ContactScreen /> 
      </main>

      <CinematicFooter />

      <FloatingVideoWidget
        onClick={() => setActiveVideoUrl(VIDEO_COLLECTION.trailerAnime)}
      />

      <VideoModal
        isOpen={activeVideoUrl !== null}
        videoUrl={activeVideoUrl}
        onClose={() => setActiveVideoUrl(null)}
      />
    </div>
  );
}