"use client";

import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Plan } from "./types";

interface PackageEditModalProps {
  isOpen: boolean;
  mounted: boolean;
  editingPlan: Plan | null;
  formName: string;
  setFormName: (val: string) => void;
  priceYearlyDisplay: string;
  handlePriceChange: (val: string) => void;
  formFeatures: string;
  setFormFeatures: (val: string) => void;
  formPriceYearly: number;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PackageEditModal({
  isOpen,
  mounted,
  editingPlan,
  formName,
  setFormName,
  priceYearlyDisplay,
  handlePriceChange,
  formFeatures,
  setFormFeatures,
  formPriceYearly,
  saving,
  onClose,
  onSave,
}: PackageEditModalProps) {
  if (!mounted || !isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1e2533] rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-white/10">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#1e2533]/95 backdrop-blur z-10">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            {editingPlan ? "Edit Paket SaaS" : "Buat Paket SaaS Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Paket *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="contoh: FREE TRIAL, PRO TAHUNAN, ENTERPRISE"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-bold outline-none focus:border-[#FFD33B] focus:ring-2 focus:ring-[#FFD33B]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Harga Tahunan *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 dark:text-slate-400 select-none">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={priceYearlyDisplay}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="1.200.000 (atau 0 untuk Free Trial)"
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-xs font-mono font-bold transition-all focus:ring-2 focus:ring-[#FFD33B]/20 focus:border-[#FFD33B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Daftar Fitur Paket (1 per baris)
            </label>
            <textarea
              rows={6}
              value={formFeatures}
              onChange={(e) => setFormFeatures(e.target.value)}
              placeholder={`Mendapatkan subdomain\nLanding page sekolah\nProfil sekolah\nExport & import excel data siswa aktif\nMasa aktif 30 hari\nBelum bisa membuka SPMB`}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-medium outline-none focus:border-[#FFD33B] focus:ring-2 focus:ring-[#FFD33B]/20"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving || !formName.trim() || formPriceYearly < 0}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] shadow-md shadow-[#FFD33B]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? "Menyimpan..." : "Simpan Paket"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
