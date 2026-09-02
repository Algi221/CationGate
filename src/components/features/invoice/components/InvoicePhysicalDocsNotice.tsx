"use client";

import React from "react";

export function InvoicePhysicalDocsNotice() {
  return (
    <>
      {/* ── HIMBAUAN BERKAS FISIK ── */}
      <div
        style={{
          background: "#fef3c7",
          border: "1px solid #fde68a",
          borderRadius: "12px",
          padding: "16px",
          marginTop: "20px",
          fontSize: "11px",
          color: "#92400e",
          lineHeight: "1.6",
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            fontWeight: 900,
            color: "#b45309",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span style={{ fontSize: "14px" }}>⚠️</span>
          Penting: Bawa Berkas Fisik!
        </div>
        <p style={{ margin: "0 0 8px 0" }}>
          Harap datang langsung ke loket sekretariat PPDB sekolah untuk
          verifikasi fisik berkas-berkas pendaftaran berikut:
        </p>
        <ul style={{ margin: 0, paddingLeft: "20px", listStyleType: "disc" }}>
          <li>Fotokopi Kartu Keluarga (KK)</li>
          <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
          <li>Akta Kelahiran asli &amp; Fotokopi</li>
          <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
          <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
        </ul>
      </div>

      {/* ── FOOTER NOTE (print only) ── */}
      <p
        style={{
          marginTop: "16px",
          fontSize: "8px",
          color: "#94a3b8",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        Dokumen ini dicetak otomatis oleh Sistem PPDB SMK Taruna Bhakti Depok
        dan sah sebagai bukti registrasi.
      </p>
    </>
  );
}
