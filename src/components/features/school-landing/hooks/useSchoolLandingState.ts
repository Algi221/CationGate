"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { 
  AlurItem, 
  FaqItem, 
  MajorItem, 
  GelombangConfig, 
  PartnerItem 
} from "../types";
import { DEFAULT_PARTNERS } from "@/components/features/kelola-ui/defaultData";

const DEFAULT_FAQ: FaqItem[] = [
  {
    q: "Bagaimana cara melakukan pembayaran biaya pendaftaran?",
    a: "Pembayaran administrasi pendaftaran dapat diselesaikan melalui Transfer Bank Manual ke rekening resmi sekolah. Setelah melakukan transfer, harap unggah bukti transfer di portal pendaftaran untuk divalidasi oleh panitia."
  },
  {
    q: "Apa saja berkas persyaratan fisik yang wajib dibawa ke sekolah?",
    a: "Calon peserta didik baru diimbau membawa berkas asli dan fotokopi berupa: 1) Kartu Keluarga (KK), 2) KTP Orang Tua (Ayah & Ibu), 3) Akta Kelahiran, 4) Ijazah SMP/sederajat atau Surat Keterangan Lulus (SKL) resmi dilegalisir, dan 5) Pas foto berwarna terbaru ukuran 3x4 sebanyak 3 lembar."
  },
  {
    q: "Apakah ada batasan kuota pendaftaran untuk masing-masing jurusan?",
    a: "Ya, setiap program kompetensi keahlian memiliki batas kuota tampung maksimal. Pendaftaran untuk jurusan tertentu akan ditutup otomatis ketika kuota terpenuhi. Selesaikan pembayaran segera untuk mengamankan kuota Anda."
  },
  {
    q: "Apakah ada tes seleksi masuk?",
    a: "Ya, calon peserta didik baru akan mengikuti seleksi potensi akademik, tes minat bakat, serta wawancara kompetensi keahlian secara terjadwal setelah menyelesaikan pengisian formulir pendaftaran dan pembayaran biaya administrasi."
  }
];

const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website resmi sekolah dan mengisi data diri lengkap.", icon: "FileText" },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran melalui metode yang tersedia.", icon: "CreditCard" },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Data pendaftaran akan diverifikasi oleh panitia PPDB sekolah.", icon: "Phone" },
  { id: 4, title: "Pemberkasan", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik.", icon: "Users" },
  { id: 5, title: "Tes Seleksi", desc: "Mengikuti serangkaian tes seleksi yang ditentukan oleh sekolah.", icon: "Award" },
  { id: 6, title: "Pengumuman Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru.", icon: "ShieldCheck" }
];

const DEFAULT_MAJORS: MajorItem[] = [
  {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    logo: "/assets/jurusan/pplg.png",
    desc: "Belajar pemrograman web, aplikasi mobile, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
    color: "#0066ff",
    careers: "Software Engineer, Web Developer, Mobile Developer, Game Designer, AI Specialist",
    facilities: "Lab iMac Core-i9, Smart Classroom, AWS Cloud Academy"
  },
  {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    logo: "/assets/jurusan/tjkt.png",
    desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
    color: "#0ea5e9",
    careers: "Network Engineer, Cloud Administrator, Cybersecurity Analyst, System Administrator",
    facilities: "CISCO Networking Academy Lab, Mikrotik Academy Lab"
  },
  {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    logo: "/assets/jurusan/dkv.png",
    desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
    color: "#6366f1",
    careers: "UI/UX Designer, Graphic Designer, Illustrator, Creative Director, Brand Specialist",
    facilities: "Wacom Creative Studio, Photo & Video Lighting Lab"
  },
  {
    code: "BC",
    title: "Broadcasting & Perfilman",
    logo: "/assets/jurusan/bc.png",
    desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
    color: "#f59e0b",
    careers: "Video Editor, Cameraman, Director, Scriptwriter, Podcast Producer",
    facilities: "Green Screen Studio, Professional TV Control Room"
  },
  {
    code: "ANM",
    title: "Animasi",
    logo: "/assets/jurusan/animasi.png",
    desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX).",
    color: "#ec4899",
    careers: "3D Animator, 2D Animator, 3D Modeler, Storyboard Artist, VFX Compositor",
    facilities: "iMac Render Farm Studio, Wacom Cintiq Digital Drawing Lab"
  },
  {
    code: "TE",
    title: "Teknik Elektronika",
    logo: "/assets/jurusan/te.png",
    desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
    color: "#10b981",
    careers: "IoT Engineer, Robotics Technician, Automation Programmer",
    facilities: "Robotics Design Lab, IoT Smart-Home Prototype Sandbox"
  }
];

