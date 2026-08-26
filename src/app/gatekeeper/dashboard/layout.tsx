"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import {
  LogOut, Menu, ChevronDown, UserCircle, ShieldCheck
} from "lucide-react";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { GatekeeperSidebar } from "@/components/layout/gatekeeper/GatekeeperSidebar";

function GatekeeperBreadcrumbs({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const _activeTab = searchParams.get("tab");
  const _filter = searchParams.get("filter");

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
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/50 font-medium tracking-wide select-none">
      <span className="text-slate-600 dark:text-slate-200 font-semibold flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#FFD33B]" />
        Gatekeeper Platform
      </span>
      {paths.map((p, idx) => {
        const label = labelMap[p] || p;
        const href = "/gatekeeper/" + paths.slice(0, idx + 1).join("/");
        const isLast = idx === paths.length - 1;

        return (
          <React.Fragment key={p}>
            <span className="text-slate-300 dark:text-zinc-700">›</span>
            {isLast ? (
              <span className="text-[#FFD33B] font-bold">{label}</span>
            ) : (
              <Link href={href} className="hover:text-slate-600 dark:hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { gatekeeperToken, gatekeeperUser, logoutGatekeeper } = usePPDB();
  const router = useRouter();
  const pathname = usePathname();
  const _searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const savedCollapse = localStorage.getItem("ppdb-sidebar-collapsed");
      if (savedCollapse === "true") {
        setIsCollapsed(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const getTimeoutDuration = () => {
    if (typeof window === "undefined") return 60 * 60 * 1000;
    const saved = localStorage.getItem("ppdb_session_timeout");
    if (!saved) return 60 * 60 * 1000;
    const minutes = parseInt(saved, 10);
    return isNaN(minutes) ? 60 * 60 * 1000 : minutes * 60 * 1000;
  };

  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("gatekeeper_token");
      const lastActive = localStorage.getItem("gatekeeper_last_active");
      if (token && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        const limit = getTimeoutDuration();
        if (elapsed > limit) {
          logoutGatekeeper();
          router.push(`/gatekeeper/login?expired=true`);
          return;
        }
      }
      if (!gatekeeperToken) {
        if (localStorage.getItem("gatekeeper_token")) {
           return;
        }
        router.push(`/gatekeeper/login`);
        return;
      }

      if (gatekeeperUser && gatekeeperUser.role !== 'gatekeeper' && gatekeeperUser.role !== 'superadmin') {
         Swal.fire({
            title: "Akses Ditolak",
            text: "Anda tidak memiliki hak akses sebagai Gatekeeper (Superadmin).",
            icon: "error"
         });
         router.push('/');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatekeeperToken, mounted, gatekeeperUser]);

  useEffect(() => {
    if (!gatekeeperToken) return;
    let timeoutId: NodeJS.Timeout;
    let lastStorageUpdate = Date.now();
    const resetTimer = () => {
      clearTimeout(timeoutId);
      const limit = getTimeoutDuration();
      timeoutId = setTimeout(() => {
        logoutGatekeeper();
        router.push("/gatekeeper/login?expired=true");
      }, limit);
      const now = Date.now();
      if (now - lastStorageUpdate > 10000) {
        localStorage.setItem("gatekeeper_last_active", now.toString());
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
  }, [gatekeeperToken, pathname]);



  const handleLogout = () => {
    setShowUserDropdown(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logoutGatekeeper();
    setShowLogoutConfirm(false);
    router.push("/gatekeeper/login");
  };

  if (!mounted) return null;

  if (!gatekeeperToken || (gatekeeperUser && gatekeeperUser.role !== 'gatekeeper' && gatekeeperUser.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#2e3749] flex items-center justify-center text-slate-800 dark:text-white transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#FFD33B]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-500 dark:text-white/70 font-bold text-sm">Memeriksa hak akses Gatekeeper...</span>
        </div>
      </div>
    );
  }

  const userInitial = gatekeeperUser?.nama ? gatekeeperUser.nama.charAt(0).toUpperCase() : "G";

  return (
    <div data-dashboard className="h-screen bg-slate-50 dark:bg-[#2e3749] flex font-sans overflow-hidden transition-colors duration-300">

      <GatekeeperSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-[#f8fafc] dark:bg-[#2e3749]">

        {/* Floating Rounded Header */}
        <div className="p-3 pb-0 shrink-0 z-20">
          <header className="h-16 md:h-18 bg-white/80 dark:bg-[#2e3749]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl flex items-center justify-between px-4 md:px-6 shadow-xs">
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <button
                className="md:hidden p-2 -ml-1 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={22} strokeWidth={2.5} />
              </button>
              <div className="hidden sm:block truncate">
                <GatekeeperBreadcrumbs pathname={pathname} />
              </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <ToggleTheme
                animationType="circle-spread"
                duration={1000}
                className="w-9 h-9 rounded-full text-slate-500 hover:text-[#2e3749] dark:text-slate-300 dark:hover:text-[#FFD33B] hover:bg-slate-100 dark:hover:bg-white/10 transition-all border-0 bg-transparent dark:bg-transparent"
              />

              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-all group focus:outline-none ml-1"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2e3749] dark:bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-[#2e3749]">
                    {userInitial}
                  </div>
                  <ChevronDown size={14} strokeWidth={2.5} className="text-slate-400 group-hover:text-slate-600 dark:text-white/60 dark:group-hover:text-white mr-1" />
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#2e3749] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 origin-top-right"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-black/10">
                        <div className="flex items-center gap-3 w-full">
                          <div className="h-9 w-9 bg-[#2e3749] dark:bg-white/10 rounded-full border border-white/20 shadow-md flex items-center justify-center shrink-0">
                            <UserCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                              {gatekeeperUser?.nama_lengkap || "Gatekeeper CationGate"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-white/60 font-medium truncate">
                              {gatekeeperUser?.username || "Admin Utama"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/gatekeeper/dashboard/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                          <UserCircle size={16} /> Profil Saya
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
        </div>

        {/* Content Area - Full Width & Close to Sidebar */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative">
          <div className="absolute inset-0 bg-slate-50 dark:bg-[#2e3749] -z-10" />

          <div className="w-full p-3 md:p-4 animate-fade-in pb-24 md:pb-8">
            <div className="sm:hidden mb-4">
              <GatekeeperBreadcrumbs pathname={pathname} />
            </div>

            <Suspense fallback={
              <div className="flex items-center justify-center min-h-100">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#FFD33B] animate-spin"></div>
                  <span className="text-slate-500 dark:text-white/70 font-bold text-sm tracking-widest uppercase">Memuat Gatekeeper...</span>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
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
              className="relative w-full max-w-sm bg-white dark:bg-[#2e3749] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2 tracking-tight">
                Akhiri Sesi?
              </h3>
              <p className="text-sm text-center text-slate-500 dark:text-white/70 mb-6">
                Anda akan keluar dari Gatekeeper Control Panel. Anda harus login kembali untuk masuk.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
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