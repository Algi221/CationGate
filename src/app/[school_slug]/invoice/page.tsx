"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useInvoiceState } from "@/components/features/invoice/hooks/useInvoiceState";
import { InvoicePrintStyles } from "@/components/features/invoice/components/InvoicePrintStyles";
import { InvoiceDocumentSheet } from "@/components/features/invoice/components/InvoiceDocumentSheet";
import { InvoiceActionPanel } from "@/components/features/invoice/components/InvoiceActionPanel";

function InvoiceContent() {
  const {
    isAdmin,
    data,
    regCost,
    waGroupUrl,
    loading,
    error,
    schoolSlug,
    handleSendWhatsApp,
    handlePrint
  } = useInvoiceState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] p-6">
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Oops!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error || "Data tidak ditemukan."}</p>
          <Link
            href={schoolSlug ? `/${schoolSlug}` : "/"}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 print-root">
      <InvoicePrintStyles />

      <div className="screen-layout">
        <InvoiceDocumentSheet data={data} regCost={regCost} />
        <InvoiceActionPanel
          data={data}
          isAdmin={isAdmin}
          schoolSlug={schoolSlug}
          waGroupUrl={waGroupUrl}
          handlePrint={handlePrint}
          handleSendWhatsApp={handleSendWhatsApp}
        />
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}
    >
      <InvoiceContent />
    </Suspense>
  );
}
