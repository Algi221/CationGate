"use client";

import React from "react";
import Image from "next/image";
import { Upload, Image as ImageIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileIdentitasFormProps {
  identitas: {
    nama: string;
    akreditasi: string;
    alamat: string;
    npsn: string;
    status: string;
    kurikulum: string;
    tahun_berdiri: string;
    email: string;
    telepon: string;
  };
  setIdentitas: React.Dispatch<
    React.SetStateAction<{
      nama: string;
      akreditasi: string;
      alamat: string;
      npsn: string;
      status: string;
      kurikulum: string;
      tahun_berdiri: string;
      email: string;
      telepon: string;
    }>
  >;
  logoInput: string;
  handleSchoolLogoChange: (file: File) => void;
  handleIdentitasChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function ProfileIdentitasForm({
  identitas,
  setIdentitas,
  logoInput,
  handleSchoolLogoChange,
  handleIdentitasChange,
}: ProfileIdentitasFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Identitas Utama Sekolah
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Informasi pokok sekolah yang digunakan di profil dan kop surat sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group">
            {logoInput ? (
              <Image
                src={logoInput}
                alt="Logo"
                width={128}
                height={128}
                className="w-full h-full object-contain p-2"
                unoptimized
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
            )}
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-xs font-semibold">Ubah Logo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSchoolLogoChange(file);
                }}
              />
            </label>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Logo Resmi Sekolah
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Logo ini akan digunakan pada seluruh halaman portal PPDB, formulir
              pendaftaran, dan dokumen kelulusan.
            </p>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Nama Sekolah
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {identitas.nama?.length || 0}/100
            </span>
          </div>
          <input
            type="text"
            name="nama"
            maxLength={100}
            value={identitas.nama}
            onChange={handleIdentitasChange}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Contoh: SMK Taruna Bhakti"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            NPSN
          </label>
          <input
            type="text"
            name="npsn"
            maxLength={20}
            value={identitas.npsn}
            onChange={handleIdentitasChange}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Contoh: 2080701234"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Status Akreditasi
          </label>
          <Select
            value={identitas.akreditasi || "A (Unggul)"}
            onValueChange={(val) => {
              setIdentitas((prev) => ({ ...prev, akreditasi: val }));
            }}
          >
            <SelectTrigger className="w-full h-11.5 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium">
              <SelectValue placeholder="Pilih Status Akreditasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A (Unggul)">A (Unggul)</SelectItem>
              <SelectItem value="B (Baik Sekali)">B (Baik Sekali)</SelectItem>
              <SelectItem value="C (Baik)">C (Baik)</SelectItem>
              <SelectItem value="Belum Terakreditasi">
                Belum Terakreditasi
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Tahun Berdiri
          </label>
          <input
            type="text"
            name="tahun_berdiri"
            inputMode="numeric"
            maxLength={4}
            value={identitas.tahun_berdiri}
            onChange={(e) => {
              const num = e.target.value.replace(/\D/g, "").slice(0, 4);
              setIdentitas((prev) => ({ ...prev, tahun_berdiri: num }));
            }}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Contoh: 2004"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Email Resmi
          </label>
          <input
            type="email"
            maxLength={100}
            name="email"
            value={identitas.email}
            onChange={handleIdentitasChange}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="admin@sekolah.sch.id"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No. Telepon / WhatsApp
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-0 top-0 bottom-0 px-3.5 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 rounded-l-xl flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 select-none">
              +62
            </div>
            <input
              type="tel"
              name="telepon"
              inputMode="numeric"
              maxLength={13}
              value={
                identitas.telepon
                  ? identitas.telepon.replace(/^(\+?62|0)/, "")
                  : ""
              }
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.startsWith("0")) val = val.slice(1);
                if (val.startsWith("62")) val = val.slice(2);
                val = val.slice(0, 13);
                setIdentitas((prev) => ({
                  ...prev,
                  telepon: val ? `0${val}` : "",
                }));
              }}
              className="w-full pl-16 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              placeholder="81234567890"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Alamat Lengkap
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {identitas.alamat?.length || 0}/300
            </span>
          </div>
          <textarea
            name="alamat"
            maxLength={300}
            value={identitas.alamat}
            onChange={handleIdentitasChange}
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Jl. Pekapuran No. 1..."
          />
        </div>
      </div>
    </div>
  );
}
