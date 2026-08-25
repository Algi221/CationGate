"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SchoolVerificationFormData } from "../types";

interface Step1LegalitasProps {
  formData: SchoolVerificationFormData;
  setFormData: React.Dispatch<React.SetStateAction<SchoolVerificationFormData>>;
  handleNext: () => void;
}

export const Step1Legalitas: React.FC<Step1LegalitasProps> = ({
  formData,
  setFormData,
  handleNext
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
          Data Legalitas & Identitas Instansi
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Pastikan data identitas sekolah sesuai dengan izin operasional Kemendikbudristek / Kemenag.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-black uppercase text-slate-500">
            NPSN (Nomor Pokok Sekolah Nasional) <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.npsn}
            onChange={(e) => setFormData((p) => ({ ...p, npsn: e.target.value }))}
            placeholder="8 digit angka NPSN resmi"
            className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold"
          />
        </div>

        <div>
          <Label className="text-xs font-black uppercase text-slate-500">
            Kode Registrasi Dapodik / EMIS
          </Label>
          <Input
            value={formData.dapodik_code}
            onChange={(e) => setFormData((p) => ({ ...p, dapodik_code: e.target.value }))}
            placeholder="Contoh: DPD-2026-JKT"
            className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold"
          />
        </div>

        <div>
          <Label className="text-xs font-black uppercase text-slate-500">
            Nomor SK Izin Operasional / Pendirian <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.legal_sk_number}
            onChange={(e) => setFormData((p) => ({ ...p, legal_sk_number: e.target.value }))}
            placeholder="Contoh: 421.3/089-DISDIK/2010"
            className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold"
          />
        </div>

        <div>
          <Label className="text-xs font-black uppercase text-slate-500">
            Peringkat Akreditasi BAN-S/M
          </Label>
          <div className="mt-1">
            <Select
              value={formData.accreditation}
              onValueChange={(val) => setFormData((p) => ({ ...p, accreditation: val }))}
            >
              <SelectTrigger className="w-full h-11 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white">
                <SelectValue placeholder="Pilih Akreditasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A (Unggul)">A (Unggul / Sangat Baik)</SelectItem>
                <SelectItem value="B (Baik)">B (Baik)</SelectItem>
                <SelectItem value="C (Cukup)">C (Cukup)</SelectItem>
                <SelectItem value="Belum Terakreditasi">Belum Terakreditasi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label className="text-xs font-black uppercase text-slate-500">
            Nama Kepala Sekolah / Penanggung Jawab Resmi <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.admin_name}
            onChange={(e) => setFormData((p) => ({ ...p, admin_name: e.target.value }))}
            placeholder="Nama lengkap beserta gelar akademik"
            className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-blue-500/20"
        >
          Lanjut ke Kontak <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
