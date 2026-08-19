"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { SchoolNavbar } from "@/components/landing/SchoolNavbar";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import Image from "next/image";
import {
  Menu,
  ArrowRight,
  X,
  GraduationCap,
  FileText,
  Award,
  Milestone,
  Check,
  Upload,
  User,
  MapPin,
  Calendar,
  Bell,
  ArrowLeft,
  HelpCircle,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Cpu,
  Layers,
  Video,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Users,
  Phone,
  Megaphone,
  Clock,
  Radio,
  Search,
  School,
  Target,
  ListChecks
} from "lucide-react";

import dynamic from "next/dynamic";
const DataPendaftarTable = dynamic(() => import("@/components/DataPendaftarTable"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-xs font-semibold">Memuat data pendaftar...</p>
    </div>
  )
});
import ShinyText from "@/components/ShinyText";
const ScrollFloat = dynamic(() => import("@/components/ScrollFloat"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: (props: any) => <div className={props.containerClassName}>{props.children}</div>
});
import dompurify from "dompurify";
import { usePPDB } from "@/context/PPDBContext";
import { useParams } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu-1";
import SchoolNotFound from "@/components/SchoolNotFound";

const sanitizeUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  if (/^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i.test(url)) {
    if (url.toLowerCase().includes('javascript:')) return null;
    return url;
  }
  return null;
};

const sanitizeSrc = (src: string | undefined | null): string | null => {
  let url = sanitizeUrl(src);
  if (url && url.startsWith("/jurusan/")) {
    url = url.replace("/jurusan/", "/assets/jurusan/");
  }
  return url;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SafeImage = ({ src, alt, width, height, className, onError, fill, priority, sizes, ...props }: any) => {
  const [useFallbackImg, setUseFallbackImg] = useState(false);
  const isDataUrl = src && src.startsWith("data:");
  
  const finalSizes = fill && !sizes ? "(max-width: 768px) 48px, 64px" : sizes;

  if (isDataUrl || useFallbackImg || !src) {
    return (
      <img 
        src={src || "/logo_smktb.png"} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className} 
        onError={onError} 
        {...props} 
      />
    );
  }
  
  return (
    <Image 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      fill={fill}
      priority={priority}
      sizes={finalSizes}
      className={className} 
      onError={(e) => {
        setUseFallbackImg(true);
        if (onError) onError(e);
      }}
      unoptimized={src && (src.startsWith('http') && !src.includes('localhost') && !src.includes('127.0.0.1'))}
      {...props}
    />
  );
};

interface _InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
}

interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

interface FaqItem {
  q: string;
  a: string;
}

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

