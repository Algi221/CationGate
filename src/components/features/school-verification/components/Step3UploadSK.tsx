"use client";

import React from "react";
import { Upload, FileText, ArrowLeft, ShieldCheck } from "lucide-react";
import { SchoolVerificationFormData } from "../types";

interface Step3UploadSKProps {
  formData: SchoolVerificationFormData;
  loading: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handlePrev: () => void;
}

export const Step3UploadSK: React.FC<Step3UploadSKProps> = ({
  formData,
  loading,
  handleFileUpload,
  handleSubmit,
  handlePrev
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
          Unggah Dokumen Berkas SK Operasional
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Unggah salinan SK Izin Operasional / Akreditasi asli berformat PDF, JPG, atau PNG (Maks 5MB).
        </p>
      </div>

      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Upload size={24} />
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-800 dark:text-white">
            {formData.sk_document_name ? formData.sk_document_name : "Pilih atau Seret File SK ke Sini"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Format yang didukung: PDF, JPG, JPEG, PNG (Maks. 5 MB)
          </p>
        </div>

        <label className="cursor-pointer mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition shadow-md shadow-blue-500/20">
          Pilih Berkas Dokumen
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {formData.sk_document_name && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <FileText size={18} />
          Berkas siap diajukan: {formData.sk_document_name}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={handlePrev}
          className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft size={15} /> Kembali
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-blue-500/20 disabled:opacity-50"
        >
          <ShieldCheck size={16} />
          {loading ? "Mengajukan Dokumen..." : "Kirim Pengajuan Verifikasi"}
        </button>
      </div>
    </div>
  );
};
