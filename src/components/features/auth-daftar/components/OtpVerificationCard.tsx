"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, X } from "lucide-react";
import { OtpInput, OtpStatus } from "@/components/ui/otp-input";
import { SaaSFormData } from "../types";

interface OtpVerificationCardProps {
  formData: SaaSFormData;
  onClose: () => void;
  onVerifyOtp: (code: string) => Promise<boolean>;
  onResendOtp: () => Promise<boolean>;
  onSubmit: () => void;
}

export const OtpVerificationCard: React.FC<OtpVerificationCardProps> = ({
  formData,
  onClose,
  onVerifyOtp,
  onResendOtp,
  onSubmit,
}) => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const sentTimeStr = sessionStorage.getItem("cationgate_otp_sent_time");
        if (sentTimeStr) {
          const sentTime = parseInt(sentTimeStr, 10);
          const elapsed = Math.floor((Date.now() - sentTime) / 1000);
          if (elapsed < 60) return 60 - elapsed;
        }
      } catch (_e) {}
    }
    return 60;
  });

  useEffect(() => {
    setCode("");
    setStatus("idle");
    setErrorMessage("");
    if (typeof window !== "undefined") {
      try {
        const sentTimeStr = sessionStorage.getItem("cationgate_otp_sent_time");
        if (sentTimeStr) {
          const sentTime = parseInt(sentTimeStr, 10);
          const elapsed = Math.floor((Date.now() - sentTime) / 1000);
          if (elapsed < 60) {
            setCooldown(60 - elapsed);
            return;
          }
        }
      } catch (_e) {}
    }
    setCooldown(60);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (otpCode: string) => {
    if (verifying || otpCode.length < 6) return;
    setVerifying(true);
    setErrorMessage("");

    try {
      const isValid = await onVerifyOtp(otpCode);
      if (isValid) {
        setStatus("success");
        setTimeout(() => {
          onSubmit();
        }, 1200);
      } else {
        setStatus("error");
        setErrorMessage("Kode OTP tidak valid atau telah kedaluwarsa.");
      }
    } catch (_e) {
      setStatus("error");
      setErrorMessage("Terjadi kesalahan saat memverifikasi kode OTP.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || verifying) return;
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("cationgate_otp_sent_time", String(Date.now()));
      } catch (_e) {}
    }
    setCooldown(60);
    setStatus("idle");
    setErrorMessage("");
    await onResendOtp();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto relative z-20 my-auto"
    >
      {/* Top Back/Close Action */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-100/80"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Data</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Tutup & Kembali"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Single Clean OTP Card */}
      <div className="rounded-3xl bg-white shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-200/80 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs flex items-center justify-center mx-auto p-2.5">
          <Image
            src="/assets/logo_cationgate/CationGate_Logo.png"
            alt="CationGate Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Verifikasi Email Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
            Masukkan 6 digit kode keamanan yang dikirim ke <br />
            <strong className="text-slate-900 font-bold">{formData.email}</strong>
          </p>
        </div>

        <div className="flex justify-center py-1">
          <OtpInput
            length={6}
            mode="numeric"
            defaultValue={code}
            onChange={(val) => {
              setCode(val);
              if (status === "error") setStatus("idle");
            }}
            onComplete={(val) => {
              handleVerify(val);
            }}
            status={status}
            errorMessage={errorMessage}
            successMessage="Kode OTP terverifikasi! Mengaktifkan portal..."
            autoFocus
          />
        </div>

        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <span>Tidak menerima kode?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || verifying}
              className="font-bold text-amber-600 hover:text-amber-700 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim Ulang OTP"}
            </button>
          </div>

          <button
            type="button"
            disabled={verifying || code.length < 6}
            onClick={() => handleVerify(code)}
            className="w-full h-11 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-xs shadow-md shadow-[#FFC000]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Verifikasi & Lanjutkan</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
