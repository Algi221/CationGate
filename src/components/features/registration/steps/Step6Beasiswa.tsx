"use client";

import React from "react";
import { RegistrationFormData } from "../types";

interface StepProps {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  getFieldLabel: (key: string, defaultLabel: string) => string;
  isFieldRequired: (key: string) => boolean;
  isFieldActive: (key: string) => boolean;
}

export const Step6Beasiswa: React.FC<StepProps> = ({
  formData,
  setFormData,
  handleInputChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 6: Data Beasiswa (Opsional)</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Isi data beasiswa yang pernah atau sedang diterima. Klik &quot;Lewati&quot; jika tidak ada.
      </p>

      {isFieldActive("jenisBeasiswa") && (
        <div className="form-group mb-5">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
            {getFieldLabel("jenisBeasiswa", "1. Jenis Beasiswa")} {isFieldRequired("jenisBeasiswa") && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["Prestasi", "Kemiskinan", "Pendidikan", "Unggulan", "Lainnya"].map((option) => {
              const isChecked = formData.jenisBeasiswa?.includes(option) || false;
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-primary/5 border-blue-300 text-primary shadow-sm"
                      : "bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-background hover:border-slate-400 shadow-sm"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                    onChange={() =>
                      setFormData((prev) => {
                        const cur = prev.jenisBeasiswa || [];
                        return {
                          ...prev,
                          jenisBeasiswa: cur.includes(option) ? cur.filter((i) => i !== option) : [...cur, option],
                        };
                      })
                    }
                  />
                  <span className="text-xs font-bold">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {isFieldActive("uraianBeasiswa") && (
        <div className="form-group mb-4">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
            {getFieldLabel("uraianBeasiswa", "2. Uraian Beasiswa")} {isFieldRequired("uraianBeasiswa") && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            name="uraianBeasiswa"
            className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Misal: Beasiswa Prestasi dari Pemkot Depok"
            value={formData.uraianBeasiswa}
            onChange={handleInputChange}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isFieldActive("tahunMulaiBeasiswa") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("tahunMulaiBeasiswa", "3. Tahun Mulai Menerima Beasiswa")} {isFieldRequired("tahunMulaiBeasiswa") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="tahunMulaiBeasiswa"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: 2022"
              value={formData.tahunMulaiBeasiswa}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("tahunSelesaiBeasiswa") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("tahunSelesaiBeasiswa", "4. Tahun Selesai Menerima Beasiswa")} {isFieldRequired("tahunSelesaiBeasiswa") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="tahunSelesaiBeasiswa"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: 2024"
              value={formData.tahunSelesaiBeasiswa}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
