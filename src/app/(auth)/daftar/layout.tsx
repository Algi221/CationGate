import { constructMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Pendaftaran Sekolah Baru - Digitalisasi SPMB & PPDB",
  description:
    "Daftarkan instansi SMK Anda ke platform CationGate. Nikmati masa uji coba gratis untuk digitalisasi sistem pendaftaran siswa baru yang otomatis dan modern.",
  canonicalUrl: "/daftar",
});

export default function DaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Pendaftaran Sekolah Baru", url: "/daftar" },
        ]}
      />
      {children}
    </>
  );
}
