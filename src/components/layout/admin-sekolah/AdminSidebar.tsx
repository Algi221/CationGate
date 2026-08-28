"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import {
  LayoutDashboard, Users,
  Megaphone, GraduationCap, ChevronLeft, ChevronRight,
  Palette, Layers, Shield, ChevronDown, ShieldCheck, CreditCard
} from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";
import { useSchoolHref } from "@/hooks/useSchoolHref";

interface SubMenuItem {
  href: string;
  label: string;
}

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
  lockedIfUnverified?: boolean;
  superAdminOnly?: boolean;
  subItems?: SubMenuItem[];
}

interface AdminSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export function AdminSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isCollapsed,
  setIsCollapsed
}: AdminSidebarProps) {
  const { adminUser, schoolStatus, ppdbLogo, ppdbTitle } = usePPDB();
  const { href } = useSchoolHref();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || (pathname?.startsWith('/demo') ? 'demo' : '');

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cationgate_sidebar_open_dropdowns");
        if (saved) return JSON.parse(saved);
      } catch (_e) {}
    }
    return {};
  });

  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem("ppdb-sidebar-collapsed", String(nextVal));
  };

  const isLegalVerified =
    schoolStatus === 'FULL_VERIFIED' ||
    schoolStatus === 'VERIFIED' ||
    schoolStatus === 'verified' ||
    schoolSlug === 'demo' ||
    schoolSlug === 'smktarunabhakti' ||
    schoolSlug === 'smktiglobal';

  const menuStructure = !isLegalVerified
    ? [
        {
          category: "Status Legalitas",
          items: [
            { href: href("/dashboard/verification"), icon: <ShieldCheck size={18} />, label: "Verifikasi Sekolah", exact: true }
          ]
        }
      ]
    : [
        {
          category: "Manajemen Siswa",
          items: [
            { href: href("/dashboard"), icon: <LayoutDashboard size={18} />, label: "Ringkasan", exact: true, lockedIfUnverified: true },
            {
              href: href("/dashboard/pendaftar"),
              icon: <Users size={18} />,
              label: "Data Calon Siswa",
              lockedIfUnverified: true,
              subItems: [
                { label: "Pendaftar Reguler", href: href("/dashboard/pendaftar?tab=active") },
                { label: "Pendaftar Pindahan", href: href("/dashboard/pendaftar?tab=transfer") },
                { label: "Kuota & Target", href: href("/dashboard/pendaftar?tab=kuota") },
                { label: "Tempat Sampah", href: href("/dashboard/pendaftar?tab=trash") }
              ]
            },
            { href: href("/dashboard/pembagian-kelas"), icon: <Layers size={18} />, label: "Pembagian Kelas", lockedIfUnverified: true },
            { href: href("/dashboard/siswa-aktif"), icon: <GraduationCap size={18} />, label: "Siswa Aktif", lockedIfUnverified: true }
          ]
        },
        {
          category: "Konten Portal",
          items: [
            { href: href("/dashboard/informasi"), icon: <Megaphone size={18} />, label: "Kelola Informasi", lockedIfUnverified: true },
            {
              href: href("/dashboard/kelola-ui"),
              icon: <Palette size={18} />,
              label: "Kelola UI/Data",
              lockedIfUnverified: true,
              subItems: [
                { label: "Profil Sekolah", href: href("/dashboard/profil-sekolah") },
                { label: "General / Umum", href: href("/dashboard/kelola-ui?tab=hero") },
                { label: "Program Keahlian", href: href("/dashboard/kelola-ui?tab=majors") },
                { label: "Alur Pendaftaran", href: href("/dashboard/kelola-ui?tab=alur") },
                { label: "Form & Panduan", href: href("/dashboard/kelola-ui?tab=form") },
                { label: "Bank Sekolah", href: href("/dashboard/kelola-ui?tab=bank") },
                { label: "Mitra Industri", href: href("/dashboard/kelola-ui?tab=partners") },
                { label: "FAQ", href: href("/dashboard/kelola-ui?tab=faq") },
                { label: "Riwayat Perubahan", href: href("/dashboard/kelola-ui?tab=revisions") }
              ]
            },
          ]
        },
        {
          category: "Pengaturan Sistem",
          items: [
            { href: href("/dashboard/subscription"), icon: <CreditCard size={18} />, label: "Kelola Subscription", lockedIfUnverified: true },
<<<<<<< HEAD
            { href: href("/dashboard/admin"), icon: <Shield size={18} />, label: "Manajemen Admin", superAdminOnly: true, lockedIfUnverified: true },
            // { href: href("/dashboard/settings"), icon: <Settings size={18} />, label: "Pengaturan Akun", lockedIfUnverified: true }
=======
            { href: href("/dashboard/admin"), icon: <Shield size={18} />, label: "Manajemen Admin", superAdminOnly: true, lockedIfUnverified: true }
>>>>>>> 3d8d933376ece96863107b39057f19e3806a2461
          ]
        }
      ];

  const renderMenuItem = (item: MenuItem, delayIndex: number) => {
    const fullHref = item.href;
    const hasSub = !!item.subItems;
    const isAnySubActive = hasSub && item.subItems?.some((sub) => {
      const [subPath] = sub.href.split("?");
      return pathname === subPath || (subPath !== "/" && pathname?.startsWith(subPath));
    });
    const isParentActive = pathname === fullHref || pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
    const isOpen = openDropdowns[item.href] !== undefined
      ? openDropdowns[item.href]
      : (isAnySubActive || isParentActive || false);
    const isLocked = (!isLegalVerified && item.lockedIfUnverified) || schoolStatus === 'TAKEDOWN' || schoolStatus === 'SUSPENDED';
    const isActive = item.exact
      ? pathname === fullHref || pathname === item.href
      : pathname === fullHref || pathname === item.href || (item.href !== "/" && pathname?.startsWith(fullHref + "/"));

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
            router.push(href("/dashboard/verification"));
          }
        });
        return;
      }

      if (hasSub) {
        e.preventDefault();
        const nextState = !isOpen;
        if (isCollapsed) {
          setIsCollapsed(false);
          localStorage.setItem("ppdb-sidebar-collapsed", "false");
        }
        setOpenDropdowns((prev) => {
          const updated = { ...prev, [item.href]: nextState };
          try {
            localStorage.setItem("cationgate_sidebar_open_dropdowns", JSON.stringify(updated));
          } catch (_err) {}
          return updated;
        });
      } else {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    const handleSubClick = (e: React.MouseEvent) => {
      if (isLocked) {
        e.preventDefault();
        return;
      }
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
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
              className="absolute inset-0 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100/50 dark:border-blue-900/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            />
          )}
          <Link
            href={isLocked ? "#" : fullHref}
            onClick={handleItemClick}
            className={`relative z-10 flex items-center justify-between rounded-xl text-sm font-semibold transition-colors duration-200 ${
              isCollapsed ? "justify-center p-3" : "px-4 py-2.5"
            } ${
              isLocked
                ? "opacity-35 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none hover:bg-transparent"
                : isActive && (!hasSub || isCollapsed)
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-xs border border-blue-100 dark:border-blue-900/50"
                : "text-slate-600 dark:text-slate-300 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
            title={isCollapsed ? (isLocked ? `${item.label} (Terkunci)` : item.label) : undefined}
          >
            <div className="flex items-center min-w-0">
              <span className="shrink-0">{item.icon}</span>
              <span
                className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                  isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-50 opacity-100 ml-3"
                }`}
              >
                {item.label}
              </span>
            </div>
            {hasSub && !isCollapsed && !isLocked ? (
              <ChevronDown
                size={14}
                className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 shrink-0 ml-2 ${
                  isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                }`}
              />
            ) : null}
          </Link>
        </div>

        {/* Render submenu items */}
        {hasSub && item.subItems && (
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
                  {item.subItems.map((sub: SubMenuItem) => {
                    const fullSubHref = sub.href;
                    const defaultTab = sub.href.includes("pendaftar") ? "active" : "hero";
                    const urlParams = new URLSearchParams(sub.href.split("?")[1] || "");
                    const tabVal = urlParams.get("tab");
                    const isSubActive =
                      (pathname === fullSubHref.split("?")[0] || pathname === sub.href.split("?")[0]) &&
                      tabVal === (currentTab || defaultTab);

                    return (
                      <Link
                        key={sub.href}
                        href={isLocked ? "#" : fullSubHref}
                        onClick={handleSubClick}
                        className={`block px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isLocked
                            ? "opacity-35 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none hover:bg-transparent"
                            : isSubActive
                            ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-100/80 dark:border-blue-900/40"
                            : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
                        }`}
                      >
                        {sub.label}
                      </Link>
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

  const sectionHeader = (label: string) => (
    <div className="flex items-center py-2 overflow-hidden min-h-8">
      <div className={`flex items-center w-full transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-4 gap-2"}`}>
        <span className={`text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest select-none transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
          isCollapsed ? "max-w-0 opacity-0" : "max-w-37.5 opacity-100"
        }`}>
          {label}
        </span>
        <div className={`h-px bg-slate-300 dark:bg-slate-700 transition-all duration-300 ${isCollapsed ? "w-8" : "flex-1"}`} />
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen bg-white dark:bg-[#0f172a] border-r border-slate-300 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      } ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Toggle Collapse Button */}
        <button
          onClick={handleToggleCollapse}
          className="hidden md:flex absolute top-6 -right-4 w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 items-center justify-center transition-all duration-300 shadow-sm z-50 hover:scale-110 cursor-pointer"
          title={isCollapsed ? "Perluas Sidebar" : "Sembunyikan Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Brand Header */}
        <div className={`py-4 flex items-center border-b border-slate-300 dark:border-slate-700 min-h-18.25 transition-all duration-300 ${
          isCollapsed ? "justify-center px-0" : "px-5"
        }`}>
          <Link href={href("/dashboard")} className="flex items-center group">
            {ppdbLogo && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={ppdbLogo || undefined}
                alt="Logo Sekolah"
                className="w-9 h-9 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col min-w-0 ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-37.5 opacity-100 ml-3"
            }`}>
              <h2 className="text-sm font-black tracking-wider leading-none text-slate-800 dark:text-white uppercase whitespace-nowrap">
                {ppdbTitle ? ppdbTitle.replace(/^(ppdb\s+)/i, '') : "SMK TB"}
              </h2>
              <span className="text-[10px] text-[#2e3749] dark:text-[#FFD33B] font-bold uppercase tracking-widest mt-1 block whitespace-nowrap">PPDB Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "px-2" : "px-4"
        }`}>
          {(() => {
            let delayIndex = 0;
            const isSchoolSuperAdmin =
              adminUser?.role === "superadmin" ||
              !adminUser?.role ||
              adminUser?.role === "admin";

            return menuStructure.map((section) => (
              <React.Fragment key={section.category}>
                {sectionHeader(section.category)}
                {section.items.map((item) => {
                  if (item.superAdminOnly && !isSchoolSuperAdmin) return null;
                  delayIndex++;
                  return renderMenuItem(item, delayIndex);
                })}
              </React.Fragment>
            ));
          })()}
        </nav>

      </motion.aside>

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
              className="fixed inset-y-0 left-0 w-70 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col md:hidden shadow-2xl"
            >
              <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#2e3749] text-white flex items-center justify-center font-bold">
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
