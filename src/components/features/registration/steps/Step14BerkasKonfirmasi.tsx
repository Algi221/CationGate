"use client";

import React from "react";
import { AlertCircle, FileText } from "lucide-react";
import { RegistrationFormData } from "../types";

interface Step14Props {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
}

export const Step14BerkasKonfirmasi: React.FC<Step14Props> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 14: Berkas & Konfirmasi Pendaftaran</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Konfirmasi kebenaran data pendaftaran Anda dan tinjau persyaratan berkas fisik.
      </p>

      {/* Premium Notice Box - Amber Highlighted */}
      <div className="bg-amber-500/7 dark:bg-amber-500/3 border-2 border-amber-500/30 rounded-[2.5rem] p-8 md:p-10 mb-8 shadow-lg shadow-amber-500/2">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-14 h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-500/20 animate-bounce">
            <AlertCircle size={28} />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-slate-900 dark:text-amber-400 text-lg md:text-xl mb-2 tracking-tight">
              PENTING: Informasi Verifikasi Berkas Fisik Calon Siswa
            </h4>
            <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed mb-6 font-semibold">
              Anda <span className="text-amber-600 dark:text-amber-400 font-black underline underline-offset-4">tidak perlu mengunggah berkas digital</span> di dalam formulir online ini. Sebagai gantinya, silakan lengkapi dan bawa berkas fisik/fotokopi berikut ini langsung ke panitia PPDB di sekolah saat melakukan proses verifikasi langsung:
            </p>

            {/* Grid of Documents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Kartu Keluarga (KK)", desc: "1 Lembar Fotokopi Sah" },
                { title: "KTP Orang Tua / Wali", desc: "1 Lembar Fotokopi (Kedua Orang Tua / Wali)" },
                { title: "Akta Kelahiran", desc: "1 Lembar Fotokopi Sah" },
                { title: "Pas Foto Berwarna (3x4)", desc: "2 Lembar (Latar Belakang Merah atau Biru)" },
                { title: "SKL / Ijazah SMP Asal", desc: "1 Lembar Fotokopi (Bisa disusulkan jika belum lulus)" },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-center p-4 rounded-3xl bg-white dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-800/80 shadow-md shadow-slate-100/50 dark:shadow-none hover:border-amber-500/30 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-450 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-500/20">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{doc.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {doc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Declaration Checkbox */}
      <div className="form-group">
        <label className="flex items-start gap-3.5 cursor-pointer p-5 rounded-2xl bg-background dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:bg-slate-100 dark:hover:bg-slate-900/40">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 accent-blue-600 rounded border-slate-400 dark:border-slate-700 shrink-0 cursor-pointer"
            checked={formData.deklarasi}
            onChange={(e) => setFormData((prev) => ({ ...prev, deklarasi: e.target.checked }))}
          />
          <span className="text-xs md:text-sm text-slate-650 dark:text-slate-400 leading-relaxed cursor-pointer font-medium">
            <strong>Pernyataan Kebenaran Data:</strong> Saya menyatakan dengan sadar dan penuh tanggung jawab bahwa seluruh data yang saya isikan di dalam formulir pendaftaran online ini adalah benar, lengkap, dan sesuai dengan dokumen asli. Apabila di kemudian hari ditemukan ketidaksesuaian atau pemalsuan data, saya bersedia menerima sanksi administrasi termasuk pembatalan pendaftaran di SMK Taruna Bhakti.
          </span>
        </label>
        {!formData.deklarasi && (
          <p className="text-rose-500 text-xs mt-3 ml-2 font-bold animate-pulse flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Wajib menyetujui pernyataan kebenaran data untuk mengirim pendaftaran.
          </p>
        )}
      </div>
    </div>
  );
};
