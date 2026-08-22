import React from "react";
import { constructMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "Fitur Unggulan - Sistem Manajemen PPDB & Administrasi SMK CationGate",
  description:
    "Jelajahi fitur lengkap CationGate: Manajemen Calon Siswa, Pembagian Kelas Otomatis, Validasi Berkas Jurusan, Integrasi Dapodik, dan Landing Page Gratis untuk SMK.",
  canonicalUrl: "/fitur",
  keywords: [
    "Fitur CationGate",
    "Fitur PPDB SMK",
    "Manajemen Siswa Baru",
    "Pembagian Kelas Otomatis",
    "Validasi Berkas PPDB",
    "Ekspor Data Dapodik",
  ],
});

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Fitur Unggulan", url: "/fitur" },
        ]}
      />
      {children}
    </>
  );
}
