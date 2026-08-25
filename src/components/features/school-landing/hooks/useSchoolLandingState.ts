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
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website resmi sekolah dan mengisi data diri lengkap." },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran melalui metode yang tersedia." },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Data pendaftaran akan diverifikasi oleh panitia PPDB sekolah." },
  { id: 4, title: "Pemberkasan", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik." },
  { id: 5, title: "Tes Seleksi", desc: "Mengikuti serangkaian tes seleksi yang ditentukan oleh sekolah." },
  { id: 6, title: "Pengumuman Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru." }
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

export function useSchoolLandingState() {
  const { ppdbTitle, isSchoolNotFound } = usePPDB();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "sekolah";

  const schoolDisplayName =
    ppdbTitle ||
    schoolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroTitle, setHeroTitle] = useState("Penerimaan Peserta Didik Baru");
  const [heroTitleSub, setHeroTitleSub] = useState(`SPMB ${schoolDisplayName}`);
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Mulai langkah awal wujudkan masa depan cemerlang. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh."
  );

  const [address, setAddress] = useState("");
  const [mapTitle, setMapTitle] = useState(`Kunjungi ${schoolDisplayName}`);
  const [mapUrl, setMapUrl] = useState("");
  const [waAdmin, setWaAdmin] = useState("");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");

  const [faqList, setFaqList] = useState<FaqItem[]>(DEFAULT_FAQ);
  const [faqTitle, setFaqTitle] = useState("Pertanyaan yang Sering Diajukan");
  const [faqSubtitle, setFaqSubtitle] = useState(
    "Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru."
  );

  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);
  const [majors, setMajors] = useState<MajorItem[]>(DEFAULT_MAJORS);
  const [isLandingPageActive, setIsLandingPageActive] = useState<boolean>(true);
  const [partnersList, setPartnersList] = useState<Array<PartnerItem & { id?: number; url?: string; h?: string }>>([]);

  const [gelombangConfig, setGelombangConfig] = useState<GelombangConfig>({
    gelombang1: { start: "", end: "" },
    gelombang2: { start: "", end: "" }
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

  useEffect(() => {
    const loadDynamicConfig = async () => {
      try {
        const res = await fetch(`/api/config?school_slug=${schoolSlug}&_t=${Date.now()}`, {
          cache: "no-store"
        });
        const json = await res.json();
        if (json.success && json.data) {
          const cfg = json.data;
          if (cfg.ppdb_landing_active !== undefined) {
            setIsLandingPageActive(
              cfg.ppdb_landing_active === true ||
              cfg.ppdb_landing_active === "true" ||
              cfg.ppdb_landing_active === 1 ||
              cfg.ppdb_landing_active === "1"
            );
          }
          if (cfg.ppdb_hero_title) setHeroTitle(cfg.ppdb_hero_title);
          if (cfg.ppdb_hero_title_sub) setHeroTitleSub(cfg.ppdb_hero_title_sub);
          if (cfg.ppdb_hero_subtitle) setHeroSubtitle(cfg.ppdb_hero_subtitle);
          if (cfg.ppdb_alamat) setAddress(cfg.ppdb_alamat);
          if (cfg.ppdb_maps_embed) setMapUrl(cfg.ppdb_maps_embed);
          if (cfg.ppdb_map_title) setMapTitle(cfg.ppdb_map_title);
          if (cfg.ppdb_wa_admin) setWaAdmin(cfg.ppdb_wa_admin);
          if (cfg.ppdb_school_period) setSchoolPeriod(cfg.ppdb_school_period);

          if (cfg.ppdb_faq_title) setFaqTitle(cfg.ppdb_faq_title);
          if (cfg.ppdb_faq_subtitle) setFaqSubtitle(cfg.ppdb_faq_subtitle);

          if (cfg.ppdb_faq_config && Array.isArray(cfg.ppdb_faq_config)) {
            setFaqList(cfg.ppdb_faq_config);
          }
          if (cfg.ppdb_alur_config && Array.isArray(cfg.ppdb_alur_config)) {
            setAlurList(cfg.ppdb_alur_config);
          }
          if (cfg.ppdb_majors_config && Array.isArray(cfg.ppdb_majors_config)) {
            setMajors(cfg.ppdb_majors_config);
          }
          if (cfg.ppdb_partners_config && Array.isArray(cfg.ppdb_partners_config)) {
            setPartnersList(cfg.ppdb_partners_config);
          }
          if (cfg.ppdb_gelombang_config) {
            setGelombangConfig(cfg.ppdb_gelombang_config);
          }
        }
      } catch (err) {
        console.warn("Failed to load school landing config:", err);
      }
    };
    loadDynamicConfig();
  }, [schoolSlug]);

  return {
    schoolSlug,
    schoolDisplayName,
    isSchoolNotFound,
    isLandingPageActive,
    mobileMenuOpen,
    setMobileMenuOpen,
    heroTitle,
    heroTitleSub,
    heroSubtitle,
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
    formatDate
  };
}
