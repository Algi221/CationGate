"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RegistrationFormData } from "../types";

interface StepProps {
  formData: RegistrationFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  getFieldLabel: (key: string, defaultLabel: string) => string;
  isFieldRequired: (key: string) => boolean;
  isFieldActive: (key: string) => boolean;
}

export const Step1DataPribadi: React.FC<StepProps> = ({
  formData,
  handleInputChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
}) => {
  const triggerSelectChange = (name: string, value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleInputChange({ target: { name, value } } as any);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 1: Data Pribadi Siswa</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Masukkan informasi dasar sesuai dengan Kartu Keluarga / Akta Kelahiran.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("nama") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("nama", "Nama Lengkap")} {isFieldRequired("nama") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="nama"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Sesuai Ijazah"
              value={formData.nama}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("jenisKelamin") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("jenisKelamin", "Jenis Kelamin")} {isFieldRequired("jenisKelamin") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={formData.jenisKelamin}
              onValueChange={(val) => triggerSelectChange("jenisKelamin", val)}
            >
              <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                <SelectValue placeholder="-- Pilih --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Laki-Laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("nisn") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("nisn", "NISN (10 Digit)")} {isFieldRequired("nisn") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="nisn"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Misal: 0081234567"
              value={formData.nisn}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("nik") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("nik", "NIK (16 Digit)")} {isFieldRequired("nik") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="nik"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Sesuai KK"
              value={formData.nik}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      {isFieldActive("tempatLahir") && (
        <div className="form-group mb-4">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
            {getFieldLabel("tempatLahir", "Tempat & Tanggal Lahir")} {isFieldRequired("tempatLahir") && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="tempatLahir"
              maxLength={50}
              className="w-1/2 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Kota / Kab Lahir"
              value={formData.tempatLahir}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="tglLahir"
              className="w-1/2 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={formData.tglLahir}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("agama") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("agama", "Agama")} {isFieldRequired("agama") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={formData.agama}
              onValueChange={(val) => triggerSelectChange("agama", val)}
            >
              <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                <SelectValue placeholder="-- Pilih --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Islam">Islam</SelectItem>
                <SelectItem value="Kristen">Kristen</SelectItem>
                <SelectItem value="Katolik">Katolik</SelectItem>
                <SelectItem value="Hindu">Hindu</SelectItem>
                <SelectItem value="Buddha">Buddha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {isFieldActive("kewarganegaraan") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("kewarganegaraan", "Kewarganegaraan")} {isFieldRequired("kewarganegaraan") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={formData.kewarganegaraan}
              onValueChange={(val) => triggerSelectChange("kewarganegaraan", val)}
            >
              <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                <SelectValue placeholder="-- Pilih --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WNI">Warga Negara Indonesia (WNI)</SelectItem>
                <SelectItem value="WNA">Warga Negara Asing (WNA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
