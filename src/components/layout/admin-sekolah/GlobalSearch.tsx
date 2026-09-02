"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchoolHref } from "@/hooks/useSchoolHref";

export function GlobalSearch() {
  const { href } = useSchoolHref();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchableMenus = [
    {
      title: "Ringkasan",
      desc: "Ringkasan & Metrik Pendaftaran",
      href: href("/dashboard"),
    },
    {
      title: "Verifikasi Sekolah",
      desc: "Status verifikasi berkas legalitas instansi",
      href: href("/dashboard/verification"),
    },
    {
      title: "Data Calon Siswa",
      desc: "Daftar seluruh calon siswa baru",
      href: href("/dashboard/pendaftar?tab=active"),
    },
    {
      title: "Pendaftar Pindahan",
      desc: "Calon siswa mutasi / pindahan kelas XI & XII",
      href: href("/dashboard/pendaftar?tab=transfer"),
    },
    {
      title: "Kuota & Target Jalur",
      desc: "Kelola kuota pendaftaran jurusan",
      href: href("/dashboard/pendaftar?tab=kuota"),
    },
    {
      title: "Tempat Sampah Siswa",
      desc: "Data calon siswa yang dihapus sementara",
      href: href("/dashboard/pendaftar?tab=trash"),
    },
    {
      title: "Pembagian Kelas",
      desc: "Pengelompokan kelas otomatis calon siswa",
      href: href("/dashboard/pembagian-kelas"),
    },
    {
      title: "Siswa Aktif",
      desc: "Data siswa aktif & ekspor/impor excel",
      href: href("/dashboard/siswa-aktif"),
    },
    {
      title: "Kelola Informasi",
      desc: "Pengumuman & berita sekolah",
      href: href("/dashboard/informasi"),
    },
    {
      title: "Profil Sekolah",
      desc: "Identitas, visi misi, & struktur organisasi",
      href: href("/dashboard/profil-sekolah"),
    },
    {
      title: "Kelola UI/Data",
      desc: "Kustomisasi landing page & kejuruan",
      href: href("/dashboard/kelola-ui"),
    },
    {
      title: "Kelola Subscription",
      desc: "Tagihan, paket, & lisensi sekolah",
      href: href("/dashboard/subscription"),
    },
    {
      title: "Manajemen Admin",
      desc: "Kelola akun administrator sekolah",
      href: href("/dashboard/admin"),
    },
  ];

  const searchResults = searchableMenus.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative hidden md:flex items-center mr-2 z-50"
      ref={searchRef}
    >
      <div className="absolute left-3 text-slate-400">
        <Search size={14} />
      </div>
      <input
        type="text"
        placeholder="Cari menu (Ctrl+K)"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsSearchOpen(true);
        }}
        onFocus={() => setIsSearchOpen(true)}
        className="w-48 lg:w-56 h-9 pl-9 pr-3 text-xs font-bold bg-slate-100 dark:bg-[#1e293b]/80 border border-slate-200 dark:border-slate-700/60 rounded-full focus:outline-none focus:ring-2 focus:ring-dark-blue/30 dark:focus:ring-yellow/20 text-slate-700 dark:text-slate-300 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
      <AnimatePresence>
        {isSearchOpen && searchQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 left-0 w-64 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-100"
          >
            <div className="max-h-64 overflow-y-auto p-2">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <Link
                    key={idx}
                    href={encodeURI(item.href)}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex flex-col px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group"
                  >
                    <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-dark-blue dark:group-hover:text-yellow">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  Tidak ditemukan &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
