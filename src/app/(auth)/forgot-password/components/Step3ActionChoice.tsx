"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, KeyRound, ChevronRight, ArrowRight, Loader2 } from "lucide-react";

interface Step3ActionChoiceProps {
  email: string;
  sessionToken?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminUser?: any;
  schoolSlug?: string;
  onProceedToReset: () => void;
}

export const Step3ActionChoice: React.FC<Step3ActionChoiceProps> = ({
  email,
  sessionToken,
  adminUser,
  schoolSlug = "smktarunabhakti",
  onProceedToReset
}) => {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleSkipToDashboard = () => {
    setNavigating(true);

    // Save active session token and admin credentials to localStorage
    if (sessionToken) {
      localStorage.setItem("ppdb_admin_token", sessionToken);
    }
    if (adminUser) {
      localStorage.setItem("ppdb_admin_user", JSON.stringify(adminUser));
    }
    if (schoolSlug) {
      localStorage.setItem("ppdb_admin_slug", schoolSlug);
    }

    const targetSlug = schoolSlug || "smktarunabhakti";
    router.push(`/${targetSlug}/dashboard`);
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full mb-2">
          Verifikasi Identitas Sukses
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Kode OTP Berhasil Diverifikasi!
        </h2>
        <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
          Identitas akun <strong className="text-slate-800">{email}</strong> telah terbukti sah. Silakan pilih tindakan selanjutnya:
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {/* Opsi 1: Perbarui Kata Sandi */}
        <button
          type="button"
          onClick={onProceedToReset}
          disabled={navigating}
          className="w-full p-4 rounded-2xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-sm shadow-md shadow-[#FFC000]/20 flex items-center justify-between transition-all group cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-slate-950/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-950">Perbarui Kata Sandi</div>
              <div className="text-[11px] font-medium text-slate-800">Buat kata sandi baru untuk akun Anda</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Opsi 2: Lewati & Langsung Masuk ke Dashboard */}
        <button
          type="button"
          onClick={handleSkipToDashboard}
          disabled={navigating}
          className="w-full p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
        >
          {navigating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              <span>Membuka Dashboard...</span>
            </>
          ) : (
            <>
              <span>Lewati & Langsung Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
