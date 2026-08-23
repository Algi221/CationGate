import React from "react";
import { constructMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "Hubungi Kami - Konsultasi & Layanan Implementasi PPDB CationGate",
  description:
    "Hubungi tim teknis dan sales CationGate untuk konsultasi integrasi PPDB & SPMB, demo sistem manajemen sekolah, atau dukungan teknis 24/7.",
  canonicalUrl: "/kontak",
  keywords: [
    "Kontak CationGate",
    "Hubungi CationGate",
    "Konsultasi PPDB Sekolah",
    "Layanan SPMB Online",
    "Customer Support CationGate",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Hubungi Kami", url: "/kontak" },
        ]}
      />
      {children}
    </>
  );
}
