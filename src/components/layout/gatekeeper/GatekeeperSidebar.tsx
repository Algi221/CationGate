'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, Wallet, Activity, Settings, 
  ChevronDown, PanelLeftClose
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
      } else if (pathname.startsWith("/gatekeeper/dashboard/plans") || pathname.startsWith("/gatekeeper/dashboard/billing")) {
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

  const expandSidebar = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      localStorage.setItem("ppdb-sidebar-collapsed", "false");
    }
  };

  const menuStructure = [
    {
      category: "MANAJEMEN SAAS",
      items: [
        { href: "/gatekeeper/dashboard", icon: <LayoutDashboard size={18} />, label: "Ringkasan Platform", exact: true },
        {
          href: "/gatekeeper/dashboard/schools",
          icon: <Building2 size={18} />,
          label: "Manajemen Sekolah",
          subItems: [
            { label: "Semua Subdomain", href: "/gatekeeper/dashboard/schools" },
            { label: "Verifikasi Berkas SK", href: "/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION" },
            { label: "Belum Verifikasi", href: "/gatekeeper/dashboard/schools?filter=UNVERIFIED" },
            { label: "Sekolah Aktif (Verified)", href: "/gatekeeper/dashboard/schools?filter=FULL_VERIFIED" },
          ]
        }
      ]
    },
    {
      category: "KEUANGAN & LANGGANAN",
      items: [
        {
          href: "/gatekeeper/dashboard/billing",
          icon: <Wallet size={18} />,
          label: "Billing & Paket",
          subItems: [
            { label: "Manajemen Paket", href: "/gatekeeper/dashboard/billing/packages" },
            { label: "Riwayat Transaksi", href: "/gatekeeper/dashboard/billing/transactions" },
          ]
        }
      ]
    },
    {
      category: "LAYANAN PLATFORM",
      items: [
        {
          href: "/gatekeeper/dashboard/services",
          icon: <Activity size={18} />,
          label: "Layanan & Log",
          subItems: [
            { label: "Log Sistem & Vercel Realtime", href: "/gatekeeper/dashboard/services/logs" },
          ]
        }
      ]
    },
    {
      category: "Pengaturan",
      items: [
        { href: "/gatekeeper/dashboard/settings", icon: <Settings size={18} />, label: "Pengaturan Sistem" }
      ]
    }
  ];

  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
  const renderMenuItem = (item: any, delayIndex: number) => {
    const fullHref = item.href;
    const hasSub = !!item.subItems;
    const isOpen = !!openDropdowns[item.href];
    const isActive = item.exact
      ? pathname === fullHref
      : pathname === fullHref || pathname.startsWith(fullHref + "/");

    const currentFilter = searchParams ? searchParams.get("filter") : null;

    const handleItemClick = (e: React.MouseEvent) => {
      if (isCollapsed) {
        expandSidebar();
      }
      if (hasSub) {
        e.preventDefault();
        setOpenDropdowns((prev) => ({ ...prev, [item.href]: !prev[item.href] }));
      }
    };

    return (
      <motion.div
        key={item.href}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delayIndex * 0.03, duration: 0.2 }}
        className="w-full flex flex-col items-center"
      >
        <div
          className="relative w-full my-0.5 flex justify-center"
          onMouseEnter={() => {
            setHoveredItem(item.href);
            expandSidebar();
          }}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {hoveredItem === item.href && !isActive && (
            <motion.div
              layoutId="sidebar-hover"
              className="absolute inset-0 bg-slate-200/60 dark:bg-white/10 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          
          <Link
            href={fullHref}
            onClick={handleItemClick}
            className={`relative z-10 flex items-center transition-all duration-200 ${
              isCollapsed 
                ? "justify-center w-10 h-10 rounded-full p-0" 
                : "justify-between w-full px-3.5 py-2.5 rounded-full text-[13px]"
            } ${
              isActive
                ? "bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] font-bold shadow-md shadow-[#FFD33B]/20"
                : "text-zinc-600 dark:text-zinc-400 hover:text-[#2e3749] dark:hover:text-[#FFD33B] font-medium"
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : "min-w-0"}`}>
              <span className="shrink-0 flex items-center justify-center">{item.icon}</span>
              {!isCollapsed && (
                <span className="truncate ml-3 whitespace-nowrap">{item.label}</span>
              )}
            </div>
            {hasSub && !isCollapsed && (
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 shrink-0 ml-2 ${
                  isOpen ? (isActive ? "rotate-180 text-[#2e3749]" : "rotate-180 text-[#FFD33B]") : "text-zinc-400"
                }`}
              />
            )}
          </Link>
        </div>

        {/* Submenu Tanpa Garis Bawah/Tepi */}
        {hasSub && (
          <AnimatePresence initial={false}>
            {isOpen && !isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden w-full pl-6 my-1 space-y-1"
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {item.subItems.map((sub: any) => {
                  const fullSubHref = sub.href;
                  const urlParams = new URLSearchParams(sub.href.split("?")[1] || "");
                  const filterVal = urlParams.get("filter");
                  const isSubActive =
                    (pathname === fullSubHref.split("?")[0]) &&
                    (filterVal ? currentFilter === filterVal : true);

                  return (
                    <Link
                      key={sub.href}
                      href={fullSubHref}
                      className={`block py-2 px-3 rounded-full text-[12px] transition-all ${
                        isSubActive
                          ? "bg-slate-200 dark:bg-white/10 text-[#2e3749] dark:text-[#FFD33B] font-bold"
                          : "text-zinc-500 hover:text-[#2e3749] dark:hover:text-[#FFD33B]"
                      }`}
                    >
                      <span className="truncate block">{sub.label}</span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <>
      {/* ─── SIDEBAR DESKTOP ────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 p-3 transition-all duration-300 z-30 select-none shrink-0 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="w-full h-full bg-slate-50/90 dark:bg-[#2e3749]/95 border border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-3xl flex flex-col items-center overflow-hidden shadow-sm">
          
          {/* Header Single Logo & Toggle */}
          <div className={`w-full pt-4 px-3 pb-2 flex items-center ${isCollapsed ? "justify-center" : "justify-between"} shrink-0`}>
            <div 
              className="flex items-center gap-2.5 cursor-pointer" 
              onClick={expandSidebar}
            >
              <div className="w-8 h-8 rounded-xl bg-[#2e3749] p-1 flex items-center justify-center shrink-0 border border-white/10 shadow-xs">
                <Image
                  src="/assets/logo_cationgate/CationGate_Logo.png"
                  alt="CationGate Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              {!isCollapsed && (
                <span className="font-extrabold text-sm tracking-tight text-[#2e3749] dark:text-white">
                  Cation<span className="text-[#FFD33B]">Gate</span>
                </span>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleToggleCollapse}
                className="w-8 h-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-[#2e3749] dark:hover:text-[#FFD33B] transition-colors shrink-0"
                title="Collapse Sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            )}
          </div>

          {/* Nav Items */}
          <div className="w-full flex-1 py-2 px-2.5 overflow-y-auto space-y-4 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {menuStructure.map((sec, idx) => (
              <div key={sec.category} className="w-full space-y-1 flex flex-col items-center">
                {!isCollapsed && (
                  <p className="w-full px-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-white/40 uppercase py-1">
                    {sec.category}
                  </p>
                )}
                {sec.items.map((item) => renderMenuItem(item, idx))}
              </div>
            ))}
          </div>
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
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 p-3 z-50 flex flex-col md:hidden"
            >
              <div className="w-full h-full bg-slate-50 dark:bg-[#2e3749] border border-slate-200 dark:border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
                <div className="p-4 flex items-center justify-between border-b border-slate-200/50 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#2e3749] p-0.5 overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                      <Image
                        src="/assets/logo_cationgate/CationGate_Logo.png"
                        alt="CationGate Logo"
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-extrabold text-sm tracking-tight text-[#2e3749] dark:text-white">
                      Cation<span className="text-[#FFD33B]">Gate</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-zinc-500 hover:text-[#2e3749] dark:hover:text-[#FFD33B]"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 p-2.5 overflow-y-auto space-y-4">
                  {menuStructure.map((sec, idx) => (
                    <div key={sec.category} className="space-y-1">
                      <p className="px-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-white/40 uppercase">
                        {sec.category}
                      </p>
                      {sec.items.map((item) => renderMenuItem(item, idx))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}