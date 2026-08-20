"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, Upload, ArrowLeft, Home, Monitor, Code, Palette, Film, Cpu, Sun, Moon, CreditCard, ShieldCheck, Sparkles, X, FileText, AlertCircle, Phone, Copy, ChevronRight, Building, CheckCircle2, DollarSign, Printer, User, Users, Pencil, School, HelpCircle, Clock } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";
import dompurify from "dompurify";
import Swal from 'sweetalert2';
import { uploadFileDirect } from "@/utils/storage";
import { useParams } from "next/navigation";


const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (e) {
    return "";
  }
};

const sanitizeSrc = (src: string | undefined | null): string => {
  let url = sanitizeUrl(src);
  if (url && url.startsWith("/jurusan/")) {
    url = url.replace("/jurusan/", "/assets/jurusan/");
  }
  return url;
};

const getMajorDetails = (majorName: string) => {
  const nameLower = (majorName || "").toLowerCase();
  if (nameLower.includes("rekayasa") || nameLower.includes("rpl") || nameLower.includes("perangkat lunak")) {
    return {
      icon: <Code className="w-5 h-5 text-blue-500" />,
      logoText: "RPL",
      logoPath: "/assets/jurusan/pplg.png",
      bg: "bg-primary/5 dark:bg-blue-950/45",
      textColor: "text-primary dark:text-sky-400"
    };
  }
  if (nameLower.includes("jaringan") || nameLower.includes("tjkt") || nameLower.includes("komputer")) {
    return {
      icon: <Monitor className="w-5 h-5 text-amber-500" />,
      logoText: "TJKT",
      logoPath: "/assets/jurusan/tjkt.png",
      bg: "bg-amber-50 dark:bg-amber-950/45",
      textColor: "text-amber-600 dark:text-amber-400"
    };
  }
  if (nameLower.includes("desain") || nameLower.includes("dkv") || nameLower.includes("visual")) {
    return {
      icon: <Palette className="w-5 h-5 text-purple-500" />,
      logoText: "DKV",
      logoPath: "/assets/jurusan/dkv.png",
      bg: "bg-purple-50 dark:bg-purple-950/45",
      textColor: "text-purple-600 dark:text-purple-400"
    };
  }
  if (nameLower.includes("animasi") || nameLower.includes("anm")) {
    return {
      icon: <Sparkles className="w-5 h-5 text-pink-500" />,
      logoText: "ANM",
      logoPath: "/assets/jurusan/animasi.png",
      bg: "bg-pink-50 dark:bg-pink-950/45",
      textColor: "text-pink-600 dark:text-pink-400"
    };
  }
  if (nameLower.includes("broadcast") || nameLower.includes("bc") || nameLower.includes("perfilman")) {
    return {
      icon: <Film className="w-5 h-5 text-red-500" />,
      logoText: "BC",
      logoPath: "/assets/jurusan/bc.png",
      bg: "bg-red-50 dark:bg-red-950/45",
      textColor: "text-red-600 dark:text-red-400"
    };
  }
  if (nameLower.includes("elektronika") || nameLower.includes("te")) {
    return {
      icon: <Cpu className="w-5 h-5 text-emerald-500" />,
      logoText: "TE",
      logoPath: "/assets/jurusan/te.png",
      bg: "bg-emerald-50 dark:bg-emerald-950/45",
      textColor: "text-emerald-600 dark:text-emerald-400"
    };
  }
  return {
    icon: <Sparkles className="w-5 h-5 text-blue-500" />,
    logoText: "PPDB",
    logoPath: "",
    bg: "bg-primary/5 dark:bg-blue-950/45",
    textColor: "text-primary dark:text-sky-400"
  };
};

const DEFAULT_FIELDS_CONFIG: Record<string, { label: string; required: boolean; active: boolean }> = {
  nama: { label: "Nama Lengkap", required: true, active: true },
  nisn: { label: "NISN", required: true, active: true },
  nik: { label: "NIK", required: true, active: true },
  tempatLahir: { label: "Tempat Lahir", required: true, active: true },
  tglLahir: { label: "Tanggal Lahir", required: true, active: true },
  jenisKelamin: { label: "Jenis Kelamin", required: true, active: true },
  agama: { label: "Agama", required: true, active: true },
  kewarganegaraan: { label: "Kewarganegaraan", required: true, active: true },
  alamat: { label: "Alamat Lengkap", required: true, active: true },
  rtRw: { label: "RT / RW", required: true, active: true },
  kelurahan: { label: "Kelurahan", required: true, active: true },
  kecamatan: { label: "Kecamatan", required: true, active: true },
  kodePos: { label: "Kode Pos", required: true, active: true },
  whatsapp: { label: "Nomor WhatsApp (Calon Siswa)", required: true, active: true },
  email: { label: "Alamat Email", required: false, active: true },
  tinggalDengan: { label: "Tinggal Dengan", required: true, active: true },
  transportasi: { label: "Transportasi Ke Sekolah", required: true, active: true },
  tinggiBadan: { label: "Tinggi Badan (cm)", required: true, active: true },
  beratBadan: { label: "Berat Badan (kg)", required: true, active: true },
  golonganDarah: { label: "Golongan Darah", required: true, active: true },
  penyakitDiderita: { label: "Penyakit Diderita", required: false, active: true },
  kebutuhanKhusus: { label: "Berkebutuhan Khusus", required: false, active: true },
  jenisPrestasi: { label: "Jenis Prestasi", required: false, active: true },
  tingkatPrestasi: { label: "Tingkat Prestasi", required: false, active: true },
  uraianPrestasi: { label: "Uraian Prestasi", required: false, active: true },
  tahunPrestasi: { label: "Tahun Prestasi", required: false, active: true },
  penyelenggara: { label: "Penyelenggara Prestasi", required: false, active: true },
  berkasPrestasi: { label: "Himbauan Sertifikat Prestasi", required: false, active: true },
  jenisBeasiswa: { label: "Jenis Beasiswa", required: false, active: true },
  uraianBeasiswa: { label: "Uraian/Nama Beasiswa", required: false, active: true },
  tahunMulaiBeasiswa: { label: "Tahun Mulai Beasiswa", required: false, active: true },
  tahunSelesaiBeasiswa: { label: "Tahun Selesai Beasiswa", required: false, active: true },
  sekolahAsal: { label: "Nama SMP/MTs Asal", required: true, active: true },
  tglLulus: { label: "Tanggal Lulus SMP/MTs", required: true, active: true },
  noIjazah: { label: "Nomor Seri Ijazah", required: false, active: true },
  noSKHUN: { label: "Nomor Seri SKHUN", required: false, active: true },
  noPesertaUN: { label: "Nomor Peserta UN", required: false, active: true },
  lamaBelajar: { label: "Lama Belajar (Tahun)", required: true, active: true },
  pindahanDari: { label: "Pindahan Dari", required: false, active: true },
  alasanPindah: { label: "Alasan Pindah Sekolah", required: false, active: true },
  diterimaKelas: { label: "Diterima di Tingkat/Kelas", required: true, active: true },
  jurusan1: { label: "Program Keahlian (Jurusan)", required: true, active: true },
  alasanMemilih: { label: "Alasan Memilih Jurusan", required: false, active: true },
  namaAyah: { label: "Nama Lengkap Ayah", required: true, active: true },
  tempatLahirAyah: { label: "Tempat Lahir Ayah", required: true, active: true },
  tglLahirAyah: { label: "Tanggal Lahir Ayah", required: true, active: true },
  agamaAyah: { label: "Agama Ayah", required: true, active: true },
  kewarganegaraanAyah: { label: "Kewarganegaraan Ayah", required: true, active: true },
  pendidikanAyah: { label: "Pendidikan Terakhir Ayah", required: true, active: true },
  pekerjaanAyah: { label: "Pekerjaan Ayah", required: true, active: true },
  penghasilanAyah: { label: "Penghasilan Bulanan Ayah", required: true, active: true },
  alamatAyah: { label: "Alamat Lengkap Ayah", required: true, active: true },
  statusAyah: { label: "Status Ayah", required: true, active: true },
  namaIbu: { label: "Nama Lengkap Ibu", required: true, active: true },
  tempatLahirIbu: { label: "Tempat Lahir Ibu", required: true, active: true },
  tglLahirIbu: { label: "Tanggal Lahir Ibu", required: true, active: true },
  agamaIbu: { label: "Agama Ibu", required: true, active: true },
  kewarganegaraanIbu: { label: "Kewarganegaraan Ibu", required: true, active: true },
  pendidikanIbu: { label: "Pendidikan Terakhir Ibu", required: true, active: true },
  pekerjaanIbu: { label: "Pekerjaan Ibu", required: true, active: true },
  penghasilanIbu: { label: "Penghasilan Bulanan Ibu", required: true, active: true },
  alamatIbu: { label: "Alamat Lengkap Ibu", required: true, active: true },
  statusIbu: { label: "Status Ibu", required: true, active: true },
  namaWali: { label: "Nama Lengkap Wali", required: false, active: true },
  tempatLahirWali: { label: "Tempat Lahir Wali", required: false, active: true },
  tglLahirWali: { label: "Tanggal Lahir Wali", required: false, active: true },
  agamaWali: { label: "Agama Wali", required: false, active: true },
  kewarganegaraanWali: { label: "Kewarganegaraan Wali", required: false, active: true },
  pendidikanWali: { label: "Pendidikan Terakhir Wali", required: false, active: true },
  pekerjaanWali: { label: "Pekerjaan Wali", required: false, active: true },
  penghasilanWali: { label: "Penghasilan Bulanan Wali", required: false, active: true },
  alamatWali: { label: "Alamat Lengkap Wali", required: false, active: true },
  statusWali: { label: "Status Wali", required: false, active: true },
  teleponOrtu: { label: "Nomor Telepon Orang Tua", required: true, active: true },
  nilaiUSTeori: { label: "Nilai US Teori", required: false, active: true },
  nilaiUSPraktik: { label: "Nilai US Praktik", required: false, active: true },
  nilaiMuatanLokal: { label: "Nilai Muatan Lokal", required: false, active: true },
  citaCita: { label: "Cita-cita Utama", required: false, active: true },
  hobi: { label: "Hobi", required: false, active: true },
  pelajaranDisenangi: { label: "Pelajaran Yang Disenangi", required: false, active: true },
  alasanDisenangi: { label: "Alasan Menyenangi Pelajaran", required: false, active: true },
  kesulitanBelajar: { label: "Kesulitan Belajar Yang Dialami", required: false, active: true },
  citaCitaSetelahLulus: { label: "Rencana Setelah Lulus", required: false, active: true },
  punyaKPS: { label: "Status KPS", required: false, active: true },
  noKPS: { label: "Nomor KPS", required: false, active: true },
  punyaKIP: { label: "Status KIP", required: false, active: true },
  noKIP: { label: "Nomor KIP", required: false, active: true }
};

