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

export const Step11KegemaranMinat: React.FC<StepProps> = ({
  formData,
  setFormData,
  handleInputChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 11: Data Kegemaran & Minat</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Isi data hobi, cita-cita, dan minat bakat siswa.
      </p>

      <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">K</span>
          Data Kegemaran Peserta Didik
        </h4>
        <div className="form-group mb-5">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">1. Hobi</label>
          <div className="flex flex-wrap gap-3">
            {["Olahraga", "Kesenian", "Membaca", "Menulis", "Travelling", "Lainnya"].map((option) => {
              const isChecked = formData.hobi?.includes(option) || false;
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-primary/5 border-blue-400 text-primary shadow-sm"
                      : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-[#1e293b]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                    onChange={() =>
                      setFormData((prev) => {
                        const cur = prev.hobi || [];
                        return {
                          ...prev,
                          hobi: cur.includes(option) ? cur.filter((i) => i !== option) : [...cur, option],
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
        {isFieldActive("citaCita") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
              {getFieldLabel("citaCita", "2. Cita-cita")} {isFieldRequired("citaCita") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name="citaCita"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              value={formData.citaCita}
              onChange={handleInputChange}
            >
              <option value="">-- Pilih Cita-cita --</option>
              <option value="PNS">PNS</option>
              <option value="TNI/POLRI">TNI/POLRI</option>
              <option value="Guru/Dosen">Guru/Dosen</option>
              <option value="Dokter">Dokter</option>
              <option value="Politikus">Politikus</option>
              <option value="Wiraswasta">Wiraswasta</option>
              <option value="Seni Lukis/Artis">Seni Lukis/Artis/Sejenisnya</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        )}
      </div>

      <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">L</span>
          Data Minat dan Kemampuan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {isFieldActive("nilaiUSTeori") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("nilaiUSTeori", "1. Nilai US (Teori)")} {isFieldRequired("nilaiUSTeori") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="number"
                name="nilaiUSTeori"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.nilaiUSTeori}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("nilaiUSPraktik") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("nilaiUSPraktik", "2. Nilai US (Praktik)")} {isFieldRequired("nilaiUSPraktik") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="number"
                name="nilaiUSPraktik"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.nilaiUSPraktik}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>
        {isFieldActive("nilaiMuatanLokal") && (
          <div className="form-group mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("nilaiMuatanLokal", "2. Nilai Muatan Lokal")} {isFieldRequired("nilaiMuatanLokal") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              name="nilaiMuatanLokal"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={formData.nilaiMuatanLokal}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("alasanMemilih") && (
          <div className="form-group mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("alasanMemilih", "3. Memilih SMK Taruna Bhakti Karena")} {isFieldRequired("alasanMemilih") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-4">
              {["Diri Sendiri", "Orang Tua/Wali"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    formData.alasanMemilih === option
                      ? "bg-primary/5 border-blue-400 text-primary"
                      : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="alasanMemilih"
                    value={option}
                    checked={formData.alasanMemilih === option}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {isFieldActive("citaCitaSetelahLulus") && (
          <div className="form-group mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("citaCitaSetelahLulus", "4. Cita-cita Setelah Lulus SMK")} {isFieldRequired("citaCitaSetelahLulus") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="citaCitaSetelahLulus"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: Kuliah / Bekerja di Industri"
              value={formData.citaCitaSetelahLulus}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {isFieldActive("pelajaranDisenangi") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("pelajaranDisenangi", "5. Pelajaran Yg Disenangi di SMP/MTs")} {isFieldRequired("pelajaranDisenangi") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="pelajaranDisenangi"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Contoh: Matematika"
                value={formData.pelajaranDisenangi}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("alasanDisenangi") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("alasanDisenangi", "Alasan Disenangi")} {isFieldRequired("alasanDisenangi") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="alasanDisenangi"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Alasan"
                value={formData.alasanDisenangi}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>
        {isFieldActive("kesulitanBelajar") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("kesulitanBelajar", "6. Kesulitan Belajar di SMP/MTs")} {isFieldRequired("kesulitanBelajar") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="kesulitanBelajar"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Ada hambatan/kesulitan apa?"
              value={formData.kesulitanBelajar}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
