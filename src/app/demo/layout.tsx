import React from "react";
import { constructMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "Demo Interaktif - Coba Langsung Alur PPDB & Dashboard CationGate",
  description:
    "Coba langsung simulasi pendaftaran siswa baru, verifikasi berkas, dan dashboard manajemen sekolah CationGate secara gratis.",
  canonicalUrl: "/demo",
  keywords: [
    "Demo CationGate",
    "Simulasi PPDB Online",
    "Trial SPMB Sekolah",
    "Dashboard PPDB Demo",
  ],
});

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Demo Interaktif", url: "/demo" },
        ]}
      />
      {children}
    </>
  );
}
