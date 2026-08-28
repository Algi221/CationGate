"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Home, Clock, Lock } from "lucide-react";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { useSchoolHref } from "@/hooks/useSchoolHref";
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
import { SchoolUnverifiedLandingView } from "@/components/features/school-landing/components/SchoolUnverifiedLandingView";

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
    schoolStatus,
    isSubscriptionActive,
    isConfigLoaded,
    formData,
    setFormData,
    submittedCandidate,
    successData,
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
  const { href } = useSchoolHref();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isSchoolVerified =
    schoolStatus === "FULL_VERIFIED" ||
    schoolStatus === "VERIFIED" ||
    schoolStatus === "verified" ||
    schoolSlug === "demo" ||
    schoolSlug === "smktarunabhakti" ||
    schoolSlug === "smktiglobal";

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/70 dark:bg-[#020617]">
        <div className="w-8 h-8 border-4 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isConfigLoaded && !isSchoolVerified) {
    return (
      <SchoolUnverifiedLandingView
        schoolSlug={schoolSlug}
        schoolDisplayName={ppdbTitle || schoolSlug.toUpperCase()}
        schoolStatus={schoolStatus}
      />
    );
  }

  if (isConfigLoaded && !isSubscriptionActive && !isSchoolVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/70 dark:bg-[#020617] p-4 sm:p-6 text-center transition-colors duration-300 relative overflow-hidden selection:bg-slate-900 selection:text-white">
        {/* Subtle geometric background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/70 dark:border-amber-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Layanan Belum Aktif</span>
          </div>

          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 mx-auto shadow-inner">
            <Lock size={28} strokeWidth={2.2} />
          </div>

          <div className="space-y-2.5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Layanan Belum Aktif
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Portal SPMB online <span className="font-bold text-slate-700 dark:text-slate-200">{ppdbTitle || schoolSlug.toUpperCase()}</span> saat ini belum dapat menerima pendaftaran calon peserta didik baru karena instansi sekolah belum mengaktifkan paket langganan resmi.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={href("/")}
              className="w-full inline-flex justify-center items-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-extrabold text-xs rounded-2xl shadow-md transition-all duration-150 uppercase tracking-wider cursor-pointer active:scale-[0.98]"
            >
              <Home size={15} />
              <span>Kembali Ke Beranda</span>
            </Link>
            <Link
              href={href("/dashboard/subscription")}
              className="w-full inline-flex justify-center items-center gap-2 py-3 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-2xl border border-slate-200/80 dark:border-slate-700 transition-all uppercase tracking-wider cursor-pointer"
            >
              <span>Aktivasi Langganan (Admin)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (portalStatus === "closed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/70 dark:bg-[#020617] p-4 sm:p-6 text-center transition-colors duration-300 relative overflow-hidden selection:bg-slate-900 selection:text-white">
        {/* Subtle geometric background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Pendaftaran Ditutup</span>
          </div>

          {/* Minimalist Clock Icon */}
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 mx-auto shadow-inner">
            <Clock size={28} strokeWidth={2.2} />
          </div>

          {/* Text Content */}
          <div className="space-y-2.5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Pendaftaran Ditutup
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Mohon maaf, portal Penerimaan Peserta Didik Baru (PPDB) <span className="font-bold text-slate-700 dark:text-slate-200">{ppdbTitle || schoolSlug.toUpperCase()}</span> saat ini sedang ditutup atau belum membuka gelombang pendaftaran publik resmi.
            </p>
          </div>

          {/* Black & White Primary Button */}
          <div className="pt-2 space-y-2.5">
            <Link
              href={href("/")}
              className="w-full inline-flex justify-center items-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-extrabold text-xs rounded-2xl shadow-md transition-all duration-150 uppercase tracking-wider cursor-pointer active:scale-[0.98]"
            >
              <Home size={15} />
              <span>Kembali Ke Beranda</span>
            </Link>

            <Link
              href={href("/forum")}
              className="w-full inline-flex justify-center items-center gap-1.5 py-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold text-xs transition-colors"
            >
              <span>Lihat Informasi &amp; Jadwal Gelombang →</span>
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
          href={href("/")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-background dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all group cursor-pointer"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <ToggleTheme
          animationType="circle-spread"
          duration={1000}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-background dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-700 cursor-pointer"
        />
      </div>

      <div className="mb-10 text-center mt-12 relative z-10 flex flex-col items-center">
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 text-xs font-black shadow-sm tracking-wide">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse"></span>
          Tahap {wizardStep} dari 14
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 drop-shadow-sm">
          Formulir Pendaftaran PPDB
        </h1>
        <p className="text-slate-600 dark:text-slate-300 font-bold text-xs md:text-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-md inline-block px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm mt-2">
          {ppdbTitle || schoolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Tahun Ajaran {schoolPeriod}
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
              className="bg-slate-900 hover:bg-black active:scale-95 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold rounded-2xl px-7 py-3.5 shadow-md shadow-slate-900/20 dark:shadow-none flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
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
