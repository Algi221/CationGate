"use client";

import React from "react";
import { User, Check, CreditCard, School, Clock, CheckCircle2, Upload } from "lucide-react";
import { getMajorDetails } from "../types";

interface PaymentSummarySidebarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submittedCandidate: any;
  activePaymentMethod: "transfer" | "tu";
  manualReceiptBase64: string;
  regCost: number;
}

export function PaymentSummarySidebar({
  submittedCandidate,
  activePaymentMethod,
  manualReceiptBase64,
  regCost,
}: PaymentSummarySidebarProps) {
  const majorInfo = getMajorDetails(
    submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1,
  );

  return (
    <div className="lg:col-span-4 flex flex-col justify-between bg-background/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden">
      <div className="space-y-4">
        {/* Profil Calon Siswa */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 bg-primary dark:bg-blue-500 rounded-full flex items-center justify-center text-white mb-2 shadow-md ring-2 ring-primary/10">
            <User className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-tight">
            {submittedCandidate?.nama}
          </h4>
          <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-400 mt-1">
            NISN: {submittedCandidate?.nisn}
          </p>
        </div>

        {/* Stepper Vertikal */}
        <div className="space-y-3 py-2">
          {/* Langkah 1 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center border border-emerald-200 dark:border-emerald-900 shadow-sm shrink-0">
              <Check size={14} className="stroke-3" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Informasi Siswa
            </span>
          </div>

          {/* Langkah 2 */}
          <div className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-2xl bg-primary/5 dark:bg-blue-950/45 border border-blue-100/50 dark:border-blue-900/40">
            <div className="w-8 h-8 rounded-xl bg-primary dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <CreditCard size={14} />
            </div>
            <span className="text-xs font-black text-primary dark:text-sky-400">
              Metode Pembayaran
            </span>
          </div>

          {activePaymentMethod === "tu" ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <School size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
                  Datang ke Sekolah
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <Clock size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
                  Menunggu Verifikasi
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
                  Selesai
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                    manualReceiptBase64
                      ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 text-emerald-500"
                      : "bg-background dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400"
                  }`}
                >
                  {manualReceiptBase64 ? (
                    <Check size={14} className="stroke-3" />
                  ) : (
                    <Upload size={14} />
                  )}
                </div>
                <span
                  className={`text-xs font-bold ${
                    manualReceiptBase64
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-400"
                  }`}
                >
                  Upload Bukti
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <Clock size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
                  Selesai
                </span>
              </div>
            </>
          )}
        </div>

        {/* Box Info Pendaftaran */}
        <div className="mt-4 p-4 rounded-2xl bg-primary/5/50 dark:bg-blue-950/20 border border-blue-100/35 dark:border-blue-900/30">
          <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-sky-400 block mb-3">
            Info Pendaftaran
          </span>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${majorInfo.bg}`}
            >
              {majorInfo.logoPath ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={majorInfo.logoPath}
                  alt={majorInfo.logoText}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                majorInfo.icon
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                Jurusan
              </p>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                {submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Pembayaran Card */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
          Total Biaya Pendaftaran
        </span>
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-black text-primary dark:text-sky-400">
            Rp {regCost.toLocaleString("id-ID")}
          </span>
          <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
            Tunggal
          </span>
        </div>
      </div>
    </div>
  );
}
