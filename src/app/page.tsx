"use client";

import React, { useState } from "react";
// 1. TAMBAHAN BARU: Import komponen LoadingScreen
// Pastikan path-nya sesuai dengan tempat kamu menyimpan file LoadingScreen.jsx/tsx
import LoadingScreen from "@/components/landing/LoadingScreen";

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
import { FloatingVideoWidget } from "@/components/landing/FloatingVideoWidget";

// BIKIN KAMUS VIDEO DI SINI BIAR RAPI
const VIDEO_COLLECTION = {
  // Ini link yang BENAR untuk iframe (The Fragrant Flower Blooms With Dignity)
  trailerAnime: "https://www.youtube-nocookie.com/embed/1FcVJxxPWh4",

  // Nanti ganti ID ini dengan video presentasi aslimu
  videoLama: "https://www.youtube-nocookie.com/embed/VIDEO_LAMA_ID_DISINI",

  // Kalau sewaktu-waktu mau pasang jebakan Rickroll lagi
  rickroll: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
};

export default function LandingPage() {
  // Menyimpan URL video yang sedang aktif
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col relative overflow-hidden">
      {/* 2. TAMBAHAN BARU: Pasang LoadingScreen di paling atas */}
      <LoadingScreen />

      <Navbar />

      <main className="flex-1">
        {/* UBAH DISINI: Ganti videoLama menjadi rickroll */}
        <HeroSection
          onOpenVideo={() => setActiveVideoUrl(VIDEO_COLLECTION.rickroll)}
        />

        <PartnersSection />
        {/* <FeaturesShowcase /> */}
        {/* <SystemFlowSection /> */}
        {/* <RegionalStatsSection /> */}

        {/* UBAH DISINI JUGA JIKA INGIN RICKROLL: Ganti videoLama menjadi rickroll */}
        <SuccessStorySection
          onOpenVideo={() => setActiveVideoUrl(VIDEO_COLLECTION.rickroll)}
        />

        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </main>

      <Footer />

      {/* Widget memanggil video trailer anime */}
      <FloatingVideoWidget
        onClick={() => setActiveVideoUrl(VIDEO_COLLECTION.trailerAnime)}
      />

      {/* 
        VideoModal menerima props `videoUrl`. 
        isOpen = true jika activeVideoUrl tidak null
      */}
      <VideoModal
        isOpen={activeVideoUrl !== null}
        videoUrl={activeVideoUrl} // Kirim url-nya kesini
        onClose={() => setActiveVideoUrl(null)}
      />
    </div>
  );
}
