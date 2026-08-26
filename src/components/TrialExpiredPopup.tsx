"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { Clock, ArrowRight, X } from "lucide-react";
import { useSchoolHref } from "@/hooks/useSchoolHref";

export default function TrialExpiredPopup() {
  const { schoolId, schoolStatus } = usePPDB();
  const params = useParams();
  const router = useRouter();
  const schoolSlug = (params?.school_slug as string) || "";
  const { href } = useSchoolHref();

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

  // If not expired and not marked as TRIAL_EXPIRED, don't show
  if (schoolStatus !== 'TRIAL_EXPIRED' && !isExpired) return null;
  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-300">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500">
          <Clock className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          Masa Uji Coba Telah Berakhir
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          Masa uji coba gratis 3 hari Anda telah selesai. Tingkatkan ke paket <span className="font-bold text-slate-700 dark:text-slate-200">Pro</span> untuk terus menggunakan semua fitur CationGate tanpa batasan.
        </p>

        {/* Plan card preview */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-left mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                PRO
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Paket Tahunan Pro</p>
                <p className="text-xs text-slate-400">Akses penuh semua fitur</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-900 dark:text-white">Rp 1.500.000</p>
              <p className="text-[10px] text-slate-500 font-semibold">/ tahun</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            setDismissed(true);
            router.push(href("/dashboard/subscription"));
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
