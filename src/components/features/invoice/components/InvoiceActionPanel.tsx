"use client";

import React from "react";
import Link from "next/link";
import { Printer, ArrowLeft, Phone } from "lucide-react";
import { InvoiceCandidateData } from "../types";

interface InvoiceActionPanelProps {
  data: InvoiceCandidateData & { payment_status?: string };
  isAdmin: boolean;
  schoolSlug: string;
  waGroupUrl: string;
  handlePrint: () => void;
  handleSendWhatsApp: () => void;
}

const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    const valid = /^(?:https?:\/\/|\/)/i.test(url);
    return valid ? url : "";
  } catch (_e) {
    return "";
  }
};

export const InvoiceActionPanel: React.FC<InvoiceActionPanelProps> = ({
  data,
  isAdmin,
  schoolSlug,
  waGroupUrl,
  handlePrint,
  handleSendWhatsApp
}) => {
  return (
    <div className="action-panel no-print" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Himbauan Pengiriman Struk untuk Siswa */}
      {!isAdmin && data.payment_status === "Paid" && (
        <div
          className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
          style={{
            border: "1px solid",
            borderRadius: "20px",
            padding: "20px",
            fontSize: "10px",
            fontWeight: "bold",
            lineHeight: "1.6",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
          }}
        >
          📢 HIMBAUAN:
          <br />
          Struk bukti registrasi & invoice resmi pembayaran yang telah diverifikasi akan dikirimkan oleh Panitia PPDB ke nomor WhatsApp Anda yang terdaftar.
        </div>
      )}

      {/* Print & Return */}
      <div
        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800"
        style={{ borderRadius: "20px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
      >
        <h3
          className="text-slate-700 dark:text-slate-200"
          style={{
            fontWeight: 900,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "12px",
            paddingBottom: "8px",
            borderBottom: "1px solid #f1f5f9"
          }}
        >
          Tindakan Nota
        </h3>

        <button
          onClick={handlePrint}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #2563eb, #4338ca)",
            color: "white",
            fontWeight: 900,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "14px 20px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.2)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.2)";
          }}
        >
          <Printer size={15} />
          Cetak / Simpan PDF
        </button>

        <Link
          href={
            isAdmin
              ? schoolSlug
                ? `/${schoolSlug}/dashboard/pendaftar`
                : "/dashboard/pendaftar"
              : schoolSlug
              ? `/${schoolSlug}`
              : "/"
          }
          className="bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            fontWeight: 900,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "12px 20px",
            borderRadius: "14px",
            textDecoration: "none",
            marginTop: "10px",
            transition: "background 0.2s"
          }}
        >
          <ArrowLeft size={13} />
          {isAdmin ? "Kembali ke Dashboard" : "Kembali ke Beranda"}
        </Link>
      </div>

      {/* WhatsApp Action */}
      {data.payment_status === "Paid" &&
        (isAdmin ? (
          <div
            className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-200/50 dark:border-slate-700"
            style={{
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                background: "#d1fae5",
                color: "#059669",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px"
              }}
            >
              <Phone size={18} />
            </div>
            <h4
              className="text-slate-700 dark:text-slate-200"
              style={{
                fontWeight: 900,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 8px 0"
              }}
            >
              Kirim Invoice WA
            </h4>
            <p
              className="text-slate-500 dark:text-slate-400"
              style={{ fontSize: "10px", lineHeight: 1.6, margin: "0 0 14px 0" }}
            >
              Kirim dokumen bukti registrasi & invoice resmi ke nomor WhatsApp calon siswa ({data.whatsapp}).
            </p>
            <button
              onClick={handleSendWhatsApp}
              style={{
                width: "100%",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                background: "linear-gradient(135deg, #059669, #22c55e)",
                color: "white",
                fontWeight: 900,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(5,150,105,0.2)",
                transition: "all 0.2s"
              }}
            >
              <Phone size={12} />
              Kirim Invoice WA
            </button>
          </div>
        ) : (
          <div
            className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-200/50 dark:border-slate-700"
            style={{
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                background: "#d1fae5",
                color: "#059669",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px"
              }}
            >
              <Phone size={18} />
            </div>
            <h4
              className="text-slate-700 dark:text-slate-200"
              style={{
                fontWeight: 900,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 8px 0"
              }}
            >
              Gabung Grup WhatsApp
            </h4>
            <p
              className="text-slate-500 dark:text-slate-400"
              style={{ fontSize: "10px", lineHeight: 1.6, margin: "0 0 14px 0" }}
            >
              Hubungkan dengan pendaftar PPDB lainnya, berkas fisik, dan info jadwal tes seleksi.
            </p>
            <a
              href={sanitizeUrl(waGroupUrl)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                background: "linear-gradient(135deg, #059669, #22c55e)",
                color: "white",
                fontWeight: 900,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                borderRadius: "14px",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(5,150,105,0.2)",
                transition: "all 0.2s"
              }}
            >
              <Phone size={12} />
              Gabung WhatsApp
            </a>
          </div>
        ))}
    </div>
  );
};
