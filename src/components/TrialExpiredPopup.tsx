"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { AlertTriangle, Crown, ArrowRight, X } from "lucide-react";

export default function TrialExpiredPopup() {
  const { schoolId } = usePPDB();
  const params = useParams();
  const router = useRouter();
  const schoolSlug = (params?.school_slug as string) || "";

  const [isExpired, setIsExpired] = useState(false);
  const [_daysLeft, setDaysLeft] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const query = schoolId ? `school_id=${schoolId}` : `slug=${schoolSlug}`;
        const res = await fetch(`/api/saas/subscription-status?${query}`);
        const data = await res.json();
        if (data.success && data.data) {
          const sub = data.data;
          // Only show for FREE_TRIAL that is expired
          if (sub.plan === "FREE_TRIAL" && sub.isExpired) {
            setIsExpired(true);
          }
          setDaysLeft(sub.daysLeft ?? null);
        }
      } catch (_e) {
        // silently fail
      }
    };

    if (schoolSlug || schoolId) {
      checkSubscription();
    }
  }, [schoolSlug, schoolId]);

  // Don't show if not expired or dismissed
  if (!isExpired || dismissed) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-300">
        {/* Dismiss button — optional, can remove to force upgrade */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-black text-slate-900 dark:text-white text-center tracking-tight">
          Masa Free Trial Telah Berakhir
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 leading-relaxed">
          Periode free trial 30 hari untuk sekolah Anda telah selesai.
          Upgrade ke <strong className="text-slate-700 dark:text-slate-200">Paket Pro Tahunan</strong> untuk
          melanjutkan akses penuh ke seluruh fitur CationGate.
        </p>

        {/* Pricing */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD33B]/15 dark:bg-blue-900 flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#2e3749] dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 dark:text-white">Pro Tahunan</p>
                <p className="text-[11px] text-slate-500">Akses penuh tanpa batasan</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-slate-900 dark:text-white">Rp 750.000</p>
              <p className="text-[10px] text-slate-500 font-semibold">/ tahun</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            setDismissed(true);
            router.push(`/${schoolSlug}/dashboard/subscription`);
          }}
          className="w-full mt-6 py-4 rounded-2xl bg-[#FFD33B] hover:bg-[#F3C625] text-white font-bold text-sm tracking-wider transition-all shadow-lg shadow-[#FFD33B]/25 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          Upgrade ke Pro Sekarang
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-3">
          Anda tetap dapat mengakses dashboard dalam mode terbatas.
        </p>
      </div>
    </div>
  );
}
