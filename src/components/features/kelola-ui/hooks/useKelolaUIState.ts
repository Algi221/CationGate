"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { useSchoolHref } from "@/hooks/useSchoolHref";
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
  const schoolSlug =
    (params?.school_slug as string) ||
    (typeof window !== "undefined" && window.location.hostname.includes(".") && !window.location.hostname.startsWith("www.") && !window.location.hostname.startsWith("gatekeeper.")
      ? window.location.hostname.split(".")[0]
      : "") ||
    "";
  const slug = schoolSlug;

  const { isDemoMode, adminToken, ppdbTitle } = usePPDB();
  const isDemo = isDemoMode || slug === "demo" || (typeof window !== "undefined" && (window.location.pathname.startsWith("/demo") || window.location.host.startsWith("demo.")));

  const tabParam = searchParams.get("tab") as KelolaUITab | null;
  const [activeTab, setActiveTab] = useState<KelolaUITab>(tabParam || "hero");

  useEffect(() => {
    if (tabParam && ["hero", "majors", "alur", "form", "bank", "faq", "partners", "revisions"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [mounted, setMounted] = useState(false);

  const draftKey = `ppdb_ui_editor_draft_${slug || 'demo'}`;

  // Form Fields State
  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolTitle, setSchoolTitle] = useState("");
  const [heroTitle, setHeroTitle] = useState(() => isDemo ? "Penerimaan Siswa Baru" : "");
  const [heroTitleSub, setHeroTitleSub] = useState(() => isDemo ? "Portal PPDB" : "");
  const [heroSubtitle, setHeroSubtitle] = useState(() => isDemo ? "Platform pendaftaran peserta didik baru resmi." : "");
  const [heroBgImage, setHeroBgImage] = useState<string>("");
  const [phone, setPhone] = useState(() => isDemo ? "+62218740756" : "");
  const [email, setEmail] = useState(() => isDemo ? "info@smktarunabhakti.sch.id" : "");
  const [address, setAddress] = useState(() => isDemo ? "Jl. Pekapuran RT 02 RW 06, Curug, Cimanggis, Kota Depok, Jawa Barat 16453" : "");
  const [footerDesc, setFooterDesc] = useState(() => isDemo ? "Pionir pendidikan kejuruan teknologi informasi di Kota Depok dengan sertifikasi internasional dan industri." : "");
  const [mapTitle, setMapTitle] = useState(() => isDemo ? "Kunjungi Kampus SMK Taruna Bhakti" : "");
  const [mapUrl, setMapUrl] = useState(() => isDemo ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.055845577626!2d106.867407!3d-6.3844792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebaff005f277%3A0x9fcd41028665eea8!2sSMK%20Taruna%20Bhakti%20Depok!5e0!3m2!1sen!2sid!4v1683883446098!5m2!1sen!2sid" : "");
  const [schoolPeriod, setSchoolPeriod] = useState(() => isDemo ? "2026-2027" : "");
  const [waGroupUrl, setWaGroupUrl] = useState(() => isDemo ? "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS" : "");
  const [waAdmin, setWaAdmin] = useState(() => isDemo ? "6281292244456" : "");
  const [formGuideline, setFormGuideline] = useState(() => isDemo ? "Silakan isi formulir pendaftaran calon siswa dengan lengkap dan benar. Berkas persyaratan wajib diunggah dalam format gambar (PNG/JPG) maksimal 2MB." : "");
  const [formFee, setFormFee] = useState(() => isDemo ? "250000" : "0");
  const [isLandingPageActive, setIsLandingPageActive] = useState(() => isDemo);

  // Collections State
  const [alurList, setAlurList] = useState<AlurItem[]>(() => {
    if (isDemo) return DEFAULT_ALUR;
    if (typeof window !== "undefined") {
      const saved = (slug ? localStorage.getItem(`ppdb_alur_config_${slug}`) : null) || localStorage.getItem("ppdb_alur_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
    }
    return [];
  });
  const [majorsList, setMajorsList] = useState<MajorItem[]>(() => {
    if (isDemo) return DEFAULT_MAJORS;
    if (typeof window !== "undefined") {
      const saved = (slug ? localStorage.getItem(`ppdb_majors_config_${slug}`) : null) || localStorage.getItem("ppdb_majors_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
    }
    return [];
  });
  const [faqList, setFaqList] = useState<FaqItem[]>(() => {
    if (isDemo) return DEFAULT_FAQ;
    if (typeof window !== "undefined") {
      const saved = (slug ? localStorage.getItem(`ppdb_faq_config_${slug}`) : null) || localStorage.getItem("ppdb_faq_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
    }
    return [];
  });
  const [faqTitle, setFaqTitle] = useState(() => isDemo ? "Pertanyaan yang Sering Diajukan" : "");
  const [faqSubtitle, setFaqSubtitle] = useState(() => isDemo ? "Temukan jawaban cepat untuk kendala dan pertanyaan seputar proses pendaftaran." : "");
  const [partnersList, setPartnersList] = useState<PartnerItem[]>(() => {
    if (isDemo) return DEFAULT_PARTNERS;
    if (typeof window !== "undefined") {
      const saved = (slug ? localStorage.getItem(`ppdb_partners_config_${slug}`) : null) || localStorage.getItem("ppdb_partners_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
    }
    return [];
  });
  const [bankConfigList, setBankConfigList] = useState<BankConfigItem[]>(() => {
    if (isDemo) return [
      { bankName: "Bank BJB", accountNumber: "0010203040506", accountHolder: "SMK Taruna Bhakti" }
    ];
    if (typeof window !== "undefined") {
      const saved = (slug ? localStorage.getItem(`ppdb_bank_config_${slug}`) : null) || localStorage.getItem("ppdb_bank_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
    }
    return [];
  });
  const [fieldsConfigUI, setFieldsConfigUI] = useState<Record<string, FieldConfigItem>>(() => {
    if (typeof window !== "undefined") {
      const saved = (slug ? localStorage.getItem(`ppdb_fields_config_${slug}`) : null) || localStorage.getItem("ppdb_fields_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") return { ...DEFAULT_FIELDS_CONFIG_UI, ...parsed };
        } catch (_) {}
      }
    }
    return DEFAULT_FIELDS_CONFIG_UI;
  });
  const [gelombangConfig, setGelombangConfig] = useState<{
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  }>(() => {
    if (isDemo) return {
      gelombang1: { start: "2026-01-01", end: "2026-04-30" },
      gelombang2: { start: "2026-05-01", end: "2026-07-15" }
    };
    if (typeof window !== "undefined") {
      const saved = (slug ? localStorage.getItem(`ppdb_gelombang_config_${slug}`) : null) || localStorage.getItem("ppdb_gelombang_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") return parsed;
        } catch (_) {}
      }
    }
    return {
      gelombang1: { start: "", end: "" },
      gelombang2: { start: "", end: "" }
    };
  });

  const [g1Error, setG1Error] = useState<string | null>(null);
  const [g2Error, setG2Error] = useState<string | null>(null);

  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);
  const [editingMajor, setEditingMajor] = useState<MajorItem | null>(null);
  const [isNewMajor, setIsNewMajor] = useState(false);
  const [revisions, setRevisions] = useState<RevisionLog[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [changeDescription, setChangeDescription] = useState("");
  const [dragActiveStates, setDragActiveStates] = useState<Record<string, boolean>>({});

  const isDirty = useMemo(() => {
    if (!initialSnapshot) return false;
    const current = JSON.stringify({
      ppdb_landing_active: isLandingPageActive,
      ppdb_hero_title: heroTitle,
      ppdb_hero_title_sub: heroTitleSub,
      ppdb_hero_subtitle: heroSubtitle,
      ppdb_hero_bg_image: heroBgImage,
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
      ppdb_logo_url: schoolLogo,
      ppdb_title: schoolTitle,
      ppdb_footer_desc: footerDesc,
      ppdb_alur_config: alurList,
      ppdb_majors_config: majorsList,
      ppdb_faq_config: faqList,
      ppdb_faq_title: faqTitle,
      ppdb_faq_subtitle: faqSubtitle,
      ppdb_partners_config: partnersList,
      ppdb_gelombang_config: gelombangConfig,
      ppdb_fields_config: fieldsConfigUI
    });
    return current !== initialSnapshot;
  }, [
    initialSnapshot,
    isLandingPageActive,
    heroTitle,
    heroTitleSub,
    heroSubtitle,
    heroBgImage,
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
    schoolLogo,
    schoolTitle,
    footerDesc,
    alurList,
    majorsList,
    faqList,
    faqTitle,
    faqSubtitle,
    partnersList,
    gelombangConfig,
    fieldsConfigUI
  ]);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    fetchCurrentConfig();
    fetchRevisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync draft to localStorage only AFTER initial config is fully loaded
  useEffect(() => {
    if (!mounted || loading || !isInitialLoaded) return;

    const draft = {
      ppdb_landing_active: isLandingPageActive,
      ppdb_hero_title: heroTitle,
      ppdb_hero_title_sub: heroTitleSub,
      ppdb_hero_subtitle: heroSubtitle,
      ppdb_hero_bg_image: heroBgImage,
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
      ppdb_fields_config: fieldsConfigUI
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizeForDraft = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.startsWith('data:') && obj.length > 500 ? '' : obj;
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitizeForDraft);
      }
      if (obj !== null && typeof obj === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = {};
        for (const k of Object.keys(obj)) {
          res[k] = sanitizeForDraft(obj[k]);
        }
        return res;
      }
      return obj;
    };

    try {
      const sanitizedDraft = sanitizeForDraft(draft);
      localStorage.setItem(draftKey, JSON.stringify(sanitizedDraft));
    } catch (error: unknown) {
      if ((error as { name?: string })?.name === "QuotaExceededError") {
        try {
          localStorage.removeItem(draftKey);
        } catch (_e) {}
      }
    }
  }, [
    mounted,
    loading,
    isLandingPageActive,
    heroTitle,
    heroTitleSub,
    heroSubtitle,
    heroBgImage,
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
    fieldsConfigUI,
    draftKey,
    isInitialLoaded,
  ]);

  const showToastMsg = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  async function fetchCurrentConfig() {
    try {
      setLoading(true);
      const token = adminToken || localStorage.getItem("ppdb_admin_token");
      const url = slug
        ? `/api/config?school_slug=${encodeURIComponent(slug)}&_t=${Date.now()}`
        : `/api/config?_t=${Date.now()}`;
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

      // Authoritative source: Server Database always takes precedence over stale drafts
      const hasServerConfig = Object.keys(config).length > 0;
      const activeConfig = hasServerConfig ? { ...config } : (draft || {});

      if (activeConfig.ppdb_hero_title) setHeroTitle(activeConfig.ppdb_hero_title);
      if (activeConfig.ppdb_hero_title_sub) setHeroTitleSub(activeConfig.ppdb_hero_title_sub);
      else if (!draft) setHeroTitleSub(`Portal PPDB ${ppdbTitle || 'Online'}`);

      if (activeConfig.ppdb_hero_subtitle) setHeroSubtitle(activeConfig.ppdb_hero_subtitle);
      if (activeConfig.ppdb_hero_bg_image) setHeroBgImage(activeConfig.ppdb_hero_bg_image);
      if (activeConfig.ppdb_phone) setPhone(formatPhoneNumber(activeConfig.ppdb_phone));
      if (activeConfig.ppdb_email) setEmail(activeConfig.ppdb_email);
      if (activeConfig.ppdb_address || activeConfig.ppdb_alamat) setAddress(activeConfig.ppdb_address || activeConfig.ppdb_alamat);
      if (activeConfig.ppdb_map_title) setMapTitle(activeConfig.ppdb_map_title);
      if (activeConfig.ppdb_map_url || activeConfig.ppdb_maps_embed) setMapUrl(activeConfig.ppdb_map_url || activeConfig.ppdb_maps_embed);
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
      else if (!draft && isDemo) setSchoolTitle(`PPDB ${ppdbTitle || 'Sekolah'}`);

      const parseConfigArray = <T>(val: unknown): T[] | null => {
        if (Array.isArray(val)) return val as T[];
        if (typeof val === "string") {
          let curr = val.trim();
          let depth = 0;
          while (depth < 4) {
            if (curr.startsWith("[") && curr.endsWith("]")) {
              try {
                const parsed = JSON.parse(curr);
                if (Array.isArray(parsed)) return parsed as T[];
                if (typeof parsed === "string") {
                  curr = parsed.trim();
                  depth++;
                  continue;
                }
              } catch (_e) {
                break;
              }
            } else if (curr.startsWith('"') && curr.endsWith('"')) {
              try {
                const unquoted = JSON.parse(curr);
                if (typeof unquoted === "string") {
                  curr = unquoted.trim();
                  depth++;
                  continue;
                }
                if (Array.isArray(unquoted)) return unquoted as T[];
              } catch (_e) {
                break;
              }
            } else {
              break;
            }
          }
        }
        return null;
      };

      const parsedAlur = parseConfigArray<AlurItem>(activeConfig.ppdb_alur_config);
      if (parsedAlur && parsedAlur.length > 0) {
        setAlurList(parsedAlur);
        if (typeof window !== "undefined") {
          if (slug) localStorage.setItem(`ppdb_alur_config_${slug}`, JSON.stringify(parsedAlur));
          localStorage.setItem(`ppdb_alur_config`, JSON.stringify(parsedAlur));
        }
      } else if (isDemo) {
        setAlurList(DEFAULT_ALUR);
      } else if (typeof window !== "undefined") {
        const cachedAlur = (slug ? localStorage.getItem(`ppdb_alur_config_${slug}`) : null) || localStorage.getItem("ppdb_alur_config");
        if (cachedAlur) {
          try {
            const parsed = JSON.parse(cachedAlur);
            if (Array.isArray(parsed) && parsed.length > 0) setAlurList(parsed);
          } catch (_) {}
        }
      }

      const parsedFaq = parseConfigArray<FaqItem>(activeConfig.ppdb_faq_config);
      if (parsedFaq && parsedFaq.length > 0) {
        setFaqList(parsedFaq);
        if (typeof window !== "undefined") {
          if (slug) localStorage.setItem(`ppdb_faq_config_${slug}`, JSON.stringify(parsedFaq));
          localStorage.setItem(`ppdb_faq_config`, JSON.stringify(parsedFaq));
        }
      } else if (isDemo) {
        setFaqList(DEFAULT_FAQ);
      } else if (typeof window !== "undefined") {
        const cachedFaq = (slug ? localStorage.getItem(`ppdb_faq_config_${slug}`) : null) || localStorage.getItem("ppdb_faq_config");
        if (cachedFaq) {
          try {
            const parsed = JSON.parse(cachedFaq);
            if (Array.isArray(parsed) && parsed.length > 0) setFaqList(parsed);
          } catch (_) {}
        }
      }

      const parsedPartners = parseConfigArray<PartnerItem>(activeConfig.ppdb_partners_config);
      if (parsedPartners && parsedPartners.length > 0) {
        setPartnersList(parsedPartners);
        if (typeof window !== "undefined") {
          if (slug) localStorage.setItem(`ppdb_partners_config_${slug}`, JSON.stringify(parsedPartners));
          localStorage.setItem(`ppdb_partners_config`, JSON.stringify(parsedPartners));
        }
      } else if (isDemo) {
        setPartnersList(DEFAULT_PARTNERS);
      } else if (typeof window !== "undefined") {
        const cachedPartners = (slug ? localStorage.getItem(`ppdb_partners_config_${slug}`) : null) || localStorage.getItem("ppdb_partners_config");
        if (cachedPartners) {
          try {
            const parsed = JSON.parse(cachedPartners);
            if (Array.isArray(parsed) && parsed.length > 0) setPartnersList(parsed);
          } catch (_) {}
        }
      }

      if (isDemo) {
        setMajorsList(DEFAULT_MAJORS);
      } else {
        const parsedMajors = parseConfigArray<MajorItem>(activeConfig.ppdb_majors_config);
        if (parsedMajors && parsedMajors.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mergedMajors = parsedMajors.map((dbMajor: any) => {
            const defMajor = DEFAULT_MAJORS.find(d => d.code === dbMajor.code);
            return {
              code: dbMajor.code,
              title: dbMajor.title || "",
              desc: dbMajor.desc || "",
              color: dbMajor.color || (defMajor?.color || "#0066ff"),
              careers: Array.isArray(dbMajor.careers) ? dbMajor.careers : (typeof dbMajor.careers === 'string' ? dbMajor.careers.split(',').map((s: string) => s.trim()) : []),
              facilities: Array.isArray(dbMajor.facilities) ? dbMajor.facilities : (typeof dbMajor.facilities === 'string' ? dbMajor.facilities.split(',').map((s: string) => s.trim()) : []),
              logo: dbMajor.logo || "",
              banner: dbMajor.banner || "",
              video: dbMajor.video || "",
              gallery: Array.isArray(dbMajor.gallery) ? dbMajor.gallery : []
            };
          });
          setMajorsList(mergedMajors);
          if (typeof window !== "undefined") {
            if (slug) localStorage.setItem(`ppdb_majors_config_${slug}`, JSON.stringify(mergedMajors));
            localStorage.setItem(`ppdb_majors_config`, JSON.stringify(mergedMajors));
          }
        } else if (typeof window !== "undefined") {
          const cachedMajors = (slug ? localStorage.getItem(`ppdb_majors_config_${slug}`) : null) || localStorage.getItem("ppdb_majors_config");
          if (cachedMajors) {
            try {
              const parsed = JSON.parse(cachedMajors);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setMajorsList(parsed);
              }
            } catch (_) {}
          }
        }
      }

      const DEFAULT_GELOMBANG_UI = isDemo
        ? {
            gelombang1: { start: "2026-01-05", end: "2026-04-30" },
            gelombang2: { start: "2026-05-01", end: "2026-07-15" }
          }
        : {
            gelombang1: { start: "", end: "" },
            gelombang2: { start: "", end: "" }
          };

      if (activeConfig.ppdb_gelombang_config) {
        let g = activeConfig.ppdb_gelombang_config;
        if (typeof g === "string") {
          try { g = JSON.parse(g); } catch (_e) {}
        }
        if (typeof g === "string") {
          try { g = JSON.parse(g); } catch (_e) {}
        }
        if (g && typeof g === "object") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const gObj = g as any;
          if (gObj.gelombang1?.start || gObj.gelombang1?.end || gObj.gelombang2?.start || gObj.gelombang2?.end) {
            setGelombangConfig({
              gelombang1: {
                start: gObj.gelombang1?.start || DEFAULT_GELOMBANG_UI.gelombang1.start,
                end: gObj.gelombang1?.end || DEFAULT_GELOMBANG_UI.gelombang1.end
              },
              gelombang2: {
                start: gObj.gelombang2?.start || DEFAULT_GELOMBANG_UI.gelombang2.start,
                end: gObj.gelombang2?.end || DEFAULT_GELOMBANG_UI.gelombang2.end
              }
            });
          } else {
            setGelombangConfig(DEFAULT_GELOMBANG_UI);
          }
        } else {
          setGelombangConfig(DEFAULT_GELOMBANG_UI);
        }
      } else {
        setGelombangConfig(DEFAULT_GELOMBANG_UI);
      }

      if (activeConfig.ppdb_bank_config) {
        let bankData = activeConfig.ppdb_bank_config;
        if (typeof bankData === "string") {
          try { bankData = JSON.parse(bankData); } catch (_e) {}
        }
        if (Array.isArray(bankData) && bankData.length > 0) {
          setBankConfigList(bankData);
          if (typeof window !== "undefined") {
            if (slug) localStorage.setItem(`ppdb_bank_config_${slug}`, JSON.stringify(bankData));
            localStorage.setItem(`ppdb_bank_config`, JSON.stringify(bankData));
          }
        } else if (bankData && typeof bankData === "object") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((bankData as any).bankName) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bArr = [bankData as any];
            setBankConfigList(bArr);
            if (typeof window !== "undefined") {
              if (slug) localStorage.setItem(`ppdb_bank_config_${slug}`, JSON.stringify(bArr));
              localStorage.setItem(`ppdb_bank_config`, JSON.stringify(bArr));
            }
          }
        }
      } else if (typeof window !== "undefined") {
        const cachedBank = (slug ? localStorage.getItem(`ppdb_bank_config_${slug}`) : null) || localStorage.getItem("ppdb_bank_config");
        if (cachedBank) {
          try {
            const parsed = JSON.parse(cachedBank);
            if (Array.isArray(parsed) && parsed.length > 0) setBankConfigList(parsed);
          } catch (_) {}
        }
      }

      if (activeConfig.ppdb_landing_active !== undefined) {
        setIsLandingPageActive(activeConfig.ppdb_landing_active === true || activeConfig.ppdb_landing_active === "true");
      }
      if (activeConfig.ppdb_fields_config && typeof activeConfig.ppdb_fields_config === "object") {
        setFieldsConfigUI(prev => ({ ...prev, ...activeConfig.ppdb_fields_config }));
      }

      const initialSnap = JSON.stringify({
        ppdb_landing_active: activeConfig.ppdb_landing_active !== undefined ? (activeConfig.ppdb_landing_active === true || activeConfig.ppdb_landing_active === "true") : true,
        ppdb_hero_title: activeConfig.ppdb_hero_title || "",
        ppdb_hero_title_sub: activeConfig.ppdb_hero_title_sub || (!draft ? `Portal PPDB ${ppdbTitle || 'Online'}` : ""),
        ppdb_hero_subtitle: activeConfig.ppdb_hero_subtitle || "",
        ppdb_hero_bg_image: activeConfig.ppdb_hero_bg_image || "",
        ppdb_phone: formatPhoneNumber(activeConfig.ppdb_phone || ""),
        ppdb_email: activeConfig.ppdb_email || "",
        ppdb_address: activeConfig.ppdb_address || activeConfig.ppdb_alamat || "",
        ppdb_map_title: activeConfig.ppdb_map_title || "",
        ppdb_map_url: activeConfig.ppdb_map_url || activeConfig.ppdb_maps_embed || "",
        ppdb_school_period: activeConfig.ppdb_school_period || "",
        ppdb_wa_group_url: activeConfig.ppdb_wa_group_url || "",
        ppdb_wa_admin: formatPhoneNumber(activeConfig.ppdb_wa_admin || ""),
        ppdb_form_guideline: activeConfig.ppdb_form_guideline || "",
        ppdb_form_fee: activeConfig.ppdb_form_fee || "",
        ppdb_logo_url: activeConfig.ppdb_logo_url || "",
        ppdb_title: activeConfig.ppdb_title || "",
        ppdb_footer_desc: activeConfig.ppdb_footer_desc || "",
        ppdb_alur_config: Array.isArray(activeConfig.ppdb_alur_config) ? activeConfig.ppdb_alur_config : (!isDemo ? [] : DEFAULT_ALUR),
        ppdb_majors_config: isDemo ? DEFAULT_MAJORS : (Array.isArray(activeConfig.ppdb_majors_config) ? activeConfig.ppdb_majors_config : []),
        ppdb_faq_config: Array.isArray(activeConfig.ppdb_faq_config) ? activeConfig.ppdb_faq_config : (isDemo ? DEFAULT_FAQ : []),
        ppdb_faq_title: activeConfig.ppdb_faq_title || "",
        ppdb_faq_subtitle: activeConfig.ppdb_faq_subtitle || "",
        ppdb_partners_config: Array.isArray(activeConfig.ppdb_partners_config) ? activeConfig.ppdb_partners_config : (isDemo ? DEFAULT_PARTNERS : []),
        ppdb_gelombang_config: activeConfig.ppdb_gelombang_config || (isDemo ? { gelombang1: { start: "2026-01-01", end: "2026-04-30" }, gelombang2: { start: "2026-05-01", end: "2026-07-15" } } : { gelombang1: { start: "", end: "" }, gelombang2: { start: "", end: "" } }),
        ppdb_fields_config: (activeConfig.ppdb_fields_config && typeof activeConfig.ppdb_fields_config === "object") ? { ...DEFAULT_FIELDS_CONFIG_UI, ...activeConfig.ppdb_fields_config } : DEFAULT_FIELDS_CONFIG_UI
      });
      setInitialSnapshot(initialSnap);
    } catch (e) {
      console.error("Gagal mengambil konfigurasi UI:", e);
      showToastMsg("Koneksi gagal, memuat konfigurasi cadangan.", "info");
    } finally {
      setLoading(false);
      setIsInitialLoaded(true);
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
      const url = slug
        ? `/api/config/revisions?school_slug=${encodeURIComponent(slug)}&_t=${Date.now()}`
        : `/api/config/revisions?_t=${Date.now()}`;
      const res = await fetch(url, {
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
      if (file.type === "image/svg+xml" || fileExt === "svg") {
        showToastMsg("Format SVG tidak diizinkan demi keamanan. Harap gunakan format PNG, JPEG, atau WebP.", "error");
        return;
      }
      const allowedImgExts = ['jpg', 'jpeg', 'png', 'webp'];
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
    const finalDesc = changeDescription.trim() || "Pembaruan Pengaturan UI";

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
        ppdb_hero_bg_image: heroBgImage,
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

      const saveUrl = slug
        ? `/api/config/save-all?school_slug=${encodeURIComponent(slug)}`
        : `/api/config/save-all`;

      const res = await fetch(saveUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          configs: configsPayload,
          description: finalDesc
        })
      });

      const json = await res.json();
      if (json.success) {
        showToastMsg("Semua perubahan UI berhasil disimpan dan tercatat.");
        setChangeDescription("");

        const savedData = json.data || configsPayload;

        // Keep local draft & cache updated with the saved data so nothing disappears on reload
        try {
          localStorage.removeItem(draftKey);
          if (slug) {
            localStorage.setItem(`ppdb_majors_config_${slug}`, JSON.stringify(savedData.ppdb_majors_config || finalMajors));
            localStorage.setItem(`ppdb_majors_config`, JSON.stringify(savedData.ppdb_majors_config || finalMajors));
            localStorage.setItem(`ppdb_alur_config_${slug}`, JSON.stringify(savedData.ppdb_alur_config || alurList));
            localStorage.setItem(`ppdb_faq_config_${slug}`, JSON.stringify(savedData.ppdb_faq_config || faqList));
            localStorage.setItem(`ppdb_partners_config_${slug}`, JSON.stringify(savedData.ppdb_partners_config || partnersList));
            localStorage.setItem(`ppdb_bank_config_${slug}`, JSON.stringify(savedData.ppdb_bank_config || bankConfigList));
            localStorage.setItem(`ppdb_fields_config_${slug}`, JSON.stringify(fieldsConfigUI));
            localStorage.setItem(`ppdb_gelombang_config_${slug}`, JSON.stringify(gelombangConfig));
            localStorage.setItem(`cation_landing_cache_${slug}`, JSON.stringify(savedData));
          }
        } catch (storageErr) {
          console.warn("Storage sync bypassed.", storageErr);
        }

        // If server processed media and converted base64 to URLs, sync them into state
        if (savedData.ppdb_majors_config && Array.isArray(savedData.ppdb_majors_config)) {
          setMajorsList(savedData.ppdb_majors_config);
        }
        if (savedData.ppdb_hero_bg_image !== undefined) {
          setHeroBgImage(savedData.ppdb_hero_bg_image);
        }
        if (savedData.ppdb_logo_url) {
          setSchoolLogo(savedData.ppdb_logo_url);
        }
        if (savedData.ppdb_partners_config && Array.isArray(savedData.ppdb_partners_config)) {
          setPartnersList(savedData.ppdb_partners_config);
        }
        if (savedData.ppdb_alur_config && Array.isArray(savedData.ppdb_alur_config)) {
          setAlurList(savedData.ppdb_alur_config);
        }
        if (savedData.ppdb_faq_config && Array.isArray(savedData.ppdb_faq_config)) {
          setFaqList(savedData.ppdb_faq_config);
        }
        if (savedData.ppdb_bank_config && Array.isArray(savedData.ppdb_bank_config)) {
          setBankConfigList(savedData.ppdb_bank_config);
        }

        // Update initialSnapshot to reflect current saved state (clearing dirty indicator)
        const updatedSnap = JSON.stringify({
          ppdb_landing_active: savedData.ppdb_landing_active !== undefined ? (savedData.ppdb_landing_active === true || savedData.ppdb_landing_active === "true") : true,
          ppdb_hero_title: savedData.ppdb_hero_title || heroTitle || "",
          ppdb_hero_title_sub: savedData.ppdb_hero_title_sub || heroTitleSub || "",
          ppdb_hero_subtitle: savedData.ppdb_hero_subtitle || heroSubtitle || "",
          ppdb_hero_bg_image: savedData.ppdb_hero_bg_image || heroBgImage || "",
          ppdb_phone: formatPhoneNumber(savedData.ppdb_phone || phone || ""),
          ppdb_email: savedData.ppdb_email || email || "",
          ppdb_address: savedData.ppdb_address || address || "",
          ppdb_map_title: savedData.ppdb_map_title || mapTitle || "",
          ppdb_map_url: savedData.ppdb_map_url || mapUrl || "",
          ppdb_school_period: savedData.ppdb_school_period || schoolPeriod || "",
          ppdb_wa_group_url: savedData.ppdb_wa_group_url || waGroupUrl || "",
          ppdb_wa_admin: formatPhoneNumber(savedData.ppdb_wa_admin || waAdmin || ""),
          ppdb_form_guideline: savedData.ppdb_form_guideline || formGuideline || "",
          ppdb_form_fee: savedData.ppdb_form_fee || formFee || "",
          ppdb_logo_url: savedData.ppdb_logo_url || schoolLogo || "",
          ppdb_title: savedData.ppdb_title || schoolTitle || "",
          ppdb_footer_desc: savedData.ppdb_footer_desc || footerDesc || "",
          ppdb_alur_config: Array.isArray(savedData.ppdb_alur_config) ? savedData.ppdb_alur_config : alurList,
          ppdb_majors_config: Array.isArray(savedData.ppdb_majors_config) ? savedData.ppdb_majors_config : finalMajors,
          ppdb_faq_config: Array.isArray(savedData.ppdb_faq_config) ? savedData.ppdb_faq_config : faqList,
          ppdb_faq_title: savedData.ppdb_faq_title || faqTitle || "",
          ppdb_faq_subtitle: savedData.ppdb_faq_subtitle || faqSubtitle || "",
          ppdb_partners_config: Array.isArray(savedData.ppdb_partners_config) ? savedData.ppdb_partners_config : partnersList,
          ppdb_gelombang_config: savedData.ppdb_gelombang_config || gelombangConfig,
          ppdb_fields_config: (savedData.ppdb_fields_config && typeof savedData.ppdb_fields_config === "object") ? { ...DEFAULT_FIELDS_CONFIG_UI, ...savedData.ppdb_fields_config } : fieldsConfigUI
        });
        setInitialSnapshot(updatedSnap);

        // Direct store sync without duplicate network request
        if (savedData.ppdb_title) {
          useSchoolStore.getState().setPpdbTitle(savedData.ppdb_title);
        }
        if (savedData.ppdb_logo_url) {
          useSchoolStore.getState().setPpdbLogo(savedData.ppdb_logo_url);
        }

        // Realtime Broadcast to open landing page tabs with school slug validation
        try {
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const channel = new BroadcastChannel("cationgate_landing_sync");
            channel.postMessage({
              type: "CONFIG_UPDATED",
              slug: slug || "",
              data: savedData,
              version: json.configVersion || Date.now()
            });
            channel.close();
          }
        } catch (_bcErr) {}

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

  const handleHeroBgImageChange = async (file: File) => {
    try {
      showToastMsg("Mengompresi foto background hero...");
      const result = await compressImage(file, 1920, 1080, 0.85);

      showToastMsg("Mengunggah background hero...", "info");
      const compressedFile = base64ToFile(result.base64, file.name);
      const publicUrl = await uploadFileDirect(compressedFile, 'hero_bg');

      setHeroBgImage(publicUrl);
      showToastMsg(`✨ Background hero berhasil diunggah! (Ukuran berkurang ${result.reductionPercentage}%)`, "success");
    } catch (_e) {
      showToastMsg("Gagal memproses foto background.", "error");
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

  const { href } = useSchoolHref();

  const handleToggleLandingPageStatus = async () => {
    const nextStatus = !isLandingPageActive;
    const statusText = nextStatus ? "DIBUKA (PUBLIK)" : "DITUTUP (DRAFT / MAINTENANCE)";

    if (nextStatus === true && slug !== "demo" && slug !== "smktarunabhakti") {
      try {
        const subRes = await fetch(`/api/saas/school-by-slug/${slug}?t=${Date.now()}`);
        const subData = await subRes.json();
        const schoolObj = subData?.data;
        const isPaid = schoolObj?.plan_type && schoolObj.plan_type !== 'FREE' && schoolObj.plan_type !== 'free_trial' && schoolObj.plan_type !== 'TRIAL';
        const isVerified = schoolObj?.status === 'FULL_VERIFIED' || schoolObj?.status === 'VERIFIED';
        
        if (!isPaid || !isVerified) {
          Swal.fire({
            title: "Fitur Berlangganan Diperlukan 🚀",
            text: "Sekolah Anda saat ini berada dalam masa Uji Coba (Free Trial). Selama masa uji coba, Anda bebas mengelola UI, profil, dan data jurusan, namun untuk membuka pendaftaran SPMB secara publik, silakan selesaikan proses verifikasi dan aktifkan paket langganan.",
            icon: "warning",
            confirmButtonColor: "#2563EB",
            confirmButtonText: "Buka Menu Langganan",
            showCancelButton: true,
            cancelButtonText: "Batal",
            customClass: { popup: "rounded-3xl" }
          }).then((res) => {
            if (res.isConfirmed) {
              router.push(href("/dashboard/subscription"));
            }
          });
          return;
        }
      } catch (_err) {}
    }

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
          if (slug === "demo") {
            Swal.fire({
              title: "Status Berhasil Diperbarui!",
              text: `Landing page sekolah (Demo) sekarang ${statusText}.`,
              icon: "success",
              confirmButtonColor: "#2563EB",
              customClass: { popup: "rounded-2xl" }
            });
            return;
          }

          const token = adminToken || localStorage.getItem("ppdb_admin_token");
          await fetch("/api/config/save-all", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
              configs: { 
                ppdb_landing_active: nextStatus,
                ppdb_portal_status: nextStatus ? "open" : "closed"
              },
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
    let normalized = dateString;
    if (typeof dateString === "string" && !dateString.includes("Z") && !dateString.includes("+") && dateString.includes(" ")) {
      normalized = dateString.replace(" ", "T") + "Z";
    } else if (typeof dateString === "string" && !dateString.endsWith("Z") && !dateString.includes("+") && dateString.includes("T")) {
      normalized = dateString + "Z";
    }
    const date = new Date(normalized);
    return date.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(":", ".");
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
    handleSchoolLogoChange,
    heroBgImage,
    setHeroBgImage,
    handleHeroBgImageChange,
    isDirty
  };
}
