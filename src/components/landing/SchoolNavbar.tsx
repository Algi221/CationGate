"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cpu,
  Layers,
  BookOpen,
  Video,
  Palette,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { CurvedNavbar, HamburgerButton } from "./CurvedMobileMenu";

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
  overrideTitle?: string;
  overrideLogo?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overrideMajors?: any[];
}

const DEFAULT_MAJORS = [
  { code: "RPL", title: "Rekayasa Perangkat Lunak", desc: "Software engineering, web, cloud & AI", icon: Cpu },
  { code: "TJKT", title: "Teknik Jaringan Komputer & Telkom", desc: "Jaringan, server & cyber security", icon: Layers },
  { code: "DKV", title: "Desain Komunikasi Visual", desc: "UI/UX, visual design & digital art", icon: BookOpen },
  { code: "BC", title: "Broadcasting & Perfilman", desc: "Penyiaran, sinematografi & editing", icon: Video },
  { code: "ANM", title: "Animasi", desc: "2D/3D animation, rigging & modeling", icon: Palette },
  { code: "TE", title: "Teknik Elektronika", desc: "IoT, robotics & microcontroller", icon: Cpu }
];

export function SchoolNavbar({
  schoolSlug,
  isPreview = false,
  forceMobile = false,
  overrideTitle,
  overrideLogo,
  overrideMajors
}: SchoolNavbarProps) {
  const { ppdbLogo, ppdbTitle, isConfigLoaded: _isGlobalConfigLoaded } = usePPDB();
  const { href } = useSchoolHref(schoolSlug);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [majors, setMajors] = useState<any[]>(() => {
    if (overrideMajors && Array.isArray(overrideMajors) && overrideMajors.length > 0) {
      return overrideMajors;
    }
    if (typeof window !== "undefined" && schoolSlug) {
      try {
        const cached = localStorage.getItem(`ppdb_majors_config_${schoolSlug}`) || localStorage.getItem("ppdb_majors_config");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_e) {}
    }
    return schoolSlug === "demo" ? DEFAULT_MAJORS : [];
  });
  const _pathname = usePathname();

  useEffect(() => {
    if (overrideMajors && Array.isArray(overrideMajors) && overrideMajors.length > 0) {
      setMajors(overrideMajors);
    }
  }, [overrideMajors]);

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
        if (overrideMajors && Array.isArray(overrideMajors) && overrideMajors.length > 0) {
          setMajors(overrideMajors);
          return;
        }

        const res = await fetch(`/api/config?school_slug=${encodeURIComponent(schoolSlug)}&_t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });
        const data = await res.json();

        if (data.success && data.data && data.data.ppdb_majors_config) {
          let majorsConfig = data.data.ppdb_majors_config;
          if (typeof majorsConfig === "string") {
            let depth = 0;
            while (depth < 4 && typeof majorsConfig === "string") {
              const trimmed = majorsConfig.trim();
              if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
                try {
                  majorsConfig = JSON.parse(trimmed);
                  depth++;
                } catch (_) {
                  break;
                }
              } else {
                break;
              }
            }
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
  }, [schoolSlug, overrideMajors]);

  const isDemo = schoolSlug === "demo" || (typeof window !== "undefined" && window.location.pathname.startsWith("/demo"));
  const activeLogo = overrideLogo || ppdbLogo;
  const displayTitle = overrideTitle || ppdbTitle || (isDemo ? "SMK Demo Indonesia" : (schoolSlug ? schoolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Portal PPDB"));

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center shrink-0 min-w-0">
            <Link href={href("/")} className="flex items-center gap-3 overflow-visible group min-w-0">
              <div className="relative h-10 w-10 shrink-0 overflow-visible flex items-center justify-center">
                {activeLogo ? (
                  <SafeImage
                    src={activeLogo}
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
              className={`${forceMobile ? "hidden" : "hidden md:inline-flex"} items-center justify-center px-5 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-full transition-colors whitespace-nowrap shadow-sm`}
            >
              {schoolSlug === 'demo' ? "Dashboard Demo" : "Daftar"}
            </Link>

            {/* Hamburger Button */}
            <div className={`${forceMobile ? "flex" : "flex lg:hidden"} items-center relative z-250 shrink-0`}>
              <HamburgerButton
                isActive={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer / Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <CurvedNavbar
            setIsActive={setMobileMenuOpen}
            schoolLogo={activeLogo || (schoolSlug === "smktarunabhakti" || isDemo ? "/assets/logo_sekolah/logo_smktb.png" : undefined)}
            schoolName={displayTitle}
            onLinkClick={handleLinkClick}
            navItems={[
              { heading: "Beranda", href: href("/") },
              {
                heading: "Profil Sekolah",
                href: href("/profil"),
                subItems: [
                  { title: "Identitas Sekolah", href: href("/profil?section=identitas") },
                  { title: "Sejarah", href: href("/profil?section=sejarah") },
                  { title: "Visi & Misi", href: href("/profil?section=visimisi") },
                  { title: "Tujuan", href: href("/profil?section=tujuan") }
                ]
              },
              {
                heading: "Jurusan",
                href: href("/#majors"),
                subItems: majors.map((m) => ({
                  title: m.title || m.code,
                  href: href(`/jurusan/${encodeURIComponent(m.code.toLowerCase())}`)
                }))
              },
              { heading: "Forum Informasi", href: href("/forum") }
            ]}
            footer={
              <div className="flex flex-col w-full px-6 md:px-24 py-8 pb-12 gap-4">
                <Link
                  href={schoolSlug === 'demo' ? href("/dashboard") : href("/daftar")}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleLinkClick(e, schoolSlug === 'demo' ? href("/dashboard") : href("/daftar"));
                  }}
                  className="w-full"
                >
                  <button className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-bold text-base text-white rounded-2xl h-14 transition-all duration-300 flex items-center shadow-md shadow-blue-600/25 cursor-pointer">
                    {schoolSlug === 'demo' ? "Buka Dashboard Demo" : "Daftar Sekarang"}
                  </button>
                </Link>
              </div>
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
