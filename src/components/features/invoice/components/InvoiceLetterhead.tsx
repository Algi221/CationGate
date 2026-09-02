"use client";

import React from "react";
import { formatNoPendaftaran } from "@/components/features/pendaftar/components/detail-sections/sanitizeUrl";

interface InvoiceLetterheadProps {
  periode?: string;
  id?: number | string;
}

export function InvoiceLetterhead({ periode, id }: InvoiceLetterheadProps) {
  return (
    <>
      {/* ── KOPSURAT / LETTERHEAD ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          borderBottom: "3px double #1e293b",
          paddingBottom: "14px",
          marginBottom: "20px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_smktb.png"
          alt="Logo SMK Taruna Bhakti"
          style={{ width: "52px", height: "52px", objectFit: "contain" }}
          onError={(e) => {
            e.currentTarget.src =
              "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/cropped-logo-tb-32x32.png";
          }}
        />
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#64748b",
              margin: "0 0 2px 0",
            }}
          >
            Panitia Penerimaan Peserta Didik Baru
          </p>
          <h2
            style={{
              fontSize: "17px",
              fontWeight: 900,
              color: "#0f172a",
              margin: "0 0 2px 0",
              lineHeight: 1.2,
            }}
          >
            SMK TARUNA BHAKTI DEPOK
          </h2>
          <p
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: "#64748b",
              margin: 0,
            }}
          >
            Terakreditasi A · Jl. Pekapuran No. 22, Cimanggis, Depok, Jawa Barat
          </p>
          <p style={{ fontSize: "9px", color: "#94a3b8", margin: 0 }}>
            Telp: (021) 874 7475 · Website: www.smktarunabhakti.sch.id
          </p>
        </div>
      </div>

      {/* ── JUDUL DOKUMEN ── */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "14px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#1e293b",
            margin: "0 0 6px 0",
            borderBottom: "1px solid #e2e8f0",
            display: "inline-block",
            paddingBottom: "6px",
          }}
        >
          TANDA BUKTI REGISTRASI &amp; INVOICE PEMBAYARAN
        </h1>
        <p
          style={{
            fontSize: "10px",
            fontFamily: "monospace",
            fontWeight: 700,
            color: "#64748b",
            margin: 0,
          }}
        >
          Nomor Dokumen: INV-{formatNoPendaftaran(periode, id)}
        </p>
      </div>
    </>
  );
}
