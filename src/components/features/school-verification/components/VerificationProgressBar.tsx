"use client";

import React from "react";
import { Building2, Mail, FileText, CheckCircle2, Check } from "lucide-react";
import { VerificationStep } from "../types";

interface VerificationProgressBarProps {
  currentStep: VerificationStep;
}

export const VerificationProgressBar: React.FC<VerificationProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: "Legalitas Instansi", icon: Building2 },
    { num: 2, label: "Kontak & Media", icon: Mail },
    { num: 3, label: "Unggah Dokumen SK", icon: FileText },
    { num: 4, label: "Status Verifikasi", icon: CheckCircle2 }
  ];

  return (
    <div className="flex items-center justify-between relative max-w-3xl mx-auto mb-10 px-4">
      <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 z-0">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />
      </div>

      {steps.map((s) => {
        const Icon = s.icon;
        const isPassed = currentStep > s.num;
        const isCurrent = currentStep === s.num;

        return (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                isPassed
                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                  : isCurrent
                  ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40 shadow-blue-500/20"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400"
              }`}
            >
              {isPassed ? <Check size={16} /> : <Icon size={16} />}
            </div>
            <span
              className={`text-[11px] font-bold tracking-tight hidden sm:block ${
                isCurrent
                  ? "text-blue-600 dark:text-blue-400 font-extrabold"
                  : isPassed
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
