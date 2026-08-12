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
  Database,
  Shield,
} from "lucide-react";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu-1";

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
      dropdownType: "bento",
      bentoConfig: {
        leftCard: {
          icon: Shield,
          title: "Admin Dashboard",
          desc: "Pusat kendali operasional sekolah dengan akses menyeluruh dan real-time.",
          href: "/fitur"
        },
        gridItems: [
          { title: "Import & Export Excel", desc: "Kelola data siswa & nilai masal", href: "/fitur", icon: FileCheck },
          { title: "Pembagian Kelas", desc: "Automasi plotting siswa baru", href: "/fitur", icon: Users },
          { title: "Manajemen Data", desc: "Kontrol penuh data akademik", href: "/fitur", icon: Database },
          { title: "Validasi Berkas", desc: "Verifikasi dokumen pendaftar", href: "/fitur", icon: FileCheck },
        ]
      }
    },
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
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
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
                      className="group flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer relative"
                    >
                      <span className="text-sm font-medium text-[#23191C] flex items-center gap-1.5 relative z-10 pl-2">
                        <span
                          className="absolute left-0 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 text-[#23191C] ${
                            activeDropdown === item.label ? "rotate-180 opacity-100" : ""
                          }`}
                        />
                      </span>
                    </button>

                    {activeDropdown === item.label && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        {item.dropdownType === "bento" && item.bentoConfig ? (
                          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 w-[480px] flex gap-2">
                            {/* Left Highlight Card */}
                            <Link href={item.bentoConfig.leftCard.href} className="w-[180px] bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-4 flex flex-col justify-between group/left">
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 group-hover/left:text-blue-600 transition-colors">
                                <item.bentoConfig.leftCard.icon className="w-5 h-5" />
                              </div>
                              <div className="mt-6">
                                <h4 className="text-sm font-bold text-slate-900">{item.bentoConfig.leftCard.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-snug">{item.bentoConfig.leftCard.desc}</p>
                              </div>
                            </Link>
                            
                            {/* Right Grid */}
                            <div className="flex-1 grid grid-cols-2 gap-1 content-start">
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
                  className="group flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 relative"
                >
                  <span className="text-sm font-medium text-[#23191C] relative z-10 flex items-center pl-3">
                    <span
                      className="absolute left-0 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                </Link>
              );
            })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

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
          <div className="flex lg:hidden items-center">
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
        <div className="fixed inset-0 z-[100] bg-white dark:bg-[#0F0F11] flex flex-col pt-24 px-6 md:hidden animate-in slide-in-from-bottom-8 duration-300">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex-1 overflow-y-auto pb-32">
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-extrabold text-slate-900 dark:text-white hover:opacity-70 transition-opacity"
                  >
                    {item.label}
                  </Link>
                  
                  {/* Dropdown Array */}
                  {item.dropdown && (
                    <div className="mt-3 ml-1 flex flex-col space-y-4 border-l-2 border-slate-100 dark:border-white/10 pl-5">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-base font-semibold text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Bento Dropdown */}
                  {item.dropdownType === "bento" && item.bentoConfig && (
                    <div className="mt-3 ml-1 flex flex-col space-y-4 border-l-2 border-slate-100 dark:border-white/10 pl-5">
                      {item.bentoConfig.gridItems.map((sub: any) => (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-base font-semibold text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Sticky Bottom Action */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white dark:from-[#0F0F11] dark:via-[#0F0F11] to-transparent">
            <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
              <InteractiveHoverButton className="w-full justify-center bg-[#FFD33B] text-[#2A1B1D] font-bold text-base rounded-2xl h-14">
                Daftar Sekolah Sekarang
              </InteractiveHoverButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
