"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { usePPDB } from "@/context/PPDBContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Clock,
  Sparkles, Power, ArrowUpRight, Zap, Building2, Users, FileText, Check, Lock
} from "lucide-react";
import Link from "next/link";

export default function SubscriptionManagementPage() {
  const { adminUser, schoolStatus, ppdbTitle, isDemoMode, schoolId } = usePPDB();

  // Role Guard
  const isSuperadmin = adminUser?.role === 'superadmin_sekolah' || adminUser?.role === 'superadmin' || adminUser?.roleLabel === 'Superadmin';

  // SPMB Status State (Resmi Buka / Tutup)
  const [isSpmbOpen, setIsSpmbOpen] = useState(true);
  const [isUpdatingSpmb, setIsUpdatingSpmb] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Default to Free Plan for demo
  const [currentPlan, setCurrentPlan] = useState("FREE_PLAN");

  // In a real scenario, fetch subscription from API
  useEffect(() => {
    // Simulated fetch
    const stored = localStorage.getItem("ppdb_school_plan");
    if (stored) {
      setCurrentPlan(stored);
    }
  }, []);

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

  const handleUpgradePlan = async (planId: string, amount: number, planName: string) => {
    setIsPaying(true);
    try {
      const res = await fetch("/api/saas/create-payment-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_name: ppdbTitle || "Admin Sekolah",
          amount: amount
        }),
      });
      const data = await res.json();
      setIsPaying(false);

      if (data.token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).snap) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).snap.pay(data.token, {
            onSuccess: async function () {
              // Simpan ke local storage / database
              localStorage.setItem("ppdb_school_plan", planId);
              setCurrentPlan(planId);
              Swal.fire({
                title: "Pembayaran Berhasil!",
                text: `Paket ${planName} telah berhasil diaktifkan.`,
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
            text: "Order ID: " + (data.order_id || "CG-PRO") + `. Pembayaran ${planName} terkonfirmasi (Simulasi).`,
            icon: "success",
            confirmButtonColor: "#2563EB"
          }).then(() => {
            localStorage.setItem("ppdb_school_plan", planId);
            setCurrentPlan(planId);
          });
        }
      }
    } catch (_e) {
      setIsPaying(false);
      Swal.fire({ title: "Gagal Membuka Midtrans", text: "Silakan coba lagi.", icon: "error" });
    }
  };

  if (!isSuperadmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-2">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Akses Ditolak</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Halaman ini khusus untuk <strong>Superadmin Sekolah</strong>. Anda tidak memiliki izin untuk mengelola status SPMB dan lisensi langganan.
        </p>
        <Link href="./" className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const packages = [
    {
      id: "FREE_PLAN",
      name: "Basic (Free)",
      price: "Rp 0",
      period: "Selamanya",
      desc: "Cocok untuk sekolah yang baru mencoba sistem PPDB.",
      benefits: [
        "Fitur PPDB Basic",
        "1 Admin Utama (Superadmin)",
        "Landing Page Pendaftaran",
        "Tanpa Ekspor Data Excel",
        "Tanpa Dukungan Support"
      ],
      isPopular: false
    },
    {
      id: "PRO_PLAN",
      name: "Pro",
      price: "Rp 750.000",
      amount: 750000,
      period: "per Tahun",
      desc: "Standar operasional untuk mengelola PPDB secara efektif.",
      benefits: [
        "Semua fitur Basic",
        "Multi-Admin (Bisa Tambah Admin)",
        "Ekspor Data Pendaftar (Excel)",
        "Laporan Statistik Lengkap",
        "Dukungan Support via Email"
      ],
      isPopular: true
    },
    {
      id: "PROMAX_PLAN",
      name: "Pro Max",
      price: "Rp 1.000.000",
      amount: 1000000,
      period: "per Tahun",
      desc: "Solusi eksklusif dengan prioritas penuh dan kustomisasi.",
      benefits: [
        "Semua fitur Pro",
        "Custom Domain (sekolah.sch.id)",
        "Prioritas Server & Performa Cepat",
        "Dukungan WhatsApp 24/7",
        "Pelatihan Sistem Online"
      ],
      isPopular: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans animate-in fade-in zoom-in-95 duration-300">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <CreditCard className="w-4 h-4" /> Pengaturan Lisensi & Kontrol SPMB
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Kelola Subscription
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Atur status pendaftaran SPMB publik sekolah Anda, kelola tagihan, dan pilih paket berlangganan CationGate SaaS yang paling sesuai.
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

      {/* Kontrol SPMB Section */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Status Pendaftaran Publik (SPMB)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isSpmbOpen
                ? "Pendaftaran publik aktif. Pengunjung landing page dapat mendaftar."
                : "Pendaftaran publik ditutup. Pengunjung tidak dapat mengisi formulir."}
            </p>
         </div>
         <button
            onClick={handleToggleSpmbStatus}
            disabled={isUpdatingSpmb}
            className={`px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto ${
              isSpmbOpen
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10"
            }`}
          >
            <Power className="w-4 h-4" />
            {isSpmbOpen ? "Matikan Pendaftaran" : "Buka Pendaftaran"}
          </button>
      </div>

      {/* Subscription Pricing Grid */}
      <div className="pt-4">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white">Pilih Paket CationGate</h2>
           <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Pilih paket langganan yang sesuai dengan kebutuhan operasional sekolah Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const isActive = currentPlan === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                className={`relative flex flex-col bg-white dark:bg-[#0f172a] border-2 rounded-3xl p-6 shadow-sm overflow-hidden ${
                  isActive ? "border-blue-500 dark:border-blue-500" : pkg.isPopular ? "border-slate-300 dark:border-slate-700" : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {isActive && (
                   <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-bl-xl">
                      Paket Aktif
                   </div>
                )}
                {pkg.isPopular && !isActive && (
                   <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-bl-xl">
                      Paling Populer
                   </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{pkg.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">{pkg.desc}</p>
                </div>
                <div className="mb-6 flex items-end gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{pkg.price}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{pkg.period}</span>
                </div>
                <div className="flex-1">
                  <ul className="space-y-3">
                    {pkg.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  {isActive ? (
                    <button disabled className="w-full py-3 rounded-xl bg-slate-100 dark:bg-[#1e293b] text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="w-4 h-4" /> Sedang Digunakan
                    </button>
                  ) : pkg.price === "Rp 0" ? (
                    <button onClick={() => { localStorage.setItem("ppdb_school_plan", pkg.id); setCurrentPlan(pkg.id); }} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all border border-slate-200 dark:border-slate-700">
                      Gunakan Paket Free
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgradePlan(pkg.id, pkg.amount as number, pkg.name)}
                      disabled={isPaying}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                      {isPaying ? "Memproses..." : "Upgrade Sekarang"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