const getLocalLandingCache = (slug: string) => {
  if (typeof window === "undefined" || !slug) return null;
  try {
    const raw = localStorage.getItem(`cation_landing_cache_${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
};

const setLocalLandingCache = (slug: string, data: Record<string, unknown>) => {
  if (typeof window === "undefined" || !slug) return;
  try {
    localStorage.setItem(`cation_landing_cache_${slug}`, JSON.stringify(data));
  } catch (_e) {}
};

const parseConfigArray = <T>(val: unknown): T[] | null => {
  if (Array.isArray(val)) return val as T[];
  if (typeof val === "string" && val.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch (_e) {}
  }
  return null;
};

export function useSchoolLandingState() {
  const { ppdbTitle, isSchoolNotFound, schoolStatus, isConfigLoaded } = usePPDB();
  const params = useParams();
  const schoolSlug =
    (params?.school_slug as string) ||
    (typeof window !== "undefined" && window.location.hostname.includes(".") && !window.location.hostname.startsWith("www.") && !window.location.hostname.startsWith("gatekeeper.")
      ? window.location.hostname.split(".")[0]
      : "sekolah");
  const isDemo = schoolSlug === "demo" || (typeof window !== "undefined" && window.location.pathname.startsWith("/demo"));

  const [customSchoolName, setCustomSchoolName] = useState<string>("");

  const schoolDisplayName =
    customSchoolName ||
    ppdbTitle ||
    (isDemo ? "SMK Demo Indonesia" : schoolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));

  const isSchoolVerified =
    schoolStatus === "FULL_VERIFIED" ||
    schoolStatus === "VERIFIED" ||
    schoolStatus === "verified" ||
    isDemo;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroTitle, setHeroTitle] = useState<string>("Penerimaan Peserta Didik Baru");
  const [heroTitleSub, setHeroTitleSub] = useState<string>(
    isDemo ? `SPMB SMK Demo` : (schoolDisplayName ? `SPMB ${schoolDisplayName}` : "Tahun Ajaran 2026/2027")
  );
  const [heroSubtitle, setHeroSubtitle] = useState<string>(
    "Mulai langkah awal wujudkan masa depan cemerlang. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh."
  );
  const [heroBgImage, setHeroBgImage] = useState<string>("");

  const [address, setAddress] = useState<string>(isDemo ? "Jl. Pendidikan No. 1, Jakarta" : "");
  const [mapTitle, setMapTitle] = useState<string>(`Kunjungi ${schoolDisplayName}`);
  const [mapUrl, setMapUrl] = useState<string>("");
  const [waAdmin, setWaAdmin] = useState<string>("");
  const [schoolPeriod, setSchoolPeriod] = useState<string>("2026-2027");

  const [faqList, setFaqList] = useState<FaqItem[]>(DEFAULT_FAQ);
  const [faqTitle, setFaqTitle] = useState<string>("Pertanyaan yang Sering Diajukan");
  const [faqSubtitle, setFaqSubtitle] = useState<string>(
    "Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru."
  );

  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);
  const [majors, setMajors] = useState<MajorItem[]>(DEFAULT_MAJORS);
  const [isLandingPageActive, setIsLandingPageActive] = useState<boolean>(true);
  const [isPlatformMaintenance, setIsPlatformMaintenance] = useState<boolean>(false);
  const [partnersList, setPartnersList] = useState<Array<PartnerItem & { id?: number; url?: string; h?: string }>>(
    DEFAULT_PARTNERS
  );

  const [gelombangConfig, setGelombangConfig] = useState<GelombangConfig>({
    gelombang1: { start: "2026-01-01", end: "2026-06-30" },
    gelombang2: { start: "2026-07-01", end: "2026-08-31" }
  });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric"
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch (_e) {
      return dateString;
    }
  };

  // 1. Instant Local Cache Hydration on client mount (safe from SSR hydration mismatch)
  useEffect(() => {
    const cached = getLocalLandingCache(schoolSlug);
    if (cached) {
      if (cached.ppdb_title) setCustomSchoolName(cached.ppdb_title);
      if (cached.ppdb_hero_title) setHeroTitle(cached.ppdb_hero_title);
      if (cached.ppdb_hero_title_sub) setHeroTitleSub(cached.ppdb_hero_title_sub);
      if (cached.ppdb_hero_subtitle) setHeroSubtitle(cached.ppdb_hero_subtitle);
      if (cached.ppdb_hero_bg_image) setHeroBgImage(cached.ppdb_hero_bg_image);
      if (cached.ppdb_address || cached.ppdb_alamat) setAddress(cached.ppdb_address || cached.ppdb_alamat);
      if (cached.ppdb_map_title) setMapTitle(cached.ppdb_map_title);
      if (cached.ppdb_map_url || cached.ppdb_maps_embed) setMapUrl(cached.ppdb_map_url || cached.ppdb_maps_embed);
      if (cached.ppdb_wa_admin) setWaAdmin(cached.ppdb_wa_admin);
      if (cached.ppdb_school_period) setSchoolPeriod(cached.ppdb_school_period);
      if (cached.ppdb_faq_title) setFaqTitle(cached.ppdb_faq_title);
      if (cached.ppdb_faq_subtitle) setFaqSubtitle(cached.ppdb_faq_subtitle);

      const parsedFaq = parseConfigArray<FaqItem>(cached.ppdb_faq_config);
      if (parsedFaq && parsedFaq.length > 0) setFaqList(parsedFaq);
      const parsedAlur = parseConfigArray<AlurItem>(cached.ppdb_alur_config);
      if (parsedAlur && parsedAlur.length > 0) setAlurList(parsedAlur);
      const parsedMajors = parseConfigArray<MajorItem>(cached.ppdb_majors_config);
      if (parsedMajors && parsedMajors.length > 0) setMajors(parsedMajors);
      const parsedPartners = parseConfigArray<PartnerItem>(cached.ppdb_partners_config);
      if (parsedPartners && parsedPartners.length > 0) setPartnersList(parsedPartners);

      if (cached.ppdb_gelombang_config) {
        let g = cached.ppdb_gelombang_config;
        if (typeof g === "string" && g.trim().startsWith("{")) {
          try { g = JSON.parse(g); } catch (_e) {}
        }
        if (g && typeof g === "object") setGelombangConfig(g);
      }
    }
  }, [schoolSlug]);

  useEffect(() => {
    const loadDynamicConfig = async () => {
      try {
        // 1. Check Global Platform Maintenance Mode
        try {
          const maintRes = await fetch(`/api/saas/maintenance-status?_t=${Date.now()}`);
          if (maintRes.ok) {
            const maintJson = await maintRes.json();
            if (maintJson.success && maintJson.is_maintenance) {
              setIsPlatformMaintenance(true);
            }
          }
        } catch (_e) {}

        // 2. Check Specific School Landing Config
        const res = await fetch(`/api/config?school_slug=${encodeURIComponent(schoolSlug)}&_t=${Date.now()}`, {
          cache: "no-store"
        });
        const json = await res.json();
        if (json.success && json.data) {
          const cfg = json.data;
          setLocalLandingCache(schoolSlug, cfg);

          if (cfg.ppdb_title) {
            setCustomSchoolName(cfg.ppdb_title);
          }
          if (cfg.ppdb_landing_active !== undefined) {
            setIsLandingPageActive(
              cfg.ppdb_landing_active === true ||
              cfg.ppdb_landing_active === "true" ||
              cfg.ppdb_landing_active === 1 ||
              cfg.ppdb_landing_active === "1"
            );
          }
          if (cfg.ppdb_hero_title) {
            setHeroTitle(cfg.ppdb_hero_title);
          }
          if (cfg.ppdb_hero_title_sub) {
            setHeroTitleSub(cfg.ppdb_hero_title_sub);
          }
          if (cfg.ppdb_hero_subtitle) {
            setHeroSubtitle(cfg.ppdb_hero_subtitle);
          }
          if (cfg.ppdb_hero_bg_image) {
            setHeroBgImage(cfg.ppdb_hero_bg_image);
          }
          if (cfg.ppdb_address || cfg.ppdb_alamat) setAddress(cfg.ppdb_address || cfg.ppdb_alamat);
          if (cfg.ppdb_map_url || cfg.ppdb_maps_embed) setMapUrl(cfg.ppdb_map_url || cfg.ppdb_maps_embed);
          if (cfg.ppdb_map_title) setMapTitle(cfg.ppdb_map_title);
          if (cfg.ppdb_wa_admin) setWaAdmin(cfg.ppdb_wa_admin);
          if (cfg.ppdb_school_period) setSchoolPeriod(cfg.ppdb_school_period);

          if (cfg.ppdb_faq_title) setFaqTitle(cfg.ppdb_faq_title);
          if (cfg.ppdb_faq_subtitle) setFaqSubtitle(cfg.ppdb_faq_subtitle);

          const parsedFaq = parseConfigArray<FaqItem>(cfg.ppdb_faq_config);
          if (parsedFaq && parsedFaq.length > 0) {
            setFaqList(parsedFaq);
          } else {
            setFaqList(DEFAULT_FAQ);
          }

          const parsedAlur = parseConfigArray<AlurItem>(cfg.ppdb_alur_config);
          if (parsedAlur && parsedAlur.length > 0) {
            setAlurList(parsedAlur);
          } else {
            setAlurList(DEFAULT_ALUR);
          }

          const parsedMajors = parseConfigArray<MajorItem>(cfg.ppdb_majors_config);
          if (parsedMajors && parsedMajors.length > 0) {
            setMajors(parsedMajors);
          } else {
            setMajors(DEFAULT_MAJORS);
          }

          const parsedPartners = parseConfigArray<PartnerItem>(cfg.ppdb_partners_config);
          if (parsedPartners && parsedPartners.length > 0) {
            setPartnersList(parsedPartners);
          } else {
            setPartnersList(DEFAULT_PARTNERS);
          }

          let g = cfg.ppdb_gelombang_config;
          if (typeof g === "string" && g.trim().startsWith("{")) {
            try { g = JSON.parse(g); } catch (_e) {}
          }
          if (g && typeof g === "object" && (g.gelombang1?.start || g.gelombang2?.start)) {
            setGelombangConfig(g);
          }
        }
      } catch (err) {
        console.warn("Failed to load school landing config:", err);
      }
    };
    loadDynamicConfig();
  }, [schoolSlug, isDemo, schoolDisplayName]);

  return {
    schoolSlug,
    schoolDisplayName,
    isSchoolNotFound,
    isLandingPageActive,
    isPlatformMaintenance,
    mobileMenuOpen,
    setMobileMenuOpen,
    heroTitle,
    heroTitleSub,
    heroSubtitle,
    heroBgImage,
    address,
    mapTitle,
    mapUrl,
    waAdmin,
    schoolPeriod,
    faqList,
    faqTitle,
    faqSubtitle,
    alurList,
    majors,
    partnersList,
    gelombangConfig,
    formatDate,
    schoolStatus,
    isSchoolVerified,
    isConfigLoaded
  };
}
