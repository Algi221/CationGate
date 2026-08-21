"use client";

import React, { useEffect, useState } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SchoolNavbar } from "@/components/landing/SchoolNavbar";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { motion, Variants } from "framer-motion";
import {
  Building2,
  School,
  Target,
  ListChecks,
  FileText,
  MapPin,
  Mail,
  Play,
  Globe,
  Award,
  Users,
  BookOpen,
  GraduationCap,
  Sun,
  Moon,
  X,
  Menu,
  ChevronDown,
} from "lucide-react";
import _SafeImage from "@/components/SafeImage";

const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProfilSekolahPublicPage() {
  const { ppdbLogo, ppdbTitle, profilSekolah, isSchoolNotFound, schoolStatus } =
    usePPDB();
  const params = useParams();
  const router = useRouter();
  const schoolSlug = params?.school_slug as string;
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [_dropdownOpen, _setDropdownOpen] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const _toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-900 dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (isSchoolNotFound || schoolStatus === "TAKEDOWN" || schoolStatus === "SUSPENDED") {
    router.push("/");
    return null;
  }

  // =========================================================================
  // DATA DINAMIS: Edit bagian ini untuk menyesuaikan konten setiap sekolah
  // =========================================================================
  const identitas = profilSekolah?.identitas || {
    nama: ppdbTitle || "Institusi Pendidikan Unggulan",
    akreditasi: "A (Unggul)",
    alamat: "Jl. Pendidikan No. 10, Kota Depok, Jawa Barat, Indonesia 16431",
    npsn: "20229182",
    nis: "100290",
    nss: "302026501001",
    tahun_berdiri: "1998",
    email: "info@sekolah.sch.id",
  };

  const sejarah =
    profilSekolah?.sejarah ||
    `${ppdbTitle} merupakan institusi pendidikan kejuruan dan teknik terdepan yang didirikan dengan komitmen tinggi pada tahun 1998 sebagai pusat keunggulan vokasi. Dengan misi pengabdian ilmu pengetahuan dan teknologi untuk memajukan bangsa, ${ppdbTitle} terus bertransformasi mengoptimalkan pembangunan pendidikan yang maju, mandiri, dan bermartabat.`;

  const visi =
    profilSekolah?.visi_misi?.visi ||
    `Menjadi institusi pendidikan kejuruan yang unggul, mandiri, berbudaya, serta diakui secara global pada tahun 2030.`;

  const misi =
    profilSekolah?.visi_misi?.misi ||
    `1. Menyelenggarakan proses pembelajaran berbasis teknologi dan industri terkini.\n2. Mengembangkan karakter peserta didik yang berakhlak mulia, disiplin, dan berjiwa kepemimpinan.\n3. Menjalin kerjasama strategis dengan dunia usaha dan dunia industri (DUDI).\n4. Mendorong riset dan inovasi aplikatif yang bermanfaat bagi masyarakat luas.`;

  const tujuan =
    profilSekolah?.tujuan ||
    `1. Menghasilkan lulusan yang kompeten dan terserap di dunia kerja.\n2. Mewujudkan tata kelola institusi yang transparan, akuntabel, dan berbasis digital.\n3. Mengembangkan potensi peserta didik secara holistik.`;

  const _address = identitas.alamat;
  const _phone = "(021) 876-5432";
  const _email = identitas.email;
  const _schoolPeriod = "2026-2027";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-900 selection:text-white transition-colors duration-300">
      {/* =================================================== */}
      {/* NAVBAR CUSTOM (Simpel, Responsif, Anti-Error)       */}
      {/* =================================================== */}
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <SchoolNavbar schoolSlug={schoolSlug} />
      </header>

      {/* Menu Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 lg:hidden animate-in fade-in duration-200">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-6 text-center w-full max-w-xs">
            <Link
              href={`/${schoolSlug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-slate-800 dark:text-white"
            >
              Beranda
            </Link>
            <a
              href="#sejarah"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-slate-800 dark:text-white"
            >
              Sejarah Singkat
            </a>
            <a
              href="#pimpinan"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-slate-800 dark:text-white"
            >
              Pimpinan
            </a>
            <a
              href="#identitas"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-slate-800 dark:text-white"
            >
              Identitas Sekolah
            </a>
            <a
              href="#visimisi"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-slate-800 dark:text-white"
            >
              Visi & Misi
            </a>
            <Link
              href={`/${schoolSlug}/forum`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-slate-800 dark:text-white"
            >
              Forum Informasi
            </Link>

            <div className="w-full pt-4 flex flex-col gap-3">
              <Link
                href={`/${schoolSlug}/daftar`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* 1. HERO BANNER UTAMA                                */}
      {/* =================================================== */}
      <div className="relative w-full h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
            alt="Campus Background"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-2"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Tentang {ppdbTitle}
          </h1>
        </motion.div>
      </div>

      {/* =================================================== */}
      {/* 2. INTRO PARAGRAPH STRIP                            */}
      {/* =================================================== */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80 py-12 px-4 sm:px-8 transition-colors duration-300">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
            {ppdbTitle} merupakan institusi pendidikan teknik dan kejuruan yang
            didirikan dengan misi pengabdian ilmu pengetahuan dan teknologi
            untuk memajukan bangsa. {ppdbTitle} hadir untuk mengoptimalkan
            pembangunan pendidikan yang maju dan bermartabat.
          </p>
        </motion.div>
      </section>

      {/* =================================================== */}
      {/* 3. PROFIL VIDEO SHOWCASE                            */}
      {/* =================================================== */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Profil
          </h2>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-lg border border-slate-200 dark:border-slate-800">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/GR5wYYT4PJ8"
              title="Company Profile SMK Taruna Bhakti 2026"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </section>

      {/* =================================================== */}
      {/* 4. SEJARAH SEKOLAH                                  */}
      {/* =================================================== */}
      <section
        id="sejarah"
        className="py-12 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-blue-900 dark:border-blue-600 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Sejarah Singkat
            </h2>
          </div>
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap pt-2">
            {sejarah}
          </div>
        </motion.div>
      </section>

      {/* =================================================== */}
      {/* 5. FAKTA DAN ANGKA                                  */}
      {/* =================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
        >
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Fakta dan Angka
            </h2>
            <div className="w-16 h-1 bg-blue-900 dark:bg-blue-500 mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <Globe
                  size={28}
                  className="text-blue-900 dark:text-blue-400 stroke-[1.5]"
                />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Worldrank
                </h3>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800">
                {[
                  { label: "QS World Rankings 2025", val: "#256" },
                  { label: "QS Asian Rankings 2025", val: "#59" },
                  { label: "THE World Rankings 2025", val: "1201-1500" },
                  { label: "THE Asia Rankings 2024", val: "401-500" },
                  { label: "Lainnya", val: "" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {row.label}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <BookOpen
                  size={28}
                  className="text-blue-900 dark:text-blue-400 stroke-[1.5]"
                />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Pendidikan dan Pengajaran
                </h3>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800">
                {[
                  { label: "Multikampus", val: "4" },
                  { label: "Fakultas dan Sekolah", val: "12" },
                  { label: "Program Studi", val: "137" },
                  { label: "Joint Degrees", val: "10" },
                  { label: "Dosen", val: "1.422" },
                  { label: "Mahasiswa", val: "27.506" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {row.label}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <Award
                  size={28}
                  className="text-blue-900 dark:text-blue-400 stroke-[1.5]"
                />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Riset
                </h3>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800">
                {[
                  { label: "Pusat", val: "26" },
                  { label: "Pusat Unggulan Iptek", val: "9" },
                  { label: "Pusat Penelitian", val: "7" },
                  { label: "Kelompok Keahlian", val: "113" },
                  { label: "Laboratorium", val: "198" },
                  { label: "Scopus Journal", val: "1.248" },
                  { label: "International Journal", val: "421" },
                  { label: "Proceedings International", val: "674" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {row.label}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <GraduationCap
                  size={28}
                  className="text-blue-900 dark:text-blue-400 stroke-[1.5]"
                />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Inovasi
                </h3>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800">
                {[
                  { label: "Startup", val: "244" },
                  { label: "HKI", val: "1.176" },
                  { label: "Inovasi", val: "212" },
                  { label: "Tenant", val: "972" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {row.label}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =================================================== */}
      {/* 6. PIMPINAN / KEPALA SEKOLAH                        */}
      {/* =================================================== */}
      <section
        id="pimpinan"
        className="py-16 max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-24 border-t border-slate-100 dark:border-slate-800 mt-8 transition-colors duration-300"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Pimpinan
            </h2>
            <div className="w-16 h-1 bg-blue-900 dark:bg-blue-500 mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-blue-900 dark:border-blue-500 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                  alt="Kepala Sekolah"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div className="md:col-span-8 space-y-3 text-center md:text-left">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-widest block">
                Rektor / Kepala Sekolah
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Dr. H. Ahmad Fauzi, M.Pd.
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base pt-2">
                Dr. H. Ahmad Fauzi, M.Pd., sebagai Kepala Sekolah periode
                2023-2028 yang memimpin arah kebijakan akademik, pengembangan
                teknologi, serta pengabdian masyarakat guna membawa {ppdbTitle}{" "}
                unggul di tingkat nasional maupun global.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =================================================== */}
      {/* 7. IDENTITAS SEKOLAH                                  */}
      {/* =================================================== */}
      <section
        id="identitas"
        className="py-12 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24 border-t border-slate-100 dark:border-slate-800 pt-16 transition-colors duration-300"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-blue-900 dark:border-blue-600 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Identitas Sekolah
            </h2>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
            {[
              { label: "Nama Sekolah", value: identitas.nama },
              { label: "Status Akreditasi", value: identitas.akreditasi },
              { label: "Alamat Lengkap", value: identitas.alamat },
              { label: "NPSN", value: identitas.npsn },
              { label: "NIS", value: identitas.nis },
              { label: "NSS", value: identitas.nss },
              { label: "Tahun Berdiri", value: identitas.tahun_berdiri },
              { label: "Email Resmi", value: identitas.email },
            ].map((row, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row py-3.5">
                <div className="w-full sm:w-1/3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {row.label}
                </div>
                <div className="w-full sm:w-2/3 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                  {row.value || "-"}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* =================================================== */}
      {/* 8. VISI & MISI                                      */}
      {/* =================================================== */}
      <section
        id="visimisi"
        className="py-12 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 border-b border-blue-900 dark:border-blue-600 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Visi & Misi
            </h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Visi Sekolah
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed italic border-l-2 border-blue-900 dark:border-blue-500 pl-4 py-1">
              "{visi}"
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Misi Sekolah
            </h3>
            <div className="text-slate-700 dark:text-slate-300 text-base sm:text-lg whitespace-pre-wrap leading-relaxed pt-1">
              {misi}
            </div>
          </div>
        </motion.div>
      </section>

      {/* =================================================== */}
      {/* 9. TUJUAN SEKOLAH                                   */}
      {/* =================================================== */}
      <section
        id="tujuan"
        className="py-12 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-blue-900 dark:border-blue-600 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Tujuan Sekolah
            </h2>
          </div>
          <div className="text-slate-700 dark:text-slate-300 text-base sm:text-lg whitespace-pre-wrap leading-relaxed pt-2">
            {tujuan}
          </div>
        </motion.div>
      </section>

      {/* =================================================== */}
      {/* 10. KAMPUS / LOKASI                                 */}
      {/* =================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 mt-12 transition-colors duration-300">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Kunjungan
            </h2>
            <div className="w-16 h-1 bg-blue-900 dark:bg-blue-500 mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Kampus Utama
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {identitas.alamat}
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-900 dark:text-blue-400">
                {identitas.email}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Pusat Inovasi & Praktikum
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Fasilitas laboratorium komputer terpadu, studio multimedia, dan
                workshop teknik berstandar industri.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Layanan PPDB
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Pusat informasi pendaftaran siswa baru setiap hari kerja pukul
                08.00 - 15.00 WIB.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <SchoolFooter schoolSlug={schoolSlug} />
    </div>
  );
}
