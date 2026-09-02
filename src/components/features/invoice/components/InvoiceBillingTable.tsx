"use client";

import React from "react";
import { InvoiceCandidateData } from "../types";

interface InvoiceBillingTableProps {
  data: InvoiceCandidateData & { payment_status?: string };
  regCost: number;
}

export function InvoiceBillingTable({ data, regCost }: InvoiceBillingTableProps) {
  return (
    <>
      {/* ── TABEL TAGIHAN ── */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "16px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#334155",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #1e293b" }}>
            <th
              style={{
                padding: "8px 0",
                textAlign: "left",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#64748b",
              }}
            >
              No.
            </th>
            <th
              style={{
                padding: "8px 0",
                textAlign: "left",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#64748b",
              }}
            >
              Deskripsi Alokasi Tagihan
            </th>
            <th
              style={{
                padding: "8px 0",
                textAlign: "right",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#64748b",
                width: "140px",
              }}
            >
              Jumlah (Rp)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
            <td style={{ padding: "10px 0", color: "#0f172a" }}>1</td>
            <td
              style={{
                padding: "10px 0",
                color: "#0f172a",
                fontWeight: 700,
              }}
            >
              Biaya Registrasi Formulir PPDB SMK Taruna Bhakti
              <span
                style={{
                  display: "block",
                  fontSize: "9px",
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginTop: "2px",
                }}
              >
                Alokasi administrasi berkas dan formulir online
              </span>
            </td>
            <td
              style={{
                padding: "10px 0",
                textAlign: "right",
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              Rp {regCost.toLocaleString("id-ID")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── TOTAL ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <div style={{ width: "260px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              fontWeight: 600,
              color: "#64748b",
              padding: "6px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span>Subtotal</span>
            <span>Rp {regCost.toLocaleString("id-ID")}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              fontWeight: 600,
              color: "#64748b",
              padding: "6px 0",
            }}
          >
            <span>Pajak (PPN 0%)</span>
            <span>Nihil</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              fontWeight: 900,
              color: "#0f172a",
              padding: "8px 0",
              borderTop: "2px solid #1e293b",
            }}
          >
            <span>Total Tagihan</span>
            <span style={{ color: "#2563eb", fontWeight: 900 }}>
              Rp {regCost.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* ── INFO PEMBAYARAN (screen only) ── */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          color: "#64748b",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "12px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <div>
            <span style={{ fontWeight: 800 }}>Metode Bayar: </span>
            <span
              style={{
                color: "#0f172a",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {data.metode_pembayaran === "Transfer Manual"
                ? "Transfer"
                : data.metode_pembayaran}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: 800 }}>Status Bayar: </span>
            <span
              style={{
                fontWeight: 800,
                textTransform: "uppercase",
                color: data.payment_status === "Paid" ? "#059669" : "#d97706",
              }}
            >
              {data.payment_status === "Paid" ? "LUNAS (VERIFIED)" : "PENDING"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
