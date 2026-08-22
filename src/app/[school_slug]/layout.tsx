import React from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { SchoolJsonLd } from "@/components/seo/JsonLd";
import { createClient } from "@supabase/supabase-js";

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
  let schoolName = formatSchoolName(school_slug);
  let schoolDescription = `Portal resmi Penerimaan Peserta Didik Baru (PPDB) & SPMB Online ${schoolName}. Daftar mandiri, pantau status verifikasi berkas jurusan, dan cek pengumuman seleksi.`;
  let logoUrl: string | undefined = undefined;

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: school } = await supabase
        .from("schools")
        .select("name, description, logo_url")
        .eq("slug", school_slug)
        .maybeSingle();

      if (school) {
        if (school.name) schoolName = school.name;
        if (school.description) schoolDescription = school.description;
        if (school.logo_url) logoUrl = school.logo_url;
      }
    }
  } catch (err) {
    console.warn(`Could not fetch metadata for school: ${school_slug}`, err);
  }

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
  const schoolName = formatSchoolName(school_slug);

  return (
    <>
      <SchoolJsonLd name={schoolName} slug={school_slug} />
      {children}
    </>
  );
}
