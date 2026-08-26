"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import Swal from "sweetalert2";
import { 
  VerificationStep, 
  SchoolVerificationFormData,
  VerificationDocumentType,
  VerificationDocumentItem
} from "../types";

export function useSchoolVerificationState() {
  const params = useParams();
  const router = useRouter();
  const { schoolId, schoolStatus } = usePPDB();
  const schoolSlug =
    (params?.school_slug as string) ||
    (typeof window !== "undefined" && window.location.hostname.includes(".")
      ? window.location.hostname.split(".")[0]
      : "") ||
    "";

  const [currentStep, setCurrentStep] = useState<VerificationStep>(() => {
    if (typeof window !== "undefined" && schoolSlug) {
      const savedStep = localStorage.getItem(`cationgate_verification_step_${schoolSlug}`);
      if (savedStep && [1, 2, 3, 4].includes(Number(savedStep))) {
        return Number(savedStep) as VerificationStep;
      }
    }
    return 1;
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<SchoolVerificationFormData>(() => {
    const defaultData: SchoolVerificationFormData = {
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
    };

    if (typeof window !== "undefined" && schoolSlug) {
      try {
        const savedDraft = localStorage.getItem(`cationgate_verification_draft_${schoolSlug}`);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          return { ...defaultData, ...parsed };
        }
      } catch (_e) {}
    }
    return defaultData;
  });

  // Auto-save form data draft to localStorage on every change
  useEffect(() => {
    if (!schoolSlug || typeof window === "undefined") return;
    try {
      localStorage.setItem(`cationgate_verification_draft_${schoolSlug}`, JSON.stringify(formData));
    } catch (_e) {}
  }, [formData, schoolSlug]);

  // Auto-save current step to localStorage
  useEffect(() => {
    if (!schoolSlug || typeof window === "undefined") return;
    try {
      localStorage.setItem(`cationgate_verification_step_${schoolSlug}`, String(currentStep));
    } catch (_e) {}
  }, [currentStep, schoolSlug]);

  useEffect(() => {
    if (!schoolSlug) return;
    fetch(`/api/saas/school-by-slug/${schoolSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const s = data.data;
          setFormData((prev) => ({
            ...prev,
            npsn: prev.npsn || s.npsn || "",
            dapodik_code: prev.dapodik_code || s.dapodik_code || "",
            legal_sk_number: prev.legal_sk_number || s.legal_sk_number || "",
            accreditation: prev.accreditation || s.accreditation || "A (Unggul)",
            admin_name: prev.admin_name || s.admin_name || "",
            official_email: prev.official_email || s.official_email || "",
            website_url: prev.website_url || s.social_media?.website || "",
            instagram_url: prev.instagram_url || s.social_media?.instagram || "",
            sk_document_name: prev.sk_document_name || s.sk_document_name || "",
            sk_document_url: prev.sk_document_url || s.sk_document_url || ""
          }));

          if (s.status === "FULL_VERIFIED" || s.status === "VERIFIED" || s.status === "verified") {
            setCurrentStep(4);
            setIsSubmitted(true);
          } else if (s.status === "PENDING_VERIFICATION" || s.status === "OTP_VERIFIED" || s.status === "REJECTED") {
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

  const handleAddDocument = (type: VerificationDocumentType, file: File) => {
    const currentDocs = formData.documents || [];
    if (currentDocs.length >= 2) {
      Swal.fire({
        title: "Batas Maksimal Tercapai",
        text: "Maksimal 2 dokumen verifikasi per instansi.",
        icon: "warning",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "Ukuran File Terlalu Besar",
        text: "Batas ukuran file dokumen adalah 5MB.",
        icon: "error",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newDoc: VerificationDocumentItem = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type,
        name: file.name,
        url: reader.result as string,
        size: file.size
      };

      const updatedDocs = [...currentDocs, newDoc];
      setFormData((prev) => ({
        ...prev,
        documents: updatedDocs,
        sk_document_name: updatedDocs[0]?.name || "",
        sk_document_url: updatedDocs[0]?.url || ""
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = (docId: string) => {
    const currentDocs = formData.documents || [];
    const updatedDocs = currentDocs.filter((d) => d.id !== docId);
    setFormData((prev) => ({
      ...prev,
      documents: updatedDocs,
      sk_document_name: updatedDocs[0]?.name || "",
      sk_document_url: updatedDocs[0]?.url || ""
    }));
  };

  const handleFileSelected = (file: File, type: VerificationDocumentType = "SK_OPERASIONAL") => {
    handleAddDocument(type, file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAddDocument("SK_OPERASIONAL", file);
    }
  };

  const handleSubmit = async () => {
    const docs = formData.documents || [];
    const hasDocs = docs.length > 0 || Boolean(formData.sk_document_name);

    if (!hasDocs) {
      Swal.fire({
        title: "Dokumen Belum Diunggah",
        text: "Harap unggah minimal 1 dokumen verifikasi (SK Operasional, ID Card Kepsek/Pegawai, atau Bukti Akun Sosmed) sebelum mengajukan verifikasi.",
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
          ...formData,
          documents: docs.length > 0 ? docs : [
            {
              id: "doc-1",
              type: "SK_OPERASIONAL",
              name: formData.sk_document_name,
              url: formData.sk_document_url
            }
          ]
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
    setCurrentStep,
    loading,
    isSubmitted,
    formData,
    setFormData,
    handleNext,
    handlePrev,
    handleFileUpload,
    handleFileSelected,
    handleAddDocument,
    handleRemoveDocument,
    handleSubmit,
    router
  };
}
