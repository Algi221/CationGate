"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight, 
  LogIn, 
  Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
          : "bg-white/80 backdrop-blur-xs border-b border-slate-200/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* CationGate Ed-Tech SaaS Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-primary hover:bg-primary/90 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Cation<span className="text-primary">Gate</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider -mt-1 uppercase">
                AI Ed-Tech SaaS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/demo/dashboard">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-200 text-primary hover:bg-primary/5 font-bold text-xs sm:text-sm rounded-xl gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                Coba Demo Live
              </Button>
            </Link>

            <Link href="/daftar">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-700 hover:text-primary font-semibold text-xs sm:text-sm rounded-xl"
              >
                <LogIn className="w-4 h-4 mr-1.5 text-primary" />
                Login
              </Button>
            </Link>

            <Link href="/daftar">
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary hover:bg-primary/90 text-white font-semibold text-xs sm:text-sm gap-1.5 rounded-xl px-4 shadow-xs transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-background hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/demo/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center text-primary border-blue-200 hover:bg-primary/5 text-xs font-bold rounded-xl">
                <Sparkles className="w-4 h-4 text-primary mr-1.5" />
                Coba Demo Live
              </Button>
            </Link>
            <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center text-xs font-semibold rounded-xl border-slate-200">
                Login to Console
              </Button>
            </Link>
            <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center bg-primary text-white font-semibold text-xs rounded-xl">
                Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
