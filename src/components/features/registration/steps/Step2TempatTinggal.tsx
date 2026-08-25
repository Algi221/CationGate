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

export const Step2TempatTinggal: React.FC<StepProps> = ({
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
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 2: Data Tempat Tinggal</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Informasi alamat tempat tinggal dan kontak yang dapat dihubungi.
      </p>

      {isFieldActive("alamat") && (
        <div className="form-group mb-4">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
            {getFieldLabel("alamat", "Alamat Rumah (Jalan, No. Rumah)")} {isFieldRequired("alamat") && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            name="alamat"
            className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            rows={2}
            placeholder="Contoh: Jl. Pekapuran No. 10"
            value={formData.alamat}
            onChange={handleInputChange}
          ></textarea>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("rtRw") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("rtRw", "RT / RW")} {isFieldRequired("rtRw") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="rtRw"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: 002/005"
              value={formData.rtRw}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("kodePos") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("kodePos", "Kode Pos")} {isFieldRequired("kodePos") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="kodePos"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: 16453"
              value={formData.kodePos}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("kelurahan") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("kelurahan", "Kelurahan")} {isFieldRequired("kelurahan") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="kelurahan"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: Curug"
              value={formData.kelurahan}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("kecamatan") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("kecamatan", "Kecamatan")} {isFieldRequired("kecamatan") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="kecamatan"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: Cimanggis"
              value={formData.kecamatan}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {isFieldActive("whatsapp") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("whatsapp", "Nomor Telepon / HP Siswa")} {isFieldRequired("whatsapp") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              inputMode="tel"
              name="whatsapp"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Contoh: 081234567890"
              value={formData.whatsapp}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("teleponOrtu") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("teleponOrtu", "Nomor Telepon Orang Tua (Ayah/Ibu/Wali)")} {isFieldRequired("teleponOrtu") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              inputMode="tel"
              name="teleponOrtu"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Nomor yang mudah dihubungi"
              value={formData.teleponOrtu}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isFieldActive("email") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("email", "E-mail Pribadi Siswa")} {isFieldRequired("email") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="email"
              name="email"
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isFieldActive("tinggalDengan") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("tinggalDengan", "Tinggal Bersama dengan")} {isFieldRequired("tinggalDengan") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={formData.tinggalDengan}
              onValueChange={(val) => triggerSelectChange("tinggalDengan", val)}
            >
              <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                <SelectValue placeholder="-- Pilih --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Orang Tua">Orang Tua</SelectItem>
                <SelectItem value="Saudara">Saudara</SelectItem>
                <SelectItem value="Kos/Asrama">Kos / Asrama</SelectItem>
                <SelectItem value="Wali">Wali</SelectItem>
                <SelectItem value="Panti Asuhan">Panti Asuhan</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {isFieldActive("transportasi") && (
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {getFieldLabel("transportasi", "Moda Transportasi")} {isFieldRequired("transportasi") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={formData.transportasi}
              onValueChange={(val) => triggerSelectChange("transportasi", val)}
            >
              <SelectTrigger className="w-full h-11.5 rounded-xl bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 px-4 text-sm font-medium">
                <SelectValue placeholder="-- Pilih --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jalan Kaki">Jalan Kaki</SelectItem>
                <SelectItem value="Angkutan Umum">Angkutan Umum</SelectItem>
                <SelectItem value="Mobil Antar Jemput">Mobil Antar Jemput</SelectItem>
                <SelectItem value="Kereta Api">Kereta Api</SelectItem>
                <SelectItem value="Mobil Pribadi">Mobil Pribadi</SelectItem>
                <SelectItem value="Sepeda Motor">Sepeda Motor</SelectItem>
                <SelectItem value="Sepeda">Sepeda</SelectItem>
                <SelectItem value="Ojek">Ojek</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
