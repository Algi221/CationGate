import { Metadata } from "next";

export const siteConfig = {
  name: "CationGate",
  shortName: "CationGate",
  domain: "cationgate.site",
  url: process.env.NEXT_PUBLIC_APP_URL || process.env.FRONTEND_URL || "https://cationgate.site",
  title: "CationGate - Platform Manajemen PPDB & SPMB SMK Modern",
  description:
    "Solusi SaaS manajemen Penerimaan Peserta Didik Baru (PPDB) & SPMB online cerdas, verifikasi berkas otomatis, dan sistem administrasi pendaftaran sekolah terpadu yang terintegrasi Dapodik khusus SMK di seluruh Indonesia.",
  keywords: [
    "PPDB Online",
    "SPMB Online",
    "PPDB SMK",
    "SPMB SMK",
    "Aplikasi PPDB SMK",
    "Sistem SPMB SMK Terintegrasi",
    "Manajemen PPDB SMK",
    "Platform SPMB SMK Digital",
    "Penerimaan Peserta Didik Baru SMK",
    "Sistem Informasi PPDB SMK",
    "Sistem Penerimaan Murid Baru",
    "Pendaftaran SMK Online",
    "Sistem Seleksi PPDB Otomatis",
    "Verifikasi Berkas PPDB Online",
    "Integrasi Dapodik PPDB",
    "Software Administrasi SMK Cloud",
    "SaaS Sekolah Indonesia",
    "Website PPDB Custom SMK",
    "Pendaftaran Sekolah Digital",
    "CationGate",
    "CationGate PPDB",
    "CationGate SPMB",
  ],
  authors: [
    {
      name: "CationGate Engineering Team",
      url: "https://cationgate.site",
    },
    {
      name: "SMK Taruna Bhakti Depok",
      url: "https://cationgate.site/tentang",
    },
  ],
  creator: "CationGate",
  publisher: "CationGate Inc.",
  themeColor: "#2563EB",
  ogImage: "/opengraph-image",
  locale: "id_ID",
  contact: {
    email: "cationgate@gmail.com",
    phone: "+6285167348039",
    whatsapp: "https://wa.me/6285167348039",
  },
  socials: {
    github: "https://github.com/Algi221/CationGate",
    instagram: "https://instagram.com/cationgate",
  },
};

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/icon.png",
  noIndex = false,
  canonicalUrl,
  keywords = siteConfig.keywords,
  type = "website",
  publishedTime,
  authors,
}: MetadataProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title;

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const canonical = canonicalUrl
    ? canonicalUrl.startsWith("http")
      ? canonicalUrl
      : `${siteUrl}${canonicalUrl.startsWith("/") ? "" : "/"}${canonicalUrl}`
    : siteUrl;

  const ogImageUrl = image.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: authors ? authors.map((name) => ({ name })) : siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Platform PPDB & SPMB Sekolah Modern`,
        },
      ],
      locale: siteConfig.locale,
      type,
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
      creator: "@cationgate",
    },
    icons: {
      icon: icons,
      shortcut: icons,
      apple: icons,
    },
    manifest: "/manifest.webmanifest",
  };
}
