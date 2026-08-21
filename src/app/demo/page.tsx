"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  FileText,
  Award,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Cpu,
  Layers,
  Video,
  Palette,
  Users,
  Phone,
  Calendar,
  HelpCircle,
  MapPin,
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

const ScrollFloat = dynamic(() => import("@/components/ScrollFloat"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: (props: any) => <div className={props.containerClassName}>{props.children}</div>
});

import { SchoolNavbar } from "@/components/landing/SchoolNavbar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SafeImage = ({ src, alt, width, height, className, onError, ...props }: any) => {
  const [useFallbackImg, setUseFallbackImg] = useState(false);
  const isDataUrl = src && src.startsWith("data:");
  
  if (isDataUrl || useFallbackImg || !src) {
    return (
      <img 
        src={src || "/assets/logo_sekolah/logo_smktb.png"} 
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
    a: "Pembayaran administrasi pendaftaran dapat diselesaikan melalui Transfer Bank Manual ke rekening resmi yayasan sekolah. Setelah melakukan transfer, harap unggah bukti transfer di portal pendaftaran untuk divalidasi oleh panitia."
  },
  {
    q: "Apa saja berkas persyaratan fisik yang wajib dibawa ke sekolah?",
    a: "Calon peserta didik baru diimbau membawa berkas asli dan fotokopi berupa: 1) Kartu Keluarga (KK), 2) KTP Orang Tua (Ayah & Ibu), 3) Akta Kelahiran, 4) Ijazah SMP/sederajat atau Surat Keterangan Lulus (SKL) resmi dilegalisir, dan 5) Pas foto berwarna terbaru ukuran 3x4 sebanyak 3 lembar."
  },
  {
    q: "Apakah ada batasan kuota pendaftaran untuk masing-masing jurusan?",
    a: "Ya, setiap program kompetensi keahlian memiliki batas kuota tampung maksimal yang diselaraskan dengan ketersediaan fasilitas laboratorium praktikum (misal 100 siswa per jurusan). Pendaftaran untuk jurusan tertentu akan ditutup otomatis ketika kuota terpenuhi. Selesaikan pembayaran segera untuk mengamankan kuota Anda."
  },
  {
    q: "Apakah ada tes seleksi masuk di SMK Taruna Bhakti?",
    a: "Ya, calon peserta didik baru akan mengikuti seleksi potensi akademik, tes minat bakat, serta wawancara kompetensi keahlian secara terjadwal setelah menyelesaikan pengisian formulir pendaftaran dan pembayaran biaya administrasi."
  }
];

