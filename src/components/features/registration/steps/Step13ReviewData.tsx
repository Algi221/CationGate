"use client";

import React from "react";
import { User, Home, School, Users, FileText, AlertCircle, Pencil } from "lucide-react";
import { RegistrationFormData } from "../types";

interface Step13Props {
  formData: RegistrationFormData;
  goToStep: (step: number) => void;
}

export const Step13ReviewData: React.FC<Step13Props> = ({
  formData,
  goToStep,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 text-left">
      <div>
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 13: Tinjau & Verifikasi Data Anda</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          Silakan periksa kembali seluruh data yang telah Anda masukkan. Jika ada data yang tidak benar, klik tombol <strong>Ubah Data</strong> pada bagian terkait untuk mengubahnya lagi tanpa perlu menulis ulang dari awal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Identitas Diri */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              Identitas Diri
            </h4>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Pencil size={12} />
              <span>Ubah Data</span>
            </button>
          </div>
          <div className="text-xs space-y-2.5 font-bold text-slate-650 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Nama Lengkap:</span>
              <span className="text-slate-800 dark:text-white uppercase">{formData.nama || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">NISN:</span>
              <span className="font-mono text-slate-800 dark:text-white">{formData.nisn || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">NIK:</span>
              <span className="font-mono text-slate-800 dark:text-white">{formData.nik || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tempat, Tgl Lahir:</span>
              <span>
                {formData.tempatLahir || "-"}, {formData.tglLahir || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Jenis Kelamin:</span>
              <span>{formData.jenisKelamin === "L" ? "Laki-laki" : formData.jenisKelamin === "P" ? "Perempuan" : "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Agama:</span>
              <span>{formData.agama || "-"}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Alamat & Kontak */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <Home size={16} className="text-blue-500" />
              Alamat &amp; Kontak
            </h4>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Pencil size={12} />
              <span>Ubah Data</span>
            </button>
          </div>
          <div className="text-xs space-y-2.5 font-bold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Alamat Rumah:</span>
              <span className="text-right max-w-45 truncate">{formData.alamat || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">RT / RW:</span>
              <span>{formData.rtRw || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kelurahan:</span>
              <span>{formData.kelurahan || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kecamatan:</span>
              <span>{formData.kecamatan || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">No. WhatsApp:</span>
              <span className="font-mono">{formData.whatsapp || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">E-mail:</span>
              <span>{formData.email || "-"}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pendidikan & Peminatan */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <School size={16} className="text-blue-500" />
              Pendidikan &amp; Jurusan
            </h4>
            <button
              type="button"
              onClick={() => goToStep(7)}
              className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Pencil size={12} />
              <span>Ubah Data</span>
            </button>
          </div>
          <div className="text-xs space-y-2.5 font-bold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Sekolah Asal:</span>
              <span className="uppercase">{formData.sekolahAsal || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Jurusan Utama:</span>
              <span className="text-primary dark:text-sky-450 uppercase">{formData.jurusan1 || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tanggal Lulus:</span>
              <span>{formData.tglLulus || "-"}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Data Orang Tua / Wali */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              Keluarga &amp; Orang Tua
            </h4>
            <button
              type="button"
              onClick={() => goToStep(8)}
              className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Pencil size={12} />
              <span>Ubah Data</span>
            </button>
          </div>
          <div className="text-xs space-y-2.5 font-bold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Nama Ayah:</span>
              <span className="uppercase">{formData.namaAyah || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Nama Ibu:</span>
              <span className="uppercase">{formData.namaIbu || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Nama Wali:</span>
              <span className="uppercase">{formData.namaWali || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Telepon Orang Tua:</span>
              <span className="font-mono">{formData.teleponOrtu || "-"}</span>
            </div>
          </div>
        </div>

        {/* Card 5: Nilai US & Minat */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              Nilai &amp; Akademik
            </h4>
            <button
              type="button"
              onClick={() => goToStep(11)}
              className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Pencil size={12} />
              <span>Ubah Data</span>
            </button>
          </div>
          <div className="text-xs space-y-2.5 font-bold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Nilai US Teori:</span>
              <span className="font-mono">{formData.nilaiUSTeori || "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Nilai US Praktik:</span>
              <span className="font-mono">{formData.nilaiUSPraktik || "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Nilai Muatan Lokal:</span>
              <span className="font-mono">{formData.nilaiMuatanLokal || "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cita-cita Lulus:</span>
              <span>{formData.citaCitaSetelahLulus || "-"}</span>
            </div>
          </div>
        </div>

        {/* Card 6: Kepribadian & Kebiasaan */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-500" />
              Kedisiplinan &amp; Keuangan
            </h4>
            <button
              type="button"
              onClick={() => goToStep(12)}
              className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Pencil size={12} />
              <span>Ubah Data</span>
            </button>
          </div>
          <div className="text-xs space-y-2.5 font-bold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Sanggup Taat Tata Tertib:</span>
              <span>{formData.janjiTaat || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sanggup Sanksi:</span>
              <span>{formData.janjiSanksi || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Penerima KPS/KIP:</span>
              <span>
                KPS: {formData.punyaKPS}, KIP: {formData.punyaKIP}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Penyakit Diderita:</span>
              <span>{formData.penyakitDiderita || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
