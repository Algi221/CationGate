"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import Swal from "sweetalert2";
import { uploadFileDirect, base64ToFile } from "@/utils/storage";
import { compressImage } from "@/utils/mediaCompressor";
import {
  AlurItem,
  MajorItem,
  PartnerItem,
  FaqItem,
  RevisionLog,
  BankConfigItem,
  FieldConfigItem,
  KelolaUITab
} from "../types";
import {
  DEFAULT_PARTNERS,
  DEFAULT_ALUR,
  DEFAULT_FAQ,
  DEFAULT_MAJORS,
  DEFAULT_FIELDS_CONFIG_UI,
  formatPhoneNumber
} from "../defaultData";

export function useKelolaUIState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams() as { school_slug?: string };
  const slug = params?.school_slug;

  const tabParam = searchParams.get("tab") as KelolaUITab | null;
  const [activeTab, setActiveTab] = useState<KelolaUITab>(tabParam || "hero");

  useEffect(() => {
    if (tabParam && ["hero", "majors", "alur", "form", "bank", "faq", "partners", "revisions"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const { isDemoMode, adminToken, ppdbTitle } = usePPDB();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [mounted, setMounted] = useState(false);

  const draftKey = `ppdb_ui_editor_draft_${slug || 'global'}`;

  // Form Fields State
  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolTitle, setSchoolTitle] = useState("");
  const [heroTitle, setHeroTitle] = useState("Penerimaan Siswa Baru");
  const [heroTitleSub, setHeroTitleSub] = useState("Portal PPDB");
  const [heroSubtitle, setHeroSubtitle] = useState("Platform pendaftaran peserta didik baru resmi.");
  const [phone, setPhone] = useState("+62218740756");
  const [email, setEmail] = useState("info@smktarunabhakti.sch.id");
  const [address, setAddress] = useState("Jl. Pekapuran RT 02 RW 06, Curug, Cimanggis, Kota Depok, Jawa Barat 16453");
  const [footerDesc, setFooterDesc] = useState("Pionir pendidikan kejuruan teknologi informasi di Kota Depok dengan sertifikasi internasional dan industri.");
  const [mapTitle, setMapTitle] = useState("Kunjungi Kampus SMK Taruna Bhakti");
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.055845577626!2d106.867407!3d-6.3844792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebaff005f277%3A0x9fcd41028665eea8!2sSMK%20Taruna%20Bhakti%20Depok!5e0!3m2!1sen!2sid!4v1683883446098!5m2!1sen!2sid");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [waAdmin, setWaAdmin] = useState("6281292244456");
  const [formGuideline, setFormGuideline] = useState("Silakan isi formulir pendaftaran calon siswa dengan lengkap dan benar. Berkas persyaratan wajib diunggah dalam format gambar (PNG/JPG) maksimal 2MB.");
  const [formFee, setFormFee] = useState("250000");
  const [isLandingPageActive, setIsLandingPageActive] = useState(true);

  // Collections State
  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);
  const [majorsList, setMajorsList] = useState<MajorItem[]>(DEFAULT_MAJORS);
  const [faqList, setFaqList] = useState<FaqItem[]>(DEFAULT_FAQ);
  const [faqTitle, setFaqTitle] = useState("Pertanyaan yang Sering Diajukan");
  const [faqSubtitle, setFaqSubtitle] = useState("Temukan jawaban cepat untuk kendala dan pertanyaan seputar proses pendaftaran.");
  const [partnersList, setPartnersList] = useState<PartnerItem[]>(DEFAULT_PARTNERS);
  const [bankConfigList, setBankConfigList] = useState<BankConfigItem[]>([
    { bankName: "Bank BJB", accountNumber: "0010203040506", accountHolder: "SMK Taruna Bhakti" }
  ]);
  const [fieldsConfigUI, setFieldsConfigUI] = useState<Record<string, FieldConfigItem>>(DEFAULT_FIELDS_CONFIG_UI);
  const [gelombangConfig, setGelombangConfig] = useState<{
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  }>({
    gelombang1: { start: "2026-01-01", end: "2026-04-30" },
    gelombang2: { start: "2026-05-01", end: "2026-07-15" }
  });

  const [g1Error, setG1Error] = useState<string | null>(null);
  const [g2Error, setG2Error] = useState<string | null>(null);

  // Modal & Edit State
  const [editingMajor, setEditingMajor] = useState<MajorItem | null>(null);
  const [isNewMajor, setIsNewMajor] = useState(false);
  const [revisions, setRevisions] = useState<RevisionLog[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [changeDescription, setChangeDescription] = useState("");
  const [dragActiveStates, setDragActiveStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    fetchCurrentConfig();
    fetchRevisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync draft to localStorage
  useEffect(() => {
    if (!mounted || loading) return;

    const draft = {
      ppdb_landing_active: isLandingPageActive,
      ppdb_hero_title: heroTitle,
      ppdb_hero_title_sub: heroTitleSub,
      ppdb_hero_subtitle: heroSubtitle,
      ppdb_phone: phone,
      ppdb_email: email,
      ppdb_address: address,
      ppdb_map_title: mapTitle,
      ppdb_map_url: mapUrl,
      ppdb_school_period: schoolPeriod,
      ppdb_wa_group_url: waGroupUrl,
      ppdb_wa_admin: waAdmin,
      ppdb_form_guideline: formGuideline,
      ppdb_form_fee: formFee,
      ppdb_gelombang_config: gelombangConfig,
      ppdb_bank_config: bankConfigList,
      ppdb_alur_config: alurList,
      ppdb_majors_config: majorsList,
      ppdb_faq_config: faqList,
      ppdb_faq_title: faqTitle,
      ppdb_faq_subtitle: faqSubtitle,
      ppdb_partners_config: partnersList,
      ppdb_logo_url: schoolLogo,
      ppdb_title: schoolTitle,
      ppdb_footer_desc: footerDesc,
    };

    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch (error) {
      console.warn("Gagal menyimpan draft ke localStorage:", error);
    }
  }, [
    mounted,
    loading,
    isLandingPageActive,
    heroTitle,
    heroTitleSub,
    heroSubtitle,
    phone,
    email,
    address,
    mapTitle,
    mapUrl,
    schoolPeriod,
    waGroupUrl,
    waAdmin,
    formGuideline,
    formFee,
    gelombangConfig,
    bankConfigList,
    alurList,
    majorsList,
    faqList,
    faqTitle,
    faqSubtitle,
    partnersList,
    schoolLogo,
    schoolTitle,
    footerDesc,
    draftKey,
  ]);

  const showToastMsg = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  async function fetchCurrentConfig() {
    try {
      setLoading(true);
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const url = slug ? `/api/config?school_slug=${slug}` : "/api/config";
      const res = await fetch(url, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      const json = await res.json();
      const config = (json.success && json.data) ? json.data : {};

      const savedDraft = localStorage.getItem(draftKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let draft: any = null;
      if (savedDraft) {
        try {
          draft = JSON.parse(savedDraft);
        } catch (_) {}
      }

      const activeConfig = draft ? { ...config, ...draft } : config;

      if (activeConfig.ppdb_hero_title) setHeroTitle(activeConfig.ppdb_hero_title);
      if (activeConfig.ppdb_hero_title_sub) setHeroTitleSub(activeConfig.ppdb_hero_title_sub);
      else if (!draft) setHeroTitleSub(`Portal PPDB ${ppdbTitle || 'Online'}`);

      if (activeConfig.ppdb_hero_subtitle) setHeroSubtitle(activeConfig.ppdb_hero_subtitle);
      if (activeConfig.ppdb_phone) setPhone(formatPhoneNumber(activeConfig.ppdb_phone));
      if (activeConfig.ppdb_email) setEmail(activeConfig.ppdb_email);
      if (activeConfig.ppdb_address) setAddress(activeConfig.ppdb_address);
      if (activeConfig.ppdb_map_title) setMapTitle(activeConfig.ppdb_map_title);
      if (activeConfig.ppdb_school_period) setSchoolPeriod(activeConfig.ppdb_school_period);
      if (activeConfig.ppdb_faq_title) setFaqTitle(activeConfig.ppdb_faq_title);
      if (activeConfig.ppdb_faq_subtitle) setFaqSubtitle(activeConfig.ppdb_faq_subtitle);
      if (activeConfig.ppdb_wa_group_url) setWaGroupUrl(activeConfig.ppdb_wa_group_url);
      if (activeConfig.ppdb_wa_admin) setWaAdmin(formatPhoneNumber(activeConfig.ppdb_wa_admin));
      if (activeConfig.ppdb_form_guideline) setFormGuideline(activeConfig.ppdb_form_guideline);
      if (activeConfig.ppdb_form_fee) setFormFee(activeConfig.ppdb_form_fee);
      if (activeConfig.ppdb_logo_url) setSchoolLogo(activeConfig.ppdb_logo_url);

      if (activeConfig.ppdb_title) setSchoolTitle(activeConfig.ppdb_title);
      if (activeConfig.ppdb_footer_desc) setFooterDesc(activeConfig.ppdb_footer_desc);
      else if (!draft) setSchoolTitle(`PPDB ${ppdbTitle || 'Sekolah'}`);

      if (activeConfig.ppdb_alur_config && Array.isArray(activeConfig.ppdb_alur_config)) {
        setAlurList(activeConfig.ppdb_alur_config);
      }
      if (activeConfig.ppdb_faq_config && Array.isArray(activeConfig.ppdb_faq_config)) {
        setFaqList(activeConfig.ppdb_faq_config);
      } else {
        setFaqList(DEFAULT_FAQ);
      }
      if (activeConfig.ppdb_partners_config && Array.isArray(activeConfig.ppdb_partners_config)) {
        setPartnersList(activeConfig.ppdb_partners_config);
      } else {
        setPartnersList(DEFAULT_PARTNERS);
      }
      if (activeConfig.ppdb_majors_config && Array.isArray(activeConfig.ppdb_majors_config)) {
        const dbMajors = activeConfig.ppdb_majors_config;
        const mergedMajors: MajorItem[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbMajors.forEach((dbMajor: any) => {
          const defMajor = DEFAULT_MAJORS.find(d => d.code === dbMajor.code);
          mergedMajors.push({
            code: dbMajor.code,
            title: dbMajor.title || "",
            desc: dbMajor.desc || "",
            color: dbMajor.color || (defMajor?.color || "#0066ff"),
            careers: Array.isArray(dbMajor.careers) ? dbMajor.careers : [],
            facilities: Array.isArray(dbMajor.facilities) ? dbMajor.facilities : [],
            logo: dbMajor.logo || "",
            banner: dbMajor.banner || "",
            video: dbMajor.video || "",
            gallery: Array.isArray(dbMajor.gallery) ? dbMajor.gallery : []
          });
        });
        setMajorsList(mergedMajors);
      }
      if (activeConfig.ppdb_gelombang_config) {
        setGelombangConfig(activeConfig.ppdb_gelombang_config);
      }
      if (activeConfig.ppdb_bank_config) {
        const bankData = activeConfig.ppdb_bank_config;
        if (Array.isArray(bankData)) {
          setBankConfigList(bankData);
        } else if (bankData && typeof bankData === "object") {
          setBankConfigList([bankData]);
        }
      }
      if (activeConfig.ppdb_landing_active !== undefined) {
        setIsLandingPageActive(activeConfig.ppdb_landing_active === true || activeConfig.ppdb_landing_active === "true");
      }
      if (activeConfig.ppdb_fields_config && typeof activeConfig.ppdb_fields_config === "object") {
        setFieldsConfigUI(prev => ({ ...prev, ...activeConfig.ppdb_fields_config }));
      }

      if (draft) {
        showToastMsg("Draf perubahan berhasil dipulihkan dari sesi sebelumnya.", "info");
      }
    } catch (e) {
      console.error("Gagal mengambil konfigurasi UI:", e);
      showToastMsg("Koneksi gagal, memuat konfigurasi cadangan.", "info");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ppdbTitle && ppdbTitle !== "PPDB SMK TB") {
      requestAnimationFrame(() => {
        setSchoolTitle(prev => prev === "Portal PPDB" || prev.startsWith("PPDB PPDB") ? `PPDB ${ppdbTitle}` : prev);
        setHeroTitleSub(prev => prev === "Portal PPDB Online" || prev.startsWith("Portal PPDB PPDB") ? `Portal PPDB ${ppdbTitle}` : prev);
      });
    }
  }, [ppdbTitle]);

  async function fetchRevisions() {
    try {
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const res = await fetch("/api/config/revisions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setRevisions(json.data);
      }
    } catch (e) {
      console.error("Gagal mengambil riwayat perubahan:", e);
    }
  }

  const handleDragState = (e: React.DragEvent, elementId: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates(prev => ({ ...prev, [elementId]: active }));
  };

  const processMediaFile = async (file: File, type: "logo" | "banner" | "video" | `gallery-${number}`) => {
    const isVideo = type === "video";
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    if (isVideo) {
      const allowedVideoExts = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi'];
      if (!file.type.startsWith("video/") && !allowedVideoExts.includes(fileExt)) {
        showToastMsg("Hanya berkas video (MP4/WebM/MOV/MKV) yang diperbolehkan.", "error");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        showToastMsg("Ukuran file video maksimal adalah 15MB.", "error");
        return;
      }
    } else {
      const allowedImgExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
      if (!file.type.startsWith("image/") && !allowedImgExts.includes(fileExt)) {
        showToastMsg("Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan.", "error");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        showToastMsg("Ukuran file gambar maksimal adalah 4MB.", "error");
        return;
      }
    }

    try {
      showToastMsg("Mengunggah media ke cloud...", "info");
      const publicUrl = await uploadFileDirect(file, `major_${type}`);

      if (editingMajor) {
        setEditingMajor(prev => {
          if (!prev) return null;
          if (type === "logo") return { ...prev, logo: publicUrl };
          if (type === "banner") return { ...prev, banner: publicUrl };
          if (type === "video") return { ...prev, video: publicUrl };
          if (type.startsWith("gallery-")) {
            const slotIdx = parseInt(type.split("-")[1]);
            const updatedGallery = [...prev.gallery];
            if (!updatedGallery[slotIdx]) updatedGallery[slotIdx] = { url: "", caption: "" };
            updatedGallery[slotIdx] = { ...updatedGallery[slotIdx], url: publicUrl };
            return { ...prev, gallery: updatedGallery };
          }
          return prev;
        });
      }
      showToastMsg("Media berhasil diunggah!", "success");
    } catch (err) {
      console.error(err);
      showToastMsg("Gagal mengunggah media.", "error");
    }
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!changeDescription.trim()) {
      showToastMsg("Deskripsi catatan wajib diisi.", "error");
      return;
    }

    try {
      setSaving(true);
      setShowConfirmModal(false);

      let finalMajors = [...majorsList];
      if (editingMajor) {
        if (isNewMajor) {
          const exists = finalMajors.some(m => m.code.toUpperCase() === editingMajor.code.toUpperCase());
          if (!exists) {
            finalMajors.push(editingMajor);
          } else {
            finalMajors = finalMajors.map(m => m.code === editingMajor.code ? editingMajor : m);
          }
          setIsNewMajor(false);
        } else {
          finalMajors = finalMajors.map(m => m.code === editingMajor.code ? editingMajor : m);
        }
        setMajorsList(finalMajors);
        setEditingMajor(null);
      }

      finalMajors = finalMajors.map(major => {
        if (major.gallery && Array.isArray(major.gallery)) {
          return {
            ...major,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            gallery: major.gallery.filter((g: any) => g && typeof g.url === "string" && g.url.trim().length > 0)
          };
        }
        return major;
      });

      const configsPayload = {
        ppdb_landing_active: isLandingPageActive,
        ppdb_hero_title: heroTitle,
        ppdb_hero_title_sub: heroTitleSub,
        ppdb_hero_subtitle: heroSubtitle,
        ppdb_phone: phone,
        ppdb_email: email,
        ppdb_address: address,
        ppdb_map_title: mapTitle,
        ppdb_map_url: mapUrl,
        ppdb_school_period: schoolPeriod,
        ppdb_wa_group_url: waGroupUrl,
        ppdb_wa_admin: waAdmin,
        ppdb_form_guideline: formGuideline,
        ppdb_form_fee: formFee,
        ppdb_alur_config: alurList,
        ppdb_majors_config: finalMajors,
        ppdb_faq_config: faqList,
        ppdb_faq_title: faqTitle,
        ppdb_faq_subtitle: faqSubtitle,
        ppdb_gelombang_config: gelombangConfig,
        ppdb_bank_config: bankConfigList,
        ppdb_partners_config: partnersList,
        ppdb_logo_url: schoolLogo,
        ppdb_title: schoolTitle,
        ppdb_footer_desc: footerDesc,
        ppdb_fields_config: fieldsConfigUI
      };

      const token = adminToken || localStorage.getItem("ppdb_admin_token");

      if (isDemoMode) {
        setLoading(false);
        Object.entries(configsPayload).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
          }
        });
        
        Swal.fire({
          icon: "success",
          title: "Berhasil Disimpan!",
          text: "Konfigurasi UI berhasil diperbarui (Demo Mode).",
          confirmButtonColor: "#2563eb",
        });
        return;
      }

      const res = await fetch("/api/config/save-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          configs: configsPayload,
          description: changeDescription.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        showToastMsg("Semua perubahan UI berhasil disimpan dan tercatat.");
        setChangeDescription("");
        localStorage.removeItem(draftKey);
        fetchCurrentConfig().catch(console.error);

        try {
          localStorage.setItem("ppdb_majors_config", JSON.stringify(finalMajors));
          localStorage.setItem("ppdb_alur_config", JSON.stringify(alurList));
          localStorage.setItem("ppdb_faq_config", JSON.stringify(faqList));
          localStorage.setItem("ppdb_faq_title", faqTitle);
          localStorage.setItem("ppdb_faq_subtitle", faqSubtitle);
          localStorage.setItem("ppdb_partners_config", JSON.stringify(partnersList));
          localStorage.setItem("ppdb_reg_cost", formFee);
          localStorage.setItem("ppdb_school_period", schoolPeriod);
          localStorage.setItem("ppdb_map_title", mapTitle);
          localStorage.setItem("ppdb_map_url", mapUrl);
          localStorage.setItem("ppdb_wa_group_url", waGroupUrl);
          localStorage.setItem("ppdb_wa_admin", waAdmin);
          localStorage.setItem("ppdb_bank_config", JSON.stringify(bankConfigList));
          localStorage.setItem("ppdb_gelombang_config", JSON.stringify(gelombangConfig));
          localStorage.setItem("ppdb_fields_config", JSON.stringify(fieldsConfigUI));
        } catch (storageErr) {
          console.warn("Storage sync bypassed.", storageErr);
        }

        await fetchRevisions();
      } else {
        showToastMsg(json.message || "Gagal menyimpan perubahan.", "error");
      }
    } catch (err: unknown) {
      console.error(err);
      showToastMsg("Terjadi kesalahan server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSchoolLogoChange = async (file: File) => {
    try {
      showToastMsg("Mengompresi logo...");
      const result = await compressImage(file, 400, 400, 0.85);

      showToastMsg("Mengunggah logo ke cloud...", "info");
      const compressedFile = base64ToFile(result.base64, file.name);
      const publicUrl = await uploadFileDirect(compressedFile, 'school_logo');

      setSchoolLogo(publicUrl);
      showToastMsg(`✨ Logo berhasil diunggah! (Ukuran berkurang ${result.reductionPercentage}%)`, "success");
    } catch (_e) {
      showToastMsg("Gagal memproses logo.", "error");
    }
  };

  const handleRestore = async (revId: string | number) => {
    if (!confirm(`Apakah Anda yakin ingin memulihkan semua konfigurasi UI ke versi riwayat #${revId}?`)) {
      return;
    }

    try {
      setSaving(true);
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const res = await fetch("/api/config/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ revisionId: revId })
      });

      const json = await res.json();
      if (json.success) {
        showToastMsg(`Sukses memulihkan tampilan ke versi #${revId}!`);
        localStorage.removeItem(draftKey);
        await fetchCurrentConfig();
        await fetchRevisions();
      } else {
        showToastMsg(json.message || "Gagal melakukan pemulihan.", "error");
      }
    } catch (err) {
      console.error(err);
      showToastMsg("Gagal menghubungi server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLandingPageStatus = async () => {
    const nextStatus = !isLandingPageActive;
    const statusText = nextStatus ? "DIBUKA (PUBLIK)" : "DITUTUP (DRAFT / MAINTENANCE)";

    Swal.fire({
      title: `Ubah Status Landing Page ke ${nextStatus ? 'Buka' : 'Tutup'}?`,
      text: nextStatus 
        ? "Landing page / subdomain sekolah akan dapat diakses publik oleh calon pendaftar."
        : "Landing page / subdomain sekolah akan dinonaktifkan sementara dan menampilkan informasi pemeliharaan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nextStatus ? "#10B981" : "#F43F5E",
      confirmButtonText: `Ya, ${nextStatus ? 'Buka' : 'Tutup'} Landing Page`,
      cancelButtonText: "Batal",
      customClass: { popup: "rounded-3xl" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLandingPageActive(nextStatus);
        try {
          const token = adminToken || localStorage.getItem("ppdb_admin_token");
          await fetch("/api/config/save-all", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
              configs: { ppdb_landing_active: nextStatus },
              description: `Ubah status publikasi landing page ke ${statusText}`
            })
          });
          Swal.fire({
            title: "Status Berhasil Diperbarui!",
            text: `Landing page sekolah sekarang ${statusText}.`,
            icon: "success",
            confirmButtonColor: "#2563EB",
            customClass: { popup: "rounded-2xl" }
          });
        } catch (_e) {
          showToastMsg("Gagal memperbarui status landing page.", "error");
        }
      }
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return {
    router,
    slug,
    activeTab,
    setActiveTab,
    loading,
    saving,
    toast,
    isLandingPageActive,
    schoolLogo,
    schoolTitle,
    setSchoolTitle,
    heroTitle,
    setHeroTitle,
    heroTitleSub,
    setHeroTitleSub,
    heroSubtitle,
    setHeroSubtitle,
    mapTitle,
    setMapTitle,
    mapUrl,
    setMapUrl,
    phone,
    setPhone,
    email,
    setEmail,
    schoolPeriod,
    setSchoolPeriod,
    address,
    setAddress,
    footerDesc,
    setFooterDesc,
    waGroupUrl,
    setWaGroupUrl,
    waAdmin,
    setWaAdmin,
    gelombangConfig,
    setGelombangConfig,
    g1Error,
    setG1Error,
    g2Error,
    setG2Error,
    majorsList,
    setMajorsList,
    editingMajor,
    setEditingMajor,
    isNewMajor,
    setIsNewMajor,
    dragActiveStates,
    setDragActiveStates,
    handleDragState,
    processMediaFile,
    showToastMsg,
    alurList,
    setAlurList,
    formFee,
    setFormFee,
    formGuideline,
    setFormGuideline,
    fieldsConfigUI,
    setFieldsConfigUI,
    faqList,
    setFaqList,
    faqTitle,
    setFaqTitle,
    faqSubtitle,
    setFaqSubtitle,
    bankConfigList,
    setBankConfigList,
    partnersList,
    setPartnersList,
    revisions,
    handleRestore,
    formatDate,
    showConfirmModal,
    setShowConfirmModal,
    changeDescription,
    setChangeDescription,
    handleSaveAll,
    handleToggleLandingPageStatus,
    handleSchoolLogoChange
  };
}
