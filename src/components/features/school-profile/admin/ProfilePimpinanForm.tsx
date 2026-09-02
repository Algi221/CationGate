"use client";

import React from "react";
import Image from "next/image";
import { Upload, UserCheck } from "lucide-react";

interface ProfilePimpinanFormProps {
  pimpinan: {
    nama: string;
    jabatan: string;
    sambutan: string;
    foto: string;
  };
  setPimpinan: React.Dispatch<
    React.SetStateAction<{
      nama: string;
      jabatan: string;
      sambutan: string;
      foto: string;
    }>
  >;
  handlePimpinanPhotoChange: (file: File) => void;
}

export function ProfilePimpinanForm({
  pimpinan,
  setPimpinan,
  handlePimpinanPhotoChange,
}: ProfilePimpinanFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Pimpinan / Kepala Sekolah
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Informasi figur kepala sekolah atau pimpinan institusi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative w-28 h-28 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group">
            {pimpinan.foto ? (
              <Image
                src={pimpinan.foto}
                alt="Foto Pimpinan"
                width={112}
                height={112}
                className="w-full h-full object-cover object-top"
                unoptimized
              />
            ) : (
              <UserCheck className="w-8 h-8 text-slate-400 mb-1" />
            )}
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-5 h-5 text-white mb-1" />
              <span className="text-white text-[10px] font-semibold">Foto</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePimpinanPhotoChange(file);
                }}
              />
            </label>
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Foto Kepala Sekolah
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unggah foto resmi pimpinan sekolah (rasio 1:1, format PNG/JPG, maks
              2MB).
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Nama Lengkap &amp; Gelar
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {pimpinan.nama?.length || 0}/100
            </span>
          </div>
          <input
            type="text"
            maxLength={100}
            value={pimpinan.nama}
            onChange={(e) =>
              setPimpinan((p) => ({ ...p, nama: e.target.value }))
            }
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Dr. H. Ahmad Fauzi, M.Pd."
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Jabatan
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {pimpinan.jabatan?.length || 0}/50
            </span>
          </div>
          <input
            type="text"
            maxLength={50}
            value={pimpinan.jabatan}
            onChange={(e) =>
              setPimpinan((p) => ({ ...p, jabatan: e.target.value }))
            }
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Kepala Sekolah / Rektor"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Sambutan / Pernyataan Pimpinan
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {pimpinan.sambutan?.length || 0}/2000
            </span>
          </div>
          <textarea
            maxLength={2000}
            value={pimpinan.sambutan}
            onChange={(e) =>
              setPimpinan((p) => ({ ...p, sambutan: e.target.value }))
            }
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Sambutan singkat mengenai visi kepemimpinan dan dedikasi mutu pendidikan..."
          />
        </div>
      </div>
    </div>
  );
}
