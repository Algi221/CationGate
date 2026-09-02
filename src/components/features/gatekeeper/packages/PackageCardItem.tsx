"use client";

import React from "react";
import { Pencil, Trash2, CheckCircle2, Box, Sparkles, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plan, formatRupiahDisplay } from "./types";

interface PackageCardItemProps {
  plan: Plan;
  index: number;
  onEdit: (plan: Plan) => void;
  onDelete: (id: number, name: string) => void;
  onToggleActive: (plan: Plan) => void;
}

export function PackageCardItem({
  plan,
  index,
  onEdit,
  onDelete,
  onToggleActive,
}: PackageCardItemProps) {
  const isCard1 = index === 0;
  const isCard2 = index === 1;

  if (isCard1) {
    // ── CARD 1: AMBER / WARM YELLOW CARD ──
    return (
      <div
        className={`bg-amber-300 dark:bg-[#EAB844] text-neutral-950 rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-200 border-2 ${
          plan.is_active ? "border-amber-400/80" : "border-neutral-400 opacity-75"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-black/10 text-black text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-black/10">
              {plan.is_active ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Aktif
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                  Nonaktif
                </>
              )}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(plan)}
                className="p-2 hover:bg-black/10 rounded-xl text-black transition-colors cursor-pointer"
                title="Edit Paket"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(plan.id, plan.name)}
                className="p-2 hover:bg-rose-500/20 rounded-xl text-rose-800 transition-colors cursor-pointer"
                title="Hapus Paket"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-black" />
              {plan.name}
            </h3>
            <p className="text-neutral-800 text-xs font-semibold leading-relaxed">
              Uji coba &amp; pengenalan sistem PPDB online untuk sekolah pendaftar baru.
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 my-6">
            <span className="text-4xl md:text-5xl font-black tracking-tight">
              {plan.price_yearly === 0 ? "Free" : formatRupiahDisplay(plan.price_yearly)}
            </span>
            <span className="text-xs font-bold text-neutral-700">
              {plan.price_yearly === 0
                ? "Tanpa biaya tersembunyi selama masa uji coba."
                : "/tahun lisensi penuh"}
            </span>
          </div>

          {/* Features List */}
          <div className="space-y-3 pt-6 border-t border-black/10 text-xs font-medium">
            {(Array.isArray(plan.features) ? plan.features : []).map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-neutral-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />
                  <span>{item}</span>
                </div>
                <span className="text-[11px] font-mono font-black text-neutral-800 shrink-0">
                  Tersedia
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle Active Button */}
        <Button
          onClick={() => onToggleActive(plan)}
          variant="outline"
          className="w-full h-12 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold border-2 border-black transition-all duration-100 shadow-[4px_4px_rgb(0_0_0)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          {plan.is_active ? "Nonaktifkan Paket" : "Aktifkan Paket"}
        </Button>
      </div>
    );
  }

  if (isCard2) {
    // ── CARD 2: DEEP DARK / POPULAR PRO CARD ──
    return (
      <div
        className={`bg-neutral-950 dark:bg-[#151D2A] text-white rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-2xl space-y-6 relative overflow-hidden ring-2 ring-[#FFD33B]/40 transition-all duration-200 border border-white/10`}
      >
        {/* Top Popular Glow Pill */}
        <div className="absolute top-0 right-8 px-4 py-1 rounded-b-xl bg-[#FFD33B] text-black font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
          <Crown size={12} /> Paling Populer
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {plan.is_active ? "Aktif" : "Nonaktif"}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(plan)}
                className="p-2 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Edit Paket"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(plan.id, plan.name)}
                className="p-2 hover:bg-rose-500/20 rounded-xl text-rose-400 transition-colors cursor-pointer"
                title="Hapus Paket"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Box className="w-6 h-6 text-[#FFD33B]" />
              {plan.name}
            </h3>
            <p className="text-neutral-400 text-xs font-semibold leading-relaxed">
              Akses penuh seluruh fitur platform, multi-admin, export data, dan support 24/7.
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 my-6">
            <span className="text-4xl md:text-5xl font-black tracking-tight text-[#FFD33B]">
              {formatRupiahDisplay(plan.price_yearly)}
            </span>
            <span className="text-xs font-medium text-neutral-400">
              /tahun lisensi sekolah lengkap.
            </span>
          </div>

          {/* Features List */}
          <div className="space-y-3 pt-6 border-t border-neutral-800 text-xs font-medium">
            {(Array.isArray(plan.features) ? plan.features : []).map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD33B] shrink-0" />
                  <span>{item}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-neutral-400 shrink-0">
                  Included
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle Active Button */}
        <Button
          onClick={() => onToggleActive(plan)}
          variant="outline"
          className="w-full h-12 rounded-2xl bg-[#FFD33B] hover:bg-[#F3C625] text-black font-black border-2 border-black transition-all duration-100 shadow-[4px_4px_rgb(255_210_48)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          {plan.is_active ? "Nonaktifkan Paket" : "Aktifkan Paket"}
        </Button>
      </div>
    );
  }

  // ── CARD 3: SLEEK ENTERPRISE / CLEAN CARD ──
  return (
    <div
      className={`bg-white dark:bg-[#1A2230] text-slate-900 dark:text-white rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-200 border-2 border-slate-200 dark:border-slate-800`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-blue-200 dark:border-blue-700/50">
            <Shield size={13} /> {plan.is_active ? "Aktif" : "Nonaktif"}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(plan)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Edit Paket"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(plan.id, plan.name)}
              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-rose-600 transition-colors cursor-pointer"
              title="Hapus Paket"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {plan.name}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
            Kustomisasi penuh untuk yayasan sekolah besar &amp; multi-kampus.
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1 my-6">
          <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {formatRupiahDisplay(plan.price_yearly)}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            /tahun paket kustom instansi.
          </span>
        </div>

        {/* Features List */}
        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
          {(Array.isArray(plan.features) ? plan.features : []).map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">
                Enterprise
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Active Button */}
      <Button
        onClick={() => onToggleActive(plan)}
        variant="outline"
        className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black border-2 border-slate-900 dark:border-white transition-all duration-100 shadow-[4px_4px_rgb(15_23_42)] dark:shadow-[4px_4px_rgb(255_255_255/20%)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
      >
        {plan.is_active ? "Nonaktifkan Paket" : "Aktifkan Paket"}
      </Button>
    </div>
  );
}
