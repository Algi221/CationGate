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

export const Step5Prestasi: React.FC<StepProps> = ({
  formData,
  setFormData,
  handleInputChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 5: Data Prestasi (Opsional)</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Isi data prestasi yang pernah diraih. Klik &quot;Lewati&quot; jika tidak ada.
      </p>

      <div className="form-group mb-5">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">1. Jenis Prestasi</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Sains", "Seni", "Olahraga", "Lainnya"].map((option) => {
            const isChecked = formData.jenisPrestasi?.includes(option) || false;
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
                      const cur = prev.jenisPrestasi || [];
                      return {
                        ...prev,
                        jenisPrestasi: cur.includes(option) ? cur.filter((i) => i !== option) : [...cur, option],
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

      <div className="form-group mb-5">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">2. Tingkat</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Sekolah", "Kecamatan", "Kab/Kota", "Propinsi", "Nasional", "Internasional", "Lainnya"].map((option) => {
            const isChecked = formData.tingkatPrestasi?.includes(option) || false;
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
                      const cur = prev.tingkatPrestasi || [];
                      return {
                        ...prev,
                        tingkatPrestasi: cur.includes(option) ? cur.filter((i) => i !== option) : [...cur, option],
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("uraianPrestasi") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("uraianPrestasi", "3. Uraian Prestasi")} {isFieldRequired("uraianPrestasi") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="uraianPrestasi"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Misal: Juara 1 Olimpiade Matematika"
              value={formData.uraianPrestasi}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("tahunPrestasi") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("tahunPrestasi", "4. Tahun Prestasi")} {isFieldRequired("tahunPrestasi") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="tahunPrestasi"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: 2024"
              value={formData.tahunPrestasi}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      {isFieldActive("penyelenggara") && (
        <div className="form-group mb-4">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
            {getFieldLabel("penyelenggara", "5. Penyelenggara")} {isFieldRequired("penyelenggara") && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            name="penyelenggara"
            className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Misal: Dinas Pendidikan Kota Depok"
            value={formData.penyelenggara}
            onChange={handleInputChange}
          />
        </div>
      )}

      <div className="form-group">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">6. Bukti Prestasi</label>
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
          <div className="shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700 mb-1">Himbauan Sertifikat Prestasi</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Jika Anda memiliki sertifikat, piagam, atau bukti prestasi lainnya, harap <strong>membawa dokumen fisik asli ke sekolah</strong> pada saat daftar ulang. Dokumen akan diverifikasi oleh panitia PPDB secara langsung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
