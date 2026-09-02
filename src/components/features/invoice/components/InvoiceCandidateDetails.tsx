"use client";

import React from "react";
import { InvoiceCandidateData } from "../types";
import { formatNoPendaftaran } from "@/components/features/pendaftar/components/detail-sections/sanitizeUrl";

interface InvoiceCandidateDetailsProps {
  data: InvoiceCandidateData;
}

export function InvoiceCandidateDetails({ data }: InvoiceCandidateDetailsProps) {
  const tglDaftarFormatted = new Date(data.tgl_daftar).toLocaleDateString(
    "id-ID",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "20px",
        fontSize: "11px",
        lineHeight: 1.8,
        fontWeight: 600,
        color: "#475569",
      }}
    >
      <div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ color: "#94a3b8", width: "110px", flexShrink: 0 }}>
            No. Pendaftaran
          </span>
          <span
            style={{
              color: "#0f172a",
              fontFamily: "monospace",
              fontWeight: 800,
            }}
          >
            : {formatNoPendaftaran(data.periode, data.id)}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ color: "#94a3b8", width: "110px", flexShrink: 0 }}>
            No. Invoice
          </span>
          <span
            style={{
              color: "#0f172a",
              fontFamily: "monospace",
              fontWeight: 800,
            }}
          >
            : INV-{formatNoPendaftaran(data.periode, data.id)}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ color: "#94a3b8", width: "110px", flexShrink: 0 }}>
            Tanggal Daftar
          </span>
          <span style={{ color: "#0f172a" }}>: {tglDaftarFormatted}</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ color: "#94a3b8", width: "110px", flexShrink: 0 }}>
            Periode Ajaran
          </span>
          <span style={{ color: "#0f172a", fontWeight: 800 }}>
            : {data.periode || "2026-2027"}
          </span>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ color: "#94a3b8", width: "110px", flexShrink: 0 }}>
            Nama Pendaftar
          </span>
          <span
            style={{
              color: "#0f172a",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            : {data.nama}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ color: "#94a3b8", width: "110px", flexShrink: 0 }}>
            NISN Pendaftar
          </span>
          <span
            style={{
              color: "#0f172a",
              fontFamily: "monospace",
              fontWeight: 800,
            }}
          >
            : {data.nisn}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ color: "#94a3b8", width: "110px", flexShrink: 0 }}>
            Program Rombel
          </span>
          <span
            style={{
              color: "#2563eb",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            : {data.jurusan_1 || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
