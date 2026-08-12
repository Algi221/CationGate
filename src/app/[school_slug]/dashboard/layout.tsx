"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import {
  Sun, Moon, LogOut, LayoutDashboard, Users, Settings,
  Globe, Megaphone, GraduationCap, ChevronLeft, ChevronRight,
  Palette, Layers, Shield, Menu, ChevronDown, UserCircle, ShieldCheck, Lock, CreditCard, User
} from "lucide-react";
import SchoolNotFound from "@/components/SchoolNotFound";

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
function Breadcrumbs({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const paths = pathname.split("/").filter((p) => p);
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    admin: "Manajemen Admin",
    pendaftar: "Data Calon Siswa",
    "siswa-aktif": "Siswa Aktif",
    informasi: "Kelola Informasi",
    "kelola-ui": "Kelola UI/Data",
    "pembagian-kelas": "Pembagian Kelas",
    settings: "Pengaturan",
    profile: "Profil Saya",
  };

  const breadcrumbs: { label: string; href: string }[] = [];
  paths.forEach((path, idx) => {
    const label = labelMap[path] || path;
    const href = "/" + paths.slice(0, idx + 1).join("/");
    breadcrumbs.push({ label, href });
  });

  if (pathname.includes("/dashboard/admin") && activeTab === "trash")
    breadcrumbs.push({ label: "Sampah", href: `${paths[0] ? '/' + paths[0] : ''}/dashboard/admin?tab=trash` });
  else if (pathname.includes("/dashboard/pendaftar") && activeTab === "trash")
    breadcrumbs.push({ label: "Sampah", href: `${paths[0] ? '/' + paths[0] : ''}/dashboard/pendaftar?tab=trash` });

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide select-none">
      {breadcrumbs.map((bc, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-300 dark:text-slate-700">›</span>}
            {isLast ? (
              <span className="text-slate-600 dark:text-slate-300 font-semibold">{bc.label}</span>
            ) : (
              <Link href={bc.href} className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                {bc.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { adminToken, adminUser, logoutAdmin, wsStatus, ppdbLogo, ppdbTitle, schoolStatus, isSchoolNotFound } = usePPDB();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const schoolSlug = params?.school_slug as string;

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  // ── Close user dropdown on outside click ─────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  // ── Auto-open dropdown for current active sections ─────────────────────────
  useEffect(() => {
    if (pathname) {
      if (pathname.startsWith("/dashboard/pendaftar")) {
        setOpenDropdowns((prev) => ({ ...prev, "/dashboard/pendaftar": true }));
      } else if (pathname.startsWith("/dashboard/kelola-ui")) {
        setOpenDropdowns((prev) => ({ ...prev, "/dashboard/kelola-ui": true }));
      }
    }
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
    const savedCollapse = localStorage.getItem("ppdb-sidebar-collapsed");
    if (savedCollapse === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem("ppdb-sidebar-collapsed", String(nextVal));
  };

  const getTimeoutDuration = () => {
    if (typeof window === "undefined") return 60 * 60 * 1000;
    const saved = localStorage.getItem("ppdb_session_timeout");
    if (!saved) return 60 * 60 * 1000;
    const minutes = parseInt(saved, 10);
    return isNaN(minutes) ? 60 * 60 * 1000 : minutes * 60 * 1000;
  };

  useEffect(() => {
    if (mounted) {
      if (schoolSlug === 'demo') return; // Bypass auth for demo
      const token = localStorage.getItem("ppdb_admin_token");
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (token && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        const limit = getTimeoutDuration();
        if (elapsed > limit) {
          logoutAdmin();
          router.push(`/${schoolSlug}/auth/login?expired=true`);
          return;
        }
      }
      if (!adminToken) {
        router.push(`/${schoolSlug}/auth/login`);
        return;
      }
      // Redirect unverified schools to verification onboarding in dashboard
      const isVerified = !schoolStatus || schoolStatus === 'FULL_VERIFIED' || schoolStatus === 'VERIFIED' || schoolStatus === 'verified';
      if (!isVerified && schoolSlug) {
        const isVerifyingPath = pathname.includes('/dashboard/verification') || pathname.includes('/verify-account');
        if (!isVerifyingPath) {
          router.push(`/${schoolSlug}/dashboard/verification`);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, mounted, schoolStatus, schoolSlug]);

  useEffect(() => {
    if (!adminToken) return;
    let timeoutId: NodeJS.Timeout;
    let lastStorageUpdate = Date.now();
    const resetTimer = () => {
      clearTimeout(timeoutId);
      const limit = getTimeoutDuration();
      timeoutId = setTimeout(() => {
        logoutAdmin();
        router.push("/auth/login?expired=true");
      }, limit);
      const now = Date.now();
      if (now - lastStorageUpdate > 10000) {
        localStorage.setItem("ppdb_admin_last_active", now.toString());
        lastStorageUpdate = now;
      }
    };
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    resetTimer();
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    return () => {
      clearTimeout(timeoutId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, pathname]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
  };

  const handleLogout = () => {
    setShowUserDropdown(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logoutAdmin();
    setShowLogoutConfirm(false);
    router.push(schoolSlug ? `/${schoolSlug}/auth/login` : "/auth/login");
  };

  if (!mounted) return null;
  if (isSchoolNotFound || schoolStatus === 'TAKEDOWN') {
    return <SchoolNotFound slug={schoolSlug} isTakedown={schoolStatus === 'TAKEDOWN'} />;
  }
  if (!adminToken && schoolSlug !== 'demo') {
    return (
      <div className="min-h-screen bg-[#f7f7f7] dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-white transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">Memeriksa status otentikasi...</span>
        </div>
      </div>
    );
  }

  const userInitial = adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A";


  // ── Verification Check ───────────────────────────────────────────────────
  const isSchoolVerified = !schoolStatus || schoolStatus === 'FULL_VERIFIED' || schoolStatus === 'VERIFIED' || schoolStatus === 'verified' || schoolSlug === 'demo';

  // ── Menu Configuration with Submenus ───────────────────────────────────────
  const menuStructure = [
    ...(!isSchoolVerified
      ? [
          {
            category: "Status Legalitas",
            items: [
              { href: "/dashboard/verification", icon: <ShieldCheck size={18} />, label: "Verifikasi Sekolah", exact: true }
            ]
          }
        ]
      : []),
    {
      category: "Manajemen Siswa",
      items: [
        { href: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Ringkasan", exact: true, lockedIfUnverified: true },
        {
          href: "/dashboard/pendaftar",
          icon: <Users size={18} />,
          label: "Data Calon Siswa",
          lockedIfUnverified: true,
          subItems: [
            { label: "Pendaftar Reguler", href: "/dashboard/pendaftar?tab=active" },
            { label: "Pendaftar Pindahan", href: "/dashboard/pendaftar?tab=transfer" },
            { label: "Kuota & Target", href: "/dashboard/pendaftar?tab=kuota" },
            { label: "Tempat Sampah", href: "/dashboard/pendaftar?tab=trash" }
          ]
        },
        { href: "/dashboard/pembagian-kelas", icon: <Layers size={18} />, label: "Pembagian Kelas", lockedIfUnverified: true },
        { href: "/dashboard/siswa-aktif", icon: <GraduationCap size={18} />, label: "Siswa Aktif", lockedIfUnverified: true }
      ]
    },
    {
      category: "Konten Portal",
      items: [
        { href: "/dashboard/informasi", icon: <Megaphone size={18} />, label: "Kelola Informasi", lockedIfUnverified: true },
        {
          href: "/dashboard/kelola-ui",
          icon: <Palette size={18} />,
          label: "Kelola UI/Data",
          lockedIfUnverified: true,
          subItems: [
            { label: "Hero & Kontak", href: "/dashboard/kelola-ui?tab=hero" },
            { label: "Program Keahlian", href: "/dashboard/kelola-ui?tab=majors" },
            { label: "Alur Pendaftaran", href: "/dashboard/kelola-ui?tab=alur" },
            { label: "Form & Panduan", href: "/dashboard/kelola-ui?tab=form" },
            { label: "Bank Sekolah", href: "/dashboard/kelola-ui?tab=bank" },
            { label: "Mitra Industri", href: "/dashboard/kelola-ui?tab=partners" },
            { label: "FAQ", href: "/dashboard/kelola-ui?tab=faq" },
            { label: "Riwayat Perubahan", href: "/dashboard/kelola-ui?tab=revisions" }
          ]
        }
      ]
    },
    {
      category: "Pengaturan Sistem",
      items: [
        { href: "/dashboard/subscription", icon: <CreditCard size={18} />, label: "Kelola Subscription", lockedIfUnverified: true },
        { href: "/dashboard/admin", icon: <Shield size={18} />, label: "Manajemen Admin", superAdminOnly: true, lockedIfUnverified: true },
        { href: "/dashboard/settings", icon: <Settings size={18} />, label: "Pengaturan", lockedIfUnverified: true }
      ]
    }
  ];

  // ── Nav link helper with Submenu support ───────────────────────────────────
  const renderMenuItem = (item: any, delayIndex: number) => {
    const prefix = schoolSlug ? `/${schoolSlug}` : '';
    const fullHref = item.href.startsWith('/') ? `${prefix}${item.href}` : item.href;
    const hasSub = !!item.subItems;
    const isOpen = !!openDropdowns[item.href];
    const isLocked = !isSchoolVerified && item.href !== "/dashboard/verification";
    const isActive = item.exact
      ? pathname === fullHref || pathname === item.href
      : pathname === fullHref || pathname === item.href || pathname.startsWith(fullHref + "/");

    const currentTab = searchParams ? searchParams.get("tab") : null;

    const handleItemClick = (e: React.MouseEvent) => {
      if (isLocked) {
        e.preventDefault();
        Swal.fire({
          title: "Fitur Terkunci 🔒",
          text: "Sekolah Anda belum terverifikasi legalitasnya oleh Gatekeeper. Silakan selesaikan form Verifikasi Sekolah terlebih dahulu.",
          icon: "warning",
          confirmButtonColor: "#2563EB",
          confirmButtonText: "Buka Form Verifikasi",
          showCancelButton: true,
          cancelButtonText: "Batal",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        }).then((res) => {
          if (res.isConfirmed) {
            router.push(`/${schoolSlug}/dashboard/verification`);
          }
        });
        return;
      }

      if (hasSub) {
        e.preventDefault();
        if (isCollapsed) {
          setIsCollapsed(false);
          localStorage.setItem("ppdb-sidebar-collapsed", "false");
          setOpenDropdowns((prev) => ({ ...prev, [item.href]: true }));
        } else {
          setOpenDropdowns((prev) => ({ ...prev, [item.href]: !prev[item.href] }));
        }
      }
    };

    return (
      <motion.div
        key={item.href}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delayIndex * 0.05 + 0.1, duration: 0.35 }}
        className="w-full flex flex-col"
      >
        <div
          className="relative w-full"
          onMouseEnter={() => setHoveredItem(item.href)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {hoveredItem === item.href && !isLocked && !(isActive && (!hasSub || isCollapsed)) && (
            <motion.div
              layoutId="sidebar-hover"
              className="absolute inset-0 bg-slate-200/70 dark:bg-slate-800/70 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            />
          )}
          <Link
            href={isLocked ? "#" : fullHref}
            onClick={handleItemClick}
            className={`relative z-10 flex items-center justify-between rounded-xl text-sm font-semibold transition-colors duration-200 border ${
              isCollapsed ? "justify-center p-3" : "px-4 py-2.5"
            } ${
              isLocked
                ? "opacity-50 text-slate-400 dark:text-slate-600 bg-slate-100/50 dark:bg-slate-800/20 cursor-not-allowed"
                : isActive && (!hasSub || isCollapsed)
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold border-transparent"
                : "border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
            }`}
          title={isCollapsed ? (isLocked ? `${item.label} (Terkunci 🔒)` : item.label) : undefined}
        >
          <div className="flex items-center min-w-0">
            <span className="shrink-0">{item.icon}</span>
            <span
              className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
              }`}
            >
              {item.label}
            </span>
          </div>
          {isLocked && !isCollapsed ? (
            <Lock size={14} className="text-amber-500 shrink-0 ml-2" />
          ) : hasSub && !isCollapsed ? (
            <ChevronDown
              size={14}
              className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 shrink-0 ml-2 ${
                isOpen ? "rotate-180 text-blue-500" : ""
              }`}
            />
          ) : null}
          </Link>
        </div>

        {/* Render submenu items */}
        {hasSub && (
          <div className="overflow-hidden">
            <AnimatePresence initial={false}>
              {isOpen && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="pl-4 ml-6 pr-2 py-1.5 space-y-1 border-l-2 border-slate-200 dark:border-slate-800"
                >
                  {item.subItems.map((sub: any) => {
                    const fullSubHref = sub.href.startsWith('/') ? `${prefix}${sub.href}` : sub.href;
                    const defaultTab = sub.href.includes("pendaftar") ? "active" : "hero";
                    const urlParams = new URLSearchParams(sub.href.split("?")[1] || "");
                    const tabVal = urlParams.get("tab");
                    const isSubActive =
                      (pathname === fullSubHref.split("?")[0] || pathname === sub.href.split("?")[0]) &&
                      tabVal === (currentTab || defaultTab);

                    return (
                      <div
                        key={sub.href}
                        className="relative"
                        onMouseEnter={() => setHoveredItem(sub.href)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {hoveredItem === sub.href && !isSubActive && (
                          <motion.div
                            layoutId="sidebar-hover"
                            className="absolute inset-0 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 35 }}
                          />
                        )}
                        <Link
                          href={fullSubHref}
                          className={`relative z-10 group flex items-center gap-2.5 py-2 px-3.5 rounded-xl text-sm font-medium transition-colors duration-200 border ${
                            isSubActive
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold border-transparent"
                              : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  };

  // ── Section header helper ─────────────────────────────────────────────────
  const sectionHeader = (label: string) => (
    <div className="flex items-center py-2 overflow-hidden min-h-[32px]">
      <div className={`flex items-center w-full transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2"}`}>
        <span className={`text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
          isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
        }`}>
          {label}
        </span>
        <div className={`h-px bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${isCollapsed ? "w-8" : "flex-1"}`} />
      </div>
    </div>
  );

  return (
    <div data-dashboard className="h-screen bg-[#f7f7f7] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex font-sans overflow-hidden transition-colors duration-300">

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}


      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      } ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>

        {/* Toggle Collapse Button */}
        <button
          onClick={handleToggleCollapse}
          className="hidden md:flex absolute top-[24px] -right-4 w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 items-center justify-center transition-all duration-300 shadow-sm z-50 hover:scale-110 cursor-pointer"
          title={isCollapsed ? "Perluas Sidebar" : "Sembunyikan Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Brand Header */}
        <div className={`py-4 flex items-center border-b border-slate-300 dark:border-slate-700 min-h-[73px] transition-all duration-300 ${
          isCollapsed ? "justify-center px-0" : "px-5"
        }`}>
          <Link href={schoolSlug ? `/${schoolSlug}/dashboard` : "/dashboard"} className="flex items-center group">
            {ppdbLogo && (
              <img
                src={ppdbLogo}
                alt="Logo Sekolah"
                className="w-9 h-9 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col min-w-0 ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"
            }`}>
              <h2 className="text-sm font-black tracking-wider leading-none text-slate-800 dark:text-white uppercase whitespace-nowrap">
                {ppdbTitle ? ppdbTitle.replace(/^(ppdb\s+)/i, '') : "SMK TB"}
              </h2>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1 block whitespace-nowrap">PPDB Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "px-2" : "px-4"
        }`}>
          {(() => {
            let delayIndex = 0;
            return menuStructure.map((section) => (
              <React.Fragment key={section.category}>
                {sectionHeader(section.category)}
                {section.items.map((item) => {
                  if (item.superAdminOnly && adminUser?.role !== "superadmin") return null;
                  delayIndex++;
                  return renderMenuItem(item, delayIndex);
                })}
              </React.Fragment>
            ));
          })()}
        </nav>

        {/* Sidebar Footer - Empty as requested */}
      </motion.aside>

      {/* ── MAIN PANEL ──────────────────────────────────────────────────────── */}
      <motion.div
        className="flex-1 flex flex-col min-w-0 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >

        {/* Top Header */}
        <motion.header
          className="h-16 border-b border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 z-40 sticky top-0 transition-colors duration-300"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <Suspense fallback={<div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />}>
                <Breadcrumbs pathname={pathname} />
              </Suspense>
            </div>
          </div>

          <motion.div 
            className="flex items-center gap-2"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm hover:shadow"
              title={isDark ? "Beralih ke Terang" : "Beralih ke Gelap"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* ── User Avatar Dropdown ──────────────────────────────────── */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-semibold text-slate-700 dark:text-slate-300 text-sm shadow-sm overflow-hidden shrink-0">
                  {adminUser?.foto_profil ? (
                    <img src={adminUser.foto_profil} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} className="text-white" />
                  )}
                </div>
                <span className="hidden md:block text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {adminUser?.nama?.split(" ")[0] || "Admin"}
                </span>
                <ChevronDown
                  size={13}
                  className={`hidden md:block text-slate-400 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-semibold text-slate-700 dark:text-slate-300 text-base shadow-sm shrink-0 overflow-hidden">
                        {adminUser?.foto_profil ? (
                          <img src={adminUser.foto_profil} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{adminUser?.nama || "Admin TB"}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">@{adminUser?.username || "admin"}</p>
                        <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          isSchoolVerified
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                        }`}>
                          {isSchoolVerified ? "✓ Akun Official Sekolah" : "UNVERIFIED"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href={schoolSlug ? `/${schoolSlug}/dashboard/profile` : "/dashboard/profile"}
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      <UserCircle size={15} className="text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold">Profil Saya</span>
                    </Link>
                    <Link
                      href={schoolSlug ? `/${schoolSlug}/dashboard/settings` : "/dashboard/settings"}
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      <Settings size={15} className="text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold">Pengaturan</span>
                    </Link>
                    <Link
                      href={schoolSlug ? `/${schoolSlug}` : "/"}
                      target="_blank"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      <Globe size={15} className="text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold">Lihat Website</span>
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut size={15} className="shrink-0" />
                      <span className="text-xs font-bold">Keluar Sesi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent scroll-smooth">
          <motion.div
            className="mx-auto max-w-[1600px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      {/* ── Logout Confirmation Modal ──────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center max-w-sm w-full mx-4 backdrop-blur-xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-500 border border-rose-100 dark:border-rose-900/40 shadow-inner">
              <LogOut size={28} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Konfirmasi Keluar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Apakah Anda yakin ingin keluar dari sesi admin portal PPDB? Anda perlu memasukkan kredensial lagi untuk masuk.
              </p>
            </div>
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 py-3 bg-gradient-to-tr from-[#f43f5e] to-[#e11d48] hover:from-[#fb7185] hover:to-[#f43f5e] text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow shadow-rose-500/30 hover:shadow-rose-500/50 transition-all cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f7f7] dark:bg-slate-950 flex items-center justify-center"><div className="animate-spin h-8 w-8 text-blue-500 rounded-full border-4 border-t-transparent" /></div>}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}