export default function DaftarPage() {
  const params = useParams();
  const { registerApplicant, checkPaymentStatus, fetchPublicApplicants, addToast, ppdbLogo, ppdbTitle } = usePPDB();
  const [wizardStep, setWizardStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kuotaData, setKuotaData] = useState<any[] | null>(null);
  const [portalStatus, setPortalStatus] = useState("open");
  const [fieldsConfig, setFieldsConfig] = useState<Record<string, { label: string; required: boolean; active: boolean }>>({});

  const getFieldLabel = (key: string, defaultLabel: string) => {
    return fieldsConfig[key]?.label || defaultLabel;
  };
  const isFieldRequired = (key: string) => {
    const configVal = fieldsConfig[key];
    if (configVal === undefined) {
      return DEFAULT_FIELDS_CONFIG[key]?.required !== false;
    }
    return configVal.required;
  };
  const isFieldActive = (key: string) => {
    const configVal = fieldsConfig[key];
    if (configVal === undefined) {
      return DEFAULT_FIELDS_CONFIG[key]?.active !== false;
    }
    return configVal.active;
  };

  const [formData, setFormData] = useState({
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
    berkasFotoFile: null as File | null,
    berkasFotoName: "",
    berkasFotoBase64: "",
    berkasPrestasiBase64: "",
  });

  const [submittedCandidate, setSubmittedCandidate] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const [isDark, setIsDark] = useState(false);
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [regCost, setRegCost] = useState(250000);
  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [bankConfigList, setBankConfigList] = useState<Array<{ bankName: string; accountNumber: string; accountHolder: string }>>([
    { bankName: "Bank Mandiri", accountNumber: "157-00-0174092-2", accountHolder: "Yayasan Taruna Bhakti" }
  ]);
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<"gateway" | "manual" | "transfer" | "tu">("transfer");
  const [manualReceiptBase64, setManualReceiptBase64] = useState("");
  const [manualReceiptName, setManualReceiptName] = useState("");
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);

  const [majors, setMajors] = useState([
    { code: "RPL", title: "Rekayasa Perangkat Lunak" },
    { code: "TJKT", title: "Teknik Jaringan Komputer & Telekomunikasi" },
    { code: "DKV", title: "Desain Komunikasi Visual" },
    { code: "ANM", title: "Animasi" },
    { code: "BC", title: "Broadcasting & Perfilman" },
    { code: "TE", title: "Teknik Elektronika" }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    const savedCost = localStorage.getItem('ppdb_reg_cost');
    if (savedCost) {
      const parsed = parseInt(savedCost);
      if (!isNaN(parsed)) setRegCost(parsed);
    }

    const savedPeriod = localStorage.getItem('ppdb_school_period');
    if (savedPeriod) {
      setSchoolPeriod(savedPeriod);
      setFormData(prev => ({ ...prev, periode: savedPeriod }));
    }

    const savedWaGroup = localStorage.getItem('ppdb_wa_group_url');
    if (savedWaGroup) {
      setWaGroupUrl(savedWaGroup);
    }

    const savedPortalStatus = localStorage.getItem('ppdb_portal_status');
    if (savedPortalStatus) {
      setPortalStatus(savedPortalStatus);
    }

    const savedFieldsConfig = localStorage.getItem('ppdb_fields_config');
    if (savedFieldsConfig) {
      try {
        const parsed = JSON.parse(savedFieldsConfig);
        if (parsed && typeof parsed === 'object') {
          setFieldsConfig(parsed);
        }
      } catch (e) {}
    }

    const savedMajors = localStorage.getItem('ppdb_majors_config');
    if (savedMajors) {
      try {
        const parsed = JSON.parse(savedMajors);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMajors(parsed);
        }
      } catch (e) {
        console.log("Failed to parse custom majors config:", e);
      }
    }

    const savedBank = localStorage.getItem('ppdb_bank_config');
    if (savedBank) {
      try {
        const parsed = JSON.parse(savedBank);
        if (Array.isArray(parsed)) {
          setBankConfigList(parsed);
        } else if (parsed && typeof parsed === 'object') {
          setBankConfigList([parsed]);
        }
      } catch (e) {
        console.log("Failed to parse custom bank config:", e);
      }
    }

    const loadLiveConfig = async () => {
      try {
        const BACKEND_URL = typeof window !== 'undefined' ? `/api` : "/api";
        const res = await fetch(`${BACKEND_URL}/config`);
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          try {
            if (config.ppdb_form_fee) {
              const parsed = parseInt(config.ppdb_form_fee);
              if (!isNaN(parsed)) {
                setRegCost(parsed);
                localStorage.setItem('ppdb_reg_cost', config.ppdb_form_fee);
              }
            }
            if (config.ppdb_school_period) {
              setSchoolPeriod(config.ppdb_school_period);
              setFormData(prev => ({ ...prev, periode: config.ppdb_school_period }));
              localStorage.setItem('ppdb_school_period', config.ppdb_school_period);
            }
            if (config.ppdb_wa_group_url) {
              setWaGroupUrl(config.ppdb_wa_group_url);
              localStorage.setItem('ppdb_wa_group_url', config.ppdb_wa_group_url);
            }
            if (config.ppdb_portal_status) {
              setPortalStatus(config.ppdb_portal_status);
              localStorage.setItem('ppdb_portal_status', config.ppdb_portal_status);
            }
            if (config.ppdb_fields_config) {
              setFieldsConfig(config.ppdb_fields_config);
              localStorage.setItem('ppdb_fields_config', JSON.stringify(config.ppdb_fields_config));
            }
            if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config) && config.ppdb_majors_config.length > 0) {
              setMajors(config.ppdb_majors_config);
              localStorage.setItem('ppdb_majors_config', JSON.stringify(config.ppdb_majors_config));
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
                localStorage.setItem('ppdb_bank_config', JSON.stringify(finalBanks));
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
        const BACKEND_URL = typeof window !== 'undefined' ? `/api` : "/api";
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

    if (typeof window !== "undefined") {
      const savedSuccess = localStorage.getItem('ppdb_registration_success');
      if (savedSuccess) {
        try {
          const parsed = JSON.parse(savedSuccess);
          if (parsed && parsed.success && parsed.nisn) {
            setFormData(prev => ({ ...prev, nisn: parsed.nisn }));
            if (parsed.successData) {
              setSuccessData(parsed.successData);
            }
            setIsSuccess(true);
            return;
          }
        } catch (e) {
          console.log("Gagal memuat sesi sukses pendaftaran:", e);
        }
      }

      const savedCheckout = localStorage.getItem('ppdb_active_checkout');
      if (savedCheckout) {
        try {
          const parsed = JSON.parse(savedCheckout);
          if (parsed && parsed.nisn) {
            setSubmittedCandidate(parsed);
            setShowPaymentGate(true);
          }
        } catch (e) {
          console.log("Gagal memuat sesi checkout aktif dari localStorage:", e);
        }
      } else {
        const savedFormData = localStorage.getItem('ppdb_registration_form_data');
        if (savedFormData) {
          try {
            const parsed = JSON.parse(savedFormData);
            setFormData(prev => ({ ...prev, ...parsed }));
          } catch (e) {
            console.log("Gagal memuat draf data pendaftaran dari localStorage:", e);
          }
        }
        const savedStep = localStorage.getItem('ppdb_registration_wizard_step');
        if (savedStep) {
          const parsed = parseInt(savedStep);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= 14) {
            setWizardStep(parsed);
            setFurthestStep(parsed);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      const nisn = params.get("nisn");
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
                              school_slug: (params as any)?.school_slug as string
                            })
            });
            const data = await res.json();
            localStorage.removeItem('ppdb_active_checkout');
            if (data.success && data.data) {
              setSuccessData(data.data);
              localStorage.setItem('ppdb_registration_success', JSON.stringify({
                nisn: nisn,
                success: true,
                successData: data.data
              }));
            } else {
              localStorage.setItem('ppdb_registration_success', JSON.stringify({
                nisn: nisn,
                success: true
              }));
            }
            setFormData(prev => ({ ...prev, nisn: nisn }));
            setIsSuccess(true);
            fetchPublicApplicants?.();
          } catch (err) {
            console.log("Error force verifying redirected payment status:", err);
          }
        };
        forceVerifyAndShowSuccess();
      }
    }
  }, [checkPaymentStatus, fetchPublicApplicants]);

  useEffect(() => {
    if (isSuccess) {
      const targetNisn = formData.nisn || (submittedCandidate && ((submittedCandidate as any).nisn));
      if (targetNisn) {
        const fetchSuccessData = async () => {
          try {
            const backendUrl = "/api";
            const res = await fetch(`${backendUrl}/api/applicants/public-invoice/${targetNisn}`);
            const json = await res.json();
            if (json.success && json.data) {
              setSuccessData(json.data);
              localStorage.setItem('ppdb_registration_success', JSON.stringify({
                nisn: targetNisn,
                success: true,
                successData: json.data
              }));
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
      localStorage.setItem('ppdb_registration_form_data', JSON.stringify(dataToSave));
    }
  }, [formData, isSuccess]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isSuccess) {
      localStorage.setItem('ppdb_registration_wizard_step', wizardStep.toString());
    }
  }, [wizardStep, isSuccess]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ppdb-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ppdb-theme', 'light');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        Swal.fire({
          title: 'Mengunggah...',
          text: 'Mohon tunggu sementara file Anda sedang diunggah ke cloud.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        const publicUrl = await uploadFileDirect(file, `pendaftar_${fieldName}`);
        setFormData(prev => ({
          ...prev,
          [fieldName]: publicUrl
        }));
        Swal.close();
      } catch (err) {
        console.error("Upload error:", err);
        Swal.fire('Gagal', 'Gagal mengunggah file. Silakan coba lagi.', 'error');
      }
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "nisn") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "nik") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "kodePos") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
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
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "tinggiBadan" || name === "beratBadan" || name === "jarakKm") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "waktuJam" || name === "waktuMenit" || name === "jumlahSaudara") {
      const cleanValue = value.replace(/\D/g, "").slice(0, 2);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => {
      const current = prev.kebutuhanKhusus || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
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
      case 1: return ['nama', 'jenisKelamin', 'nisn', 'nik', 'tempatLahir', 'tglLahir', 'agama', 'kewarganegaraan'];
      case 2: return ['alamat', 'rtRw', 'kelurahan', 'kecamatan', 'kodePos', 'whatsapp', 'teleponOrtu', 'email', 'tinggalDengan', 'transportasi'];
      case 3: return ['tinggiBadan', 'beratBadan', 'jarakSekolah', 'jarakKm', 'waktuJam', 'waktuMenit', 'jumlahSaudara'];
      case 4: return ['golonganDarah', 'penyakitDiderita', 'kebutuhanKhusus'];
      case 5: return ['jenisPrestasi', 'tingkatPrestasi', 'uraianPrestasi', 'tahunPrestasi', 'penyelenggara'];
      case 6: return ['jenisBeasiswa', 'uraianBeasiswa', 'tahunMulaiBeasiswa', 'tahunSelesaiBeasiswa'];
      case 7: return ['sekolahAsal', 'tglLulus', 'noIjazah', 'noSKHUN', 'noPesertaUN', 'lamaBelajar', 'pindahanDari', 'alasanPindah', 'diterimaKelas', 'diterimaTanggal'];
      case 8: return ['namaAyah', 'tempatLahirAyah', 'tglLahirAyah', 'agamaAyah', 'kewarganegaraanAyah', 'pendidikanAyah', 'pekerjaanAyah', 'penghasilanAyah', 'alamatAyah', 'rtrwAyah', 'kelurahanAyah', 'kecamatanAyah', 'kodePosAyah', 'statusAyah'];
      case 9: return ['namaIbu', 'tempatLahirIbu', 'tglLahirIbu', 'agamaIbu', 'kewarganegaraanIbu', 'pendidikanIbu', 'pekerjaanIbu', 'penghasilanIbu', 'alamatIbu', 'rtrwIbu', 'kelurahanIbu', 'kecamatanIbu', 'kodePosIbu', 'statusIbu'];
      case 10: return ['namaWali', 'tempatLahirWali', 'tglLahirWali', 'agamaWali', 'kewarganegaraanWali', 'pendidikanWali', 'pekerjaanWali', 'penghasilanWali', 'alamatWali', 'rtrwWali', 'kelurahanWali', 'kecamatanWali', 'kodePosWali', 'statusWali'];
      case 11: return ['hobi', 'citaCita', 'citaCitaSetelahLulus', 'pelajaranDisenangi', 'alasanDisenangi', 'kesulitanBelajar'];
      case 12: return ['perkelahian', 'narkoba', 'pelanggaranLain', 'janjiTaat', 'janjiSanksi', 'janjiAkrab', 'janjiBelajar', 'janjiNamaBaik'];
      case 13: return [];
      case 14: return ['berkasFotoBase64', 'buktiBayar', 'metodePembayaran', 'deklarasi'];
      default: return [];
    }
  };

  const validateStep = (step: number): string[] => {
    const fields = getStepFields(step);
    const errors: string[] = [];
    
    if (step === 1) {
      if (!formData.nama || formData.nama.trim() === '') errors.push("Nama Lengkap");
      if (!formData.nisn || formData.nisn.trim() === '') errors.push("NISN");
    }
    if (step === 14) {
      if (!formData.deklarasi) errors.push("Pernyataan Deklarasi");
    }

    fields.forEach((key) => {
      const conf = fieldsConfig[key] || DEFAULT_FIELDS_CONFIG[key];
      if (conf && conf.active !== false && conf.required === true) {
        const val = (formData as any)[key];
        const isEmpty = val === undefined || val === null || 
                        (typeof val === "string" && val.trim() === "") || 
                        (Array.isArray(val) && val.length === 0);
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
        icon: 'warning',
        title: 'Data Belum Lengkap',
        html: `<div class="text-left font-medium text-xs text-slate-600 dark:text-slate-400">Mohon lengkapi data wajib berikut sebelum melanjutkan ke tahap berikutnya:</div>
               <ul class="text-left list-disc list-inside mt-2 text-xs font-bold text-red-500 space-y-1">
                 ${stepErrors.map(err => `<li>${err}</li>`).join('')}
               </ul>`,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'OKE, SAYA LENGKAPI',
        customClass: {
          popup: 'rounded-[2rem] border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6',
          confirmButton: 'rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider',
          title: 'text-base font-black text-slate-850 dark:text-white uppercase'
        }
      });
      return;
    }

    if (wizardStep < 14) {
      setWizardStep(prev => {
        const next = prev + 1;
        if (next > furthestStep) {
          setFurthestStep(next);
        }
        return next;
      });
    } else {
      setIsSubmitting(true);
      
      const finalData = { ...formData };

      // Validate all required and active fields configured by admin
      const requiredErrors: string[] = [];
      Object.keys(DEFAULT_FIELDS_CONFIG).forEach((key) => {
        const conf = fieldsConfig[key] || DEFAULT_FIELDS_CONFIG[key];
        if (conf && conf.active !== false && conf.required === true) {
          const val = (finalData as any)[key];
          const isEmpty = val === undefined || val === null || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0);
          if (isEmpty) {
            requiredErrors.push(conf.label || key);
          }
        }
      });

      if (requiredErrors.length > 0) {
        alert(`Harap lengkapi kolom wajib berikut:\n- ${requiredErrors.slice(0, 10).join("\n- ")}${requiredErrors.length > 10 ? `\n...dan ${requiredErrors.length - 10} kolom lainnya` : ""}`);
        setIsSubmitting(false);
        return;
      }

      // Safe fallbacks to keep PostgreSQL NOT NULL database columns happy
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

      // Adjust period for transfer students dynamically
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
      (finalData as any).school_slug = (params as any)?.school_slug as string || 'smk';

      try {
        const res = await registerApplicant(finalData);
        if (res && res.success) {
          setSubmittedCandidate(res.data);
          if (typeof window !== "undefined") {
            localStorage.setItem('ppdb_active_checkout', JSON.stringify(res.data));
            localStorage.removeItem('ppdb_registration_form_data');
            localStorage.removeItem('ppdb_registration_wizard_step');
          }
          setShowPaymentGate(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Pendaftaran Gagal',
            text: res?.message || "Gagal mengirimkan formulir pendaftaran. Silakan coba lagi.",
            confirmButtonColor: '#3b82f6',
            customClass: {
              popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
              confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
              title: 'text-base font-extrabold text-slate-850 dark:text-white'
            }
          });
        }
      } catch (err) {
        console.error("Submit error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Kesalahan Koneksi',
          text: "Terjadi kesalahan koneksi. Silakan coba lagi.",
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-850 dark:text-white'
          }
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(prev => prev - 1);
    }
  };

  const goToStep = (step) => {
    if (step <= furthestStep) {
      setWizardStep(step);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Tahap Terkunci',
        text: 'Anda belum bisa langsung melompat ke tahap ini. Silakan isi data di form saat ini dan klik "Selanjutnya" untuk membuka tahap berikutnya.',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'MENGERTI',
        customClass: {
          popup: 'rounded-[2rem] border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-6',
          confirmButton: 'rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-wider',
          title: 'text-base font-black text-slate-850 dark:text-white uppercase'
        }
      });
    }
  };

  if (portalStatus === "closed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-slate-950 p-6 text-center">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/80 dark:border-slate-800/60 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-500 border border-red-100 dark:border-red-900/40 mx-auto">
            <Clock size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-850 dark:text-white uppercase tracking-wider">Pendaftaran Ditutup</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Mohon maaf, portal Penerimaan Peserta Didik Baru (PPDB) SMK Taruna Bhakti Depok saat ini sedang ditutup.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={`/${(params as any)?.school_slug || ''}`}
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
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">Memuat Invoice & Konfirmasi...</p>
        </div>
      );
    }

    const tglDaftarFormatted = new Date(successData.tgl_daftar).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    return (
      <div className="ppdb-print-container relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-10 bg-background dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 print:bg-white dark:bg-[#0f172a] print:p-0">
        
        {/* CSS print override style block to hide headers/footers (localhost URL) and fix blank page */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            /* Hide all non-printable elements */
            .bg-glow-container, .print-hide-sidebar, .signature-block, .floating-action-nav, button, a, nav, header, footer {
              display: none !important;
            }
            
            /* Reset parent wrappers to normal block display with visible overflow */
            html,
            body,
            body > div,
            main,
            #__next,
            .ppdb-print-container,
            .ppdb-print-content {
              display: block !important;
              overflow: visible !important;
              background: white !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              box-shadow: none !important;
              border: none !important;
              height: auto !important;
              min-height: auto !important;
              position: static !important;
            }
            
            /* Apply custom padding and formatting on the invoice sheet itself */
            .printable-invoice-sheet {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 1.5cm !important;
              box-shadow: none !important;
              border: none !important;
              background: white !important;
              background-color: white !important;
              color: #0f172a !important;
              overflow: visible !important;
              position: static !important;
            }
            
            /* Force all text in print to be dark and visible */
            .printable-invoice-sheet *,
            .printable-invoice-sheet span,
            .printable-invoice-sheet p,
            .printable-invoice-sheet h1,
            .printable-invoice-sheet h2,
            .printable-invoice-sheet h4,
            .printable-invoice-sheet td,
            .printable-invoice-sheet th {
              color: #0f172a !important;
              background: transparent !important;
              background-color: transparent !important;
            }
            
            /* Keep specific colored text for status and rombel */
            .printable-invoice-sheet .text-blue-650,
            .printable-invoice-sheet .text-primary {
              color: #2563eb !important;
            }
            
            .printable-invoice-sheet .text-emerald-600 {
              color: #059669 !important;
            }
            
            .printable-invoice-sheet .text-amber-500 {
              color: #d97706 !important;
            }
            
            .printable-invoice-sheet border,
            .printable-invoice-sheet td,
            .printable-invoice-sheet th,
            .printable-invoice-sheet tr,
            .printable-invoice-sheet table {
              border-color: #000000 !important;
            }
            
            @page {
              size: auto;
              margin: 0mm; /* hides default browser header (title) and footer (localhost URL) */
            }
          }

          /* Force light theme colors on the printable invoice container even in dark mode on screen */
          html.dark .printable-invoice-sheet,
          html.dark .printable-invoice-sheet.bg-white dark:bg-[#0f172a],
          .printable-invoice-sheet {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border-color: #e2e8f0 !important;
          }

          html.dark .printable-invoice-sheet .text-slate-955,
          html.dark .printable-invoice-sheet .text-slate-900,
          html.dark .printable-invoice-sheet .text-slate-850,
          html.dark .printable-invoice-sheet .text-slate-855,
          html.dark .printable-invoice-sheet .text-slate-800 dark:text-white,
          html.dark .printable-invoice-sheet .text-slate-700 dark:text-slate-200,
          .printable-invoice-sheet .text-slate-955,
          .printable-invoice-sheet .text-slate-900,
          .printable-invoice-sheet .text-slate-855,
          .printable-invoice-sheet .text-slate-850,
          .printable-invoice-sheet .text-slate-800 dark:text-white,
          .printable-invoice-sheet .text-slate-700 dark:text-slate-200 {
            color: #0f172a !important;
          }

          html.dark .printable-invoice-sheet .text-slate-550,
          html.dark .printable-invoice-sheet .text-slate-500 dark:text-slate-400,
          html.dark .printable-invoice-sheet .text-slate-450,
          html.dark .printable-invoice-sheet .text-slate-400,
          .printable-invoice-sheet .text-slate-550,
          .printable-invoice-sheet .text-slate-500 dark:text-slate-400,
          .printable-invoice-sheet .text-slate-450,
          .printable-invoice-sheet .text-slate-400 {
            color: #64748b !important;
          }

          html.dark .printable-invoice-sheet .bg-background,
          .printable-invoice-sheet .bg-background {
            background-color: #f8fafc !important;
          }

          html.dark .printable-invoice-sheet .bg-white dark:bg-[#0f172a],
          .printable-invoice-sheet .bg-white dark:bg-[#0f172a] {
            background-color: #ffffff !important;
          }

          html.dark .printable-invoice-sheet .border-slate-200 dark:border-slate-700,
          html.dark .printable-invoice-sheet .border-slate-100 dark:border-slate-800,
          .printable-invoice-sheet .border-slate-200 dark:border-slate-700,
          .printable-invoice-sheet .border-slate-100 dark:border-slate-800 {
            border-color: #e2e8f0 !important;
          }

          html.dark .printable-invoice-sheet .border-slate-800,
          html.dark .printable-invoice-sheet .border-slate-900,
          .printable-invoice-sheet .border-slate-800,
          .printable-invoice-sheet .border-slate-900 {
            border-color: #1e293b !important;
          }
          
          html.dark .printable-invoice-sheet .divide-slate-200,
          .printable-invoice-sheet .divide-slate-200 {
            border-color: #e2e8f0 !important;
          }

          html.dark .printable-invoice-sheet .text-primary,
          .printable-invoice-sheet .text-primary {
            color: #2563eb !important;
          }
        `}} />

        {/* Background Glowing Blobs */}
        <div className="bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          <div className="bg-glow bg-glow-3"></div>
        </div>

        {/* MOBILE VIEW (Congrats card matching mockup, only on screen < 1024px) */}
        <div className="block lg:hidden bg-white dark:bg-[#0f172a]/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center relative z-10 print-hide-sidebar">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Pendaftaran Sukses!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">
            Terima kasih, <strong>{successData.nama || "Calon Bintang"}</strong>.
            Data pendaftaran Anda telah berhasil direkam di sistem PPDB SMK Taruna Bhakti.
          </p>
          <div className="bg-background/70 dark:bg-slate-950/30 backdrop-blur-sm border border-slate-100 dark:border-slate-800 rounded-xl p-4 mb-6 text-left text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-850">
              <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400">NISN:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{successData.nisn}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-850">
              <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400">Sekolah Asal:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{successData.sekolah_asal || successData.sekolahAsal || "-"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400">Jurusan Utama:</span>
              <span className="font-bold text-primary dark:text-sky-400">{successData.jurusan_1 || successData.jurusan1 || "-"}</span>
            </div>
          </div>

          {/* Warning box */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900 rounded-2xl p-4.5 mb-6 text-left text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            <div className="font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0" />
              PENTING: Bawa Berkas Fisik!
            </div>
            Calon siswa diimbau untuk datang langsung ke sekretariat PPDB sekolah guna melakukan verifikasi berkas fisik. Mohon persiapkan dan bawa dokumen berikut:
            <ul className="list-disc pl-4.5 mt-1 space-y-0.5 font-semibold">
              <li>Fotokopi Kartu Keluarga (KK)</li>
              <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
              <li>Akta Kelahiran asli &amp; Fotokopi</li>
              <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
              <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
            </ul>
          </div>

          {/* Whatsapp join CTA */}
          {((successData && successData.payment_status === "Paid") || isSuccess) && (
            <div className="bg-primary/5 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900 rounded-2xl p-4.5 mb-6 text-center text-xs">
              <p className="font-bold text-blue-800 dark:text-blue-300 mb-2.5">
                Mari Bergabung ke Grup PPDB WhatsApp!
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mb-3.5">
                Dapatkan info berkas fisik, jadwal tes bakat minat, dan pengumuman resmi langsung di ponsel Anda.
              </p>
              <a 
                href={sanitizeUrl(waGroupUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow shadow-emerald-500/20 transition duration-300"
              >
                <Phone size={14} />
                <span>Gabung Grup WA Pendaftar</span>
              </a>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link href={`/invoice?nisn=${successData.nisn}`} target="_blank" className="w-full flex justify-center items-center py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]">
              Lihat &amp; Cetak Invoice
            </Link>
            <Link href="/" className="w-full flex justify-center items-center py-3.5 px-6 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all">
              Kembali ke Beranda
            </Link>
            <button
              type="button"
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'Konfirmasi',
                  text: "Apakah Anda ingin mendaftarkan calon siswa baru lainnya?",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Ya',
                  cancelButtonText: 'Batal'
                });
                if (result.isConfirmed) {
                  localStorage.removeItem('ppdb_registration_success');
                  setIsSuccess(false);
                  setSuccessData(null);
                  setSubmittedCandidate(null);
                  setWizardStep(1);
                  setFormData({
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
                    periode: schoolPeriod,
                    berkasFotoOk: false,
                    berkasFotoFile: null,
                    berkasFotoName: "",
                    berkasFotoBase64: "",
                    berkasPrestasiBase64: "",
                  });
                }
              }}
              className="w-full flex justify-center items-center gap-1.5 py-3 bg-primary/5 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-primary dark:text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-blue-200/50 dark:border-blue-800/30"
            >
              Daftar Calon Baru Lainnya
            </button>
          </div>
        </div>

        {/* DESKTOP VIEW (Congrats + Merged Invoice Side-by-Side, screen >= 1024px) */}
        <div className="ppdb-print-content hidden lg:grid grid-cols-12 gap-8 max-w-6xl w-full relative z-10 items-start">
          
          {/* Left Column: Sidebar Stats, Documents checklist and WhatsApp CTA (print:hidden) */}
          <div className="lg:col-span-5 space-y-6 print-hide-sidebar">
            
            {/* Congrats Info Box */}
            <div className="bg-white dark:bg-[#0f172a]/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute right-4 top-4 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mb-4.5 shadow-sm">
                <CheckCircle2 size={28} className="animate-pulse" />
              </div>
              
              <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2 leading-tight">Pendaftaran Sukses!</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-bold">
                Terima kasih, <strong className="text-slate-750 dark:text-white">{successData.nama}</strong>. Data registrasi administrasi Anda telah tersimpan secara resmi di sistem PPDB SMK Taruna Bhakti Depok.
              </p>
            </div>

            {/* Documents Checklist warning Box */}
            <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-250/50 dark:border-amber-900/40 rounded-3xl p-6 text-left space-y-3 shadow-sm">
              <div className="font-black text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5 border-b border-amber-200/50 dark:border-amber-900/20 pb-2">
                <AlertCircle size={14} className="shrink-0" />
                PENTING: BAWA BERKAS FISIK KE SEKOLAH
              </div>
              <p className="text-[10px] text-amber-700/90 dark:text-amber-300/85 leading-relaxed font-bold">
                Harap datang langsung ke loket sekretariat PPDB sekolah untuk verifikasi fisik berkas-berkas pendaftaran berikut:
              </p>
              <ul className="text-[10px] text-amber-805 dark:text-amber-350 font-bold space-y-1 pl-4 list-disc leading-normal">
                <li>Fotokopi Kartu Keluarga (KK)</li>
                <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
                <li>Akta Kelahiran asli &amp; Fotokopi</li>
                <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
                <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
              </ul>
            </div>

            {/* WhatsApp Group card (Only show if payment_status === "Paid" or successfully completed) */}
            {((successData && successData.payment_status === "Paid") || isSuccess) && (
              <div className="bg-primary/5/60 dark:bg-blue-950/15 border border-blue-200/55 dark:border-blue-900/45 rounded-3xl p-6 text-center space-y-3.5 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Phone size={18} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-wide">Mari Bergabung ke Grup WhatsApp</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-1 font-bold">
                    Hubungkan dengan calon pendaftar lainnya dan dapatkan pembaruan informasi seleksi bakat minat.
                  </p>
                </div>
                <a
                  href={sanitizeUrl(waGroupUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow shadow-emerald-500/10 transition"
                >
                  <Phone size={12} />
                  Gabung Grup WA Pendaftar
                </a>
              </div>
            )}

            {/* Print and Main Action controls */}
            <div className="bg-white dark:bg-[#0f172a]/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 space-y-4">
              <button 
                onClick={() => window.print()}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-755 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/15 transition transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Printer size={14} />
                Cetak Invoice Resmi (PDF)
              </button>

              <Link href="/" className="w-full flex justify-center items-center gap-1.5 py-3.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider rounded-xl transition">
                <Home size={13} />
                Kembali ke Beranda
              </Link>

              <button
                type="button"
                onClick={async () => {
                  const result = await Swal.fire({
                    title: 'Konfirmasi',
                    text: "Apakah Anda ingin mendaftarkan calon siswa baru lainnya?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya',
                    cancelButtonText: 'Batal'
                  });
                  if (result.isConfirmed) {
                    localStorage.removeItem('ppdb_registration_success');
                    setIsSuccess(false);
                    setSuccessData(null);
                    setSubmittedCandidate(null);
                    setWizardStep(1);
                    setFormData({
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
                      periode: schoolPeriod,
                      berkasFotoOk: false,
                      berkasFotoFile: null,
                      berkasFotoName: "",
                      berkasFotoBase64: "",
                      berkasPrestasiBase64: "",
                    });
                  }
                }}
                className="w-full flex justify-center items-center gap-1.5 py-3.5 bg-primary/5 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-primary dark:text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-blue-200/50 dark:border-blue-800/30"
              >
                Daftar Calon Baru Lainnya
              </button>
            </div>

          </div>

          {/* Right Column: Detailed High-Fidelity Printable Invoice Container */}
          <div className="lg:col-span-7 w-full bg-white dark:bg-[#0f172a] text-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700/50 print-full-width relative overflow-hidden invoice-sheet-container printable-invoice-sheet">
            
            {/* Elegant official diagonal stamp seal inside sheet */}
            {successData.payment_status === "Paid" ? (
              <div className="absolute top-28 right-8 border-4 border-emerald-500/60 text-emerald-500/60 font-black text-sm uppercase tracking-widest px-4 py-2 rounded-xl rotate-[-12deg] pointer-events-none select-none z-10 bg-white dark:bg-[#0f172a]/70 backdrop-blur-xs font-mono">
                LUNAS / VERIFIED
              </div>
            ) : (
              <div className="absolute top-28 right-8 border-4 border-amber-500/60 text-amber-500/60 font-black text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl rotate-[-12deg] pointer-events-none select-none z-10 bg-white dark:bg-[#0f172a]/70 backdrop-blur-xs font-mono">
                PROSES VERIFIKASI
              </div>
            )}

            {/* School Letterhead */}
            <div className="flex items-center gap-4 border-b-4 border-double border-slate-800 pb-4 mb-6">
              {ppdbLogo && <img src={ppdbLogo || undefined} alt="Logo Sekolah" className="w-14 h-14 object-contain" onError={(e:any) => e.target.src = "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/cropped-logo-tb-32x32.png"} />}
              <div className="text-left">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">Panitia Penerimaan Peserta Didik Baru</h4>
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  {ppdbTitle ? ppdbTitle.replace(/^(ppdb\s+)/i, '').toUpperCase() : "SMK TARUNA BHAKTI DEPOK"}
                </h2>
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Terakreditasi A · Jl. Pekapuran No. 22, Cimanggis, Depok, Jawa Barat</p>
                <p className="text-[9px] text-slate-400">Telp: (021) 874 7475 · Website: www.smktarunabhakti.sch.id</p>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="text-center mb-6">
              <h1 className="text-base font-black uppercase tracking-widest text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 inline-block pb-1.5 mb-1.5">TANDA BUKTI REGISTRASI & INVOICE PEMBAYARAN</h1>
              <p className="text-[10px] font-mono font-bold text-slate-450">Nomor Dokumen: INV-{successData.nisn}</p>
            </div>

            {/* Invoice details layout: 2-Columns grid */}
            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-2xl p-4.5 text-[10px] leading-relaxed text-left text-slate-700 dark:text-slate-200 font-bold mb-6">
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">No. Invoice:</span>
                  <span className="text-slate-900 font-mono font-extrabold">INV-{successData.nisn}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">Tanggal Daftar:</span>
                  <span className="text-slate-900">{tglDaftarFormatted}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">Periode Ajaran:</span>
                  <span className="text-slate-900 font-extrabold">{successData.periode || schoolPeriod}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">Nama Pendaftar:</span>
                  <span className="text-slate-900 uppercase font-extrabold">{successData.nama}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">NISN Pendaftar:</span>
                  <span className="text-slate-900 font-mono font-extrabold">{successData.nisn}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 w-24">Program Rombel:</span>
                  <span className="text-primary font-extrabold uppercase">{successData.jurusan_1 || successData.jurusan1 || "-"}</span>
                </div>
              </div>
            </div>

            {/* Fee item details table */}
            <table className="w-full text-left text-[11px] font-bold text-slate-700 dark:text-slate-200 border-collapse mb-6">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-450">
                  <th className="py-2.5">Deskripsi Alokasi Tagihan</th>
                  <th className="py-2.5 text-right w-36">Jumlah (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 text-slate-900 font-extrabold">
                    Biaya Registrasi Formulir PPDB SMK Taruna Bhakti
                    <span className="block text-[9px] font-bold text-slate-400 mt-0.5">Alokasi administrasi berkas dan formulir online</span>
                  </td>
                  <td className="py-3 text-right text-slate-900 font-black">
                    Rp { regCost.toLocaleString("id-ID") }
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Bottom Total summary */}
            <div className="flex justify-end mb-6">
              <div className="w-64 space-y-1.5 text-[10px] font-bold">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span>Subtotal:</span>
                  <span>Rp {regCost.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-550">
                  <span>Pajak (PPN 0%):</span>
                  <span>Nihil</span>
                </div>
                <div className="flex justify-between text-slate-955 font-black text-xs py-2 border-t-2 border-slate-800">
                  <span>Total Tagihan:</span>
                  <span className="text-primary font-black text-sm">Rp {regCost.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Payment Details footer and official approval stamp */}
            <div className="flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-400 leading-normal border-t border-slate-150 pt-4 mb-8 print:hidden">
              <div className="flex gap-4">
                <div>
                  <span className="font-black">Metode Bayar:</span> <span className="text-slate-800 dark:text-white font-bold uppercase">
                    {successData.metode_pembayaran === 'Transfer Manual' ? 'Transfer' : successData.metode_pembayaran}
                  </span>
                </div>
                <div>
                  <span className="font-black">Status Bayar:</span> <span className={`font-black uppercase ${successData.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>{successData.payment_status === 'Paid' ? 'LUNAS (VERIFIED)' : 'PENDING'}</span>
                </div>
              </div>
              <p className="text-[8px] font-bold text-slate-400">
                * Tanda terima digital PPDB SMK Taruna Bhakti.
              </p>
            </div>

            {/* Physical Documents Warning Block */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4 mt-5 text-[11px] text-amber-800 dark:text-amber-500 leading-relaxed font-bold">
              <div className="flex items-center gap-2 mb-2 font-black text-amber-700 dark:text-amber-500 uppercase tracking-wider text-xs">
                <span className="text-sm">⚠️</span>
                Penting: Bawa Berkas Fisik!
              </div>
              <p className="mb-2">
                Harap datang langsung ke loket sekretariat PPDB sekolah untuk verifikasi fisik berkas-berkas pendaftaran berikut:
              </p>
              <ul className="list-disc pl-5 m-0 space-y-1">
                <li>Fotokopi Kartu Keluarga (KK)</li>
                <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
                <li>Akta Kelahiran asli &amp; Fotokopi</li>
                <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
                <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
              </ul>
            </div>

            {/* Button Cetak Kartu Pendaftaran SPMB */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
              <Link
                href={`kartu-pendaftaran?nisn=${encodeURIComponent(formData.nisn || successData?.nisn || '')}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                <Printer className="w-4 h-4" />
                Cetak Kartu Pendaftaran SPMB
              </Link>
            </div>

          </div>

        </div>

      </div>
    );
  }

  if (showPaymentGate && submittedCandidate) {
    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (typeof addToast === "function") {
        addToast("Nomor Rekening Disalin", "Nomor rekening berhasil disalin ke clipboard.", "success");
      }
    };

    const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      if (file.size > 3 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'Ukuran File Terlalu Besar',
          text: "Ukuran bukti pembayaran maksimal adalah 3MB!",
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-850 dark:text-white'
          }
        });
        return;
      }
      
      const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      if (!allowed.includes(file.type)) {
        Swal.fire({
          icon: 'warning',
          title: 'Format File Tidak Sesuai',
          text: "Format file harus JPG, PNG, atau PDF!",
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-850 dark:text-white'
          }
        });
        return;
      }
      
      setManualReceiptName(file.name);
      Swal.fire({
        title: 'Mengunggah Bukti Bayar...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      uploadFileDirect(file, `receipt_${submittedCandidate.nisn}`)
        .then((publicUrl) => {
          setManualReceiptBase64(publicUrl);
          Swal.close();
        })
        .catch((err) => {
          console.error(err);
          Swal.fire('Gagal', 'Gagal mengunggah bukti bayar.', 'error');
        });
    };

    const handleConfirmOption = async (metode: string, receiptBase64: string = "") => {
      setIsSubmittingReceipt(true);
      try {
        const BACKEND_URL = typeof window !== 'undefined' ? `/api` : "/api";
        const res = await fetch(`${BACKEND_URL}/api/payment/confirm-payment-option`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
                      nisn: submittedCandidate.nisn,
                      bukti_bayar: receiptBase64 || null,
                      metode_pembayaran: metode,
                      school_slug: (params as any)?.school_slug as string
                    })
        });
        const data = await res.json();
        if (data.success) {
          if (typeof window !== "undefined") {
            localStorage.removeItem('ppdb_active_checkout');
            localStorage.setItem('ppdb_registration_success', JSON.stringify({
              nisn: submittedCandidate.nisn,
              success: true,
              successData: data.data
            }));
          }
          setShowPaymentGate(false);
          setFormData(prev => ({ ...prev, nisn: submittedCandidate.nisn }));
          setSuccessData(data.data);
          setIsSuccess(true);
          fetchPublicApplicants?.();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Konfirmasi Gagal',
            text: "Gagal mengonfirmasi pembayaran: " + data.message,
            confirmButtonColor: '#3b82f6',
            customClass: {
              popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
              confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
              title: 'text-base font-extrabold text-slate-850 dark:text-white'
            }
          });
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: err.message,
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900',
            confirmButton: 'rounded-2xl px-6 py-2.5 text-xs uppercase font-extrabold tracking-wider',
            title: 'text-base font-extrabold text-slate-850 dark:text-white'
          }
        });
      } finally {
        setIsSubmittingReceipt(false);
      }
    };

    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-10">
        {/* Background Glowing Blobs */}
        <div className="bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          <div className="bg-glow bg-glow-3"></div>
        </div>
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-6 md:p-10 lg:p-12 max-w-7xl w-full relative z-10 animate-in fade-in zoom-in duration-300">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Grid Layout: Left Side (Billing Summary), Right Side (Payment Options) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                        {/* Left Side: Summary Panel (Col Span 4) */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-background/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-700/50 dark:border-slate-850 rounded-[2rem] p-6 relative overflow-hidden">
              <div className="space-y-6">
                
                {/* Profil Calon Siswa */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-800">
                  <div className="w-16 h-16 bg-primary dark:bg-blue-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg ring-4 ring-primary/10">
                    <User className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-tight">{submittedCandidate?.nama}</h4>
                  <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 mt-1">NISN: {submittedCandidate?.nisn}</p>
                </div>

                {/* Stepper Vertikal */}
                <div className="space-y-4 py-4">
                  {/* Langkah 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center border border-emerald-200 dark:border-emerald-900 shadow-sm shrink-0">
                      <Check size={14} className="stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Informasi Siswa</span>
                  </div>

                  {/* Langkah 2 */}
                  <div className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-2xl bg-primary/5 dark:bg-blue-950/45 border border-blue-100/50 dark:border-blue-900/40">
                    <div className="w-8 h-8 rounded-xl bg-primary dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                      <CreditCard size={14} />
                    </div>
                    <span className="text-xs font-black text-primary dark:text-sky-400">Metode Pembayaran</span>
                  </div>

                  {/* Langkah 3 & Seterusnya secara Dinamis */}
                  {activePaymentMethod === "tu" ? (
                    <>
                      {/* Langkah 3 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                          <School size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-450 dark:text-slate-500 dark:text-slate-400">Datang ke Sekolah</span>
                      </div>

                      {/* Langkah 4 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                          <Clock size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-450 dark:text-slate-500 dark:text-slate-400">Menunggu Verifikasi</span>
                      </div>

                      {/* Langkah 5 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-450 dark:text-slate-500 dark:text-slate-400">Selesai</span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Langkah 3 */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                          manualReceiptBase64 
                            ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 text-emerald-500"
                            : "bg-background dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400"
                        }`}>
                          {manualReceiptBase64 ? <Check size={14} className="stroke-[3]" /> : <Upload size={14} />}
                        </div>
                        <span className={`text-xs font-bold ${
                          manualReceiptBase64 
                            ? "text-emerald-500 dark:text-emerald-400" 
                            : "text-slate-400 dark:text-slate-500 dark:text-slate-400"
                        }`}>
                          Upload Bukti
                        </span>
                      </div>

                      {/* Langkah 4 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                          <Clock size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400">Selesai</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Box Info Pendaftaran */}
                <div className="mt-4 p-4 rounded-2xl bg-primary/5/50 dark:bg-blue-950/20 border border-blue-100/35 dark:border-blue-900/30">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-sky-400 block mb-3">
                    Info Pendaftaran
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).bg}`}>
                      {getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoPath ? (
                        <img 
                          src={getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoPath} 
                          alt={getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoText} 
                          className="w-7 h-7 object-contain"
                          onError={(e: any) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).icon
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black text-slate-450 uppercase tracking-wider">Jurusan</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-white truncate">
                        {submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1 || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Bantuan Pembayaran */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50 dark:border-slate-800/80">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB%20SMK%20Taruna%20Bhakti,%20saya%20butuh%20bantuan%20terkait%20pembayaran..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-blue-650 dark:text-sky-400 font-extrabold text-xs hover:bg-background dark:hover:bg-slate-850 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-700 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <HelpCircle size={14} />
                  <span>Bantuan Pembayaran</span>
                </a>
              </div>
            </div>

            {/* Right Side: Payment Form Selection (Col Span 8) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="text-left space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                
                {/* Pengantar Formal */}
                <div className="space-y-1 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/10 p-4 rounded-2xl border-l-4 border-primary">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                    Penyelesaian Pembayaran Formulir
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                    Harap selesaikan pembayaran biaya pendaftaran untuk melanjutkan proses verifikasi dokumen administrasi Anda di SMK Taruna Bhakti.
                  </p>
                </div>

                {/* Billing Summary Box */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
                  <div className="absolute right-6 top-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <Sparkles size={120} className="text-primary" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 dark:text-slate-400">Jumlah Tagihan</span>
                      <h3 className="text-2xl font-black text-primary dark:text-sky-400 mt-0.5">
                        Rp {regCost.toLocaleString("id-ID")}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 bg-primary/5/50 dark:bg-blue-950/20 border border-blue-100/35 dark:border-blue-900/30 px-4 py-2 rounded-2xl shrink-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).bg}`}>
                        {getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoPath ? (
                          <img 
                            src={getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoPath} 
                            alt={getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).logoText} 
                            className="w-5 h-5 object-contain"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          getMajorDetails(submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1).icon
                        )}
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-455 uppercase tracking-widest block leading-none">Pilihan Jurusan</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white uppercase">
                          {submittedCandidate?.jurusan_1 || submittedCandidate?.jurusan1 || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-600 dark:text-slate-350">
                    <div className="flex justify-between items-center bg-background/50 dark:bg-slate-950/10 px-4 py-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
                      <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400">Nama Lengkap:</span>
                      <span className="text-slate-850 dark:text-white uppercase truncate max-w-[150px]">{submittedCandidate?.nama}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background/50 dark:bg-slate-950/10 px-4 py-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
                      <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400">NISN Pendaftar:</span>
                      <span className="text-slate-850 dark:text-white font-mono tracking-wider">{submittedCandidate?.nisn}</span>
                    </div>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-700/50 dark:border-slate-850 rounded-2xl max-w-md">
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod("transfer")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activePaymentMethod === "transfer"
                        ? "bg-white dark:bg-[#0f172a] text-blue-650 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-slate-700/40 dark:border-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-white dark:hover:text-slate-250"
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Transfer Bank (Online)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod("tu")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activePaymentMethod === "tu"
                        ? "bg-white dark:bg-[#0f172a] text-blue-650 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-slate-700/40 dark:border-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-white dark:hover:text-slate-250"
                    }`}
                  >
                    <Building size={14} />
                    <span>Bayar di TU (Offline)</span>
                  </button>
                </div>

                {activePaymentMethod === "transfer" ? (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 dark:text-slate-400 mb-2">
                        Langkah Pembayaran Transfer Bank
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                        Silakan lakukan transfer ke rekening resmi sekolah berikut sebesar biaya pendaftaran, kemudian unggah foto/file bukti transfer Anda.
                      </p>
                    </div>

                    {/* Warning Limit Pembayaran 24 Jam */}
                    <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-250/50 dark:border-amber-900/40 rounded-2xl p-4.5 flex items-start gap-3 text-amber-800 dark:text-amber-300">
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <div className="text-[11px] font-bold leading-normal">
                        <p className="font-black uppercase tracking-wider mb-0.5">PENTING: Batas Waktu Pembayaran 24 Jam!</p>
                        Harap lakukan transfer dan unggah bukti pembayaran dalam waktu 24 jam. Jika melewati batas waktu tersebut, pendaftaran Anda akan otomatis dinyatakan <span className="text-red-500 font-extrabold">Gugur</span> oleh sistem.
                      </div>
                    </div>

                    {/* Premium Bank Cards List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                      {bankConfigList.map((bank, index) => {
                        return (
                          <div 
                            key={index} 
                            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl border border-white/10 w-full transition-all duration-300 hover:scale-[1.02]"
                          >
                            {/* Elemen Dekoratif */}
                            <div className="absolute right-[-10%] top-[-20%] w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-2xl pointer-events-none"></div>
                            
                            {/* Header Kartu */}
                            <div className="flex justify-between items-start mb-6">
                              <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Pilihan #{index + 1}</span>
                                <h4 className="text-sm md:text-base font-black tracking-wider uppercase text-slate-100">{bank.bankName || "BANK TRANSFER"}</h4>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-8 h-5 rounded bg-amber-400/80 border border-amber-300/35 relative overflow-hidden flex items-center justify-center">
                                  <div className="absolute inset-x-1 inset-y-0.5 border border-slate-900/10 grid grid-cols-3 gap-0.5 opacity-40">
                                    <div className="border-r border-b border-slate-900/20"></div>
                                    <div className="border-r border-b border-slate-900/20"></div>
                                    <div className="border-b border-slate-900/20"></div>
                                    <div className="border-r border-slate-900/20"></div>
                                    <div className="border-r border-slate-900/20"></div>
                                    <div></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Nomor Rekening */}
                            <div className="space-y-1 mb-6">
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400/70">Nomor Rekening</span>
                              <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#0f172a]/5 border border-white/10 rounded-2xl py-2 px-3 backdrop-blur-sm">
                                <span className="font-mono text-xs md:text-sm font-black tracking-wider text-slate-100 select-all">
                                  {bank.accountNumber || "157-00-0174092-2"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(bank.accountNumber || "157-00-0174092-2")}
                                  className="p-1.5 bg-white dark:bg-[#0f172a]/10 hover:bg-white dark:bg-[#0f172a]/20 border border-white/15 text-slate-350 hover:text-white rounded-lg transition duration-150 active:scale-95 cursor-pointer"
                                  title="Salin Nomor Rekening"
                                >
                                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                </button>
                              </div>
                            </div>

                            {/* Footer Kartu */}
                            <div className="flex justify-between items-end">
                              <div className="space-y-0.5">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400/70">Atas Nama (A.N.)</span>
                                <p className="text-[10px] font-extrabold tracking-wide uppercase text-slate-200">
                                  {bank.accountHolder || "YAYASAN TARUNA BHAKTI"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Upload Receipt Section */}
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Unggah Bukti Transfer Pembayaran
                      </label>
                      
                      {/* File Upload Zone / Area */}
                      {!manualReceiptBase64 ? (
                        <div className="border-2 border-dashed border-slate-250 dark:border-slate-800 hover:border-primary dark:hover:border-primary rounded-[1.5rem] py-10 px-6 text-center transition bg-background/20 dark:bg-slate-950/5 relative group cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleReceiptFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex flex-col items-center gap-2 pointer-events-none transition-transform duration-200 group-hover:scale-102">
                            <div className="w-12 h-12 rounded-full bg-blue-55 dark:bg-slate-800/80 flex items-center justify-center text-blue-505 border border-blue-100 dark:border-slate-700/50 mb-1">
                              <Upload size={22} className="animate-pulse" />
                            </div>
                            <p className="text-xs md:text-sm font-black text-slate-755 dark:text-slate-200">
                              Pilih atau seret file bukti transfer
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold">
                              JPG, JPEG, PNG, atau PDF (Maksimal 3MB)
                            </p>
                          </div>
                        </div>
                      ) : (
                        
                        <div className="bg-background/80 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-700/60 dark:border-slate-850 rounded-[1.5rem] p-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-205 dark:border-slate-805 flex items-center justify-center text-blue-550 shrink-0 shadow-sm overflow-hidden relative">
                              {manualReceiptBase64.startsWith("data:application/pdf") ? (
                                <FileText size={32} className="text-red-500" />
                              ) : (
                                <img src={manualReceiptBase64.startsWith('data:image/') ? sanitizeUrl(manualReceiptBase64) : ''} alt="Preview Bukti Bayar" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="space-y-0.5 overflow-hidden w-full md:w-auto">
                              <p className="text-xs font-black text-slate-750 dark:text-slate-200 truncate max-w-[200px] md:max-w-[300px]">
                                {manualReceiptName}
                              </p>
                              <span className="text-[9px] font-black uppercase text-emerald-505 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/35 px-2 py-0.5 rounded-full inline-block">
                                File Siap Diunggah
                              </span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setManualReceiptBase64("");
                              setManualReceiptName("");
                            }}
                            className="px-4 py-2.5 bg-red-50 hover:bg-red-105 dark:bg-red-950/40 dark:hover:bg-red-900/30 border border-red-100/60 dark:border-red-900/35 text-red-655 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 w-full md:w-auto justify-center cursor-pointer"
                          >
                            <X size={12} />
                            Hapus File
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Submit Action Button */}
                    <button
                      onClick={() => handleConfirmOption("Transfer Manual", manualReceiptBase64)}
                      disabled={!manualReceiptBase64 || isSubmittingReceipt}
                      className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4 cursor-pointer"
                    >
                      {isSubmittingReceipt ? "Mengirim Bukti..." : "Kirim Bukti Pembayaran"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 dark:text-slate-400 mb-2">
                        Langkah Pembayaran Langsung ke TU Sekolah
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                        Silakan datang langsung ke loket Tata Usaha (TU) SMK Taruna Bhakti untuk melakukan pembayaran biaya pendaftaran formulir secara tunai.
                      </p>
                    </div>

                    {/* Himbauan dan Checklist Dokumen */}
                    <div className="bg-primary/5/60 dark:bg-blue-950/15 border border-blue-200/55 dark:border-blue-900/40 rounded-3xl p-6 text-left space-y-3.5 shadow-sm">
                      <div className="font-black text-xs uppercase tracking-wider text-blue-800 dark:text-sky-400 flex items-center gap-1.5 border-b border-blue-200/50 dark:border-blue-900/20 pb-2">
                        <FileText size={14} className="shrink-0" />
                        PENTING: BAWA BERKAS PERSYARATAN DI BAWAH INI!
                      </div>
                      <p className="text-[11px] text-slate-605 dark:text-slate-350 leading-relaxed font-bold">
                        Calon siswa diimbau untuk langsung membawa surat-surat/dokumen berikut saat melakukan pembayaran di sekolah guna mempercepat verifikasi fisik berkas:
                      </p>
                      <ul className="text-[11px] text-slate-700 dark:text-slate-200 font-bold space-y-1.5 pl-4.5 list-disc leading-normal">
                        <li>Fotokopi Kartu Keluarga (KK)</li>
                        <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
                        <li>Akta Kelahiran asli &amp; Fotokopi</li>
                        <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
                        <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
                      </ul>
                    </div>

                    {/* Submit Action Button */}
                    <button
                      onClick={() => handleConfirmOption("Bayar di Sekolah", "")}
                      disabled={isSubmittingReceipt}
                      className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs md:text-sm uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-lg disabled:opacity-40 disabled:pointer-events-none transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] mt-4 cursor-pointer"
                    >
                      {isSubmittingReceipt ? "Memproses..." : "Konfirmasi Pembayaran di TU & Daftar"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
          href={`/${(params as any)?.school_slug || ''}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#0f172a]/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-background dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleDark} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#0f172a]/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-background dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all" 
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-750" />}
        </button>
      </div>

      <div className="mb-10 text-center mt-12 relative z-10 flex flex-col items-center">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/5 dark:bg-blue-950/60 border border-blue-100/50 dark:border-blue-900/50 text-primary dark:text-sky-400 text-xs font-bold shadow-sm shadow-blue-500/5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-sky-400 animate-pulse"></span>
          Tahap {wizardStep} dari 14
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-2 drop-shadow-sm">Formulir Pendaftaran PPDB</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-[#0f172a]/60 dark:bg-slate-900/60 backdrop-blur-md inline-block px-4 py-1.5 rounded-full border border-white/60 dark:border-slate-800/60 shadow-sm mt-2">SMK Taruna Bhakti Tahun Ajaran 2026/2027</p>
      </div>

      <div className="bg-white dark:bg-[#0f172a] backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-6 md:p-10 max-w-4xl w-full relative z-10">

        {/* Desktop Stepper (hidden on mobile, shown on desktop) */}
        <div className="hidden md:flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-100 dark:bg-[#1e293b]/80 -translate-y-1/2 z-0 rounded-full"></div>
          <div
            className="absolute top-1/2 left-0 h-[3px] bg-primary dark:bg-blue-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{ width: `${((wizardStep - 1) / 13) * 100}%` }}
          ></div>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((step) => {
            const isCompleted = wizardStep > step;
            const isCurrent = wizardStep === step;
            return (
              <div
                key={step}
                onClick={() => goToStep(step)}
                title={`Tahap ${step}`}
                className={`rounded-full z-10 transition-all duration-500 ease-out cursor-pointer select-none relative ${
                  isCurrent
                    ? "w-7 h-7 bg-primary dark:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.65)] scale-125 ring-[6px] ring-primary/20"
                    : isCompleted
                      ? "w-4.5 h-4.5 bg-primary dark:bg-blue-500 hover:bg-primary hover:bg-primary/90 ring-[4px] ring-primary/10"
                      : "w-4 h-4 bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-800 hover:border-primary"
                }`}
              >
                {/* Clean indicator dot for active step to look premium */}
                {isCurrent && (
                  <span className="absolute inset-1.5 bg-white dark:bg-[#0f172a] rounded-full animate-pulse"></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper (only visible on mobile, hidden on desktop) */}
        <div className="block md:hidden mb-8 bg-background dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-black uppercase text-primary dark:text-blue-500 tracking-wider">
              Tahap {wizardStep} dari 14
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {getStepLabel(wizardStep)}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary dark:bg-blue-550 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(wizardStep / 14) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: PERSONAL DETAILS */}
        {wizardStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 1: Data Pribadi Siswa</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Masukkan informasi dasar sesuai dengan Kartu Keluarga / Akta Kelahiran.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                <input type="text" name="nama" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Sesuai Ijazah" value={formData.nama} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Jenis Kelamin</label>
                <select name="jenisKelamin" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.jenisKelamin} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">NISN (10 Digit)</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="nisn" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Misal: 0081234567" value={formData.nisn} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">NIK (16 Digit)</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="nik" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Sesuai KK" value={formData.nik} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Tempat & Tanggal Lahir</label>
              <div className="flex gap-2">
                <input type="text" name="tempatLahir" className="w-1/2 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Tempat" value={formData.tempatLahir} onChange={handleInputChange} />
                <input type="date" name="tglLahir" className="w-1/2 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.tglLahir} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Agama</label>
                <select name="agama" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.agama} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Kewarganegaraan</label>
                <select name="kewarganegaraan" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.kewarganegaraan} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="WNI">Warga Negara Indonesia (WNI)</option>
                  <option value="WNA">Warga Negara Asing (WNA)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TEMPAT TINGGAL */}
        {wizardStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 2: Data Tempat Tinggal</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Informasi alamat tempat tinggal dan kontak yang dapat dihubungi.</p>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Alamat Rumah (Jalan, No. Rumah)</label>
              <textarea name="alamat" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" rows={2} placeholder="Contoh: Jl. Pekapuran No. 10" value={formData.alamat} onChange={handleInputChange}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">RT / RW</label>
                <input type="text" name="rtRw" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 002/005" value={formData.rtRw} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Kode Pos</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="kodePos" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 16453" value={formData.kodePos} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Kelurahan</label>
                <input type="text" name="kelurahan" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: Curug" value={formData.kelurahan} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Kecamatan</label>
                <input type="text" name="kecamatan" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: Cimanggis" value={formData.kecamatan} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Nomor Telepon / HP Siswa</label>
                <input type="text" inputMode="tel" name="whatsapp" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 081234567890" value={formData.whatsapp} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Nomor Telepon Orang Tua (Ayah/Ibu/Wali)</label>
                <input type="text" inputMode="tel" name="teleponOrtu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Nomor yang mudah dihubungi" value={formData.teleponOrtu} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">E-mail Pribadi Siswa</label>
                <input type="email" name="email" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="nama@email.com" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Tinggal Bersama dengan</label>
                <select name="tinggalDengan" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.tinggalDengan} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Saudara">Saudara</option>
                  <option value="Kos/Asrama">Kos / Asrama</option>
                  <option value="Wali">Wali</option>
                  <option value="Panti Asuhan">Panti Asuhan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Moda Transportasi</label>
                <select name="transportasi" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.transportasi} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="Jalan Kaki">Jalan Kaki</option>
                  <option value="Angkutan Umum">Angkutan Umum</option>
                  <option value="Mobil Antar Jemput">Mobil Antar Jemput</option>
                  <option value="Kereta Api">Kereta Api</option>
                  <option value="Mobil Pribadi">Mobil Pribadi</option>
                  <option value="Sepeda Motor">Sepeda Motor</option>
                  <option value="Sepeda">Sepeda</option>
                  <option value="Ojek">Ojek</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DATA PERIODIK */}
        {wizardStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 3: Data Rincian (Data Periodik)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Mohon isi data periodik fisik dan perjalanan Anda ke sekolah.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Tinggi Badan (Cm)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="tinggiBadan" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 165" value={formData.tinggiBadan} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Cm</span>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Berat Badan (Kg)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="beratBadan" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 55" value={formData.beratBadan} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Kg</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Jarak Rumah ke Sekolah</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="jarakSekolah" value="Kurang dari 1 km" checked={formData.jarakSekolah === "Kurang dari 1 km"} onChange={handleInputChange} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Kurang dari 1 Km</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="jarakSekolah" value="Lebih dari 1 km" checked={formData.jarakSekolah === "Lebih dari 1 km"} onChange={handleInputChange} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Lebih dari 1 Km</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  {formData.jarakSekolah === "Kurang dari 1 km" ? "Sebutkan Jarak Tepatnya (Meter)" : "Sebutkan Jarak Tepatnya (Km)"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="jarakKm"
                    className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder={formData.jarakSekolah === "Kurang dari 1 km" ? "Contoh: 500" : "Contoh: 3"}
                    value={formData.jarakKm}
                    onChange={handleInputChange}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    {formData.jarakSekolah === "Kurang dari 1 km" ? "Meter" : "Km"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Waktu Tempuh ke Sekolah</label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="waktuJam" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="0" value={formData.waktuJam} onChange={handleInputChange} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Jam</span>
                  </div>
                  <span className="text-slate-400 font-bold">:</span>
                  <div className="relative flex-1">
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="waktuMenit" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="25" value={formData.waktuMenit} onChange={handleInputChange} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Menit</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Jumlah Saudara Kandung</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="jumlahSaudara" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl pl-4 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 2" value={formData.jumlahSaudara} onChange={handleInputChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Orang</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: KESEHATAN & BERKEBUTUHAN KHUSUS */}
        {wizardStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 4: Data Kesehatan & Berkebutuhan Khusus</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Mohon isi data golongan darah, riwayat penyakit, serta kebutuhan khusus jika ada.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Golongan Darah</label>
                <select name="golonganDarah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.golonganDarah} onChange={handleInputChange}>
                  <option value="">-- Pilih --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Penyakit Yang Pernah Diderita</label>
                <input type="text" name="penyakitDiderita" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Misal: Asma, TBC, dll (kosongkan jika tidak ada)" value={formData.penyakitDiderita} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">Berkebutuhan Khusus / Kelainan</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Netra",
                  "Rungu",
                  "Grahita Sedang",
                  "Grahita Ringan",
                  "Laras",
                  "Wicara",
                  "Daksa Sedang",
                  "Daksa Ringan",
                  "Autis",
                  "Indigo",
                  "Hyper Aktif",
                  "Bakat Istimewa",
                  "Cerdas Istimewa",
                  "Down Syndrome",
                  "Narkoba",
                  "Kesulitan Belajar",
                  "Lainnya"
                ].map((option) => {
                  const isChecked = formData.kebutuhanKhusus?.includes(option) || false;
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked
                        ? "bg-primary/5 border-blue-300 text-primary shadow-sm"
                        : "bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-background hover:border-slate-400 shadow-sm"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(option)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 accent-blue-600"
                      />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DATA PRESTASI */}
        {wizardStep === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 5: Data Prestasi (Opsional)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Isi data prestasi yang pernah diraih. Klik &quot;Lewati&quot; jika tidak ada.</p>

            <div className="form-group mb-5">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">1. Jenis Prestasi</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Sains", "Seni", "Olahraga", "Lainnya"].map((option) => {
                  const isChecked = formData.jenisPrestasi?.includes(option) || false;
                  return (
                    <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-primary/5 border-blue-300 text-primary shadow-sm" : "bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-background hover:border-slate-400 shadow-sm"
                      }`}>
                      <input type="checkbox" checked={isChecked} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                        onChange={() => setFormData(prev => {
                          const cur = prev.jenisPrestasi || [];
                          return { ...prev, jenisPrestasi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                        })}
                        />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group mb-5">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">2. Tingkat</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Sekolah", "Kecamatan", "Kab/Kota", "Propinsi", "Nasional", "Internasional", "Lainnya"].map((option) => {
                  const isChecked = formData.tingkatPrestasi?.includes(option) || false;
                  return (
                    <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-primary/5 border-blue-300 text-primary shadow-sm" : "bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-background hover:border-slate-400 shadow-sm"
                      }`}>
                      <input type="checkbox" checked={isChecked} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                        onChange={() => setFormData(prev => {
                          const cur = prev.tingkatPrestasi || [];
                          return { ...prev, tingkatPrestasi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                        })}
                        />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">3. Uraian Prestasi</label>
                <input type="text" name="uraianPrestasi" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Misal: Juara 1 Olimpiade Matematika" value={formData.uraianPrestasi} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">4. Tahun Prestasi</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="tahunPrestasi" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 2024" value={formData.tahunPrestasi} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">5. Penyelenggara</label>
              <input type="text" name="penyelenggara" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Misal: Dinas Pendidikan Kota Depok" value={formData.penyelenggara} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">6. Bukti Prestasi</label>
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
                <div className="shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700 mb-1">Himbauan Sertifikat Prestasi</p>
                  <p className="text-xs text-amber-600 leading-relaxed">
                    Jika Anda memiliki sertifikat, piagam, atau bukti prestasi lainnya, harap <strong>membawa dokumen fisik asli ke sekolah</strong> pada saat daftar ulang. Dokumen akan diverifikasi oleh panitia PPDB secara langsung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: DATA BEASISWA */}
        {wizardStep === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 6: Data Beasiswa (Opsional)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Isi data beasiswa yang pernah atau sedang diterima. Klik &quot;Lewati&quot; jika tidak ada.</p>

            <div className="form-group mb-5">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">1. Jenis Beasiswa</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Prestasi", "Kemiskinan", "Pendidikan", "Unggulan", "Lainnya"].map((option) => {
                  const isChecked = formData.jenisBeasiswa?.includes(option) || false;
                  return (
                    <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-primary/5 border-blue-300 text-primary shadow-sm" : "bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-background hover:border-slate-400 shadow-sm"
                      }`}>
                      <input type="checkbox" checked={isChecked} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                        onChange={() => setFormData(prev => {
                          const cur = prev.jenisBeasiswa || [];
                          return { ...prev, jenisBeasiswa: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                        })}
                        />
                      <span className="text-xs font-bold">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Uraian Beasiswa</label>
              <input type="text" name="uraianBeasiswa" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Misal: Beasiswa Prestasi dari Pemkot Depok" value={formData.uraianBeasiswa} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">3. Tahun Mulai Menerima Beasiswa</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="tahunMulaiBeasiswa" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 2022" value={formData.tahunMulaiBeasiswa} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">4. Tahun Selesai Menerima Beasiswa</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="tahunSelesaiBeasiswa" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 2024" value={formData.tahunSelesaiBeasiswa} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: PENDIDIKAN & JURUSAN */}
        {wizardStep === 7 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 7: Data Rincian (Data Pendidikan)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Data riwayat pendidikan, status pindahan, dan peminatan kompetensi.</p>

            <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">G</span>
                1. Pendidikan Sebelumnya
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">a. Lulusan dari SMP/MTs</label>
                  <input type="text" name="sekolahAsal" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Nama sekolah asal" value={formData.sekolahAsal} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">b. Tanggal Lulus dari SMP/MTs</label>
                  <input type="date" name="tglLulus" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.tglLulus} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">c. Nomor Seri Ijazah SMP/MTs</label>
                  <input type="text" name="noIjazah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noIjazah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">d. Nomor Seri SKHUN SMP/MTs</label>
                  <input type="text" name="noSKHUN" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noSKHUN} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">e. Nomor Peserta UN SMP/MTs</label>
                  <input type="text" name="noPesertaUN" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Kosongkan jika tidak ada" value={formData.noPesertaUN} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">f. Lama Belajar (Tahun)</label>
                  <div className="flex items-center gap-3">
                    <input type="number" name="lamaBelajar" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: 3" value={formData.lamaBelajar} onChange={handleInputChange} />
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Tahun</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Pindahan (Hanya Untuk Murid Pindahan)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">a. Dari SMP/MTs</label>
                  <input type="text" name="pindahanDari" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Kosongkan jika bukan pindahan" value={formData.pindahanDari} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">b. Alasan Pindah Sekolah</label>
                  <input type="text" name="alasanPindah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Opsional" value={formData.alasanPindah} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                Diterima di Sekolah Ini
              </h4>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">a. Di Tingkat/Kelas</label>
                <div className="flex flex-wrap gap-3">
                  {["X (Sepuluh)", "XI (Sebelas)", "XII (Dua Belas)"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.diterimaKelas === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-[#1e293b]"
                      }`}>
                      <input
                        type="radio"
                        name="diterimaKelas"
                        value={option}
                        checked={formData.diterimaKelas === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-slate-300 dark:border-slate-700 focus:ring-primary"
                      />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">b. Program Keahlian</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {majors.map((major) => {
                    const option = `${major.title} (${major.code})`;
                    const majorDetails = getMajorDetails(major.title || major.code);
                    
                    let isFull = false;
                    if (kuotaData) {
                      const k = kuotaData.find((k: any) => k.key === major.title);
                      if (k && k.target > 0) {
                        isFull = k.jumlah >= k.target;
                      }
                    }

                    return (
                      <label key={option} className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                        isFull
                          ? 'bg-slate-100 dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed grayscale'
                          : formData.jurusan1 === option
                          ? `${majorDetails.bg} border-current ${majorDetails.textColor} shadow-md cursor-pointer ring-2 ring-current/20`
                          : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-background hover:border-slate-300 dark:border-slate-700 cursor-pointer'
                      }`}>
                        <input
                          type="radio"
                          name="jurusan1"
                          value={option}
                          checked={formData.jurusan1 === option && !isFull}
                          onChange={(e) => {
                            if (!isFull) handleInputChange(e);
                          }}
                          disabled={isFull}
                          className="w-4 h-4 text-primary border-slate-300 dark:border-slate-700 focus:ring-primary disabled:opacity-50 shrink-0"
                        />
                        {/* Logo jurusan */}
                        {majorDetails.logoPath ? (
                          <img
                            src={sanitizeSrc((major as any).logo) || majorDetails.logoPath}
                            alt={major.code}
                            className="w-9 h-9 object-contain rounded-lg shrink-0"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${majorDetails.bg}`}>
                            {majorDetails.icon}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-extrabold leading-tight">{option}</span>
                          <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                            isFull ? 'text-red-500' : majorDetails.textColor
                          }`}>
                            {isFull ? 'KUOTA PENUH' : major.code}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: DATA AYAH KANDUNG */}
        {wizardStep === 8 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 8: Data Ayah Kandung</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Isi identitas lengkap ayah kandung sesuai dokumen resmi (KK/KTP).</p>

            <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">H</span>
                Data Ayah Kandung
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">1. Nama Lengkap</label>
                <input type="text" name="namaAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Sesuai KTP/KK" value={formData.namaAyah} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Tempat Lahir</label>
                  <input type="text" name="tempatLahirAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.tempatLahirAyah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Tanggal Lahir</label>
                  <input type="date" name="tglLahirAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.tglLahirAyah} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">3. Agama</label>
                  <select name="agamaAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.agamaAyah} onChange={handleInputChange}>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">4. Kewarganegaraan</label>
                  <select name="kewarganegaraanAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.kewarganegaraanAyah} onChange={handleInputChange}>
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">5. Pendidikan Terakhir</label>
                  <input type="text" name="pendidikanAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="SD/SMP/SMA/S1" value={formData.pendidikanAyah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">6. Pekerjaan</label>
                  <input type="text" name="pekerjaanAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Pekerjaan" value={formData.pekerjaanAyah} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">7. Penghasilan Per Bulan</label>
                  <select name="penghasilanAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.penghasilanAyah} onChange={handleInputChange}>
                    <option value="">-- Pilih --</option>
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">8. Alamat Rumah</label>
                <input type="text" name="alamatAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-3" placeholder="Nama Jalan / Perumahan / Kampung" value={formData.alamatAyah} onChange={handleInputChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">RT/RW</label>
                    <input type="text" name="rtrwAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.rtrwAyah} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kelurahan</label>
                    <input type="text" name="kelurahanAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kelurahanAyah} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kecamatan</label>
                    <input type="text" name="kecamatanAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kecamatanAyah} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kode Pos</label>
                    <input type="text" name="kodePosAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kodePosAyah} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">9. Status Hidup/Meninggal Dunia</label>
                <select name="statusAyah" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.statusAyah} onChange={handleInputChange}>
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: DATA IBU KANDUNG */}
        {wizardStep === 9 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 9: Data Ibu Kandung</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Isi identitas lengkap ibu kandung sesuai dokumen resmi (KK/KTP).</p>

            <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">I</span>
                Data Ibu Kandung
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">1. Nama Lengkap</label>
                <input type="text" name="namaIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Sesuai KTP/KK" value={formData.namaIbu} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Tempat Lahir</label>
                  <input type="text" name="tempatLahirIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.tempatLahirIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Tanggal Lahir</label>
                  <input type="date" name="tglLahirIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.tglLahirIbu} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">3. Agama</label>
                  <select name="agamaIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.agamaIbu} onChange={handleInputChange}>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">4. Kewarganegaraan</label>
                  <select name="kewarganegaraanIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.kewarganegaraanIbu} onChange={handleInputChange}>
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">5. Pendidikan Terakhir</label>
                  <input type="text" name="pendidikanIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="SD/SMP/SMA/S1" value={formData.pendidikanIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">6. Pekerjaan</label>
                  <input type="text" name="pekerjaanIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Pekerjaan" value={formData.pekerjaanIbu} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">7. Penghasilan Per Bulan</label>
                  <select name="penghasilanIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.penghasilanIbu} onChange={handleInputChange}>
                    <option value="">-- Pilih --</option>
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">8. Alamat Rumah</label>
                <input type="text" name="alamatIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-3" placeholder="Nama Jalan / Perumahan / Kampung" value={formData.alamatIbu} onChange={handleInputChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">RT/RW</label>
                    <input type="text" name="rtrwIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.rtrwIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kelurahan</label>
                    <input type="text" name="kelurahanIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kelurahanIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kecamatan</label>
                    <input type="text" name="kecamatanIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kecamatanIbu} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kode Pos</label>
                    <input type="text" name="kodePosIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kodePosIbu} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">9. Status Hidup/Meninggal Dunia</label>
                <select name="statusIbu" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.statusIbu} onChange={handleInputChange}>
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: DATA WALI PESERTA DIDIK */}
        {wizardStep === 10 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 10: Data Wali (Opsional)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Isi identitas lengkap wali murid (jika ada) sesuai dokumen resmi (KK/KTP).</p>

            <div className="p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">J</span>
                Data Wali Peserta Didik
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">1. Nama Lengkap</label>
                <input type="text" name="namaWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Kosongkan jika tidak ada wali" value={formData.namaWali} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Tempat Lahir</label>
                  <input type="text" name="tempatLahirWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.tempatLahirWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Tanggal Lahir</label>
                  <input type="date" name="tglLahirWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.tglLahirWali} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">3. Agama</label>
                  <select name="agamaWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.agamaWali} onChange={handleInputChange}>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">4. Kewarganegaraan</label>
                  <select name="kewarganegaraanWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.kewarganegaraanWali} onChange={handleInputChange}>
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">5. Pendidikan Terakhir</label>
                  <input type="text" name="pendidikanWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="SD/SMP/SMA/S1" value={formData.pendidikanWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">6. Pekerjaan</label>
                  <input type="text" name="pekerjaanWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Pekerjaan" value={formData.pekerjaanWali} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">7. Penghasilan Per Bulan</label>
                  <select name="penghasilanWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.penghasilanWali} onChange={handleInputChange}>
                    <option value="">-- Pilih --</option>
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">8. Alamat Rumah</label>
                <input type="text" name="alamatWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-3" placeholder="Nama Jalan / Perumahan / Kampung" value={formData.alamatWali} onChange={handleInputChange} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">RT/RW</label>
                    <input type="text" name="rtrwWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.rtrwWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kelurahan</label>
                    <input type="text" name="kelurahanWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kelurahanWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kecamatan</label>
                    <input type="text" name="kecamatanWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kecamatanWali} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kode Pos</label>
                    <input type="text" name="kodePosWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.kodePosWali} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">9. Status Hidup/Meninggal Dunia</label>
                <select name="statusWali" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.statusWali} onChange={handleInputChange}>
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 11: KEGEMARAN & MINAT (K, L) */}
        {wizardStep === 11 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 11: Data Kegemaran & Minat</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Isi data hobi, cita-cita, dan minat bakat siswa.</p>

            <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">K</span>
                Data Kegemaran Peserta Didik
              </h4>
              <div className="form-group mb-5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">1. Hobi</label>
                <div className="flex flex-wrap gap-3">
                  {["Olahraga", "Kesenian", "Membaca", "Menulis", "Travelling", "Lainnya"].map((option) => {
                    const isChecked = formData.hobi?.includes(option) || false;
                    return (
                      <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-primary/5 border-blue-400 text-primary shadow-sm" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-[#1e293b]"
                        }`}>
                        <input type="checkbox" checked={isChecked} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                          onChange={() => setFormData(prev => {
                            const cur = prev.hobi || [];
                            return { ...prev, hobi: cur.includes(option) ? cur.filter(i => i !== option) : [...cur, option] };
                          })}
                          />
                        <span className="text-xs font-bold">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">2. Cita-cita</label>
                <select name="citaCita" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" value={formData.citaCita} onChange={handleInputChange}>
                  <option value="">-- Pilih Cita-cita --</option>
                  <option value="PNS">PNS</option>
                  <option value="TNI/POLRI">TNI/POLRI</option>
                  <option value="Guru/Dosen">Guru/Dosen</option>
                  <option value="Dokter">Dokter</option>
                  <option value="Politikus">Politikus</option>
                  <option value="Wiraswasta">Wiraswasta</option>
                  <option value="Seni Lukis/Artis">Seni Lukis/Artis/Sejenisnya</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">L</span>
                Data Minat dan Kemampuan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">1. Nilai US (Teori)</label>
                  <input type="number" name="nilaiUSTeori" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.nilaiUSTeori} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Nilai US (Praktik)</label>
                  <input type="number" name="nilaiUSPraktik" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.nilaiUSPraktik} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Nilai Muatan Lokal</label>
                <input type="number" name="nilaiMuatanLokal" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" value={formData.nilaiMuatanLokal} onChange={handleInputChange} />
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">3. Memilih SMK Taruna Bhakti Karena</label>
                <div className="flex gap-4">
                  {["Diri Sendiri", "Orang Tua/Wali"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.alasanMemilih === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                      <input type="radio" name="alasanMemilih" value={option} checked={formData.alasanMemilih === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">4. Cita-cita Setelah Lulus SMK</label>
                <input type="text" name="citaCitaSetelahLulus" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: Kuliah / Bekerja di Industri" value={formData.citaCitaSetelahLulus} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">5. Pelajaran Yg Disenangi di SMP/MTs</label>
                  <input type="text" name="pelajaranDisenangi" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Contoh: Matematika" value={formData.pelajaranDisenangi} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Alasan Disenangi</label>
                  <input type="text" name="alasanDisenangi" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Alasan" value={formData.alasanDisenangi} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">6. Kesulitan Belajar di SMP/MTs</label>
                <input type="text" name="kesulitanBelajar" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Ada hambatan/kesulitan apa?" value={formData.kesulitanBelajar} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 12: BUDI PEKERTI & EKONOMI (M, N) */}
        {wizardStep === 12 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 12: Data Budi Pekerti & Ekonomi</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Pernyataan kepribadian serta data bantuan sosial (jika ada).</p>

            <div className="mb-6 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">M</span>
                Data Budi Pekerti
              </h4>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">1. Perkelahian antar Pelajar</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.perkelahian === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                      <input type="radio" name="perkelahian" value={option} checked={formData.perkelahian === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kalau Pernah Dimana dan Kapan :</span>
                  <input type="text" name="ketPerkelahian" className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:bg-slate-100 dark:bg-[#1e293b]" value={formData.ketPerkelahian} onChange={handleInputChange} disabled={formData.perkelahian !== "Pernah"} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">2. Obat Terlarang, Minuman Keras, Narkotika</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.narkoba === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                      <input type="radio" name="narkoba" value={option} checked={formData.narkoba === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kalau Pernah atau Masih, Berikan Alasannya :</span>
                  <input type="text" name="ketNarkoba" className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:bg-slate-100 dark:bg-[#1e293b]" value={formData.ketNarkoba} onChange={handleInputChange} disabled={formData.narkoba !== "Pernah"} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">3. Pelanggaran Tingkah Laku Sosial</label>
                <div className="flex gap-4 mb-2">
                  {["Pernah", "Tidak Pernah"].map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.pelanggaranLain === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                      <input type="radio" name="pelanggaranLain" value={option} checked={formData.pelanggaranLain === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bentuk Pelanggaran :</span>
                  <input type="text" name="ketPelanggaranLain" className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:bg-slate-100 dark:bg-[#1e293b]" value={formData.ketPelanggaranLain} onChange={handleInputChange} disabled={formData.pelanggaranLain !== "Pernah"} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">4. Apakah anda sanggup mentaati tata tertib yang berlaku di SMK Taruna Bhakti Depok ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiTaat === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}>
                        <input type="radio" name="janjiTaat" value={option} checked={formData.janjiTaat === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">5. Apakah anda sanggup dikenakan sangsi apabila melanggar tata tertib peraturan sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiSanksi === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}>
                        <input type="radio" name="janjiSanksi" value={option} checked={formData.janjiSanksi === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">6. Apakah Anda Sanggup Untuk Menjalin Keakraban dengan Sesama Rekan di Sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiAkrab === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}>
                        <input type="radio" name="janjiAkrab" value={option} checked={formData.janjiAkrab === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">7. Apakah anda sanggup belajar sungguh-sungguh ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiBelajar === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}>
                        <input type="radio" name="janjiBelajar" value={option} checked={formData.janjiBelajar === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">8. Apakah anda sanggup menjaga nama baik sekolah baik didalam maupun diluar sekolah ?</label>
                  <div className="flex gap-4">
                    {["Sanggup", "Tidak Sanggup"].map((option) => (
                      <label key={option} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.janjiNamaBaik === option ? "bg-primary/5 border-blue-400 text-primary" : "bg-background border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}>
                        <input type="radio" name="janjiNamaBaik" value={option} checked={formData.janjiNamaBaik === option} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">N</span>
                Data Ekonomi Keluarga
              </h4>

              <div className="space-y-6">
                <div className="form-group">
                  <div className="flex text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    <span className="mr-2">1.</span>
                    <div>
                      <p>Apakah Orang Tua Mempunyai / Memiliki /</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="w-[280px]">Penerima Kartu Perlindungan Sosial (KPS)</p>
                        <span>:</span>
                        <div className="flex gap-4 ml-2">
                          {["Ya", "Tidak"].map((option) => (
                            <label key={option} className="flex items-center gap-1.5 cursor-pointer">
                              <input type="radio" name="punyaKPS" value={option} checked={formData.punyaKPS === option} onChange={handleInputChange} className="w-3.5 h-3.5 text-primary" />
                              <span className="font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 ml-4 pl-1.5">
                    <div className="w-[280px]">
                      <p>Jika Ya, Sebutkan Nomor KPS-nya, dan</p>
                      <p>Lampirkan Fotocopy Kartu KPS-nya</p>
                    </div>
                    <span>:</span>
                    <div className="flex items-center gap-2 ml-2 flex-1">
                      <span>Nomor :</span>
                      <input type="text" name="noKPS" className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" value={formData.noKPS} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="flex text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    <span className="mr-2">2.</span>
                    <div>
                      <p>Apakah Orang Tua Mempunyai / Memiliki /</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="w-[280px]">Penerima Kartu Indonesia Pintar (KIP)</p>
                        <span>:</span>
                        <div className="flex gap-4 ml-2">
                          {["Ya", "Tidak"].map((option) => (
                            <label key={option} className="flex items-center gap-1.5 cursor-pointer">
                              <input type="radio" name="punyaKIP" value={option} checked={formData.punyaKIP === option} onChange={handleInputChange} className="w-3.5 h-3.5 text-primary" />
                              <span className="font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 ml-4 pl-1.5">
                    <div className="w-[280px]">
                      <p>Jika Ya, Sebutkan Nomor KIP-nya, dan</p>
                      <p>Lampirkan Fotocopy Kartu KIP-nya</p>
                    </div>
                    <span>:</span>
                    <div className="flex items-center gap-2 ml-2 flex-1">
                      <span>No :</span>
                      <input type="text" name="noKIP" className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" value={formData.noKIP} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 13: TINJAUAN & VERIFIKASI DATA MANDIRI */}
        {wizardStep === 13 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 text-left">
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 13: Tinjau & Verifikasi Data Anda</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                Silakan periksa kembali seluruh data yang telah Anda masukkan. Jika ada data yang tidak benar, klik tombol <strong>Ubah Data</strong> pada bagian terkait untuk mengubahnya lagi tanpa perlu menulis ulang dari awal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Identitas Diri */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
                <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <User size={16} className="text-blue-500" />
                    Identitas Diri
                  </h4>
                  <button type="button" onClick={() => goToStep(1)} className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Pencil size={12} />
                    <span>Ubah Data</span>
                  </button>
                </div>
                <div className="text-xs space-y-2.5 font-bold text-slate-650 dark:text-slate-350">
                  <div className="flex justify-between"><span className="text-slate-400">Nama Lengkap:</span><span className="text-slate-850 dark:text-white uppercase">{formData.nama || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">NISN:</span><span className="font-mono text-slate-850 dark:text-white">{formData.nisn || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">NIK:</span><span className="font-mono text-slate-850 dark:text-white">{formData.nik || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Tempat, Tgl Lahir:</span><span>{formData.tempatLahir || "-"}, {formData.tglLahir || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Jenis Kelamin:</span><span>{formData.jenisKelamin === "L" ? "Laki-laki" : formData.jenisKelamin === "P" ? "Perempuan" : "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Agama:</span><span>{formData.agama || "-"}</span></div>
                </div>
              </div>

              {/* Card 2: Alamat & Kontak */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
                <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <Home size={16} className="text-blue-500" />
                    Alamat &amp; Kontak
                  </h4>
                  <button type="button" onClick={() => goToStep(2)} className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Pencil size={12} />
                    <span>Ubah Data</span>
                  </button>
                </div>
                <div className="text-xs space-y-2.5 font-bold text-slate-655 dark:text-slate-350">
                  <div className="flex justify-between"><span className="text-slate-400">Alamat Rumah:</span><span className="text-right max-w-[180px] truncate">{formData.alamat || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">RT / RW:</span><span>{formData.rtRw || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Kelurahan:</span><span>{formData.kelurahan || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Kecamatan:</span><span>{formData.kecamatan || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">No. WhatsApp:</span><span className="font-mono">{formData.whatsapp || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">E-mail:</span><span>{formData.email || "-"}</span></div>
                </div>
              </div>

              {/* Card 3: Pendidikan & Peminatan */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
                <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <School size={16} className="text-blue-500" />
                    Pendidikan &amp; Jurusan
                  </h4>
                  <button type="button" onClick={() => goToStep(7)} className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Pencil size={12} />
                    <span>Ubah Data</span>
                  </button>
                </div>
                <div className="text-xs space-y-2.5 font-bold text-slate-655 dark:text-slate-350">
                  <div className="flex justify-between"><span className="text-slate-400">Sekolah Asal:</span><span className="uppercase">{formData.sekolahAsal || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Jurusan Utama:</span><span className="text-primary dark:text-sky-450 uppercase">{formData.jurusan1 || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Tanggal Lulus:</span><span>{formData.tglLulus || "-"}</span></div>
                </div>
              </div>

              {/* Card 4: Data Orang Tua / Wali */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
                <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    Keluarga &amp; Orang Tua
                  </h4>
                  <button type="button" onClick={() => goToStep(8)} className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Pencil size={12} />
                    <span>Ubah Data</span>
                  </button>
                </div>
                <div className="text-xs space-y-2.5 font-bold text-slate-655 dark:text-slate-350">
                  <div className="flex justify-between"><span className="text-slate-400">Nama Ayah:</span><span className="uppercase">{formData.namaAyah || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Nama Ibu:</span><span className="uppercase">{formData.namaIbu || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Nama Wali:</span><span className="uppercase">{formData.namaWali || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Telepon Orang Tua:</span><span className="font-mono">{formData.teleponOrtu || "-"}</span></div>
                </div>
              </div>

              {/* Card 5: Nilai US & Minat */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
                <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    Nilai &amp; Akademik
                  </h4>
                  <button type="button" onClick={() => goToStep(11)} className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Pencil size={12} />
                    <span>Ubah Data</span>
                  </button>
                </div>
                <div className="text-xs space-y-2.5 font-bold text-slate-655 dark:text-slate-350">
                  <div className="flex justify-between"><span className="text-slate-400">Nilai US Teori:</span><span className="font-mono">{formData.nilaiUSTeori || "0"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Nilai US Praktik:</span><span className="font-mono">{formData.nilaiUSPraktik || "0"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Nilai Muatan Lokal:</span><span className="font-mono">{formData.nilaiMuatanLokal || "0"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Cita-cita Lulus:</span><span>{formData.citaCitaSetelahLulus || "-"}</span></div>
                </div>
              </div>

              {/* Card 6: Kebribadian & Kebiasaan */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative group">
                <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <AlertCircle size={16} className="text-blue-500" />
                    Kedisiplinan &amp; Keuangan
                  </h4>
                  <button type="button" onClick={() => goToStep(12)} className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Pencil size={12} />
                    <span>Ubah Data</span>
                  </button>
                </div>
                <div className="text-xs space-y-2.5 font-bold text-slate-655 dark:text-slate-350">
                  <div className="flex justify-between"><span className="text-slate-400">Sanggup Taat Tata Tertib:</span><span>{formData.janjiTaat || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Sanggup Sanksi:</span><span>{formData.janjiSanksi || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Penerima KPS/KIP:</span><span>KPS: {formData.punyaKPS}, KIP: {formData.punyaKIP}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Penyakit Diderita:</span><span>{formData.penyakitDiderita || "-"}</span></div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 14: DEKLARASI & KONFIRMASI (NO UPLOADS) */}
        {wizardStep === 14 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Tahap 14: Berkas & Konfirmasi Pendaftaran</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              Konfirmasi kebenaran data pendaftaran Anda dan tinjau persyaratan berkas fisik.
            </p>

            {/* Premium Notice Box - Expanded and Amber Highlighted */}
            <div className="bg-amber-500/[0.07] dark:bg-amber-500/[0.03] border-2 border-amber-500/30 rounded-[2.5rem] p-8 md:p-10 mb-8 shadow-lg shadow-amber-500/[0.02]">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-500/20 animate-bounce">
                  <AlertCircle size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-amber-400 text-lg md:text-xl mb-2 tracking-tight">
                    PENTING: Informasi Verifikasi Berkas Fisik Calon Siswa
                  </h4>
                  <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed mb-6 font-semibold">
                    Anda <span className="text-amber-600 dark:text-amber-400 font-black underline underline-offset-4">tidak perlu mengunggah berkas digital</span> di dalam formulir online ini. Sebagai gantinya, silakan lengkapi dan bawa berkas fisik/fotokopi berikut ini langsung ke panitia PPDB di sekolah saat melakukan proses verifikasi langsung:
                  </p>
                  
                  {/* Grid of Documents */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Kartu Keluarga (KK)", desc: "1 Lembar Fotokopi Sah" },
                      { title: "KTP Orang Tua / Wali", desc: "1 Lembar Fotokopi (Kedua Orang Tua / Wali)" },
                      { title: "Akta Kelahiran", desc: "1 Lembar Fotokopi Sah" },
                      { title: "Pas Foto Berwarna (3x4)", desc: "2 Lembar (Latar Belakang Merah atau Biru)" },
                      { title: "SKL / Ijazah SMP Asal", desc: "1 Lembar Fotokopi (Bisa disusulkan jika belum lulus)" }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex gap-4 items-center p-4 rounded-3xl bg-white dark:bg-[#0f172a]/60 border border-slate-200 dark:border-slate-700/60 dark:border-slate-800/80 shadow-md shadow-slate-100/50 dark:shadow-none hover:border-amber-500/30 transition-all duration-300 hover:scale-[1.01]">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-450 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-500/20">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{doc.title}</p>
                          <p className="text-xs text-slate-450 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{doc.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="form-group">
              <label className="flex items-start gap-3.5 cursor-pointer p-5 rounded-2xl bg-background dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:bg-slate-100 dark:bg-[#1e293b]/60 dark:hover:bg-slate-900/40">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-blue-600 rounded border-slate-350 dark:border-slate-700 shrink-0 cursor-pointer"
                  checked={formData.deklarasi}
                  onChange={(e) => setFormData(prev => ({ ...prev, deklarasi: e.target.checked }))}
                />
                <span className="text-xs md:text-sm text-slate-650 dark:text-slate-350 leading-relaxed cursor-pointer font-medium">
                  <strong>Pernyataan Kebenaran Data:</strong> Saya menyatakan dengan sadar dan penuh tanggung jawab bahwa seluruh data yang saya isikan di dalam formulir pendaftaran online ini adalah benar, lengkap, dan sesuai dengan dokumen asli. Apabila di kemudian hari ditemukan ketidaksesuaian atau pemalsuan data, saya bersedia menerima sanksi administrasi termasuk pembatalan pendaftaran di SMK Taruna Bhakti.
                </span>
              </label>
              {!formData.deklarasi && (
                <p className="text-rose-500 text-xs mt-3 ml-2 font-bold animate-pulse flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Wajib menyetujui pernyataan kebenaran data untuk mengirim pendaftaran.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-6">
          {wizardStep > 1 ? (
            <button
              className="btn-nav-link px-4 py-2"
              onClick={prevStep}
            >
              Kembali
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3 items-center">
            {(wizardStep === 5 || wizardStep === 6) && (
              <button
                className="btn-secondary"
                onClick={nextStep}
              >
                Lewati
              </button>
            )}
            <button
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl px-7 py-3.5 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
