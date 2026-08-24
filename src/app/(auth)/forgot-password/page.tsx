"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForgotPassword } from "./hooks/useForgotPassword";
import { ForgotPasswordHeader } from "./components/ForgotPasswordHeader";
import { ForgotPasswordBanner } from "./components/ForgotPasswordBanner";
import { Step1RequestOtp } from "./components/Step1RequestOtp";
import { Step2VerifyOtp } from "./components/Step2VerifyOtp";
import { Step3ActionChoice } from "./components/Step3ActionChoice";
import { Step4ResetPassword } from "./components/Step4ResetPassword";
import { Step5Success } from "./components/Step5Success";

export default function ForgotPasswordPage() {
  const {
    step,
    setStep,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    cooldown,
    isMobile,
    sessionToken,
    adminUser,
    schoolSlug,
    handleSendOTP,
    handleResendOTP,
    handleVerifyOTP,
    handleResetPassword
  } = useForgotPassword();

  const svgPathMobile = "M 0 0 L 414 0 L 414 125 C 290 165, 150 155, 0 185 Z";
  const svgPathDesktop = "M 0 0 L 540 0 C 620 300, 460 500, 280 670 C 130 740, 0 670, 0 670 Z";
  const solidColor = "#FFC02D"; // Theme Brand Yellow

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-white text-slate-950 overflow-x-hidden relative flex flex-col justify-between p-4 sm:p-6 lg:p-10 pb-10 font-sans scheme-light">
      {/* BACKGROUND BUBBLE */}
      <div className="absolute top-0 left-0 w-full lg:w-[50vw] h-45 lg:h-[92vh] pointer-events-none z-0">
        <svg
          viewBox={isMobile ? "0 0 414 200" : "0 0 600 700"}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: isMobile ? svgPathMobile : svgPathDesktop, fill: solidColor }}
            animate={{ d: isMobile ? svgPathMobile : svgPathDesktop, fill: solidColor }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* HEADER / NAVBAR */}
      <ForgotPasswordHeader solidColor={solidColor} />

      {/* MAIN 50:50 GRID */}
      <div className="w-full max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto z-10 relative lg:pt-8">
        {/* LEFT COLUMN: BRANDING BANNER (DESKTOP ONLY) */}
        <ForgotPasswordBanner />

        {/* RIGHT COLUMN: MULTI-STEP FORM CARD */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <div className="w-full max-w-115 mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1RequestOtp
                  email={email}
                  setEmail={setEmail}
                  errorMsg={errorMsg}
                  loading={loading}
                  onSendOTP={handleSendOTP}
                />
              )}

              {step === 2 && (
                <Step2VerifyOtp
                  email={email}
                  otp={otp}
                  setOtp={setOtp}
                  errorMsg={errorMsg}
                  successMsg={successMsg}
                  loading={loading}
                  cooldown={cooldown}
                  onVerifyOTP={handleVerifyOTP}
                  onResendOTP={handleResendOTP}
                  onBackToEmail={() => {
                    setStep(1);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                />
              )}

              {step === 3 && (
                <Step3ActionChoice
                  email={email}
                  sessionToken={sessionToken}
                  adminUser={adminUser}
                  schoolSlug={schoolSlug}
                  onProceedToReset={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setStep(4);
                  }}
                />
              )}

              {step === 4 && (
                <Step4ResetPassword
                  email={email}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  errorMsg={errorMsg}
                  loading={loading}
                  onResetPassword={handleResetPassword}
                  onBackToChoices={() => {
                    setErrorMsg("");
                    setStep(3);
                  }}
                />
              )}

              {step === 5 && <Step5Success />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="w-full text-center text-xs text-slate-400 py-4 relative z-10">
        <p>&copy; {new Date().getFullYear()} CationGate. Hak Cipta Dilindungi.</p>
      </div>
    </main>
  );
}
