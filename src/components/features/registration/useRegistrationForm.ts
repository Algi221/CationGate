"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { usePPDB } from "@/context/PPDBContext";
import { useRegistrationDraft, createInitialFormData } from "./hooks/useRegistrationDraft";
import { useRegistrationValidation } from "./hooks/useRegistrationValidation";
import { useRegistrationSubmit } from "./hooks/useRegistrationSubmit";

export { createInitialFormData };

export const useRegistrationForm = () => {
  const params = useParams();
  const ppdbContext = usePPDB();
  const { registerApplicant, checkPaymentStatus, fetchPublicApplicants, ppdbLogo, ppdbTitle, schoolStatus, isConfigLoaded } = ppdbContext;

  const rawSlug = (params?.school_slug as string) || (ppdbContext as unknown as { schoolSlug?: string })?.schoolSlug || "";
  let resolvedSlug = rawSlug;
  if (!resolvedSlug && typeof window !== "undefined") {
    const host = window.location.host.split(":")[0].toLowerCase();
    if (host.endsWith(".cationgate.site")) {
      const sub = host.replace(".cationgate.site", "");
      if (!["www", "api", "admin", "app", "mail", "gatekeeper"].includes(sub)) resolvedSlug = sub;
    } else if (host.endsWith(".localhost")) {
      const sub = host.replace(".localhost", "");
      if (!["www", "api", "admin", "app", "mail", "gatekeeper"].includes(sub)) resolvedSlug = sub;
    }
  }
  const schoolSlug = resolvedSlug || "demo";

  const { formData, setFormData, wizardStep, setWizardStep, furthestStep, setFurthestStep } =
    useRegistrationDraft();

  const [isSuccess, setIsSuccess] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedSuccess = localStorage.getItem("ppdb_registration_success");
      if (savedSuccess) {
        try {
          const parsed = JSON.parse(savedSuccess);
          if (parsed && parsed.success && parsed.nisn) return true;
        } catch (_e) {
          // ignore
        }
      }
    }
    return false;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [kuotaData, setKuotaData] = useState<any[] | null>(null);

  const [isSubscriptionActive, setIsSubscriptionActive] = useState<boolean>(() => {
    if (schoolSlug === "demo" || schoolSlug === "smktarunabhakti" || schoolSlug === "smktiglobal") return true;
    if (typeof window !== "undefined") {
      const savedSub = localStorage.getItem(`ppdb_school_subscription_${schoolSlug}`);
      if (savedSub && (savedSub.includes("PRO") || savedSub.includes("ACTIVE") || savedSub.includes("YEARLY"))) {
        return true;
      }
    }
    return true;
  });

  const [portalStatus, setPortalStatus] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem(`ppdb_portal_status_${schoolSlug}`) ||
        localStorage.getItem("ppdb_portal_status") ||
        "open"
      );
    }
    return "open";
  });

  const [fieldsConfig, setFieldsConfig] = useState<
    Record<string, { label: string; required: boolean; active: boolean }>
  >(() => {
    if (typeof window !== "undefined") {
      const savedFieldsConfig = localStorage.getItem("ppdb_fields_config");
      if (savedFieldsConfig) {
        try {
          const parsed = JSON.parse(savedFieldsConfig);
          if (parsed && typeof parsed === "object") return parsed;
        } catch (_e) {
          // ignore
        }
      }
    }
    return {};
  });

  const [formGuideline, setFormGuideline] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ppdb_form_guideline") || "";
    }
    return "";
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submittedCandidate, setSubmittedCandidate] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const savedCheckout = localStorage.getItem("ppdb_active_checkout");
      if (savedCheckout) {
        try {
          const parsed = JSON.parse(savedCheckout);
          if (parsed && parsed.nisn) return parsed;
        } catch (_e) {
          // ignore
        }
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
        } catch (_e) {
          // ignore
        }
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

  const [schoolPeriod, setSchoolPeriod] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ppdb_school_period") || "2026-2027";
    }
    return "2026-2027";
  });

  const [regCost, setRegCost] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_reg_cost");
      if (saved) {
        const parsed = parseInt(saved);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 250000;
  });

  const [waGroupUrl, setWaGroupUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("ppdb_wa_group_url") ||
        "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS"
      );
    }
    return "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS";
  });

  const [waAdmin, setWaAdmin] = useState("6281292244456");

  const [bankConfigList, setBankConfigList] = useState<
    Array<{ bankName: string; accountNumber: string; accountHolder: string }>
  >(() => {
    if (typeof window !== "undefined") {
      const savedBank = localStorage.getItem("ppdb_bank_config");
      if (savedBank) {
        try {
          const parsed = JSON.parse(savedBank);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === "object") return [parsed];
        } catch (_e) {
          // ignore
        }
      }
    }
    return [{ bankName: "Bank Mandiri", accountNumber: "157-00-0174092-2", accountHolder: "Yayasan Taruna Bhakti" }];
  });

  const [showPaymentGate, setShowPaymentGate] = useState(false);

  const [majors, setMajors] = useState<Array<{ code: string; title: string; logo?: string; color?: string }>>(() => {
    if (typeof window !== "undefined") {
      const savedMajors = localStorage.getItem(`ppdb_majors_config_${schoolSlug}`);
      if (savedMajors) {
        try {
          const parsed = JSON.parse(savedMajors);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_e) {
          // ignore
        }
      }
    }
    return [];
  });

  // SUB-HOOK VALIDATION
  const { getFieldLabel, isFieldRequired, isFieldActive, getStepLabel, validateStep } =
    useRegistrationValidation(fieldsConfig, formData);

  // SUB-HOOK SUBMISSION
  const { isSubmitting, handleSubmitRegistration, handlePaymentSuccess } = useRegistrationSubmit({
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
    submittedCandidate
  });

  useEffect(() => {
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }

    const loadLiveConfig = async () => {
      try {
        const res = await fetch(`/api/config?school_slug=${encodeURIComponent(schoolSlug)}&t=${Date.now()}`);
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          try {
            if (config.ppdb_form_fee) {
              const parsed = parseInt(config.ppdb_form_fee);
              if (!isNaN(parsed)) {
                setRegCost(parsed);
                localStorage.setItem("ppdb_reg_cost", config.ppdb_form_fee);
              }
            }
            if (config.ppdb_school_period) {
              setSchoolPeriod(config.ppdb_school_period);
              setFormData((prev) => ({ ...prev, periode: config.ppdb_school_period }));
              localStorage.setItem("ppdb_school_period", config.ppdb_school_period);
            }
            if (config.ppdb_wa_group_url) {
              setWaGroupUrl(config.ppdb_wa_group_url);
              localStorage.setItem("ppdb_wa_group_url", config.ppdb_wa_group_url);
            }
            if (config.ppdb_wa_admin) {
              setWaAdmin(config.ppdb_wa_admin);
              localStorage.setItem("ppdb_wa_admin", config.ppdb_wa_admin);
            }
            if (config.ppdb_portal_status) {
              setPortalStatus(config.ppdb_portal_status);
              localStorage.setItem(`ppdb_portal_status_${schoolSlug}`, config.ppdb_portal_status);
              localStorage.setItem("ppdb_portal_status", config.ppdb_portal_status);
            }
            if (config.ppdb_form_guideline) {
              setFormGuideline(config.ppdb_form_guideline);
              localStorage.setItem("ppdb_form_guideline", config.ppdb_form_guideline);
            }
            if (config.ppdb_fields_config) {
              setFieldsConfig(config.ppdb_fields_config);
              localStorage.setItem("ppdb_fields_config", JSON.stringify(config.ppdb_fields_config));
            }
            if (config.ppdb_majors_config !== undefined && config.ppdb_majors_config !== null) {
              let parsedMajors = config.ppdb_majors_config;
              if (typeof parsedMajors === "string" && (parsedMajors.startsWith("[") || parsedMajors.startsWith("{"))) {
                try {
                  parsedMajors = JSON.parse(parsedMajors);
                } catch (_e) {}
              }
              if (Array.isArray(parsedMajors)) {
                setMajors(parsedMajors);
                if (typeof window !== "undefined" && schoolSlug) {
                  localStorage.setItem(`ppdb_majors_config_${schoolSlug}`, JSON.stringify(parsedMajors));
                }
              } else {
                setMajors([]);
              }
            } else {
              setMajors([]);
            }
            if (config.ppdb_bank_config) {
              const bankData = config.ppdb_bank_config;
              let finalBanks = [];
              if (Array.isArray(bankData)) {
                finalBanks = bankData;
              } else if (bankData && typeof bankData === "object") {
                finalBanks = [bankData];
              }
              if (finalBanks.length > 0) {
                setBankConfigList(finalBanks);
                localStorage.setItem("ppdb_bank_config", JSON.stringify(finalBanks));
              }
            }
          } catch (storageErr) {
            console.warn(
              "Storage quota exceeded or unavailable. LocalStorage config cache sync bypassed.",
              storageErr
            );
          }
        }
      } catch (err) {
        console.log("Failed to fetch live config on registration page, using local storage fallback:", err);
      }

      try {
        const isDemo = schoolSlug === "demo" || schoolSlug === "smktarunabhakti";
        if (isDemo) {
          setIsSubscriptionActive(true);
        } else {
          const sRes = await fetch(`/api/saas/school-by-slug/${schoolSlug}?t=${Date.now()}`);
          const sData = await sRes.json();
          if (sData.success && sData.data) {
            const s = sData.data;
            const subActive =
              s.is_subscription_active === true ||
              s.is_verified === true ||
              s.status === "FULL_VERIFIED" ||
              s.status === "VERIFIED" ||
              s.status === "verified" ||
              s.plan_type === "PRO" ||
              s.plan_type === "ENTERPRISE" ||
              s.plan_type === "TRIAL" ||
              s.plan_type === "YEARLY" ||
              (s.subscription_expires_at && new Date(s.subscription_expires_at).getTime() > Date.now()) ||
              (typeof window !== "undefined" && localStorage.getItem(`ppdb_school_subscription_${schoolSlug}`)?.includes("ACTIVE"));
            setIsSubscriptionActive(!!subActive);
          } else {
            setIsSubscriptionActive(true);
          }
        }
      } catch (_e) {
        // fallback
      }
    };
    loadLiveConfig();

    const loadKuota = async () => {
      try {
        const res = await fetch(`/api/kuota?school_slug=${schoolSlug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setKuotaData(json.data.pendaftar);
        }
      } catch (err) {
        console.log("Failed to fetch kuota data:", err);
      }
    };
    loadKuota();
  }, [schoolSlug, setFormData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const payment = urlParams.get("payment");
      const nisn = urlParams.get("nisn");
      if (payment === "success" && nisn) {
        const forceVerifyAndShowSuccess = async () => {
          try {
            const res = await fetch(`/api/payment/confirm-payment-option`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nisn: nisn,
                bukti_bayar: null,
                metode_pembayaran: "Payment Gateway",
                school_slug: schoolSlug
              })
            });
            const data = await res.json();
            localStorage.removeItem("ppdb_active_checkout");
            if (data.success && data.data) {
              setSuccessData(data.data);
              localStorage.setItem(
                "ppdb_registration_success",
                JSON.stringify({
                  nisn: nisn,
                  success: true,
                  successData: data.data
                })
              );
            } else {
              localStorage.setItem(
                "ppdb_registration_success",
                JSON.stringify({
                  nisn: nisn,
                  success: true
                })
              );
            }
            setFormData((prev) => ({ ...prev, nisn: nisn }));
            setIsSuccess(true);
            fetchPublicApplicants?.();
          } catch (err) {
            console.log("Error force verifying redirected payment status:", err);
          }
        };
        forceVerifyAndShowSuccess();
      }
    }
  }, [checkPaymentStatus, fetchPublicApplicants, schoolSlug, setFormData]);

  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const targetNisn = formData.nisn || (submittedCandidate && (submittedCandidate as any).nisn);
      if (targetNisn) {
        const fetchSuccessData = async () => {
          try {
            const res = await fetch(`/api/applicants/public-invoice/${targetNisn}`);
            const json = await res.json();
            if (json.success && json.data) {
              setSuccessData(json.data);
              localStorage.setItem(
                "ppdb_registration_success",
                JSON.stringify({
                  nisn: targetNisn,
                  success: true,
                  successData: json.data
                })
              );
            }
          } catch (err) {
            console.log("Failed to fetch success candidate details:", err);
          }
        };
        fetchSuccessData();
      }
    }
  }, [isSuccess, formData.nisn, submittedCandidate]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isSuccess) {
      const dataToSave = { ...formData };
      localStorage.setItem("ppdb_registration_form_data", JSON.stringify(dataToSave));
    }
  }, [formData, isSuccess]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isSuccess) {
      localStorage.setItem("ppdb_registration_wizard_step", wizardStep.toString());
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    if (name === "tinggiBadan" || name === "beratBadan" || name === "jarakKm") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "waktuJam" || name === "waktuMenit" || name === "jumlahSaudara") {
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
          popup: "rounded-4xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6",
          confirmButton: "rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider",
          title: "text-base font-black text-slate-800 dark:text-white uppercase"
        }
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
          popup: "rounded-4xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6",
          confirmButton: "rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider",
          title: "text-base font-black text-slate-800 dark:text-white uppercase"
        }
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
      cancelButtonText: "Batal"
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
    isConfigLoaded
  };
};
