"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X, ShieldCheck, Zap } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon Header */}
            <div className="relative mx-auto mb-5 w-16 h-16 rounded-3xl bg-linear-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-yellow-400/20 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
            </div>

            {/* Title & Badge */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 text-[11px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Instansi Terverifikasi Resmi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                Atur & Aktifkan Paket Langganan 🚀
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
                Instansi sekolah Anda telah berhasil disetujui Gatekeeper. Aktifkan paket langganan untuk mulai membuka pendaftaran calon siswa baru (SPMB Online), kuota tak terbatas, dan kustomisasi penuh portal.
              </p>
            </div>

            {/* Key Benefits Preview */}
            <div className="my-6 grid grid-cols-2 gap-2.5 text-left text-xs bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Buka SPMB Online</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Kuota Unlimited</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>WhatsApp Notifikasi</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Kustomisasi Landing Page</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:w-1/3 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Nanti Saja
              </button>
              <button
                type="button"
                onClick={handleGoToSubscription}
                className="w-full sm:w-2/3 h-11 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-xs shadow-lg shadow-[#FFC000]/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <span>Pilih & Atur Paket Sekarang</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
