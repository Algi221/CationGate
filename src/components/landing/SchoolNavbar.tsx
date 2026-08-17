"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  Menu,
  X,
  Cpu,
  Layers,
  BookOpen,
  Video,
  Palette,
} from "lucide-react";

import SafeImage from "@/components/SafeImage";
import { usePPDB } from "@/context/PPDBContext";

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
} from "@/components/ui/navigation-menu-1";

interface SchoolNavbarProps {
  schoolSlug: string;
}

export function SchoolNavbar({ schoolSlug }: SchoolNavbarProps) {
  const { ppdbLogo, ppdbTitle, isConfigLoaded: isGlobalConfigLoaded } = usePPDB();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Check initial theme
    const savedTheme = localStorage.getItem("ppdb-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
    
    // Fetch majors dynamically
    const loadMajors = async () => {
      try {
        const res = await fetch(`/api/config?school_slug=${schoolSlug}`);
        const data = await res.json();

        if (data.success && data.data && data.data.ppdb_majors_config) {
          const config = data.data;
          if (Array.isArray(config.ppdb_majors_config)) {
            const iconMap: Record<string, any> = {
              RPL: Cpu,
              TJKT: Layers,
              DKV: BookOpen,
              BC: Video,
              ANM: Palette,
              TE: Cpu
            };
            const mapped = config.ppdb_majors_config.map((m: any) => ({
              ...m,
              icon: iconMap[m.code] || Cpu
            }));
            setMajors(mapped);
          }
        }
      } catch (e) {
        console.error("Failed to load majors for navbar:", e);
      }
    };

    if (schoolSlug && schoolSlug !== "sekolah" && schoolSlug !== "demo") {
      loadMajors();
    }
  }, [schoolSlug]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center shrink-0 min-w-0">
            <Link href={`/${schoolSlug}`} className="flex items-center gap-3 overflow-visible group min-w-0">
              <div className="relative h-10 w-10 shrink-0 overflow-visible">
                <SafeImage src={ppdbLogo || undefined} alt="Logo Sekolah" fill sizes="48px" className="object-contain" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs lg:max-w-none group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {isGlobalConfigLoaded ? ppdbTitle : "\u00A0"}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1 shrink-0 z-50">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Beranda */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href={`/${schoolSlug}`} className={navigationMenuTriggerStyle() + " bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"} />}
                  >
                    Beranda
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Profil Sekolah Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                    Profil Sekolah
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[180px] p-2 flex flex-col gap-1">
                      {[
                        { title: "Sejarah", href: `/${schoolSlug}/profil?section=sejarah` },
                        { title: "Identitas Sekolah", href: `/${schoolSlug}/profil?section=identitas` },
                        { title: "Visi & Misi", href: `/${schoolSlug}/profil?section=visimisi` },
                        { title: "Tujuan", href: `/${schoolSlug}/profil?section=tujuan` }
                      ].map((sub) => (
                        <li key={sub.title}>
                          <NavigationMenuLink
                            render={<Link href={sub.href} className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:text-white dark:hover:bg-slate-800 rounded-md transition-colors" />}
                          >
                            {sub.title}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Jurusan Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                    Jurusan
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2 gap-2 p-4">
                      {majors.length > 0 ? (
                        majors.map((major, idx) => (
                          <li key={idx}>
                            <NavigationMenuLink
                              render={<Link href={`/${schoolSlug}/jurusan/${encodeURIComponent(major.code.toLowerCase())}`} className="flex flex-col gap-1 p-3 rounded-lg hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-800 transition-colors group/sub" />}
                            >
                              <div className="text-sm font-bold text-slate-900 dark:text-white transition-colors truncate">
                                {major.title || major.code}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">
                                {major.desc || "Program keahlian unggulan"}
                              </div>
                            </NavigationMenuLink>
                          </li>
                        ))
                      ) : (
                        <li className="col-span-2 text-center py-4 text-slate-500 text-sm">
                          Data jurusan belum tersedia.
                        </li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Forum & Blog */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href={`/${schoolSlug}/forum`} className={navigationMenuTriggerStyle() + " bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"} />}
                  >
                    Forum Informasi
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href={`/${schoolSlug}/blog`} className={navigationMenuTriggerStyle() + " bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"} />}
                  >
                    Blog
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>

              <NavigationMenuPositioner>
                <NavigationMenuPopup />
              </NavigationMenuPositioner>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href={`/${schoolSlug}/daftar`} className="hidden md:inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors whitespace-nowrap">
              Daftar
            </Link>

            {/* Hamburger Button visible only on mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 z-[101]"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] animate-in fade-in duration-300 lg:hidden">
          {/* Close Button X in top right */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Mobile Menu"
          >
            <X size={20} />
          </button>

          {/* Decorative gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-6 text-center p-6 w-full max-w-sm relative z-10">
            <Link href={`/${schoolSlug}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 mb-6">
              {ppdbLogo && <SafeImage src={ppdbLogo || undefined} alt="Logo Sekolah" width={48} height={48} className="w-12 h-12 object-contain" />}
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {isGlobalConfigLoaded ? ppdbTitle : "\u00A0"}
              </span>
            </Link>

            <div className="flex flex-col w-full gap-2">
              <Link
                href={`/${schoolSlug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-b border-slate-100 dark:border-slate-800 transition-colors"
              >
                Beranda
              </Link>
              <Link
                href={`/${schoolSlug}/profil`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-b border-slate-100 dark:border-slate-800 transition-colors"
              >
                Profil Sekolah
              </Link>
              <Link
                href={`/${schoolSlug}/forum`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-b border-slate-100 dark:border-slate-800 transition-colors"
              >
                Forum Informasi
              </Link>
              <Link
                href={`/${schoolSlug}/blog`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-b border-slate-100 dark:border-slate-800 transition-colors"
              >
                Blog
              </Link>
            </div>

            <div className="mt-8 w-full flex flex-col gap-3">
              <Link
                href={`/${schoolSlug}/daftar`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
