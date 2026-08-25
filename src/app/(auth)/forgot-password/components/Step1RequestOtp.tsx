"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Info, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Step1RequestOtpProps {
  email: string;
  setEmail: (val: string) => void;
  errorMsg: string;
  loading: boolean;
  onSendOTP: (e: React.FormEvent) => void;
}

export const Step1RequestOtp: React.FC<Step1RequestOtpProps> = ({
  email,
  setEmail,
  errorMsg,
  loading,
  onSendOTP
}) => {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-6">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <Mail className="w-5 h-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
          Lupa Kata Sandi
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Masukkan alamat email admin sekolah yang terdaftar di CationGate untuk menerima kode OTP.
        </p>
      </div>

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

      <form onSubmit={onSendOTP} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold text-slate-700">
            Alamat Email Resmi Sekolah
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sekolah.sch.id"
              className="h-11 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-sm shadow-md shadow-[#FFC000]/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Mengirim Kode OTP...</span>
              </>
            ) : (
              <>
                <span>Kirim Kode OTP</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-slate-500">
          <span>Ingat kata sandi Anda? </span>
          <Link
            href="/login"
            className="font-bold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      </form>
    </motion.div>
  );
};
