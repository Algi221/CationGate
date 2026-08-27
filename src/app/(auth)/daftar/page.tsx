"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDaftarSaaSState } from "@/components/features/auth-daftar/hooks/useDaftarSaaSState";
import { EditorialLottiePanel } from "@/components/features/auth-daftar/components/EditorialLottiePanel";
import { Step1Instansi } from "@/components/features/auth-daftar/components/Step1Instansi";
import { Step2AkunAdmin } from "@/components/features/auth-daftar/components/Step2AkunAdmin";
import { Step3Konfirmasi } from "@/components/features/auth-daftar/components/Step3Konfirmasi";
import { safeRedirect } from "@/lib/sanitizeUrl";

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
    slugChecking,
    slugSuccessState,
    slugErrorState,
    setSlugErrorState,
    setSlugSuccessState,
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

  const handleGoToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cationgate_skip_splash", "true");
      const host = window.location.host.toLowerCase();
      const isLocalhost = host.includes("localhost");
      const port = window.location.port ? `:${window.location.port}` : "";
      const homeUrl = isLocalhost ? `http://localhost${port}/` : "https://cationgate.site/";
      safeRedirect(homeUrl, "/");
    }
  };

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-white text-slate-950 overflow-x-hidden relative flex flex-col justify-between p-4 sm:p-6 lg:p-8 pb-4 font-sans">
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "vj9p8w40b8");`
        }}
      />

      {/* BACKGROUND BUBBLE (FULL-BLEED 50% VIEWPORT ON DESKTOP DENGAN MORPHING ANIMASI 3 STEP) */}
      <div className="absolute top-0 left-0 w-full lg:w-[50vw] h-45 lg:h-[92vh] pointer-events-none z-0">
        <svg
          viewBox={isMobile ? "0 0 414 200" : "0 0 600 700"}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{
              d: isMobile
                ? "M 0 0 L 414 0 L 414 70 C 260 100, 120 90, 0 110 Z"
                : "M 0 0 L 420 0 C 480 220, 360 380, 200 520 C 90 600, 0 540, 0 540 Z",
              fill: currentVisual.solidColor,
              opacity: 0,
            }}
            animate={{
              d: isMobile ? currentVisual.svgPathMobile : currentVisual.svgPathDesktop,
              fill: currentVisual.solidColor,
              opacity: 1,
            }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>
      </div>

      {/* HEADER / NAVBAR */}
      <div className="relative lg:absolute top-2 lg:top-6 left-2 lg:left-8 right-2 lg:right-8 flex items-center justify-between z-20 mb-3 lg:mb-0">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            onClick={handleGoToHome}
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-white/80 transition-all group drop-shadow-sm cursor-pointer"
            title="Kembali ke Beranda CationGate"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Beranda</span>
          </Link>
        </div>

        {/* Center Brand Logo */}
        <Link 
          href="/"
          onClick={handleGoToHome}
          className="flex items-center gap-2 group lg:absolute lg:left-[45vw] lg:translate-x-[-55%] transition-transform hover:scale-102 cursor-pointer"
        >
          <Image
            src="/assets/logo_cationgate/CationGate_Logo.png"
            alt="CationGate Logo"
            width={28}
            height={28}
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain transition-transform group-hover:rotate-6 drop-shadow-sm"
          />
          <div className="text-xl sm:text-2xl font-black tracking-tight font-sans select-none flex items-center">
            <span className="text-slate-950">Cation</span>
            <span style={{ color: currentVisual.solidColor }} className="drop-shadow-none transition-colors duration-500">
              Gate
            </span>
          </div>
        </Link>

        {/* Right Action: Login Link (Style Matching SS 2) */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="hidden text-slate-500 font-medium sm:block">
            Sudah memiliki akun?
          </span>
          <Link
            href="/login"
            className="rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-1.5 font-bold text-slate-700 transition-all hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-sm active:scale-95 shadow-xs"
          >
            Masuk
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center my-auto z-10 relative pt-2 lg:pt-4">
        {/* LEFT COLUMN: EDITORIAL VISUAL / LOTTIE */}
        <EditorialLottiePanel
          currentVisual={currentVisual}
          isMobile={isMobile}
          animationsData={animationsData}
        />

        {/* RIGHT COLUMN: INTERACTIVE WIZARD FORM */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <div className="w-full max-w-115 mx-auto bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none">
            {/* Form Header */}
            <div className="mb-4 sm:mb-6 text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Mulai Digitalisasi Sekolah
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
                Daftarkan instansi kamu dan mulai kelola sistem PPDB dengan CationGate.
              </p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600 text-left"
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
                      slugChecking={slugChecking}
                      slugSuccessState={slugSuccessState}
                      slugErrorState={slugErrorState}
                      setSlugErrorState={setSlugErrorState}
                      setSlugSuccessState={setSlugSuccessState}
                      handleEmailCheck={handleEmailCheck}
                      setEmailErrorState={setEmailErrorState}
                      setEmailSuccessState={setEmailSuccessState}
                    />
                    <div className="mt-5 sm:mt-6 flex justify-end border-t border-slate-100 pt-4">
                      <Button
                        type="submit"
                        className="h-10 sm:h-11 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] px-6 text-xs font-bold text-slate-950 shadow-md shadow-[#FFC000]/20 cursor-pointer transition-all"
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setStep(1);
                        }}
                        disabled={loading}
                        className="h-10 sm:h-11 px-4 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer hover:bg-slate-100 rounded-xl transition-all inline-flex items-center justify-center"
                      >
                        Kembali
                      </button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-10 sm:h-11 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] px-6 text-xs font-bold text-slate-950 shadow-md shadow-[#FFC000]/20 cursor-pointer transition-all"
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
      <div className="hidden lg:flex justify-center z-20 relative pb-1 w-full max-w-7xl mx-auto">
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
      <div className="w-full text-center text-xs text-slate-400 py-1 relative z-10">
        <p>&copy; {new Date().getFullYear()} CationGate. Hak Cipta Dilindungi.</p>
      </div>
    </main>
  );
}