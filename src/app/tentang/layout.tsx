import React from "react";
import { constructMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "Tentang Kami - Mengenal Platform CationGate & Tim Pengembang",
  description:
    "Pelajari kisah dan misi CationGate dalam mendigitalisasi PPDB, SPMB, dan sistem administrasi sekolah di Indonesia berawal dari inisiatif SMK Taruna Bhakti Depok.",
  canonicalUrl: "/tentang",
  keywords: [
    "Tentang CationGate",
    "Profil CationGate",
    "Pengembang PPDB Online",
    "SMK Taruna Bhakti Depok",
    "Platform SPMB Indonesia",
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Tentang Kami", url: "/tentang" },
        ]}
      />
      {children}
    </>
  );
}
