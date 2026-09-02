"use client";

import React, { useState } from "react";
import { CreditCard, Building } from "lucide-react";
import Swal from "sweetalert2";
import { uploadFileDirect } from "@/utils/storage";
import { usePPDB } from "@/context/PPDBContext";
import {
  PaymentSummarySidebar,
  PaymentTransferMethod,
  PaymentTuOfflineMethod,
} from "./components";

interface PaymentGateModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submittedCandidate: any;
  bankConfigList: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>;
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
  onPaymentSuccess,
}) => {
  const { addToast } = usePPDB();
  const [activePaymentMethod, setActivePaymentMethod] = useState<
    "transfer" | "tu"
  >("transfer");
  const [manualReceiptBase64, setManualReceiptBase64] = useState("");
  const [manualReceiptName, setManualReceiptName] = useState("");
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    if (typeof addToast === "function") {
      addToast(
        "Nomor Rekening Disalin",
        "Nomor rekening berhasil disalin ke clipboard.",
        "success",
      );
    }
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Ukuran File Terlalu Besar",
        text: "Ukuran bukti pembayaran maksimal adalah 3MB!",
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup:
            "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900",
          confirmButton:
            "rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider",
          title: "text-base font-extrabold text-slate-800 dark:text-white",
        },
      });
      return;
    }

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowed.includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "Format File Tidak Sesuai",
        text: "Format file harus JPG, PNG, atau PDF!",
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup:
            "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900",
          confirmButton:
            "rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider",
          title: "text-base font-extrabold text-slate-800 dark:text-white",
        },
      });
      return;
    }

    setManualReceiptName(file.name);
    Swal.fire({
      title: "Mengunggah Bukti Bayar...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    uploadFileDirect(file, `receipt_${submittedCandidate?.nisn}`)
      .then((publicUrl) => {
        setManualReceiptBase64(publicUrl);
        Swal.close();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Gagal", "Gagal mengunggah bukti bayar.", "error");
      });
  };

  const handleConfirmOption = async (
    metode: string,
    receiptBase64: string = "",
  ) => {
    setIsSubmittingReceipt(true);
    try {
      const BACKEND_URL = typeof window !== "undefined" ? `/api` : "/api";
      const res = await fetch(`${BACKEND_URL}/payment/confirm-payment-option`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nisn: submittedCandidate?.nisn,
          bukti_bayar: receiptBase64 || null,
          metode_pembayaran: metode,
          school_slug: schoolSlug || "smk",
        }),
      });
      const data = await res.json();
      if (data.success) {
        onPaymentSuccess(data.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Konfirmasi Gagal",
          text: "Gagal mengonfirmasi pembayaran: " + data.message,
          confirmButtonColor: "#3b82f6",
          customClass: {
            popup:
              "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900",
            confirmButton:
              "rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider",
            title: "text-base font-extrabold text-slate-800 dark:text-white",
          },
        });
      }
    } catch (err: unknown) {
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: err instanceof Error ? err.message : String(err),
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup:
            "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900",
          confirmButton:
            "rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider",
          title: "text-base font-extrabold text-slate-800 dark:text-white",
        },
      });
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-10">
      {/* Background Glowing Blobs */}
      <div className="bg-glow-container">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-4xl p-5 md:p-6 lg:p-8 max-w-4xl w-full relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Grid Layout: Left Side (Billing Summary), Right Side (Payment Options) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Side: Summary Panel (Col Span 4) */}
          <PaymentSummarySidebar
            submittedCandidate={submittedCandidate}
            activePaymentMethod={activePaymentMethod}
            manualReceiptBase64={manualReceiptBase64}
            regCost={regCost}
          />

          {/* Right Side: Options Panel (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Header Title */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">
                  Pilih Cara Pembayaran
                </h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-bold">
                  Selesaikan biaya pendaftaran untuk mengunci status calon siswa
                  Anda.
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
                <PaymentTransferMethod
                  bankConfigList={bankConfigList}
                  copiedIdx={copiedIdx}
                  onCopy={handleCopy}
                  manualReceiptBase64={manualReceiptBase64}
                  manualReceiptName={manualReceiptName}
                  isSubmittingReceipt={isSubmittingReceipt}
                  onReceiptFileChange={handleReceiptFileChange}
                  onClearReceipt={() => {
                    setManualReceiptBase64("");
                    setManualReceiptName("");
                  }}
                  onConfirm={() =>
                    handleConfirmOption("Transfer Manual", manualReceiptBase64)
                  }
                />
              ) : (
                <PaymentTuOfflineMethod
                  isSubmittingReceipt={isSubmittingReceipt}
                  onConfirm={() =>
                    handleConfirmOption("Bayar di Sekolah", "")
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
