"use client";

import React, { Suspense } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { Breadcrumbs } from "./Breadcrumbs";
import { GlobalSearch } from "./GlobalSearch";
import { AdminUserDropdown } from "./AdminUserDropdown";

interface AdminHeaderProps {
  pathname: string;
  adminUser?: {
    nama?: string;
    username?: string;
    foto_profil?: string;
    is_verified?: boolean;
  } | null;
  schoolSlug: string;
  isSchoolVerified: boolean;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  pathname,
  adminUser,
  schoolSlug,
  isSchoolVerified,
  onOpenMobileMenu,
  onLogout,
}: AdminHeaderProps) {
  return (
    <motion.header
      className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between px-4 md:px-8 shrink-0 z-40 sticky top-0 transition-colors duration-300"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
    >
      {/* Left side: Mobile menu toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-1.5 -ml-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          onClick={onOpenMobileMenu}
          aria-label="Buka Menu"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <Suspense
            fallback={
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            }
          >
            <Breadcrumbs pathname={pathname} />
          </Suspense>
        </div>
      </div>

      {/* Right side: Search + Theme Toggle + User Profile */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <GlobalSearch />

        <ToggleTheme
          animationType="circle-spread"
          duration={1000}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow text-slate-500 dark:text-slate-400 cursor-pointer"
        />

        <AdminUserDropdown
          adminUser={adminUser}
          schoolSlug={schoolSlug}
          isSchoolVerified={isSchoolVerified}
          onLogout={onLogout}
        />
      </motion.div>
    </motion.header>
  );
}
