import React from "react";
import { constructMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "Blog & Wawasan Pendidikan - Inovasi PPDB & SPMB Digital",
  description:
    "Kumpulan artikel, tips manajemen sekolah, dan kabar terkini seputar transformasi digital sistem PPDB & SPMB di Indonesia.",
  canonicalUrl: "/blog",
  keywords: [
    "Blog CationGate",
    "Artikel PPDB Online",
    "Tips SPMB Sekolah",
    "Inovasi Sekolah Digital",
    "Transformasi Pendidikan Indonesia",
  ],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Blog & Artikel", url: "/blog" },
        ]}
      />
      {children}
    </>
  );
}
