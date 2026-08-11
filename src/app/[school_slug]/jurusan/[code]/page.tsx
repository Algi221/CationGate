"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dompurify from "dompurify";

const sanitizeUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    }) || null;
  } catch (e) {
    return null;
  }
};

const sanitizeSrc = (src: string | undefined | null): string | null => {
  let url = sanitizeUrl(src);
  if (url && url.startsWith("/jurusan/")) {
    url = url.replace("/jurusan/", "/assets/jurusan/");
  }
  return url;
};
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  BookOpen, 
  Briefcase, 
  Award, 
  Sparkles, 
  Cpu, 
  Layers, 
  Video, 
  Palette, 
  ArrowRight,
  Check
} from "lucide-react";

interface SyllabusItem {
  subject: string;
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

interface MajorDetail {
  code: string;
  title: string;
  alias: string;
  subtitle: string;
  tagline: string;
  desc: string;
  color: string;
  accentColor: string;
  bgAccent: string;
  textAccent: string;
  glowColor: string;
  logo: string;
  banner: string;
  syllabus: SyllabusItem[];
  careers: CareerItem[];
  facilities: string[];
  gallery: GalleryItem[];
  partners: string;
}

function hexToRgb(hex: string): string {
  try {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = (hex || "#0066ff").replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 102, 255";
  } catch (_) {
    return "0, 102, 255";
  }
}

function getDarkerColor(hex: string, percent = 20): string {
  try {
    const cleanHex = (hex || "#0066ff").replace("#", "");
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return "#0044cc";
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    const clamp = (val: number) => val < 0 ? 0 : val > 255 ? 255 : val;
    const rHex = clamp(R).toString(16).padStart(2, "0");
    const gHex = clamp(G).toString(16).padStart(2, "0");
    const bHex = clamp(B).toString(16).padStart(2, "0");
    return `#${rHex}${gHex}${bHex}`;
  } catch (_) {
    return "#0044cc";
  }
}

const majorsData: Record<string, MajorDetail> = {
  rpl: {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    alias: "PPLG",
    subtitle: "Pengembangan Perangkat Lunak dan Gim",
    tagline: "Coding the Future, Building Creative Solutions.",
    desc: "Program Keahlian Rekayasa Perangkat Lunak (PPLG) di SMK Taruna Bhakti Depok mendidik talenta muda menjadi Software Engineer kelas dunia. Kurikulum kami diselaraskan dengan raksasa teknologi seperti AWS dan Google, melatih siswa menguasai Fullstack Web Development, Mobile Applications, Cloud Systems, Game Programming, dan AI.",
    color: "from-blue-600 to-indigo-600",
    accentColor: "#0066ff",
    bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
    textAccent: "text-blue-600 dark:text-blue-400",
    glowColor: "rgba(0,102,255,0.15)",
    logo: "/assets/jurusan/pplg.png",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "Modern Web Programming", desc: "HTML5, CSS3, ES6+ JavaScript, TailwindCSS, React.js, Next.js, Node.js, RESTful API." },
      { subject: "Mobile App Development", desc: "Kotlin Native Android Development, Cross-Platform Flutter, iOS Swift." },
      { subject: "Databases & Cloud Engineering", desc: "Relational Database PostgreSQL, AWS Cloud Foundations, Firebase, Supabase." },
      { subject: "Game Development", desc: "Unity 3D Engine, C# Scripting, Game Physics, 2D/3D Assets Integration." },
      { subject: "DevOps & Collaboration Tools", desc: "Version Control Git/GitHub, CI/CD Pipeline, Docker Containerization, Linux server administration." }
    ],
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
    gallery: [
      { url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop", caption: "Sesi Kolaborasi UI/UX & Coding Project" },
      { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop", caption: "Peer Programming Workshop Siswa RPL" },
      { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop", caption: "Praktik Penulisan Kode Algoritma Kompleks" },
      { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop", caption: "Presentasi Pitching Project Akhir Semester" }
    ],
    partners: "Amazon Web Services (AWS) Academy, Google Developer Partner, Dicoding Academy, Oracle Academy"
  },
  tjkt: {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    alias: "TJKT",
    subtitle: "Cyber Security & Network Infrastructure",
    tagline: "Connecting the World, Securing Digital Assets.",
    desc: "Program Keahlian TJKT membekali siswa dengan kompetensi tinggi untuk merancang, mengonfigurasi, dan mengamankan jaringan komputer skala korporat. Melalui kemitraan dengan CISCO dan MikroTik, lulusan dilatih menguasai administrasi server, pertahanan cyber, telekomunikasi serat optik (fiber optic), serta teknologi virtualisasi cloud.",
    color: "from-sky-500 to-blue-500",
    accentColor: "#0ea5e9",
    bgAccent: "bg-sky-500/10 dark:bg-sky-500/20",
    textAccent: "text-sky-600 dark:text-sky-400",
    glowColor: "rgba(14,165,233,0.15)",
    logo: "/assets/jurusan/tjkt.png",
    banner: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "Enterprise Network Design", desc: "Kurikulum CISCO CCNA & MikroTik MTCNA, routing, switching, VLAN, OSPF." },
      { subject: "Cyber Security & Defense", desc: "Firewall configuration, network penetration testing, digital forensics, IDS/IPS." },
      { subject: "Server Administration", desc: "Linux Server setup, Active Directory, Web/Mail server, Docker & virtualization." },
      { subject: "Telecommunication Fiber Optic", desc: "Fusion splicing serat optik, Optical Time Domain Reflectometer (OTDR), FTTH planning." },
      { subject: "Cloud Infrastructure Networking", desc: "Amazon Web Services VPC, Virtual Private Cloud Networking, virtual routers." }
    ],
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
    gallery: [
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop", caption: "Perawatan Server & Switch di Rack Data Center" },
      { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop", caption: "Konfigurasi Router & Debugging Jaringan" },
      { url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop", caption: "Penyambungan Kabel FO menggunakan Fusion Splicer" },
      { url: "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=600&auto=format&fit=crop", caption: "Simulasi Pertahanan Cyber & Ethical Hacking" }
    ],
    partners: "CISCO Networking Academy, Mikrotik Academy, Fortinet Academy, AWS Academy Partner"
  },
  dkv: {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    alias: "DKV",
    subtitle: "Creative Design & UI/UX Experience",
    tagline: "Visualizing Brilliant Ideas, Empowering Global Brands.",
    desc: "Program Keahlian DKV di SMK Taruna Bhakti mendidik siswa menjadi kreator visual profesional yang mampu bersaing di industri kreatif. Siswa dibekali kemampuan UI/UX website/application design, ilustrasi digital modern, videografi & fotografi komersial, corporate branding, serta media penerbitan digital.",
    color: "from-indigo-500 to-purple-600",
    accentColor: "#6366f1",
    bgAccent: "bg-indigo-500/10 dark:bg-indigo-500/20",
    textAccent: "text-indigo-600 dark:text-indigo-400",
    glowColor: "rgba(99,102,241,0.15)",
    logo: "/assets/jurusan/dkv.png",
    banner: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "UI/UX & Web Interaction", desc: "Design system Figma, low/high-fidelity wireframes, interactive prototyping, user flow." },
      { subject: "Digital Illustration & Painting", desc: "Seni ilustrasi karakter, digital painting, raster graphics menggunakan tablet Wacom." },
      { subject: "Studio Commercial Photography", desc: "Penguasaan teknik kamera DSLR, lighting studio, product shoot, portraiture." },
      { subject: "Corporate Branding & Identity", desc: "Pembuatan logo, buku panduan visual brand (brand book), packaging, merchandise." },
      { subject: "Creative Layout & Publishing", desc: "Layout majalah digital, media publikasi interaktif dengan Adobe Creative Suite." }
    ],
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
    gallery: [
      { url: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=600&auto=format&fit=crop", caption: "Kolaborasi Pembuatan Wireframe di Figma" },
      { url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop", caption: "Praktik Menggambar Karakter dengan Wacom Tablet" },
      { url: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop", caption: "Seni Pengambilan Gambar Produk Komersial" },
      { url: "https://images.unsplash.com/photo-1534972195531-d756b9bda9f2?q=80&w=600&auto=format&fit=crop", caption: "Penyuntingan Aset Visual & Layout Kreatif" }
    ],
    partners: "Adobe Certified Professional Partner, Dentsu Creative, Dicoding Academy UI/UX Partner"
  },
  bc: {
    code: "BC",
    title: "Broadcasting & Perfilman",
    alias: "BC",
    subtitle: "Creative Cinema & Media Production",
    tagline: "Inspiring Stories, Crafting Moving Moments.",
    desc: "Program Keahlian Broadcasting & Perfilman mendidik sineas dan praktisi penyiaran televisi/radio masa depan. Menggunakan peralatan berstandar penyiaran nasional, siswa diajarkan penulisan naskah skenario, penyutradaraan film, tata kamera sinematik, editing video profesional, tata cahaya, serta produksi siaran langsung (live broadcasting).",
    color: "from-amber-500 to-orange-600",
    accentColor: "#f59e0b",
    bgAccent: "bg-amber-500/10 dark:bg-amber-500/20",
    textAccent: "text-amber-600 dark:text-amber-400",
    glowColor: "rgba(245,158,11,0.15)",
    logo: "/assets/jurusan/bc.png",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "Creative Writing & Directing", desc: "Storytelling, scriptwriting, storyboard creation, shot analysis, blocking." },
      { subject: "Cinematography & Audio Gear", desc: "Kamera video profesional, manual focus, 3-point lighting setup, condenser mic." },
      { subject: "Post-Production Editing", desc: "Video editing Adobe Premiere Pro & DaVinci Resolve, color grading, audio mixing." },
      { subject: "TV Studio & Live Switcher", desc: "Multi-camera live switching, teleprompter, audio mixer operating, streaming." },
      { subject: "Podcasting & Sound Design", desc: "Perekaman podcast berkualitas tinggi, voice over, sound effect synchronization." }
    ],
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
    gallery: [
      { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop", caption: "Pengoperasian Kamera Sinema & Lensa Manual" },
      { url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600&auto=format&fit=crop", caption: "Sesi Rekaman Podcast & Mixing Suara" },
      { url: "https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?q=80&w=600&auto=format&fit=crop", caption: "Color Grading Sesi Video Post-Production" },
      { url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop", caption: "Syuting Film Pendek Praktik Kelas Sinematografi" }
    ],
    partners: "Televisi Republik Indonesia (TVRI), Trans Media Network, DaVinci Resolve Authorized Partner"
  },
  an: {
    code: "AN",
    title: "Animasi",
    alias: "Animasi",
    subtitle: "3D Asset Modeling & Digital Animation",
    tagline: "Breathing Life into Creative Characters.",
    desc: "Program Keahlian Animasi mendidik siswa menguasai pembuatan animasi 2D dan 3D secara komprehensif. Dimulai dari sketsa konsep, digital sculpting, pemodelan objek 3D, pemberian tulang gerak (rigging), perekaman gerakan (motion capture), hingga rendering farm berteknologi tinggi standar industri film global.",
    color: "from-pink-500 to-rose-600",
    accentColor: "#ec4899",
    bgAccent: "bg-pink-500/10 dark:bg-pink-500/20",
    textAccent: "text-pink-600 dark:text-pink-400",
    glowColor: "rgba(236,72,153,0.15)",
    logo: "/assets/jurusan/animasi.png",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "3D Assets Modeling", desc: "ZBrush sculpting, Blender/Autodesk Maya 3D polygon structures, texturing." },
      { subject: "2D Character Animation", desc: "Design character sheets, keyframes, in-betweens, digital storyboarding." },
      { subject: "Advanced Rigging", desc: "Pemberian sistem persendian skeleton, weight painting, muscle constraints." },
      { subject: "VFX & Screen Compositing", desc: "Computer-Generated Imagery (CGI), particle system simulations, chroma-keying." },
      { subject: "Rendering Pipeline Management", desc: "Batch rendering farm optimization, lighting models, texture maps." }
    ],
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
    gallery: [
      { url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop", caption: "Proses Rigging Persendian Karakter 3D" },
      { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop", caption: "Digital Art & Painting Karakter Fantasi" },
      { url: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=600&auto=format&fit=crop", caption: "Pemodelan Aset Rumah 3D (3D Modeling)" },
      { url: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=600&auto=format&fit=crop", caption: "Siswa Menggunakan Baju Sensor Motion Capture" }
    ],
    partners: "Brandoville Studios, Infinite Frameworks Batam, Toon Boom Certified Academy Partner"
  },
  te: {
    code: "TE",
    title: "Teknik Elektronika",
    alias: "TE",
    subtitle: "Industrial Automation & Internet of Things (IoT)",
    tagline: "Automating Tasks, Sensing Endless Smart Opportunities.",
    desc: "Program Keahlian Teknik Elektronika mendidik ahli robotik dan IoT masa depan. Menggunakan modul modern, siswa diajarkan perancangan sirkuit cerdas berbasis ESP32/Arduino, smart-home automation system, pemrograman PLC industri (Siemens & Omron), robotika otomatis, dan perakitan hardware.",
    color: "from-emerald-500 to-teal-600",
    accentColor: "#10b981",
    bgAccent: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    glowColor: "rgba(16,185,129,0.15)",
    logo: "/assets/jurusan/te.png",
    banner: "https://images.unsplash.com/photo-1517055726410-dcbbb989d595?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "IoT & Embedded System", desc: "Arduino IDE, Python script, sensor calibration, wireless transceivers (LoRa, Zigbee, Wi-Fi)." },
      { subject: "Robotics & Microprocessor", desc: "Sirkuit motor servo, robot otonom (line follower & obstacle avoidance), microcontroller." },
      { subject: "PLC & Actuators", desc: "Siemens PLC, Omron Sysmac, ladder logic programming, pneumatic actuator machinery." },
      { subject: "Smart Home System Integration", desc: "Integrasi sensor ruangan otomatis, smart-relays, smart monitoring dashboard." },
      { subject: "PCB Design & Troubleshooting", desc: "Desain sirkuit PCB Eagle, teknik solder presisi, analisa digital osiloskop." }
    ],
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
    gallery: [
      { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop", caption: "Kalibrasi Sensor Lengan Robotik Cerdas" },
      { url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop", caption: "Wiring Modul IoT Sensor Pintar" },
      { url: "https://images.unsplash.com/photo-1596244244153-c52734b415a0?q=80&w=600&auto=format&fit=crop", caption: "Praktik Solder Sirkuit Elektronika Analog" },
      { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop", caption: "Pemrograman PLC Omron untuk Mesin Konveyor" }
    ],
    partners: "Schneider Electric, Omron Industrial Automation Partner, IoT Association Indonesia, Panasonic"
  }
};

export default function MajorPage() {
  const params = useParams();
  const rawCode = params?.code ? params.code.toString().toLowerCase() : "";
  const code = rawCode === "anm" ? "an" : rawCode;
  const majorKeys = ["rpl", "tjkt", "dkv", "bc", "an", "te"];
  const currentIndex = majorKeys.indexOf(code);
  const [nextCode, setNextCode] = useState(() => {
    const otherKeys = majorKeys.filter(k => k !== code);
    return otherKeys[Math.floor(Math.random() * otherKeys.length)] || "rpl";
  });

  const [major, setMajor] = useState<any>(null);
  const [nextMajor, setNextMajor] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [kuotaData, setKuotaData] = useState<any[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ppdb-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (code && majorsData[code]) {
      setMajor({ ...majorsData[code] });
    } else if (code) {
      setMajor({
        code: code.toUpperCase(),
        title: code.toUpperCase(),
        alias: code.toUpperCase(),
        subtitle: "Program Keahlian Baru",
        tagline: "Coding the Future, Building Creative Solutions.",
        desc: "",
        color: "from-blue-600 to-indigo-600",
        accentColor: "#0066ff",
        bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
        textAccent: "text-blue-600 dark:text-blue-400",
        glowColor: "rgba(0,102,255,0.15)",
        logo: "/logo_smktb.png",
        banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
        syllabus: [
          { subject: "Dasar Kompetensi", desc: "Mempelajari dasar-dasar keahlian program studi baru." }
        ],
        careers: [
          { title: "Tenaga Ahli", desc: "Menjadi profesional kompeten di bidangnya." }
        ],
        facilities: [
          "Laboratorium Praktikum Baru"
        ],
        gallery: [],
        partners: "Mitra Industri SMK Taruna Bhakti"
      });
    }
    if (nextCode && majorsData[nextCode]) {
      setNextMajor({ ...majorsData[nextCode] });
    }
  }, [code, nextCode]);

  useEffect(() => {
    const loadDynamicConfig = async () => {
      try {
        const res = await fetch("/api/config");
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config)) {
            const found = config.ppdb_majors_config.find((m: any) => m.code.toLowerCase() === code || (m.code.toLowerCase() === "anm" && code === "an"));
            if (found) {
              setMajor((prev: any) => {
                const base = prev || {
                  code: found.code,
                  title: found.title || found.code,
                  alias: found.code,
                  subtitle: found.title || found.code,
                  tagline: "Coding the Future, Building Creative Solutions.",
                  desc: found.desc || "",
                  color: "from-blue-600 to-indigo-600",
                  accentColor: found.color || "#0066ff",
                  bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
                  textAccent: "text-blue-600 dark:text-blue-400",
                  glowColor: "rgba(0,102,255,0.15)",
                  logo: found.logo || "/logo_smktb.png",
                  banner: found.banner || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
                  syllabus: [{ subject: "Dasar Kompetensi", desc: "Mempelajari dasar-dasar keahlian program studi." }],
                  careers: Array.isArray(found.careers) ? found.careers : [{ title: "Tenaga Ahli", desc: "Menjadi profesional kompeten di bidangnya." }],
                  facilities: Array.isArray(found.facilities) ? found.facilities : ["Laboratorium Praktikum Baru"],
                  gallery: Array.isArray(found.gallery) ? found.gallery : [],
                  partners: "Mitra Industri SMK Taruna Bhakti"
                };
                return {
                  ...base,
                  title: found.title || base.title,
                  desc: found.desc || base.desc,
                  accentColor: found.color || base.accentColor,
                  logo: found.logo || base.logo,
                  banner: found.banner || base.banner,
                  video: found.video || base.video,
                  careers: Array.isArray(found.careers) ? found.careers : base.careers,
                  facilities: Array.isArray(found.facilities) ? found.facilities : base.facilities,
                  gallery: Array.isArray(found.gallery) ? found.gallery : base.gallery
                };
              });
            }

            const foundNext = config.ppdb_majors_config.find((m: any) => m.code.toLowerCase() === nextCode || (m.code.toLowerCase() === "anm" && nextCode === "an"));
            if (foundNext) {
              setNextMajor((prev: any) => {
                if (!prev) return null;
                return {
                  ...prev,
                  title: foundNext.title || prev.title,
                  desc: foundNext.desc || prev.desc,
                  accentColor: foundNext.color || prev.accentColor,
                  logo: foundNext.logo || prev.logo
                };
              });
            }
          }
        }
      } catch (err) {
        console.error("Gagal mengambil konfigurasi dinamis jurusan:", err);
      }
    };
    if (code) {
      loadDynamicConfig();
    }
  }, [code, nextCode]);

  useEffect(() => {
    const loadKuota = async () => {
      try {
        const BACKEND_URL = typeof window !== 'undefined' ? `/api` : "/api";
        const res = await fetch(`${BACKEND_URL}/api/kuota`);
        const json = await res.json();
        if (json.success && json.data) {
          setKuotaData(json.data.pendaftar);
        }
      } catch (err) {
        console.log("Failed to fetch kuota data:", err);
      }
    };
    loadKuota();
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
  };

  if (!major) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 transition-colors duration-300">
        <div className="absolute inset-0 bg-glow-container">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
        </div>
        
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800 p-10 rounded-[32px] max-w-md w-full text-center shadow-2xl relative z-10">
          <div className="w-20 h-20 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Palette size={40} />
          </div>
          <h1 className="text-2xl font-black mb-3">Jurusan Tidak Ditemukan</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Program keahlian yang Anda cari tidak terdaftar atau telah diupdate. Silakan kembali ke beranda untuk melihat list jurusan lengkap.
          </p>
          <Link href="/" className="btn-primary-pill w-full flex gap-2">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const accentColor = major.accentColor || "#0066ff";
  const accentRgb = hexToRgb(accentColor);
  const darkerColor = getDarkerColor(accentColor, 15);
  const glowColor = `rgba(${accentRgb}, 0.15)`;

  const nextAccentColor = nextMajor?.accentColor || "#0066ff";
  const nextAccentRgb = hexToRgb(nextAccentColor);
  const nextDarkerColor = getDarkerColor(nextAccentColor, 15);

  return (
    <div 
      className="relative min-h-screen flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
      style={{
        '--major-accent': accentColor,
        '--major-accent-rgb': accentRgb,
        '--major-darker': darkerColor,
        '--major-glow': glowColor,
        '--next-accent': nextAccentColor,
        '--next-accent-rgb': nextAccentRgb,
        '--next-darker': nextDarkerColor
      } as React.CSSProperties}
    >
      <style>{`
        .major-gradient-bg {
          background-image: linear-gradient(135deg, var(--major-accent) 0%, var(--major-darker) 100%) !important;
        }
        .major-text-clip {
          background-image: linear-gradient(135deg, var(--major-accent) 0%, var(--major-darker) 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .major-bg-accent {
          background-color: rgba(var(--major-accent-rgb), 0.1) !important;
        }
        .dark .major-bg-accent {
          background-color: rgba(var(--major-accent-rgb), 0.2) !important;
        }
        .major-text-accent {
          color: var(--major-accent) !important;
        }
        .major-glow-border:hover {
          border-color: rgba(var(--major-accent-rgb), 0.25) !important;
          box-shadow: 0 0 20px rgba(var(--major-accent-rgb), 0.08) !important;
        }
        .major-accent-border {
          border-color: var(--major-accent) !important;
        }
        .next-gradient-bg {
          background-image: linear-gradient(135deg, var(--next-accent) 0%, var(--next-darker) 100%) !important;
        }
        .next-text-clip {
          background-image: linear-gradient(135deg, var(--next-accent) 0%, var(--next-darker) 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .next-bg-accent {
          background-color: rgba(var(--next-accent-rgb), 0.1) !important;
        }
        .dark .next-bg-accent {
          background-color: rgba(var(--next-accent-rgb), 0.2) !important;
        }
        .next-text-accent {
          color: var(--next-accent) !important;
        }
      `}</style>
      
      {/* Floating Background Glow System */}
      <div className="absolute inset-0 bg-glow-container">
        <div 
          className="bg-glow bg-glow-1"
          style={{ background: `radial-gradient(circle, var(--major-glow) 0%, transparent 70%)` }}
        ></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleDark} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all" 
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-750" />}
        </button>
      </div>

      {/* HERO SECTION - Premium Branding */}
      <main className="flex-grow w-full">
      <section className="pt-32 pb-16 px-6 max-w-6xl mx-auto w-full relative z-10 flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Copy Column */}
        <div className="w-full lg:w-1/2 text-left space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
              <img 
                src={sanitizeSrc(major.logo)} 
                alt={`Logo ${major.code}`} 
                className="w-14 h-14 object-contain drop-shadow-sm"
                onError={(e: any) => { 
                  e.target.style.display = "none"; 
                  const parent = e.target.parentElement;
                  if (parent) {
                    parent.style.backgroundImage = 'linear-gradient(135deg, var(--major-accent), var(--major-darker))';
                    parent.querySelectorAll('.fallback-alias').forEach((el: any) => el.remove());
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.style.color = 'white';
                    fallbackDiv.style.display = 'flex';
                    fallbackDiv.style.alignItems = 'center';
                    fallbackDiv.style.justifyContent = 'center';
                    fallbackDiv.style.width = '100%';
                    fallbackDiv.style.height = '100%';
                    fallbackDiv.style.fontWeight = '800';
                    fallbackDiv.style.fontSize = '16px';
                    fallbackDiv.textContent = major.alias;
                    fallbackDiv.classList.add('fallback-alias');
                    parent.appendChild(fallbackDiv);
                  }
                }}
              />
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 major-bg-accent major-text-accent">
                Program Unggulan {major.code}
              </span>
              <h2 className="text-sm font-semibold text-slate-400">{major.subtitle}</h2>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
            Jurusan <br />
            <span className="major-text-clip">
              {major.title}
            </span>
          </h1>

          <p className="text-lg font-bold text-slate-600 dark:text-slate-300 italic border-l-4 border-blue-500 pl-4">
            &ldquo;{major.tagline}&rdquo;
          </p>

          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
            {major.desc}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            {(() => {
              let isFull = false;
              let remaining = -1;
              let target = 0;
              let jumlah = 0;
              if (kuotaData && major) {
                const k = kuotaData.find((k: any) => k.key === major.title);
                if (k && k.target > 0) {
                  isFull = k.jumlah >= k.target;
                  remaining = k.target - k.jumlah;
                  target = k.target;
                  jumlah = k.jumlah;
                }
              }

              return (
                <div className="flex flex-col w-full gap-5 mt-2">
                  <div className="flex flex-wrap items-center gap-4">

                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors py-3.5 px-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 backdrop-blur-md">
                      <ArrowLeft size={16} /> Lihat Jurusan Lain
                    </Link>

                    <div className="relative group/btn">
                      <Link 
                        href={isFull ? "#" : "/daftar"} 
                        className={`btn-primary-pill py-3.5 px-8 flex items-center gap-2 rounded-2xl ${isFull ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale' : ''}`}
                      >
                        {isFull ? "Pendaftaran Ditutup" : "Daftar Jurusan Ini"} <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right Hero Visual Column */}
        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute -inset-1.5 major-gradient-bg rounded-[36px] blur-lg opacity-40 group-hover:opacity-60 transition duration-700 pointer-events-none"></div>
          
          <div className="relative bg-white dark:bg-slate-900 rounded-[32px] p-3 border border-slate-200/40 dark:border-slate-800/40 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
            <img 
              src={sanitizeSrc(major.banner)} 
              alt={`${major.title} Banner`}
              className="w-full h-full object-cover rounded-[24px] transform group-hover:scale-[1.02] transition duration-700" 
            />
          </div>
        </div>

      </section>

      {/* PROFILE VIDEO SECTION - Rendered only if video exists */}
      {major.video && (
        <section className="py-12 px-6 max-w-5xl mx-auto w-full relative z-10 animate-in fade-in duration-700">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-850 p-6 md:p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full major-gradient-bg opacity-10 dark:opacity-25 blur-3xl pointer-events-none"></div>
            
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider major-bg-accent major-text-accent">
                <Video size={12} className="animate-pulse" />
                Video Profil &amp; Pengenalan Jurusan
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
                Saksikan Video Dokumenter {major.alias}
              </h2>
              <p className="text-slate-500 dark:text-slate-450 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                Tonton video penjelasan ruang laboratorium praktikum, kompetensi dasar, hasil karya proyek lulusan, serta suasana kolaborasi siswa {major.title} di SMK Taruna Bhakti.
              </p>
            </div>

            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/30 dark:border-slate-800 shadow-2xl flex items-center justify-center p-2">
              {major.video.startsWith("data:video") || major.video.includes(".mp4") || major.video.startsWith("blob:") ? (
                <video 
                  src={sanitizeSrc(major.video)} 
                  controls 
                  className="w-full h-full object-cover rounded-[20px]"
                >
                  <track kind="captions" label="No captions" default />
                </video>
              ) : (
                <iframe
                  src={sanitizeSrc(major.video)}
                  className="w-full h-full rounded-[20px] border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* CORE SYLLABUS & CURRICULUM SECTION */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30 relative border-y border-slate-200/50 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className={`inline-block px-3 py-1 bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3`}>
              Materi Pembelajaran
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
              Kurikulum Berbasis Kompetensi
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
              Materi pembelajaran terstruktur yang diintegrasikan langsung dengan standard kebutuhan industri nasional maupun global.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {major.syllabus.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-500/20 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[4px] major-gradient-bg opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-300"></div>
                
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 major-bg-accent major-text-accent">
                  <BookOpen size={20} />
                </div>
                
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                  {item.subject}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* STUDENT ACTIVITY GALLERY SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-6 relative">
        
        <div className="text-center mb-16">
          <span className={`inline-block px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3`}>
            Aktivitas Kelas &amp; Praktik
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
            Galeri Kegiatan Taruna Bhakti
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
            Melihat lebih dekat keseruan suasana praktikum, kolaborasi proyek mandiri, dan evaluasi hasil karya taruna-taruni.
          </p>
        </div>

        {/* Dynamic Activity Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {major.gallery.map((img, index) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-3 shadow-md hover:shadow-xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                <img 
                  src={img.url} 
                  alt={img.caption}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-x-2 bottom-2 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md border border-white/10 p-3 rounded-xl transition duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] font-extrabold text-white uppercase tracking-wide">
                    Aktivitas {major.alias}
                  </p>
                  <p className="text-xs text-slate-200 font-medium leading-snug mt-0.5">
                    {img.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* CAREERS OPPORTUNITY SECTION */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30 relative border-y border-slate-200/50 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className={`inline-block px-3 py-1 bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3`}>
              Masa Depan Karir
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
              Peluang Kerja &amp; Prospek Profesional
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm mt-3 leading-relaxed">
              Lulusan dibekali dengan kompetensi matang sehingga siap diserap langsung oleh industri teknologi atau melanjutkan studi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {major.careers.map((career, idx) => (
              <div 
                key={idx} 
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 flex items-start gap-5 relative group"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 major-bg-accent major-text-accent">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {career.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {career.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FACILITIES & PARTNERS SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Facilities Column */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 major-bg-accent major-text-accent">
                Fasilitas Praktik
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
                Laboratorium Standar Industri
              </h2>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Untuk menjamin penyerapan kompetensi secara maksimal, praktikum dilakukan di ruangan laboratorium eksklusif dengan perangkat berspesifikasi tinggi.
            </p>

            <div className="space-y-3.5 pt-2">
              {major.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-3.5 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white bg-emerald-500 shadow-sm shrink-0`}>
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Partners Column */}
          <div className="w-full lg:w-1/2 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 backdrop-blur-md rounded-[32px] p-8 flex flex-col justify-between shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
                Sertifikasi &amp; Mitra Industri
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Penyelarasan kurikulum nasional dan pemberian materi sertifikasi bertaraf internasional langsung dari principal terkemuka:
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                Key Industrial Partners
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-white leading-relaxed">
                {major.partners}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-16 max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="relative major-gradient-bg rounded-[40px] p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-extrabold uppercase tracking-wider">
              PPDB TP. 2026/2027
            </span>
            
            <h2 className="text-2xl md:text-4xl font-black leading-tight">
              Siap Mengukir Prestasi Di Bidang Teknologi Informasi?
            </h2>
            
            <p className="text-sm md:text-base text-white/80 font-medium">
              Amankan slot pendaftaran Anda sekarang di Program Keahlian {major.title}. Dapatkan pembinaan intensif dari guru ahli dan mitra industri global.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/daftar" className="bg-[#ffffff] text-slate-900 hover:bg-[#f8fafc] text-sm font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 w-full sm:w-auto">
                Daftar Jurusan Ini
              </Link>
              <Link href="/" className="border border-white/30 bg-white/10 hover:bg-white/20 text-sm font-semibold px-8 py-4 rounded-2xl backdrop-blur-md transition duration-300 w-full sm:w-auto">
                Kembali Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE NEXT MAJOR CTA */}
      <section className="py-16 max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full next-gradient-bg opacity-10 dark:opacity-20 blur-3xl pointer-events-none group-hover:scale-110 transition duration-700"></div>
          
          <div className="space-y-4 max-w-2xl text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider next-bg-accent next-text-accent">
              <Sparkles size={12} className="animate-pulse" />
              Eksplor Jurusan Lain
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
              Tertarik Melihat Jurusan <span className="next-text-clip">{nextMajor.title} ({nextMajor.alias})</span>?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {nextMajor.desc.length > 180 ? nextMajor.desc.slice(0, 180) + "..." : nextMajor.desc}
            </p>
          </div>

          <div className="shrink-0 relative z-10 w-full md:w-auto">
            <Link 
              href={`/jurusan/${nextCode}`}
              className="flex items-center justify-center gap-2 next-gradient-bg hover:opacity-90 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-slate-950/5 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto group/btn"
            >
              <span>Lihat Detail {nextMajor.alias}</span>
              <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
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
                <img src="/logo_smktb.png" alt="Logo SMK TB" className="w-12 h-12 object-contain shrink-0" />
                <div>
                  <span className="logo-text font-black text-slate-800 dark:text-white text-lg">PPDB <span className="text-blue-600 dark:text-sky-400">SMK TB</span></span>
                  <span className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-550 uppercase mt-0.5">SMK Taruna Bhakti</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global sejak 1987.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.instagram.com/starbhak.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link instagram"
                  title="Instagram Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@starbhak.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link youtube"
                  title="YouTube Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.099C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.399.564C.776 4.337-.026 5.141-.298 6.163 0 8.01 0 12 0 12s0 3.99.298 5.837c.272 1.022 1.074 1.826 2.099 2.099C4.45 20.5 12 20.5 12 20.5s7.55 0 9.399-.564c1.025-.273 1.827-1.077 2.099-2.099C24 15.99 24 12 24 12s0-3.99-.298-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@starbhak.official?lang=id-ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link tiktok"
                  title="TikTok Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.6-4.03-1.46-.07-.05-.13-.1-.19-.15v5.08c.03 2.76-1.11 5.46-3.21 7.15-2.3 1.88-5.5 2.5-8.29 1.63-2.93-.93-5.27-3.41-6.01-6.42-.87-3.51.52-7.46 3.49-9.56 1.86-1.32 4.17-1.83 6.41-1.42V9.3c-1.07-.34-2.28-.19-3.22.42-1.08.7-1.74 1.94-1.73 3.22.01 1.42.87 2.77 2.19 3.29 1.34.52 2.92.21 3.93-.76.92-.88 1.34-2.18 1.25-3.44V0h-.02z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/smktarunabhaktidepok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link facebook"
                  title="Facebook Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Program Keahlian</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><Link href="/jurusan/rpl" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Rekayasa Perangkat Lunak (PPLG)</Link></li>
                <li><Link href="/jurusan/tjkt" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Jaringan Komputer &amp; Telkom (TJKT)</Link></li>
                <li><Link href="/jurusan/dkv" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Desain Komunikasi Visual (DKV)</Link></li>
                <li><Link href="/jurusan/bc" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Broadcasting &amp; Perfilman (BC)</Link></li>
                <li><Link href="/jurusan/an" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Animasi (AN)</Link></li>
                <li><Link href="/jurusan/te" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Elektronika (TE)</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Portal PPDB</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><Link href="/daftar" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Pendaftaran Online</Link></li>
                <li><Link href="/#alur" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Alur &amp; Prosedur</Link></li>
                <li><Link href="/#majors" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Syarat Kompetensi</Link></li>
                <li><Link href="/#kemitraan" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Kerjasama Industri</Link></li>
                <li><Link href={`/${(params as any)?.school_slug || ''}/dashboard`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Dashboard Seleksi Admin</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Hubungi Kami</h4>
              <p className="text-xs leading-relaxed font-semibold">
                Jalan Pekapuran Kel. Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453
              </p>
              <div className="space-y-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <p>Telp: <span className="text-slate-700 dark:text-slate-350">+62 21 874 4810</span></p>
                <p>WhatsApp: <span className="text-slate-700 dark:text-slate-350">08119892324</span></p>
                <p>Email: <span className="text-slate-700 dark:text-slate-350">info@smktarunabhakti.sch.id</span></p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs font-semibold text-slate-400 dark:text-slate-550">
            <div>
              &copy; {new Date().getFullYear()} SMK Taruna Bhakti Depok. All rights reserved.
            </div>
            <div className="flex items-center gap-1.5">
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
