import { Metadata } from "next";

export const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.FRONTEND_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/$/, "");
  }
  return "https://cationgate.site";
};

export const siteConfig = {
  name: "CationGate",
  shortName: "CationGate",
  domain: "cationgate.site",
  url: getBaseUrl(),
  title: "CationGate - Platform Manajemen SPMB & PPDB Khusus SMK",
  description:
    "Platform manajemen SPMB & PPDB khusus SMK modern di Indonesia. Digitalisasi penerimaan siswa baru, verifikasi berkas, seleksi jalur masuk, dan pembagian kelas terpadu berbasis cloud.",
  keywords: [
    "SPMB SMK",
    "PPDB SMK",
    "Platform SPMB SMK",
    "Manajemen SPMB SMK",
    "Aplikasi SPMB SMK",
    "SPMB Online SMK",
    "PPDB Online SMK",
    "Sistem SPMB SMK Terintegrasi",
    "Manajemen PPDB SMK",
    "Platform PPDB SMK Digital",
    "Penerimaan Siswa Baru SMK",
    "Sistem Informasi SPMB SMK",
    "Sistem Penerimaan Murid Baru",
    "Pendaftaran SMK Online",
    "Sistem Seleksi PPDB Otomatis",
    "Verifikasi Berkas SPMB Online",
    "Integrasi Dapodik PPDB",
    "Software Administrasi SMK Cloud",
    "SaaS Sekolah Indonesia",
    "Website SPMB Custom SMK",
    "Pendaftaran Sekolah Digital",
    "CationGate",
    "CationGate SPMB",
    "CationGate PPDB",
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
