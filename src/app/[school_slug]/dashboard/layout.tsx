"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import _Swal from "sweetalert2";
import {
  LogOut,
  Globe,
  Menu,
  ChevronDown,
  UserCircle,
  User,
  Search,
} from "lucide-react";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { ErrorView } from "@/components/features/error";
import { AdminSidebar } from "@/components/layout/admin-sekolah/AdminSidebar";
import TrialExpiredPopup from "@/components/TrialExpiredPopup";
import { useAuthStore } from "@/stores";
import { useSchoolHref } from "@/hooks/useSchoolHref";
import { BottomRightNotifier } from "@/components/common/BottomRightNotifier";

function Breadcrumbs({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const paths = pathname.split("/").filter((p) => p);
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    admin: "Manajemen Admin",
    pendaftar: "Data Calon Siswa",
    "siswa-aktif": "Siswa Aktif",
    informasi: "Kelola Informasi",
    "kelola-ui": "Kelola UI/Data",
    "pembagian-kelas": "Pembagian Kelas",
    settings: "Pengaturan",
    profile: "Profil Saya",
  };

  const breadcrumbs: { label: string; href: string }[] = [];
  let currentPath = "";

  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    if (
      index === 0 &&
      ![
        "dashboard",
        "admin",
        "pendaftar",
        "siswa-aktif",
        "informasi",
        "kelola-ui",
        "pembagian-kelas",
        "settings",
        "profile",
      ].includes(segment)
    ) {
      return;
    }
    const label = labelMap[segment] || segment;
    const href = currentPath;
    breadcrumbs.push({ label, href });
  });

  if (pathname.includes("/dashboard/admin") && activeTab === "trash")
    breadcrumbs.push({
      label: "Sampah",
      href: `${paths[0] ? "/" + paths[0] : ""}/dashboard/admin?tab=trash`,
    });
  else if (pathname.includes("/dashboard/pendaftar") && activeTab === "trash")
    breadcrumbs.push({
      label: "Sampah",
      href: `${paths[0] ? "/" + paths[0] : ""}/dashboard/pendaftar?tab=trash`,
    });

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 font-medium tracking-wide select-none">
      {breadcrumbs.map((bc, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <span className="text-slate-300 dark:text-slate-700">›</span>
            )}
            {isLast ? (
              <span className="text-slate-600 dark:text-slate-300 font-semibold">
                {bc.label}
              </span>
            ) : (
              <Link
                href={bc.href}
                className="hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400 transition-colors"
              >
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
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { href } = useSchoolHref();
  const { adminToken, adminUser, logoutAdmin, schoolStatus, isSchoolNotFound } =
    usePPDB();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const schoolSlugRaw =
    (params?.school_slug as string) ||
    (pathname?.startsWith("/demo") ? "demo" : "");
  const schoolSlug = schoolSlugRaw
    ? schoolSlugRaw.replace(/[^a-zA-Z0-9-]/g, "")
    : "demo";

  const isSchoolVerified =
    schoolStatus === "verified" ||
    schoolStatus === "VERIFIED" ||
    schoolStatus === "FULL_VERIFIED" ||
    Boolean(adminUser?.is_verified) ||
    schoolSlug === "smktarunabhakti" ||
    schoolSlug === "smktiglobal" ||
    schoolSlug === "demo";

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [isCollapsed, setIsCollapsed] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("ppdb-sidebar-collapsed") === "true"
      : false,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [_hoveredItem, _setHoveredItem] = useState<string | null>(null);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const searchableMenus = [
    { title: "Ringkasan", desc: "Ringkasan & Metrik Pendaftaran", href: href("/dashboard") },
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

  // ── Close dropdowns on outside click ─────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [_openDropdowns, _setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );

  // ── Auto-open dropdown for current active sections ─────────────────────────
  useEffect(() => {
    if (pathname) {
      // Logic handled in AdminSidebar
    }
  }, [pathname]);

  const _handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem("ppdb-sidebar-collapsed", String(nextVal));
  };

  const getTimeoutDuration = () => {
    if (typeof window === "undefined") return 60 * 60 * 1000;
    const saved = localStorage.getItem("ppdb_session_timeout");
    if (!saved) return 60 * 60 * 1000;
    const minutes = parseInt(saved, 10);
    return isNaN(minutes) ? 60 * 60 * 1000 : minutes * 60 * 1000;
  };

  const redirectToRootLogin = (expired = false) => {
    logoutAdmin();
    if (typeof window !== "undefined") {
      const host = window.location.host.toLowerCase();
      const isLocalhost = host.includes("localhost");
      const port = window.location.port ? `:${window.location.port}` : "";
      const rootUrl = isLocalhost
        ? `http://localhost${port}`
        : "https://cationgate.site";
      window.location.href = `${rootUrl}/login${expired ? "?expired=true" : ""}`;
    }
  };

  useEffect(() => {
    const tokenFromUrl = searchParams?.get("auth_token");
    if (tokenFromUrl) {
      localStorage.setItem("ppdb_admin_token", tokenFromUrl);
      localStorage.setItem("ppdb_admin_last_active", Date.now().toString());
      useAuthStore.getState().setAdminToken(tokenFromUrl);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (mounted) {
      if (schoolSlug === "demo") return; // Bypass auth for demo
      const token = localStorage.getItem("ppdb_admin_token");
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (token && lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        const limit = getTimeoutDuration();
        if (elapsed > limit) {
          redirectToRootLogin(true);
          return;
        }
      }
      if (!adminToken) {
        if (localStorage.getItem("ppdb_admin_token")) {
          return; // Allow context state to finish syncing without kicking the user
        }
        redirectToRootLogin(false);
        return;
      }

      // ── Verification Redirection & Route Lockdown ──────────────────────
      const isVerificationPage = pathname?.includes("/dashboard/verification");

      if (isSchoolVerified && isVerificationPage) {
        // If already verified, close the verification route and send straight to dashboard
        router.replace(href("/dashboard"));
        return;
      }

      if (schoolSlug !== "smktarunabhakti" && schoolSlug !== "smktiglobal" && !isSchoolVerified) {
        const isUnverified =
          schoolStatus === "UNVERIFIED" ||
          schoolStatus === "REJECTED";

        if (isUnverified && !isVerificationPage) {
          router.push(href("/dashboard/verification"));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, mounted, schoolStatus, schoolSlug, pathname, isSchoolVerified]);

  useEffect(() => {
    if (!adminToken) return;
    let timeoutId: NodeJS.Timeout;
    let lastStorageUpdate = Date.now();
    const resetTimer = () => {
      clearTimeout(timeoutId);
      const limit = getTimeoutDuration();
      timeoutId = setTimeout(() => {
        redirectToRootLogin(true);
      }, limit);
      const now = Date.now();
      if (now - lastStorageUpdate > 10000) {
        localStorage.setItem("ppdb_admin_last_active", now.toString());
        lastStorageUpdate = now;
      }
    };
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    resetTimer();
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    return () => {
      clearTimeout(timeoutId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, pathname, schoolSlug]);

  const handleLogout = () => {
    setShowUserDropdown(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    redirectToRootLogin(false);
  };

  if (!mounted) return null;
  if (
    isSchoolNotFound ||
    schoolStatus === "TAKEDOWN" ||
    schoolStatus === "SUSPENDED"
  ) {
    const isTakedown =
      schoolStatus === "TAKEDOWN" || schoolStatus === "SUSPENDED";
    return (
      <ErrorView
        title={
          isTakedown
            ? "Akses Instansi Ditangguhkan 🔒"
            : "Halaman Tidak Ditemukan"
        }
        description={
          isTakedown
            ? `Portal instansi '/${schoolSlug || ""}' telah ditangguhkan oleh Gatekeeper CationGate karena belum melengkapi verifikasi legalitas & SK operasional.`
            : `Maaf, halaman instansi '${schoolSlug || ""}' tidak dapat ditemukan atau belum terdaftar di platform CationGate.`
        }
        urlPath={href("/")}
        ctaText="Kembali ke Beranda CationGate"
        ctaHref="/"
      />
    );
  }
  if (!adminToken && schoolSlug !== "demo") {
    return (
      <div className="min-h-screen bg-[#f7f7f7] dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-white transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">
            Memeriksa status otentikasi...
          </span>
        </div>
      </div>
    );
  }

  const _userInitial = adminUser?.nama
    ? adminUser.nama.charAt(0).toUpperCase()
    : "A";

  return (
    <div
      data-dashboard
      className="h-screen bg-[#f7f7f7] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex font-sans overflow-hidden transition-colors duration-300"
    >
      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* ── MAIN PANEL ──────────────────────────────────────────────────────── */}
      <motion.div
        className="flex-1 flex flex-col min-w-0 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Top Header */}
        <motion.header
          className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between px-4 md:px-8 shrink-0 z-40 sticky top-0 transition-colors duration-300"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 -ml-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
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

          <motion.div
            className="flex items-center gap-2"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {/* Global Search Bar */}
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

            {/* Theme toggle */}
            <ToggleTheme
              animationType="circle-spread"
              duration={1000}
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow text-slate-500 dark:text-slate-400"
            />

            {/* ── User Avatar Dropdown ──────────────────────────────────── */}
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
                    <User
                      size={16}
                      className="text-slate-500 dark:text-slate-400"
                    />
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

              {/* Dropdown */}
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
                      <UserCircle
                        size={15}
                        className="text-slate-400 shrink-0"
                      />
                      <span className="text-xs font-semibold">Profil Saya</span>
                    </Link>
                    <Link
                      href={href("/")}
                      target="_blank"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      <Globe size={15} className="text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold">
                        Lihat Website
                      </span>
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut size={15} className="shrink-0" />
                      <span className="text-xs font-bold">Keluar Sesi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent scroll-smooth">
          <motion.div
            className="mx-auto max-w-[1600px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      {/* ── Trial Expired Popup ──────────────────────────────────────────── */}
      <TrialExpiredPopup />

      {/* ── Logout Confirmation Modal ──────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center max-w-sm w-full mx-4 backdrop-blur-xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-500 border border-rose-100 dark:border-rose-900/40 shadow-inner">
              <LogOut size={28} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">
                Konfirmasi Keluar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Apakah Anda yakin ingin keluar dari sesi admin portal PPDB? Anda
                perlu memasukkan kredensial lagi untuk masuk.
              </p>
            </div>
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 py-3 bg-linear-to-tr from-[#f43f5e] to-[#e11d48] hover:from-[#fb7185] hover:to-[#f43f5e] text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow shadow-rose-500/30 hover:shadow-rose-500/50 transition-all cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom-Right Notifications for School Admin */}
      <BottomRightNotifier />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-slate-950 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 text-blue-500 rounded-full border-4 border-t-transparent" />
        </div>
      }
    >
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}
