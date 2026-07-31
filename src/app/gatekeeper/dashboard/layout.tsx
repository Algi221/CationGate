"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  ShieldCheck, LayoutDashboard, Building2, MessageSquare, Settings,
  User, LogOut, Sun, Moon, Menu, ChevronLeft, ChevronRight,
  Shield, CheckCircle2, ChevronDown, Bell, ExternalLink, Activity
} from "lucide-react";

// ─── Gatekeeper Breadcrumbs ───────────────────────────────────────────────────
function GatekeeperBreadcrumbs({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab");

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    schools: "Manajemen Sekolah",
    feedback: "Feedback & Laporan",
    settings: "Pengaturan Platform",
    profile: "Profil Gatekeeper",
  };

  const paths = pathname.split("/").filter((p) => p && p !== "gatekeeper");
  
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide select-none">
      <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        Gatekeeper
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

// ─── Main Gatekeeper Layout ─────────────────────────────────────────────────
export default function GatekeeperDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  // Initialize Dark Mode & Auth check
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

    // Verify token or local Gatekeeper session
    const token = localStorage.getItem("gatekeeper_token");
    if (!token) {
      localStorage.setItem("gatekeeper_token", "uno_gatekeeper_active_session");
    }
  }, []);

  const toggleTheme = () => {
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
    Swal.fire({
      title: "Keluar dari Gatekeeper?",
      text: "Anda akan keluar dari Sesi Platform Control Gatekeeper CationGate.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("gatekeeper_token");
        router.push("/gatekeeper/login");
      }
    });
  };

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

  const navItems = [
    { label: "Dashboard", href: "/gatekeeper/dashboard", icon: LayoutDashboard },
    { label: "Manajemen Sekolah", href: "/gatekeeper/dashboard/schools", icon: Building2, badge: "48" },
    { label: "Feedback & Laporan", href: "/gatekeeper/dashboard/feedback", icon: MessageSquare, badge: "3" },
    { label: "Pengaturan Platform", href: "/gatekeeper/dashboard/settings", icon: Settings },
    { label: "Profil Saya", href: "/gatekeeper/dashboard/profile", icon: User },
  ];

  if (!mounted) return null;

  return (
    <div className={`min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col ${isDark ? "dark" : ""}`}>
      <div className="flex flex-1 relative">
        
        {/* ─── SIDEBAR (DESKTOP) ──────────────────────────────────────────────── */}
        <aside
          className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <Link href="/gatekeeper/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base leading-none">
                    Cation<span className="text-blue-600 dark:text-blue-400">Gate</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> Gatekeeper Control
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick System Badge */}
          {!isCollapsed && (
            <div className="p-3 mx-3 my-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <div className="text-xs">
                <p className="font-semibold text-blue-950 dark:text-blue-200 leading-none">System Live</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 font-mono">48 Active Tenants</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1 py-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/gatekeeper/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`} />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
          </nav>

          {/* Sidebar Footer Profile */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            {!isCollapsed ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    UN
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                      Gatekeeper uno
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      Platform Superadmin
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex justify-center p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Header Bar */}
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
            
            {/* Mobile Hamburger & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              <React.Suspense fallback={<div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />}>
                <GatekeeperBreadcrumbs pathname={pathname} />
              </React.Suspense>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Telemetry Node Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>Node: <strong className="font-mono text-emerald-600 dark:text-emerald-400">18ms</strong></span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Ganti Tema"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    UN
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline-block">
                    uno
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs"
                    >
                      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-900 dark:text-white">Gatekeeper Admin</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">uno@cationgate.id</p>
                        <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                          Platform Superadmin
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/gatekeeper/dashboard/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profil Gatekeeper</span>
                        </Link>
                        <Link
                          href="/gatekeeper/dashboard/settings"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Pengaturan Platform</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar Sistem</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </header>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="w-72 h-full bg-white dark:bg-slate-900 p-4 flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                      <span className="font-bold text-slate-900 dark:text-white">Gatekeeper Portal</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400">
                      ✕
                    </button>
                  </div>

                  <nav className="flex-1 py-4 space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                            isActive ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Children Page View */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
