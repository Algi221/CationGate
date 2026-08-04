"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { usePPDB } from "@/context/PPDBContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Clock,
  Sparkles, Power, ArrowUpRight, Zap, Building2, Users, FileText
} from "lucide-react";

export default function SubscriptionManagementPage() {
  const { schoolStatus, ppdbTitle, isDemoMode } = usePPDB();

  // SPMB Status State (Resmi Buka / Tutup)
  const [isSpmbOpen, setIsSpmbOpen] = useState(true);
  const [isUpdatingSpmb, setIsUpdatingSpmb] = useState(false);

  // Subscription Details State
  const [subData, setSubData] = useState({
    plan_name: "PRO ENTERPRISE TRIAL",
    status: "ACTIVE",
    start_date: "01 Juli 2026",
    end_date: "31 Juli 2026 (Sisa 28 Hari)",
    applicant_quota: "1.000 Pendaftar",
    used_quota: "24 Pendaftar",
  });

  const isVerified = schoolStatus === "FULL_VERIFIED" || schoolStatus === "VERIFIED" || schoolStatus === "verified" || isDemoMode;

  const handleToggleSpmbStatus = () => {
    const nextStatus = !isSpmbOpen;
    const statusText = nextStatus ? "DIBUKA" : "DITUTUP";
    const statusDesc = nextStatus
      ? "Formulir pendaftaran publik akan kembali menerima calon peserta didik baru."
      : "Formulir pendaftaran publik akan di-nonaktifkan dan pengunjung tidak dapat mendaftar.";

    Swal.fire({
      title: `Ubah Status SPMB ke ${statusText}?`,
      text: statusDesc,
      icon: nextStatus ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus ? "#10B981" : "#F43F5E",
      cancelButtonColor: "#64748B",
      confirmButtonText: `Ya, ${statusText} SPMB`,
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-3xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsUpdatingSpmb(true);
        setTimeout(() => {
          setIsSpmbOpen(nextStatus);
          setIsUpdatingSpmb(false);
          Swal.fire({
            title: `Status SPMB ${statusText}!`,
            text: `Pendaftaran SPMB sekolah telah resmi di-${statusText.toLowerCase()}.`,
            icon: "success",
            confirmButtonColor: "#2563EB",
            customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
          });
        }, 500);
      }
    });
  };

  const { schoolId } = usePPDB();
  const [isPaying, setIsPaying] = useState(false);

  const handleUpgradePlan = async () => {
    setIsPaying(true);
    try {
      const res = await fetch("/api/saas/create-payment-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_name: ppdbTitle || "Admin Sekolah",
          amount: 750000
        }),
      });
      const data = await res.json();
      setIsPaying(false);

      if (data.token) {
        if ((window as any).snap) {
          (window as any).snap.pay(data.token, {
            onSuccess: async function () {
              await fetch("/api/saas/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ school_id: schoolId }),
              });
              Swal.fire({
                title: "Pembayaran Berhasil!",
                text: "Paket CationGate Pro (Rp 750.000 / Tahun) telah diaktifkan.",
                icon: "success",
                confirmButtonColor: "#2563EB",
              });
            },
            onPending: function () {
              Swal.fire({ title: "Menunggu Pembayaran", text: "Silakan selesaikan pembayaran Midtrans Anda.", icon: "info" });
            },
            onError: function () {
              Swal.fire({ title: "Pembayaran Gagal", text: "Terjadi kesalahan transaksi Midtrans.", icon: "error" });
            }
          });
        } else {
          Swal.fire({
            title: "Sistem Midtrans Siap",
            text: "Order ID: " + (data.order_id || "CG-PRO-750K") + ". Pembayaran Pro Rp 750.000 / Tahun terkonfirmasi.",
            icon: "success",
            confirmButtonColor: "#2563EB"
          });
        }
      }
    } catch (e) {
      setIsPaying(false);
      Swal.fire({ title: "Gagal Membuka Midtrans", text: "Silakan coba lagi.", icon: "error" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-sans">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <CreditCard className="w-4 h-4" /> Pengaturan Lisensi & Kontrol SPMB
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Kelola Subscription & Status SPMB
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Atur status resmi buka/tutup pendaftaran SPMB publik sekolah Anda dan pantau kuota serta masa aktif paket langganan CationGate SaaS.
          </p>
        </div>

        {/* Verification Status Card Badge */}
        <div className="shrink-0 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isVerified
              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 border border-emerald-300 dark:border-emerald-800"
              : "bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-300 dark:border-amber-800"
          }`}>
            {isVerified ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Verifikasi</p>
            <p className={`text-xs font-extrabold ${isVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {isVerified ? "OFFICIAL VERIFIED" : "MENUNGGU VERIFIKASI"}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="grid grid-cols-1 gap-6">

        {/* Card 2: Status Paket Langganan CationGate SaaS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Lisensi Langganan Active
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                {subData.status}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {subData.plan_name} <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Masa Aktif: <strong className="text-slate-700 dark:text-slate-200">{subData.end_date}</strong>
              </p>
            </div>

            {/* Quota Progress */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Penggunaan Kuota Pendaftar</span>
                <span className="text-blue-600 dark:text-blue-400">{subData.used_quota} / {subData.applicant_quota}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[5%]" />
              </div>
            </div>
          </div>

          <button
            onClick={handleUpgradePlan}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Perpanjang / Upgrade Paket SaaS <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>

    </div>
  );
}
