"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { usePPDB } from "@/context/PPDBContext";
import { RegistrationFormData, DEFAULT_FIELDS_CONFIG } from "./types";

export const createInitialFormData = (): RegistrationFormData => ({
  nama: "",
  nisn: "",
  nik: "",
  tempatLahir: "",
  tglLahir: "",
  jenisKelamin: "",
  agama: "",
  kewarganegaraan: "",
  alamat: "",
  rtRw: "",
  kelurahan: "",
  kecamatan: "",
  kodePos: "",
  whatsapp: "",
  email: "",
  tinggalDengan: "",
  transportasi: "",
  tinggiBadan: "",
  beratBadan: "",
  jarakSekolah: "",
  jarakKm: "",
  waktuJam: "",
  waktuMenit: "",
  jumlahSaudara: "",
  golonganDarah: "",
  penyakitDiderita: "",
  kebutuhanKhusus: [],
  jenisPrestasi: [],
  tingkatPrestasi: [],
  uraianPrestasi: "",
  tahunPrestasi: "",
  penyelenggara: "",
  jenisBeasiswa: [],
  uraianBeasiswa: "",
  tahunMulaiBeasiswa: "",
  tahunSelesaiBeasiswa: "",
  namaAyah: "",
  tempatLahirAyah: "",
  tglLahirAyah: "",
  agamaAyah: "",
  kewarganegaraanAyah: "WNI",
  pendidikanAyah: "",
  pekerjaanAyah: "",
  penghasilanAyah: "",
  alamatAyah: "",
  rtrwAyah: "",
  kelurahanAyah: "",
  kecamatanAyah: "",
  kodePosAyah: "",
  statusAyah: "Masih Hidup",
  namaIbu: "",
  tempatLahirIbu: "",
  tglLahirIbu: "",
  agamaIbu: "",
  kewarganegaraanIbu: "WNI",
  pendidikanIbu: "",
  pekerjaanIbu: "",
  penghasilanIbu: "",
  alamatIbu: "",
  rtrwIbu: "",
  kelurahanIbu: "",
  kecamatanIbu: "",
  kodePosIbu: "",
  statusIbu: "Masih Hidup",
  namaWali: "",
  tempatLahirWali: "",
  tglLahirWali: "",
  agamaWali: "",
  kewarganegaraanWali: "WNI",
  pendidikanWali: "",
  pekerjaanWali: "",
  penghasilanWali: "",
  alamatWali: "",
  rtrwWali: "",
  kelurahanWali: "",
  kecamatanWali: "",
  kodePosWali: "",
  statusWali: "Masih Hidup",
  teleponOrtu: "",
  sekolahAsal: "",
  tglLulus: "",
  noIjazah: "",
  noSKHUN: "",
  noPesertaUN: "",
  lamaBelajar: "",
  pindahanDari: "",
  alasanPindah: "",
  diterimaKelas: "",
  diterimaTanggal: "",
  jurusan1: "",
  hobi: [],
  citaCita: "",
  nilaiUSTeori: "",
  nilaiUSPraktik: "",
  nilaiMuatanLokal: "",
  alasanMemilih: "",
  citaCitaSetelahLulus: "",
  pelajaranDisenangi: "",
  punyaKPS: "Tidak",
  noKPS: "",
  punyaKIP: "Tidak",
  noKIP: "",
  alasanDisenangi: "",
  kesulitanBelajar: "",
  perkelahian: "",
  ketPerkelahian: "",
  narkoba: "",
  ketNarkoba: "",
  pelanggaranLain: "",
  ketPelanggaranLain: "",
  janjiTaat: "",
  janjiSanksi: "",
  janjiAkrab: "",
  janjiBelajar: "",
  janjiNamaBaik: "",
  deklarasi: false,
  periode: "2026-2027",
  berkasFotoOk: false,
  berkasFotoFile: null,
  berkasFotoName: "",
  berkasFotoBase64: "",
  berkasPrestasiBase64: "",
});

