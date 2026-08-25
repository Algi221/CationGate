"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const Step5Success: React.FC = () => {
  const router = useRouter();

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4 space-y-4"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Kata Sandi Berhasil Diperbarui!
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Kata sandi akun Admin Sekolah Anda telah berhasil diubah. Silakan masuk kembali menggunakan kata sandi baru Anda.
        </p>
      </div>

      <div className="pt-3">
        <button
          onClick={() => router.push("/login")}
          className="w-full h-12 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-black text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
        >
          <span>Masuk ke Dashboard</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </motion.div>
  );
};
