"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SchoolVerificationFormData } from "../types";

interface Step2KontakProps {
  formData: SchoolVerificationFormData;
  setFormData: React.Dispatch<React.SetStateAction<SchoolVerificationFormData>>;
  handleNext: () => void;
  handlePrev: () => void;
}

export const Step2Kontak: React.FC<Step2KontakProps> = ({
  formData,
  setFormData,
  handleNext,
  handlePrev
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
          Kontak Resmi & Media Sosial Instansi
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Tautan dan kontak resmi digunakan untuk memvalidasi keberadaan fisik dan reputasi publik institusi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-black uppercase text-slate-500">
            Email Resmi Instansi (.sch.id / domain sekolah) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            value={formData.official_email}
            onChange={(e) => setFormData((p) => ({ ...p, official_email: e.target.value }))}
            placeholder="info@sekolah.sch.id"
            className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold"
          />
        </div>

        <div>
          <Label className="text-xs font-black uppercase text-slate-500">
            Nomor Telepon / WhatsApp Humas Sekolah
          </Label>
          <Input
            value={formData.whatsapp}
            onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
            placeholder="+62812..."
            className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold"
          />
        </div>

        <div>
          <Label className="text-xs font-black uppercase text-slate-500">Website Resmi Sekolah</Label>
          <Input
            value={formData.website_url}
            onChange={(e) => setFormData((p) => ({ ...p, website_url: e.target.value }))}
            placeholder="https://smkxyz.sch.id"
            className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold"
          />
        </div>

        <div>
          <Label className="text-xs font-black uppercase text-slate-500">Akun Instagram Resmi</Label>
          <Input
            value={formData.instagram_url}
            onChange={(e) => setFormData((p) => ({ ...p, instagram_url: e.target.value }))}
            placeholder="https://instagram.com/smkxyz"
            className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={handlePrev}
          className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft size={15} /> Kembali
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-blue-500/20"
        >
          Lanjut ke Dokumen SK <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
