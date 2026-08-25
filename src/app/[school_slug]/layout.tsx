import React from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { SchoolJsonLd } from "@/components/seo/JsonLd";
import { notFound } from "next/navigation";
import { SaasService } from "@/server/services/SaasService";

interface SchoolLayoutProps {
  children: React.ReactNode;
  params: Promise<{ school_slug: string }>;
}

function formatSchoolName(slug: string): string {
  if (slug === "smktarunabhakti" || slug === "smk-taruna-bhakti") {
    return "SMK Taruna Bhakti Depok";
  }
  return slug
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school_slug: string }>;
}): Promise<Metadata> {
  const { school_slug } = await params;
  const schoolRes = await SaasService.getSchoolBySlug(school_slug);

  if (!schoolRes.success || schoolRes.notFound) {
    return constructMetadata({
      title: "Halaman Tidak Ditemukan - CationGate",
      description: "Halaman atau instansi yang Anda tuju tidak ditemukan di platform CationGate.",
      canonicalUrl: `/${school_slug}`,
    });
  }

  const school = schoolRes.data;
  const schoolName = school?.name || formatSchoolName(school_slug);
  const schoolDescription = school?.description || `Portal resmi Penerimaan Peserta Didik Baru (PPDB) & SPMB Online ${schoolName}. Daftar mandiri, pantau status verifikasi berkas jurusan, dan cek pengumuman seleksi.`;
  const logoUrl = school?.logo_url;

  return constructMetadata({
    title: `PPDB & SPMB Online ${schoolName}`,
    description: schoolDescription,
    canonicalUrl: `/${school_slug}`,
    image: logoUrl || "/opengraph-image",
    keywords: [
      `PPDB ${schoolName}`,
      `SPMB ${schoolName}`,
      `Pendaftaran Siswa Baru ${schoolName}`,
      `PPDB Online ${school_slug}`,
      `Info Pendaftaran ${schoolName}`,
      "PPDB Online",
      "SPMB Online",
      "CationGate",
    ],
  });
}

export default async function SchoolLayout({
  children,
  params,
}: SchoolLayoutProps) {
  const { school_slug } = await params;
  const schoolRes = await SaasService.getSchoolBySlug(school_slug);

  if (!schoolRes.success || schoolRes.notFound) {
    notFound();
  }

  const schoolName = schoolRes.data?.name || formatSchoolName(school_slug);

  return (
    <>
      <SchoolJsonLd name={schoolName} slug={school_slug} />
      {children}
    </>
  );
}
