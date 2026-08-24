"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Home, Sun, Moon, Clock } from "lucide-react";
import { useRegistrationForm } from "@/components/features/registration/useRegistrationForm";
import { SuccessInvoiceView } from "@/components/features/registration/SuccessInvoiceView";
import { PaymentGateModal } from "@/components/features/registration/PaymentGateModal";
import { StepWizardNav } from "@/components/features/registration/StepWizardNav";
import { Step1DataPribadi } from "@/components/features/registration/steps/Step1DataPribadi";
import { Step2TempatTinggal } from "@/components/features/registration/steps/Step2TempatTinggal";
import { Step3Periodik } from "@/components/features/registration/steps/Step3Periodik";
import { Step4Kesehatan } from "@/components/features/registration/steps/Step4Kesehatan";
import { Step5Prestasi } from "@/components/features/registration/steps/Step5Prestasi";
import { Step6Beasiswa } from "@/components/features/registration/steps/Step6Beasiswa";
import { Step7Pendidikan } from "@/components/features/registration/steps/Step7Pendidikan";
import { Step8DataAyah } from "@/components/features/registration/steps/Step8DataAyah";
import { Step9DataIbu } from "@/components/features/registration/steps/Step9DataIbu";
import { Step10DataWali } from "@/components/features/registration/steps/Step10DataWali";
import { Step11KegemaranMinat } from "@/components/features/registration/steps/Step11KegemaranMinat";
import { Step12BudiPekerti } from "@/components/features/registration/steps/Step12BudiPekerti";
import { Step13ReviewData } from "@/components/features/registration/steps/Step13ReviewData";
import { Step14BerkasKonfirmasi } from "@/components/features/registration/steps/Step14BerkasKonfirmasi";

export default function DaftarPage() {
  const {
    schoolSlug,
    ppdbLogo,
    ppdbTitle,
    wizardStep,
    furthestStep,
    isSuccess,
    isSubmitting,
    kuotaData,
    portalStatus,
    formData,
    setFormData,
    submittedCandidate,
    successData,
    isDark,
    toggleDark,
    schoolPeriod,
    regCost,
    waGroupUrl,
    bankConfigList,
    showPaymentGate,
    majors,
    getFieldLabel,
    isFieldRequired,
    isFieldActive,
    getStepLabel,
    handleInputChange,
    handleCheckboxChange,
    nextStep,
    prevStep,
    goToStep,
    handlePaymentSuccess,
    handleRegisterNew
  } = useRegistrationForm();

  if (portalStatus === "closed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-slate-950 p-6 text-center">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-500 border border-red-100 dark:border-red-900/40 mx-auto">
            <Clock size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Pendaftaran Ditutup</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Mohon maaf, portal Penerimaan Peserta Didik Baru (PPDB) SMK Taruna Bhakti Depok saat ini sedang ditutup.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={`/${schoolSlug || ""}`}
              className="w-full inline-flex justify-center items-center gap-2 py-3.5 bg-primary hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all uppercase tracking-wider cursor-pointer"
            >
              <Home size={14} />
              <span>Kembali Ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    if (!successData) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-slate-950">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
            Memuat Invoice & Konfirmasi...
          </p>
        </div>
      );
    }

    return (
      <SuccessInvoiceView
        successData={successData}
        schoolPeriod={schoolPeriod}
        regCost={regCost}
        waGroupUrl={waGroupUrl}
        ppdbLogo={ppdbLogo}
        ppdbTitle={ppdbTitle}
        schoolSlug={schoolSlug}
        onRegisterNew={handleRegisterNew}
      />
    );
  }

  if (showPaymentGate) {
    return (
      <PaymentGateModal
        submittedCandidate={submittedCandidate}
        bankConfigList={bankConfigList}
        regCost={regCost}
        schoolSlug={schoolSlug}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center py-16 px-4 md:px-6 bg-background dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* Background Glowing Blobs */}
      <div className="bg-glow-container">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href={`/${schoolSlug || ""}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-background dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleDark}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-background dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all"
          title={isDark ? "Mode Terang" : "Mode Gelap"}
        >
          {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-750" />}
        </button>
      </div>

      <div className="mb-10 text-center mt-12 relative z-10 flex flex-col items-center">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/5 dark:bg-blue-950/60 border border-blue-100/50 dark:border-blue-900/50 text-primary dark:text-sky-400 text-xs font-bold shadow-sm shadow-blue-500/5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-sky-400 animate-pulse"></span>
          Tahap {wizardStep} dari 14
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-2 drop-shadow-sm">
          Formulir Pendaftaran PPDB
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-900/60 backdrop-blur-md inline-block px-4 py-1.5 rounded-full border border-white/60 dark:border-slate-800/60 shadow-sm mt-2">
          SMK Taruna Bhakti Tahun Ajaran 2026/2027
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f172a] backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-6 md:p-10 max-w-4xl w-full relative z-10">
        <StepWizardNav
          wizardStep={wizardStep}
          furthestStep={furthestStep}
          goToStep={goToStep}
          getStepLabel={getStepLabel}
        />

        {/* Dynamic Wizard Steps */}
        {wizardStep === 1 && (
          <Step1DataPribadi
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 2 && (
          <Step2TempatTinggal
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 3 && (
          <Step3Periodik
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 4 && (
          <Step4Kesehatan
            formData={formData}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 5 && (
          <Step5Prestasi
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 6 && (
          <Step6Beasiswa
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 7 && (
          <Step7Pendidikan
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
            majors={majors}
            kuotaData={kuotaData}
          />
        )}
        {wizardStep === 8 && (
          <Step8DataAyah
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 9 && (
          <Step9DataIbu
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 10 && (
          <Step10DataWali
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 11 && (
          <Step11KegemaranMinat
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 12 && (
          <Step12BudiPekerti
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldLabel={getFieldLabel}
            isFieldRequired={isFieldRequired}
            isFieldActive={isFieldActive}
          />
        )}
        {wizardStep === 13 && (
          <Step13ReviewData
            formData={formData}
            goToStep={goToStep}
          />
        )}
        {wizardStep === 14 && (
          <Step14BerkasKonfirmasi
            formData={formData}
            setFormData={setFormData}
          />
        )}

        <div className="mt-10 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-6">
          {wizardStep > 1 ? (
            <button className="btn-nav-link px-4 py-2 cursor-pointer" onClick={prevStep}>
              Kembali
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3 items-center">
            {(wizardStep === 5 || wizardStep === 6) && (
              <button className="btn-secondary cursor-pointer" onClick={nextStep}>
                Lewati
              </button>
            )}
            <button
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl px-7 py-3.5 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              onClick={nextStep}
              disabled={
                isSubmitting ||
                (wizardStep === 1 && (!formData.nama || !formData.nisn)) ||
                (wizardStep === 14 && !formData.deklarasi)
              }
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Mengirim...
                </span>
              ) : wizardStep === 14 ? (
                "Kirim Pendaftaran"
              ) : (
                "Selanjutnya"
              )}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
