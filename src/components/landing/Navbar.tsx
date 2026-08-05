"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  LogIn,
  DoorOpen,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero", color: "#45C06B" },
    { label: "About", href: "#about", color: "#FF9D67" },
    { label: "Features", href: "#features", color: "#8EC9F6" },
    { label: "Capabilities", href: "#capabilities", color: "#E86BC6" },
    { label: "Pricing", href: "#pricing", color: "#FFD33B" },
    { label: "FAQ", href: "#faq", color: "#B8B8B8" },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 transition-all duration-300">
      <div
        className={`w-full max-w-7xl transition-all duration-300 rounded-2xl border border-white/10 shadow-2xl px-4 sm:px-6
           ${
             scrolled
               ? "bg-[#FFFFFF]/90 text-[#1A1A1A] border-rose-200/50 backdrop-blur-md py-1"
               : "bg-[#FFFFFF] text-[#1A1A1A] border-transparent py-2"
           }`}
      >
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo Section */}
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-slate-900 group-hover:scale-110 transition-transform">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              {/* Ubah text-white menjadi text-slate-900 */}
              <span className="font-semibold text-lg tracking-wide text-[#1A1A1A]">
                CationGate
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
      group
      flex items-center
      gap-2
      px-3
      py-2
      rounded-xl
      transition-all
      duration-300
      "
              >
                <span
                  className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ backgroundColor: link.color }}
                />

                <span className="text-sm font-medium text-[#23191C]">
                  {link.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* <Link href="/demo/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="bg-[#FF2F8B] hover:bg-[#F9B8CF] border-xl text-white font-bold text-xs sm:text-sm rounded-xl gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Coba Demo Live
              </Button>
            </Link> */}

            {/* <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="
      h-10
      rounded-full
      px-4
      text-[#58504E]
      hover:bg-[#2A1B1D]/20
      hover:text-[#23191C]
      font-medium
      transition-all
    "
              >
                <LogIn className="w-4 h-4 mr-2" />
                Log in
              </Button>
            </Link> */}

            <Link href="/daftar">
          <InteractiveHoverButton


  className="
    h-10
    rounded-full
    border-0
    bg-[#FFD33B]
    text-[#23191C]
    font-semibold
    text-sm
    px-6
    shadow-none

    transition-all
    duration-300
    hover:bg-[#F3C625]
    hover:shadow-[0_6px_20px_rgba(255,211,59,0.25)]
    hover:-translate-y-0.5

    active:scale-95
  "
>
  Get Started
</InteractiveHoverButton>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Disesuaikan dengan tema gelap) */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 md:hidden border border-white/10 bg-[#0b0b1f]/95 rounded-2xl p-4 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center bg-white text-black hover:bg-slate-200 font-semibold text-sm rounded-xl h-10">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
