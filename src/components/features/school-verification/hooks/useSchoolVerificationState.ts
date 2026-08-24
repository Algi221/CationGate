"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import Swal from "sweetalert2";
import { VerificationStep, SchoolVerificationFormData } from "../types";

export function useSchoolVerificationState() {
  const params = useParams();
  const router = useRouter();
  const schoolSlug = params.school_slug as string;
  const { schoolId, schoolStatus } = usePPDB();

  const [currentStep, setCurrentStep] = useState<VerificationStep>(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<SchoolVerificationFormData>({
    npsn: "",
    dapodik_code: "",
    legal_sk_number: "",
    accreditation: "A (Unggul)",
    admin_name: "",
    official_email: "",
    whatsapp: "",
    website_url: "",
    instagram_url: "",
    sk_document_name: "",
    sk_document_url: ""
  });

  useEffect(() => {
    if (!schoolSlug) return;
    fetch(`/api/saas/school-by-slug/${schoolSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const s = data.data;
          setFormData((prev) => ({
            ...prev,
            npsn: s.npsn || "",
            dapodik_code: s.dapodik_code || "",
            legal_sk_number: s.legal_sk_number || "",
            accreditation: s.accreditation || "A (Unggul)",
            admin_name: s.admin_name || "",
            official_email: s.official_email || "",
            website_url: s.social_media?.website || "",
            instagram_url: s.social_media?.instagram || ""
          }));

          if (s.status === "FULL_VERIFIED" || s.status === "VERIFIED" || s.status === "verified") {
            setCurrentStep(4);
            setIsSubmitted(true);
          } else if (s.status === "PENDING_VERIFICATION" || s.status === "OTP_VERIFIED") {
            setCurrentStep(4);
            setIsSubmitted(true);
          }
        }
      })
      .catch(() => {});
  }, [schoolSlug]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.npsn || !formData.legal_sk_number || !formData.admin_name) {
        Swal.fire({
          title: "Form Belum Lengkap",
          text: "NPSN, Nomor SK Operasional, dan Nama Penanggung Jawab wajib diisi.",
          icon: "warning",
          confirmButtonColor: "#2563EB"
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.official_email) {
        Swal.fire({
          title: "Email Wajib Diisi",
          text: "Email resmi instansi wajib diisi untuk penerimaan notifikasi verifikasi.",
          icon: "warning",
          confirmButtonColor: "#2563EB"
        });
        return;
      }
    }
    setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as VerificationStep) : 4));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as VerificationStep) : 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Ukuran File Terlalu Besar",
          text: "Batas ukuran file SK adalah 5MB.",
          icon: "error",
          confirmButtonColor: "#2563EB"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          sk_document_name: file.name,
          sk_document_url: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.sk_document_name) {
      Swal.fire({
        title: "Dokumen Belum Diunggah",
        text: "Harap unggah berkas SK Operasional resmi (PDF / Gambar) sebelum mengajukan verifikasi.",
        icon: "warning",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/saas/submit-school-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: schoolId,
          school_slug: schoolSlug,
          ...formData
        })
      });

      const json = await res.json();
      if (json.success) {
        setIsSubmitted(true);
        setCurrentStep(4);
        Swal.fire({
          title: "Pengajuan Berhasil!",
          text: "Dokumen verifikasi instansi Anda telah berhasil diajukan dan sedang diproses oleh Tim Superadmin Gatekeeper.",
          icon: "success",
          confirmButtonColor: "#2563EB"
        });
      } else {
        Swal.fire({
          title: "Gagal Mengajukan",
          text: json.message || "Terjadi kesalahan sistem.",
          icon: "error",
          confirmButtonColor: "#2563EB"
        });
      }
    } catch (_err) {
      Swal.fire({
        title: "Kesalahan Jaringan",
        text: "Gagal terhubung ke server.",
        icon: "error",
        confirmButtonColor: "#2563EB"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    schoolSlug,
    schoolStatus,
    currentStep,
    loading,
    isSubmitted,
    formData,
    setFormData,
    handleNext,
    handlePrev,
    handleFileUpload,
    handleSubmit,
    router
  };
}
