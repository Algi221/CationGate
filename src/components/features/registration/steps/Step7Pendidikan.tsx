"use client";

import React from "react";
import { RegistrationFormData, sanitizeSrc, getMajorDetails } from "../types";

interface Step7Props {
  formData: RegistrationFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  getFieldLabel: (key: string, defaultLabel: string) => string;
  isFieldRequired: (key: string) => boolean;
  isFieldActive: (key: string) => boolean;
  majors: Array<{ code: string; title: string; logo?: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kuotaData: any[] | null;
}

export const Step7Pendidikan: React.FC<Step7Props> = ({
  formData,
  handleInputChange,
  getFieldLabel,
  isFieldRequired,
  isFieldActive,
  majors,
  kuotaData
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 7: Data Rincian (Data Pendidikan)</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Data riwayat pendidikan, status pindahan, dan peminatan kompetensi.
      </p>

      <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">G</span>
          1. Pendidikan Sebelumnya
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isFieldActive("sekolahAsal") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("sekolahAsal", "a. Lulusan dari SMP/MTs")} {isFieldRequired("sekolahAsal") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="sekolahAsal"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Nama sekolah asal"
                value={formData.sekolahAsal}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("tglLulus") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("tglLulus", "b. Tanggal Lulus dari SMP/MTs")} {isFieldRequired("tglLulus") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                name="tglLulus"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.tglLulus}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("noIjazah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("noIjazah", "c. Nomor Seri Ijazah SMP/MTs")} {isFieldRequired("noIjazah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="noIjazah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Kosongkan jika tidak ada"
                value={formData.noIjazah}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("noSKHUN") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("noSKHUN", "d. Nomor Seri SKHUN SMP/MTs")} {isFieldRequired("noSKHUN") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="noSKHUN"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Kosongkan jika tidak ada"
                value={formData.noSKHUN}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("noPesertaUN") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("noPesertaUN", "e. Nomor Peserta UN SMP/MTs")} {isFieldRequired("noPesertaUN") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="noPesertaUN"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Kosongkan jika tidak ada"
                value={formData.noPesertaUN}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("lamaBelajar") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("lamaBelajar", "f. Lama Belajar (Tahun)")} {isFieldRequired("lamaBelajar") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="lamaBelajar"
                  className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Contoh: 3"
                  value={formData.lamaBelajar}
                  onChange={handleInputChange}
                />
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Tahun</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
          Pindahan (Hanya Untuk Murid Pindahan)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isFieldActive("pindahanDari") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("pindahanDari", "a. Dari SMP/MTs")} {isFieldRequired("pindahanDari") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="pindahanDari"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Kosongkan jika bukan pindahan"
                value={formData.pindahanDari}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isFieldActive("alasanPindah") && (
            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {getFieldLabel("alasanPindah", "b. Alasan Pindah Sekolah")} {isFieldRequired("alasanPindah") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="alasanPindah"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Opsional"
                value={formData.alasanPindah}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
          Diterima di Sekolah Ini
        </h4>
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">a. Di Tingkat/Kelas</label>
          <div className="flex flex-wrap gap-3">
            {["X (Sepuluh)", "XI (Sebelas)", "XII (Dua Belas)"].map((option) => (
              <label
                key={option}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  formData.diterimaKelas === option
                    ? "bg-primary/5 border-blue-400 text-primary"
                    : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-[#1e293b]"
                }`}
              >
                <input
                  type="radio"
                  name="diterimaKelas"
                  value={option}
                  checked={formData.diterimaKelas === option}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-slate-300 dark:border-slate-700 focus:ring-primary"
                />
                <span className="text-sm font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">b. Program Keahlian</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {majors.map((major) => {
              const option = `${major.title} (${major.code})`;
              const majorDetails = getMajorDetails(major.title || major.code);

              let isFull = false;
              if (kuotaData) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const k = kuotaData.find((item: any) => item.key === major.title);
                if (k && k.target > 0) {
                  isFull = k.jumlah >= k.target;
                }
              }

              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                    isFull
                      ? "bg-slate-100 dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed grayscale"
                      : formData.jurusan1 === option
                      ? `${majorDetails.bg} border-current ${majorDetails.textColor} shadow-md cursor-pointer ring-2 ring-current/20`
                      : "bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-background hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                  }`}
                >
                  <input
                    type="radio"
                    name="jurusan1"
                    value={option}
                    checked={formData.jurusan1 === option && !isFull}
                    onChange={(e) => {
                      if (!isFull) handleInputChange(e);
                    }}
                    disabled={isFull}
                    className="w-4 h-4 text-primary border-slate-300 dark:border-slate-700 focus:ring-primary disabled:opacity-50 shrink-0"
                  />
                  {majorDetails.logoPath ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={sanitizeSrc(major.logo) || majorDetails.logoPath}
                      alt={major.code}
                      className="w-9 h-9 object-contain rounded-lg shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${majorDetails.bg}`}>
                      {majorDetails.icon}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold leading-tight">{option}</span>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                        isFull ? "text-red-500" : majorDetails.textColor
                      }`}
                    >
                      {isFull ? "KUOTA PENUH" : major.code}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
