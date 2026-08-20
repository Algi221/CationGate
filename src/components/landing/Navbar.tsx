"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DoorOpen,
  ChevronDown,
  Users,
  Target,
  BookOpen,
  FileCheck,
  Database,
  Shield,
} from "lucide-react";
import { CurvedNavbar } from "./CurvedMobileMenu";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";

// Hamburger Button dengan Performa & Transisi Smooth
function HamburgerButton({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors focus:outline-none z-[120]"
      aria-label="Toggle Menu"
    >
      <div className="w-5 h-4 relative flex flex-col justify-between">
        <motion.span
          animate={isActive ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="w-full h-0.5 bg-[#23191C] rounded-full origin-center block"
        />
        <motion.span
          animate={
            isActive ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
          }
          transition={{ duration: 0.15 }}
          className="w-full h-0.5 bg-[#23191C] rounded-full origin-center block"
        />
        <motion.span
          animate={isActive ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="w-full h-0.5 bg-[#23191C] rounded-full origin-center block"
        />
      </div>
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const _pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav-dropdown-container")) {
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

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("mobileMenuToggle", { detail: mobileMenuOpen }),
    );

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

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
      dropdownType: "bento",
      bentoConfig: {
        leftCard: {
          icon: Shield,
          title: "Admin Dashboard",
          desc: "Pusat kendali operasional sekolah dengan akses menyeluruh dan real-time.",
          href: "/fitur",
        },
        gridItems: [
          {
            title: "Import & Export Excel",
            desc: "Kelola data siswa & nilai masal",
            href: "/fitur",
            icon: FileCheck,
          },
          {
            title: "Pembagian Kelas",
            desc: "Automasi plotting siswa baru",
            href: "/fitur",
            icon: Users,
          },
          {
            title: "Manajemen Data",
            desc: "Kontrol penuh data akademik",
            href: "/fitur",
            icon: Database,
          },
          {
            title: "Validasi Berkas",
            desc: "Verifikasi dokumen pendaftar",
            href: "/fitur",
            icon: FileCheck,
          },
        ],
      },
    },
    { label: "Blog", href: "/blog", color: "#A855F7" },
    { label: "Hubungi Kami", href: "/kontak", color: "#E86BC6" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-[220] flex justify-center px-4 pt-3">
      <motion.div
        className="relative w-full z-[225] bg-[#FFFFFF] text-[#1A1A1A] backdrop-blur-md overflow-visible"
        initial={false}
        animate={{
          // Diperlebar sedikit ke 1360px saat di atas agar terasa "panjang tapi ga kejauhan"
          maxWidth: scrolled ? "1024px" : "1360px",
          borderRadius: scrolled ? "16px" : "24px",
          borderWidth: scrolled ? "1px" : "0px",
          borderColor: scrolled
            ? "rgba(226, 232, 240, 0.8)"
            : "rgba(255, 255, 255, 0)",
          boxShadow: scrolled
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)"
            : "0 0 0 0 rgba(0,0,0,0)",
          // Padding horizontal & vertical dilebarkan agar terasa "longgar" di awal
          paddingLeft: scrolled ? "20px" : "32px",
          paddingRight: scrolled ? "20px" : "32px",
          paddingTop: scrolled ? "8px" : "16px",
          paddingBottom: scrolled ? "8px" : "16px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between h-14 w-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/assets/catpeer/logo_cationGate.svg"
                alt="CationGate Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#23191C]">
                CationGate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.dropdown);

              if (hasDropdown || item.dropdownType === "bento") {
                return (
                  <div
                    key={item.label}
                    className="relative nav-dropdown-container"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      className="group/navitem flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer relative"
                    >
                      <span className="text-sm font-medium text-[#23191C] flex items-center gap-1.5 relative z-10 pl-3">
                        <span
                          className="absolute left-0 w-1.5 h-3 rounded-[3px] opacity-0 group-hover/navitem:opacity-100 transition-all duration-300 scale-y-0 group-hover/navitem:scale-y-100"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 text-[#23191C] ${
                            activeDropdown === item.label
                              ? "rotate-180 opacity-100"
                              : ""
                          }`}
                        />
                      </span>
                    </button>

                    {activeDropdown === item.label && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        {item.dropdownType === "bento" && item.bentoConfig ? (
                          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2.5 w-[480px] flex gap-2">
                            {/* Left Highlight Card */}
                            <Link
                              href={item.bentoConfig.leftCard.href}
                              className="w-[180px] bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-4 flex flex-col justify-between group/left"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 group-hover/left:text-blue-600 transition-colors">
                                <item.bentoConfig.leftCard.icon className="w-5 h-5" />
                              </div>
                              <div className="mt-6">
                                <h4 className="text-sm font-bold text-slate-900">
                                  {item.bentoConfig.leftCard.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 leading-snug">
                                  {item.bentoConfig.leftCard.desc}
                                </p>
                              </div>
                            </Link>

                            {/* Right Grid */}
                            <div className="flex-1 grid grid-cols-2 gap-1 content-start">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {item.bentoConfig.gridItems.map((sub: any) => (
                                <Link
                                  key={sub.title}
                                  href={sub.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="p-3 rounded-xl hover:bg-slate-50 transition-colors flex flex-col gap-1 group/sub"
                                >
                                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover/sub:text-blue-600 transition-colors">
                                    {sub.title}
                                    <span className="opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all text-blue-600">
                                      ↗
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 leading-tight">
                                    {sub.desc}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Simple Dropdown */
                          <div className="bg-white border border-slate-200/80 rounded-xl shadow-lg p-1.5 flex flex-col gap-0.5 w-48">
                            {item.dropdown?.map((sub) => (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                onClick={() => setActiveDropdown(null)}
                                className="px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 hover:text-blue-600"
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group/navitem flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 relative"
                >
                  <span className="text-sm font-medium text-[#23191C] relative z-10 flex items-center pl-3.5">
                    <span
                      className="absolute left-0 w-1.5 h-3 rounded-[3px] opacity-0 group-hover/navitem:opacity-100 transition-all duration-300 scale-y-0 group-hover/navitem:scale-y-100"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Action & Mobile Toggle Container */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Tombol Daftar Sekolah (Hanya muncul di Layar Besar/Desktop - lg:flex) */}
            <div className="hidden lg:flex items-center">
              <Link href="/daftar" className="group/daftar block p-1 -m-1">
                <InteractiveHoverButton
                  className="
          h-10
          rounded-full
          border-0
          bg-[#FFD33B]
          text-[#2A1B1D]
          font-semibold
          text-sm
          px-6
          shadow-none
          transition-all
          duration-300
          group-hover/daftar:bg-[#F3C625]
          group-hover/daftar:shadow-[0_6px_20px_rgba(255,211,59,0.25)]
          group-hover/daftar:-translate-y-0.5
          active:scale-95
          whitespace-nowrap
        "
                >
                  Daftar Sekolah
                </InteractiveHoverButton>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center relative z-[250] shrink-0">
              <HamburgerButton
                isActive={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Navigation Drawer / Sidebar (Full Screen Fix) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <CurvedNavbar
            setIsActive={setMobileMenuOpen}
            navItems={navItems.map((item) => ({
              heading: item.label,
              href: item.href,
              subItems:
                item.dropdown?.map((sub) => ({
                  title: sub.title,
                  href: sub.href,
                })) ||
                (item.dropdownType === "bento" && item.bentoConfig
                  ? item.bentoConfig.gridItems.map((sub: any) => ({
                      title: sub.title,
                      href: sub.href,
                    }))
                  : undefined),
            }))}
            footer={
              <div className="flex flex-col w-full px-10 md:px-24 py-8 pb-12 gap-4">
                <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
                  <InteractiveHoverButton className="w-full justify-center bg-[#FFD33B] text-[#2A1B1D] font-bold text-base rounded-2xl h-14">
                    Daftar Sekolah Sekarang
                  </InteractiveHoverButton>
                </Link>
              </div>
            }
          />
        )}
      </AnimatePresence>
    </header>
  );
}
