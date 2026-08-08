"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar-group";

// Dummy avatars for the Notion-like demo
const avatars = [
  { id: "1", name: "Alice", image: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: "Bob", image: "https://i.pravatar.cc/150?u=2" },
  { id: "3", name: "Charlie", image: "https://i.pravatar.cc/150?u=3" },
  { id: "4", name: "Diana", image: "https://i.pravatar.cc/150?u=4" },
  { id: "5", name: "Eve", image: "https://i.pravatar.cc/150?u=5" },
];

export function HeroSection({ onOpenVideo }: { onOpenVideo?: () => void }) {
  return (
    <section id="hero" className="relative pt-20 pb-32 overflow-hidden bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Subtle pill at the top */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium shadow-sm transition-colors">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Meet your 24/7 AI team</span>
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]"
          >
            Where teams and agents{" "}
            <span className="relative inline-block">
              <span className="relative z-10 px-4 py-1 bg-slate-100 rounded-full border border-slate-200 shadow-sm inline-flex items-center">
                Build
              </span>
            </span>{" "}
            together.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal"
          >
            CationGate is the connected workspace where better, faster work happens. Now with custom AI agents that work for you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/demo/dashboard">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-base px-6 py-6 rounded-lg transition-all"
              >
                Get CationGate free
              </Button>
            </Link>
            
            <button 
              onClick={onOpenVideo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-base transition-all cursor-pointer"
            >
              Request a demo
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        </div>

        {/* Central Visual: Avatar Group animated */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 w-full max-w-5xl mx-auto relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent blur-3xl opacity-50 -z-10 h-64" />
          <div className="relative p-12 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center gap-6">
            <p className="text-slate-500 font-medium">Collaborate seamlessly with AI agents</p>
            <AvatarGroup avatars={avatars} max={5} className="scale-125" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}