"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { InvoiceCandidateData } from "../types";

export function useInvoiceState() {
  const searchParams = useSearchParams();
  const nisn = searchParams.get("nisn");
  const isAdmin = searchParams.get("isAdmin") === "true";

  const [data, setData] = useState<InvoiceCandidateData & { payment_status?: string } | null>(null);
  const [regCost, setRegCost] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCost = localStorage.getItem("ppdb_reg_cost");
      if (savedCost) {
        const parsed = parseInt(savedCost);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 250000;
  });

  const [waGroupUrl, setWaGroupUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("ppdb_wa_group_url") ||
        "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS"
      );
    }
    return "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS";
  });

  const [loading, setLoading] = useState(() => !!nisn);
  const [error, setError] = useState<string | null>(() => (!nisn ? "NISN tidak ditemukan." : null));

  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";

  const getCleanWaNumber = () => {
    if (!data || !data.whatsapp) return "";
    let cleanPhone = data.whatsapp.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("08")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith("8")) {
      cleanPhone = "62" + cleanPhone;
    }
    return cleanPhone;
  };

  const getWaSendUrl = () => {
    if (typeof window === "undefined" || !data) return "";
    const cleanPhone = getCleanWaNumber();
    const invoiceUrl = `${window.location.origin}/invoice?nisn=${data.nisn}`;
    const messageText = `Halo ${data.nama},\n\nPembayaran registrasi formulir PPDB SMK Taruna Bhakti Depok Anda dengan NISN: ${data.nisn} telah BERHASIL DIVERIFIKASI dan dinyatakan LUNAS.\n\nBerikut adalah tautan bukti registrasi & invoice resmi pembayaran Anda:\n${invoiceUrl}\n\nTerima kasih.\nPanitia PPDB SMK Taruna Bhakti`;
    const encodedMessage = encodeURIComponent(messageText);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const handleSendWhatsApp = () => {
    const url = getWaSendUrl();
    if (url) {
      window.open(url, "_blank");
      setTimeout(() => {
        window.location.href = schoolSlug
          ? `/${schoolSlug}/dashboard/pendaftar`
          : "/dashboard/pendaftar";
      }, 1000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("ppdb-theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }

    const loadLiveCost = async () => {
      try {
        const res = await fetch("/api/config");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.ppdb_form_fee) {
            const parsed = parseInt(json.data.ppdb_form_fee);
            if (!isNaN(parsed)) {
              setRegCost(parsed);
              localStorage.setItem("ppdb_reg_cost", json.data.ppdb_form_fee);
            }
          }
          if (json.data.ppdb_wa_group_url) {
            setWaGroupUrl(json.data.ppdb_wa_group_url);
            localStorage.setItem("ppdb_wa_group_url", json.data.ppdb_wa_group_url);
          }
        }
      } catch (err) {
        console.log("Failed to fetch live config for invoice:", err);
      }
    };
    loadLiveCost();
  }, []);

  useEffect(() => {
    if (!nisn) return;

    const fetchInvoice = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
        const res = await fetch(`${backendUrl}/api/applicants/public-invoice/${nisn}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.message || "Gagal mengambil data invoice.");
        }
      } catch (err: unknown) {
        setError("Error: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [nisn]);

  return {
    nisn,
    isAdmin,
    data,
    regCost,
    waGroupUrl,
    loading,
    error,
    schoolSlug,
    handleSendWhatsApp,
    handlePrint
  };
}
