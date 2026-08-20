"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { usePPDB } from "@/context/PPDBContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  CreditCard, ShieldCheck, CheckCircle2, AlertCircle,
  Power, Check
} from "lucide-react";

export default function SubscriptionManagementPage() {
  const { adminUser, schoolStatus, ppdbTitle, isDemoMode, schoolId } = usePPDB();

  // Role Guard
  const _isSuperadmin = adminUser?.role === 'superadmin_sekolah' || adminUser?.role === 'superadmin' || adminUser?.roleLabel === 'Superadmin';

  // SPMB Status State (Resmi Buka / Tutup)
  const [isSpmbOpen, setIsSpmbOpen] = useState(true);
  const [isUpdatingSpmb, setIsUpdatingSpmb] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Dynamic Plans State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Default to Free Plan for demo
  const [currentPlan, setCurrentPlan] = useState("FREE_PLAN");

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/saas/plans");
        const data = await res.json();
        if (data.success && data.data) {
          setPlans(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();

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
                text: `Paket sekolah Anda berhasil diupgrade ke ${planName}.`,
                icon: "success",
                confirmButtonColor: "#2563EB"
              });
            },
            onPending: function () {
              Swal.fire({
                title: "Menunggu Pembayaran",
                text: "Silakan selesaikan pembayaran Anda via instruksi Midtrans.",
                icon: "info",
                confirmButtonColor: "#2563EB"
              });
            },
            onError: function () {
              Swal.fire({
                title: "Pembayaran Gagal",
                text: "Terjadi kesalahan saat memproses transaksi.",
                icon: "error",
                confirmButtonColor: "#F43F5E"
              });
            },
            onClose: function () {
              console.log("Customer closed the popup without finishing the payment");
            }
          });
        }
      } else {
        Swal.fire({
          title: "Gagal Mendapatkan Token",
          text: data.message || "Gagal menghubungi gateway pembayaran Midtrans.",
          icon: "error",
          confirmButtonColor: "#F43F5E"
        });
      }
    } catch (_e) {
      setIsPaying(false);
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Tidak dapat menghubungkan ke Midtrans Snap. Coba lagi beberapa saat.",
        icon: "error",
        confirmButtonColor: "#F43F5E"
      });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Midtrans Snap JS */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-sample"}
        strategy="lazyOnload"
      />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
          {loadingPlans ? (
            <div className="col-span-1 md:col-span-3 py-12 flex justify-center text-slate-500 dark:text-slate-400 animate-pulse font-medium">
              Memuat harga paket...
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-1 md:col-span-3 py-12 flex justify-center text-slate-500 dark:text-slate-400 font-medium">
              Belum ada paket yang tersedia.
            </div>
          ) : (
            plans.map((pkg, index) => {
              const pkgIdStr = String(pkg.id);
              const isActive = currentPlan === pkgIdStr;
              const isPopular = index === 1; // Mark second item as popular
              const isFree = pkg.price_yearly === 0;

              return (
                <motion.div
                  key={pkg.id}
                  whileHover={{ y: -4 }}
                  className={`relative flex flex-col bg-white dark:bg-[#0f172a] border-2 rounded-3xl p-6 shadow-sm overflow-hidden ${
                    isActive ? "border-blue-500 dark:border-blue-500" : isPopular ? "border-slate-300 dark:border-slate-700" : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {isActive && (
                     <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-bl-xl">
                        Paket Aktif
                     </div>
                  )}
                  {isPopular && !isActive && (
                     <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-bl-xl">
                        Paling Populer
                     </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                      Paket {pkg.name} dengan fitur premium yang dapat diandalkan untuk sekolah Anda.
                    </p>
                  </div>
                  <div className="mb-6 flex items-end gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                      {isFree ? "Rp 0" : `Rp ${Number(pkg.price_yearly).toLocaleString("id-ID")}`}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {isFree ? "/ 20 Hari" : "/ Tahun"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <ul className="space-y-3">
                      {pkg.features.map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    {isActive ? (
                      <button disabled className="w-full py-3 rounded-xl bg-slate-100 dark:bg-[#1e293b] text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700">
                        <CheckCircle2 className="w-4 h-4" /> Sedang Digunakan
                      </button>
                    ) : isFree ? (
                      <button onClick={() => { localStorage.setItem("ppdb_school_plan", pkgIdStr); setCurrentPlan(pkgIdStr); }} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all border border-slate-200 dark:border-slate-700">
                        Gunakan Paket Free
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgradePlan(pkgIdStr, pkg.price_yearly, pkg.name)}
                        disabled={isPaying}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                      >
                        {isPaying ? "Memproses..." : "Upgrade Sekarang"}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
