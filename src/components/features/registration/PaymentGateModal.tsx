"use client";

import React, { useState } from "react";
import { User, Check, CreditCard, School, Clock, CheckCircle2, Upload, AlertCircle, Copy, X, FileText, ArrowRight, Building } from "lucide-react";
import Swal from "sweetalert2";
import { uploadFileDirect } from "@/utils/storage";
import { sanitizeUrl, getMajorDetails } from "./types";
import { usePPDB } from "@/context/PPDBContext";

interface PaymentGateModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submittedCandidate: any;
  bankConfigList: Array<{ bankName: string; accountNumber: string; accountHolder: string }>;
  regCost: number;
  schoolSlug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPaymentSuccess: (data: any) => void;
}

export const PaymentGateModal: React.FC<PaymentGateModalProps> = ({
  submittedCandidate,
  bankConfigList,
  regCost,
  schoolSlug,
  onPaymentSuccess
}) => {
  const { addToast } = usePPDB();
  const [activePaymentMethod, setActivePaymentMethod] = useState<"transfer" | "tu">("transfer");
  const [manualReceiptBase64, setManualReceiptBase64] = useState("");
  const [manualReceiptName, setManualReceiptName] = useState("");
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (typeof addToast === "function") {
      addToast("Nomor Rekening Disalin", "Nomor rekening berhasil disalin ke clipboard.", "success");
    }
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Ukuran File Terlalu Besar',
        text: "Ukuran bukti pembayaran maksimal adalah 3MB!",
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
          confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
          title: 'text-base font-extrabold text-slate-800 dark:text-white'
        }
      });
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      Swal.fire({
        icon: 'warning',
        title: 'Format File Tidak Sesuai',
        text: "Format file harus JPG, PNG, atau PDF!",
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
          confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
          title: 'text-base font-extrabold text-slate-800 dark:text-white'
        }
      });
      return;
    }

    setManualReceiptName(file.name);
    Swal.fire({
      title: 'Mengunggah Bukti Bayar...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    uploadFileDirect(file, `receipt_${submittedCandidate?.nisn}`)
      .then((publicUrl) => {
        setManualReceiptBase64(publicUrl);
        Swal.close();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire('Gagal', 'Gagal mengunggah bukti bayar.', 'error');
      });
  };

  const handleConfirmOption = async (metode: string, receiptBase64: string = "") => {
    setIsSubmittingReceipt(true);
    try {
      const BACKEND_URL = typeof window !== 'undefined' ? `/api` : "/api";
      const res = await fetch(`${BACKEND_URL}/payment/confirm-payment-option`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nisn: submittedCandidate?.nisn,
          bukti_bayar: receiptBase64 || null,
          metode_pembayaran: metode,
          school_slug: schoolSlug || 'smk'
        })
      });
      const data = await res.json();
      if (data.success) {
        onPaymentSuccess(data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Konfirmasi Gagal',
          text: "Gagal mengonfirmasi pembayaran: " + data.message,
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-800 dark:text-white'
          }
        });
      }
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: err instanceof Error ? err.message : String(err),
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
          confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
          title: 'text-base font-extrabold text-slate-800 dark:text-white'
        }
      });
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  const majorInfo = getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-10">
      {/* Background Glowing Blobs */}
      <div className="bg-glow-container">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2rem] p-5 md:p-6 lg:p-8 max-w-4xl w-full relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Grid Layout: Left Side (Billing Summary), Right Side (Payment Options) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Side: Summary Panel (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-background/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden">
            <div className="space-y-4">
              {/* Profil Calon Siswa */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-primary dark:bg-blue-500 rounded-full flex items-center justify-center text-white mb-2 shadow-md ring-2 ring-primary/10">
                  <User className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-tight">{submittedCandidate?.nama}</h4>
                <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-400 mt-1">NISN: {submittedCandidate?.nisn}</p>
              </div>

              {/* Stepper Vertikal */}
              <div className="space-y-3 py-2">
                {/* Langkah 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center border border-emerald-200 dark:border-emerald-900 shadow-sm shrink-0">
                    <Check size={14} className="stroke-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Informasi Siswa</span>
                </div>

                {/* Langkah 2 */}
                <div className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-2xl bg-primary/5 dark:bg-blue-950/45 border border-blue-100/50 dark:border-blue-900/40">
                  <div className="w-8 h-8 rounded-xl bg-primary dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                    <CreditCard size={14} />
                  </div>
                  <span className="text-xs font-black text-primary dark:text-sky-400">Metode Pembayaran</span>
                </div>

                {activePaymentMethod === "tu" ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <School size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-400">Datang ke Sekolah</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <Clock size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-400">Menunggu Verifikasi</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-400">Selesai</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                        manualReceiptBase64 
                          ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 text-emerald-500"
                          : "bg-background dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400"
                      }`}>
                        {manualReceiptBase64 ? <Check size={14} className="stroke-3" /> : <Upload size={14} />}
                      </div>
                      <span className={`text-xs font-bold ${
                        manualReceiptBase64 
                          ? "text-emerald-500 dark:text-emerald-400" 
                          : "text-slate-400 dark:text-slate-400"
                      }`}>
                        Upload Bukti
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <Clock size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-400">Selesai</span>
                    </div>
                  </>
                )}
              </div>

              {/* Box Info Pendaftaran */}
              <div className="mt-4 p-4 rounded-2xl bg-primary/5/50 dark:bg-blue-950/20 border border-blue-100/35 dark:border-blue-900/30">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-sky-400 block mb-3">
                  Info Pendaftaran
                </span>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${majorInfo.bg}`}>
                    {majorInfo.logoPath ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={majorInfo.logoPath} 
                        alt={majorInfo.logoText} 
                        className="w-7 h-7 object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      majorInfo.icon
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Jurusan</p>
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Pembayaran Card */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Biaya Pendaftaran</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-primary dark:text-sky-400">
                  Rp {regCost.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                  Tunggal
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Options Panel (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Header Title */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">Pilih Cara Pembayaran</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-bold">
                  Selesaikan biaya pendaftaran untuk mengunci status calon siswa Anda.
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className="flex flex-col sm:flex-row gap-1.5 bg-background dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActivePaymentMethod("transfer")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activePaymentMethod === "transfer"
                      ? "bg-white dark:bg-[#0f172a] text-blue-650 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-slate-800"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <CreditCard size={14} />
                  <span>Transfer Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaymentMethod("tu")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activePaymentMethod === "tu"
                      ? "bg-white dark:bg-[#0f172a] text-blue-650 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-slate-800"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Building size={14} />
                  <span>Bayar di TU (Offline)</span>
                </button>
              </div>

              {activePaymentMethod === "transfer" ? (
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
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div className="text-[11px] font-bold leading-normal">
                      <p className="font-black uppercase tracking-wider mb-0.5">PENTING: Batas Waktu Pembayaran 24 Jam!</p>
                      Harap lakukan transfer dan unggah bukti pembayaran dalam waktu 24 jam. Jika melewati batas waktu tersebut, pendaftaran Anda akan otomatis dinyatakan <span className="text-red-500 font-extrabold">Gugur</span> oleh sistem.
                    </div>
                  </div>

                  {/* Premium Bank Cards List */}
                  <div className="flex flex-wrap gap-4 w-full">
                    {bankConfigList.map((bank, index) => (
                      <div 
                        key={index} 
                        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-800 to-blue-950 p-4 text-white shadow-md border border-white/10 w-full max-w-xs transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="absolute right-[-10%] top-[-20%] w-32 h-32 rounded-full bg-linear-to-tr from-sky-400/20 to-blue-400/10 blur-2xl pointer-events-none"></div>

                        {/* Header Kartu */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-sky-300">Pilihan #{index + 1}</span>
                            <h4 className="text-sm font-black tracking-wider uppercase text-slate-100">{bank.bankName || "BANK TRANSFER"}</h4>
                          </div>
                        </div>

                        {/* Nomor Rekening */}
                        <div className="space-y-1 mb-4">
                          <span className="text-[7px] font-black uppercase tracking-widest text-blue-200/70">Nomor Rekening</span>
                          <div className="flex items-center justify-between gap-2 bg-white/10 border border-white/10 rounded-full py-1.5 pl-3 pr-1.5 backdrop-blur-sm">
                            <span className="font-mono text-xs font-black tracking-wider text-slate-100 select-all">
                              {bank.accountNumber || "157-00-0174092-2"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(bank.accountNumber || "157-00-0174092-2")}
                              className="p-1.5 bg-white/10 border border-white/15 text-slate-300 hover:text-white rounded-full transition duration-150 active:scale-95 cursor-pointer"
                              title="Salin Nomor Rekening"
                            >
                              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>

                        {/* Footer Kartu */}
                        <div className="flex justify-between items-end">
                          <div className="space-y-0.5">
                            <span className="text-[7px] font-black uppercase tracking-widest text-blue-200/70">Atas Nama (A.N.)</span>
                            <p className="text-[9px] font-extrabold tracking-wide uppercase text-slate-100">
                              {bank.accountHolder || "YAYASAN TARUNA BHAKTI"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                          onChange={handleReceiptFileChange}
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
                            {manualReceiptBase64.startsWith("data:application/pdf") || manualReceiptBase64.toLowerCase().endsWith(".pdf") ? (
                              <FileText size={32} className="text-red-500" />
                            ) : (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={manualReceiptBase64 || undefined} alt="Preview Bukti Bayar" className="w-full h-full object-cover" />
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
                          onClick={() => {
                            setManualReceiptBase64("");
                            setManualReceiptName("");
                          }}
                          className="px-4 py-2.5 bg-red-50 hover:bg-red-105 dark:bg-red-950/40 dark:hover:bg-red-900/30 border border-red-100/60 dark:border-red-900/35 text-red-655 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 w-full md:w-auto justify-center cursor-pointer"
                        >
                          <X size={12} />
                          Hapus File
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleConfirmOption("Transfer Manual", manualReceiptBase64)}
                    disabled={!manualReceiptBase64 || isSubmittingReceipt}
                    className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4 cursor-pointer"
                  >
                    {isSubmittingReceipt ? "Mengirim Bukti..." : "Kirim Bukti Pembayaran"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                      Langkah Pembayaran Langsung ke TU Sekolah
                    </h4>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                      Silakan datang langsung ke loket Tata Usaha (TU) SMK Taruna Bhakti untuk melakukan pembayaran biaya pendaftaran formulir secara tunai.
                    </p>
                  </div>

                  <div className="bg-primary/5/60 dark:bg-blue-950/15 border border-blue-200/55 dark:border-blue-900/40 rounded-2xl p-5 text-left space-y-3 shadow-sm">
                    <div className="font-black text-xs uppercase tracking-wider text-blue-800 dark:text-sky-400 flex items-center gap-1.5 border-b border-blue-200/50 dark:border-blue-900/20 pb-2">
                      <FileText size={14} className="shrink-0" />
                      PENTING: BAWA BERKAS PERSYARATAN DI BAWAH INI!
                    </div>
                    <p className="text-[11px] text-slate-605 dark:text-slate-400 leading-relaxed font-bold">
                      Calon siswa diimbau untuk langsung membawa surat-surat/dokumen berikut saat melakukan pembayaran di sekolah guna mempercepat verifikasi fisik berkas:
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
                    onClick={() => handleConfirmOption("Bayar di Sekolah", "")}
                    disabled={isSubmittingReceipt}
                    className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4 cursor-pointer"
                  >
                    {isSubmittingReceipt ? "Memproses..." : "Konfirmasi Pembayaran di TU & Daftar"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
