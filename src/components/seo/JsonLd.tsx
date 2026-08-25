import React from "react";
import { siteConfig } from "@/lib/seo";

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CationGate",
    alternateName: [
      "CationGate PPDB",
      "CationGate SPMB",
      "CationGate SaaS",
      "CationGate - Platform Manajemen SPMB & PPDB Khusus SMK",
    ],
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    hasPart: [
      {
        "@type": "WebPage",
        name: "Pendaftaran Sekolah Baru",
        description: "Daftarkan instansi SMK Anda dan dapatkan akses uji coba sistem PPDB digital terpadu.",
        url: `${siteConfig.url}/daftar`,
      },
      {
        "@type": "WebPage",
        name: "Fitur Unggulan PPDB",
        description: "Modul lengkap pendaftaran online, seleksi otomatis, verifikasi berkas, dan ekspor Dapodik.",
        url: `${siteConfig.url}/fitur`,
      },
      {
        "@type": "WebPage",
        name: "Demo Interaktif",
        description: "Coba langsung simulasi formulir pendaftaran siswa dan fitur dashboard admin sekolah.",
        url: `${siteConfig.url}/demo`,
      },
      {
        "@type": "WebPage",
        name: "Tentang CationGate",
        description: "Misi dan kisah transformasi digital PPDB SMK di Indonesia.",
        url: `${siteConfig.url}/tentang`,
      },
      {
        "@type": "WebPage",
        name: "Hubungi Kami",
        description: "Konsultasi sistem PPDB dan layanan bantuan teknis untuk instansi sekolah.",
        url: `${siteConfig.url}/kontak`,
      },
      {
        "@type": "WebPage",
        name: "Blog",
        description: "Kumpulan artikel dan panduan penyelenggaraan PPDB/SPMB modern.",
        url: `${siteConfig.url}/blog`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SiteNavigationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Pendaftaran Sekolah Baru",
        description: "Daftarkan instansi SMK Anda ke platform CationGate dan nikmati masa uji coba gratis PPDB online.",
        url: `${siteConfig.url}/daftar`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Fitur & Modul PPDB",
        description: "Manajemen pendaftaran siswa, verifikasi berkas jurusan, seleksi otomatis, dan ekspor Dapodik.",
        url: `${siteConfig.url}/fitur`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Demo Interaktif",
        description: "Simulasi alur pendaftaran calon siswa dan eksplorasi dashboard admin sekolah secara langsung.",
        url: `${siteConfig.url}/demo`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Tentang CationGate",
        description: "Mengenal misi transformasi sistem penerimaan siswa baru SMK dan tim pengembang CationGate.",
        url: `${siteConfig.url}/tentang`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "Hubungi Kami",
        description: "Konsultasi teknis, kemitraan instansi, dan layanan bantuan integrasi sistem sekolah.",
        url: `${siteConfig.url}/kontak`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 6,
        name: "Blog & Panduan PPDB",
        description: "Wawasan, tips administrasi, dan kabar terkini seputar SPMB serta PPDB digital.",
        url: `${siteConfig.url}/blog`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/assets/logo_cationgate/CationGate_Logo.png`,
    description: siteConfig.description,
    founder: [
      {
        "@type": "Person",
        name: "Algifahri Tri Ramadhan",
      },
      {
        "@type": "Person",
        name: "Zefanya Law Prasetyo",
      },
      {
        "@type": "Person",
        name: "Farel Al Fatir Fauzan",
      },
      {
        "@type": "Person",
        name: "Husein",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      email: siteConfig.contact.email,
      areaServed: "ID",
      availableLanguage: ["Indonesian", "English"],
    },
    sameAs: [
      siteConfig.socials.github,
      siteConfig.socials.instagram,
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CationGate",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All (Web-based Cloud SaaS)",
    url: siteConfig.url,
    description: siteConfig.description,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: "0",
      highPrice: "5000000",
      offerCount: "4",
      offers: [
        {
          "@type": "Offer",
          name: "Free Tier",
          price: "0",
          priceCurrency: "IDR",
        },
        {
          "@type": "Offer",
          name: "Starter School",
          price: "499000",
          priceCurrency: "IDR",
        },
        {
          "@type": "Offer",
          name: "Pro School",
          price: "1499000",
          priceCurrency: "IDR",
        },
      ],
    },
    featureList: [
      "Manajemen PPDB Online SMK",
      "Sistem SPMB Digital Terpadu",
      "Sistem Seleksi Jurusan & Berkas Otomatis",
      "Verifikasi Berkas Online",
      "Ekspor Data Siap Dapodik",
      "Payment Gateway PPDB Multi-Channel",
      "Notifikasi WhatsApp & Email Realtime",
      "Portal Publik Profil Sekolah",
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Bagaimana CationGate menjamin keamanan data & privasi sekolah?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CationGate menerapkan enkripsi AES-256 tingkat tinggi untuk seluruh data pendaftaran dan akademik. Infrastruktur cloud kami mematuhi standar ISO 27001 dan panduan keamanan data Kemendikbudristek Dapodik.",
        },
      },
      {
        "@type": "Question",
        name: "Bagaimana alur pendaftaran murid baru (PPDB / SPMB) bekerja di platform ini?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Calon siswa dapat mendaftar secara mandiri lewat formulir online yang responsif dan mengunggah berkas. Panitia sekolah dapat memverifikasi berkas dan mengumumkan kelulusan secara otomatis.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah data pendaftar dapat diekspor langsung ke Dapodik?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ya, CationGate menyediakan fitur ekspor data satu klik yang disesuaikan secara khusus dengan format upload resmi Dapodik (Excel/CSV), menghilangkan kebutuhan input ulang secara manual.",
        },
      },
      {
        "@type": "Question",
        name: "Perangkat apa saja yang dibutuhkan oleh guru dan siswa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CationGate berbasis cloud 100% dan sepenuhnya responsif. Dapat diakses dengan lancar di komputer, laptop, tablet, maupun smartphone tanpa perlu menginstal aplikasi berat.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah ada pelatihan untuk staf sekolah sebelum implementasi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tentu. Kami menyediakan sesi on-boarding khusus, modul panduan lengkap, dan dukungan teknis proaktif selama masa transisi untuk memastikan seluruh staf sekolah nyaman menggunakan sistem.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SchoolJsonLd({
  name,
  slug,
  description,
  address,
  logo,
}: {
  name: string;
  slug: string;
  description?: string;
  address?: string;
  logo?: string;
}) {
  const schoolUrl = `${siteConfig.url}/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name,
    url: schoolUrl,
    description: description || `Portal Resmi PPDB & SPMB ${name}`,
    ...(logo && { logo: logo.startsWith("http") ? logo : `${siteConfig.url}${logo.startsWith("/") ? "" : "/"}${logo}` }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
        addressCountry: "ID",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
