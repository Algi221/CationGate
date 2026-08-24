"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ErrorView } from "@/components/features/error";

export default function GlobalNotFound() {
  const pathname = usePathname();

  return (
    <ErrorView
      title="Halaman Tidak Ditemukan"
      description="Halaman atau tautan yang Anda tuju tidak ditemukan, sudah dipindahkan, atau alamat URL salah ketik."
      urlPath={pathname || undefined}
      ctaText="Kembali ke Beranda"
      ctaHref="/"
    />
  );
}
