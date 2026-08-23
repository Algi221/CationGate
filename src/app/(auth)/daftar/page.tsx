"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDaftarSaaSState } from "@/components/features/auth-daftar/hooks/useDaftarSaaSState";
import { EditorialLottiePanel } from "@/components/features/auth-daftar/components/EditorialLottiePanel";
import { Step1Instansi } from "@/components/features/auth-daftar/components/Step1Instansi";
import { Step2AkunAdmin } from "@/components/features/auth-daftar/components/Step2AkunAdmin";
import { Step3Konfirmasi } from "@/components/features/auth-daftar/components/Step3Konfirmasi";

export default function DaftarSaaS() {
  const {
    formData,
    setFormData,
    step,
    setStep,
    maxReachedStep,
    loading,
    errorMsg,
    emailChecking,
    emailSuccessState,
    emailErrorState,
    showPassword,
    setShowPassword,
    animationsData,
    isMobile,
    currentVisual,
    handleEmailCheck,
    setEmailErrorState,
    setEmailSuccessState,
    handleSendOTP,
    handleVerifyOTPAsync,
    handleResendAsync,
    handleNext,
    handleSubmit
  } = useDaftarSaaSState();

  return (
    <main className="relative min-h-screen bg-[#FAFAFA] flex flex-col justify-between overflow-x-hidden font-sans">
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "vj9p8w40b8");`
        }}
      />

      {/* NAVBAR MINIMALIS */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-5 z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="CationGate Logo" width={32} height={32} className="h-8 w-auto" />
          <span className="text-base font-black tracking-tight text-slate-900">
            Cation<span className="text-[#FFC000]">Gate</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Sudah memiliki akun?</span>
          <Link
            href="/login"
            className="font-bold text-slate-900 hover:text-blue-600 transition underline underline-offset-4"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center px-4 sm:px-6 lg:px-8 py-4 z-10">
        {/* SISI KIRI: EDITORIAL LOTTIE PANEL */}
        <EditorialLottiePanel
          currentVisual={currentVisual}
          isMobile={isMobile}
          animationsData={animationsData}
        />

        {/* SISI KANAN: FORM INPUT */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <div className="w-full max-w-115 mx-auto bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none">
            <div className="mb-6 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Buat akun sekolah
              </h1>
              <p className="mt-1.5 text-xs text-slate-400">
                Daftarkan instansi kamu dan mulai kelola sistem PPDB dengan CationGate.
              </p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 text-left"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <form
              onSubmit={
                step === 3
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      handleNext();
                    }
              }
            >
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="space-y-4">
                    <Step1Instansi
                      formData={formData}
                      setFormData={setFormData}
                      emailChecking={emailChecking}
                      emailSuccessState={emailSuccessState}
                      emailErrorState={emailErrorState}
                      handleEmailCheck={handleEmailCheck}
                      setEmailErrorState={setEmailErrorState}
                      setEmailSuccessState={setEmailSuccessState}
                    />
                    <div className="mt-5 sm:mt-6 flex justify-end border-t border-slate-100 pt-4">
                      <Button
                        type="submit"
                        className="h-10 sm:h-11 rounded-xl bg-[#EAB844] px-6 text-xs font-bold text-white shadow-none hover:bg-[#d9a92f] cursor-pointer"
                      >
                        Lanjutkan <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-4">
                    <Step2AkunAdmin
                      formData={formData}
                      setFormData={setFormData}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                    <div className="mt-5 sm:mt-6 flex justify-between border-t border-slate-100 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(1)}
                        disabled={loading}
                        className="h-10 sm:h-11 px-4 text-xs font-bold text-slate-500 cursor-pointer"
                      >
                        Kembali
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-10 sm:h-11 rounded-xl bg-[#EAB844] px-6 text-xs font-bold text-white shadow-none hover:bg-[#d9a92f] cursor-pointer"
                      >
                        Lanjutkan <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3 & OTP */}
                {step >= 3 && (
                  <Step3Konfirmasi
                    formData={formData}
                    step={step}
                    loading={loading}
                    onPrevStep={() => setStep(2)}
                    onSendOtp={() => {
                      handleSendOTP();
                      setStep(4);
                    }}
                    onCloseOtp={() => setStep(3)}
                    onVerifyOtp={handleVerifyOTPAsync}
                    onResendOtp={handleResendAsync}
                    onSubmit={handleSubmit}
                  />
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>

      {/* STEP BAR DESKTOP (BOTTOM) */}
      <div className="hidden lg:flex justify-center z-20 relative pb-2 w-full max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#F1F3F6] p-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/80">
          {[1, 2, 3].map((s) => {
            const isActive = Math.min(step, 3) === s;
            const isAccessible = s <= maxReachedStep;

            return (
              <button
                key={s}
                type="button"
                disabled={!isAccessible}
                onClick={() => {
                  if (isAccessible) setStep(s);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#FFC000] text-slate-950 shadow-xs cursor-pointer"
                    : isAccessible
                    ? "text-slate-600 hover:text-slate-950 hover:bg-white/70 cursor-pointer"
                    : "text-slate-400 opacity-50 cursor-not-allowed"
                }`}
              >
                <span className={`font-black text-xs ${isActive ? "text-slate-950" : "text-slate-700"}`}>
                  0{s}
                </span>
                <span
                  className={`text-[12px] ${
                    isActive ? "font-bold text-slate-950" : "font-medium text-slate-600"
                  }`}
                >
                  {s === 1 ? "Instansi" : s === 2 ? "Admin" : "Konfirmasi"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="w-full text-center text-xs text-slate-400 py-3 relative z-10">
        <p>&copy; {new Date().getFullYear()} CationGate. Hak Cipta Dilindungi.</p>
      </div>
    </main>
  );
}