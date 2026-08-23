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

export const Step8DataAyah: React.FC<StepProps> = ({
  formData,
  handleInputChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 8: Data Ayah Kandung</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Isi identitas lengkap ayah kandung sesuai dokumen resmi (KK/KTP).
      </p>

      <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">H</span>
          Data Ayah Kandung
        </h4>

        {isFieldActive("namaAyah") && (
          <div className="form-group mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("namaAyah", "1. Nama Lengkap")} {isFieldRequired("namaAyah") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="namaAyah"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Sesuai KTP/KK"
              value={formData.namaAyah}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {isFieldActive("tempatLahirAyah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("tempatLahirAyah", "2. Tempat Lahir")} {isFieldRequired("tempatLahirAyah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="tempatLahirAyah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.tempatLahirAyah}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("tglLahirAyah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("tglLahirAyah", "2. Tanggal Lahir")} {isFieldRequired("tglLahirAyah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                name="tglLahirAyah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.tglLahirAyah}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {isFieldActive("agamaAyah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("agamaAyah", "3. Agama")} {isFieldRequired("agamaAyah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                name="agamaAyah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                value={formData.agamaAyah}
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
          {isFieldActive("kewarganegaraanAyah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("kewarganegaraanAyah", "4. Kewarganegaraan")} {isFieldRequired("kewarganegaraanAyah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                name="kewarganegaraanAyah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                value={formData.kewarganegaraanAyah}
                onChange={handleInputChange}
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {isFieldActive("pendidikanAyah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("pendidikanAyah", "5. Pendidikan Terakhir")} {isFieldRequired("pendidikanAyah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="pendidikanAyah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="SD/SMP/SMA/S1"
                value={formData.pendidikanAyah}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("pekerjaanAyah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("pekerjaanAyah", "6. Pekerjaan")} {isFieldRequired("pekerjaanAyah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="pekerjaanAyah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Pekerjaan"
                value={formData.pekerjaanAyah}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("penghasilanAyah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("penghasilanAyah", "7. Penghasilan Per Bulan")} {isFieldRequired("penghasilanAyah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                name="penghasilanAyah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                value={formData.penghasilanAyah}
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

        {isFieldActive("alamatAyah") && (
          <div className="form-group mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("alamatAyah", "8. Alamat Rumah")} {isFieldRequired("alamatAyah") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="alamatAyah"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-3"
              placeholder="Nama Jalan / Perumahan / Kampung"
              value={formData.alamatAyah}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">RT/RW</label>
                <input
                  type="text"
                  name="rtrwAyah"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.rtrwAyah}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kelurahan</label>
                <input
                  type="text"
                  name="kelurahanAyah"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kelurahanAyah}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kecamatan</label>
                <input
                  type="text"
                  name="kecamatanAyah"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kecamatanAyah}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kode Pos</label>
                <input
                  type="text"
                  name="kodePosAyah"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kodePosAyah}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {isFieldActive("statusAyah") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("statusAyah", "9. Status Hidup/Meninggal Dunia")} {isFieldRequired("statusAyah") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name="statusAyah"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              value={formData.statusAyah}
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
