'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, Wallet, Activity, Settings, 
  ShieldCheck, ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";

interface GatekeeperSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export function GatekeeperSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isCollapsed,
  setIsCollapsed
}: GatekeeperSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname) {
      if (pathname.startsWith("/gatekeeper/dashboard/schools")) {
        setOpenDropdowns((prev) => ({ ...prev, "/gatekeeper/dashboard/schools": true }));
      } else if (pathname.startsWith("/gatekeeper/dashboard/plans")) {
        setOpenDropdowns((prev) => ({ ...prev, "/gatekeeper/dashboard/plans": true }));
      } else if (pathname.startsWith("/gatekeeper/dashboard/billing")) {
        setOpenDropdowns((prev) => ({ ...prev, "/gatekeeper/dashboard/billing": true }));
      } else if (pathname.startsWith("/gatekeeper/dashboard/services")) {
        setOpenDropdowns((prev) => ({ ...prev, "/gatekeeper/dashboard/services": true }));
      }
    }
  }, [pathname]);

  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem("ppdb-sidebar-collapsed", String(nextVal));
  };

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
            { label: "Takedown / Suspended", href: "/gatekeeper/dashboard/schools?filter=TAKEDOWN" },
          ]
        }
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
            { label: "Manajemen Paket", href: "/gatekeeper/dashboard/plans" },
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
        { href: "/gatekeeper/dashboard/settings", icon: <Settings size={18} />, label: "Pengaturan Sistem" }
      ]
    }
  ];

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
            className={`relative z-10 flex items-center justify-between rounded-2xl text-[13px] font-semibold transition-colors duration-200 border ${
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
                          className={`relative z-10 group flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-xs transition-colors duration-200 border ${
                            isSubActive
                              ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-bold"
                              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
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

  return (
    <>
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
                <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pb-1 select-none flex items-center gap-3">
                  {sec.category} <span className="flex-1 h-px bg-slate-200 dark:bg-slate-700/60"></span>
                </p>
              )}
              {isCollapsed && <div className="h-4" />}
              <div className="space-y-1">
                {sec.items.map((item) => renderMenuItem(item, idx))}
              </div>
            </div>
          ))}
        </div>
      </aside>

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
    </>
  );
}
