"use client";

import React from "react";
import { ShieldCheck, Laptop, LogOut } from "lucide-react";

interface ActiveSessionsCardProps {
  onLogoutOtherSessions: () => void;
}

export function ActiveSessionsCard({ onLogoutOtherSessions }: ActiveSessionsCardProps) {
  return (
    <div className="bg-white dark:bg-[#2e3749] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs space-y-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-white/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-white/10 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
            Keamanan Tambahan &amp; Sesi Login
          </h3>
          <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-0.5">
            Pantau dan kelola daftar perangkat yang sedang terhubung ke akun Gatekeeper.
          </p>
        </div>
      </div>

      {/* Sesi Login Aktif List */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-slate-500" /> Perangkat Terhubung (Sesi Aktif)
          </h4>
          <button
            onClick={onLogoutOtherSessions}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar dari Sesi Lain
          </button>
        </div>

        {/* Sesi 1: Perangkat Ini (Dynamic) */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900 dark:text-white text-xs">
                  {typeof window !== "undefined" && navigator.userAgent.includes("Windows")
                    ? "Chrome di Windows"
                    : typeof window !== "undefined" && navigator.userAgent.includes("Mac")
                    ? "Safari di macOS"
                    : "Browser Web"}
                </p>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-300 dark:border-slate-700">
                  Perangkat Ini
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-white/60 font-mono mt-0.5">
                IP: 103.144.18.24 • Indonesia • Aktif Sekarang
              </p>
            </div>
          </div>
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0"
            title="Online Sekarang"
          />
        </div>
      </div>
    </div>
  );
}
