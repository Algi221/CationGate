"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  return (
    <div className="max-w-xl mx-auto p-8 border border-slate-100 rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Verifikasi Instansi</h1>
      <p className="text-slate-500 mb-8">Mohon unggah dokumen resmi sekolah untuk melanjutkan akses penuh.</p>
      <Button className="bg-slate-900 text-white">Unggah Dokumen</Button>
    </div>
  );
}
