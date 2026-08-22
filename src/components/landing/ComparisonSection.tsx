"use client";

import React from "react";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";

export function ComparisonSection() {
  const comparisonItems = [
    {
      aspect: "Pengisian Formulir",
      conventional: {
        title: "Beli Map & Tulis Tangan Fisik",
        desc: "Calon siswa dan orang tua wajib datang fisik ke sekolah, membeli formulir kertas, dan mengisi biodata panjang di loket.",
      },
      cationgate: {
        title: "Isi Mandiri dari Smartphone / Laptop",
        desc: "Pendaftaran dapat diakses dari HP atau device apa pun. Formulir digital responsif dengan validasi NISN & NIK.",
      }
    },
    {
      aspect: "Pembayaran Biaya Formulir",
      conventional: {
        title: "Antre di loket(TU) / Kirim Foto Struk Manual",
        desc: "Pembayaran tunai di loket(TU) harus datang fisik ke sekolah dan harus mengantre untuk membayar biaya pendaftaran.",
      },
      cationgate: {
        title: "Multi-Metode: VA & Opsi Tunai",
        desc: "Mendukung transfer Virtual Account (VA) maupun pembayaran tunai langsung di sekolah dengan pencatatan di dashboard.",
      }
    },
    {
      aspect: "Pencatatan & Manajemen Data",
      conventional: {
        title: "Ketik Manual Satu per Satu di Excel",
        desc: "Panitia harus lembur memindahkan data dari kertas ke spreadsheet. Rentan salah input nilai, data ganda, dan file rusak.",
      },
      cationgate: {
        title: "Dashboard Admin Terpusat",
        desc: "Semua pendaftar masuk otomatis ke database sekolah. Dilengkapi filter status, pencarian instan, dan ekspor 1-klik siap impor ke Dapodik.",
      }
    },
    {
      aspect: "Verifikasi Dokumen & Berkas",
      conventional: {
        title: "Susah mengoreksi seorang calon siswa sudah melengkapi berkas atau belum",
        desc: "Panitia harus memeriksa satu per satu berkas fisik yang diberikan oleh calon siswa.",
      },
      cationgate: {
        title: "Validasi Berkas Digital dengan fitur to-do list",
        desc: "Panitia bisa mencentang todo yang isinya adalah berkas-berkas yang harus dilengkapi."
      }
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FFC000]" />
            <span>Transformasi SPMB Sekolah</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
            Tinggalkan Cara Lama, Beralih ke Ekosistem Cerdas.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Bandingkan repotnya pengelolaan formulir fisik dan pencatatan manual di Excel dengan kemudahan sistem SPMB cloud modern dari CationGate.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {}
          <div className="flex flex-col rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-200/70 px-3 py-1 rounded-full">
                  Metode Lama
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2.5">
                  Cara Konvensional
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-bold">
                <X className="w-5 h-5" />
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Membebani panitia dengan input data berulang, tumpukan berkas fisik yang rawan hilang, dan antrean panjang di loket sekolah.
            </p>

            {}
            <div className="divide-y divide-slate-200 flex-1">
              {comparisonItems.map((item, idx) => (
                <div key={idx} className="py-5 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-black shrink-0">
                      ✕
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {item.aspect}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 pl-7">
                    {item.conventional.title}
                  </h4>
                  <p className="text-sm text-slate-600 pl-7 leading-relaxed font-normal">
                    {item.conventional.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-rose-600 font-semibold">
                Membutuhkan banyak waktu kerja, biaya cetak formulir, dan risiko human error tinggi.
              </p>
            </div>
          </div>

          {}
          <div className="flex flex-col rounded-3xl bg-slate-950 text-white border-2 border-[#FFC000] p-6 sm:p-8 lg:p-10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-950 bg-[#FFC000] px-3 py-1 rounded-full">
                  Solusi CationGate
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2.5">
                  Portal Cloud Mandiri
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FFC000] flex items-center justify-center text-slate-950 shrink-0 font-bold">
                <Check className="w-5 h-5 stroke-3" />
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-8 leading-relaxed">
              Pengisian formulir mandiri dari smartphone, verifikasi multi-metode pembayaran, dan manajemen berkas satu pintu melalui Dashboard Admin.
            </p>

            {}
            <div className="divide-y divide-slate-800 flex-1">
              {comparisonItems.map((item, idx) => (
                <div key={idx} className="py-5 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFC000] text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
                      ✓
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFC000]">
                      {item.aspect}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white pl-7">
                    {item.cationgate.title}
                  </h4>
                  <p className="text-sm text-slate-300 pl-7 leading-relaxed font-normal">
                    {item.cationgate.desc}
                  </p>
                </div>
              ))}
            </div>

            {}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-medium">
                100% Paperless • Siap Impor Dapodik
              </span>
              <Link href="/daftar" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFC000] hover:bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer">
                  <span>Daftar Sekolah Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

        </div>

        {}
        <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <strong className="font-bold text-slate-950">Catatan Layanan Pembayaran:</strong> CationGate secara spesifik memfasilitasi pencatatan dan verifikasi <strong className="font-bold text-slate-950">biaya formulir / administrasi pendaftaran siswa baru</strong>, baik melalui transfer online (Virtual Account & QRIS) maupun pembayaran tunai langsung di sekolah.
          </p>
        </div>

      </div>
    </section>
  );
}
