"use client";

import React, { useState } from "react";
import LoadingScreen from "@/components/landing/LoadingScreen";
import { Navbar } from "@/components/landing/Navbar";
import ScrollExpandSection  from "@/components/landing/ScrollExpandSection";
import HeroSection from "@/components/landing/HeroSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { SystemFlowSection } from "@/components/landing/SystemFlowSection";

// 1. TAMBAHAN BARU: Import komponen SimGymSection yang baru dibuat
import SimGymSection from "@/components/landing/SimGymSection"; 

import { RegionalStatsSection } from "@/components/landing/RegionalStatsSection";
import { SuccessStorySection } from "@/components/landing/SuccessStorySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";
import { VideoModal } from "@/components/landing/VideoModal";
import { FloatingVideoWidget } from "@/components/landing/FloatingVideoWidget";

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
        <ScrollExpandSection/>
        <HeroSection onOpenVideo={() => setActiveVideoUrl(VIDEO_COLLECTION.trailerAnime)} />
        {/* <HeroSection
          onOpenVideo={() => setActiveVideoUrl(VIDEO_COLLECTION.rickroll)}
        /> */}
        {/* <PartnersSection /> */}
        {/* <FeaturesShowcase /> */}
        {/* <SystemFlowSection /> */}
        {/* <RegionalStatsSection /> */}

        {/* UBAH DISINI JUGA JIKA INGIN RICKROLL: Ganti videoLama menjadi rickroll */}
        {/* <FeaturesShowcase /> */}
        <SystemFlowSection />
        <SimGymSection /> {/* PANGGIL KOMPONEN SIMGYM DI SINI */}
        {/* <RegionalStatsSection /> */}
        <SuccessStorySection
          onOpenVideo={() => setActiveVideoUrl(VIDEO_COLLECTION.rickroll)}
        />
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </main>

      <Footer />

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