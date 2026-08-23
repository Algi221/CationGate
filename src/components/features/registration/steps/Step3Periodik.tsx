"use client";

import React from "react";
import { RegistrationFormData } from "../types";

interface StepProps {
  formData: RegistrationFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  getFieldLabel: (key: string, defaultLabel: string) => string;
  isFieldRequired: (key: string) => boolean;
  isFieldActive: (key: string) => boolean;
}

export const Step3Periodik: React.FC<StepProps> = ({
  formData,
  handleInputChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 3: Data Rincian (Data Periodik)</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Mohon isi data periodik fisik dan perjalanan Anda ke sekolah.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("tinggiBadan") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("tinggiBadan", "Tinggi Badan (Cm)")} {isFieldRequired("tinggiBadan") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="tinggiBadan"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Contoh: 165"
                value={formData.tinggiBadan}
                onChange={handleInputChange}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Cm</span>
            </div>
          </div>
        )}
        {isFieldActive("beratBadan") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("beratBadan", "Berat Badan (Kg)")} {isFieldRequired("beratBadan") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="beratBadan"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Contoh: 55"
                value={formData.beratBadan}
                onChange={handleInputChange}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Kg</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("jarakSekolah") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("jarakSekolah", "Jarak Rumah ke Sekolah")} {isFieldRequired("jarakSekolah") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="jarakSekolah"
                  value="Kurang dari 1 km"
                  checked={formData.jarakSekolah === "Kurang dari 1 km"}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">Kurang dari 1 Km</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="jarakSekolah"
                  value="Lebih dari 1 km"
                  checked={formData.jarakSekolah === "Lebih dari 1 km"}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">Lebih dari 1 Km</span>
              </label>
            </div>
          </div>
        )}
        {isFieldActive("jarakKm") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {formData.jarakSekolah === "Kurang dari 1 km" ? "Sebutkan Jarak Tepatnya (Meter)" : "Sebutkan Jarak Tepatnya (Km)"}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="jarakKm"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder={formData.jarakSekolah === "Kurang dari 1 km" ? "Contoh: 500" : "Contoh: 3"}
                value={formData.jarakKm}
                onChange={handleInputChange}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {formData.jarakSekolah === "Kurang dari 1 km" ? "Meter" : "Km"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("waktuJam") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("waktuJam", "Waktu Tempuh ke Sekolah")} {isFieldRequired("waktuJam") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="waktuJam"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="0"
                  value={formData.waktuJam}
                  onChange={handleInputChange}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Jam</span>
              </div>
              <span className="text-slate-400 font-bold">:</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="waktuMenit"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="25"
                  value={formData.waktuMenit}
                  onChange={handleInputChange}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Menit</span>
              </div>
            </div>
          </div>
        )}
        {isFieldActive("jumlahSaudara") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("jumlahSaudara", "Jumlah Saudara Kandung")} {isFieldRequired("jumlahSaudara") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="jumlahSaudara"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Contoh: 2"
                value={formData.jumlahSaudara}
                onChange={handleInputChange}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Orang</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
