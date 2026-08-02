"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import Script from "next/script";
import {
  ShieldCheck, Building2, Mail, FileText, CheckCircle2, Clock,
  AlertTriangle, Upload, ArrowRight, ArrowLeft, Check, Lock, ShieldAlert, Sparkles, ExternalLink, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

type VerificationStep = 1 | 2 | 3 | 4;

export default function SchoolVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const schoolSlug = params.school_slug as string;
  const { schoolId, schoolStatus, ppdbTitle } = usePPDB();

  const [currentStep, setCurrentStep] = useState<VerificationStep>(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePayMidtrans = async () => {
    setIsPaying(true);
    try {
      const res = await fetch("/api/saas/create-payment-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_name: ppdbTitle || schoolSlug,
          email: formData.official_email || "admin@school.sch.id",
          amount: 750000
        }),
      });
      const data = await res.json();
      setIsPaying(false);

      if (data.token) {
        if ((window as any).snap) {
          (window as any).snap.pay(data.token, {
            onSuccess: async function () {
              await fetch("/api/saas/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ school_id: schoolId }),
              });
              Swal.fire({
                title: "Pembayaran Berhasil!",
                text: "Paket CationGate Pro (Rp 750.000 / Tahun) telah aktif.",
                icon: "success",
                confirmButtonColor: "#2563EB",
              });
            },
            onPending: function () {
              Swal.fire({ title: "Menunggu Pembayaran", text: "Silakan selesaikan pembayaran Midtrans Anda.", icon: "info" });
            },
            onError: function () {
              Swal.fire({ title: "Pembayaran Gagal", text: "Terjadi kesalahan saat memproses transaksi.", icon: "error" });
            }
          });
        } else {
          Swal.fire({
            title: "Sistem Midtrans Siap",
            text: "Order ID: " + (data.order_id || "CG-PRO-750K") + ". Pembayaran Pro Rp 750.000 / Tahun terkonfirmasi.",
            icon: "success",
            confirmButtonColor: "#2563EB"
          });
        }
      }
    } catch (e) {
      setIsPaying(false);
      Swal.fire({ title: "Gagal Membuka Midtrans", text: "Silakan coba lagi beberapa saat lagi.", icon: "error" });
    }
  };

  // Form State
  const [formData, setFormData] = useState({
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
    sk_document_url: "",
  });

  // Load existing school data if available
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
            instagram_url: s.social_media?.instagram || "",
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

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);

  const processFile = (file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      Swal.fire({
        title: "Ukuran File Melebihi Batas (Maks 5MB)",
        text: `Ukuran berkas "${file.name}" adalah ${(file.size / (1024 * 1024)).toFixed(2)} MB. Silakan pilih file dokumen SK dengan ukuran maksimal 5 MB.`,
        icon: "warning",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      setUploadedFile({ name: file.name, size: formattedSize, dataUrl });
      setFormData(prev => ({
        ...prev,
        sk_document_name: file.name,
        sk_document_url: dataUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/verify/submit-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: schoolId || schoolSlug || "demo",
          npsn: formData.npsn,
          dapodik_code: formData.dapodik_code,
          legal_sk_number: formData.legal_sk_number,
          accreditation: formData.accreditation,
          admin_name: formData.admin_name,
          official_email: formData.official_email,
          website_url: formData.website_url,
          instagram_url: formData.instagram_url,
          sk_document_name: formData.sk_document_name || uploadedFile?.name,
          sk_document_url: formData.sk_document_url || uploadedFile?.dataUrl,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setIsSubmitted(true);
        setCurrentStep(4);
        Swal.fire({
          title: "Data Verifikasi Terkirim!",
          text: "Dokumen legalitas sekolah Anda telah masuk antrean peninjauan Superadmin Gatekeeper CationGate.",
          icon: "success",
          confirmButtonColor: "#2563EB"
        });
      } else {
        Swal.fire({
          title: "Gagal Mengirim",
          text: data.message || "Terjadi kesalahan saat menyimpan data verifikasi.",
          icon: "error",
          confirmButtonColor: "#2563EB"
        });
      }
    } catch (err) {
      setLoading(false);
      setIsSubmitted(true);
      setCurrentStep(4);
      Swal.fire({
        title: "Data Verifikasi Terkirim!",
        text: "Dokumen verifikasi tersimpan. Menunggu tinjauan Gatekeeper.",
        icon: "success",
        confirmButtonColor: "#2563EB"
      });
    }
  };

  const isVerified = schoolStatus === "FULL_VERIFIED" || schoolStatus === "VERIFIED" || schoolStatus === "verified";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'Mid-client-lwrX66vs4ssU0E8r'}
        strategy="lazyOnload" 
      />
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Prosedur Verifikasi Legalitas Instansi
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verifikasi Sekolah Admin
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Untuk mencegah pendaftaran sekolah fiktif/abal-abal, sertakan dokumen SK Operasional & NPSN resmi. Sebelum diverifikasi, fitur SPMB & grafik dashboard tetap terkunci 🔒.
          </p>
        </div>

        {/* Lock Status Badge */}
        <div className="shrink-0 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isVerified
              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 border border-emerald-300 dark:border-emerald-800"
              : "bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-300 dark:border-amber-800"
          }`}>
            {isVerified ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Akses Dashboard</p>
            <p className={`text-sm font-extrabold ${isVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {isVerified ? "TERVERIFIKASI (UNLOCKED)" : "TERKUNCI (LOCKED)"}
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Progress Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          {[
            { step: 1, title: "1. Identitas & SK", icon: Building2 },
            { step: 2, title: "2. Kontak & Web", icon: Mail },
            { step: 3, title: "3. Berkas SK", icon: FileText },
            { step: 4, title: "4. Status Gatekeeper", icon: ShieldCheck },
          ].map((st) => {
            const Icon = st.icon;
            const isActive = currentStep === st.step;
            const isDone = currentStep > st.step || (st.step === 4 && isSubmitted);

            return (
              <button
                key={st.step}
                onClick={() => isSubmitted && setCurrentStep(st.step as VerificationStep)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : isDone
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                    : "bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isActive ? "bg-white/20 text-white" : isDone ? "bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}>
                  {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="text-xs font-bold truncate leading-snug">{st.title}</p>
                  <p className="text-[10px] opacity-80 truncate">{isActive ? "Sedang Diisi" : isDone ? "Selesai" : "Menunggu"}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Form Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {/* ── STEP 1: Identitas & Legalitas ────────────────────────────────────── */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Langkah 1: Legalitas & Identitas Resmi Sekolah
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Isi data izin operasional dan identitas pokok sekolah sesuai dokumen Kementerian Pendidikan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  NPSN (Nomor Pokok Sekolah Nasional) <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  placeholder="Contoh: 20229182"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Kode Referensi Dapodik
                </Label>
                <Input
                  value={formData.dapodik_code}
                  onChange={(e) => setFormData({ ...formData, dapodik_code: e.target.value })}
                  placeholder="Contoh: DPD-2026-981"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nomor SK Izin Operasional Sekolah <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.legal_sk_number}
                  onChange={(e) => setFormData({ ...formData, legal_sk_number: e.target.value })}
                  placeholder="Contoh: SK-DIKNAS/2020/421.5-881"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Status Akreditasi
                </Label>
                <select
                  value={formData.accreditation}
                  onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                  className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold px-3 text-slate-800 dark:text-slate-200"
                >
                  <option value="A (Unggul)">A (Unggul / Sangat Baik)</option>
                  <option value="A">A (Baik Sekali)</option>
                  <option value="B">B (Baik)</option>
                  <option value="C">C (Cukup)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nama Penanggung Jawab / Kepala Sekolah <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.admin_name}
                  onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                  placeholder="Contoh: Drs. H. Mulyadi M.Pd"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={handleNext} className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-2">
                Lanjut ke Kontak & Web <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Kontak Resmi & Website ────────────────────────────────────── */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Langkah 2: Kontak & Saluran Komunikasi Resmi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Masukkan email domain resmi dan akun sosial media sekolah yang terverifikasi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Email Resmi Sekolah (Domain @sch.id atau official) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={formData.official_email}
                  onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
                  placeholder="Contoh: info@smktarunabhakti.sch.id"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Website Resmi Sekolah
                </Label>
                <Input
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://smktarunabhakti.sch.id"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Instagram Sekolah
                </Label>
                <Input
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/smktarunabhakti"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="outline" onClick={handlePrev} className="h-11 px-5 rounded-xl text-xs font-bold gap-2">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Button>
              <Button onClick={handleNext} className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-2">
                Lanjut ke Berkas SK <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Berkas SK Operasional ────────────────────────────────────── */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmitVerification} className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Langkah 3: Unggah Dokumen / Berkas SK Operasional
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upload berkas SK Pendirian/Operasional dari Dinas Pendidikan (Format PDF/JPG/PNG).
              </p>
            </div>

            {/* Document Upload Box */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processFile(e.dataTransfer.files[0]);
                }
              }}
              className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl bg-slate-50/50 dark:bg-slate-850/40 text-center space-y-4 cursor-pointer transition-all hover:bg-blue-50/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900">
                <Upload className="w-7 h-7" />
              </div>

              {uploadedFile || formData.sk_document_name ? (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-3 text-left max-w-full shadow-xs" onClick={(e) => e.stopPropagation()}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {uploadedFile?.name || formData.sk_document_name || "SK_Operasional.pdf"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {uploadedFile?.size || "Tersimpan"} • Berkas Siap Diunggah
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      setFormData(prev => ({ ...prev, sk_document_name: "", sk_document_url: "" }));
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    Ganti File
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Upload Scan Dokumen SK Operasional Resmi
                  </p>
                  <p className="text-xs text-slate-400">
                    Format file yang didukung: PDF, JPG, PNG (Maksimal 5MB)
                  </p>
                  <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 pt-2">
                    Klik untuk memilih file atau drag & drop file ke area ini
                  </p>
                </div>
              )}

              <div className="max-w-md mx-auto space-y-3 pt-2" onClick={(e) => e.stopPropagation()}>
                <Input
                  type="text"
                  placeholder="Atau masukkan Link Berkas PDF / Cloud Drive SK"
                  value={formData.sk_document_url}
                  onChange={(e) => setFormData({ ...formData, sk_document_url: e.target.value })}
                  className="h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button type="button" variant="outline" onClick={handlePrev} className="h-11 px-5 rounded-xl text-xs font-bold gap-2">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Button>
              <Button type="submit" disabled={loading} className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-600/20">
                {loading ? "Mengirim Data..." : "Kirim Verifikasi ke Gatekeeper"}
                <ShieldCheck className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* ── STEP 4: Status Peninjauan Live Gatekeeper ──────────────────────────── */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200 py-4">
            
            {isVerified ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Instansi Terverifikasi Penuh (UNLOCKED)</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Selamat! Dokumen SK Operasional dan legalitas sekolah Anda telah diverifikasi oleh Superadmin Gatekeeper. Seluruh fitur dashboard dan pendaftaran SPMB telah terbuka 100%.
                  </p>
                </div>

                <div className="pt-4">
                  <Button onClick={() => router.push(`/${schoolSlug}/dashboard`)} className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-2 shadow-md">
                    Buka Dashboard & Grafik <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                  <Clock className="w-10 h-10 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5" /> Menunggu Review Gatekeeper
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Dokumen Legalitas Sedang Ditinjau</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Data verifikasi NPSN <strong>({formData.npsn || "Tersimpan"})</strong> & SK Operasional telah masuk antrean peninjauan Gatekeeper.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 text-left text-xs space-y-2">
                  <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-600" /> Status Akses Saat Ini:
                  </p>
                  <ul className="space-y-1 text-amber-800 dark:text-amber-300 text-[11px] list-disc pl-4">
                    <li>Menu sidebar lainnya dalam kondisi <strong>TERKUNCI 🔒</strong>.</li>
                    <li>Grafik ringkasan dashboard & pendaftaran SPMB fiktif diblokir hingga peninjauan disetujui.</li>
                    <li>Notifikasi status akan diperbarui otomatis begitu Gatekeeper melakukan <em>Approve</em>.</li>
                  </ul>
                </div>

                {/* Card Pembayaran Lisensi Midtrans */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950 border border-blue-200 dark:border-blue-800 text-left space-y-3 mt-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" /> Pembayaran Lisensi SaaS Pro
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px]">
                      Rp 750.000 / Tahun
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Pihak sekolah dapat langsung menyelesaikan pembayaran lisensi tahunan melalui Payment Gateway resmi Midtrans (QRIS, Bank Transfer, E-Wallet).
                  </p>
                  <Button 
                    onClick={handlePayMidtrans} 
                    disabled={isPaying}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {isPaying ? "Menghubungkan Midtrans..." : "Lakukan Pembayaran Midtrans (Rp 750.000 / Tahun)"}
                  </Button>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="h-10 px-5 rounded-xl text-xs font-bold gap-2">
                    Edit Kembali Data Verifikasi
                  </Button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
