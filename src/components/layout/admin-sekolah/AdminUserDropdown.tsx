"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ChevronDown, UserCircle, Globe, LogOut } from "lucide-react";
import { useSchoolHref } from "@/hooks/useSchoolHref";

interface AdminUserDropdownProps {
  adminUser?: {
    nama?: string;
    username?: string;
    foto_profil?: string;
    is_verified?: boolean;
  } | null;
  schoolSlug: string;
  isSchoolVerified: boolean;
  onLogout: () => void;
}

export function AdminUserDropdown({
  adminUser,
  schoolSlug,
  isSchoolVerified,
  onLogout,
}: AdminUserDropdownProps) {
  const { href } = useSchoolHref();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowUserDropdown(false);
    onLogout();
  };

  return (
    <div className="relative" ref={userDropdownRef}>
      <button
        onClick={() => setShowUserDropdown((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-800 transition-all"
      >
        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 text-sm shadow-sm overflow-hidden shrink-0">
          {adminUser?.foto_profil ? (
            <Image
              src={adminUser.foto_profil}
              alt="Profil"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <User size={16} className="text-slate-500 dark:text-slate-400" />
          )}
        </div>
        <span className="hidden md:block text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
          {adminUser?.nama?.split(" ")[0] || "Admin"}
        </span>
        <ChevronDown
          size={13}
          className={`hidden md:block text-slate-400 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {showUserDropdown && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 text-base shadow-sm shrink-0 overflow-hidden">
                {adminUser?.foto_profil ? (
                  <Image
                    src={adminUser.foto_profil}
                    alt="Profil"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User
                    size={18}
                    className="text-slate-500 dark:text-slate-400"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                  {adminUser?.nama ||
                    (schoolSlug
                      ? `Admin ${schoolSlug.toUpperCase()}`
                      : "Admin Sekolah")}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  @
                  {adminUser?.username ||
                    (schoolSlug ? `admin_${schoolSlug}` : "admin")}
                </p>
                <span
                  className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                    isSchoolVerified
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                      : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                  }`}
                >
                  {isSchoolVerified
                    ? "✓ Akun Official Sekolah"
                    : "UNVERIFIED"}
                </span>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href={href("/dashboard/profile")}
              onClick={() => setShowUserDropdown(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <UserCircle size={15} className="text-slate-400 shrink-0" />
              <span className="text-xs font-semibold">Profil Saya</span>
            </Link>
            <Link
              href={href("/")}
              target="_blank"
              onClick={() => setShowUserDropdown(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <Globe size={15} className="text-slate-400 shrink-0" />
              <span className="text-xs font-semibold">Lihat Website</span>
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-slate-100 dark:border-slate-800 py-1">
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut size={15} className="shrink-0" />
              <span className="text-xs font-bold">Keluar Sesi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
