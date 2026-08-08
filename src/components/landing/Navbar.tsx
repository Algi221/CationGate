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
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 transition-all duration-500">
      {/* Lebar container berubah: max-w-7xl saat di atas, menyusut ke max-w-5xl saat di-scroll */}
      <div
        className={`transition-all duration-500 rounded-2xl border shadow-2xl px-5 sm:px-6 ${
          scrolled
            ? "w-full max-w-5xl bg-[#FFFFFF]/90 text-[#1A1A1A] border-rose-200/50 backdrop-blur-md py-2 shadow-lg"
            : "w-full max-w-7xl bg-[#FFFFFF] text-[#1A1A1A] border-white/10 py-3"
        }`}
      >
        <div className="flex items-center justify-between h-14">
          {/* Logo Section (Ukuran Tetap Normal) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#2A1B1D] group-hover:scale-110 transition-transform">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-wide text-[#23191C]">
                CationGate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Ukuran teks & gap tetap seperti semula) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300"
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

          {/* Action Buttons (Ukuran Tetap Normal) */}
          <div className="hidden sm:flex items-center gap-3">
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
              className="p-1.5 rounded-lg text-[#2A1B1D] hover:bg-black/5 transition-colors"
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 md:hidden border border-border bg-[#2A1B1D]/95 rounded-2xl p-4 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center bg-[#FFD33B] text-[#2A1B1D] hover:bg-[#F3C625] font-semibold text-sm rounded-xl h-10">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
