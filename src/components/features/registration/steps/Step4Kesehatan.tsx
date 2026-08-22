"use client";

import React from "react";
import { RegistrationFormData } from "../types";

interface StepProps {
  formData: RegistrationFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (value: string) => void;
  getFieldLabel: (key: string, defaultLabel: string) => string;
  isFieldRequired: (key: string) => boolean;
  isFieldActive: (key: string) => boolean;
}

export const Step4Kesehatan: React.FC<StepProps> = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 4: Data Kesehatan & Berkebutuhan Khusus</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Mohon isi data golongan darah, riwayat penyakit, serta kebutuhan khusus jika ada.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {isFieldActive("golonganDarah") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("golonganDarah", "Golongan Darah")} {isFieldRequired("golonganDarah") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name="golonganDarah"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              value={formData.golonganDarah}
              onChange={handleInputChange}
            >
              <option value="">-- Pilih --</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
              <option value="Tidak Tahu">Tidak Tahu</option>
            </select>
          </div>
        )}
        {isFieldActive("penyakitDiderita") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("penyakitDiderita", "Penyakit Yang Pernah Diderita")} {isFieldRequired("penyakitDiderita") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="penyakitDiderita"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Misal: Asma, TBC, dll (kosongkan jika tidak ada)"
              value={formData.penyakitDiderita}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">Berkebutuhan Khusus / Kelainan</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            "Netra",
            "Rungu",
            "Grahita Sedang",
            "Grahita Ringan",
            "Laras",
            "Wicara",
            "Daksa Sedang",
            "Daksa Ringan",
            "Autis",
            "Indigo",
            "Hyper Aktif",
            "Bakat Istimewa",
            "Cerdas Istimewa",
            "Down Syndrome",
            "Narkoba",
            "Kesulitan Belajar",
            "Lainnya"
          ].map((option) => {
            const isChecked = formData.kebutuhanKhusus?.includes(option) || false;
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
                  onChange={() => handleCheckboxChange(option)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 accent-blue-600"
                />
                <span className="text-xs font-bold">{option}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
