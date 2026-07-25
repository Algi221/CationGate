"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard, Building, CreditCard, Settings, LogOut, 
  Sun, Moon, Menu, X, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pathname === "/founder/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { label: "Ringkasan", icon: LayoutDashboard, href: "/founder/dashboard" },
    { label: "Data Sekolah", icon: Building, href: "/founder/schools" },
    { label: "Paket Langganan", icon: CreditCard, href: "/founder/packages" },
    { label: "Pengaturan Sistem", icon: Settings, href: "/founder/settings" },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#111827] text-white border-r border-slate-800 w-64 shrink-0 transition-all">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-sm">CG</div>
        <div>
          <h1 className="font-bold text-sm tracking-wide">CationGate</h1>
          <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">Founder Portal</p>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Manajemen SaaS</p>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.label} href={item.href} onClick={() => setSidebarOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive ? "bg-blue-600/10 text-blue-400 font-medium" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}>
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link href="/founder/login">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Keluar</span>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar Mobile & Desktop */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-semibold hidden md:block">
              {menuItems.find(m => pathname.startsWith(m.href))?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold tracking-widest uppercase">Sistem Aktif</span>
            </div>

            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
              <Bell className="w-5 h-5" />
            </Button>

            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}

            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Founder`} alt="Avatar" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold">Admin Pusat</p>
                <p className="text-[10px] text-slate-500">Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-[#0b1120]">
          {children}
        </main>
      </div>
    </div>
  );
}