const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website smktarunabhakti.net dan mengisi data lengkap." },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran sebesar Rp 250.000 via Transfer Bank." },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Konfirmasi data pendaftaran otomatis via WhatsApp" },
  { id: 4, title: "Pemberkasan & Seragam", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru." },
  { id: 5, title: "Uji Kelayakan (Tes Seleksi)", desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa." },
  { id: 6, title: "Pengumuman & Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru melalui web smktarunabhakti.net." }
];

export default function DemoPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [isMajorsVisible, setIsMajorsVisible] = useState(false);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const heroTitle = "Penerimaan Peserta Didik Baru";
  const heroTitleSub = "SPMB SMK Taruna Bhakti";
  const heroSubtitle = "Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.";
  const phone = "(021) 8740756";
  const email = "info@smktarunabhakti.sch.id";
  const address = "Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453";
  const mapTitle = "Kunjungi SMK Taruna Bhakti";
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.055845577626!2d106.867407!3d-6.3844792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebaff005f277%3A0x9fcd41028665eea8!2sSMK%20Taruna%20Bhakti%20Depok!5e0!3m2!1sen!2sid!4v1683883446098!5m2!1sen!2sid";
  const schoolPeriod = "2026-2027";
  const waAdmin = "6281292244456";

  const gelombangConfig = {
    gelombang1: { start: "2026-06-03", end: "2026-07-24" },
    gelombang2: { start: "2026-07-25", end: "2026-08-30" }
  };

  const partnersList = [
    { id: 1, name: "TOA", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/PT-TOA.png", url: "https://toa.co.id/", h: "h-8" },
    { id: 2, name: "Biznet", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/biznet_vertical_logo.png", url: "https://www.biznetnetworks.com/", h: "h-20" },
    { id: 3, name: "Icon+", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/56e83c6db8cd5587e87161281dfba75b.webp", url: "https://plniconplus.co.id/", h: "h-14" },
    { id: 4, name: "MD Animation", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Logo_md_animation.png", url: "https://mdentertainment.com/", h: "h-8" },
    { id: 5, name: "Hompimpa Animworks", logo: "https://www.google.com/s2/favicons?domain=hompimpa.co.id&sz=256", url: "https://hompimpa.co.id/", h: "h-12" },
    { id: 6, name: "Monsterdata", logo: "https://www.google.com/s2/favicons?domain=monsterdata.asia&sz=256", url: "https://monsterdata.asia/?utm_source=chatgpt.com", h: "h-12" },
    { id: 7, name: "Ciptadrasoft", logo: "https://www.google.com/s2/favicons?domain=citcom.id&sz=256", url: "https://citcom.id/", h: "h-12" },
    { id: 8, name: "Assemblr", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/6156e76e275fa19ed9a33fa3_Group-33959.png", url: "https://assemblrworld.com/", h: "h-20" },
    { id: 9, name: "Daun Biru Engineering", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/E-Learning-5.png", url: "https://daunbiru.co.id/", h: "h-12" },
    { id: 10, name: "Citra Film School", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/cropped-Logo-baru-citra.png", url: "https://citrafilmschool.net/", h: "h-20" },
    { id: 11, name: "Prasimax", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Prasimax_Logo.png", url: "https://prasimax.com/", h: "h-10" },
    { id: 12, name: "Panasonic", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/8225.png", url: "https://www.panasonic.com/id/", h: "h-8" },
    { id: 13, name: "LUWES INOVASI MANDIRI", logo: "https://luwesinovasimandiri.com/_astro/logo.DBn-6O1s.webp", url: "https://luwesinovasimandiri.com/", h: "h-12" },
    { id: 14, name: "PUDAK SCIENTIFIC", logo: "https://www.google.com/s2/favicons?domain=pudak-scientific.com&sz=256", url: "https://www.pudak-scientific.com/", h: "h-12" },
    { id: 15, name: "Pupuk Kujang Cikampek", logo: "https://www.google.com/s2/favicons?domain=pupuk-kujang.co.id&sz=256", url: "https://www.pupuk-kujang.co.id/", h: "h-12" },
    { id: 16, name: "Rasil AM 720", logo: "https://www.google.com/s2/favicons?domain=radiosilaturahim.com&sz=256", url: "https://www.radiosilaturahim.com/", h: "h-12" },
    { id: 17, name: "Beyond Films", logo: "https://www.google.com/s2/favicons?domain=beyondfilms.co.id&sz=256", url: "http://www.beyondfilms.co.id", h: "h-12" },
    { id: 18, name: "POSTPLAY", logo: "https://www.google.com/s2/favicons?domain=linktr.ee&sz=256", url: "https://linktr.ee/postplayindonesia?utm_source=chatgpt.com", h: "h-12" },
    { id: 19, name: "VISI 8", logo: "https://www.google.com/s2/favicons?domain=visi8.com&sz=256", url: "https://visi8.com/", h: "h-12" },
    { id: 20, name: "MEMENTO", logo: "https://www.google.com/s2/favicons?domain=mementoworks.id&sz=256", url: "https://mementoworks.id", h: "h-12" },
    { id: 21, name: "SKYNET", logo: "https://www.google.com/s2/favicons?domain=sky.net.id&sz=256", url: "https://sky.net.id/?utm_source=chatgpt.com", h: "h-12" },
    { id: 22, name: "Museum Nasional Indonesia", logo: "https://www.google.com/s2/favicons?domain=museumnasional.or.id&sz=256", url: "https://www.museumnasional.or.id/", h: "h-12" },
    { id: 23, name: "ANIMO", logo: "https://www.google.com/s2/favicons?domain=fiverr.com&sz=256", url: "https://www.fiverr.com/animo_studio?utm_source=chatgpt.com", h: "h-12" },
    { id: 24, name: "PIONICON", logo: "/partners/pionicon.jpg", url: "https://pionicon.com/", h: "h-12" },
    { id: 25, name: "Circle Logo", logo: "https://www.google.com/s2/favicons?domain=seamolec.org&sz=256", url: "https://seamolec.org/", h: "h-12" },
    { id: 26, name: "mvnet", logo: "https://www.google.com/s2/favicons?domain=mvnet.co.id&sz=256", url: "https://mvnet.co.id/", h: "h-12" },
    { id: 27, name: "SADA TECHNOLOGY", logo: "https://www.google.com/s2/favicons?domain=sada.id&sz=256", url: "https://sada.id/", h: "h-12" },
    { id: 28, name: "LIGHT CODE DIGITAL", logo: "https://www.google.com/s2/favicons?domain=lightcodedigital.com&sz=256", url: "https://lightcodedigital.com/", h: "h-12" },
  ];

  const majors = [
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
  ];

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch {
      return dateString;
    }
  };

  const getGelombangStatus = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return { label: "Belum Diatur", color: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700", active: false };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endStr);
    end.setHours(23, 59, 59, 999);
    
    if (today < start) {
      return { label: "Akan Datang", color: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30", active: false };
    } else if (today >= start && today <= end) {
      return { label: "Sedang Berlangsung", color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30", active: true };
    } else {
      return { label: "Telah Ditutup", color: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/30", active: false };
    }
  };

  const [loadVideo, setLoadVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ["/assets/videos/vid1.webm", "/assets/videos/vid2.webm"];
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideo, loadVideo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadVideo(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">

      {/* SCHOOL NAVBAR (SMK TB) */}
      <SchoolNavbar schoolSlug="demo" />

      {/* HERO SECTION WRAPPER */}
      <main className="flex-grow w-full relative z-0">
        <div className="relative w-full overflow-hidden">
          {/* Video Background - Full Width */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {loadVideo && (
              <video
                ref={videoRef}
                src={videos[currentVideo]}
                autoPlay
                muted
                playsInline
                preload="none"
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover transition-opacity duration-1000"
                aria-hidden="true"
              >
                <track kind="captions" label="No captions" default />
              </video>
            )}
            <div className="absolute inset-0 bg-white/75 dark:bg-slate-950/80 backdrop-blur-[1px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh] flex flex-col justify-center">
            {/* HERO SECTION */}
            <section className="hero">

              {/* Floating elements representing major names flanking left and right */}
              <div className="badges-container">
                {majors.map((m, index) => {
                  const isEven = index % 2 === 0;
                  const sideIndex = Math.floor(index / 2);
                  const topPos = isEven ? (110 + sideIndex * 160) : (120 + sideIndex * 190);
                  const horizPos = isEven ? (2 + (sideIndex % 3) * 2) : (1 + (sideIndex % 3) * 1.5);
                  const animName = `float${(index % 4) + 1}`;
                  const animDuration = `${6 + (index % 3) * 1.5}s`;
                  const animDelay = `-${(index % 5) * 1}s`;

                  const displayAlias = m.code === 'RPL' ? 'PPLG' : (m.code === 'ANM' ? 'Animasi' : (m.code === 'BC' ? 'Broadcasting' : m.code));

                  return (
                    <div 
                      key={m.code} 
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
                            src={m.logo} 
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
                    </div>
                  );
                })}
              </div>

              {/* Hero Copy matching Photo 2 */}
              <div className="badge-wrapper relative z-10 flex flex-col items-center gap-3 mb-6">
                <span className="badge-pill px-5 py-1.5 text-xs font-black uppercase tracking-widest text-slate-800 dark:text-blue-200 bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 dark:border-blue-700/40 rounded-full shadow-sm">
                  SPMB SMK TARUNA BHAKTI
                </span>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <MapPin size={14} />
                </div>
              </div>

              <h1 className="hero-title relative z-10 text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
                Penerimaan Peserta Didik <br /> Baru <br />
                <span className="text-slate-900 dark:text-white font-black">
                  SPMB PPDB SMK TB
                </span>
              </h1>

              <p className="hero-subtitle relative z-10 text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
                Mulai langkah awal wujudkan masa depan cemerlang. Proses pendaftaran online yang mudah, transparan, dan terintegrasi penuh.
              </p>

              <div className="hero-action flex items-center justify-center gap-4 mb-16">
                <Link href="/demo/dashboard" className="btn-hero-action group">
                  Lihat Demo Dashboard <ArrowRight size={16} className="inline-block transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* APP MOCKUP WRAPPER */}
              <div className="mockup-container relative z-10">
              <div className="app-mockup">

                {/* Mockup Browser Top bar */}
                <div className="mockup-browser-bar">
                  <div className="browser-dots">
                    <span className="dot-red"></span>
                    <span className="dot-yellow"></span>
                    <span className="dot-green"></span>
                  </div>
                  <div className="browser-address">demo.cationgate.com/dashboard</div>
                  <div className="w-4"></div>
                </div>

                {/* Data Pendaftar Table View */}
                <div className="dashboard-view block w-full p-6 h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative z-10 rounded-2xl transition-colors duration-300">
                  <DataPendaftarTable />
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
                <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border ${status.active ? 'border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/5' : 'border-white/50 dark:border-slate-800'} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}>
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
                    <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-150 dark:border-white/5">
                      <Calendar size={18} className="text-blue-500 shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Tanggal Pendaftaran</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                          {formatDate(gelombangConfig.gelombang1.start)} - {formatDate(gelombangConfig.gelombang1.end)}
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
                <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border ${status.active ? 'border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/5' : 'border-white/50 dark:border-slate-800'} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}>
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
                    <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-155 dark:border-white/5">
                      <Calendar size={18} className="text-blue-500 shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Tanggal Pendaftaran</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                          {formatDate(gelombangConfig.gelombang2.start)} - {formatDate(gelombangConfig.gelombang2.end)}
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
        <section id="alur" className="py-24 relative z-10 border-b border-slate-200/50 dark:border-slate-800">
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
                {DEFAULT_ALUR.map((item, index) => {
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
                              <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl ${stepStyle.borderHover} hover:-translate-y-1 transition-all duration-300`}>
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
                              <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl ${stepStyle.borderHover} hover:-translate-y-1 transition-all duration-300`}>
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
                <div
                  key={major.code}
                  className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-700 flex flex-col justify-between relative overflow-hidden group transform ${isMajorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-500 z-10"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-white border border-slate-100 shadow-md group-hover:shadow-xl group-hover:shadow-blue-500/20">
                      <SafeImage
                        src={major.logo}
                        alt={`Logo ${major.code}`}
                        width={56}
                        height={56}
                        className="w-14 h-14 object-contain drop-shadow-sm"
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
                </div>
              );
            })}
            </div>
          </ScrollFloat>
        </section>

        {/* KEMITRAAN INDUSTRI */}
        <section id="kemitraan" className="py-24 max-w-6xl mx-auto px-6 relative z-10 border-t border-slate-200/30">
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

          <ScrollFloat containerClassName="bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-100 dark:border-slate-800/60 rounded-3xl p-8 mb-12 shadow-sm w-full" textClassName="w-full" textMode={false}>
            <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">
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
                            href={partner.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center p-2 transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                            title={partner.name}
                          >
                            <img
                              src={partner.logo}
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
                          className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
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
        <section id="faq" className="py-24 bg-white dark:bg-slate-950 relative z-10 border-t border-slate-200/50 dark:border-slate-900 transition-colors duration-300">
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
                Pertanyaan yang Sering Diajukan
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
                Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru SMK Taruna Bhakti.
              </ScrollFloat>
            </div>

            <div className="space-y-6 w-full">
              {DEFAULT_FAQ.map((faq, idx) => {
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
                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm">
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
                          isOpen ? "max-h-60 border-t border-slate-200/50 dark:border-slate-800/50" : "max-h-0"
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
        <section className="w-full bg-slate-50/50 dark:bg-blue-950/20 py-24 relative z-10 transition-colors duration-300">
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

            <div className="relative w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 group">
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              
              <iframe
                src={mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>

              {/* Floating Address Card */}
              <div className="absolute bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[450px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/50 shadow-2xl z-20 transition-transform duration-300 hover:-translate-y-2">
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

        {/* WA CONSULTATION CTA */}
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
              href={`https://wa.me/${waAdmin.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                "Halo Admin PPDB SMK Taruna Bhakti, saya calon pendaftar PPDB TP 2026/2027. Saya ingin berkonsultasi mengenai proses pendaftaran karena mengalami kendala teknis."
              )}`}
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
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900 py-16 transition-colors duration-300 relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-slate-500 dark:text-slate-400">
            {/* Col 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <SafeImage src="/assets/logo_sekolah/logo_smktb.png" alt="Logo Sekolah" width={48} height={48} className="w-12 h-12 object-contain shrink-0" />
                <div>
                  <span className="logo-text font-black text-slate-800 dark:text-white text-lg">SMK Taruna Bhakti</span>
                  <span className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">Depok, Jawa Barat</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global sejak 1987.
              </p>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Program Keahlian</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><span className="text-slate-600 dark:text-slate-400">Rekayasa Perangkat Lunak (PPLG)</span></li>
                <li><span className="text-slate-600 dark:text-slate-400">Teknik Jaringan Komputer &amp; Telkom (TJKT)</span></li>
                <li><span className="text-slate-600 dark:text-slate-400">Desain Komunikasi Visual (DKV)</span></li>
                <li><span className="text-slate-600 dark:text-slate-400">Broadcasting &amp; Perfilman (BC)</span></li>
                <li><span className="text-slate-600 dark:text-slate-400">Animasi (AN)</span></li>
                <li><span className="text-slate-600 dark:text-slate-400">Teknik Elektronika (TE)</span></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Link Terkait</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><a href="#alur" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Alur PPDB {schoolPeriod.split("-")[0]}</a></li>
                <li><a href="#gelombang" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Jadwal Gelombang</a></li>
                <li><Link href="/demo/dashboard" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Dashboard Demo</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Sekretariat PPDB</h4>
              <p className="text-xs leading-relaxed font-semibold">
                {address}
              </p>
              <div className="text-xs font-bold space-y-1">
                <div>Telp: {phone}</div>
                <div>Email: {email}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <div>© {new Date().getFullYear()} SMK Taruna Bhakti Depok. All Rights Reserved.</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
