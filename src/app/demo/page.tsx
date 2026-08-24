"use client";

import React, { useEffect } from "react";
import { SchoolNavbar } from "@/components/landing/SchoolNavbar";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { SchoolHero } from "@/components/features/school-landing/components/SchoolHero";
import { SchoolGelombang } from "@/components/features/school-landing/components/SchoolGelombang";
import { SchoolAlur } from "@/components/features/school-landing/components/SchoolAlur";
import { SchoolMajors } from "@/components/features/school-landing/components/SchoolMajors";
import { SchoolKemitraan } from "@/components/features/school-landing/components/SchoolKemitraan";
import { SchoolFaq } from "@/components/features/school-landing/components/SchoolFaq";
import { SchoolContact } from "@/components/features/school-landing/components/SchoolContact";
import { AlurItem, FaqItem, MajorItem, GelombangConfig } from "@/components/features/school-landing/types";

const DEMO_FAQ: FaqItem[] = [
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

const DEMO_ALUR: AlurItem[] = [
  {
    id: 1,
    title: "Pendaftaran Online",
    desc: "Calon peserta didik mendaftar secara online melalui website dan mengisi data lengkap."
  },
  {
    id: 2,
    title: "Pembayaran Formulir",
    desc: "Melakukan pembayaran administrasi pendaftaran sebesar Rp 250.000 via Transfer Bank."
  },
  {
    id: 3,
    title: "Verifikasi & Konfirmasi",
    desc: "Konfirmasi data pendaftaran otomatis via WhatsApp."
  },
  {
    id: 4,
    title: "Pemberkasan & Seragam",
    desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru."
  },
  {
    id: 5,
    title: "Uji Kelayakan (Tes Seleksi)",
    desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa."
  },
  {
    id: 6,
    title: "Pengumuman & Kelulusan",
    desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru."
  }
];

const DEMO_MAJORS: MajorItem[] = [
  {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    logo: "/assets/jurusan/pplg.png",
    desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
    color: "#0066ff",
    careers: "Software Engineer, Web Developer, Mobile Developer, Game Designer, AI Specialist",
    facilities: "Lab iMac Core-i9, Smart Classroom, AWS Cloud Academy, Google Developer Partner Studio"
  },
  {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    logo: "/assets/jurusan/tjkt.png",
    desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
    color: "#0ea5e9",
    careers: "Network Engineer, Cloud Administrator, Cybersecurity Analyst, System Administrator",
    facilities: "CISCO Networking Academy Lab, Mikrotik Academy Lab, Cyber Security Operations Center"
  },
  {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    logo: "/assets/jurusan/dkv.png",
    desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
    color: "#6366f1",
    careers: "UI/UX Designer, Graphic Designer, Illustrator, Creative Director, Brand Specialist",
    facilities: "Wacom Creative Studio, Photo & Video Lighting Lab, Digital Illustration Studio"
  },
  {
    code: "BC",
    title: "Broadcasting & Perfilman",
    logo: "/assets/jurusan/bc.png",
    desc: "Pelajari dunia penyiaran televisi, podcasting, penulisan naskah, penyutradaraan film, tata kamera, serta editing video profesional.",
    color: "#f59e0b",
    careers: "Video Editor, Cameraman, Director, Scriptwriter, Podcast Producer, Content Creator",
    facilities: "Green Screen Studio, Professional TV Control Room, Podcast Soundproof Studio"
  },
  {
    code: "ANM",
    title: "Animasi",
    logo: "/assets/jurusan/animasi.png",
    desc: "Kuasai seni pemodelan 2D/3D, karakter rigging, rendering, digital sculpting, storyboard, serta visual effects (VFX) standar industri perfilman.",
    color: "#ec4899",
    careers: "3D Animator, 2D Animator, 3D Modeler, Storyboard Artist, VFX Compositor, Character Designer",
    facilities: "iMac Render Farm Studio, Wacom Cintiq Digital Drawing Lab, Motion Capture Lab"
  },
  {
    code: "TE",
    title: "Teknik Elektronika",
    logo: "/assets/jurusan/te.png",
    desc: "Pelajari teknologi mikroprosesor, Internet of Things (IoT), robotika cerdas, automasi industri, dan smart home system.",
    color: "#10b981",
    careers: "IoT Engineer, Robotics Technician, Automation Programmer, Hardware Specialist",
    facilities: "Robotics Design Lab, IoT Smart-Home Prototype Sandbox, Microcontroller Lab"
  }
];

const DEMO_PARTNERS = [
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
  { id: 12, name: "Panasonic", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/8225.png", url: "https://www.panasonic.com/id/", h: "h-8" }
];

export default function DemoPage() {
  const schoolSlug = "demo";
  const schoolDisplayName = "SMK Taruna Bhakti";
  const heroTitle = "Penerimaan Peserta Didik Baru";
  const heroTitleSub = "SPMB SMK Taruna Bhakti";
  const heroSubtitle =
    "Mulai langkah awal wujudkan masa depan cemerlang di bidang teknologi. Proses pendaftaran online yang cepat, transparan, dan terintegrasi penuh.";
  const address = "Jl. Pekapuran Kel. Curug Kec. Cimanggis, Depok, Jawa Barat 16453";
  const mapTitle = "Kunjungi SMK Taruna Bhakti";
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.055845577626!2d106.867407!3d-6.3844792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebaff005f277%3A0x9fcd41028665eea8!2sSMK%20Taruna%20Bhakti%20Depok!5e0!3m2!1sen!2sid!4v1683883446098!5m2!1sen!2sid";
  const schoolPeriod = "2026-2027";
  const waAdmin = "6281292244456";

  const gelombangConfig: GelombangConfig = {
    gelombang1: { start: "2026-06-03", end: "2026-07-24" },
    gelombang2: { start: "2026-07-25", end: "2026-08-30" }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    // Sync theme
    const stored = localStorage.getItem("ppdb-theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <SchoolNavbar schoolSlug={schoolSlug} />

      {/* MAIN CONTENT */}
      <main className="grow w-full relative z-0">
        {/* 1. HERO */}
        <SchoolHero
          schoolSlug={schoolSlug}
          schoolDisplayName={schoolDisplayName}
          heroTitle={heroTitle}
          heroTitleSub={heroTitleSub}
          heroSubtitle={heroSubtitle}
          address={address}
          majors={DEMO_MAJORS}
        />

        {/* 2. JADWAL GELOMBANG */}
        <SchoolGelombang
          schoolPeriod={schoolPeriod}
          gelombangConfig={gelombangConfig}
          formatDate={formatDate}
        />

        {/* 3. ALUR PENDAFTARAN */}
        <SchoolAlur schoolPeriod={schoolPeriod} alurList={DEMO_ALUR} />

        {/* 4. PROGRAM KEAHLIAN */}
        <SchoolMajors schoolSlug={schoolSlug} majors={DEMO_MAJORS} />

        {/* 5. KEMITRAAN INDUSTRI */}
        <SchoolKemitraan partnersList={DEMO_PARTNERS} />

        {/* 6. FAQ PPDB */}
        <SchoolFaq
          faqTitle="Pertanyaan yang Sering Diajukan"
          faqSubtitle="Temukan jawaban cepat untuk kendala dan pertanyaan umum seputar proses penerimaan siswa baru SMK Taruna Bhakti."
          faqList={DEMO_FAQ}
        />

        {/* 7. LOKASI MAPS & WA */}
        <SchoolContact
          mapTitle={mapTitle}
          mapUrl={mapUrl}
          address={address}
          waAdmin={waAdmin}
          schoolDisplayName={schoolDisplayName}
        />
      </main>

      {/* FOOTER */}
      <SchoolFooter schoolSlug={schoolSlug} />
    </div>
  );
}
