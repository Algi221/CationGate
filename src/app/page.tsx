"use client";

import React, { useState } from "react";
import LoadingScreen from "@/components/landing/LoadingScreen";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
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
    <div className="min-h-screen bg-background text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col relative overflow-hidden">
      <LoadingScreen />

      <Navbar />

      <main className="flex-1">
        <HeroSection
          onOpenVideo={() => setActiveVideoUrl(VIDEO_COLLECTION.rickroll)}
        />
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
