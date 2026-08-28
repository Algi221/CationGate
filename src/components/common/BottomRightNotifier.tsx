"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, UserPlus, ShieldAlert, CheckCircle2, 
  X, ArrowRight, BellRing
} from "lucide-react";
import { useSchoolHref } from "@/hooks/useSchoolHref";

export interface LiveNotification {
  id: string;
  type: "SCHOOL_REGISTERED" | "VERIFICATION_SUBMITTED" | "VERIFICATION_APPROVED" | "STUDENT_REGISTERED";
  title: string;
  message: string;
  timestamp: string;
  actionText?: string;
  actionHref?: string;
}

export function BottomRightNotifier() {
  const pathname = usePathname();
  const router = useRouter();
  const { href } = useSchoolHref();
  const [currentNotification, setCurrentNotification] = useState<LiveNotification | null>(null);

  const isGatekeeper = pathname?.startsWith("/gatekeeper/dashboard");
  const isSchoolDashboard = pathname?.includes("/dashboard") && !pathname?.startsWith("/gatekeeper");

  useEffect(() => {
    // Check if notifications are relevant for the current role
    if (!isGatekeeper && !isSchoolDashboard) return;

    let timeoutId: NodeJS.Timeout;

    if (isGatekeeper) {
      // 1. BroadcastChannel Listener for Realtime Cross-Tab Notifications
      let bc: BroadcastChannel | null = null;
      try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          bc = new BroadcastChannel("cationgate_realtime_events");
          bc.onmessage = (event) => {
            if (event.data && event.data.type === "VERIFICATION_SUBMITTED") {
              const sName = event.data.schoolName || event.data.schoolSlug || "Sekolah Baru";
              setCurrentNotification({
                id: `notif-realtime-${Date.now()}`,
                type: "VERIFICATION_SUBMITTED",
                title: "Pengajuan Verifikasi Baru 📄",
                message: `${sName} baru saja mengunggah dokumen legalitas untuk ditinjau.`,
                timestamp: "Baru saja",
                actionText: "Tinjau Berkas",
                actionHref: `/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION`
              });
            }
          };
        }
      } catch (_e) {}

      // 2. Periodic check for recent schools or verifications (ONLY with valid token)
      const checkGatekeeperNotifications = async () => {
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("gatekeeper_token") : null;
          if (!token) return;

          const res = await fetch(`/api/gatekeeper/schools?t=${Date.now()}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok) {
            const json = await res.json();
            if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
              const pendingSchools = json.data.filter((s: { status: string }) => 
                s.status === "PENDING_VERIFICATION" || s.status === "SUBMITTED"
              );

              if (pendingSchools.length > 0) {
                const latest = pendingSchools[0];
                const notifKey = `gatekeeper_notif_shown_${latest.slug || latest.id}`;
                if (!sessionStorage.getItem(notifKey)) {
                  sessionStorage.setItem(notifKey, "true");
                  setCurrentNotification({
                    id: `notif-${latest.slug}-${Date.now()}`,
                    type: "VERIFICATION_SUBMITTED",
                    title: "Pengajuan Verifikasi Baru 📄",
                    message: `${latest.name || latest.slug} telah mengirim berkas legalitas untuk ditinjau.`,
                    timestamp: "Baru saja",
                    actionText: "Tinjau Berkas",
                    actionHref: `/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION`
                  });
                }
              }
            }
          }
        } catch (_e) {}
      };

      // Check after 2 seconds, then every 15 seconds
      timeoutId = setTimeout(checkGatekeeperNotifications, 2000);
      const interval = setInterval(checkGatekeeperNotifications, 15000);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(interval);
        if (bc) bc.close();
      };
    }

    if (isSchoolDashboard) {
      // School admin notification
      let schoolSlug = pathname.split("/")[1];
      if (schoolSlug === "dashboard" || schoolSlug === "gatekeeper" || !schoolSlug) {
        if (typeof window !== "undefined") {
          const host = window.location.hostname;
          if (host.includes(".") && !host.startsWith("www.") && !host.startsWith("gatekeeper.")) {
            schoolSlug = host.split(".")[0];
          }
        }
      }

      if (!schoolSlug || schoolSlug === "dashboard" || schoolSlug === "gatekeeper") return;

      const checkSchoolAdminNotifications = async () => {
        try {
          const res = await fetch(`/api/saas/school-by-slug/${schoolSlug}?t=${Date.now()}`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.success && json.data) {
              const status = json.data.status;
              const notifKey = `school_admin_notif_${schoolSlug}_${status}`;
              if (!sessionStorage.getItem(notifKey)) {
                sessionStorage.setItem(notifKey, "true");
                if (status === "PENDING_VERIFICATION") {
                  setCurrentNotification({
                    id: `notif-school-${Date.now()}`,
                    type: "VERIFICATION_SUBMITTED",
                    title: "Dokumen Dalam Peninjauan",
                    message: "Berkas SK & legalitas Anda sedang diproses oleh Tim Superadmin Gatekeeper.",
                    timestamp: "Baru saja",
                    actionText: "Status Verifikasi",
                    actionHref: href("/dashboard/verification")
                  });
                } else if (status === "FULL_VERIFIED" || status === "VERIFIED") {
                  setCurrentNotification({
                    id: `notif-school-verified-${Date.now()}`,
                    type: "VERIFICATION_APPROVED",
                    title: "Selamat! Instansi Terverifikasi",
                    message: "Portal sekolah dan seluruh fitur dashboard PPDB telah aktif sepenuhnya.",
                    timestamp: "Baru saja",
                    actionText: "Lihat Landing Page",
                    actionHref: href("/")
                  });
                }
              }
            }
          }
        } catch (_e) {}
      };

      timeoutId = setTimeout(checkSchoolAdminNotifications, 4000);
      const interval = setInterval(checkSchoolAdminNotifications, 30000);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(interval);
      };
    }
  }, [isGatekeeper, isSchoolDashboard, pathname, href]);

  // Auto dismiss notification after 8 seconds
  useEffect(() => {
    if (!currentNotification) return;
    const timer = setTimeout(() => {
      setCurrentNotification(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [currentNotification]);

  if (!currentNotification) return null;

  const getIcon = () => {
    switch (currentNotification.type) {
      case "SCHOOL_REGISTERED":
        return <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "VERIFICATION_SUBMITTED":
        return <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "VERIFICATION_APPROVED":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "STUDENT_REGISTERED":
        return <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <BellRing className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBadgeColor = () => {
    switch (currentNotification.type) {
      case "VERIFICATION_SUBMITTED":
        return "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300";
      case "VERIFICATION_APPROVED":
        return "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300";
      default:
        return "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300";
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-full pointer-events-none p-2 sm:p-0 font-sans">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-xl"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-amber-500 to-emerald-500" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getBadgeColor()}`}>
                      Notifikasi Live
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{currentNotification.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1 leading-tight">
                    {currentNotification.title}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentNotification(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
              {currentNotification.message}
            </p>

            {currentNotification.actionHref && (
              <div className="pt-1 pl-13">
                <button
                  type="button"
                  onClick={() => {
                    if (currentNotification.actionHref) {
                      router.push(currentNotification.actionHref);
                    }
                    setCurrentNotification(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>{currentNotification.actionText || "Lihat Detail"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
