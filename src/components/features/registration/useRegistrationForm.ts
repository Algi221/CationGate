"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { usePPDB } from "@/context/PPDBContext";
import {
  useRegistrationDraft,
  createInitialFormData,
} from "./hooks/useRegistrationDraft";
import { useRegistrationValidation } from "./hooks/useRegistrationValidation";
import { useRegistrationSubmit } from "./hooks/useRegistrationSubmit";
import { useRegistrationLiveConfig } from "./hooks/useRegistrationLiveConfig";
import { useRegistrationPaymentSync } from "./hooks/useRegistrationPaymentSync";

export { createInitialFormData };

export const useRegistrationForm = () => {
  const params = useParams();
  const ppdbContext = usePPDB();
  const {
    registerApplicant,
    fetchPublicApplicants,
    ppdbLogo,
    ppdbTitle,
    schoolStatus,
    isConfigLoaded,
  } = ppdbContext;

  const rawSlug =
    (params?.school_slug as string) ||
    (ppdbContext as unknown as { schoolSlug?: string })?.schoolSlug ||
    "";
  let resolvedSlug = rawSlug;
  if (!resolvedSlug && typeof window !== "undefined") {
    const host = window.location.host.split(":")[0].toLowerCase();
    if (host.endsWith(".cationgate.site")) {
      const sub = host.replace(".cationgate.site", "");
      if (!["www", "api", "admin", "app", "mail", "gatekeeper"].includes(sub))
        resolvedSlug = sub;
    } else if (host.endsWith(".localhost")) {
      const sub = host.replace(".localhost", "");
      if (!["www", "api", "admin", "app", "mail", "gatekeeper"].includes(sub))
        resolvedSlug = sub;
    }
  }
  const schoolSlug = resolvedSlug || "demo";

  const {
    formData,
    setFormData,
    wizardStep,
    setWizardStep,
    furthestStep,
    setFurthestStep,
  } = useRegistrationDraft();

  const [isSuccess, setIsSuccess] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedSuccess = localStorage.getItem("ppdb_registration_success");
      if (savedSuccess) {
        try {
          const parsed = JSON.parse(savedSuccess);
          if (parsed && parsed.success && parsed.nisn) return true;
        } catch (_e) {}
      }
    }
    return false;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submittedCandidate, setSubmittedCandidate] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const savedCheckout = localStorage.getItem("ppdb_active_checkout");
      if (savedCheckout) {
        try {
          const parsed = JSON.parse(savedCheckout);
          if (parsed && parsed.nisn) return parsed;
        } catch (_e) {}
      }
    }
    return null;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [successData, setSuccessData] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const savedSuccess = localStorage.getItem("ppdb_registration_success");
      if (savedSuccess) {
        try {
          const parsed = JSON.parse(savedSuccess);
          if (parsed && parsed.successData) return parsed.successData;
        } catch (_e) {}
      }
    }
    return null;
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("ppdb-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      );
    }
    return false;
  });

  const [showPaymentGate, setShowPaymentGate] = useState(false);

  // Sub-hook: Live Config
  const {
    kuotaData,
    isSubscriptionActive,
    portalStatus,
    fieldsConfig,
    formGuideline,
    schoolPeriod,
    regCost,
    waGroupUrl,
    waAdmin,
    bankConfigList,
    majors,
  } = useRegistrationLiveConfig({
    schoolSlug,
    setFormData,
  });

  // Sub-hook: Payment Sync & Public Invoice
  useRegistrationPaymentSync({
    schoolSlug,
    isSuccess,
    setIsSuccess,
    setSuccessData,
    submittedCandidate,
    formData,
    setFormData,
    fetchPublicApplicants,
  });

  // Sub-hook: Validation
  const {
    getFieldLabel,
    isFieldRequired,
    isFieldActive,
    getStepLabel,
    validateStep,
  } = useRegistrationValidation(fieldsConfig, formData);

  // Sub-hook: Submission
  const { isSubmitting, handleSubmitRegistration, handlePaymentSuccess } =
    useRegistrationSubmit({
      formData,
      fieldsConfig,
      schoolSlug,
      schoolPeriod,
      majors,
      registerApplicant,
      fetchPublicApplicants,
      setSubmittedCandidate,
      setShowPaymentGate,
      setIsSuccess,
      setSuccessData,
      submittedCandidate,
    });

  useEffect(() => {
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !isSuccess) {
      const dataToSave = { ...formData };
      localStorage.setItem(
        "ppdb_registration_form_data",
        JSON.stringify(dataToSave),
      );
    }
  }, [formData, isSuccess]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isSuccess) {
      localStorage.setItem(
        "ppdb_registration_wizard_step",
        wizardStep.toString(),
      );
    }
  }, [wizardStep, isSuccess]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "nisn") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "nik") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 16);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "kodePos") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 5);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "whatsapp" || name === "teleponOrtu") {
      let cleanValue = value.replace(/\D/g, "");
      if (cleanValue.startsWith("0")) {
        cleanValue = "+62" + cleanValue.slice(1);
      } else if (cleanValue.startsWith("62")) {
        cleanValue = "+" + cleanValue;
      } else if (cleanValue && !cleanValue.startsWith("+62")) {
        cleanValue = "+62" + cleanValue;
      }
      cleanValue = cleanValue.slice(0, 16);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (
      name === "tinggiBadan" ||
      name === "beratBadan" ||
      name === "jarakKm"
    ) {
      const cleanValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (
      name === "waktuJam" ||
      name === "waktuMenit" ||
      name === "jumlahSaudara"
    ) {
      const cleanValue = value.replace(/\D/g, "").slice(0, 2);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => {
      const current = prev.kebutuhanKhusus || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, kebutuhanKhusus: updated };
    });
  };

  const nextStep = async () => {
    const stepErrors = validateStep(wizardStep);
    if (stepErrors.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        html: `<div class="text-left font-medium text-xs text-slate-600 dark:text-slate-400">Mohon lengkapi data wajib berikut sebelum melanjutkan ke tahap berikutnya:</div>
               <ul class="text-left list-disc list-inside mt-2 text-xs font-bold text-red-500 space-y-1">
                 ${stepErrors.map((err) => `<li>${err}</li>`).join("")}
               </ul>`,
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "OKE, SAYA LENGKAPI",
        customClass: {
          popup:
            "rounded-4xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6",
          confirmButton:
            "rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider",
          title: "text-base font-black text-slate-800 dark:text-white uppercase",
        },
      });
      return;
    }

    if (wizardStep < 14) {
      setWizardStep((prev) => {
        const next = prev + 1;
        if (next > furthestStep) {
          setFurthestStep(next);
        }
        return next;
      });
    } else {
      await handleSubmitRegistration();
    }
  };

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= furthestStep) {
      setWizardStep(step);
    } else {
      Swal.fire({
        icon: "info",
        title: "Tahap Terkunci",
        text: 'Anda belum bisa langsung melompat ke tahap ini. Silakan isi data di form saat ini dan klik "Selanjutnya" untuk membuka tahap berikutnya.',
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "MENGERTI",
        customClass: {
          popup:
            "rounded-4xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6",
          confirmButton:
            "rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider",
          title: "text-base font-black text-slate-800 dark:text-white uppercase",
        },
      });
    }
  };

  const handleRegisterNew = async () => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda ingin mendaftarkan calon siswa baru lainnya?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      localStorage.removeItem("ppdb_registration_success");
      localStorage.removeItem("ppdb_registration_form_data");
      localStorage.removeItem("ppdb_registration_wizard_step");
      localStorage.removeItem("ppdb_active_checkout");
      setIsSuccess(false);
      setSuccessData(null);
      setSubmittedCandidate(null);
      setShowPaymentGate(false);
      setWizardStep(1);
      setFurthestStep(1);
      setFormData(createInitialFormData());
    }
  };

  return {
    schoolSlug,
    ppdbLogo,
    ppdbTitle,
    wizardStep,
    furthestStep,
    isSuccess,
    isSubmitting,
    kuotaData,
    portalStatus,
    fieldsConfig,
    formGuideline,
    formData,
    setFormData,
    submittedCandidate,
    successData,
    isDark,
    toggleDark,
    schoolPeriod,
    regCost,
    waGroupUrl,
    waAdmin,
    bankConfigList,
    showPaymentGate,
    setShowPaymentGate,
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
    handleRegisterNew,
    schoolStatus,
    isSubscriptionActive,
    isConfigLoaded,
  };
};
