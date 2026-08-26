"use client";

import React, { useEffect, useState } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useParams, useRouter } from "next/navigation";
import { SchoolNavbar } from "@/components/landing/SchoolNavbar";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { ProfileHero } from "@/components/features/school-profile/components/ProfileHero";
import { ProfileSejarah } from "@/components/features/school-profile/components/ProfileSejarah";
import { ProfilePimpinan } from "@/components/features/school-profile/components/ProfilePimpinan";
import { ProfileIdentitas } from "@/components/features/school-profile/components/ProfileIdentitas";
import { ProfileVisiMisi } from "@/components/features/school-profile/components/ProfileVisiMisi";
import { ProfileKunjungan } from "@/components/features/school-profile/components/ProfileKunjungan";

export default function ProfilSekolahPublicPage() {
  const { ppdbTitle, profilSekolah, isSchoolNotFound, schoolStatus } = usePPDB();
  const params = useParams();
  const router = useRouter();
  const schoolSlug = params?.school_slug as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-900 dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isSchoolNotFound || schoolStatus === "TAKEDOWN" || schoolStatus === "SUSPENDED") {
    router.push("/");
    return null;
  }

  const identitas = profilSekolah?.identitas || {
    nama: ppdbTitle || (schoolSlug === "smktarunabhakti" ? "SMK Taruna Bhakti" : "Institusi Pendidikan Unggulan"),
    akreditasi: profilSekolah?.identitas?.akreditasi || (schoolSlug === "smktarunabhakti" ? "A (Unggul)" : "-"),
    alamat: profilSekolah?.identitas?.alamat || (schoolSlug === "smktarunabhakti" ? "Jl. Pekapuran RT 02/06 Curug, Cimanggis, Kota Depok" : "-"),
    npsn: profilSekolah?.identitas?.npsn || (schoolSlug === "smktarunabhakti" ? "20229182" : "-"),
    nis: profilSekolah?.identitas?.nis || (schoolSlug === "smktarunabhakti" ? "100290" : "-"),
    nss: profilSekolah?.identitas?.nss || (schoolSlug === "smktarunabhakti" ? "302026501001" : "-"),
    tahun_berdiri: profilSekolah?.identitas?.tahun_berdiri || (schoolSlug === "smktarunabhakti" ? "1998" : "-"),
    email: profilSekolah?.identitas?.email || (schoolSlug === "smktarunabhakti" ? "tarunabhakti.smk@gmail.com" : "admin@sekolah.sch.id")
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-900 selection:text-white transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <SchoolNavbar schoolSlug={schoolSlug} />
      </header>

      <ProfileHero
        ppdbTitle={ppdbTitle}
        ringkasan={profilSekolah?.ringkasan}
        heroImage={profilSekolah?.hero_image}
      />
      <ProfileSejarah
        sejarah={sejarah}
        videoUrl={profilSekolah?.video_profil_url}
        ppdbTitle={ppdbTitle}
      />
      <ProfilePimpinan ppdbTitle={ppdbTitle} pimpinan={profilSekolah?.pimpinan} />
      <ProfileIdentitas identitas={identitas} />
      <ProfileVisiMisi visi={visi} misi={misi} tujuan={tujuan} />
      <ProfileKunjungan identitas={identitas} />

      <SchoolFooter schoolSlug={schoolSlug} />
    </div>
  );
}
