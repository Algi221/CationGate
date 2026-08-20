"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bug,
  Home,
  Shield,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";

export default function GlobalNotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser } = usePPDB();

  let mainElement = null;

  if (pathname?.startsWith('/dashboard') && adminUser) {
    const extractedPath = pathname.substring('/dashboard'.length) || '/';

    let errorTitle = "Halaman Tidak Ditemukan";
    let errorDesc = "Halaman yang sedang Anda akses tidak ada atau telah dipindahkan.";
    let detailText = `URL yang diminta: ${extractedPath}`;

    if (extractedPath === '/profil-sekolah') {
      errorTitle = "Profil Sekolah Belum Diisi";
      errorDesc = "Anda harus melengkapi data profil sekolah terlebih dahulu sebelum mengakses halaman ini.";
      detailText = "Silahkan lengkapi profil sekolah Anda di menu Pengaturan → Utama.";
    } else if (extractedPath === '/settings/api') {
      errorTitle = "Belum Mengaktifkan API";
      errorDesc = "Halaman ini hanya dapat diakses setelah Anda mengaktifkan dan mengkonfigurasi API.";
      detailText = "Aktifkan API melalui Pengaturan → Integrasi API.";
    }

    mainElement = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 text-orange-500">
          <Bug className="w-10 h-10" />
          <h1 className="text-2xl font-bold">{errorTitle}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {errorDesc}
        </p>
        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            {detailText}
          </p>
        </div>
      </motion.div>
    );
  } else {
    mainElement = (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center">
            <Bug className="w-12 h-12 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Halaman Tidak Ditemukan</h1>
          <p className="text-muted-foreground text-lg">
            Halaman yang sedang Anda akses tidak ada atau telah dipindahkan.
          </p>
        </div>
        <p className="text-sm text-muted-foreground font-mono">
          URL: <code>{pathname}</code>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/40 rounded-lg group-hover:bg-orange-200 transition-colors">
              <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-orange-600 transition-colors">CationGate</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:text-orange-600 transition-colors group">
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="group-hover:font-medium">Beranda</span>
            </Link>
            <Link href="/daftar" className="flex items-center gap-2 hover:text-orange-600 transition-colors group">
              <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="group-hover:font-medium">Pendaftaran</span>
            </Link>
            {adminUser ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="flex items-center gap-2 hover:text-orange-600 transition-colors group">
                  <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:font-medium">Dashboard</span>
                </Link>
                <form action="/logout" method="POST">
                  <button type="submit" className="flex items-center gap-2 hover:text-orange-600 transition-colors group">
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:font-medium">Keluar</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors">Login</Link>
            )}
          </div>
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg"
            onClick={() => {
              if (pathname?.startsWith('/dashboard') && adminUser) {
                router.back();
              } else {
                router.push('/');
              }
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {mainElement}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <div className="flex justify-center items-center gap-6 mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Beranda</Link>
            <Link href="/daftar" className="hover:text-foreground transition-colors">Pendaftaran</Link>
            {adminUser && (
              <>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                <form action="/logout" method="POST">
                  <button type="submit" className="hover:text-foreground transition-colors">Keluar</button>
                </form>
              </>
            )}
          </div>
          <p>© {new Date().getFullYear()} CationGate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
