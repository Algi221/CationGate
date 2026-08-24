"use client";

import React from "react";
import { motion } from "framer-motion";
import { KeyRound, CheckCircle2, Info, RotateCcw, Loader2, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/ui/otp-input";

interface Step2VerifyOtpProps {
  email: string;
  otp: string;
  setOtp: (val: string) => void;
  errorMsg: string;
  successMsg: string;
  loading: boolean;
  cooldown: number;
  onVerifyOTP: (e: React.FormEvent) => void;
  onResendOTP: () => void;
  onBackToEmail: () => void;
}

export const Step2VerifyOtp: React.FC<Step2VerifyOtpProps> = ({
  email,
  otp,
  setOtp,
  errorMsg,
  successMsg,
  loading,
  cooldown,
  onVerifyOTP,
  onResendOTP,
  onBackToEmail
}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-5">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 shadow-xs">
          <KeyRound className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950">
          Verifikasi Kode OTP
        </h1>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
          <span>Dikirim ke <strong className="text-slate-800">{email}</strong></span>
          <button
            type="button"
            onClick={onBackToEmail}
            className="text-amber-600 hover:underline font-bold cursor-pointer"
          >
            Ganti Email
          </button>
        </div>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <form onSubmit={onVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-slate-700">
              Masukkan 6 Digit Kode OTP
            </Label>
            <button
              type="button"
              onClick={onResendOTP}
              disabled={cooldown > 0 || loading}
              className="text-[11px] font-bold text-amber-600 hover:text-amber-700 disabled:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <RotateCcw size={12} />
              {cooldown > 0 ? `Kirim Ulang (${cooldown}s)` : "Kirim Ulang OTP"}
            </button>
          </div>

          <div className="flex justify-center py-2">
            <OtpInput
              length={6}
              mode="numeric"
              defaultValue={otp}
              onChange={(val) => {
                setOtp(val);
              }}
              status={errorMsg ? "error" : "idle"}
              errorMessage={errorMsg}
              autoFocus
            />
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full h-12 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-sm shadow-md shadow-[#FFC000]/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Memverifikasi Kode OTP...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Verifikasi Kode OTP</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onBackToEmail}
            className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
          >
            &larr; Kembali ke input email
          </button>
        </div>
      </form>
    </motion.div>
  );
};
