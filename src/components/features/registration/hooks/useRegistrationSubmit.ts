"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { RegistrationFormData, DEFAULT_FIELDS_CONFIG } from "../types";

interface UseRegistrationSubmitProps {
  formData: RegistrationFormData;
  fieldsConfig: Record<string, { label: string; required: boolean; active: boolean }>;
  schoolSlug: string;
  schoolPeriod: string;
  majors: Array<{ code: string; title: string; logo?: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerApplicant: (data: any) => Promise<any>;
  fetchPublicApplicants?: () => void;
  setSubmittedCandidate: (val: unknown) => void;
  setShowPaymentGate: (val: boolean) => void;
  setIsSuccess: (val: boolean) => void;
  setSuccessData: (val: unknown) => void;
  submittedCandidate: unknown;
}

export function useRegistrationSubmit({
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
}: UseRegistrationSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRegistration = async () => {
    setIsSubmitting(true);
    const finalData = { ...formData };

    const requiredErrors: string[] = [];
    Object.keys(DEFAULT_FIELDS_CONFIG).forEach((key) => {
      const conf = fieldsConfig[key] || DEFAULT_FIELDS_CONFIG[key];
      if (conf && conf.active !== false && conf.required === true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (finalData as any)[key];
        const isEmpty =
          val === undefined ||
          val === null ||
          (typeof val === "string" && val.trim() === "") ||
          (Array.isArray(val) && val.length === 0);
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
    if (!finalData.nisn || finalData.nisn.trim() === "")
      finalData.nisn = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    if (!finalData.nik || finalData.nik.trim() === "")
      finalData.nik = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    const cleanDate = (d?: string, fallback = "2010-01-01") => {
      if (!d || typeof d !== "string" || !d.trim()) return fallback;
      const str = d.trim();
      const parsed = new Date(str);
      if (isNaN(parsed.getTime()) || parsed.getFullYear() < 1900 || parsed.getFullYear() > 2100) {
        return fallback;
      }
      return str.includes("T") ? str.split("T")[0] : str;
    };

    if (!finalData.tempatLahir || finalData.tempatLahir.trim() === "") finalData.tempatLahir = "-";
    finalData.tglLahir = cleanDate(finalData.tglLahir, "2010-01-01");
    if (finalData.tglLahirAyah) finalData.tglLahirAyah = cleanDate(finalData.tglLahirAyah, "1980-01-01");
    if (finalData.tglLahirIbu) finalData.tglLahirIbu = cleanDate(finalData.tglLahirIbu, "1985-01-01");
    if (finalData.tglLahirWali) finalData.tglLahirWali = cleanDate(finalData.tglLahirWali, "1980-01-01");
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
    finalData.tglLulus = cleanDate(finalData.tglLulus, "2026-06-10");
    if (!finalData.lamaBelajar) finalData.lamaBelajar = "3";
    if (!finalData.diterimaKelas) finalData.diterimaKelas = "X (Sepuluh)";
    if (!finalData.jurusan1) {
      const firstMajor = majors[0];
      finalData.jurusan1 = firstMajor ? `${firstMajor.title} (${firstMajor.code})` : "Kelas Reguler (REG)";
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
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSuccess = (confirmedData: any) => {
    setSuccessData(confirmedData);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ppdb_active_checkout");
      localStorage.setItem(
        "ppdb_registration_success",
        JSON.stringify({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nisn: (submittedCandidate as any)?.nisn,
          success: true,
          successData: confirmedData
        })
      );
    }
    setShowPaymentGate(false);
    setIsSuccess(true);
    fetchPublicApplicants?.();
  };

  return {
    isSubmitting,
    handleSubmitRegistration,
    handlePaymentSuccess
  };
}
