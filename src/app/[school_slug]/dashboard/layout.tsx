"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import { motion } from "framer-motion";
import { ErrorView } from "@/components/features/error";
import {
  AdminSidebar,
  AdminHeader,
  LogoutConfirmModal,
} from "@/components/layout/admin-sekolah";
import TrialExpiredPopup from "@/components/TrialExpiredPopup";
import { useAuthStore } from "@/stores";
import { useSchoolHref } from "@/hooks/useSchoolHref";
import { BottomRightNotifier } from "@/components/common/BottomRightNotifier";

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
        <AdminHeader
          pathname={pathname}
          adminUser={adminUser}
          schoolSlug={schoolSlug}
          isSchoolVerified={isSchoolVerified}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onLogout={() => setShowLogoutConfirm(true)}
        />

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
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />

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
