"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Cpu,
  Layers,
  BookOpen,
  Video,
  Palette,
} from "lucide-react";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";

import SafeImage from "@/components/SafeImage";
import { usePPDB } from "@/context/PPDBContext";
import { useSchoolHref } from "@/hooks/useSchoolHref";

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

import Swal from "sweetalert2";

interface SchoolNavbarProps {
  schoolSlug: string;
  isPreview?: boolean;
  forceMobile?: boolean;
}

const DEFAULT_MAJORS = [
  { code: "RPL", title: "Rekayasa Perangkat Lunak", desc: "Software engineering, web, cloud & AI", icon: Cpu },
  { code: "TJKT", title: "Teknik Jaringan Komputer & Telkom", desc: "Jaringan, server & cyber security", icon: Layers },
  { code: "DKV", title: "Desain Komunikasi Visual", desc: "UI/UX, visual design & digital art", icon: BookOpen },
  { code: "BC", title: "Broadcasting & Perfilman", desc: "Penyiaran, sinematografi & editing", icon: Video },
  { code: "ANM", title: "Animasi", desc: "2D/3D animation, rigging & modeling", icon: Palette },
  { code: "TE", title: "Teknik Elektronika", desc: "IoT, robotics & microcontroller", icon: Cpu }
];

export function SchoolNavbar({ schoolSlug, isPreview = false, forceMobile = false }: SchoolNavbarProps) {
  const { ppdbLogo, ppdbTitle, isConfigLoaded: _isGlobalConfigLoaded } = usePPDB();
  const { href } = useSchoolHref(schoolSlug);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [majors, setMajors] = useState<any[]>(DEFAULT_MAJORS);
  const _pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string) => {
    if (!isPreview) return;
    e.preventDefault();
    if (targetPath.includes("#")) {
      const hash = targetPath.split("#")[1];
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    Swal.fire({
      toast: true,
      position: "top",
      icon: "info",
      title: "Mode Live Preview",
      text: "Tautan ini akan aktif penuh setelah perubahan Anda disimpan & dipublikasikan.",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  };

  useEffect(() => {
    const loadMajors = async () => {
      try {
        const res = await fetch(`/api/config?school_slug=${encodeURIComponent(schoolSlug)}&t=${Date.now()}`);
        const data = await res.json();

        if (data.success && data.data && data.data.ppdb_majors_config) {
          let majorsConfig = data.data.ppdb_majors_config;
          if (typeof majorsConfig === "string" && (majorsConfig.startsWith("[") || majorsConfig.startsWith("{"))) {
            try { majorsConfig = JSON.parse(majorsConfig); } catch (_e) {}
          }
          if (Array.isArray(majorsConfig) && majorsConfig.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const iconMap: Record<string, any> = {
              RPL: Cpu,
              TJKT: Layers,
              DKV: BookOpen,
              BC: Video,
              ANM: Palette,
              TE: Cpu
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped = majorsConfig.map((m: any) => ({
              ...m,
              icon: iconMap[m.code] || Cpu
            }));
            setMajors(mapped);
            return;
          }
        }

        if (schoolSlug === "demo") {
          setMajors(DEFAULT_MAJORS);
        } else {
          setMajors([]);
        }
      } catch (e) {
        console.error("Failed to load majors for navbar:", e);
      }
    };

    if (schoolSlug && schoolSlug !== "sekolah") {
      loadMajors();
    }
  }, [schoolSlug]);

  const isDemo = schoolSlug === "demo" || (typeof window !== "undefined" && window.location.pathname.startsWith("/demo"));
  const displayTitle = ppdbTitle || (isDemo ? "SMK Demo Indonesia" : (schoolSlug ? schoolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Portal PPDB"));

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center shrink-0 min-w-0">
            <Link href={href("/")} className="flex items-center gap-3 overflow-visible group min-w-0">
              <div className="relative h-10 w-10 shrink-0 overflow-visible flex items-center justify-center">
                {ppdbLogo ? (
                  <SafeImage
                    src={ppdbLogo}
                    alt="Logo Sekolah"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                ) : isDemo ? (
                  <SafeImage
                    src="/assets/logo_sekolah/logo_smktb.png"
                    alt="Logo Sekolah"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {(displayTitle || "S").substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className={`font-black text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 ${forceMobile ? "max-w-28 text-sm" : "max-w-45 sm:max-w-xs lg:max-w-none text-lg sm:text-xl"}`}>
                {displayTitle}
              </span>
            </Link>
          </div>

          <div className={forceMobile ? "hidden" : "hidden lg:flex items-center gap-1 shrink-0 z-50"}>
            <NavigationMenu>
              <NavigationMenuList>
                {/* Beranda */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href={href("/")} onClick={(e) => handleLinkClick(e, href("/"))} className={navigationMenuTriggerStyle() + " bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"} />}
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
                    <ul className="w-45 p-2 flex flex-col gap-1">
                      {[
                        { title: "Sejarah", href: href("/profil?section=sejarah") },
                        { title: "Identitas Sekolah", href: href("/profil?section=identitas") },
                        { title: "Visi & Misi", href: href("/profil?section=visimisi") },
                        { title: "Tujuan", href: href("/profil?section=tujuan") }
                      ].map((sub) => (
                        <li key={sub.title}>
                          <NavigationMenuLink
                            render={<Link href={sub.href} onClick={(e) => handleLinkClick(e, sub.href)} className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 rounded-md transition-colors" />}
                          >
                            {sub.title}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Jurusan Dropdown - Selalu Tampil Dinamis */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                    Jurusan
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {majors && majors.length > 0 ? (
                      <ul className="grid w-100 md:w-125 lg:w-150 grid-cols-2 gap-2 p-4">
                        {majors.map((major, idx) => (
                          <li key={idx}>
                            <NavigationMenuLink
                              render={
                                <Link
                                  href={href(`/jurusan/${encodeURIComponent(major.code.toLowerCase())}`)}
                                  onClick={(e) => handleLinkClick(e, href(`/jurusan/${encodeURIComponent(major.code.toLowerCase())}`))}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-slate-100 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-slate-800"
                                />
                              }
                            >
                              <div className="text-sm font-semibold leading-none">{major.title || major.code}</div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                {major.desc || ""}
                              </p>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="w-72 p-5 text-center space-y-1.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Program Keahlian Belum Ditambahkan</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                          Daftar jurusan dan konsentrasi keahlian sekolah ini akan segera diperbarui oleh admin instansi.
                        </p>
                      </div>
                    )}
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Informasi */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href={href("/forum")} onClick={(e) => handleLinkClick(e, href("/forum"))} className={navigationMenuTriggerStyle() + " bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"} />}
                  >
                    Informasi
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>

              <NavigationMenuPositioner>
                <NavigationMenuPopup />
              </NavigationMenuPositioner>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ToggleTheme
              animationType="circle-spread"
              duration={1000}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 bg-transparent dark:bg-transparent"
            />
            <Link
              href={schoolSlug === 'demo' ? href("/dashboard") : href("/daftar")}
              onClick={(e) => handleLinkClick(e, schoolSlug === 'demo' ? href("/dashboard") : href("/daftar"))}
              className={`${forceMobile ? "hidden" : "hidden md:inline-flex"} items-center justify-center px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors whitespace-nowrap`}
            >
              {schoolSlug === 'demo' ? "Dashboard Demo" : "Daftar"}
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${forceMobile ? "flex" : "flex lg:hidden"} items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 z-101 cursor-pointer`}
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen/Container Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] p-6 overflow-y-auto animate-in fade-in duration-300 ${forceMobile ? "flex" : "lg:hidden"}`}>
          {/* Close Button X in top right */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer z-20"
            aria-label="Close Mobile Menu"
          >
            <X size={20} />
          </button>

          {/* Decorative gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-6 text-center p-6 w-full max-w-sm relative z-10">
            <Link
              href={href("/")}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleLinkClick(e, href("/"));
              }}
              className="flex items-center gap-2 mb-6"
            >
              {ppdbLogo ? (
                <SafeImage src={ppdbLogo} alt="Logo Sekolah" width={48} height={48} className="w-12 h-12 object-contain" />
              ) : schoolSlug === "smktarunabhakti" || schoolSlug === "demo" ? (
                <SafeImage src="/assets/logo_sekolah/logo_smktb.png" alt="Logo Sekolah" width={48} height={48} className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {(displayTitle || "S").substring(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {displayTitle}
              </span>
            </Link>

            <div className="flex flex-col w-full gap-2">
              <Link
                href={href("/")}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, href("/"));
                }}
                className="w-full py-4 text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-b border-slate-100 dark:border-slate-800 transition-colors"
              >
                Beranda
              </Link>
              <Link
                href={href("/profil")}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, href("/profil"));
                }}
                className="w-full py-4 text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-b border-slate-100 dark:border-slate-800 transition-colors"
              >
                Profil Sekolah
              </Link>
              <Link
                href={href("/forum")}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, href("/forum"));
                }}
                className="w-full py-4 text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-b border-slate-100 dark:border-slate-800 transition-colors"
              >
                Forum Informasi
              </Link>
              <Link
                href={href("/blog")}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, href("/blog"));
                }}
                className="w-full py-4 text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-b border-slate-100 dark:border-slate-800 transition-colors"
              >
                Blog
              </Link>
            </div>

            <div className="mt-8 w-full flex flex-col gap-3">
              <Link
                href={schoolSlug === 'demo' ? href("/dashboard") : href("/daftar")}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, schoolSlug === 'demo' ? href("/dashboard") : href("/daftar"));
                }}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
              >
                {schoolSlug === 'demo' ? "Buka Dashboard Demo" : "Daftar Sekarang"}
              </Link>
            </div>
          </div>
        </div>
      )} 
    </>
  );
}
