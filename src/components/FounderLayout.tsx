"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, LogOut, LayoutDashboard, Building,
  ChevronLeft, ChevronRight, Menu, ChevronDown, UserCircle, Settings
} from "lucide-react";

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
function Breadcrumbs({ pathname }: { pathname: string }) {
  const paths = pathname.split("/").filter((p) => p);
  const labelMap: Record<string, string> = {
    dashboard: "Founder Dashboard",
    schools: "Manajemen Sekolah",
    billing: "Tagihan & Langganan",
    settings: "Pengaturan",
  };

  const breadcrumbs: { label: string; href: string }[] = [];
  paths.forEach((path, idx) => {
    if (path === 'founder') return;
    const label = labelMap[path] || path;
    const href = "/founder/" + paths.slice(1, idx + 1).join("/");
    breadcrumbs.push({ label, href });
  });

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide select-none">
      <Link href="/founder/dashboard" className="hover:text-slate-650 dark:hover:text-slate-350 transition-colors">
        Home
      </Link>
      {breadcrumbs.map((bc, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            <span className="text-slate-300 dark:text-slate-700">›</span>
            {isLast ? (
              <span className="text-slate-650 dark:text-slate-300 font-semibold">{bc.label}</span>
            ) : (
              <Link href={bc.href} className="hover:text-slate-650 dark:hover:text-slate-350 transition-colors">
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
function FounderLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
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
    
    // Auth Check
    const token = localStorage.getItem("ppdb_admin_token");
    if (!token) {
      router.push("/founder/login");
    }
  }, [router]);

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

  const confirmLogout = () => {
    localStorage.removeItem("ppdb_admin_token");
    router.push("/founder/login");
  };

  if (!mounted) return null;

  const menuStructure = [
    {
      category: "CationGate HQ",
      items: [
        { href: "/founder/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard", exact: true },
        { href: "/founder/schools", icon: <Building size={18} />, label: "Manajemen Sekolah" },
      ]
    },
    {
      category: "Sistem",
      items: [
        { href: "/founder/settings", icon: <Settings size={18} />, label: "Pengaturan" }
      ]
    }
  ];

  const renderMenuItem = (item: any, delayIndex: number) => {
    const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

    return (
      <motion.div key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delayIndex * 0.05 + 0.1, duration: 0.35 }} className="w-full flex flex-col">
        <Link
          href={item.href}
          className={`flex items-center justify-between rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
            isCollapsed ? "justify-center p-3" : "px-4 py-3"
          } ${
            isActive
              ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
          }`}
          title={isCollapsed ? item.label : undefined}
        >
          <div className="flex items-center min-w-0">
            <span className="shrink-0">{item.icon}</span>
            <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"}`}>
              {item.label}
            </span>
          </div>
        </Link>
      </motion.div>
    );
  };

  const sectionHeader = (label: string) => (
    <div className="flex items-center py-2 overflow-hidden min-h-[32px]">
      <div className={`flex items-center w-full transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2"}`}>
        <span className={`text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-widest select-none transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
          isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
        }`}>
          {label}
        </span>
        <div className={`h-px bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${isCollapsed ? "w-8" : "flex-1"}`} />
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#f7f7f7] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex font-sans overflow-hidden transition-colors duration-300">
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute top-[24px] -right-4 w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 items-center justify-center transition-all duration-300 shadow-sm z-50 hover:scale-110 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className={`py-4 flex items-center border-b border-slate-300 dark:border-slate-700 min-h-[73px] transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-5"}`}>
          <Link href="/founder/dashboard" className="flex items-center group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
              C
            </div>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col min-w-0 ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"}`}>
              <h2 className="text-sm font-black tracking-wider leading-none text-slate-800 dark:text-white uppercase whitespace-nowrap">
                CationGate
              </h2>
              <span className="text-[10px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-widest mt-1 block whitespace-nowrap">Founder HQ</span>
            </div>
          </Link>
        </div>

        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto transition-all duration-300 ${isCollapsed ? "px-2" : "px-4"}`}>
          {(() => {
            let delayIndex = 0;
            return menuStructure.map((section) => (
              <React.Fragment key={section.category}>
                {sectionHeader(section.category)}
                {section.items.map((item) => {
                  delayIndex++;
                  return renderMenuItem(item, delayIndex);
                })}
              </React.Fragment>
            ));
          })()}
        </nav>
      </motion.aside>

      {/* MAIN PANEL */}
      <motion.div className="flex-1 flex flex-col min-w-0 relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
        
        <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 z-40 sticky top-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <Breadcrumbs pathname={pathname} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm hover:shadow">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="relative">
              <button onClick={() => setShowUserDropdown((v) => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-white text-sm shadow-sm overflow-hidden shrink-0">
                  F
                </div>
                <span className="hidden md:block text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  Founder
                </span>
                <ChevronDown size={13} className={`hidden md:block text-slate-400 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`} />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">CationGate Founder</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                      Superadmin HQ
                    </span>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                    <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                      <LogOut size={15} className="shrink-0" />
                      <span className="text-xs font-bold">Keluar Sesi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent scroll-smooth">
          <div className="mx-auto max-w-[1600px]">
            {children}
          </div>
        </main>
      </motion.div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center max-w-sm w-full mx-4">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-500">
              <LogOut size={28} />
            </div>
            <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Konfirmasi Keluar</h3>
            <div className="flex w-full gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Batal</button>
              <button onClick={confirmLogout} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f7f7] dark:bg-slate-950 flex items-center justify-center"><div className="animate-spin h-8 w-8 text-blue-500 rounded-full border-4 border-t-transparent" /></div>}>
      <FounderLayoutInner>{children}</FounderLayoutInner>
    </Suspense>
  );
}
