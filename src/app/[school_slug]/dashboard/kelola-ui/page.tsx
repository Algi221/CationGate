"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { 
  Palette, 
  Settings, 
  HelpCircle, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Info,
  Clock,
  RotateCcw,
  FileText,
  Video,
  Eye,
  GraduationCap,
  Briefcase,
  ArrowLeft,
  Calendar,
  Database,
  Building,
  Globe,
  Power
} from "lucide-react";
import { toast } from "sonner";
import { uploadFileDirect, base64ToFile } from "@/utils/storage";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { sanitizeSrc } from "@/utils/security";
import DOMPurify from "dompurify";
import Swal from 'sweetalert2';
import { compressImage, compressVideo } from "@/utils/mediaCompressor";


interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

interface CareerItem {
  title: string;
  desc: string;
}

interface GalleryItem {
  url: string;
  caption: string;
}

interface MajorItem {
  code: string;
  title: string;
  desc: string;
  color: string;
  careers: CareerItem[];
  facilities: string[];
  logo: string;
  banner: string;
  video: string;
  gallery: GalleryItem[];
}

interface RevisionLog {
  id: number;
  changed_by: string;
  description: string;
  created_at: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface PartnerItem {
  id: number;
  name: string;
  logo: string;
  url: string;
  h: string;
}

const DEFAULT_PARTNERS: PartnerItem[] = [
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

const formatRupiah = (value: string) => {
  if (!value) return "Rp ";
  const clean = value.replace(/[^0-9]/g, "");
  if (!clean) return "Rp ";
  const num = parseInt(clean, 10);
  return "Rp " + num.toLocaleString("id-ID");
};

const formatPhoneNumber = (value: string) => {
  if (!value) return "";

  let clean = value.replace(/[^\d+]/g, "");

  if (clean.startsWith("0")) {
    clean = "+62" + clean.slice(1);
  }
  // If it starts with '62', prepend '+'
  else if (clean.startsWith("62")) {
    clean = "+" + clean;
  }
  // If it doesn't start with '+62' and isn't empty, prepend '+62'
  else if (clean && !clean.startsWith("+62")) {
    if (clean.startsWith("+")) {
      clean = "+62" + clean.slice(1);
    } else {
      clean = "+62" + clean;
    }
  }
  
  return clean;
};

const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website smktarunabhakti.net dan mengisi data lengkap." },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran sebesar Rp 250.000 via Transfer Bank." },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Konfirmasi data pendaftaran otomatis via WhatsApp" },
  { id: 4, title: "Pemberkasan & Seragam", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru." },
  { id: 5, title: "Uji Kelayakan (Tes Seleksi)", desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa." },
  { id: 6, title: "Pengumuman & Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru melalui web smktarunabhakti.net." }
];

const DEFAULT_FAQ: FaqItem[] = [
  {
    q: "Bagaimana cara melakukan pembayaran biaya pendaftaran?",
    a: "Pembayaran administrasi pendaftaran dapat diselesaikan melalui Transfer Bank Manual ke rekening resmi yayasan sekolah. Setelah melakukan transfer, harap unggah bukti transfer di portal pendaftaran untuk divalidasi oleh panitia."
  },
  {
    q: "Apa saja berkas persyaratan fisik yang wajib dibawa ke sekolah?",
    a: "Calon peserta didik baru diimbau membawa berkas asli and fotokopi berupa: 1) Kartu Keluarga (KK), 2) KTP Orang Tua (Ayah & Ibu), 3) Akta Kelahiran, 4) Ijazah SMP/sederajat atau Surat Keterangan Lulus (SKL) resmi dilegalisir, dan 5) Pas foto berwarna terbaru ukuran 3x4 sebanyak 3 lembar."
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

const DEFAULT_MAJORS: MajorItem[] = [
  {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
    color: "#0066ff",
    careers: [
      { title: "Fullstack Web Developer", desc: "Merancang dan membangun arsitektur frontend dan backend aplikasi web modern." },
      { title: "Mobile Application Developer", desc: "Mengembangkan aplikasi mobile berkinerja tinggi untuk iOS dan Android." },
      { title: "Game Programmer", desc: "Menulis kode logika interaktif, AI musuh, dan fisika game menggunakan engine Unity." },
      { title: "Cloud Integration Specialist", desc: "Mengelola arsitektur server awan yang aman, andal, dan skalabel dengan AWS." }
    ],
    facilities: [
      "iMac Core-i9 Software Developer Lab",
      "ASUS ROG Game & Production Lab",
      "Smart Interactive Classroom (Smartboard Integrated)",
      "AWS Cloud Academy Learning Station",
      "Google Developer Partner Studio Lab"
    ],
    logo: "/assets/jurusan/pplg.png",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop", caption: "Sesi Kolaborasi UI/UX & Coding Project" },
      { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop", caption: "Peer Programming Workshop Siswa RPL" },
      { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop", caption: "Praktik Penulisan Kode Algoritma Kompleks" },
      { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop", caption: "Presentasi Pitching Project Akhir Semester" }
    ]
  },
  {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
    color: "#0ea5e9",
    careers: [
      { title: "Network Engineer", desc: "Merancang, memasang, dan memelihara sistem jaringan korporasi multi-lokasi." },
      { title: "Cybersecurity Analyst", desc: "Melindungi aset data digital perusahaan dari ancaman hacker dan intrusi jaringan." },
      { title: "System Administrator", desc: "Menjamin kestabilan, performa, dan pencadangan data otomatis di server perusahaan." },
      { title: "Fiber Optic Specialist", desc: "Menginstalasi dan menyambung infrastruktur kabel serat optik kecepatan tinggi." }
    ],
    facilities: [
      "CISCO Academy Network Design Lab",
      "Mikrotik Academy Certified Lab",
      "Cyber Security Operations Center (CSOC) Lab",
      "FTTH & Fiber Optic Splicing Lab",
      "Virtualization & Private Cloud Server Sandbox"
    ],
    logo: "/assets/jurusan/tjkt.png",
    banner: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop", caption: "Perawatan Server & Switch di Rack Data Center" },
      { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop", caption: "Konfigurasi Router & Debugging Jaringan" },
      { url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop", caption: "Penyambungan Kabel FO menggunakan Fusion Splicer" },
      { url: "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=600&auto=format&fit=crop", caption: "Simulasi Pertahanan Cyber & Ethical Hacking" }
    ]
  },
  {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
    color: "#6366f1",
    careers: [
      { title: "UI/UX Designer", desc: "Merancang pengalaman pengguna dan tampilan visual aplikasi agar mudah dan indah." },
      { title: "Graphic Designer", desc: "Membuat konsep dan eksekusi visual promosi, brosur, media sosial, dan materi cetak." },
      { title: "Brand Identity Specialist", desc: "Membangun sistem identitas visual yang khas dan kuat untuk klien bisnis global." },
      { title: "Commercial Photographer", desc: "Mengambil gambar produk bernilai tinggi untuk katalog e-commerce dan periklanan." }
    ],
    facilities: [
      "Wacom Creative Illustration Lab",
      "Professional Photography & Studio Lighting Room",
      "UI/UX Prototyping Sandbox Lab",
      "Adobe Certified Professional Lab",
      "Large-Format Digital Printing Center"
    ],
    logo: "/assets/jurusan/dkv.png",
    banner: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=600&auto=format&fit=crop", caption: "Kolaborasi Pembuatan Wireframe di Figma" },
      { url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop", caption: "Praktik Menggambar Karakter dengan Wacom Tablet" },
      { url: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop", caption: "Seni Pengambilan Gambar Produk Komersial" },
      { url: "https://images.unsplash.com/photo-1534972195531-d756b9bda9f2?q=80&w=600&auto=format&fit=crop", caption: "Penyuntingan Aset Visual & Layout Kreatif" }
    ]
  },
  {
    code: "BC",
    title: "Broadcasting & Perfilman",
    desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
    color: "#f59e0b",
    careers: [
      { title: "Video Editor & Colorist", desc: "Merangkai potongan klip, menata warna visual, serta audio di industri periklanan & film." },
      { title: "Director of Photography (DoP)", desc: "Menentukan sudut kamera, pencahayaan, dan menangkap gambar sinematik." },
      { title: "Broadcast Systems Operator", desc: "Mengoperasikan switcher dan audio console pada penyiaran TV atau event live stream." },
      { title: "Creative Content Producer", desc: "Merancang ide segar dan memproduksi acara talkshow, video pendek, atau podcast." }
    ],
    facilities: [
      "iMac Video Editing Suite Lab (DaVinci Certified)",
      "Green Screen Virtual Studio Room",
      "TV Control Room with Professional Switchers",
      "Soundproof Podcasting & Sound Design Studio",
      "High-End Camera Equipment Gear Room"
    ],
    logo: "/assets/jurusan/bc.png",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop", caption: "Pengoperasian Kamera Sinema & Lensa Manual" },
      { url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600&auto=format&fit=crop", caption: "Sesi Rekaman Podcast & Mixing Suara" },
      { url: "https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?q=80&w=600&auto=format&fit=crop", caption: "Color Grading Sesi Video Post-Production" },
      { url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop", caption: "Syuting Film Pendek Praktik Kelas Sinematografi" }
    ]
  },
  {
    code: "ANM",
    title: "Animasi",
    desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
    color: "#ec4899",
    careers: [
      { title: "3D Animator", desc: "Menghidupkan model 3D melalui simulasi gerak realistis untuk film bioskop & game." },
      { title: "3D Modeler & Texturer", desc: "Membangun aset digital 3D, objek, bangunan, serta tekstur realistis." },
      { title: "VFX Compositor", desc: "Mengintegrasikan efek visual digital (CGI) dengan video rekaman nyata." },
      { title: "Concept & Storyboard Artist", desc: "Membuat draf sketsa visual alur cerita film sebelum masuk tahap produksi." }
    ],
    facilities: [
      "iMac Render Farm Studio Lab",
      "Wacom Cintiq Advanced Drawing Studio",
      "Full Body Motion Capture (MoCap) System Studio",
      "Professional Sound Dubbing & Sound FX Studio",
      "VFX Processing & Rendering Farm Node Cluster"
    ],
    logo: "/assets/jurusan/animasi.png",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop", caption: "Proses Rigging Persendian Karakter 3D" },
      { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop", caption: "Digital Art & Painting Karakter Fantasi" },
      { url: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=600&auto=format&fit=crop", caption: "Pemodelan Aset Rumah 3D (3D Modeling)" },
      { url: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=600&auto=format&fit=crop", caption: "Siswa Menggunakan Baju Sensor Motion Capture" }
    ]
  },
  {
    code: "TE",
    title: "Teknik Elektronika",
    desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
    color: "#10b981",
    careers: [
      { title: "IoT Research & Developer", desc: "Merancang sirkuit dan sensor cerdas berbasis cloud untuk rumah & industri pintar." },
      { title: "Robotics Technician", desc: "Membuat, memprogram, dan memelihara robot otomatis di pabrik perakitan." },
      { title: "Industrial Automation Engineer", desc: "Mengembangkan program kontroler PLC mesin produksi agar efisien dan aman." },
      { title: "Hardware Support Specialist", desc: "Mendiagnosis kerusakan dan memperbaiki sirkuit elektronik digital tingkat lanjut." }
    ],
    facilities: [
      "Robotics Design & Assembly Workshop",
      "IoT Smart-Home Integration Prototype Lab",
      "PLC Siemens & Omron Certified Lab",
      "Precision Soldering & Osciloscope Lab Station",
      "Microcontroller sandbox environment"
    ],
    logo: "/assets/jurusan/te.png",
    banner: "https://images.unsplash.com/photo-1517055726410-dcbbb989d595?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop", caption: "Kalibrasi Sensor Lengan Robotik Cerdas" },
      { url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop", caption: "Wiring Modul IoT Sensor Pintar" },
      { url: "https://images.unsplash.com/photo-1596244244153-c52734b415a0?q=80&w=600&auto=format&fit=crop", caption: "Praktik Solder Sirkuit Elektronika Analog" },
      { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop", caption: "Pemrograman PLC Omron untuk Mesin Konveyor" }
    ]
  }
];

export default function KelolaUserInterface() {
  const { adminToken, fetchConfigs, ppdbTitle, isDemoMode } = usePPDB();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "majors" | "alur" | "form" | "faq" | "revisions" | "bank" | "partners">("hero");
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params?.school_slug as string || "";
  const draftKey = `ppdb_ui_editor_draft_${slug}`;
  const router = useRouter();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["hero", "majors", "alur", "form", "faq", "revisions", "bank", "partners"].includes(tab)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // ── Form Fields Config (Task 3) ───────────────────────────────────────────
  const DEFAULT_FIELDS_CONFIG_UI: Record<string, { label: string; required: boolean; active: boolean }> = {
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
    whatsapp: { label: "Nomor WhatsApp", required: true, active: true },
    email: { label: "Alamat Email", required: false, active: true },
    tinggalDengan: { label: "Tinggal Dengan", required: true, active: true },
    transportasi: { label: "Transportasi", required: true, active: true },
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
    berkasPrestasi: { label: "Berkas Prestasi", required: false, active: true },
    jenisBeasiswa: { label: "Jenis Beasiswa", required: false, active: true },
    uraianBeasiswa: { label: "Uraian Beasiswa", required: false, active: true },
    tahunMulaiBeasiswa: { label: "Tahun Mulai Beasiswa", required: false, active: true },
    tahunSelesaiBeasiswa: { label: "Tahun Selesai Beasiswa", required: false, active: true },
    sekolahAsal: { label: "Sekolah Asal (SMP/MTs)", required: true, active: true },
    tglLulus: { label: "Tanggal Lulus SMP", required: true, active: true },
    noIjazah: { label: "No. Seri Ijazah", required: false, active: true },
    noSKHUN: { label: "No. Seri SKHUN", required: false, active: true },
    noPesertaUN: { label: "No. Peserta UN", required: false, active: true },
    lamaBelajar: { label: "Lama Belajar (Tahun)", required: true, active: true },
    pindahanDari: { label: "Pindahan Dari", required: false, active: true },
    alasanPindah: { label: "Alasan Pindah", required: false, active: true },
    diterimaKelas: { label: "Diterima Kelas", required: true, active: true },
    jurusan1: { label: "Program Keahlian (Jurusan)", required: true, active: true },
    alasanMemilih: { label: "Alasan Memilih Jurusan", required: false, active: true },
    namaAyah: { label: "Nama Ayah", required: true, active: true },
    tempatLahirAyah: { label: "Tempat Lahir Ayah", required: true, active: true },
    tglLahirAyah: { label: "Tanggal Lahir Ayah", required: true, active: true },
    agamaAyah: { label: "Agama Ayah", required: true, active: true },
    kewarganegaraanAyah: { label: "Kewarganegaraan Ayah", required: true, active: true },
    pendidikanAyah: { label: "Pendidikan Ayah", required: true, active: true },
    pekerjaanAyah: { label: "Pekerjaan Ayah", required: true, active: true },
    penghasilanAyah: { label: "Penghasilan Ayah", required: true, active: true },
    alamatAyah: { label: "Alamat Lengkap Ayah", required: true, active: true },
    statusAyah: { label: "Status Ayah", required: true, active: true },
    namaIbu: { label: "Nama Ibu", required: true, active: true },
    tempatLahirIbu: { label: "Tempat Lahir Ibu", required: true, active: true },
    tglLahirIbu: { label: "Tanggal Lahir Ibu", required: true, active: true },
    agamaIbu: { label: "Agama Ibu", required: true, active: true },
    kewarganegaraanIbu: { label: "Kewarganegaraan Ibu", required: true, active: true },
    pendidikanIbu: { label: "Pendidikan Ibu", required: true, active: true },
    pekerjaanIbu: { label: "Pekerjaan Ibu", required: true, active: true },
    penghasilanIbu: { label: "Penghasilan Ibu", required: true, active: true },
    alamatIbu: { label: "Alamat Lengkap Ibu", required: true, active: true },
    statusIbu: { label: "Status Ibu", required: true, active: true },
    namaWali: { label: "Nama Wali", required: false, active: true },
    tempatLahirWali: { label: "Tempat Lahir Wali", required: false, active: true },
    tglLahirWali: { label: "Tanggal Lahir Wali", required: false, active: true },
    agamaWali: { label: "Agama Wali", required: false, active: true },
    kewarganegaraanWali: { label: "Kewarganegaraan Wali", required: false, active: true },
    pendidikanWali: { label: "Pendidikan Wali", required: false, active: true },
    pekerjaanWali: { label: "Pekerjaan Wali", required: false, active: true },
    penghasilanWali: { label: "Penghasilan Wali", required: false, active: true },
    alamatWali: { label: "Alamat Lengkap Wali", required: false, active: true },
    statusWali: { label: "Status Wali", required: false, active: true },
    teleponOrtu: { label: "Telepon Orang Tua", required: true, active: true },
    nilaiUSTeori: { label: "Nilai US Teori", required: false, active: true },
    nilaiUSPraktik: { label: "Nilai US Praktik", required: false, active: true },
    nilaiMuatanLokal: { label: "Nilai Muatan Lokal", required: false, active: true },
    citaCita: { label: "Cita-cita Utama", required: false, active: true },
    hobi: { label: "Hobi", required: false, active: true },
    pelajaranDisenangi: { label: "Pelajaran Disenangi", required: false, active: true },
    alasanDisenangi: { label: "Alasan Menyenangi Pelajaran", required: false, active: true },
    kesulitanBelajar: { label: "Kesulitan Belajar", required: false, active: true },
    citaCitaSetelahLulus: { label: "Rencana Setelah Lulus", required: false, active: true },
    punyaKPS: { label: "Status KPS", required: false, active: true },
    noKPS: { label: "Nomor KPS", required: false, active: true },
    punyaKIP: { label: "Status KIP", required: false, active: true },
    noKIP: { label: "Nomor KIP", required: false, active: true },
  };
  const [fieldsConfigUI, setFieldsConfigUI] = useState<Record<string, { label: string; required: boolean; active: boolean }>>(DEFAULT_FIELDS_CONFIG_UI);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [changeDescription, setChangeDescription] = useState("");

  const [heroTitle, setHeroTitle] = useState("Penerimaan Siswa Baru");
  const [heroTitleSub, setHeroTitleSub] = useState("Portal PPDB Online");
  const [heroSubtitle, setHeroSubtitle] = useState("Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi informasi.");
  const [phone, setPhone] = useState("-");
  const [email, setEmail] = useState("info@sekolah.sch.id");
  const [address, setAddress] = useState("Alamat Lengkap Sekolah");
  const [mapTitle, setMapTitle] = useState("Kunjungi Kampus Kami");
  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolTitle, setSchoolTitle] = useState("Portal PPDB");
  const [footerDesc, setFooterDesc] = useState("Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global.");

  const [gelombangConfig, setGelombangConfig] = useState({
    gelombang1: { start: "2026-06-03", end: "2026-07-24" },
    gelombang2: { start: "2026-07-25", end: "2026-08-30" }
  });
  const [g1Error, setG1Error] = useState<string | null>(null);
  const [g2Error, setG2Error] = useState<string | null>(null);

  const [bankConfigList, setBankConfigList] = useState<Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>>([
    {
      bankName: "Bank Mandiri",
      accountNumber: "157-00-0174092-2",
      accountHolder: "Yayasan Taruna Bhakti"
    }
  ]);

  const [alurList, setAlurList] = useState<AlurItem[]>(DEFAULT_ALUR);
  const [majorsList, setMajorsList] = useState<MajorItem[]>(DEFAULT_MAJORS);
  const [partnersList, setPartnersList] = useState<PartnerItem[]>(DEFAULT_PARTNERS);
  const [revisions, setRevisions] = useState<RevisionLog[]>([]);
  const [faqTitle, setFaqTitle] = useState("Pertanyaan yang Sering Diajukan");
  const [faqSubtitle, setFaqSubtitle] = useState("Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru.");
  const [faqList, setFaqList] = useState<FaqItem[]>([]);

  const [editingMajor, setEditingMajor] = useState<MajorItem | null>(null);
  const [isNewMajor, setIsNewMajor] = useState(false);
  const [dragActiveStates, setDragActiveStates] = useState<Record<string, boolean>>({});

  const emptyMajor = (): MajorItem => ({
    code: "",
    title: "",
    desc: "",
    color: "#0066ff",
    careers: [
      { title: "", desc: "" },
      { title: "", desc: "" },
      { title: "", desc: "" },
      { title: "", desc: "" }
    ],
    facilities: ["Laboratorium Praktikum Baru"],
    logo: "",
    banner: "",
    video: "",
    gallery: [
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" }
    ]
  });

  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.055845577626!2d106.867407!3d-6.3844792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebaff005f277%3A0x9fcd41028665eea8!2sSMK%20Taruna%20Bhakti%20Depok!5e0!3m2!1sen!2sid!4v1683883446098!5m2!1sen!2sid");
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [waGroupUrl, setWaGroupUrl] = useState("https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS");
  const [waAdmin, setWaAdmin] = useState("6281292244456");
  const [formGuideline, setFormGuideline] = useState("Silakan isi formulir pendaftaran calon siswa dengan lengkap dan benar. Berkas persyaratan wajib diunggah dalam format gambar (PNG/JPG) maksimal 2MB.");
  const [formFee, setFormFee] = useState("250000");
  const [isLandingPageActive, setIsLandingPageActive] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchCurrentConfig();
    fetchRevisions();
  }, []);

  // Auto-save unsaved draft to localStorage whenever form states change
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
      ppdb_partners_config: partnersList,
      ppdb_logo_url: schoolLogo,
      ppdb_title: schoolTitle,
      ppdb_footer_desc: footerDesc,
    };

    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch (error) {
      console.warn("Gagal menyimpan draft ke localStorage (kuota penuh):", error);
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
    partnersList,
    schoolLogo,
    schoolTitle,
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

      // Load draft from localStorage if present
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
  };

  useEffect(() => {
    if (ppdbTitle && ppdbTitle !== "PPDB SMK TB") {
      setSchoolTitle(prev => prev === "Portal PPDB" || prev.startsWith("PPDB PPDB") ? `PPDB ${ppdbTitle}` : prev);
      setHeroTitleSub(prev => prev === "Portal PPDB Online" || prev.startsWith("Portal PPDB PPDB") ? `Portal PPDB ${ppdbTitle}` : prev);
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
  };

  const handleDragState = (e: React.DragEvent, elementId: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates(prev => ({ ...prev, [elementId]: active }));
  };

  const processMediaFile = async (file: File, type: "logo" | "banner" | "video" | "gallery-0" | "gallery-1" | "gallery-2" | "gallery-3") => {
    const isVideo = type === "video";
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (isVideo) {
      const allowedVideoExts = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi'];
      if (!file.type.startsWith("video/") && !allowedVideoExts.includes(fileExt)) {
        showToastMsg("Hanya berkas video (MP4/WebM/MOV/MKV) yang diperbolehkan.", "error");
        return;
      }
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        showToastMsg("Ukuran file video maksimal adalah 15MB.", "error");
        return;
      }
    } else {
      const allowedImgExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
      if (!file.type.startsWith("image/") && !allowedImgExts.includes(fileExt)) {
        showToastMsg("Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan.", "error");
        return;
      }
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for banners/gallery
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

  const handleAddAlur = () => {
    const nextId = alurList.length > 0 ? Math.max(...alurList.map(a => a.id)) + 1 : 1;
    setAlurList([...alurList, { id: nextId, title: "Langkah Baru", desc: "Deskripsi langkah pendaftaran baru..." }]);
  };

  const handleUpdateAlur = (id: number, key: keyof AlurItem, val: string | number) => {
    setAlurList(alurList.map(a => a.id === id ? { ...a, [key]: val } : a));
  };

  const handleRemoveAlur = (id: number) => {
    setAlurList(alurList.filter(a => a.id !== id).map((a, i) => ({ ...a, id: i + 1 })));
  };

  const handleMoveAlur = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === alurList.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...alurList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((item, idx) => ({ ...item, id: idx + 1 }));
    setAlurList(reordered);
  };

  const handleAddFaq = () => {
    setFaqList([...faqList, { q: "Pertanyaan Baru?", a: "Tuliskan jawaban di sini." }]);
  };

  const handleUpdateFaq = (index: number, key: keyof FaqItem, val: string) => {
    setFaqList(faqList.map((f, i) => i === index ? { ...f, [key]: val } : f));
  };

  const handleRemoveFaq = (index: number) => {
    setFaqList(faqList.filter((_, i) => i !== index));
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === faqList.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...faqList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setFaqList(copy);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Sanitize finalMajors gallery URLs to prevent Zod validation errors (expected string to have >=1 characters)
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
        // Save to localStorage so that daftar/page.tsx can pick it up in offline/demo mode
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
        localStorage.removeItem("ppdb_ui_editor_draft");
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

  const handleRestore = async (revId: number) => {
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
        localStorage.removeItem("ppdb_ui_editor_draft");
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
    try {
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (_e) {
      return dateString;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500 relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-xs font-bold animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900" 
            : toast.type === "error"
            ? "bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900"
            : "bg-indigo-50 dark:bg-indigo-950/90 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900"
        }`}>
          {toast.type === "success" ? <Check size={16} /> : toast.type === "error" ? <X size={16} /> : <Info size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm w-full mx-4">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Menyimpan Perubahan...</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Menulis riwayat ke database</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-900/40 shrink-0">
            <Palette size={22} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">Kelola User Interface</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">Edit Semua Foto, Teks, Jurusan, dan Formulir PPDB secara Real-time</p>
          </div>
        </div>
        
        <div className="flex gap-2.5">
          {mounted && typeof window !== "undefined" && localStorage.getItem(draftKey) && (
            <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'Konfirmasi',
                  text: "Apakah Anda yakin ingin membatalkan semua draf perubahan yang belum disimpan dan memuat ulang data asli dari server?",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Ya',
                  cancelButtonText: 'Batal'
                });
                if (result.isConfirmed) {
                  localStorage.removeItem(draftKey);
                  fetchCurrentConfig();
                }
              }}
              className="px-4 py-3 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Draf</span>
            </button>
          )}
          
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check size={14} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Landing Page & Subdomain Public Status Control Banner */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
            isLandingPageActive
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-800"
          }`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-800 dark:text-white">
                Status Landing Page / Subdomain Sekolah
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isLandingPageActive 
                  ? "bg-emerald-500 text-white" 
                  : "bg-rose-500 text-white"
              }`}>
                {isLandingPageActive ? "PUBLIK (LIVE)" : "DITUTUP (DRAFT)"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isLandingPageActive 
                ? "Landing page publik aktif. Pengunjung dapat mengakses portal & mendaftar."
                : "Landing page ditutup sementara. Pengunjung akan melihat informasi pemeliharaan."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href={`/${slug || "demo"}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </a>
          <button
            onClick={handleToggleLandingPageStatus}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
              isLandingPageActive
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/15"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/15"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isLandingPageActive ? "Tutup Landing Page" : "Buka Landing Page"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-100 dark:bg-[#1e293b]/50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/70 dark:border-slate-800/40 flex flex-wrap gap-1 mb-6 transition-all duration-300">
        {[
          { id: "hero", label: "General/Umum", icon: FileText },
          { id: "majors", label: "Program Keahlian (Jurusan)", icon: GraduationCap },
          { id: "alur", label: "Alur Pendaftaran", icon: Settings },
          { id: "form", label: "Form & Panduan", icon: Info },
          { id: "bank", label: "Rekening Bank Sekolah", icon: Database },
          { id: "faq", label: "Pertanyaan (FAQ)", icon: HelpCircle },
          { id: "partners", label: "Partner Industri", icon: Briefcase },
          { id: "revisions", label: "Riwayat Perubahan", icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              disabled={editingMajor !== null && tab.id !== "majors"}
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setActiveTab(tab.id as any);
                router.push(`?tab=${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 border border-transparent rounded-xl ${
                editingMajor !== null && tab.id !== "majors" ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
              } ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-900/80"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Memuat Konfigurasi...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: General / Umum */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building size={18} className="text-blue-600 dark:text-blue-500" />
                    <span>Logo &amp; Nama Instansi (Header Website)</span>
                  </h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  {/* Logo Drag & Drop */}
                  <div className="flex flex-col items-start gap-3 shrink-0">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Logo Instansi (Header)</label>
                    <div
                      className={`w-full md:w-56 h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all duration-300 ${
                        dragActiveStates["school_logo"]
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50"
                      }`}
                      onDragEnter={(e) => handleDragState(e, "school_logo", true)}
                      onDragOver={(e) => handleDragState(e, "school_logo", true)}
                      onDragLeave={(e) => handleDragState(e, "school_logo", false)}
                      onDrop={(e) => {
                        handleDragState(e, "school_logo", false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleSchoolLogoChange(file);
                      }}
                    >
                      {schoolLogo && (schoolLogo.startsWith('data:image/') || schoolLogo.startsWith('https://')) ? (
                        <img src={schoolLogo} alt="Logo Sekolah" className="max-w-full max-h-full object-contain rounded-lg" />
                      ) : (
                        <div className="text-center text-slate-500 dark:text-slate-400">
                          <Upload size={24} className="mx-auto mb-2 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
                          <span className="text-xs font-medium">Upload Logo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSchoolLogoChange(file);
                        }}
                      />
                    </div>
                  </div>

                  {/* Nama Sekolah / Title */}
                  <div className="flex-1 space-y-4 text-left w-full">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Instansi / Singkatan (Header)</label>
                      <input
                        type="text"
                        value={schoolTitle}
                        onChange={(e) => setSchoolTitle(e.target.value)}
                        placeholder="Contoh: PPDB SMK TB"
                        className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mt-8 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={18} className="text-blue-600 dark:text-blue-500" />
                    <span>Hero Section &amp; Header Utama</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Title (Judul Utama)</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="Contoh: Penerimaan Siswa Baru"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Sub-Title (Judul Pelengkap)</label>
                    <input
                      type="text"
                      value={heroTitleSub}
                      onChange={(e) => setHeroTitleSub(e.target.value)}
                      placeholder="Contoh: Portal PPDB SMK Taruna Bhakti"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Subtitle (Deskripsi Paragraf)</label>
                    <textarea
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      rows={3}
                      placeholder="Tuliskan deskripsi singkat mengenai portal pendaftaran di halaman utama..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y"
                    />
                  </div>
                </div>

                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mt-8 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Info size={18} className="text-blue-600 dark:text-blue-500" />
                    <span>Informasi Sekolah &amp; Google Maps</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Judul Seksi Google Maps</label>
                    <input
                      type="text"
                      value={mapTitle}
                      onChange={(e) => setMapTitle(e.target.value)}
                      placeholder="Contoh: Kunjungi Kampus Sekolah"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google Maps Embed iFrame URL</label>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Auto-Extract &lt;iframe&gt; src</span>
                    </div>
                    <input
                      type="text"
                      value={mapUrl}
                      onChange={(e) => {
                        let val = e.target.value.trim();
                        const srcMatch = val.match(/src=["']([^"']+)["']/i);
                        if (srcMatch && srcMatch[1]) {
                          val = srcMatch[1];
                        }
                        setMapUrl(val);
                      }}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      💡 <strong>Cara ambil:</strong> Buka Google Maps ➔ Cari lokasi sekolah ➔ Klik tombol <strong>Bagikan (Share)</strong> ➔ Pilih tab <strong>Sematkan peta (Embed a map)</strong> ➔ Klik <strong>Salin HTML</strong> lalu tempel (paste) langsung ke kotak ini.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nomor Telepon Sekolah</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                      placeholder="Contoh: +62218740756"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Resmi Sekolah</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Contoh: info@smktarunabhakti.sch.id"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tahun Pelajaran Terbit (Periode)</label>
                    <input
                      type="text"
                      value={schoolPeriod}
                      onChange={(e) => setSchoolPeriod(e.target.value)}
                      placeholder="Contoh: 2026-2027"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat Fisik Sekolah</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Alamat lengkap sekolah..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Deskripsi Singkat Footer</label>
                    <textarea
                      value={footerDesc}
                      onChange={(e) => setFooterDesc(e.target.value)}
                      rows={2}
                      placeholder="Pionir pendidikan kejuruan teknologi informasi..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y"
                    />
                  </div>


                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Link Grup WhatsApp PPDB Calon Siswa</label>
                    <input
                      type="text"
                      value={waGroupUrl}
                      onChange={(e) => setWaGroupUrl(e.target.value)}
                      placeholder="Contoh: https://chat.whatsapp.com/..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nomor WhatsApp Tim PPDB (Konsultasi)</label>
                    <input
                      type="text"
                      value={waAdmin}
                      onChange={(e) => setWaAdmin(formatPhoneNumber(e.target.value))}
                      placeholder="Contoh: +6281292244456"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* CONSOLDATION: Gelombang Pendaftaran Section inside General / Umum */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-8 pb-4 mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-600 dark:text-indigo-500" />
                    <span>Rentang Tanggal Gelombang Pendaftaran</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Konfigurasikan masa aktif Gelombang 1 dan Gelombang 2 untuk portal pendaftaran.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gelombang 1 */}
                  <DateRangeCalendar
                    label="Gelombang 1"
                    startValue={gelombangConfig.gelombang1.start}
                    endValue={gelombangConfig.gelombang1.end}
                    onSelectRange={(start, end) => {
                      setGelombangConfig(prev => ({
                        ...prev,
                        gelombang1: { start, end }
                      }));
                    }}
                    excludeRange={gelombangConfig.gelombang2.start && gelombangConfig.gelombang2.end ? gelombangConfig.gelombang2 : null}
                    error={g1Error}
                    setError={setG1Error}
                  />

                  {/* Gelombang 2 */}
                  <DateRangeCalendar
                    label="Gelombang 2"
                    startValue={gelombangConfig.gelombang2.start}
                    endValue={gelombangConfig.gelombang2.end}
                    onSelectRange={(start, end) => {
                      setGelombangConfig(prev => ({
                        ...prev,
                        gelombang2: { start, end }
                      }));
                    }}
                    excludeRange={gelombangConfig.gelombang1.start && gelombangConfig.gelombang1.end ? gelombangConfig.gelombang1 : null}
                    error={g2Error}
                    setError={setG2Error}
                  />
                </div>

              </div>
            )}

            {/* TAB 2: Program Keahlian (Jurusan) */}
            {activeTab === "majors" && (
              <div className="space-y-6">
                {/* 1. If NOT editing: Render Grid Cards */}
                {editingMajor === null ? (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                          <GraduationCap size={16} className="text-blue-500" />
                          <span>Kompetensi Keahlian (Jurusan)</span>
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Klik salah satu kartu jurusan untuk membuka Workspace Editor penuh secara inline.</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewMajor(true);
                          setEditingMajor(emptyMajor());
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase font-black tracking-wider transition-all shadow-md shadow-blue-500/10 shrink-0 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Tambah Jurusan Baru</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {majorsList.map((major) => (
                        <div
                          key={major.code}
                          onClick={() => setEditingMajor({ ...major })}
                          className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800/65 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: major.color }} />
                          
                          {/* Card Preview Banner Frame */}
                          <div className="h-40 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-b border-slate-200 dark:border-slate-800/60 dark:border-white/5">
                            {major.banner ? (
                              <img 
                                src={DOMPurify.sanitize(sanitizeSrc(major.banner))} 
                                alt={major.title} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                              />
                            ) : (
                              <div className="text-slate-400 flex flex-col items-center gap-2">
                                <ImageIcon size={32} />
                                <span className="text-[8px] font-black uppercase">Tanpa Banner</span>
                              </div>
                            )}
                            
                            {/* Badges Overlay */}
                            <div className="absolute top-3 left-3 px-3 py-1 text-[9px] font-black uppercase text-white rounded-full shadow" style={{ backgroundColor: major.color }}>
                              {major.code}
                            </div>

                            {/* Delete Button Overlay */}
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const result = await Swal.fire({
                                  title: 'Konfirmasi',
                                  text: `Apakah Anda yakin ingin menghapus jurusan ${major.title} (${major.code}) secara lokal? Klik "Simpan Perubahan" di atas untuk menyimpan secara permanen.`,
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonText: 'Ya',
                                  cancelButtonText: 'Batal'
                                });
                                if (result.isConfirmed) {
                                  setMajorsList(prev => prev.filter(m => m.code !== major.code));
                                  showToastMsg(`Jurusan ${major.code} dihapus secara lokal. Silakan klik "Simpan Perubahan" di pojok kanan atas untuk menerapkannya secara permanen.`, "info");
                                }
                              }}
                              className="absolute top-3 right-3 p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl shadow-lg border border-rose-500/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 transform translate-y-[-4px] group-hover:translate-y-0 z-10 hover:scale-105 cursor-pointer"
                              title="Hapus Jurusan"
                            >
                              <Trash2 size={13} />
                            </button>

                            <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-[#0f172a]/90 p-0.5 border shadow border-white/20">
                              {major.logo ? (
                                <img src={DOMPurify.sanitize(sanitizeSrc(major.logo))} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
                                  <GraduationCap size={18} />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Copy */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                                {major.title}
                              </h4>
                              <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-semibold">
                                {major.desc}
                              </p>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-600">
                              <span>Ubah Program Studi</span>
                              <Eye size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (

                  <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                      <button
                        onClick={() => {
                          setEditingMajor(null);
                          setIsNewMajor(false);
                        }}
                        className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-400 transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={12} />
                        <span>Kembali ke List Kartu</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <span className="w-3 h-6 rounded-full" style={{ backgroundColor: editingMajor.color }} />
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                          {isNewMajor ? "WORKSPACE BARU JURUSAN" : `WORKSPACE EDITOR JURUSAN: ${editingMajor.code}`}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: General & Media Uploaders */}
                      <div className="lg:col-span-1 space-y-6">
                        
                        {/* 2.1 Logo Drag & Drop - Custom Adjusted Size as requested */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 p-5 rounded-3xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Logo Kompetensi</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Akan tampil di badge lingkar beranda</span>
                            </div>
                            
                            {/* Adjusted circular logo size display as requested */}
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border shadow p-0.5 flex items-center justify-center text-slate-400">
                              {editingMajor.logo ? (
                                <img src={DOMPurify.sanitize(sanitizeSrc(editingMajor.logo))} alt="" className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <GraduationCap size={20} />
                              )}
                            </div>
                          </div>

                          <div
                            onDragEnter={(e) => handleDragState(e, "logo", true)}
                            onDragOver={(e) => handleDragState(e, "logo", true)}
                            onDragLeave={(e) => handleDragState(e, "logo", false)}
                            onDrop={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              setDragActiveStates(prev => ({ ...prev, logo: false }));
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                processMediaFile(e.dataTransfer.files[0], "logo");
                              }
                            }}
                            onClick={() => document.getElementById("logo-picker")?.click()}
                            className={`h-36 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
                              dragActiveStates.logo 
                                ? "border-blue-500 bg-blue-50/20" 
                                : "border-slate-300 dark:border-slate-800 hover:border-blue-500/60 bg-white dark:bg-[#0f172a]"
                            }`}
                            style={{
                              backgroundImage: editingMajor.logo ? `url(${editingMajor.logo})` : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "center"
                            }}
                          >
                            <input
                              id="logo-picker"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  processMediaFile(e.target.files[0], "logo");
                                }
                              }}
                              className="hidden"
                            />
                            {/* Glassmorphic Faded Overlay with Current Photo as Background as requested */}
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-90 group-hover:opacity-95 flex flex-col items-center justify-center text-white p-3">
                              <Upload size={20} className="animate-bounce text-blue-400 mb-1" />
                              <span className="text-[9px] font-black uppercase tracking-wider">Drag / Ganti Logo</span>
                              <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">Atau Klik Explorer</span>
                            </div>
                          </div>
                        </div>

                        {/* 2.2 Banner Image Drag & Drop - Custom Backdrop cue */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 p-5 rounded-3xl space-y-3">
                          <div>
                            <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Banner Utama Unsplash</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Tampil di header visual detail halaman</span>
                          </div>

                          <div
                            onDragEnter={(e) => handleDragState(e, "banner", true)}
                            onDragOver={(e) => handleDragState(e, "banner", true)}
                            onDragLeave={(e) => handleDragState(e, "banner", false)}
                            onDrop={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              setDragActiveStates(prev => ({ ...prev, banner: false }));
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                processMediaFile(e.dataTransfer.files[0], "banner");
                              }
                            }}
                            onClick={() => document.getElementById("banner-picker")?.click()}
                            className={`h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
                              dragActiveStates.banner 
                                ? "border-blue-500 bg-blue-50/20" 
                                : "border-slate-300 dark:border-slate-800 hover:border-blue-500/60 bg-white dark:bg-[#0f172a]"
                            }`}
                            style={{
                              backgroundImage: editingMajor.banner ? `url(${editingMajor.banner})` : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "center"
                            }}
                          >
                            <input
                              id="banner-picker"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  processMediaFile(e.target.files[0], "banner");
                                }
                              }}
                              className="hidden"
                            />
                            {/* Faded overlay using current banner as background */}
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-90 group-hover:opacity-95 flex flex-col items-center justify-center text-white p-3">
                              <Upload size={20} className="animate-bounce text-blue-400 mb-1" />
                              <span className="text-[9px] font-black uppercase tracking-wider">Drag / Ganti Banner</span>
                              <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">Atau Klik Explorer</span>
                            </div>
                          </div>
                        </div>

                        {/* 2.3 Video Upload Picker - Local File Explorer Uploader + Preview Player as requested */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 p-5 rounded-3xl space-y-3">
                          <div>
                            <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Video Profil Jurusan</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Upload dari file explorer (Maks. 15MB MP4/WebM)</span>
                          </div>

                          {editingMajor.video ? (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                              <video src={DOMPurify.sanitize(sanitizeSrc(editingMajor.video))} controls className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setEditingMajor({ ...editingMajor, video: "" })}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-lg shadow transition-colors"
                                title="Hapus Video"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div
                              onDragEnter={(e) => handleDragState(e, "video", true)}
                              onDragOver={(e) => handleDragState(e, "video", true)}
                              onDragLeave={(e) => handleDragState(e, "video", false)}
                              onDrop={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                setDragActiveStates(prev => ({ ...prev, video: false }));
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  processMediaFile(e.dataTransfer.files[0], "video");
                                }
                              }}
                              onClick={() => document.getElementById("video-picker")?.click()}
                              className={`h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
                                dragActiveStates.video 
                                  ? "border-blue-500 bg-blue-50/20" 
                                  : "border-slate-300 dark:border-slate-800 hover:border-blue-500/60 bg-white dark:bg-[#0f172a]"
                              }`}
                            >
                              <input
                                id="video-picker"
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    processMediaFile(e.target.files[0], "video");
                                  }
                                }}
                                className="hidden"
                              />
                              <div className="p-3 flex flex-col items-center">
                                <Video size={24} className="text-slate-400 mb-1.5 animate-pulse" />
                                <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Drag &amp; Drop Video MP4</span>
                                <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">Atau Klik Explorer</span>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Right: Core Fields, Careers, Facilities, Gallery */}
                      <div className="lg:col-span-2 space-y-6">
                        
                        {/* 2.4 General Texts */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 p-6 rounded-3xl space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">Informasi Umum</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Kode Jurusan (e.g. RPL, TJKT)</label>
                              <input
                                type="text"
                                value={editingMajor.code}
                                disabled={!isNewMajor}
                                onChange={(e) => setEditingMajor({ ...editingMajor, code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "") })}
                                placeholder="Masukkan kode jurusan..."
                                className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none ${!isNewMajor ? "opacity-50 cursor-not-allowed" : ""}`}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Nama Program Studi</label>
                              <input
                                type="text"
                                value={editingMajor.title}
                                onChange={(e) => setEditingMajor({ ...editingMajor, title: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                              <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Warna Hex Aksen</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={editingMajor.color}
                                  onChange={(e) => setEditingMajor({ ...editingMajor, color: e.target.value })}
                                  className="w-10 h-10 p-0 rounded-xl border-0 cursor-pointer overflow-hidden shrink-0"
                                />
                                <input
                                  type="text"
                                  value={editingMajor.color}
                                  onChange={(e) => setEditingMajor({ ...editingMajor, color: e.target.value })}
                                  className="flex-1 px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs uppercase focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Deskripsi Lengkap</label>
                            <textarea
                              value={editingMajor.desc}
                              onChange={(e) => setEditingMajor({ ...editingMajor, desc: e.target.value })}
                              rows={3}
                              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none resize-none"
                            />
                          </div>
                        </div>

                        {/* 2.5 Dynamic Gallery Slots - All 4 unsplash photos are completely editable from File Explorer with faded background cue as requested */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 p-6 rounded-3xl space-y-4">
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">Galeri Aktivitas (4 Foto &amp; Caption)</h4>
                            <span className="text-[8px] text-slate-400 font-bold block mt-1 uppercase">Ganti foto standard Unsplash menggunakan File Explorer Anda secara visual</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map((slotIdx) => {
                              const galItem = editingMajor.gallery[slotIdx] || { url: "", caption: "" };
                              const elementId = `gallery-${slotIdx}`;
                              
                              return (
                                <div key={slotIdx} className="border border-slate-200 dark:border-slate-800/60 dark:border-white/5 p-4.5 rounded-2xl bg-white dark:bg-[#0f172a] flex flex-col justify-between gap-3 shadow-sm">
                                  
                                  {/* Faded logo/photo backdrop dropzone box */}
                                  <div
                                    onDragEnter={(e) => handleDragState(e, elementId, true)}
                                    onDragOver={(e) => handleDragState(e, elementId, true)}
                                    onDragLeave={(e) => handleDragState(e, elementId, false)}
                                    onDrop={(e) => {
                                      e.preventDefault(); e.stopPropagation();
                                      setDragActiveStates(prev => ({ ...prev, [elementId]: false }));
                                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        processMediaFile(e.dataTransfer.files[0], `gallery-${slotIdx}` as any);
                                      }
                                    }}
                                    onClick={() => document.getElementById(`picker-gallery-${slotIdx}`)?.click()}
                                    className={`h-32 border border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
                                      dragActiveStates[elementId] 
                                        ? "border-blue-500 bg-blue-50/10" 
                                        : "border-slate-300 dark:border-slate-800 hover:border-blue-500/40"
                                    }`}
                                    style={{
                                      backgroundImage: galItem.url ? `url(${galItem.url})` : "none",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center"
                                    }}
                                  >
                                    <input
                                      id={`picker-gallery-${slotIdx}`}
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                          processMediaFile(e.target.files[0], `gallery-${slotIdx}` as any);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                    
                                    {/* Transparent backdrop overlay */}
                                    <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] opacity-80 group-hover:opacity-90 transition-opacity flex flex-col items-center justify-center text-white p-2">
                                      <ImageIcon size={18} className="text-blue-400 mb-1 animate-pulse" />
                                      <span className="text-[8px] font-black uppercase tracking-wider">Ganti Foto Galeri #{slotIdx+1}</span>
                                      <span className="text-[6px] font-bold text-slate-400 uppercase mt-0.5">Atau Klik Explorer</span>
                                    </div>
                                  </div>

                                  <input
                                    type="text"
                                    value={galItem.caption}
                                    onChange={(e) => {
                                      const updatedGallery = [...editingMajor.gallery];
                                      if (!updatedGallery[slotIdx]) updatedGallery[slotIdx] = { url: "", caption: "" };
                                      updatedGallery[slotIdx] = { ...updatedGallery[slotIdx], caption: e.target.value };
                                      setEditingMajor({ ...editingMajor, gallery: updatedGallery });
                                    }}
                                    placeholder={`Caption Foto #${slotIdx+1}`}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-lg text-slate-800 dark:text-white font-bold text-[10px] focus:outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2.6 Interactive Careers (4 slots) */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 p-6 rounded-3xl space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
                            Peluang Kerja / Karir Lulusan (4 Item)
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map((idx) => {
                              const career = editingMajor.careers[idx] || { title: "", desc: "" };
                              
                              return (
                                <div key={idx} className="p-4 border border-slate-200 dark:border-slate-800/60 dark:border-white/5 bg-white dark:bg-[#0f172a] rounded-2xl space-y-2">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Karir Lulusan #{idx+1}</span>
                                  <input
                                    type="text"
                                    value={career.title}
                                    onChange={(e) => {
                                      const updated = [...editingMajor.careers];
                                      if (!updated[idx]) updated[idx] = { title: "", desc: "" };
                                      updated[idx] = { ...updated[idx], title: e.target.value };
                                      setEditingMajor({ ...editingMajor, careers: updated });
                                    }}
                                    placeholder="Nama Profesi"
                                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-lg text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
                                  />
                                  <textarea
                                    value={career.desc}
                                    onChange={(e) => {
                                      const updated = [...editingMajor.careers];
                                      if (!updated[idx]) updated[idx] = { title: "", desc: "" };
                                      updated[idx] = { ...updated[idx], desc: e.target.value };
                                      setEditingMajor({ ...editingMajor, careers: updated });
                                    }}
                                    rows={2}
                                    placeholder="Penjelasan profesi..."
                                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-lg text-slate-800 dark:text-white font-semibold text-[10px] focus:outline-none resize-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2.7 Interactive Laboratory Facilities */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 p-6 rounded-3xl space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
                            Fasilitas Laboratorium &amp; Sarana Utama
                          </h4>

                          <div className="space-y-2.5">
                            {editingMajor.facilities.map((fac, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={fac}
                                  onChange={(e) => {
                                    const updated = [...editingMajor.facilities];
                                    updated[fIdx] = e.target.value;
                                    setEditingMajor({ ...editingMajor, facilities: updated });
                                  }}
                                  className="flex-1 px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = editingMajor.facilities.filter((_, i) => i !== fIdx);
                                    setEditingMajor({ ...editingMajor, facilities: updated });
                                  }}
                                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all shrink-0"
                                  title="Hapus Fasilitas"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                setEditingMajor({ ...editingMajor, facilities: [...editingMajor.facilities, "Laboratorium / Sarana Baru"] });
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[9px] uppercase tracking-wider font-black transition-colors shadow-sm"
                            >
                              <Plus size={12} />
                              <span>Tambah Baris Fasilitas</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* 2.8 Control Footer */}
                    <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-white/5 pt-4.5 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMajor(null);
                          setIsNewMajor(false);
                        }}
                        className="px-5 py-3 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-750 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!editingMajor.code.trim()) {
                            showToastMsg("Kode Jurusan wajib diisi.", "error");
                            return;
                          }
                          if (!editingMajor.title.trim()) {
                            showToastMsg("Nama Program Studi wajib diisi.", "error");
                            return;
                          }
                          
                          if (isNewMajor) {
                            const exists = majorsList.some(m => m.code.toUpperCase() === editingMajor.code.toUpperCase());
                            if (exists) {
                              showToastMsg(`Kode Jurusan "${editingMajor.code}" sudah terdaftar.`, "error");
                              return;
                            }
                            setMajorsList(prev => [...prev, editingMajor]);
                            setIsNewMajor(false);
                          } else {
                            setMajorsList(prev => prev.map(m => m.code === editingMajor.code ? editingMajor : m));
                          }
                          
                          const savedCode = editingMajor.code;
                          setEditingMajor(null);
                          showToastMsg(`Workspace ${savedCode} tersimpan secara lokal. Silakan klik "Simpan Perubahan" di pojok kanan atas untuk menerapkannya secara permanen.`, "success");
                        }}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Simpan Detail</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Alur Pendaftaran */}
            {activeTab === "alur" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                      <Settings size={16} className="text-blue-500" />
                      <span>Tahapan Proses / Alur Pendaftaran Calon Siswa</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Ubah, urutkan, tambah, atau hapus langkah pendaftaran</p>
                  </div>

                  <button
                    onClick={handleAddAlur}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Langkah Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {alurList.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 dark:border-white/5 rounded-3xl p-5 flex items-start gap-4 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow shadow-blue-500/10">
                        {idx + 1}
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Judul Langkah</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateAlur(item.id, "title", e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Deskripsi Singkat</label>
                          <input
                            type="text"
                            value={item.desc}
                            onChange={(e) => handleUpdateAlur(item.id, "desc", e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Sorting & Control Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-center">
                        <button
                          onClick={() => handleMoveAlur(idx, "up")}
                          disabled={idx === 0}
                          className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-[#1e293b] dark:border-white/5 dark:hover:bg-slate-900 transition-all ${
                            idx === 0 ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveAlur(idx, "down")}
                          disabled={idx === alurList.length - 1}
                          className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-[#1e293b] dark:border-white/5 dark:hover:bg-slate-900 transition-all ${
                            idx === alurList.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          onClick={() => handleRemoveAlur(item.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  ))}

                  {alurList.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      Belum ada alur tahapan. Tambah tahapan baru dengan tombol diatas.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Form & Panduan */}
            {activeTab === "form" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                  <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                    <Info size={16} className="text-blue-500" />
                    <span>Panduan Pengisian Formulir &amp; Biaya</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Biaya Formulir Pendaftaran (Rupiah)</label>
                    <input
                      type="text"
                      value={formatRupiah(formFee)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        setFormFee(raw);
                      }}
                      placeholder="Contoh: Rp 250.000"
                      className="w-full max-w-sm px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Petunjuk / Panduan Registrasi (Form Wizard)</label>
                    <textarea
                      value={formGuideline}
                      onChange={(e) => setFormGuideline(e.target.value)}
                      rows={5}
                      placeholder="Tuliskan catatan panduan yang akan tampil diatas form pengisian wizard..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 resize-y"
                    />
                  </div>
                </div>

                {/* ── Konfigurasi Field Form Pendaftaran */}
                <div className="border-t border-slate-100 dark:border-white/5 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Konfigurasi Field Form Pendaftaran
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Atur field mana yang aktif dan apakah wajib diisi atau opsional</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFieldsConfigUI(DEFAULT_FIELDS_CONFIG_UI)}
                      className="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-900 transition-all"
                    >
                      Reset Default
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800/60 dark:border-white/5">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-[#020617]/60 border-b border-slate-200 dark:border-white/5">
                          <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400">Field / Kolom</th>
                          <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400 text-center">Aktif</th>
                          <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400 text-center">Wajib Diisi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {Object.entries(fieldsConfigUI).map(([key, cfg]) => (
                          <tr key={key} className="hover:bg-slate-50 dark:bg-slate-800/50/60 dark:hover:bg-white dark:bg-[#0f172a]/3 transition-colors">
                            <td className="px-4 py-2.5">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white text-xs">{cfg.label}</span>
                                <span className="ml-2 text-[9px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">{key}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => setFieldsConfigUI(prev => ({ ...prev, [key]: { ...prev[key], active: !prev[key].active } }))}
                                className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                                  cfg.active ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                                title={cfg.active ? 'Nonaktifkan field' : 'Aktifkan field'}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-[#0f172a] shadow transition-all duration-200 ${
                                  cfg.active ? 'left-[18px]' : 'left-0.5'
                                }`} />
                              </button>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <button
                                type="button"
                                disabled={!cfg.active}
                                onClick={() => setFieldsConfigUI(prev => ({ ...prev, [key]: { ...prev[key], required: !prev[key].required } }))}
                                className={`w-9 h-5 rounded-full relative transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                                  cfg.required && cfg.active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                                title={cfg.required ? 'Jadikan opsional' : 'Jadikan wajib'}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-[#0f172a] shadow transition-all duration-200 ${
                                  cfg.required && cfg.active ? 'left-[18px]' : 'left-0.5'
                                }`} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FAQ Management */}
            {activeTab === "faq" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                      <HelpCircle size={16} className="text-blue-500" />
                      <span>Daftar Pertanyaan Yang Sering Diajukan (FAQ)</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Ubah, tambah, urutkan, atau hapus tanya-jawab FAQ untuk halaman utama</p>
                  </div>

                  <button
                    onClick={handleAddFaq}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Pertanyaan Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {faqList.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 dark:border-white/5 rounded-3xl p-5 flex items-start gap-4 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow shadow-blue-500/10">
                        {idx + 1}
                      </div>

                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Pertanyaan (Question)</label>
                          <input
                            type="text"
                            value={item.q}
                            onChange={(e) => handleUpdateFaq(idx, "q", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Jawaban (Answer)</label>
                          <textarea
                            value={item.a}
                            onChange={(e) => handleUpdateFaq(idx, "a", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none resize-y"
                          />
                        </div>
                      </div>

                      {/* Sorting & Control Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-center">
                        <button
                          onClick={() => handleMoveFaq(idx, "up")}
                          disabled={idx === 0}
                          className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-[#1e293b] dark:border-white/5 dark:hover:bg-slate-900 transition-all ${
                            idx === 0 ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveFaq(idx, "down")}
                          disabled={idx === faqList.length - 1}
                          className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-[#1e293b] dark:border-white/5 dark:hover:bg-slate-900 transition-all ${
                            idx === faqList.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          onClick={() => handleRemoveFaq(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  ))}

                  {faqList.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      Belum ada tanya-jawab FAQ. Tambah pertanyaan baru dengan tombol diatas.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: Riwayat Perubahan (Revisions) */}
            {activeTab === "revisions" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                  <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span>Riwayat &amp; Catatan Perubahan User Interface</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Audit log revisi. Klik "Pulihkan" untuk rollback seluruh tampilan landing page dan form ke versi riwayat yang diinginkan</p>
                </div>

                <div className="space-y-4">
                  {revisions.map((rev) => (
                    <div 
                      key={rev.id}
                      className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 dark:border-white/5 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-extrabold rounded-lg text-[9px] uppercase tracking-wider">
                            Revisi #{rev.id}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400 font-extrabold uppercase">
                            Oleh: @{rev.changed_by}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                          {rev.description || "Melakukan pembaruan massal UI"}
                        </p>
                        <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                          <Clock size={10} />
                          <span>{formatDate(rev.created_at)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRestore(rev.id)}
                        className="px-4.5 py-2 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-500 hover:text-white text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <RotateCcw size={12} />
                        <span>Pulihkan (Restore)</span>
                      </button>

                    </div>
                  ))}

                  {revisions.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      Belum ada catatan riwayat perubahan. Perubahan pertama Anda akan menghasilkan catatan baru.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: Rekening Bank Sekolah */}
            {activeTab === "bank" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                      <Database size={16} className="text-blue-500" />
                      <span>Daftar Rekening Bank Sekolah</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Ubah, tambah, atau hapus rekening tujuan transfer manual pendaftaran</p>
                  </div>

                  <button
                    onClick={() => setBankConfigList(prev => [...prev, { bankName: "", accountNumber: "", accountHolder: "" }])}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Tambah Rekening Bank</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bankConfigList.map((bank, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button
                          onClick={() => setBankConfigList(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Hapus Rekening"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-black rounded-lg text-[9px] uppercase tracking-wider">
                            Rekening #{idx + 1}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Bank</label>
                          <input
                            type="text"
                            value={bank.bankName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBankConfigList(prev => prev.map((item, i) => i === idx ? { ...item, bankName: val } : item));
                            }}
                            placeholder="Contoh: Bank Mandiri, BCA, BJB..."
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nomor Rekening</label>
                            <input
                              type="text"
                              value={bank.accountNumber}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBankConfigList(prev => prev.map((item, i) => i === idx ? { ...item, accountNumber: val } : item));
                              }}
                              placeholder="Contoh: 157-00-0174092-2"
                              className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Pemilik Rekening</label>
                            <input
                              type="text"
                              value={bank.accountHolder}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBankConfigList(prev => prev.map((item, i) => i === idx ? { ...item, accountHolder: val } : item));
                              }}
                              placeholder="Contoh: Yayasan Taruna Bhakti"
                              className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {bankConfigList.length === 0 && (
                    <div className="col-span-2 text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      Belum ada rekening bank yang dikonfigurasi. Tambah rekening baru dengan tombol diatas.
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* TAB: Partner Industri */}
            {activeTab === "partners" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                      <Briefcase size={16} className="text-blue-500" />
                      <span>Daftar Partner Industri</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Kelola logo, nama, URL, dan ukuran logo perusahaan industri (Hanya tampil 20 di Landing Page, sisanya dipaginasi)</p>
                  </div>

                  <button
                    onClick={() => {
                      const nextId = partnersList.length > 0 ? Math.max(...partnersList.map(p => p.id)) + 1 : 1;
                      setPartnersList(prev => [{ id: nextId, name: "Partner Baru", logo: "", url: "#", h: "h-12" }, ...prev]);
                    }}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Tambah Partner</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partnersList.map((partner, _idx) => (
                    <div 
                      key={partner.id}
                      className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 dark:border-white/5 rounded-3xl p-5 relative overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button
                          onClick={() => setPartnersList(prev => prev.filter(p => p.id !== partner.id))}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Hapus Partner"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-20 h-20 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center p-2">
                            {partner.logo ? (
                              <img src={DOMPurify.sanitize(sanitizeSrc(partner.logo) || "") || undefined} alt="" className="max-w-full max-h-full object-contain" />
                            ) : (
                              <ImageIcon size={24} className="text-slate-300" />
                            )}
                          </div>
                          
                          <input
                            type="text"
                            value={partner.logo}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPartnersList(prev => prev.map(p => p.id === partner.id ? { ...p, logo: val } : p));
                            }}
                            placeholder="URL Logo (https://...)"
                            className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-[10px] focus:outline-none focus:border-blue-500 text-center"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Partner</label>
                          <input
                            type="text"
                            value={partner.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPartnersList(prev => prev.map(p => p.id === partner.id ? { ...p, name: val } : p));
                            }}
                            placeholder="Contoh: PT Telkom"
                            className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Link Website</label>
                          <input
                            type="text"
                            value={partner.url}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPartnersList(prev => prev.map(p => p.id === partner.id ? { ...p, url: val } : p));
                            }}
                            placeholder="https://"
                            className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Ukuran Logo</label>
                          <select
                            value={partner.h}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPartnersList(prev => prev.map(p => p.id === partner.id ? { ...p, h: val } : p));
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                          >
                            <option value="h-8">Sangat Kecil (h-8)</option>
                            <option value="h-10">Kecil (h-10)</option>
                            <option value="h-12">Sedang (h-12)</option>
                            <option value="h-14">Besar (h-14)</option>
                            <option value="h-16">Sangat Besar (h-16)</option>
                            <option value="h-20">Raksasa (h-20)</option>
                          </select>
                        </div>
                        
                      </div>
                    </div>
                  ))}

                  {partnersList.length === 0 && (
                    <div className="col-span-3 text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      Belum ada partner industri. Tambah partner baru dengan tombol diatas.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CONFIRMATION & NOTE MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveAll}
            className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Simpan Perubahan UI</h3>
              <button 
                type="button" 
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-normal">
                Harap masukkan deskripsi singkat mengenai perubahan yang Anda lakukan. Catatan ini akan disimpan dalam database dan dapat digunakan untuk memulihkan versi ini di masa mendatang.
              </p>
              <textarea
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
                rows={3}
                required
                placeholder="Contoh: Mengubah judul utama, memperbarui logo RPL, dan memperbarui alur langkah 3"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800/50 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4.5 py-2.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1"
              >
                <Check size={12} />
                <span>Simpan Sekarang</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
