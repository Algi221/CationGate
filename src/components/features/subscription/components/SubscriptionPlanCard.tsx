"use client";

import React from "react";
import { CheckCircle2, Crown, ArrowRight, ShieldCheck, Box, Sparkles, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PlanItem {
  id: number;
  name: string;
  price_yearly: number;
  features: string[];
}

interface SubscriptionPlanCardProps {
  pkg: PlanItem;
  index: number;
  isPro: boolean;
  isExpired: boolean;
  isPaying: boolean;
  onUpgrade: (planName: string) => void;
  onSimulateSuccess: (planName: string, amount: number) => void;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  pkg,
  index,
  isPro,
  isExpired,
  isPaying,
  onUpgrade,
  onSimulateSuccess
}) => {
  const isFree = pkg.price_yearly === 0;
  const isCard1 = index === 0;
  const isCard2 = index === 1;

  const isCurrentlyActive = isFree
    ? !isPro && !isExpired
    : isPro && (pkg.name.toLowerCase().includes("pro") || isCard2);

  if (isCard1) {
    // ── CARD 1: AMBER / WARM YELLOW ──
    return (
      <div
        key={pkg.id}
        className="bg-amber-300 dark:bg-[#EAB844] text-neutral-950 rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-200 border-2 border-amber-400/80"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-black/10 text-black text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-black/10">
              {isCurrentlyActive ? "Paket Anda Saat Ini" : "Uji Coba"}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-black" />
              {pkg.name}
            </h3>
            <p className="text-neutral-800 text-xs font-semibold leading-relaxed">
              Coba seluruh fitur dasar PPDB sekolah tanpa biaya komitmen.
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 my-6">
            <span className="text-4xl md:text-5xl font-black tracking-tight text-neutral-950">
              Free
            </span>
            <span className="text-xs font-bold text-neutral-800">
              Tanpa biaya tersembunyi selama masa uji coba 30 hari.
            </span>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-6 border-t border-black/10 text-xs font-medium">
            {(pkg.features || []).map((feat, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-neutral-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />
                  <span>{feat}</span>
                </div>
                <span className="text-[11px] font-mono font-black text-neutral-800 shrink-0">Included</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          disabled
          variant="outline"
          className="w-full h-12 rounded-2xl bg-neutral-900 text-white font-bold border-2 border-black opacity-80 cursor-not-allowed shadow-[4px_4px_rgb(0_0_0)]"
        >
          {isCurrentlyActive ? "Sedang Digunakan" : "Paket Uji Coba"}
        </Button>
      </div>
    );
  }

  if (isCard2) {
    // ── CARD 2: DEEP DARK / ENTERPRISE (POPULAR) ──
    return (
      <div
        key={pkg.id}
        className="bg-neutral-950 dark:bg-[#151D2A] text-white rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-2xl space-y-6 relative overflow-hidden ring-2 ring-[#FFD33B]/40 transition-all duration-200 border border-white/10"
      >
        {/* Top Popular Glow Pill */}
        <div className="absolute top-0 right-8 px-4 py-1 rounded-b-xl bg-[#FFD33B] text-black font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
          <Crown size={12} /> Paling Populer
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-[#FFD33B]/20 text-[#FFD33B] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-[#FFD33B]/30">
              {isCurrentlyActive ? "Paket Anda Saat Ini" : "Rekomendasi Utama"}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Box className="w-6 h-6 text-[#FFD33B]" />
              {pkg.name}
            </h3>
            <p className="text-neutral-400 text-xs font-semibold leading-relaxed">
              Akses tanpa batas, pendaftar unlimited, notifikasi WA, dan prioritas support 24/7.
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 my-6">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-[#FFD33B]">Rp</span>
              <span className="text-4xl md:text-5xl font-black tracking-tight text-[#FFD33B]">
                {Number(pkg.price_yearly).toLocaleString("id-ID")}
              </span>
            </div>
            <span className="text-xs font-medium text-neutral-400">
              /tahun lisensi sekolah lengkap.
            </span>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-6 border-t border-neutral-800 text-xs font-medium">
            {(pkg.features || []).map((feat, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD33B] shrink-0" />
                  <span>{feat}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-neutral-400 shrink-0">Included</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => onUpgrade(pkg.name)}
            disabled={isPaying || isCurrentlyActive}
            variant="outline"
            className="w-full h-12 rounded-2xl bg-[#FFD33B] hover:bg-[#F3C625] text-black font-black border-2 border-black transition-all duration-100 shadow-[4px_4px_rgb(255_210_48)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCurrentlyActive ? (
              "Sedang Digunakan"
            ) : isPaying ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" /> Memproses...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" /> Upgrade ke Pro Sekarang <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>

          {!isCurrentlyActive && (
            <button
              type="button"
              onClick={() => onSimulateSuccess(pkg.name, pkg.price_yearly)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
            >
              <Sparkles size={14} className="text-emerald-400" />
              <span>Simulasi Pembayaran Berhasil (Sandbox)</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── CARD 3: ENTERPRISE INSTITUTION ──
  return (
    <div
      key={pkg.id}
      className="bg-white dark:bg-[#1A2230] text-slate-900 dark:text-white rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-200 border-2 border-slate-200 dark:border-slate-800"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-blue-200 dark:border-blue-700/50">
            <Shield size={13} /> {isCurrentlyActive ? "Paket Anda Saat Ini" : "Institusi Besar"}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {pkg.name}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
            Kustomisasi penuh untuk yayasan multi-kampus &amp; integrasi Dapodik.
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1 my-6">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Rp</span>
            <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {Number(pkg.price_yearly).toLocaleString("id-ID")}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            /tahun paket kustom yayasan.
          </span>
        </div>

        {/* Features */}
        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
          {(pkg.features || []).map((feat, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">Enterprise</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Button
          onClick={() => onUpgrade(pkg.name)}
          disabled={isPaying || isCurrentlyActive}
          variant="outline"
          className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black border-2 border-slate-900 dark:border-white transition-all duration-100 shadow-[4px_4px_rgb(15_23_42)] dark:shadow-[4px_4px_rgb(255_255_255/20%)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCurrentlyActive ? (
            "Sedang Digunakan"
          ) : isPaying ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" /> Memproses...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 mr-2" /> Upgrade Enterprise <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>

        {!isCurrentlyActive && (
          <button
            type="button"
            onClick={() => onSimulateSuccess(pkg.name, pkg.price_yearly)}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
          >
            <Sparkles size={14} className="text-emerald-500" />
            <span>Simulasi Pembayaran Berhasil (Sandbox)</span>
          </button>
        )}
      </div>
    </div>
  );
};
