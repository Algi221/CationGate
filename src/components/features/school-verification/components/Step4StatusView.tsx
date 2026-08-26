"use client";

import React from "react";
import { Clock, Palette, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SchoolVerificationFormData } from "../types";
import { useSchoolHref } from "@/hooks/useSchoolHref";

interface Step4StatusViewProps {
  schoolStatus: string | null | undefined;
  schoolSlug: string;
  formData?: SchoolVerificationFormData;
  setCurrentStep: (step: number) => void;
}

export const Step4StatusView: React.FC<Step4StatusViewProps> = ({
  schoolStatus,
  schoolSlug: _schoolSlug,
  formData: _formData,
  setCurrentStep
}) => {
  const { href } = useSchoolHref();
  const isVerified =
    schoolStatus === "FULL_VERIFIED" || schoolStatus === "VERIFIED" || schoolStatus === "verified";

  return (
    <div className="text-center py-6 animate-in fade-in duration-300">
      {isVerified ? (
        <div className="p-8 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-3xl space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
              STATUS RESMI: TERVERIFIKASI
            </span>
            <h2 className="text-xl font-black text-slate-800 dark:text-white mt-3 tracking-tight">
              Instansi Sekolah Telah Aktif Penuh
            </h2>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Selamat! Dokumen legalitas sekolah Anda telah disetujui. Seluruh modul portal, pembayaran pendaftaran, dan formulir PPDB online sudah aktif tanpa batasan.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={href("/dashboard/kelola-ui")}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Palette size={15} /> Kustomisasi Landing Page
            </Link>
            <Link
              href={href("/dashboard")}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              Ke Dashboard Overview <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-3xl space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
            <Clock size={32} />
          </div>
          <div>
            <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
              DALAM PENINJAUAN SUPERADMIN
            </span>
            <h2 className="text-xl font-black text-slate-800 dark:text-white mt-3 tracking-tight">
              Dokumen Verifikasi Sedang Ditinjau
            </h2>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Pengajuan verifikasi instansi Anda sedang diteliti oleh Tim Superadmin Gatekeeper. Proses ini membutuhkan waktu maksimal 1x24 jam hari kerja.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition"
            >
              Edit Kembali Data Pengajuan
            </button>
            <Link
              href={href("/dashboard")}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              Kembali ke Dashboard <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
