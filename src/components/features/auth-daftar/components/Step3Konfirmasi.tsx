"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaaSFormData } from "../types";

interface Step3KonfirmasiProps {
  formData: SaaSFormData;
  loading: boolean;
  onPrevStep: () => void;
  onSendOtp: () => void;
}

export const Step3Konfirmasi: React.FC<Step3KonfirmasiProps> = ({
  formData,
  loading,
  onPrevStep,
  onSendOtp,
}) => {
  return (
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
            <span className="font-bold text-[#EAB844]">{formData.slug}</span>.cationgate.site
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
  );
};
