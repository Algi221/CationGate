"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ShieldCheck, Check } from "lucide-react";
import { useSchoolHref } from "@/hooks/useSchoolHref";

interface SubscriptionOnboardingModalProps {
  isVerified: boolean;
  schoolSlug: string;
}

export const SubscriptionOnboardingModal: React.FC<SubscriptionOnboardingModalProps> = ({
  isVerified,
  schoolSlug,
}) => {
  const router = useRouter();
  const { href } = useSchoolHref();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if school is verified and not in demo mode
    if (!isVerified || schoolSlug === "demo" || schoolSlug === "smktarunabhakti" || schoolSlug === "smktiglobal") return;

    // Check if user already dismissed it this session
    const storageKey = `cationgate_sub_onboarding_dismissed_${schoolSlug}`;
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem(storageKey);
      if (isDismissed === "true") return;

      // Check if school already has active subscription in local storage
      const savedSub = localStorage.getItem(`ppdb_school_subscription_${schoolSlug}`) || localStorage.getItem("ppdb_school_subscription_default");
      if (savedSub && (savedSub.includes("PRO") || savedSub.includes("ACTIVE") || savedSub.includes("YEARLY") || savedSub.includes("ENTERPRISE"))) {
        return;
      }
    }

    let isCancelled = false;

    // Check live subscription status from API
    fetch(`/api/saas/subscription-status?slug=${encodeURIComponent(schoolSlug)}&_t=${Date.now()}`)
      .then((res) => res.json())
      .then((json) => {
        if (isCancelled) return;
        if (json.success && json.data) {
          const plan = String(json.data.plan || "").toUpperCase();
          const status = String(json.data.status || "").toUpperCase();
          const isExpired = Boolean(json.data.isExpired);

          if ((plan.includes("PRO") || plan.includes("ENTERPRISE") || status === "ACTIVE" || status === "SETTLEMENT") && !isExpired) {
            return;
          }
        }

        // Trigger popup after exactly 3 seconds (3000ms) only for unsubscribed schools
        const timer = setTimeout(() => {
          if (!isCancelled) {
            setIsOpen(true);
          }
        }, 3000);

        return () => clearTimeout(timer);
      })
      .catch(() => {
        // Fallback timer if API unreachable
        const timer = setTimeout(() => {
          if (!isCancelled) {
            setIsOpen(true);
          }
        }, 3000);
        return () => clearTimeout(timer);
      });

    return () => {
      isCancelled = true;
    };
  }, [isVerified, schoolSlug]);

  const handleDismiss = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`cationgate_sub_onboarding_dismissed_${schoolSlug}`, "true");
    }
  };

  const handleGoToSubscription = () => {
    handleDismiss();
    router.push(href("/dashboard/subscription"));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 text-center overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Header */}
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Title & Badge */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Instansi Terverifikasi</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Atur & Aktifkan Paket Langganan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Instansi sekolah Anda telah disetujui. Aktifkan paket langganan untuk mulai membuka penerimaan siswa baru (SPMB Online) dan konfigurasi portal.
              </p>
            </div>

            {/* Key Benefits Preview */}
            <div className="my-5 grid grid-cols-2 gap-2 text-left text-xs bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Buka SPMB Online</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Kuota Pendaftaran</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>WhatsApp Notifikasi</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Kustomisasi Portal</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:w-1/3 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Nanti Saja
              </button>
              <button
                type="button"
                onClick={handleGoToSubscription}
                className="w-full sm:w-2/3 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Pilih & Atur Paket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