export default function Home() {
  const { publicApplicants, wsStatus, ppdbLogo, ppdbTitle, isSchoolNotFound, isConfigLoaded: _isGlobalConfigLoaded } = usePPDB();
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "sekolah";


  
  const [_isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [_activeModal, _setActiveModal] = useState<string | null>(null);

  const schoolDisplayName = ppdbTitle || schoolSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const [_waGroupUrl, setWaGroupUrl] = useState("");
  const [waAdmin, setWaAdmin] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqList, setFaqList] = useState<FaqItem[]>(DEFAULT_FAQ);
  const [faqTitle, setFaqTitle] = useState("Pertanyaan yang Sering Diajukan");
  const [faqSubtitle, setFaqSubtitle] = useState("Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru.");

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const [heroTitle, setHeroTitle] = useState("Penerimaan Peserta Didik Baru");
  const [heroTitleSub, setHeroTitleSub] = useState(`SPMB ${schoolDisplayName}`);
  const [heroSubtitle, setHeroSubtitle] = useState("Mulai langkah awal wujudkan masa depan cemerlang. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.");
  const [_phone, setPhone] = useState("");
  const [_email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mapTitle, setMapTitle] = useState(`Kunjungi ${schoolDisplayName}`);
  const [mapUrl, setMapUrl] = useState("");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [gelombangConfig, setGelombangConfig] = useState({
    gelombang1: { start: "", end: "" },
    gelombang2: { start: "", end: "" }
  });

  const getGelombangStatus = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return { label: "Belum Diatur", color: "bg-slate-100 dark:bg-[#1e293b] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700", active: false };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endStr);
    end.setHours(23, 59, 59, 999);
    
    if (today < start) {
      return { label: "Akan Datang", color: "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50", active: false };
    } else if (today >= start && today <= end) {
      return { label: "Sedang Berlangsung", color: "bg-emerald-50 dark:bg-[#022c22] text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50", active: true };
    } else {
      return { label: "Telah Ditutup", color: "bg-rose-50 dark:bg-[#4c0519] text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50", active: false };
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [partnersList, setPartnersList] = useState<any[]>([]);
  const [showAllPartners, setShowAllPartners] = useState(false);

  const [majors, setMajors] = useState([
    {
      code: "RPL",
      title: "Rekayasa Perangkat Lunak",
      icon: Cpu,
      logo: "/assets/jurusan/pplg.png",
      desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
      color: "#0066ff",
      careers: "Software Engineer, Web Developer, Mobile Developer, Game Designer, AI Specialist",
      facilities: "Lab iMac Core-i9, Smart Classroom, AWS Cloud Academy, Google Developer Partner Studio"
    },
    {
      code: "TJKT",
      title: "Teknik Jaringan Komputer & Telekomunikasi",
      icon: Layers,
      logo: "/assets/jurusan/tjkt.png",
      desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
      color: "#0ea5e9",
      careers: "Network Engineer, Cloud Administrator, Cybersecurity Analyst, System Administrator",
      facilities: "CISCO Networking Academy Lab, Mikrotik Academy Lab, Cyber Security Operations Center"
    },
    {
      code: "DKV",
      title: "Desain Komunikasi Visual",
      icon: BookOpen,
      logo: "/assets/jurusan/dkv.png",
      desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
      color: "#6366f1",
      careers: "UI/UX Designer, Graphic Designer, Illustrator, Creative Director, Brand Specialist",
      facilities: "Wacom Creative Studio, Photo & Video Lighting Lab, Digital Illustration Studio"
    },
    {
      code: "BC",
      title: "Broadcasting & Perfilman",
      icon: Video,
      logo: "/assets/jurusan/bc.png",
      desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
      color: "#f59e0b",
      careers: "Video Editor, Cameraman, Director, Scriptwriter, Podcast Producer, Content Creator",
      facilities: "Green Screen Studio, Professional TV Control Room, Podcast Soundproof Studio"
    },
    {
      code: "ANM",
      title: "Animasi",
      icon: Palette,
      logo: "/assets/jurusan/animasi.png",
      desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
      color: "#ec4899",
      careers: "3D Animator, 2D Animator, 3D Modeler, Storyboard Artist, VFX Compositor, Character Designer",
      facilities: "iMac Render Farm Studio, Wacom Cintiq Digital Drawing Lab, Motion Capture Lab, Sound Recording Room"
    },
    {
      code: "TE",
      title: "Teknik Elektronika",
      icon: Cpu,
      logo: "/assets/jurusan/te.png",
      desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
      color: "#10b981",
      careers: "IoT Engineer, Robotics Technician, Automation Programmer, Hardware Specialist",
      facilities: "Robotics Design Lab, IoT Smart-Home Prototype Sandbox, Microcontroller Lab"
    }
  ]);

  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (_e) {
      return dateString;
    }
  };

  const [loadVideo, setLoadVideo] = useState(false);
  const [heroMediaUrl, setHeroMediaUrl] = useState<string>("");
  const [heroMediaType, setHeroMediaType] = useState<string>("none");
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ["/assets/videos/vid1.webm", "/assets/videos/vid2.webm"];
  const videoRef = useRef<HTMLVideoElement>(null);

  const _handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log(e));
    }
  }, [currentVideo, loadVideo]);

  useEffect(() => {
    const handleLoad = () => {
      const timer = setTimeout(() => {
        setLoadVideo(true);
      }, 3500);
      return timer;
    };

    if (document.readyState === 'complete') {
      const timer = handleLoad();
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let timer: any;
      const onWindowLoad = () => {
        timer = handleLoad();
      };
      window.addEventListener('load', onWindowLoad);
      return () => {
        window.removeEventListener('load', onWindowLoad);
        if (timer) clearTimeout(timer);
      };
    }
  }, []);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ppdb-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    const loadDynamicConfig = async () => {
      try {
        
        const localAlur = localStorage.getItem("ppdb_alur_config");
        if (localAlur) {
          try {
          try {
            setAlurList(JSON.parse(localAlur));
          } catch (_e) {
            console.error("Invalid localAlur:", localAlur);
          }
          } catch (e) {
            console.error("Gagal parse alur dari localStorage", e);
          }
        }

        const localFaq = localStorage.getItem("ppdb_faq_config");
        if (localFaq) {
          try {
          try {
            setFaqList(JSON.parse(localFaq));
          } catch (_e) {
            console.error("Invalid localFaq:", localFaq);
          }
          } catch (e) {
            console.error("Gagal parse FAQ dari localStorage", e);
          }
        }

        if (schoolSlug === 'demo') return;
        const res = await fetch(`/api/config?school_slug=${schoolSlug}`);
        const data = await res.json();

        if (data.success && data.data) {
          const config = data.data;
          if (config.ppdb_hero_title) setHeroTitle(config.ppdb_hero_title);
          if (config.ppdb_hero_title_sub) setHeroTitleSub(config.ppdb_hero_title_sub);
          if (config.ppdb_hero_subtitle) setHeroSubtitle(config.ppdb_hero_subtitle);
          if (config.ppdb_hero_media_url) setHeroMediaUrl(config.ppdb_hero_media_url);
          if (config.ppdb_hero_media_type) setHeroMediaType(config.ppdb_hero_media_type);
          if (config.ppdb_phone) setPhone(config.ppdb_phone);
          if (config.ppdb_email) setEmail(config.ppdb_email);
          if (config.ppdb_address) setAddress(config.ppdb_address);
          if (config.ppdb_map_title) setMapTitle(config.ppdb_map_title);
          if (config.ppdb_map_url) setMapUrl(config.ppdb_map_url);
          if (config.ppdb_school_period) setSchoolPeriod(config.ppdb_school_period);
          if (config.ppdb_wa_group_url) setWaGroupUrl(config.ppdb_wa_group_url);
          if (config.ppdb_wa_admin) setWaAdmin(config.ppdb_wa_admin);
          if (config.ppdb_alur_config) setAlurList(config.ppdb_alur_config);
          if (config.ppdb_faq_config) setFaqList(config.ppdb_faq_config);
          if (config.ppdb_faq_title) setFaqTitle(config.ppdb_faq_title);
          if (config.ppdb_faq_subtitle) setFaqSubtitle(config.ppdb_faq_subtitle);
          if (config.ppdb_gelombang_config) setGelombangConfig(config.ppdb_gelombang_config);
          if (config.ppdb_partners_config && Array.isArray(config.ppdb_partners_config)) {
            setPartnersList(config.ppdb_partners_config);
          } else {
            // No partners configured yet — leave empty for template
            setPartnersList([]);
          }
          if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const iconMap: Record<string, any> = {
              RPL: Cpu,
              TJKT: Layers,
              DKV: BookOpen,
              BC: Video,
              ANM: Palette,
              TE: Cpu
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped = config.ppdb_majors_config.map((m: any) => ({
              ...m,
              icon: iconMap[m.code] || Cpu
            }));
            setMajors(mapped);
          }
        }
        setIsConfigLoaded(true);
      } catch (e) {
        console.log("Failed to load dynamic configuration from backend:", e);
        setIsConfigLoaded(true);
      }
    };

    loadDynamicConfig();
  }, []);

  // Scroll restoration mechanism to handle dynamic heights after config loads
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scrollPos-${schoolSlug}`, window.scrollY.toString());
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [schoolSlug]);

  useEffect(() => {
    if (isConfigLoaded) {
      const savedScroll = sessionStorage.getItem(`scrollPos-${schoolSlug}`);
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
          sessionStorage.removeItem(`scrollPos-${schoolSlug}`);
        }, 150); // slight delay to allow React to paint the fetched data (majors, etc)
      }
    }
  }, [isConfigLoaded, schoolSlug]);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsNavbarScrolled(true);
      } else {
        setIsNavbarScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMajorsVisible, setIsMajorsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMajorsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.05 }
    );
    const element = document.getElementById("majors");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  if (isSchoolNotFound) {
    return <SchoolNotFound slug={schoolSlug} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-800/50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white dark:bg-[#0f172a] dark:text-[#f6f5f4]">

      {/* FLOATING NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800">
        <SchoolNavbar schoolSlug={schoolSlug} />
      </header>

      {/* Fullscreen Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] animate-in fade-in duration-300 md:hidden">
          {/* Close Button X in top right */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Mobile Menu"
          >
            <X size={20} />
          </button>

          {/* Decorative gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-6 text-center p-6 w-full max-w-sm relative z-10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 mb-6">
              {ppdbLogo && <SafeImage src={ppdbLogo || undefined} alt="Logo Sekolah" width={48} height={48} className="w-12 h-12 object-contain" />}
              <span className="text-2xl font-black text-slate-800 dark:text-white">{ppdbTitle}</span>
            </Link>

            <a
              href="#alur"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Alur Pendaftaran
            </a>
            <a
              href="#majors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Jurusan
            </a>
            <a
              href="#kemitraan"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Mitra Industri
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              FAQ
            </a>
            <Link
              href={`/${params.school_slug}/forum`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Forum Informasi
            </Link>

            <div className="w-full flex flex-col gap-3 mt-8">
              <Link
                href={`/${schoolSlug}/daftar`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                Daftar Sekarang
              </Link>
              <button
                onClick={() => { toggleDark(); setMobileMenuOpen(false); }}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl border border-slate-200 dark:border-slate-700/80 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION WRAPPER */}
      <main className="flex-grow w-full relative z-0">
        <div className="relative w-full overflow-hidden">
          {/* Media Background - Full Width */}
          <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {heroMediaType === "video" && heroMediaUrl ? (
              <video
                src={sanitizeUrl(heroMediaUrl) || undefined}
                autoPlay
                muted
                loop
                playsInline
                className="object-cover w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none filter blur-[8px] scale-[1.02]"
              />
            ) : heroMediaType === "image" && heroMediaUrl ? (
              <img
                src={sanitizeUrl(heroMediaUrl) || undefined}
                alt="Hero Background"
                className="w-full h-full object-cover transition-opacity duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-slate-900/10 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-950" />
            )}
            <div className="absolute inset-0 bg-white/50 dark:bg-[#020617] backdrop-blur-none pointer-events-none"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[90vh] flex flex-col justify-center">

        {/* HERO SECTION */}
        <section className="hero">

          {/* Floating elements representing major names dynamically */}
          <div className="badges-container">
          {majors.map((m, index) => {
            const isEven = index % 2 === 0;
            const sideIndex = Math.floor(index / 2);
            // Balance left & right positions flanking the screen
            const topPos = isEven ? (100 + sideIndex * 150) : (110 + sideIndex * 180);
            const horizPos = isEven ? (2 + (sideIndex % 3) * 2) : (1 + (sideIndex % 3) * 1.5);
            const animName = `float${(index % 4) + 1}`;
            const animDuration = `${6 + (index % 3) * 1.5}s`;
            const animDelay = `-${(index % 5) * 1}s`;

            // Map code to route link
            const routeCode = encodeURIComponent(m.code.toLowerCase() === 'anm' ? 'an' : m.code.toLowerCase());
            const routeLink = `/${schoolSlug}/jurusan/${routeCode}`;

            // Map standard code aliases for display
            const displayAlias = m.code === 'RPL' ? 'PPLG' : (m.code === 'ANM' ? 'Animasi' : (m.code === 'BC' ? 'Broadcasting' : m.code));

            return (
              <Link 
                key={m.code} 
                href={routeLink} 
                className="floating-badge animate-[fadeIn_0.5s_ease-out]"
                style={{
                  top: `${topPos}px`,
                  [isEven ? 'left' : 'right']: `${horizPos}%`,
                  animation: `${animName} ${animDuration} infinite alternate ease-in-out ${animDelay}`
                }}
              >
                <div className="badge-icon overflow-hidden" style={{ background: 'transparent' }}>
                  {m.logo ? (
                    <SafeImage 
                      src={sanitizeSrc(m.logo) || "/logo_smktb.png"} 
                      alt="" 
                      width={48} 
                      height={48} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-[10px] rounded-full">
                      {displayAlias.substring(0, 3).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="badge-info">
                  <span>{displayAlias}</span>
                </div>
              </Link>
            );
          })}

          </div>

          {/* Hero Copy */}
          <div className="badge-wrapper relative z-10 flex flex-col items-center gap-3">
            <span className="badge-pill">SPMB {schoolDisplayName.toUpperCase()}</span>
            <div className="flex items-center gap-2 text-[11px] md:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0f172a] px-4 py-2 rounded-full backdrop-blur-md border border-slate-200 dark:border-slate-800/50 dark:border-slate-700/50 shadow-sm animate-[fadeIn_0.8s_ease-out_0.2s_both]">
               <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
               <span className="max-w-[280px] md:max-w-none truncate md:whitespace-normal">{address}</span>
            </div>
          </div>

          <h1 className="hero-title relative z-10">
            {isConfigLoaded ? heroTitle : "\u00A0"} <br />
            {isConfigLoaded ? (
              <ShinyText 
                text={heroTitleSub} 
                speed={3} 
                delay={1} 
                color="var(--heading)" 
                shineColor="#0ea5e9" 
                spread={135} 
              />
            ) : "\u00A0"}
          </h1>

          <p className="hero-subtitle relative z-10">
            {isConfigLoaded ? heroSubtitle : "\u00A0"}
          </p>

          <div className="hero-action">
            <Link href={`/${schoolSlug}/daftar`} className="btn-hero-action">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>

          {/* MAC BROWSER MOCKUP WRAPPER */}
          <div className="mockup-container relative z-10 w-full max-w-5xl mx-auto mt-8 md:mt-10 px-2 md:px-0">
            {/* Outer Dark Frame (Thick Bezel) */}
            <div className="relative rounded-2xl md:rounded-[2rem] bg-[#0f172a] p-1.5 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-slate-900/50">
              
              {/* Inner Mac Window */}
              <div className="w-full h-full bg-[#0f172a] overflow-hidden rounded-xl md:rounded-[1.25rem] relative flex flex-col">
                
                {/* Mockup Browser Top bar */}
                <div className="flex items-center px-3 md:px-4 py-2 md:py-3 bg-[#0f172a] relative z-20 border-b border-slate-800/80">
                  <div className="flex gap-1.5 md:gap-2 w-12 md:w-20">
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-slate-900/80 text-slate-400 text-[9px] md:text-[10px] font-medium px-4 md:px-6 py-1 md:py-1.5 rounded-md flex items-center justify-center min-w-[120px] md:min-w-[200px] shadow-inner border border-slate-800 truncate max-w-[150px] md:max-w-none">
                      cationgate/{schoolSlug}
                    </div>
                  </div>
                  <div className="w-12 md:w-20"></div> {/* Spacer for perfect centering */}
                </div>

                {/* Data Pendaftar Table View */}
                <div className="dashboard-view block w-full p-2 md:p-6 h-[400px] md:h-[600px] bg-slate-50 dark:bg-[#020617] relative z-10 transition-colors duration-300 overflow-auto">
                  <DataPendaftarTable />
                </div>

              </div>
            </div>
          </div>

        </section>
          </div>
        </div>
      {/* JADWAL GELOMBANG PENDAFTARAN */}
      <section id="gelombang" className="py-20 max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block mb-2 text-blue-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full">
            Jadwal Penerimaan · TP. {schoolPeriod}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mt-3 mb-3">
            Gelombang Pendaftaran PPDB
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed">
            Perhatikan rentang tanggal pendaftaran di setiap gelombang untuk mengamankan kuota jurusan pilihan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Gelombang 1 Card */}
          {(() => {
            const status = getGelombangStatus(gelombangConfig.gelombang1.start, gelombangConfig.gelombang1.end);
            return (
              <div className={`bg-white dark:bg-[#0f172a] border ${status.active ? 'border-blue-500/30 dark:border-blue-500/30 shadow-blue-500/5' : 'border-slate-200 dark:border-slate-800/80'} rounded-3xl p-8 shadow-sm transition-all duration-300 relative overflow-hidden group`}>
                {status.active && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none" />
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Periode Pertama</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">Gelombang 1</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}>
                    {status.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    {status.label}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-[#020617] p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <Calendar size={18} className="text-blue-500 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Tanggal Pendaftaran</span>
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                        {gelombangConfig.gelombang1.start ? formatDate(gelombangConfig.gelombang1.start) : "Belum diatur"} - {gelombangConfig.gelombang1.end ? formatDate(gelombangConfig.gelombang1.end) : "Belum diatur"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Gelombang 2 Card */}
          {(() => {
            const status = getGelombangStatus(gelombangConfig.gelombang2.start, gelombangConfig.gelombang2.end);
            return (
              <div className={`bg-white dark:bg-[#0f172a] border ${status.active ? 'border-blue-500/30 dark:border-blue-500/30 shadow-blue-500/5' : 'border-slate-200 dark:border-slate-800/80'} rounded-3xl p-8 shadow-sm transition-all duration-300 relative overflow-hidden group`}>
                {status.active && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none" />
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Periode Kedua</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">Gelombang 2</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}>
                    {status.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    {status.label}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-[#020617] p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <Calendar size={18} className="text-blue-500 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Tanggal Pendaftaran</span>
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                        {gelombangConfig.gelombang2.start ? formatDate(gelombangConfig.gelombang2.start) : "Belum diatur"} - {gelombangConfig.gelombang2.end ? formatDate(gelombangConfig.gelombang2.end) : "Belum diatur"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ALUR PENDAFTARAN */}
      <section id="alur" className="py-24 relative z-10 border-b border-slate-200 dark:border-slate-800/50 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <ScrollFloat
              containerClassName="inline-block mb-2"
              textClassName="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.02}
            >
              Proses Mudah &amp; Transparan · TP. {schoolPeriod}
            </ScrollFloat>
            <ScrollFloat
              containerClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-sm pb-2"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.03}
            >
              Alur Pendaftaran PPDB
            </ScrollFloat>
            <ScrollFloat
              containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.01}
              textMode={false}
            >
              Ikuti 6 langkah sederhana berikut untuk menjadi bagian dari SMK Taruna Bhakti Depok.
            </ScrollFloat>
          </div>

          <div className="relative">
            <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-sky-400 to-indigo-500 transform -translate-x-1/2 z-0 rounded-full opacity-70"></div>
            <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-1 border-l-2 border-dashed border-white/40 dark:border-slate-950/40 transform -translate-x-1/2 z-0"></div>

            <div className="space-y-16 relative z-10 w-full">
              {alurList.map((item, index) => {
                const isLeft = index % 2 === 0;

                const styles = [
                  { color: "blue", bg: "bg-blue-600", text: "text-blue-700 dark:text-blue-300", bgLight: "bg-blue-50 dark:bg-blue-950/60", shadow: "shadow-[0_0_20px_rgba(37,99,235,0.4)]", borderHover: "hover:border-blue-500/20", icon: FileText },
                  { color: "amber", bg: "bg-amber-500", text: "text-amber-800 dark:text-amber-300", bgLight: "bg-amber-50 dark:bg-amber-950/60", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]", borderHover: "hover:border-amber-500/20", icon: CreditCard },
                  { color: "teal", bg: "bg-teal-500", text: "text-teal-700 dark:text-teal-300", bgLight: "bg-teal-50 dark:bg-teal-950/60", shadow: "shadow-[0_0_20px_rgba(20,184,166,0.4)]", borderHover: "hover:border-teal-500/20", icon: Phone },
                  { color: "rose", bg: "bg-rose-500", text: "text-rose-700 dark:text-rose-300", bgLight: "bg-rose-50 dark:bg-rose-950/60", shadow: "shadow-[0_0_20px_rgba(244,63,94,0.4)]", borderHover: "hover:border-rose-500/20", icon: Users },
                  { color: "indigo", bg: "bg-indigo-600", text: "text-indigo-700 dark:text-indigo-300", bgLight: "bg-indigo-50 dark:bg-indigo-950/60", shadow: "shadow-[0_0_20px_rgba(79,70,229,0.4)]", borderHover: "hover:border-indigo-500/20", icon: Award },
                  { color: "emerald", bg: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300", bgLight: "bg-emerald-50 dark:bg-emerald-950/60", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]", borderHover: "hover:border-emerald-500/20", icon: ShieldCheck },
                ];

                const stepStyle = styles[index % styles.length];
                const Icon = stepStyle.icon;

                return (
                  <ScrollFloat
                    key={item.id}
                    containerClassName="w-full"
                    textClassName="w-full"
                    textMode={false}
                    scrollStart="top 85%"
                    scrollEnd="bottom 60%"
                  >
                    <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
                      {isLeft ? (
                        <>
                          <div className="pl-20 md:pl-0 md:pr-12 md:text-right">
                            <div className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl ${stepStyle.borderHover} hover:-translate-y-1 transition-all duration-300`}>
                              <span className={`inline-block px-3 py-1 ${stepStyle.bgLight} ${stepStyle.text} rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3`}>Tahap 0{item.id}</span>
                              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{item.title}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                          </div>
                          <div className="hidden md:block"></div>
                        </>
                      ) : (
                        <>
                          <div className="hidden md:block"></div>
                          <div className="pl-20 md:pl-12 md:text-left">
                            <div className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl ${stepStyle.borderHover} hover:-translate-y-1 transition-all duration-300`}>
                              <span className={`inline-block px-3 py-1 ${stepStyle.bgLight} ${stepStyle.text} rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3`}>Tahap 0{item.id}</span>
                              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{item.title}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                          </div>
                        </>
                      )}
                      <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${stepStyle.bg} border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-lg z-10 ${stepStyle.shadow} transition-all duration-300`}>
                        <Icon size={22} />
                      </div>
                    </div>
                  </ScrollFloat>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM KEAHLIAN / JURUSAN GRID */}
      <section id="majors" className="py-24 max-w-6xl mx-auto px-6 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <ScrollFloat
            containerClassName="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
          >
            Program Kompetensi Keahlian
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.01}
            textMode={false}
          >
            Tersedia 6 jurusan unggulan dengan kurikulum berstandar industri nasional maupun internasional.
          </ScrollFloat>
        </div>

        <ScrollFloat containerClassName="w-full" textClassName="w-full" textMode={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {majors.map((major, index) => {
            return (
              <Link
                href={`/${schoolSlug}/jurusan/${encodeURIComponent(major.code.toLowerCase())}`}
                key={major.code}
                className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-700 cursor-pointer flex flex-col justify-between relative overflow-hidden group transform ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-500 z-10"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 shadow-md group-hover:shadow-xl group-hover:shadow-blue-500/20">
                    <SafeImage
                      src={sanitizeSrc(major.logo) || "/logo_smktb.png"}
                      alt={`Logo ${major.code}`}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-contain drop-shadow-sm"
                      onError={(e: unknown) => {
                        (e as any).target.style.display = 'none';
                        const parent = (e as any).target.parentElement;
                        if (parent) {
                          parent.classList.add('bg-blue-50');
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          parent.querySelectorAll('.fallback-code').forEach((el: any) => el.remove());
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.style.color = '#0066ff';
                          fallbackDiv.style.display = 'flex';
                          fallbackDiv.style.alignItems = 'center';
                          fallbackDiv.style.justifyContent = 'center';
                          fallbackDiv.style.width = '100%';
                          fallbackDiv.style.height = '100%';
                          fallbackDiv.style.fontWeight = '800';
                          fallbackDiv.style.fontSize = '11px';
                          fallbackDiv.textContent = major.code;
                          fallbackDiv.classList.add('fallback-code');
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-3">
                    {major.code === "AN" ? major.title : `${major.title} (${major.code})`}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{major.desc.substring(0, 105)}...</p>
                </div>
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors relative z-10">
                  Lihat Selengkapnya <ChevronRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Link>
            );
          })}
          </div>
        </ScrollFloat>
      </section>

      {/* KEMITRAAN INDUSTRI */}
      <section id="kemitraan" className="py-24 max-w-6xl mx-auto px-6 relative z-10 border-t border-slate-200 dark:border-slate-800/30">
        <div className="text-center mb-16">
          <ScrollFloat
            containerClassName="inline-block mb-2"
            textClassName="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.02}
          >
            Kemitraan Industri
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mt-4 mb-4"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
          >
            Gerbang Karir Global Taruna Bhakti
          </ScrollFloat>
          <ScrollFloat
            containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.01}
            textMode={false}
          >
            Kurikulum berstandar internasional yang diselaraskan langsung dengan raksasa teknologi dunia, menghasilkan lulusan berdaya saing tinggi.
          </ScrollFloat>
        </div>

        <ScrollFloat containerClassName="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 mb-12 shadow-sm w-full" textClassName="w-full" textMode={false}>
          <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">
            Partner Industri Utama &amp; Sertifikasi Internasional &middot;
          </p>
            {(() => {
              const displayedPartners = showAllPartners ? partnersList : partnersList.slice(0, 10);

              const getPartnerDimensions = (hClass: string) => {
                switch (hClass) {
                  case "h-20": return { width: 150, height: 80 };
                  case "h-16": return { width: 120, height: 64 };
                  case "h-14": return { width: 105, height: 56 };
                  case "h-12": return { width: 90, height: 48 };
                  case "h-10": return { width: 75, height: 40 };
                  case "h-8": return { width: 60, height: 32 };
                  default: return { width: 120, height: 60 };
                }
              };

              return (
                <div className="w-full">
                  <div key={showAllPartners ? 'all' : 'some'} className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                    {displayedPartners.map((partner, idx) => {
                      const { width, height } = getPartnerDimensions(partner.h);
                      return (
                        <a
                          key={partner.id || idx}
                          href={sanitizeUrl(partner.url) || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center justify-center p-2 transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                          title={partner.name}
                        >
                          <img
                            src={dompurify.sanitize(sanitizeSrc(partner.logo) || "") || undefined}
                            alt={partner.name}
                            className={`w-auto object-contain ${partner.h} max-w-[150px] transition-all duration-300 drop-shadow-sm`}
                            loading="lazy"
                            width={width}
                            height={height}
                          />
                        </a>
                      );
                    })}
                  </div>
                  
                  {/* Show All Controls */}
                  {partnersList.length > 10 && (
                    <div className="flex justify-center items-center mt-12">
                      <button 
                        onClick={() => setShowAllPartners(!showAllPartners)}
                        className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
                      >
                        {showAllPartners ? (
                          <>
                            Sembunyikan
                            <ChevronLeft size={16} className="rotate-90" />
                          </>
                        ) : (
                          <>
                            Lihat Selengkapnya
                            <ChevronRight size={16} className="rotate-90" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
        </ScrollFloat>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-white dark:bg-slate-950 relative z-10 border-t border-slate-200 dark:border-slate-800/50 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollFloat
              containerClassName="inline-block mb-2"
              textClassName="text-blue-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.02}
            >
              FAQ PPDB
            </ScrollFloat>
            <ScrollFloat
            containerClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-sm"
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
          >
            {faqTitle}
            </ScrollFloat>
            <ScrollFloat
              containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top 90%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.01}
              textMode={false}
            >
              {faqSubtitle}
              </ScrollFloat>
          </div>

          <div className="space-y-6 w-full">
            {faqList.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <ScrollFloat
                  key={idx}
                  containerClassName="w-full"
                  textClassName="w-full"
                  textMode={false}
                  scrollStart="top 90%"
                  scrollEnd="bottom 75%"
                >
                  <div className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/80 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-black text-sm md:text-base text-slate-800 dark:text-white focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <span className={`text-blue-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronRight size={20} className="rotate-90" />
                      </span>
                    </button>
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-60 border-t border-slate-200 dark:border-slate-800/50 dark:border-slate-800/50" : "max-h-0"
                      }`}
                    >
                      <p className="px-6 py-5 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </ScrollFloat>
              );
            })}
          </div>

          
        </div>
      </section>
      {/* MAP SECTION */}
        <section className="w-full bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/50 py-24 relative z-10 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <ScrollFloat
                containerClassName="inline-block mb-2"
                textClassName="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100/50 dark:border-emerald-900/30 px-3.5 py-1.5 rounded-full"
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='top 90%'
                scrollEnd='bottom bottom-=40%'
                stagger={0.02}
              >
                Lokasi Kami
              </ScrollFloat>
              <ScrollFloat
                containerClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-sm pb-2"
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='center bottom+=50%'
                scrollEnd='bottom bottom-=40%'
                stagger={0.03}
              >
                {mapTitle}
              </ScrollFloat>
              <ScrollFloat
                containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='top 90%'
                scrollEnd='bottom bottom-=40%'
                stagger={0.01}
                textMode={false}
              >
                Pusat informasi dan pendaftaran offline tersedia di gedung utama kami.
              </ScrollFloat>
            </div>

            <div className="relative w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/80 group">
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              
              <iframe
                src={sanitizeUrl(mapUrl) || undefined}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>

              {/* Floating Address Card */}
              <div className="absolute bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[450px] bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-white/20 dark:border-slate-800/50 shadow-2xl z-20 transition-transform duration-300 hover:-translate-y-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20">
                    <MapPin size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1.5">Alamat Kami</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-6 pb-24 relative z-10">
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-150/40 dark:border-blue-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 dark:opacity-10 pointer-events-none">
              <HelpCircle size={96} className="text-blue-600 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Masih Mengalami Kendala atau Pertanyaan Lain?</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto leading-relaxed">
              Tim panitia PPDB SMK Taruna Bhakti siap membantu Anda secara langsung. Klik tombol di bawah untuk konsultasi via WhatsApp.
            </p>
            
            <a 
              href={sanitizeUrl(`https://wa.me/${waAdmin.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                "Halo Admin PPDB SMK Taruna Bhakti, saya calon pendaftar PPDB TP 2026/2027. Saya ingin berkonsultasi mengenai proses pendaftaran karena mengalami kendala teknis."
              )}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-8 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone size={14} />
              <span>Konsultasi Lewat WA Admin</span>
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <SchoolFooter schoolSlug={schoolSlug} />

      {/* MODAL BERITA / INFORMASI DETAIL DIHAPUS KARENA TIDAK DIGUNAKAN DI LANDING PAGE */}

    </div>
  );
}
