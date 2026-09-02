"use client";

import React from "react";
import { InvoiceCandidateData } from "../types";
import { InvoiceLetterhead } from "./InvoiceLetterhead";
import { InvoiceCandidateDetails } from "./InvoiceCandidateDetails";
import { InvoiceBillingTable } from "./InvoiceBillingTable";
import { InvoicePhysicalDocsNotice } from "./InvoicePhysicalDocsNotice";

interface InvoiceDocumentSheetProps {
  data: InvoiceCandidateData & { payment_status?: string };
  regCost: number;
}

export const InvoiceDocumentSheet: React.FC<InvoiceDocumentSheetProps> = ({
  data,
  regCost,
}) => {
  return (
    <div
      className="invoice-sheet bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800/50 overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Stamp */}
      {data.payment_status === "Paid" ? (
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "32px",
            border: "3px solid rgba(16,185,129,0.5)",
            color: "rgba(16,185,129,0.5)",
            fontWeight: 900,
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: "6px 14px",
            borderRadius: "10px",
            transform: "rotate(-12deg)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 10,
            background: "rgba(255,255,255,0.7)",
            fontFamily: "monospace",
          }}
        >
          LUNAS / VERIFIED
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "32px",
            border: "3px solid rgba(245,158,11,0.5)",
            color: "rgba(245,158,11,0.5)",
            fontWeight: 900,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: "5px 12px",
            borderRadius: "10px",
            transform: "rotate(-12deg)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 10,
            background: "rgba(255,255,255,0.7)",
            fontFamily: "monospace",
          }}
        >
          PROSES VERIFIKASI
        </div>
      )}

      <div className="invoice-inner" style={{ padding: "32px" }}>
        {/* ── KOPSURAT & JUDUL DOKUMEN ── */}
        <InvoiceLetterhead periode={data.periode} id={data.id} />

        {/* ── DATA PENDAFTAR (2 columns) ── */}
        <InvoiceCandidateDetails data={data} />

        {/* ── TABEL TAGIHAN & TOTAL ── */}
        <InvoiceBillingTable data={data} regCost={regCost} />

        {/* ── HIMBAUAN BERKAS FISIK & FOOTER ── */}
        <InvoicePhysicalDocsNotice />
      </div>
    </div>
  );
};
