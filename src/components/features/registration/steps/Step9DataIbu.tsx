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

export const Step9DataIbu: React.FC<StepProps> = ({
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
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 9: Data Ibu Kandung</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Isi identitas lengkap ibu kandung sesuai dokumen resmi (KK/KTP).
      </p>

      <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span className="bg-pink-100 text-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">I</span>
          Data Ibu Kandung
        </h4>

        {isFieldActive("namaIbu") && (
          <div className="form-group mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("namaIbu", "1. Nama Lengkap")} {isFieldRequired("namaIbu") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="namaIbu"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Sesuai KTP/KK"
              value={formData.namaIbu}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {isFieldActive("tempatLahirIbu") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("tempatLahirIbu", "2. Tempat Lahir")} {isFieldRequired("tempatLahirIbu") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="tempatLahirIbu"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.tempatLahirIbu}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("tglLahirIbu") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("tglLahirIbu", "2. Tanggal Lahir")} {isFieldRequired("tglLahirIbu") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                name="tglLahirIbu"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.tglLahirIbu}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {isFieldActive("agamaIbu") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("agamaIbu", "3. Agama")} {isFieldRequired("agamaIbu") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Select
                value={formData.agamaIbu}
                onValueChange={(val) => triggerSelectChange("agamaIbu", val)}
              >
                <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                  <SelectValue placeholder="-- Pilih Agama --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Islam">Islam</SelectItem>
                  <SelectItem value="Kristen">Kristen Protestan</SelectItem>
                  <SelectItem value="Katolik">Katolik</SelectItem>
                  <SelectItem value="Hindu">Hindu</SelectItem>
                  <SelectItem value="Buddha">Buddha</SelectItem>
                  <SelectItem value="Konghucu">Konghucu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {isFieldActive("kewarganegaraanIbu") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("kewarganegaraanIbu", "4. Kewarganegaraan")} {isFieldRequired("kewarganegaraanIbu") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Select
                value={formData.kewarganegaraanIbu || "WNI"}
                onValueChange={(val) => triggerSelectChange("kewarganegaraanIbu", val)}
              >
                <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                  <SelectValue placeholder="-- Pilih --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WNI">WNI</SelectItem>
                  <SelectItem value="WNA">WNA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {isFieldActive("pendidikanIbu") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("pendidikanIbu", "5. Pendidikan Terakhir")} {isFieldRequired("pendidikanIbu") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="pendidikanIbu"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="SD/SMP/SMA/S1"
                value={formData.pendidikanIbu}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("pekerjaanIbu") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("pekerjaanIbu", "6. Pekerjaan")} {isFieldRequired("pekerjaanIbu") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="pekerjaanIbu"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Pekerjaan"
                value={formData.pekerjaanIbu}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("penghasilanIbu") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("penghasilanIbu", "7. Penghasilan Per Bulan")} {isFieldRequired("penghasilanIbu") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Select
                value={formData.penghasilanIbu}
                onValueChange={(val) => triggerSelectChange("penghasilanIbu", val)}
              >
                <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                  <SelectValue placeholder="-- Pilih --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="< Rp 1.000.000">&lt; Rp 1.000.000</SelectItem>
                  <SelectItem value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</SelectItem>
                  <SelectItem value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</SelectItem>
                  <SelectItem value="> Rp 5.000.000">&gt; Rp 5.000.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {isFieldActive("alamatIbu") && (
          <div className="form-group mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("alamatIbu", "8. Alamat Rumah")} {isFieldRequired("alamatIbu") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="alamatIbu"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-3"
              placeholder="Nama Jalan / Perumahan / Kampung"
              value={formData.alamatIbu}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">RT/RW</label>
                <input
                  type="text"
                  name="rtrwIbu"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.rtrwIbu}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kelurahan</label>
                <input
                  type="text"
                  name="kelurahanIbu"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kelurahanIbu}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kecamatan</label>
                <input
                  type="text"
                  name="kecamatanIbu"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kecamatanIbu}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kode Pos</label>
                <input
                  type="text"
                  name="kodePosIbu"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.kodePosIbu}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {isFieldActive("statusIbu") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("statusIbu", "9. Status Hidup/Meninggal Dunia")} {isFieldRequired("statusIbu") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={formData.statusIbu || "Masih Hidup"}
              onValueChange={(val) => triggerSelectChange("statusIbu", val)}
            >
              <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masih Hidup">Masih Hidup</SelectItem>
                <SelectItem value="Meninggal Dunia">Meninggal Dunia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