export const useRegistrationForm = () => {
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "smk";
  const { registerApplicant, checkPaymentStatus, fetchPublicApplicants, ppdbLogo, ppdbTitle } = usePPDB();

  const [wizardStep, setWizardStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("ppdb_registration_wizard_step");
      if (savedStep) {
        const parsed = parseInt(savedStep);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 14) return parsed;
      }
    }
    return 1;
  });

  const [furthestStep, setFurthestStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("ppdb_registration_wizard_step");
      if (savedStep) {
        const parsed = parseInt(savedStep);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 14) return parsed;
      }
    }
    return 1;
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [kuotaData, setKuotaData] = useState<any[] | null>(null);

  const [portalStatus, setPortalStatus] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ppdb_portal_status") || "open";
    }
    return "open";
  });

  const [fieldsConfig, setFieldsConfig] = useState<Record<string, { label: string; required: boolean; active: boolean }>>(() => {
    if (typeof window !== "undefined") {
      const savedFieldsConfig = localStorage.getItem("ppdb_fields_config");
      if (savedFieldsConfig) {
        try {
          const parsed = JSON.parse(savedFieldsConfig);
          if (parsed && typeof parsed === "object") return parsed;
        } catch (_e) {}
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

  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    const initial = createInitialFormData();

    if (typeof window !== "undefined") {
      const savedPeriod = localStorage.getItem("ppdb_school_period");
      if (savedPeriod) initial.periode = savedPeriod;

      const savedSuccess = localStorage.getItem("ppdb_registration_success");
      if (savedSuccess) {
        try {
          const parsed = JSON.parse(savedSuccess);
          if (parsed && parsed.success && parsed.nisn) {
            initial.nisn = parsed.nisn;
            return initial;
          }
        } catch (_e) {}
      }

      const savedCheckout = localStorage.getItem("ppdb_active_checkout");
      if (!savedCheckout) {
        const savedFormData = localStorage.getItem("ppdb_registration_form_data");
        if (savedFormData) {
          try {
            const parsed = JSON.parse(savedFormData);
            return { ...initial, ...parsed };
          } catch (_e) {}
        }
      }
    }
    return initial;
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
      return localStorage.getItem("ppdb-theme") === "dark" || document.documentElement.classList.contains("dark");
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
      return localStorage.getItem("ppdb_wa_group_url") || "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS";
    }
    return "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS";
  });

  const [waAdmin, setWaAdmin] = useState("6281292244456");

  const [bankConfigList, setBankConfigList] = useState<Array<{ bankName: string; accountNumber: string; accountHolder: string }>>(() => {
    if (typeof window !== "undefined") {
      const savedBank = localStorage.getItem("ppdb_bank_config");
      if (savedBank) {
        try {
          const parsed = JSON.parse(savedBank);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === "object") return [parsed];
        } catch (_e) {}
      }
    }
    return [{ bankName: "Bank Mandiri", accountNumber: "157-00-0174092-2", accountHolder: "Yayasan Taruna Bhakti" }];
  });

  const [showPaymentGate, setShowPaymentGate] = useState(false);

  const [majors, setMajors] = useState<Array<{ code: string; title: string; logo?: string }>>(() => {
    if (typeof window !== "undefined") {
      const savedMajors = localStorage.getItem("ppdb_majors_config");
      if (savedMajors) {
        try {
          const parsed = JSON.parse(savedMajors);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_e) {}
      }
    }
    return [
      { code: "RPL", title: "Rekayasa Perangkat Lunak" },
      { code: "TJKT", title: "Teknik Jaringan Komputer & Telekomunikasi" },
      { code: "DKV", title: "Desain Komunikasi Visual" },
      { code: "ANM", title: "Animasi" },
      { code: "BC", title: "Broadcasting & Perfilman" },
      { code: "TE", title: "Teknik Elektronika" }
    ];
  });

  const getFieldLabel = useCallback(
    (key: string, defaultLabel: string) => {
      return fieldsConfig[key]?.label || defaultLabel;
    },
    [fieldsConfig]
  );

  const isFieldRequired = useCallback(
    (key: string) => {
      const configVal = fieldsConfig[key];
      if (configVal === undefined) {
        return DEFAULT_FIELDS_CONFIG[key]?.required !== false;
      }
      return configVal.required;
    },
    [fieldsConfig]
  );

  const isFieldActive = useCallback(
    (key: string) => {
      const configVal = fieldsConfig[key];
      if (configVal === undefined) {
        return DEFAULT_FIELDS_CONFIG[key]?.active !== false;
      }
      return configVal.active;
    },
    [fieldsConfig]
  );

  useEffect(() => {
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }

    const loadLiveConfig = async () => {
      try {
        const BACKEND_URL = typeof window !== "undefined" ? `/api` : "/api";
        const res = await fetch(`${BACKEND_URL}/config?school_slug=${schoolSlug}&t=${Date.now()}`);
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
            if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config) && config.ppdb_majors_config.length > 0) {
              setMajors(config.ppdb_majors_config);
              localStorage.setItem("ppdb_majors_config", JSON.stringify(config.ppdb_majors_config));
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
            console.warn("Storage quota exceeded or unavailable. LocalStorage config cache sync bypassed.", storageErr);
          }
        }
      } catch (err) {
        console.log("Failed to fetch live config on registration page, using local storage fallback:", err);
      }
    };
    loadLiveConfig();

    const loadKuota = async () => {
      try {
        const BACKEND_URL = typeof window !== "undefined" ? `/api` : "/api";
        const res = await fetch(`${BACKEND_URL}/kuota`);
        const json = await res.json();
        if (json.success && json.data) {
          setKuotaData(json.data.pendaftar);
        }
      } catch (err) {
        console.log("Failed to fetch kuota data:", err);
      }
    };
    loadKuota();
  }, [schoolSlug]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const payment = urlParams.get("payment");
      const nisn = urlParams.get("nisn");
      if (payment === "success" && nisn) {
        const forceVerifyAndShowSuccess = async () => {
          try {
            const backendUrl = "/api";
            const res = await fetch(`${backendUrl}/api/payment/confirm-payment-option`, {
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
  }, [checkPaymentStatus, fetchPublicApplicants, schoolSlug]);

  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const targetNisn = formData.nisn || (submittedCandidate && (submittedCandidate as any).nisn);
      if (targetNisn) {
        const fetchSuccessData = async () => {
          try {
            const backendUrl = "/api";
            const res = await fetch(`${backendUrl}/api/applicants/public-invoice/${targetNisn}`);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, kebutuhanKhusus: updated };
    });
  };

  const getStepLabel = (step: number): string => {
    switch (step) {
      case 1: return "Data Pribadi Siswa";
      case 2: return "Data Tempat Tinggal";
      case 3: return "Data Rincian (Data Periodik)";
      case 4: return "Data Kesehatan & Berkebutuhan Khusus";
      case 5: return "Data Prestasi (Opsional)";
      case 6: return "Data Beasiswa (Opsional)";
      case 7: return "Data Rincian (Data Pendidikan)";
      case 8: return "Data Ayah Kandung";
      case 9: return "Data Ibu Kandung";
      case 10: return "Data Wali (Opsional)";
      case 11: return "Data Kegemaran & Minat";
      case 12: return "Data Budi Pekerti & Ekonomi";
      case 13: return "Tinjau & Verifikasi Data Anda";
      case 14: return "Berkas & Konfirmasi Pendaftaran";
      default: return "";
    }
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 1: return ["nama", "jenisKelamin", "nisn", "nik", "tempatLahir", "tglLahir", "agama", "kewarganegaraan"];
      case 2: return ["alamat", "rtRw", "kelurahan", "kecamatan", "kodePos", "whatsapp", "teleponOrtu", "email", "tinggalDengan", "transportasi"];
      case 3: return ["tinggiBadan", "beratBadan", "jarakSekolah", "jarakKm", "waktuJam", "waktuMenit", "jumlahSaudara"];
      case 4: return ["golonganDarah", "penyakitDiderita", "kebutuhanKhusus"];
      case 5: return ["jenisPrestasi", "tingkatPrestasi", "uraianPrestasi", "tahunPrestasi", "penyelenggara"];
      case 6: return ["jenisBeasiswa", "uraianBeasiswa", "tahunMulaiBeasiswa", "tahunSelesaiBeasiswa"];
      case 7: return ["sekolahAsal", "tglLulus", "noIjazah", "noSKHUN", "noPesertaUN", "lamaBelajar", "pindahanDari", "alasanPindah", "diterimaKelas", "diterimaTanggal"];
      case 8: return ["namaAyah", "tempatLahirAyah", "tglLahirAyah", "agamaAyah", "kewarganegaraanAyah", "pendidikanAyah", "pekerjaanAyah", "penghasilanAyah", "alamatAyah", "rtrwAyah", "kelurahanAyah", "kecamatanAyah", "kodePosAyah", "statusAyah"];
      case 9: return ["namaIbu", "tempatLahirIbu", "tglLahirIbu", "agamaIbu", "kewarganegaraanIbu", "pendidikanIbu", "pekerjaanIbu", "penghasilanIbu", "alamatIbu", "rtrwIbu", "kelurahanIbu", "kecamatanIbu", "kodePosIbu", "statusIbu"];
      case 10: return ["namaWali", "tempatLahirWali", "tglLahirWali", "agamaWali", "kewarganegaraanWali", "pendidikanWali", "pekerjaanWali", "penghasilanWali", "alamatWali", "rtrwWali", "kelurahanWali", "kecamatanWali", "kodePosWali", "statusWali"];
      case 11: return ["hobi", "citaCita", "citaCitaSetelahLulus", "pelajaranDisenangi", "alasanDisenangi", "kesulitanBelajar"];
      case 12: return ["perkelahian", "narkoba", "pelanggaranLain", "janjiTaat", "janjiSanksi", "janjiAkrab", "janjiBelajar", "janjiNamaBaik"];
      case 13: return [];
      case 14: return ["berkasFotoBase64", "buktiBayar", "metodePembayaran", "deklarasi"];
      default: return [];
    }
  };

  const validateStep = (step: number): string[] => {
    const fields = getStepFields(step);
    const errors: string[] = [];

    if (step === 14) {
      if (!formData.deklarasi) errors.push("Pernyataan Deklarasi");
    }

    fields.forEach((key) => {
      const conf = fieldsConfig[key] || DEFAULT_FIELDS_CONFIG[key];
      if (conf && conf.active !== false && conf.required === true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (formData as any)[key];
        const isEmpty = val === undefined || val === null || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0);
        if (isEmpty) {
          errors.push(conf.label || key);
        }
      }
    });

    return errors;
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
          popup: "rounded-[2rem] border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6",
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
      setIsSubmitting(true);

      const finalData = { ...formData };

      const requiredErrors: string[] = [];
      Object.keys(DEFAULT_FIELDS_CONFIG).forEach((key) => {
        const conf = fieldsConfig[key] || DEFAULT_FIELDS_CONFIG[key];
        if (conf && conf.active !== false && conf.required === true) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const val = (finalData as any)[key];
          const isEmpty = val === undefined || val === null || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0);
          if (isEmpty) {
            requiredErrors.push(conf.label || key);
          }
        }
      });

      if (requiredErrors.length > 0) {
        alert(
          `Harap lengkapi kolom wajib berikut:\n- ${requiredErrors.slice(0, 10).join("\n- ")}${
            requiredErrors.length > 10 ? `\n...dan ${requiredErrors.length - 10} kolom lainnya` : ""
          }`
        );
        setIsSubmitting(false);
        return;
      }

      if (!finalData.nama || finalData.nama.trim() === "") finalData.nama = "Calon Siswa";
      if (!finalData.nisn || finalData.nisn.trim() === "") finalData.nisn = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      if (!finalData.nik || finalData.nik.trim() === "") finalData.nik = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
      if (!finalData.tempatLahir || finalData.tempatLahir.trim() === "") finalData.tempatLahir = "-";
      if (!finalData.tglLahir || finalData.tglLahir.trim() === "") finalData.tglLahir = "2010-01-01";
      if (!finalData.jenisKelamin) finalData.jenisKelamin = "L";
      if (!finalData.agama) finalData.agama = "Islam";
      if (!finalData.kewarganegaraan) finalData.kewarganegaraan = "WNI";
      if (!finalData.alamat || finalData.alamat.trim() === "") finalData.alamat = "-";
      if (!finalData.rtRw || finalData.rtRw.trim() === "") finalData.rtRw = "01/01";
      if (!finalData.kelurahan || finalData.kelurahan.trim() === "") finalData.kelurahan = "-";
      if (!finalData.kecamatan || finalData.kecamatan.trim() === "") finalData.kecamatan = "-";
      if (!finalData.kodePos || finalData.kodePos.trim() === "") finalData.kodePos = "00000";
      if (!finalData.whatsapp || finalData.whatsapp.trim() === "") finalData.whatsapp = "-";
      if (!finalData.tinggalDengan) finalData.tinggalDengan = "Orang Tua";
      if (!finalData.transportasi) finalData.transportasi = "Lainnya";
      if (!finalData.tinggiBadan) finalData.tinggiBadan = "0";
      if (!finalData.beratBadan) finalData.beratBadan = "0";
      if (!finalData.jarakSekolah) finalData.jarakSekolah = "Kurang dari 1 km";
      if (!finalData.jarakKm) finalData.jarakKm = "0";
      if (!finalData.waktuJam) finalData.waktuJam = "0";
      if (!finalData.waktuMenit) finalData.waktuMenit = "0";
      if (!finalData.jumlahSaudara) finalData.jumlahSaudara = "0";
      if (!finalData.golonganDarah) finalData.golonganDarah = "O";
      if (!finalData.teleponOrtu || finalData.teleponOrtu.trim() === "") finalData.teleponOrtu = "-";
      if (!finalData.sekolahAsal || finalData.sekolahAsal.trim() === "") finalData.sekolahAsal = "-";
      if (!finalData.tglLulus) finalData.tglLulus = "2026-06-10";
      if (!finalData.lamaBelajar) finalData.lamaBelajar = "3";
      if (!finalData.diterimaKelas) finalData.diterimaKelas = "X (Sepuluh)";
      if (!finalData.jurusan1) {
        const firstMajor = majors[0];
        finalData.jurusan1 = firstMajor ? `${firstMajor.title} (${firstMajor.code})` : "Rekayasa Perangkat Lunak (RPL)";
      }

      let calculatedPeriod = finalData.periode || schoolPeriod || "2026-2027";
      if (finalData.diterimaKelas === "XI (Sebelas)") {
        const parts = calculatedPeriod.split("-").map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          calculatedPeriod = `${parts[0] - 1}-${parts[1] - 1}`;
        }
      } else if (finalData.diterimaKelas === "XII (Dua Belas)") {
        const parts = calculatedPeriod.split("-").map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          calculatedPeriod = `${parts[0] - 2}-${parts[1] - 2}`;
        }
      }
      finalData.periode = calculatedPeriod;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (finalData as any).school_slug = schoolSlug;

      try {
        const res = await registerApplicant(finalData);
        if (res && res.success) {
          setSubmittedCandidate(res.data);
          if (typeof window !== "undefined") {
            localStorage.setItem("ppdb_active_checkout", JSON.stringify(res.data));
            localStorage.removeItem("ppdb_registration_form_data");
            localStorage.removeItem("ppdb_registration_wizard_step");
          }
          setShowPaymentGate(true);
        } else {
          Swal.fire({
            icon: "error",
            title: "Pendaftaran Gagal",
            text: res?.message || "Gagal mengirimkan formulir pendaftaran. Silakan coba lagi.",
            confirmButtonColor: "#3b82f6",
            customClass: {
              popup: "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900",
              confirmButton: "rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider",
              title: "text-base font-extrabold text-slate-800 dark:text-white"
            }
          });
        }
      } catch (err) {
        console.error("Submit error:", err);
        Swal.fire({
          icon: "error",
          title: "Kesalahan Koneksi",
          text: "Terjadi kesalahan koneksi. Silakan coba lagi.",
          confirmButtonColor: "#3b82f6",
          customClass: {
            popup: "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900",
            confirmButton: "rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider",
            title: "text-base font-extrabold text-slate-800 dark:text-white"
          }
        });
      } finally {
        setIsSubmitting(false);
      }
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
          popup: "rounded-[2rem] border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6",
          confirmButton: "rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider",
          title: "text-base font-black text-slate-800 dark:text-white uppercase"
        }
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = (confirmedData: any) => {
    setSuccessData(confirmedData);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ppdb_active_checkout");
      localStorage.setItem(
        "ppdb_registration_success",
        JSON.stringify({
          nisn: submittedCandidate?.nisn,
          success: true,
          successData: confirmedData
        })
      );
    }
    setShowPaymentGate(false);
    setIsSuccess(true);
    fetchPublicApplicants?.();
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
    handleRegisterNew
  };
};
