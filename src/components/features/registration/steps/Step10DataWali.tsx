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

export const Step10DataWali: React.FC<StepProps> = ({
  formData,
  handleInputChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 10: Data Wali (Opsional)</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Isi identitas lengkap wali murid (jika ada) sesuai dokumen resmi (KK/KTP).
      </p>

      <div className="p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">J</span>
          Data Wali Peserta Didik
        </h4>

        {isFieldActive("namaWali") && (
          <div className="form-group mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("namaWali", "1. Nama Lengkap")} {isFieldRequired("namaWali") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="namaWali"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Kosongkan jika tidak ada wali"
              value={formData.namaWali}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {isFieldActive("tempatLahirWali") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("tempatLahirWali", "2. Tempat Lahir")} {isFieldRequired("tempatLahirWali") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="tempatLahirWali"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.tempatLahirWali}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("tglLahirWali") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("tglLahirWali", "2. Tanggal Lahir")} {isFieldRequired("tglLahirWali") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                name="tglLahirWali"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.tglLahirWali}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {isFieldActive("agamaWali") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("agamaWali", "3. Agama")} {isFieldRequired("agamaWali") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                name="agamaWali"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                value={formData.agamaWali}
                onChange={handleInputChange}
              >
                <option value="">-- Pilih Agama --</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen Protestan</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>
          )}
          {isFieldActive("kewarganegaraanWali") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("kewarganegaraanWali", "4. Kewarganegaraan")} {isFieldRequired("kewarganegaraanWali") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                name="kewarganegaraanWali"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                value={formData.kewarganegaraanWali}
                onChange={handleInputChange}
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {isFieldActive("pendidikanWali") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("pendidikanWali", "5. Pendidikan Terakhir")} {isFieldRequired("pendidikanWali") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="pendidikanWali"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="SD/SMP/SMA/S1"
                value={formData.pendidikanWali}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("pekerjaanWali") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("pekerjaanWali", "6. Pekerjaan")} {isFieldRequired("pekerjaanWali") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="pekerjaanWali"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Pekerjaan"
                value={formData.pekerjaanWali}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("penghasilanWali") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("penghasilanWali", "7. Penghasilan Per Bulan")} {isFieldRequired("penghasilanWali") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                name="penghasilanWali"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                value={formData.penghasilanWali}
                onChange={handleInputChange}
              >
                <option value="">-- Pilih --</option>
                <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
              </select>
            </div>
          )}
        </div>

        {isFieldActive("alamatWali") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("alamatWali", "8. Alamat Rumah")} {isFieldRequired("alamatWali") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="alamatWali"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-3"
              placeholder="Nama Jalan / Perumahan / Kampung"
              value={formData.alamatWali}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">RT/RW</label>
                <input
                  type="text"
                  name="rtrwWali"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.rtrwWali}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kelurahan</label>
                <input
                  type="text"
                  name="kelurahanWali"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kelurahanWali}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kecamatan</label>
                <input
                  type="text"
                  name="kecamatanWali"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kecamatanWali}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kode Pos</label>
                <input
                  type="text"
                  name="kodePosWali"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kodePosWali}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {isFieldActive("statusWali") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("statusWali", "9. Status Hidup/Meninggal Dunia")} {isFieldRequired("statusWali") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name="statusWali"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              value={formData.statusWali}
              onChange={handleInputChange}
            >
              <option value="Masih Hidup">Masih Hidup</option>
              <option value="Meninggal Dunia">Meninggal Dunia</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
