"use client";

import React, { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { useSchoolVerificationState } from "@/components/features/school-verification/hooks/useSchoolVerificationState";
import { VerificationProgressBar } from "@/components/features/school-verification/components/VerificationProgressBar";
import { Step1Legalitas } from "@/components/features/school-verification/components/Step1Legalitas";
import { Step2Kontak } from "@/components/features/school-verification/components/Step2Kontak";
import { Step3UploadSK } from "@/components/features/school-verification/components/Step3UploadSK";
import { Step4StatusView } from "@/components/features/school-verification/components/Step4StatusView";

function SchoolVerificationContent() {
  const {
    schoolSlug,
    schoolStatus,
    currentStep,
    loading,
    formData,
    setFormData,
    handleNext,
    handlePrev,
    handleFileUpload,
    handleSubmit
  } = useSchoolVerificationState();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            Verifikasi Identitas & Legalitas Sekolah
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Lengkapi berkas SK Izin Operasional dan legalitas lembaga untuk membuka kunci integrasi gateway pembayaran dan fitur kustomisasi branding sekolah.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <VerificationProgressBar currentStep={currentStep} />

      {/* Form Card Container */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {currentStep === 1 && (
          <Step1Legalitas
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2Kontak
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}

        {currentStep === 3 && (
          <Step3UploadSK
            formData={formData}
            loading={loading}
            handleFileUpload={handleFileUpload}
            handleSubmit={handleSubmit}
            handlePrev={handlePrev}
          />
        )}

        {currentStep === 4 && (
          <Step4StatusView
            schoolStatus={schoolStatus}
            schoolSlug={schoolSlug}
            formData={formData}
            setCurrentStep={handlePrev}
          />
        )}
      </div>
    </div>
  );
}

export default function SchoolVerificationPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}
    >
      <SchoolVerificationContent />
    </Suspense>
  );
}
