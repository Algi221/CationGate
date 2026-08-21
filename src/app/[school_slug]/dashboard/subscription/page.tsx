"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  CreditCard, CheckCircle2, AlertCircle, Check, Clock,
  Crown, Zap, ArrowRight, ShieldCheck, Star
} from "lucide-react";

interface SubscriptionData {
  plan: string;
  status: string;
  daysLeft: number;
  isExpired: boolean;
  expiresAt?: string;
}

export default function SubscriptionManagementPage() {
  const { adminUser, schoolStatus, ppdbTitle, isDemoMode, schoolId } = usePPDB();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";
  
  const [isPaying, setIsPaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const isVerified = schoolStatus === "FULL_VERIFIED" || schoolStatus === "VERIFIED" || schoolStatus === "verified" || isDemoMode;

  // Fetch plans
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
  }, []);

  // Fetch subscription status
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const query = schoolId ? `school_id=${schoolId}` : `slug=${schoolSlug}`;
        const res = await fetch(`/api/saas/subscription-status?${query}`);
        const data = await res.json();
        if (data.success && data.data) {
          setSubscription(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch subscription", err);
      } finally {
        setLoadingSub(false);
      }
    };
    fetchSub();
  }, [schoolId, schoolSlug]);

  const currentPlanName = subscription?.plan || "FREE_TRIAL";
  const isPro = currentPlanName === "PRO_YEARLY" || currentPlanName === "PRO_750K";

  const handleUpgradePlan = async () => {
    setIsPaying(true);
    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch("/api/saas/create-payment-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_name: ppdbTitle || "Admin Sekolah",
          amount: 750000,
          plan_id: 2
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
              // Call activate endpoint
              try {
                await fetch("/api/saas/activate", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    slug: schoolSlug,
                    school_id: schoolId,
                    order_id: data.order_id
                  })
                });
              } catch (_e) {}

              setSubscription({
                plan: "PRO_YEARLY",
                status: "ACTIVE",
                daysLeft: 365,
                isExpired: false,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              });

              Swal.fire({
                title: "Pembayaran Berhasil! 🎉",
                html: `<p class="text-sm text-slate-600">Paket <strong>Pro Tahunan</strong> telah aktif untuk sekolah Anda.<br/>Akses seluruh fitur premium CationGate selama 1 tahun.</p>`,
                icon: "success",
                confirmButtonColor: "#2563EB",
                customClass: { popup: "rounded-3xl" }
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
        } else {
          // Midtrans Snap not loaded — simulate success for dev
          Swal.fire({
            title: "Simulasi Pembayaran",
            html: `<p class="text-sm">Midtrans Snap belum dimuat. Apakah Anda ingin <strong>simulasi pembayaran berhasil</strong>?</p>`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563EB",
            cancelButtonColor: "#64748B",
            confirmButtonText: "Ya, Simulasi Berhasil",
            cancelButtonText: "Batal",
            customClass: { popup: "rounded-3xl" }
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await fetch("/api/saas/activate", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    slug: schoolSlug,
                    school_id: schoolId,
                    order_id: data.order_id
                  })
                });
              } catch (_e) {}

              setSubscription({
                plan: "PRO_YEARLY",
                status: "ACTIVE",
                daysLeft: 365,
                isExpired: false,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              });

              Swal.fire({
                title: "Simulasi Berhasil! 🎉",
                html: `<p class="text-sm text-slate-600">Paket <strong>Pro Tahunan</strong> telah aktif (simulasi).</p>`,
                icon: "success",
                confirmButtonColor: "#2563EB",
                customClass: { popup: "rounded-3xl" }
              });
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Kelola Subscription
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
            Kelola paket berlangganan CationGate untuk sekolah Anda.
          </p>
        </div>

        {/* Verification Badge */}
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

      {/* Current Subscription Status Banner */}
      {!loadingSub && subscription && (
        <div className={`rounded-3xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isPro
            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
            : subscription.isExpired
              ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800"
              : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPro
                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                : subscription.isExpired
                  ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400"
                  : "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
            }`}>
              {isPro ? <Crown className="w-5 h-5" /> : subscription.isExpired ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-white">
                {isPro ? "Paket Pro Tahunan Aktif" : subscription.isExpired ? "Free Trial Telah Berakhir" : "Free Trial Aktif"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isPro
                  ? `Berlaku hingga ${subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}`
                  : subscription.isExpired
                    ? "Upgrade ke Pro untuk melanjutkan akses fitur CationGate."
                    : `Sisa ${subscription.daysLeft} hari trial tersisa`
                }
              </p>
            </div>
          </div>
          {!isPro && (
            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
              subscription.isExpired
                ? "bg-rose-600 text-white"
                : "bg-amber-500 text-white"
            }`}>
              {subscription.isExpired ? "EXPIRED" : `${subscription.daysLeft} HARI TERSISA`}
            </span>
          )}
          {isPro && (
            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white">
              PRO AKTIF
            </span>
          )}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="pt-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Pilih Paket CationGate</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Pilih paket langganan yang sesuai dengan kebutuhan operasional sekolah Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto items-stretch">
          {loadingPlans ? (
            <div className="col-span-1 md:col-span-2 py-12 flex justify-center text-slate-500 dark:text-slate-400 animate-pulse font-medium">
              Memuat harga paket...
            </div>
          ) : (
            (plans.length > 0 ? plans : [
              {
                id: 1,
                name: "Free Trial",
                price_yearly: 0,
                features: [
                  "Pendaftaran Online PPDB",
                  "Kelola Data Calon Siswa",
                  "Export Excel",
                  "Landing Page Sekolah",
                  "Maks 100 Pendaftar",
                  "Masa Aktif 30 Hari"
                ]
              },
              {
                id: 2,
                name: "Pro Tahunan",
                price_yearly: 750000,
                features: [
                  "Semua Fitur Free Trial",
                  "Unlimited Pendaftar",
                  "Custom Branding & Logo",
                  "Multi-Admin Dashboard",
                  "WhatsApp Notifikasi",
                  "Prioritas Support 24/7",
                  "Pembagian Kelas Otomatis",
                  "Laporan & Statistik Lengkap"
                ]
              }
            ]).map((pkg, idx) => {
              const isFree = pkg.price_yearly === 0 || pkg.price_yearly === "0";
              const isProPlan = !isFree;
              const isActivePlan = isFree
                ? (currentPlanName === "FREE_TRIAL" || currentPlanName === "free") && !isPro
                : isPro;

              return (
                <motion.div
                  key={pkg.id}
                  whileHover={{ y: -4 }}
                  className={`relative flex flex-col rounded-3xl p-8 transition-all duration-200 ${
                    isProPlan
                      ? "bg-white dark:bg-[#0f172a] border-2 border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-600/5 ring-1 ring-blue-600/10"
                      : "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm"
                  }`}
                >
                  {/* Badge */}
                  {isActivePlan && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-bl-2xl">
                      Paket Aktif
                    </div>
                  )}
                  {idx === 1 && !isActivePlan && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-bl-2xl flex items-center gap-1.5 shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> Terpopuler
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      {isFree ? (
                        <Zap className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        {pkg.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[20px]">
                      {isFree
                        ? "Coba seluruh fitur dasar PPDB sekolah tanpa biaya komitmen."
                        : "Akses lengkap tanpa batas untuk operasional PPDB sekolah profesional."}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline flex-wrap gap-1.5">
                      <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(pkg.price_yearly || 0)}
                      </span>
                      <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                        / Tahun
                      </span>
                    </div>
                    {isProPlan && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1.5">
                        Setara {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format((pkg.price_yearly || 0) / 12)} / bulan
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="flex-1 space-y-4 mb-8">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Termasuk Semua Fitur:
                    </p>
                    <ul className="space-y-3">
                      {(pkg.features || []).map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isProPlan
                              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}>
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {isActivePlan ? (
                      <button disabled className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                        <CheckCircle2 className="w-4 h-4" /> Sedang Digunakan
                      </button>
                    ) : isFree ? (
                      <div className="w-full py-3 rounded-xl font-bold text-xs text-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                        Paket Default
                      </div>
                    ) : (
                      <button
                        onClick={handleUpgradePlan}
                        disabled={isPaying}
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isPaying ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin" />
                            Memproses Pembayaran...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Upgrade Sekarang
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
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
