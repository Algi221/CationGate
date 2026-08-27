"use client";

import React from "react";
import { Crown, AlertCircle, Clock } from "lucide-react";

interface SubscriptionData {
  plan: string;
  status: string;
  daysLeft: number;
  isExpired: boolean;
  expiresAt?: string;
}

interface SubscriptionStatusBannerProps {
  subscription: SubscriptionData | null;
  loadingSub: boolean;
  isPro: boolean;
}

export const SubscriptionStatusBanner: React.FC<SubscriptionStatusBannerProps> = ({
  subscription,
  loadingSub,
  isPro
}) => {
  if (loadingSub || !subscription) return null;

  return (
    <div className={`rounded-3xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
      isPro
        ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
        : subscription.isExpired
          ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800"
          : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isPro
            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
            : subscription.isExpired
              ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400"
              : "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
        }`}>
          {isPro ? <Crown className="w-5 h-5" /> : subscription.isExpired ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm font-black text-slate-800 dark:text-white">
            {isPro ? "Paket Pro Tahunan Aktif" : subscription.isExpired ? "Free Trial Telah Berakhir" : "Free Trial Aktif"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isPro
              ? `Berlaku hingga ${subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}`
              : subscription.isExpired
                ? "Upgrade ke Pro untuk melanjutkan akses fitur CationGate."
                : `Sisa ${subscription.daysLeft} hari trial tersisa`
            }
          </p>
        </div>
      </div>
      {!isPro && (
        <span className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
          subscription.isExpired
            ? "bg-rose-600 text-white"
            : "bg-amber-500 text-white"
        }`}>
          {subscription.isExpired ? "EXPIRED" : `${subscription.daysLeft} HARI TERSISA`}
        </span>
      )}
      {isPro && (
        <span className="px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white">
          PRO AKTIF
        </span>
      )}
    </div>
  );
};
