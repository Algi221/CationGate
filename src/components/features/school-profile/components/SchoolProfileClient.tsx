"use client";

import React, { useState, useEffect } from "react";
import { SchoolNavbar } from "@/components/landing/SchoolNavbar";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { ProfileHero } from "@/components/features/school-profile/components/ProfileHero";
import { ProfileSejarah } from "@/components/features/school-profile/components/ProfileSejarah";
import { ProfilePimpinan } from "@/components/features/school-profile/components/ProfilePimpinan";
import { ProfileIdentitas } from "@/components/features/school-profile/components/ProfileIdentitas";
import { ProfileVisiMisi } from "@/components/features/school-profile/components/ProfileVisiMisi";
import { usePPDB } from "@/context/PPDBContext";

export interface SchoolProfileData {
  nama?: string;
  npsn?: string;
  akreditasi?: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  logo_url?: string;
  hero_image?: string;
  video_profil_url?: string;
  sejarah?: string;
  ringkasan?: string;
  visi?: string;
  misi?: string;
  tujuan?: string;
  pimpinan?: {
    nama?: string;
    jabatan?: string;
    foto?: string;
    sambutan?: string;
  };
  identitas?: {
    nama?: string;
    akreditasi?: string;
    alamat?: string;
    npsn?: string;
    nis?: string;
    nss?: string;
    tahun_berdiri?: string;
    email?: string;
  };
  visi_misi?: {
    visi?: string;
    misi?: string;
  };
  [key: string]: unknown;
}

interface SchoolProfileClientProps {
  initialProfile?: SchoolProfileData;
  serverSchoolSlug: string;
  initialSchoolName?: string;
}

export function SchoolProfileClient({
  initialProfile,
  serverSchoolSlug,
  initialSchoolName
}: SchoolProfileClientProps) {
  const { ppdbTitle } = usePPDB();
  const [profileData, setProfileData] = useState<SchoolProfileData>(initialProfile || {});

  const currentTitle =
    profileData?.nama ||
    profileData?.identitas?.nama ||
    initialSchoolName ||
    ppdbTitle ||
    serverSchoolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Background refresh only if initialProfile was not provided from server component
  useEffect(() => {
    if (serverSchoolSlug && (!initialProfile || Object.keys(initialProfile).length === 0)) {
      fetch(`/api/school-profile?school_slug=${encodeURIComponent(serverSchoolSlug)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setProfileData(data.data);
          }
        })
        .catch(() => {});
    }
  }, [serverSchoolSlug, initialProfile]);

  const identitas = {
    nama: (profileData?.nama as string) || (profileData?.identitas?.nama as string) || currentTitle,
    akreditasi: (profileData?.akreditasi as string) || (profileData?.identitas?.akreditasi as string) || "-",
    alamat: (profileData?.alamat as string) || (profileData?.identitas?.alamat as string) || "-",
    npsn: (profileData?.npsn as string) || (profileData?.identitas?.npsn as string) || "-",
    nis: (profileData?.nis as string) || (profileData?.identitas?.nis as string) || "-",
    nss: (profileData?.nss as string) || (profileData?.identitas?.nss as string) || "-",
    tahun_berdiri: (profileData?.tahun_berdiri as string) || (profileData?.identitas?.tahun_berdiri as string) || "-",
    email: (profileData?.email as string) || (profileData?.identitas?.email as string) || "-"
  };

  const sejarah = profileData?.sejarah || "";
  const videoUrl = profileData?.video_profil_url || "";
  const ringkasan = profileData?.ringkasan || "";
  const heroImage = profileData?.hero_image || "";
  
  const visi = profileData?.visi || profileData?.visi_misi?.visi || "";
  const misi = profileData?.misi || profileData?.visi_misi?.misi || "";
  const tujuan = profileData?.tujuan || "";
  const pimpinan = profileData?.pimpinan;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-900 selection:text-white transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <SchoolNavbar schoolSlug={serverSchoolSlug} overrideTitle={currentTitle} />
      </header>

      <main>
        <ProfileHero
          ppdbTitle={currentTitle}
          ringkasan={ringkasan}
          heroImage={heroImage}
        />

        <ProfileSejarah
          sejarah={sejarah}
          videoUrl={videoUrl}
          ppdbTitle={currentTitle}
        />

        <ProfileIdentitas identitas={identitas} />

        <ProfileVisiMisi
          visi={visi}
          misi={misi}
          tujuan={tujuan}
        />

        <ProfilePimpinan
          ppdbTitle={currentTitle}
          pimpinan={pimpinan}
        />
      </main>

      <SchoolFooter schoolSlug={serverSchoolSlug} />
    </div>
  );
}
