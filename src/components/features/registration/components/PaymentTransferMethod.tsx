"use client";

import React from "react";
import { AlertCircle, Building, Check, Copy, Upload, FileText, X, ArrowRight } from "lucide-react";

interface BankItem {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

interface PaymentTransferMethodProps {
  bankConfigList: BankItem[];
  copiedIdx: number | null;
  onCopy: (text: string, idx: number) => void;
  manualReceiptBase64: string;
  manualReceiptName: string;
  isSubmittingReceipt: boolean;
  onReceiptFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearReceipt: () => void;
  onConfirm: () => void;
}

export function PaymentTransferMethod({
  bankConfigList,
  copiedIdx,
  onCopy,
  manualReceiptBase64,
  manualReceiptName,
  isSubmittingReceipt,
  onReceiptFileChange,
  onClearReceipt,
  onConfirm,
}: PaymentTransferMethodProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
          Langkah Pembayaran Transfer Bank
        </h4>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
          Silakan lakukan transfer ke rekening resmi sekolah berikut sebesar biaya pendaftaran, kemudian unggah foto/file bukti transfer Anda.
        </p>
      </div>

      {/* Warning Limit Pembayaran 24 Jam */}
      <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/40 rounded-2xl p-4.5 flex items-start gap-3 text-amber-800 dark:text-amber-300">
        <AlertCircle
          size={18}
          className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400"
        />
        <div className="text-[11px] font-bold leading-normal">
          <p className="font-black uppercase tracking-wider mb-0.5">
            PENTING: Batas Waktu Pembayaran 24 Jam!
          </p>
          Harap lakukan transfer dan unggah bukti pembayaran dalam waktu 24 jam.
          Jika melewati batas waktu tersebut, pendaftaran Anda akan otomatis
          dinyatakan <span className="text-red-500 font-extrabold">Gugur</span>{" "}
          oleh sistem.
        </div>
      </div>

      {/* Compact & Elegant Bank Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {bankConfigList.map((bank, index) => {
          const isCopied = copiedIdx === index;
          const accountNo = bank.accountNumber || "157-00-0174092-2";
          const bankName = bank.bankName || "BANK TRANSFER";
          const accountHolder =
            bank.accountHolder || "YAYASAN TARUNA BHAKTI";

          return (
            <div
              key={index}
              className="relative rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs"
            >
              {/* Header Bank & Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Building size={14} />
                  </div>
                  <h4 className="text-xs font-black tracking-tight text-slate-800 dark:text-white uppercase truncate">
                    {bankName}
                  </h4>
                </div>
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-2 py-0.5 rounded-full shrink-0">
                  Pilihan #{index + 1}
                </span>
              </div>

              {/* No. Rekening & Copy Button */}
              <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-2xs">
                <div className="min-w-0">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                    No. Rekening
                  </span>
                  <span className="font-mono text-xs font-black tracking-wide text-slate-900 dark:text-slate-100 select-all block truncate">
                    {accountNo}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(accountNo, index)}
                  className={`p-1.5 rounded-lg border transition-all duration-150 active:scale-90 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isCopied
                      ? "bg-emerald-500 text-white border-emerald-600"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-300 hover:text-blue-600 border-slate-200 dark:border-slate-700"
                  }`}
                  title="Salin Nomor Rekening"
                >
                  {isCopied ? (
                    <Check size={12} className="text-white" />
                  ) : (
                    <Copy size={12} />
                  )}
                  <span className="text-[10px] font-bold hidden xs:inline">
                    {isCopied ? "Tersalin" : "Salin"}
                  </span>
                </button>
              </div>

              {/* Atas Nama */}
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                <span>Atas Nama (A.N.): </span>
                <strong className="font-bold text-slate-700 dark:text-slate-200 uppercase">
                  {accountHolder}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Receipt Section */}
      <div className="space-y-3">
        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">
          Unggah Bukti Transfer Pembayaran
        </label>

        {!manualReceiptBase64 ? (
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary rounded-2xl py-6 px-4 text-center transition bg-background/20 dark:bg-slate-950/5 relative group cursor-pointer">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={onReceiptFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center gap-2 pointer-events-none transition-transform duration-200 group-hover:scale-102">
              <div className="w-12 h-12 rounded-full bg-blue-55 dark:bg-slate-800/80 flex items-center justify-center text-blue-505 border border-blue-100 dark:border-slate-700/50 mb-1">
                <Upload size={22} className="animate-pulse" />
              </div>
              <p className="text-xs md:text-sm font-black text-slate-755 dark:text-slate-200">
                Pilih atau seret file bukti transfer
              </p>
              <p className="text-[10px] text-slate-400 font-bold">
                JPG, JPEG, PNG, atau PDF (Maksimal 3MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-background/80 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-205 dark:border-slate-805 flex items-center justify-center text-blue-550 shrink-0 shadow-sm overflow-hidden relative">
                {manualReceiptBase64.startsWith("data:application/pdf") ||
                manualReceiptName.toLowerCase().endsWith(".pdf") ? (
                  <FileText size={32} className="text-red-500" />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={manualReceiptBase64 || undefined}
                    alt="Preview Bukti Bayar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="space-y-0.5 overflow-hidden w-full md:w-auto">
                <p className="text-xs font-black text-slate-750 dark:text-slate-200 truncate max-w-50 md:max-w-75">
                  {manualReceiptName}
                </p>
                <span className="text-[9px] font-black uppercase text-emerald-505 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/35 px-2 py-0.5 rounded-full inline-block">
                  File Siap Diunggah
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClearReceipt}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-105 dark:bg-red-950/40 dark:hover:bg-red-900/30 border border-red-100/60 dark:border-red-900/35 text-red-655 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 w-full md:w-auto justify-center cursor-pointer"
            >
              <X size={12} />
              Hapus File
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        disabled={!manualReceiptBase64 || isSubmittingReceipt}
        className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4 cursor-pointer"
      >
        {isSubmittingReceipt
          ? "Mengirim Bukti..."
          : "Kirim Bukti Pembayaran"}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
