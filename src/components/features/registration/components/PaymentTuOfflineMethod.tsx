"use client";

import React from "react";
import { FileText, ArrowRight } from "lucide-react";

interface PaymentTuOfflineMethodProps {
  isSubmittingReceipt: boolean;
  onConfirm: () => void;
}

export function PaymentTuOfflineMethod({
  isSubmittingReceipt,
  onConfirm,
}: PaymentTuOfflineMethodProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
          Langkah Pembayaran Langsung ke TU Sekolah
        </h4>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
          Silakan datang langsung ke loket Tata Usaha (TU) SMK Taruna Bhakti
          untuk melakukan pembayaran biaya pendaftaran formulir secara tunai.
        </p>
      </div>

      <div className="bg-primary/5/60 dark:bg-blue-950/15 border border-blue-200/55 dark:border-blue-900/40 rounded-2xl p-5 text-left space-y-3 shadow-sm">
        <div className="font-black text-xs uppercase tracking-wider text-blue-800 dark:text-sky-400 flex items-center gap-1.5 border-b border-blue-200/50 dark:border-blue-900/20 pb-2">
          <FileText size={14} className="shrink-0" />
          PENTING: BAWA BERKAS PERSYARATAN DI BAWAH INI!
        </div>
        <p className="text-[11px] text-slate-605 dark:text-slate-400 leading-relaxed font-bold">
          Calon siswa diimbau untuk langsung membawa surat-surat/dokumen
          berikut saat melakukan pembayaran di sekolah guna mempercepat
          verifikasi fisik berkas:
        </p>
        <ul className="text-[11px] text-slate-700 dark:text-slate-200 font-bold space-y-1.5 pl-4.5 list-disc leading-normal">
          <li>Fotokopi Kartu Keluarga (KK)</li>
          <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
          <li>Akta Kelahiran asli &amp; Fotokopi</li>
          <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
          <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
        </ul>
      </div>

      <button
        onClick={onConfirm}
        disabled={isSubmittingReceipt}
        className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4 cursor-pointer"
      >
        {isSubmittingReceipt
          ? "Memproses..."
          : "Konfirmasi Pembayaran di TU & Daftar"}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
