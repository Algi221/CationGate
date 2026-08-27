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

export default function ProfilSekolahPublicPage() {
  const { ppdbTitle, profilSekolah, isSchoolNotFound, schoolStatus } = usePPDB();
  const params = useParams();
  const router = useRouter();
  const schoolSlug = params?.school_slug as string;
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveProfil, setLiveProfil] = useState<any>(null);
  const [liveTitle, setLiveTitle] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (schoolSlug) {
      fetch(`/api/config?school_slug=${encodeURIComponent(schoolSlug)}&_t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const c = data.data;
            if (c.ppdb_title) setLiveTitle(c.ppdb_title);
            let p = c.ppdb_profil_sekolah;
            if (typeof p === "string" && (p.startsWith("{") || p.startsWith("["))) {
              try { p = JSON.parse(p); } catch (_e) {}
            }
            if (p && typeof p === "object") {
              setLiveProfil(p);
            }
          }
        })
        .catch(console.error);
    }
  }, [schoolSlug]);

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

  let rawProfil = liveProfil || profilSekolah;
  if (typeof rawProfil === "string" && (rawProfil.startsWith("{") || rawProfil.startsWith("["))) {
    try { rawProfil = JSON.parse(rawProfil); } catch (_e) {}
  }
  const activeProfil = (rawProfil && typeof rawProfil === "object") ? rawProfil : {};
  const currentTitle = liveTitle || ppdbTitle || (schoolSlug === "smktarunabhakti" ? "SMK Taruna Bhakti" : (schoolSlug ? schoolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Institusi Pendidikan"));

  const identitas = activeProfil?.identitas || {
    nama: currentTitle,
    akreditasi: activeProfil?.identitas?.akreditasi || (schoolSlug === "smktarunabhakti" ? "A (Unggul)" : "-"),
    alamat: activeProfil?.identitas?.alamat || (schoolSlug === "smktarunabhakti" ? "Jl. Pekapuran RT 02/06 Curug, Cimanggis, Kota Depok" : "-"),
    npsn: activeProfil?.identitas?.npsn || (schoolSlug === "smktarunabhakti" ? "20229182" : "-"),
    nis: activeProfil?.identitas?.nis || (schoolSlug === "smktarunabhakti" ? "100290" : "-"),
    nss: activeProfil?.identitas?.nss || (schoolSlug === "smktarunabhakti" ? "302026501001" : "-"),
    tahun_berdiri: activeProfil?.identitas?.tahun_berdiri || (schoolSlug === "smktarunabhakti" ? "1998" : "-"),
    email: activeProfil?.identitas?.email || (schoolSlug === "smktarunabhakti" ? "tarunabhakti.smk@gmail.com" : "admin@sekolah.sch.id")
  };

  const sejarah =
    activeProfil?.sejarah ||
    `${currentTitle} merupakan institusi pendidikan kejuruan dan teknik terdepan yang didirikan dengan komitmen tinggi pada tahun 1998 sebagai pusat keunggulan vokasi. Dengan misi pengabdian ilmu pengetahuan dan teknologi untuk memajukan bangsa, ${currentTitle} terus bertransformasi mengoptimalkan pembangunan pendidikan yang maju, mandiri, dan bermartabat.`;

  const visi =
    activeProfil?.visi_misi?.visi ||
    `Menjadi institusi pendidikan kejuruan yang unggul, mandiri, berbudaya, serta diakui secara global pada tahun 2030.`;

  const misi =
    activeProfil?.visi_misi?.misi ||
    `1. Menyelenggarakan proses pembelajaran berbasis teknologi dan industri terkini.\n2. Mengembangkan karakter peserta didik yang berakhlak mulia, disiplin, dan berjiwa kepemimpinan.\n3. Menjalin kerjasama strategis dengan dunia usaha dan dunia industri (DUDI).\n4. Mendorong riset dan inovasi aplikatif yang bermanfaat bagi masyarakat luas.`;

  const tujuan =
    activeProfil?.tujuan ||
    `1. Menghasilkan lulusan yang kompeten dan terserap di dunia kerja.\n2. Mewujudkan tata kelola institusi yang transparan, akuntabel, dan berbasis digital.\n3. Mengembangkan potensi peserta didik secara holistik.`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-900 selection:text-white transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <SchoolNavbar schoolSlug={schoolSlug} />
      </header>

      <ProfileHero
        ppdbTitle={currentTitle}
        ringkasan={activeProfil?.ringkasan}
        heroImage={activeProfil?.hero_image}
      />
      <ProfileSejarah
        sejarah={sejarah}
        videoUrl={activeProfil?.video_profil_url}
        ppdbTitle={currentTitle}
      />
      <ProfilePimpinan ppdbTitle={currentTitle} pimpinan={activeProfil?.pimpinan} />
      <ProfileIdentitas identitas={identitas} />
      <ProfileVisiMisi visi={visi} misi={misi} tujuan={tujuan} />

      <SchoolFooter schoolSlug={schoolSlug} />
    </div>
  );
}
