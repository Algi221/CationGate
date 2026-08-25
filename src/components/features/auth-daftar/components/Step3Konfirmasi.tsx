"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput, OtpStatus } from "@/components/ui/otp-input";
import { SaaSFormData } from "../types";

interface Step3KonfirmasiProps {
  formData: SaaSFormData;
  step: number;
  loading: boolean;
  onPrevStep: () => void;
  onSendOtp: () => void;
  onCloseOtp: () => void;
  onVerifyOtp: (code: string) => Promise<boolean>;
  onResendOtp: () => Promise<boolean>;
  onSubmit: () => void;
}

export const Step3Konfirmasi: React.FC<Step3KonfirmasiProps> = ({
  formData,
  step,
  loading,
  onPrevStep,
  onSendOtp,
  onCloseOtp,
  onVerifyOtp,
  onResendOtp,
  onSubmit
}) => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (step === 4) {
      setCode("");
      setStatus("idle");
      setErrorMessage("");
      setCooldown(60);
    }
  }, [step]);

  useEffect(() => {
    if (step === 4 && cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, cooldown]);

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
    setCooldown(60);
    setStatus("idle");
    setErrorMessage("");
    await onResendOtp();
  };

  return (
    <>
      <motion.div
        key="step-3"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        className="text-left"
      >
        <div className="divide-y divide-slate-100 border-y border-slate-100 text-xs mb-4">
          <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
            <span className="font-bold text-slate-400">Instansi</span>
            <div>
              <p className="font-bold text-slate-900">{formData.school_name || "-"}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{formData.address || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
            <span className="font-bold text-slate-400">Subdomain</span>
            <p className="font-medium text-slate-700">
              cationgate.site/<span className="font-bold text-[#EAB844]">{formData.slug}</span>
            </p>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
            <span className="font-bold text-slate-400">Email</span>
            <p className="font-medium text-slate-700 break-all">{formData.email}</p>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
            <span className="font-bold text-slate-400">Admin</span>
            <p className="font-medium text-slate-700">{formData.admin_name}</p>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPrevStep();
            }}
            disabled={loading}
            className="h-10 sm:h-11 px-4 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer hover:bg-slate-100 rounded-xl transition-all inline-flex items-center justify-center"
          >
            Ubah Data
          </button>
          <Button
            type="button"
            onClick={onSendOtp}
            disabled={loading}
            className="h-10 sm:h-11 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] px-6 text-xs font-bold text-slate-950 shadow-md shadow-[#FFC000]/20 cursor-pointer transition-all"
          >
            Kirim Kode OTP <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>

      {/* OTP MODAL */}
      <AnimatePresence>
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md z-10000 text-left"
            >
              <button
                type="button"
                onClick={onCloseOtp}
                className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
                title="Tutup Modal"
              >
                <span className="text-lg font-bold">×</span>
              </button>

              <div className="rounded-3xl bg-white shadow-2xl p-6 sm:p-8 border border-slate-200/80 text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Verifikasi Email Sekolah
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
