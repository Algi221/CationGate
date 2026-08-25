"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Calendar, 
  User, 
  ExternalLink,
  ZoomIn,
  Clock,
  Banknote
} from "lucide-react";
import { Applicant } from "../types";

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Applicant | null;
  onConfirmLunas: (applicantId: number) => Promise<void>;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  applicant,
  onConfirmLunas,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !applicant) return null;

  const isCashTU = 
    applicant.metode_pembayaran === "Bayar Tunai di TU (Cash)" ||
    applicant.metode_pembayaran === "Tunai di TU" ||
    applicant.metode_pembayaran === "tu";

  const isLunas = applicant.status_pembayaran === "LUNAS" || applicant.status_pembayaran === "PAID" || applicant.status === "Approved";
  const receiptUrl = applicant.bukti_bayar;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirmLunas(applicant.id);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isCashTU 
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                  : "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
              }`}>
                {isCashTU ? <Banknote size={20} /> : <CreditCard size={20} />}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-white tracking-tight">
                  {isCashTU ? "Validasi Pembayaran Tunai di TU" : "Bukti Transfer Rekening Bank"}
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  No. Reg: {applicant.registration_no || `#${applicant.id}`} · {applicant.nama}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Student Info Card */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={11} /> Calon Siswa
                </span>
                <p className="font-extrabold text-slate-800 dark:text-white">{applicant.nama}</p>
                <p className="text-[11px] text-slate-500 font-mono">NISN: {applicant.nisn}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 size={11} /> Jurusan Pilihan
                </span>
                <p className="font-extrabold text-blue-600 dark:text-blue-400">{applicant.jurusan_1 || applicant.jurusan1 || "-"}</p>
                <p className="text-[11px] text-slate-500">{applicant.gelombang || "Gelombang 1"}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={11} /> Metode Bayar
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                  isCashTU 
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                }`}>
                  {isCashTU ? "Bayar Tunai di Sekolah" : "Transfer Rekening Bank"}
                </span>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={11} /> Status Bayar
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                  isLunas
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                }`}>
                  {isLunas ? "✓ LUNAS / TERVERIFIKASI" : "BELUM LUNAS"}
                </span>
              </div>
            </div>

            {/* Transfer Receipt Image Preview */}
            {!isCashTU && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Foto Struk Bukti Transfer:
                  </label>
                  {receiptUrl && (
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Buka Asli <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {receiptUrl ? (
                  <div 
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="relative w-full h-64 bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer group"
                  >
                    <Image
                      src={receiptUrl}
                      alt="Bukti Transfer"
                      fill
                      className={`object-contain transition-transform duration-300 ${isZoomed ? "scale-125" : "group-hover:scale-105"}`}
                    />
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <ZoomIn size={12} />
                      <span>{isZoomed ? "Klik Kecilkan" : "Klik Perbesar"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full py-12 px-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-xs font-bold text-slate-400">
                      Pendaftar belum mengunggah foto struk transfer.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cash TU Instructions */}
            {isCashTU && (
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2">
                <p className="text-xs font-extrabold text-amber-800 dark:text-amber-300">
                  ℹ️ Prosedur Loket Kasir Tata Usaha (TU):
                </p>
                <p className="text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed font-medium">
                  Pastikan calon siswa/wali telah menyerahkan uang tunai biaya pendaftaran formulir di loket TU sekolah. Setelah uang diterima, klik tombol konfirmasi di bawah untuk memvalidasi pembayaran secara resmi.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>

            {!isLunas && (
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>{isProcessing ? "Menyimpan..." : "✓ Terima & Konfirmasi Lunas"}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
