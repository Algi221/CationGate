import React from "react";
import { motion } from "framer-motion";

export const ForgotPasswordBanner: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:col-span-6 flex-col justify-between relative pl-8 lg:pl-16 pr-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] whitespace-pre-line drop-shadow-md">
          {"Pemulihan\nKata Sandi"}
        </h2>

        <p className="text-xs lg:text-sm text-white/90 mt-4 font-medium leading-relaxed max-w-md">
          Lupa kata sandi akun Admin Sekolah Anda? Ikuti panduan verifikasi OTP langkah demi langkah untuk memulihkan akses secara aman.
        </p>
      </motion.div>
    </div>
  );
};
