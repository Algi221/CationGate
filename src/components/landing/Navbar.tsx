"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  DoorOpen,
  ChevronDown,
  Sparkles,
  Users,
  Target,
  BookOpen,
  FileCheck,
  BarChart3,
  Cpu,
  PhoneCall,
} from "lucide-react";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: "Beranda", href: "/", color: "#45C06B" },
    {
      label: "Tentang Kami",
      href: "/tentang",
      color: "#FF9D67",
      dropdown: [
        {
          title: "Visi & Misi",
          desc: "Komitmen kami dalam modernisasi pendidikan digital Indonesia.",
          href: "/tentang#visi-misi",
          icon: Target,
        },
        {
          title: "Tim & Leadership",
          desc: "Pendidik dan teknolog hebat di balik sistem CationGate.",
          href: "/tentang#tim",
          icon: Users,
        },
        {
          title: "Kisah CationGate",
          desc: "Perjalanan inovasi platform dari sekolah pertama hingga nasional.",
          href: "/tentang#kisah",
          icon: BookOpen,
        },
      ],
    },
    {
      label: "Fitur Unggulan",
      href: "/fitur",
      color: "#8EC9F6",
      dropdown: [
        {
          title: "Sistem PPDB Online",
          desc: "Pendaftaran, pengunggahan berkas, dan verifikasi otomatis.",
          href: "/fitur#ppdb",
          icon: Sparkles,
        },
        {
          title: "Asesmen & Ujian CBT",
          desc: "Ujian berbasis komputer bebas kecurangan dengan nilai instan.",
          href: "/fitur#cbt",
          icon: FileCheck,
        },
        {
          title: "Manajemen Siswa",
          desc: "Kelola data akademik, pembagian kelas, dan profil murid.",
          href: "/fitur#manajemen",
          icon: Cpu,
        },
        {
          title: "Dashboard Analitik",
          desc: "Visualisasi data pendaftar dan statistik real-time sekolah.",
          href: "/fitur#analitik",
          icon: BarChart3,
        },
      ],
    },
    { label: "Paket & Biaya", href: "/harga", color: "#FFD33B" },
    { label: "Hubungi Kami", href: "/kontak", color: "#E86BC6" },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 transition-all duration-500">
      <div
        className={`transition-all duration-500 rounded-2xl border shadow-2xl px-5 sm:px-6 ${
          scrolled
            ? "w-full max-w-5xl bg-[#FFFFFF]/90 text-[#1A1A1A] border-rose-200/50 backdrop-blur-md py-2 shadow-lg"
            : "w-full max-w-7xl bg-[#FFFFFF] text-[#1A1A1A] border-white/10 py-3"
        }`}
      >
        <div className="flex items-center justify-between h-14">
          {/* Logo Section */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.dropdown);

              if (hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative nav-dropdown-container"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      className="group flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-[#23191C]">{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 text-[#23191C] ${
                          activeDropdown === item.label ? "rotate-180 opacity-100" : ""
                        }`}
                      />
                    </button>

                    {/* Mega-Menu Dropdown Card */}
                    {activeDropdown === item.label && item.dropdown && (
                      <div className="absolute left-0 top-full pt-2 w-72 sm:w-80 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 space-y-1">
                          {item.dropdown.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/sub"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/sub:bg-blue-600 group-hover/sub:text-white transition-colors mt-0.5">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 group-hover/sub:text-blue-600 transition-colors">
                                    {sub.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                    {sub.desc}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-[#23191C]">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
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
                Daftar Sekolah
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
        <div className="absolute top-20 left-4 right-4 md:hidden border border-border bg-[#2A1B1D] rounded-2xl p-4 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 space-y-1 border-l border-white/10 my-1">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-xs text-white/70 hover:text-white"
                      >
                        • {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
              <InteractiveHoverButton className="w-full justify-center bg-[#FFD33B] text-[#2A1B1D] font-semibold text-sm rounded-xl h-10">
                Daftar Sekolah
              </InteractiveHoverButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
