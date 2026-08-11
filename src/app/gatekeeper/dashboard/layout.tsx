"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import {
  Sun, Moon, LogOut, LayoutDashboard, Users, Settings,
  Globe, Megaphone, GraduationCap, ChevronLeft, ChevronRight,
  Palette, Layers, Shield, Menu, ChevronDown, UserCircle, ShieldCheck, Lock, CreditCard, Building2, MessageSquare, Activity, Wallet, Receipt,
  CheckCircle2, AlertCircle, TrendingUp, Bell
} from "lucide-react";

// ─── Gatekeeper Breadcrumbs ───────────────────────────────────────────────────
function GatekeeperBreadcrumbs({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");
  const filter = searchParams.get("filter");

  const labelMap: Record<string, string> = {
    dashboard: "Ringkasan Platform",
    schools: "Manajemen Sekolah",
    billing: "Billing & Paket",
    transactions: "Riwayat Transaksi",
    packages: "Paket Langganan",
    services: "Layanan & Log",
    feedback: "Feedback & Tiket",
    broadcast: "Broadcast Pengumuman",
    logs: "Log Aktivitas",
    settings: "Pengaturan Sistem",
    profile: "Profil Gatekeeper",
  };

  const paths = pathname.split("/").filter((p) => p && p !== "gatekeeper");

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide select-none">
      <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        Gatekeeper Platform
      </span>
      {paths.map((p, idx) => {
        const label = labelMap[p] || p;
        const href = "/gatekeeper/" + paths.slice(0, idx + 1).join("/");
        const isLast = idx === paths.length - 1;

        return (
          <React.Fragment key={p}>
            <span className="text-slate-300 dark:text-slate-700">›</span>
            {isLast ? (
              <span className="text-blue-600 dark:text-blue-400 font-bold">{label}</span>
            ) : (
              <Link href={href} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                {label}
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
  const { adminToken, adminUser, logoutAdmin } = usePPDB();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      if (pathname.startsWith("/gatekeeper/dashboard/schools")) {
        setOpenDropdowns((prev) => ({ ...prev, "/gatekeeper/dashboard/schools": true }));
      } else if (pathname.startsWith("/gatekeeper/dashboard/billing")) {
        setOpenDropdowns((prev) => ({ ...prev, "/gatekeeper/dashboard/billing": true }));
      } else if (pathname.startsWith("/gatekeeper/dashboard/services")) {
        setOpenDropdowns((prev) => ({ ...prev, "/gatekeeper/dashboard/services": true }));
      }
    }
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
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
      const token = localStorage.getItem("ppdb_admin_token");
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (token && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        const limit = getTimeoutDuration();
        if (elapsed > limit) {
          logoutAdmin();
          router.push(`/auth/login?expired=true`);
          return;
        }
      }
      if (!adminToken) {
        router.push(`/auth/login`);
        return;
      }
      
      // Ensure role is superadmin
      if (adminUser && adminUser.role !== 'superadmin') {
         Swal.fire({
            title: "Akses Ditolak",
            text: "Anda tidak memiliki hak akses sebagai Gatekeeper (Superadmin).",
            icon: "error"
         });
         router.push('/');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, mounted, adminUser]);

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
    router.push("/auth/login");
  };

  if (!mounted) return null;
  
  if (!adminToken || (adminUser && adminUser.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-white transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">Memeriksa hak akses Gatekeeper...</span>
        </div>
      </div>
    );
  }

  const userInitial = adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "G";

  // ── Menu Configuration with Submenus ───────────────────────────────────────
  const menuStructure = [
    {
      category: "Manajemen SaaS",
      items: [
        { href: "/gatekeeper/dashboard", icon: <LayoutDashboard size={18} />, label: "Ringkasan Platform", exact: true },
        {
          href: "/gatekeeper/dashboard/schools",
          icon: <Building2 size={18} />,
          label: "Manajemen Sekolah",
          subItems: [
            { label: "Sekolah Aktif (Verified)", href: "/gatekeeper/dashboard/schools?filter=FULL_VERIFIED" },
            { label: "Menunggu Verifikasi", href: "/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION" },
            { label: "Pendaftar Baru", href: "/gatekeeper/dashboard/schools?filter=UNVERIFIED" },
            { label: "Ditangguhkan", href: "/gatekeeper/dashboard/schools?filter=TAKEDOWN" }
          ]
        },
      ]
    },
    {
      category: "Keuangan & Langganan",
      items: [
        {
          href: "/gatekeeper/dashboard/billing",
          icon: <Wallet size={18} />,
          label: "Billing & Paket",
          subItems: [
            { label: "Kelola Paket", href: "/gatekeeper/dashboard/billing/packages" },
            { label: "Riwayat Transaksi", href: "/gatekeeper/dashboard/billing/transactions" },
          ]
        }
      ]
    },
    {
      category: "Layanan Platform",
      items: [
        {
          href: "/gatekeeper/dashboard/services",
          icon: <Activity size={18} />,
          label: "Layanan & Log",
          subItems: [
            { label: "Feedback & Tiket", href: "/gatekeeper/dashboard/services/feedback" },
            { label: "Broadcast Info", href: "/gatekeeper/dashboard/services/broadcast" },
            { label: "Aktivitas Sistem", href: "/gatekeeper/dashboard/services/logs" },
          ]
        }
      ]
    },
    {
      category: "Pengaturan Platform",
      items: [
        { href: "/gatekeeper/dashboard/settings", icon: <Settings size={18} />, label: "Pengaturan Sistem" },
        { href: "/gatekeeper/dashboard/profile", icon: <UserCircle size={18} />, label: "Profil Gatekeeper" }
      ]
    }
  ];

  // ── Nav link helper with Submenu support ───────────────────────────────────
  const renderMenuItem = (item: any, delayIndex: number) => {
    const fullHref = item.href;
    const hasSub = !!item.subItems;
    const isOpen = !!openDropdowns[item.href];
    const isActive = item.exact
      ? pathname === fullHref
      : pathname === fullHref || pathname.startsWith(fullHref + "/");

    const currentFilter = searchParams ? searchParams.get("filter") : null;

    const handleItemClick = (e: React.MouseEvent) => {
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
          {hoveredItem === item.href && !(isActive && (!hasSub || isCollapsed)) && (
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
            href={fullHref}
            onClick={handleItemClick}
            className={`relative z-10 flex items-center justify-between rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors duration-200 border ${
              isCollapsed ? "justify-center p-3" : "px-4 py-3"
            } ${
              isActive && (!hasSub || isCollapsed)
                ? "bg-blue-600 dark:bg-blue-600 border-blue-600 text-white font-extrabold shadow-sm shadow-blue-500/20"
                : "border-transparent text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
            }`}
          title={isCollapsed ? item.label : undefined}
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
          {hasSub && !isCollapsed ? (
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
                    const fullSubHref = sub.href;
                    const urlParams = new URLSearchParams(sub.href.split("?")[1] || "");
                    const filterVal = urlParams.get("filter");
                    const isSubActive =
                      (pathname === fullSubHref.split("?")[0]) &&
                      (filterVal ? currentFilter === filterVal : true);

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
                          className={`relative z-10 group flex items-center gap-2.5 py-2 px-3.5 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-colors duration-200 border ${
                            isSubActive
                              ? "bg-blue-600 dark:bg-blue-600 text-white border-blue-600 font-black shadow-sm shadow-blue-500/20"
                              : "border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSubActive ? "bg-white scale-125" : "bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-400 group-hover:scale-110"}`} />
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

  return (
    <div data-dashboard className="h-screen bg-slate-50 dark:bg-slate-950 flex font-sans overflow-hidden transition-colors duration-300">
      
      {/* ─── SIDEBAR (DESKTOP) ──────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800/50 backdrop-blur-xl transition-all duration-300 relative z-30 ${
          isCollapsed ? "w-[88px]" : "w-72"
        }`}
      >
        <button
          onClick={handleToggleCollapse}
          className="absolute -right-3.5 top-8 z-40 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-500 hover:text-slate-800 dark:hover:text-white hover:scale-110 transition-all flex items-center justify-center"
        >
          {isCollapsed ? <ChevronRight size={14} strokeWidth={2.5} /> : <ChevronLeft size={14} strokeWidth={2.5} />}
        </button>

        <div className={`h-20 px-6 flex items-center border-b border-slate-100 dark:border-slate-800/50 shrink-0 ${isCollapsed ? "justify-center px-0" : ""}`}>
          <Link href="/gatekeeper/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20 shrink-0">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg leading-tight">
                  Cation<span className="text-blue-600 dark:text-blue-400">Gate</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Gatekeeper Platform
                </span>
              </div>
            )}
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 overflow-y-auto space-y-6 custom-scrollbar">
          {menuStructure.map((sec, idx) => (
            <div key={sec.category} className="space-y-1.5">
              {!isCollapsed && (
                <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pb-1 select-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></span> {sec.category}
                </p>
              )}
              {isCollapsed && <div className="h-4" />}
              <div className="space-y-1">
                {sec.items.map((item) => renderMenuItem(item, idx))}
              </div>
            </div>
          ))}
        </div>

        <div className={`p-4 border-t border-slate-100 dark:border-slate-800/50 shrink-0 ${isCollapsed ? "flex justify-center" : ""}`}>
          <div className={`bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3 ${isCollapsed ? "w-12 h-12 justify-center p-0" : ""}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
              {userInitial}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {adminUser?.nama || "Superadmin"}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  Gatekeeper
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-[#f8fafc] dark:bg-slate-950">
        
        {/* ─── HEADER ──────────────────────────────────────────────────────── */}
        <header className="h-16 md:h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <button
              className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>
            <div className="hidden sm:block truncate">
              <GatekeeperBreadcrumbs pathname={pathname} />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>
            
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 pl-3 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                  {userInitial}
                </div>
                <ChevronDown size={14} strokeWidth={2.5} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {adminUser?.nama || "Superadmin"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 truncate">
                        Gatekeeper
                      </p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        href="/gatekeeper/dashboard/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserCircle size={16} /> Profil Saya
                      </Link>
                      <Link
                        href="/gatekeeper/dashboard/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Settings size={16} /> Pengaturan
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={16} /> Keluar Sistem
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ─── PAGE CONTENT ──────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative">
          <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-10" />
          
          <div className="max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in pb-24 md:pb-8">
            <div className="sm:hidden mb-6">
              <GatekeeperBreadcrumbs pathname={pathname} />
            </div>
            
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-widest uppercase">Memuat Gatekeeper...</span>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>

      {/* ─── MOBILE MENU OVERLAY ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col md:hidden shadow-2xl"
            >
              <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-lg">CationGate</span>
                </div>
              </div>
              <div className="flex-1 py-6 px-4 overflow-y-auto space-y-6">
                {menuStructure.map((sec, idx) => (
                  <div key={sec.category} className="space-y-1.5">
                    <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span> {sec.category}
                    </p>
                    <div className="space-y-1">
                      {sec.items.map((item) => renderMenuItem(item, idx))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── LOGOUT CONFIRMATION MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2 tracking-tight">
                Akhiri Sesi?
              </h3>
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
                Anda akan keluar dari Gatekeeper Control Panel. Anda harus login kembali untuk masuk.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}
