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
                {getFieldLabel("lamaBelajar", "f. Lama Belajar")} {isFieldRequired("lamaBelajar") && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                name="lamaBelajar"
                className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
                value={formData.lamaBelajar || "3"}
                onChange={handleInputChange}
              >
                <option value="3">3 Tahun (Standar SMP / MTs)</option>
                <option value="2">2 Tahun (Program Akselerasi / Cepat)</option>
                <option value="4">4 Tahun</option>
                <option value="1">1 Tahun</option>
              </select>
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
        {isFieldActive("diterimaKelas") && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
              {getFieldLabel("diterimaKelas", "a. Di Tingkat/Kelas")} {isFieldRequired("diterimaKelas") && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex flex-wrap gap-3">
              {["X (Sepuluh)", "XI (Sebelas)", "XII (Dua Belas)"].map((option) => {
                const isSelected = formData.diterimaKelas === option;
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-200 font-bold shadow-xs ring-1 ring-blue-500/20"
                        : "bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="diterimaKelas"
                      value={option}
                      checked={isSelected}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={`text-sm ${isSelected ? "font-extrabold text-blue-700 dark:text-blue-200" : "font-medium text-slate-700 dark:text-slate-200"}`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {isFieldActive("jurusan1") && (
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
              {getFieldLabel("jurusan1", "b. Program Keahlian")} {isFieldRequired("jurusan1") && <span className="text-red-500 ml-1">*</span>}
            </label>
            {(() => {
              const activeMajors = (majors && majors.length > 0)
                ? majors
                : [
                    { code: "REG", title: "Kelas Reguler" },
                    { code: "UNG", title: "Kelas Unggulan" }
                  ];

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeMajors.map((major) => {
                    const majorTitle = major.title || (major as unknown as { name?: string }).name || major.code;
                    const majorCode = major.code || majorTitle;
                    const option = `${majorTitle} (${majorCode})`;
                    const majorDetails = getMajorDetails(majorTitle || majorCode);

                  let isFull = false;
                  if (kuotaData && Array.isArray(kuotaData)) {
                    let k = null;
                    for (let i = 0; i < kuotaData.length; i++) {
                      if (kuotaData[i] && kuotaData[i].key === major.title) {
                        k = kuotaData[i];
                        break;
                      }
                    }
                    if (k && k.target > 0) {
                      isFull = k.jumlah >= k.target;
                    }
                  }

                  const isSelected = formData.jurusan1 === option && !isFull;
                  const hasLogo = Boolean(major.logo || majorDetails.logoPath);

                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                        isFull
                          ? "bg-slate-100 dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed grayscale"
                          : isSelected
                          ? "bg-blue-50/80 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/30 cursor-pointer"
                          : "bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        name="jurusan1"
                        value={option}
                        checked={isSelected}
                        onChange={(e) => {
                          if (!isFull) handleInputChange(e);
                        }}
                        disabled={isFull}
                        className="w-4 h-4 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-700 focus:ring-blue-500 disabled:opacity-50 shrink-0 cursor-pointer"
                      />
                      {hasLogo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={sanitizeSrc(major.logo) || majorDetails.logoPath}
                          alt={major.code}
                          className="w-9 h-9 object-contain rounded-lg shrink-0 bg-white/80 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-black text-xs ${
                          isSelected ? "bg-blue-600 text-white" : "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
                        }`}>
                          {major.code ? major.code.substring(0, 3).toUpperCase() : majorDetails.icon}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-extrabold leading-tight ${
                          isSelected ? "text-blue-950 dark:text-white" : "text-slate-900 dark:text-slate-100"
                        }`}>
                          {option}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${
                            isFull
                              ? "text-red-500"
                              : isSelected
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {isFull ? "KUOTA PENUH" : major.code}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            );
          })()}
          </div>
        )}
      </div>
    </div>
  );
};
