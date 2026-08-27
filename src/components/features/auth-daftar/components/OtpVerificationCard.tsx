"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md text-left"
      >
        {/* Floating Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-11 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all cursor-pointer shadow-sm"
          title="Tutup & Kembali"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Card */}
        <div className="rounded-3xl bg-white shadow-2xl p-6 sm:p-8 border border-slate-200/80 text-center space-y-5">
          {/* Top Visual Badge */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Masukkan Kode Keamanan
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
              Kami telah mengirim kode 6-digit ke email <br />
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
    </div>
  );
};
