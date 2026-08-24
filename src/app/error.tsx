"use client";

import React, { useEffect } from "react";
import { ErrorView } from "@/components/features/error";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error: _error, reset: _reset }: ErrorProps) {
  useEffect(() => {
    // Keep client console clean
  }, []);

  return (
    <ErrorView
      title="Terjadi Kesalahan Sistem"
      description="Maaf, sistem mengalami kendala saat memuat halaman ini. Silakan kembali ke beranda."
      ctaText="Kembali ke Beranda"
      ctaHref="/"
    />
  );
}
