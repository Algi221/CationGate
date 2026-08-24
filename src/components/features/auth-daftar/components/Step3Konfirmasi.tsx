"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTPVerification } from "@/components/ui/otp-input";
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
          <Button
            type="button"
            variant="ghost"
            onClick={onPrevStep}
            disabled={loading}
            className="h-10 sm:h-11 px-4 text-xs font-bold text-slate-500 cursor-pointer"
          >
            Ubah Data
          </Button>
          <Button
            type="button"
            onClick={onSendOtp}
            disabled={loading}
            className="h-10 sm:h-11 rounded-xl bg-[#EAB844] px-6 text-xs font-bold text-white shadow-none hover:bg-[#d9a92f] cursor-pointer"
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
              >
                <span className="text-lg">×</span>
              </button>
              <div className="rounded-2xl bg-white shadow-2xl p-2 relative z-10001">
                <OTPVerification
                  email={formData.email}
                  length={6}
                  onVerify={async (code) => {
                    const isValid = await onVerifyOtp(code);
                    if (isValid) {
                      setTimeout(() => {
                        onSubmit();
                      }, 1200);
                    }
                    return isValid;
                  }}
                  onResend={onResendOtp}
                  className="mx-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
