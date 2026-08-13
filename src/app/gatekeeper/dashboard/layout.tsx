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
import { GatekeeperSidebar } from "@/components/layout/gatekeeper/GatekeeperSidebar";

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
      // Logic handled in GatekeeperSidebar
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
          router.push(`/gatekeeper/auth/login?expired=true`);
          return;
        }
      }
      if (!adminToken) {
        // Allow PPDBContext hydration to complete if token is in localStorage
        if (localStorage.getItem("ppdb_admin_token")) {
           return;
        }
        router.push(`/gatekeeper/auth/login`);
        return;
      }
      
      // Ensure role is gatekeeper or superadmin
      if (adminUser && adminUser.role !== 'gatekeeper' && adminUser.role !== 'superadmin') {
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
        router.push("/gatekeeper/auth/login?expired=true");
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
    router.push("/gatekeeper/auth/login");
  };

  if (!mounted) return null;
  
  if (!adminToken || (adminUser && adminUser.role !== 'gatekeeper' && adminUser.role !== 'superadmin')) {
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

  return (
    <div data-dashboard className="h-screen bg-slate-50 dark:bg-slate-950 flex font-sans overflow-hidden transition-colors duration-300">
      
      <GatekeeperSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />


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

          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center focus:outline-none"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun size={18} strokeWidth={2.2} /> : <Moon size={18} strokeWidth={2.2} />}
            </button>
            
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group focus:outline-none ml-1"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-900">
                  {userInitial}
                </div>
                <ChevronDown size={14} strokeWidth={2.5} className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 mr-1" />
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

      <AnimatePresence>
        {/* Rendered inside GatekeeperSidebar */}
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
