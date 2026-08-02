"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  ShieldCheck, LayoutDashboard, Building2, MessageSquare, Settings,
  User, LogOut, Sun, Moon, Menu, ChevronLeft, ChevronRight,
  Shield, CheckCircle2, ChevronDown, Bell, ExternalLink, Activity, UserCircle
} from "lucide-react";

// ─── Gatekeeper Breadcrumbs ───────────────────────────────────────────────────
function GatekeeperBreadcrumbs({ pathname }: { pathname: string }) {
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    schools: "Manajemen Sekolah",
    feedback: "Feedback & Tiket",
    settings: "Pengaturan System",
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

// ─── Gatekeeper Layout Inner ─────────────────────────────────────────────────
function GatekeeperLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  // Initialize Theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("ppdb-theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    Swal.fire({
      title: "Logout Berhasil",
      text: "Anda telah keluar dari Gatekeeper Control Platform.",
      icon: "success",
      confirmButtonColor: "#2563EB",
      customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800" }
    });
    router.push("/auth/login");
  };

  const menuStructure = [
    {
      category: "Manajemen SaaS",
      items: [
        { href: "/gatekeeper/dashboard", icon: LayoutDashboard, label: "Ringkasan Platform", exact: true },
        { href: "/gatekeeper/dashboard/schools", icon: Building2, label: "Manajemen Sekolah", badge: "Live" },
      ]
    },
    {
      category: "Layanan Platform",
      items: [
        { href: "/gatekeeper/dashboard/feedback", icon: MessageSquare, label: "Feedback & Tiket", badge: "3" }
      ]
    },
    {
      category: "Pengaturan Platform",
      items: [
        { href: "/gatekeeper/dashboard/settings", icon: Settings, label: "Pengaturan System" },
        { href: "/gatekeeper/dashboard/profile", icon: User, label: "Profil Gatekeeper" }
      ]
    }
  ];

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#f7f7f7] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex font-sans overflow-hidden transition-colors duration-300">
      
      {/* ─── SIDEBAR (DESKTOP) ──────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col bg-white/90 dark:bg-slate-900/90 border-r border-slate-200/80 dark:border-slate-800/60 backdrop-blur-xl transition-all duration-300 relative z-30 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-6 z-40 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:scale-105 transition-all flex items-center justify-center"
          title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center border-b border-slate-200/80 dark:border-slate-800/60 shrink-0">
          <Link href="/gatekeeper/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 shrink-0">
              <ShieldCheck size={20} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-black tracking-tight text-slate-900 dark:text-white text-base leading-none">
                  Cation<span className="text-blue-600 dark:text-blue-400">Gate</span>
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-0.5 tracking-wider uppercase flex items-center gap-1">
                  <Shield size={10} /> Gatekeeper Platform
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-4 custom-scrollbar">
          {menuStructure.map((sec) => (
            <div key={sec.category} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-1 pb-0.5 select-none">
                  {sec.category}
                </p>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname?.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-extrabold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`} />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                            isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/60 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  GK
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                    Gatekeeper Superadmin
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    uno@cationgate.id
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              title="Keluar"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Navigation Header */}
        <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
          
          {/* Left: Mobile Menu & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu size={20} />
            </button>

            <GatekeeperBreadcrumbs pathname={pathname} />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* WS Live Telemetry Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Gatekeeper Core • Live 18ms
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-800"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown((v) => !v)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0">
                  GK
                </div>
                <span className="hidden md:block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Superadmin Gatekeeper
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`} />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Gatekeeper Control Center</p>
                    <p className="text-[10px] text-slate-400 font-medium">uno@cationgate.id</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      Platform Superadmin
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/gatekeeper/dashboard/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserCircle size={16} className="text-slate-400" /> Profil Saya
                    </Link>
                    <Link
                      href="/gatekeeper/dashboard/settings"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings size={16} className="text-slate-400" /> Pengaturan System
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 p-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Keluar Platform
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* ─── MOBILE DRAWER MENU ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-white dark:bg-slate-900 p-5 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <span className="font-black text-slate-900 dark:text-white">Gatekeeper Portal</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400">
                  ✕
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-3 overflow-y-auto">
                {menuStructure.map((sec) => (
                  <div key={sec.category} className="space-y-1">
                    <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-2 pb-1">
                      {sec.category}
                    </p>
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname?.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                            isActive ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── LOGOUT CONFIRM MODAL ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center border border-rose-100 dark:border-rose-900/50">
                <LogOut size={28} />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Keluar dari Gatekeeper?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Sesi kontrol platform Anda akan ditutup. Anda perlu login kembali untuk mengakses panel Gatekeeper.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
                >
                  Ya, Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function GatekeeperDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0b0f19]" />}>
      <GatekeeperLayoutInner>{children}</GatekeeperLayoutInner>
    </Suspense>
  );
}
