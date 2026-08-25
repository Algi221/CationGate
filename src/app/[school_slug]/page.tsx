"use client";

import React from "react";
import { SchoolNavbar } from "@/components/landing/SchoolNavbar";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { ErrorView } from "@/components/features/error";
import { SchoolMaintenanceView } from "@/components/features/school-landing/components/SchoolMaintenanceView";
import { useSchoolLandingState } from "@/components/features/school-landing/hooks/useSchoolLandingState";
import { SchoolHero } from "@/components/features/school-landing/components/SchoolHero";
import { SchoolGelombang } from "@/components/features/school-landing/components/SchoolGelombang";
import { SchoolAlur } from "@/components/features/school-landing/components/SchoolAlur";
import { SchoolMajors } from "@/components/features/school-landing/components/SchoolMajors";
import { SchoolKemitraan } from "@/components/features/school-landing/components/SchoolKemitraan";
import { SchoolFaq } from "@/components/features/school-landing/components/SchoolFaq";
import { SchoolContact } from "@/components/features/school-landing/components/SchoolContact";

export default function SchoolLandingPage() {
  const {
    schoolSlug,
    schoolDisplayName,
    isSchoolNotFound,
    isLandingPageActive,
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
  } = useSchoolLandingState();

  if (isSchoolNotFound) {
    return (
      <ErrorView
        title="Halaman Tidak Ditemukan"
        description={`Maaf, halaman instansi '${schoolSlug}' tidak dapat ditemukan atau belum terdaftar di platform CationGate.`}
        urlPath={`/${schoolSlug}`}
        ctaText="Kembali ke Beranda CationGate"
        ctaHref="/"
      />
    );
  }

  if (!isLandingPageActive) {
    return (
      <SchoolMaintenanceView
        schoolSlug={schoolSlug}
        schoolDisplayName={schoolDisplayName}
        waAdmin={waAdmin}
        schoolPeriod={schoolPeriod}
        address={address}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <SchoolNavbar schoolSlug={schoolSlug} />

      {/* MAIN CONTENT SECTIONS */}
      <main className="grow w-full relative z-0">
        {/* 1. HERO SECTION */}
        <SchoolHero
          schoolSlug={schoolSlug}
          schoolDisplayName={schoolDisplayName}
          heroTitle={heroTitle}
          heroTitleSub={heroTitleSub}
          heroSubtitle={heroSubtitle}
          address={address}
          majors={majors}
        />

        {/* 2. JADWAL GELOMBANG PENDAFTARAN */}
        <SchoolGelombang
          schoolPeriod={schoolPeriod}
          gelombangConfig={gelombangConfig}
          formatDate={formatDate}
        />

        {/* 3. ALUR PENDAFTARAN */}
        <SchoolAlur
          schoolPeriod={schoolPeriod}
          alurList={alurList}
        />

        {/* 4. PROGRAM KEAHLIAN / JURUSAN */}
        <SchoolMajors
          schoolSlug={schoolSlug}
          majors={majors}
        />

        {/* 5. KEMITRAAN INDUSTRI & SERTIFIKASI */}
        <SchoolKemitraan
          partnersList={partnersList}
        />

        {/* 6. FAQ PPDB */}
        <SchoolFaq
          faqTitle={faqTitle}
          faqSubtitle={faqSubtitle}
          faqList={faqList}
        />

        {/* 7. LOKASI MAPS & KONTAK WHATSAPP */}
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
