"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import Swal from "sweetalert2";
import {
  CreditCard, CheckCircle2, AlertCircle, Clock,
  Crown, ArrowRight, ShieldCheck, Box, Sparkles, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionData {
  plan: string;
  status: string;
  daysLeft: number;
  isExpired: boolean;
  expiresAt?: string;
}

interface PlanItem {
  id: number;
  name: string;
  price_yearly: number;
  features: string[];
}

function generateFallbackOrderId(): string {
  return `ORD-${Date.now()}`;
}

function getOneYearExpiry(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

export default function SubscriptionManagementPage() {
  const { schoolStatus, isDemoMode, schoolId } = usePPDB();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";

  const [isPaying, setIsPaying] = useState(false);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const isVerified = schoolStatus === "FULL_VERIFIED" || schoolStatus === "VERIFIED" || schoolStatus === "verified" || isDemoMode;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/saas/plans");
        const data = await res.json();
        if (data.success && data.data) {
          setPlans(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (isDemoMode || schoolSlug === "demo") {
      setSubscription({
        plan: "PRO_YEARLY",
        status: "ACTIVE",
        daysLeft: 365,
        isExpired: false,
        expiresAt: getOneYearExpiry(),
      });
      setLoadingSub(false);
      return;
    }

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
  }, [schoolId, schoolSlug, isDemoMode]);

  const currentPlanName = subscription?.plan || "FREE_TRIAL";
  const isPro = currentPlanName === "PRO_YEARLY" || currentPlanName === "PRO_750K" || currentPlanName === "PRO";

  const activateSubscription = async (orderId?: string, planName?: string, amount?: number) => {
    const targetOrderId = orderId || generateFallbackOrderId();
    const targetPlan = planName || "Pro Tahunan";
    const targetAmount = typeof amount === "number" && amount > 0 ? amount : (targetPlan.toLowerCase().includes("enterprise") ? 35000000 : 15000000);
    const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;

    try {
      await fetch("/api/saas/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          slug: schoolSlug,
          school_id: schoolId,
          order_id: targetOrderId,
          plan_name: targetPlan,
          amount: targetAmount,
          payment_method: "Midtrans (Simulasi Sandbox)"
        })
      });

      setSubscription({
        plan: targetPlan.toUpperCase().replace(/\s+/g, '_'),
        status: "ACTIVE",
        daysLeft: 365,
        isExpired: false,
        expiresAt: getOneYearExpiry()
      });

      Swal.fire({
        title: "Pembayaran Berhasil! 🎉",
        html: `
          <div class="space-y-3 text-left text-xs text-slate-600 dark:text-slate-300 py-2">
            <div class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <p class="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Status: SETTLEMENT (LUNAS)</p>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-500 mt-1">Order ID: <code class="font-mono font-bold bg-white/70 dark:bg-black/30 px-1.5 py-0.5 rounded">${targetOrderId}</code></p>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-500 mt-0.5">Paket: <strong>${targetPlan}</strong> (Rp ${targetAmount.toLocaleString("id-ID")})</p>
            </div>
            <p>Paket <strong>${targetPlan}</strong> telah aktif untuk sekolah Anda selama 365 hari penuh. Transaksi pembayaran ini juga langsung tercatat di riwayat transaksi superadmin Gatekeeper.</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#2563EB",
        confirmButtonText: "Mulai Gunakan Fitur",
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
      });
    } catch (_err) {
      Swal.fire({
        title: "Gagal Mengaktifkan Lisensi",
        text: "Terjadi kesalahan saat memproses aktivasi paket.",
        icon: "error",
        confirmButtonColor: "#F43F5E"
      });
    }
  };

  const handleSimulateSuccess = async (planName?: string, priceYearly?: number) => {
    const selectedPlan = planName || "Pro Tahunan";
    const selectedPrice = typeof priceYearly === "number" && priceYearly > 0 ? priceYearly : (selectedPlan.toLowerCase().includes("enterprise") ? 35000000 : 15000000);
    const simOrderId = `SIM-MIDTRANS-${Date.now()}`;
    const result = await Swal.fire({
      title: "Simulasi Pembayaran Berhasil! 💳🎉",
      html: `
        <div class="space-y-3 text-left text-xs text-slate-600 dark:text-slate-300 py-2">
          <div class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
            <p class="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Status Transaksi: SETTLEMENT (SUKSES)</p>
            <p class="text-[11px] text-emerald-600 dark:text-emerald-500 mt-1">Order ID: <code class="font-mono font-bold bg-white/70 dark:bg-black/30 px-1.5 py-0.5 rounded">${simOrderId}</code></p>
            <p class="text-[11px] text-emerald-600 dark:text-emerald-500 mt-0.5">Paket: <strong>${selectedPlan}</strong> (Rp ${selectedPrice.toLocaleString("id-ID")})</p>
          </div>
          <p>Simulasi transaksi Midtrans Sandbox sukses terverifikasi. Klik tombol <strong>Konfirmasi &amp; Selesaikan</strong> untuk mengaktifkan lisensi sekolah, membuka kunci pendaftaran publik (SPMB), dan mencatat transaksi ke database Gatekeeper.</p>
        </div>
      `,
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Konfirmasi & Selesaikan",
      cancelButtonText: "Batal",
      customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
    });

    if (result.isConfirmed) {
      await activateSubscription(simOrderId, selectedPlan, selectedPrice);
    }
  };

  const handleUpgradePlan = async (planName?: string) => {
    if (isDemoMode || schoolSlug === "demo") {
      Swal.fire({
        title: "Mode Demo Preview",
        text: "Fitur transaksi pembayaran Midtrans hanya tersedia pada dashboard sekolah asli/terdaftar.",
        icon: "info",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    setIsPaying(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;
      const res = await fetch("/api/saas/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          slug: schoolSlug,
          school_id: schoolId,
          plan_name: planName || "PRO_YEARLY"
        })
      });

      const data = await res.json();

      if (!data.success || !data.token) {
        Swal.fire({
          title: "Sistem Pembayaran Offline",
          text: data.message || "Gagal membuat sesi pembayaran Midtrans.",
          icon: "warning",
          confirmButtonColor: "#2563EB"
        });
        setIsPaying(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snap = (window as any).snap;
      if (snap) {
        snap.pay(data.token, {
          onSuccess: async () => {
            await activateSubscription(data.order_id);
            setIsPaying(false);
          },
          onPending: () => {
            Swal.fire({
              title: "Menunggu Pembayaran",
              text: "Silakan selesaikan pembayaran sesuai instruksi pada popup Midtrans.",
              icon: "info",
              confirmButtonColor: "#2563EB"
            });
            setIsPaying(false);
          },
          onError: () => {
            Swal.fire({
              title: "Pembayaran Gagal",
              text: "Transaksi dibatalkan atau terjadi kegagalan jaringan.",
              icon: "error",
              confirmButtonColor: "#F43F5E"
            });
            setIsPaying(false);
          },
          onClose: () => {
            setIsPaying(false);
          }
        });
      } else {
        await activateSubscription(data.order_id);
        setIsPaying(false);
      }
    } catch (_err) {
      Swal.fire({
        title: "Kesalahan Jaringan",
        text: "Tidak dapat menghubungi gateway pembayaran.",
        icon: "error",
        confirmButtonColor: "#F43F5E"
      });
      setIsPaying(false);
    }
  };

  const defaultPlans: PlanItem[] = [
    {
      id: 1,
      name: "Free Trial",
      price_yearly: 0,
      features: [
        "Pendaftaran Online PPDB Dasar",
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
      price_yearly: 15000000,
      features: [
        "Semua Fitur Free Trial",
        "Unlimited Pendaftar",
        "Custom Branding & Logo",
        "Multi-Admin Dashboard",
        "WhatsApp Notifikasi Otomatis",
        "Prioritas Support 24/7",
        "Pembagian Kelas Otomatis",
        "Laporan & Statistik Lengkap"
      ]
    },
    {
      id: 3,
      name: "Enterprise Institution",
      price_yearly: 35000000,
      features: [
        "Semua Fitur Pro Tahunan",
        "Multi-Kampus & Cabang Yayasan",
        "Integrasi Dapodik & Emis",
        "Dedicated Account Manager",
        "Custom Domain Pribadi",
        "SLA Uptime 99.9%"
      ]
    }
  ];

  const displayedPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans transition-colors duration-300">
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
            Tingkatkan efisiensi dan kapasitas PPDB sekolah Anda dengan paket berlangganan CationGate.
          </p>
        </div>

        {/* Verification Badge */}
        <div className="shrink-0 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isVerified
              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 border border-emerald-300 dark:border-emerald-800"
              : "bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-300 dark:border-amber-800"
          }`}>
            {isVerified ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Verifikasi Instansi</p>
            <p className={`text-xs font-black ${isVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
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
            <span className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
              subscription.isExpired
                ? "bg-rose-600 text-white"
                : "bg-amber-500 text-white"
            }`}>
              {subscription.isExpired ? "EXPIRED" : `${subscription.daysLeft} HARI TERSISA`}
            </span>
          )}
          {isPro && (
            <span className="px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white">
              PRO AKTIF
            </span>
          )}
        </div>
      )}

      {/* ── 3-COLUMN PRODUCT PACKS CARDS ─────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Pilihan Paket CationGate
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Dapatkan efisiensi maksimal tanpa biaya tersembunyi untuk kelancaran operasional PPDB sekolah.
          </p>
        </div>

        {loadingPlans ? (
          <div className="bg-white dark:bg-slate-900 rounded-4xl p-16 text-center border border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 font-mono text-sm font-bold animate-pulse">
              Memuat pilihan paket langganan...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {displayedPlans.map((pkg, index) => {
              const isFree = pkg.price_yearly === 0;
              const isCard1 = index === 0;
              const isCard2 = index === 1;
              const _isCard3 = index === 2;

              const isCurrentlyActive = isFree
                ? !isPro && !subscription?.isExpired
                : isPro && (pkg.name.toLowerCase().includes("pro") || isCard2);

              if (isCard1) {
                // ── CARD 1: AMBER / WARM YELLOW (PRODUCT PACKS STYLE) ──
                return (
                  <div
                    key={pkg.id}
                    className="bg-amber-300 dark:bg-[#EAB844] text-neutral-950 rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-200 border-2 border-amber-400/80"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-black/10 text-black text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-black/10">
                          {isCurrentlyActive ? "Paket Anda Saat Ini" : "Uji Coba"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                          <Sparkles className="w-6 h-6 text-black" />
                          {pkg.name}
                        </h3>
                        <p className="text-neutral-800 text-xs font-semibold leading-relaxed">
                          Coba seluruh fitur dasar PPDB sekolah tanpa biaya komitmen.
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col gap-1 my-6">
                        <span className="text-4xl md:text-5xl font-black tracking-tight">
                          Free
                        </span>
                        <span className="text-xs font-bold text-neutral-700">
                          Tanpa biaya tersembunyi selama masa uji coba 30 hari.
                        </span>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 pt-6 border-t border-black/10 text-xs font-medium">
                        {(pkg.features || []).map((feat, i) => (
                          <div key={i} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-neutral-900 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />
                              <span>{feat}</span>
                            </div>
                            <span className="text-[11px] font-mono font-black text-neutral-800 shrink-0">Included</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      disabled
                      variant="outline"
                      className="w-full h-12 rounded-2xl bg-neutral-900 text-white font-bold border-2 border-black opacity-80 cursor-not-allowed shadow-[4px_4px_rgb(0_0_0)]"
                    >
                      {isCurrentlyActive ? "Sedang Digunakan" : "Paket Uji Coba"}
                    </Button>
                  </div>
                );
              }

              if (isCard2) {
                // ── CARD 2: DEEP DARK / ENTERPRISE (PRODUCT PACKS STYLE) ──
                return (
                  <div
                    key={pkg.id}
                    className="bg-neutral-950 dark:bg-[#151D2A] text-white rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-2xl space-y-6 relative overflow-hidden ring-2 ring-[#FFD33B]/40 transition-all duration-200 border border-white/10"
                  >
                    {/* Top Popular Glow Pill */}
                    <div className="absolute top-0 right-8 px-4 py-1 rounded-b-xl bg-[#FFD33B] text-black font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                      <Crown size={12} /> Paling Populer
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-[#FFD33B]/20 text-[#FFD33B] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-[#FFD33B]/30">
                          {isCurrentlyActive ? "Paket Anda Saat Ini" : "Rekomendasi Utama"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                          <Box className="w-6 h-6 text-[#FFD33B]" />
                          {pkg.name}
                        </h3>
                        <p className="text-neutral-400 text-xs font-semibold leading-relaxed">
                          Akses tanpa batas, pendaftar unlimited, notifikasi WA, dan prioritas support 24/7.
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col gap-1 my-6">
                        <span className="text-4xl md:text-5xl font-black tracking-tight text-[#FFD33B]">
                          Rp {Number(pkg.price_yearly).toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs font-medium text-neutral-400">
                          /tahun lisensi sekolah lengkap.
                        </span>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 pt-6 border-t border-neutral-800 text-xs font-medium">
                        {(pkg.features || []).map((feat, i) => (
                          <div key={i} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-white font-bold">
                              <CheckCircle2 className="w-4 h-4 text-[#FFD33B] shrink-0" />
                              <span>{feat}</span>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-neutral-400 shrink-0">Included</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleUpgradePlan(pkg.name)}
                        disabled={isPaying || isCurrentlyActive}
                        variant="outline"
                        className="w-full h-12 rounded-2xl bg-[#FFD33B] hover:bg-[#F3C625] text-black font-black border-2 border-black transition-all duration-100 shadow-[4px_4px_rgb(255_210_48)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCurrentlyActive ? (
                          "Sedang Digunakan"
                        ) : isPaying ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" /> Memproses...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 mr-2" /> Upgrade ke Pro Sekarang <ArrowRight className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </Button>

                      {!isCurrentlyActive && (
                        <button
                          type="button"
                          onClick={() => handleSimulateSuccess(pkg.name, pkg.price_yearly)}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                        >
                          <Sparkles size={14} className="text-emerald-400" />
                          <span>Simulasi Pembayaran Berhasil (Sandbox)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              }

              // ── CARD 3: ENTERPRISE INSTITUTION (PRODUCT PACKS STYLE) ──
              return (
                <div
                  key={pkg.id}
                  className="bg-white dark:bg-[#1A2230] text-slate-900 dark:text-white rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-200 border-2 border-slate-200 dark:border-slate-800"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-blue-200 dark:border-blue-700/50">
                        <Shield size={13} /> {isCurrentlyActive ? "Paket Anda Saat Ini" : "Institusi Besar"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        {pkg.name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                        Kustomisasi penuh untuk yayasan multi-kampus &amp; integrasi Dapodik.
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1 my-6">
                      <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        Rp {Number(pkg.price_yearly).toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        /tahun paket kustom yayasan.
                      </span>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
                      {(pkg.features || []).map((feat, i) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">Enterprise</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleUpgradePlan(pkg.name)}
                      disabled={isPaying || isCurrentlyActive}
                      variant="outline"
                      className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black border-2 border-slate-900 dark:border-white transition-all duration-100 shadow-[4px_4px_rgb(15_23_42)] dark:shadow-[4px_4px_rgb(255_255_255/20%)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCurrentlyActive ? (
                        "Sedang Digunakan"
                      ) : isPaying ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" /> Memproses...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 mr-2" /> Upgrade Enterprise <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>

                    {!isCurrentlyActive && (
                      <button
                        type="button"
                        onClick={() => handleSimulateSuccess(pkg.name, pkg.price_yearly)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                      >
                        <Sparkles size={14} className="text-emerald-500" />
                        <span>Simulasi Pembayaran Berhasil (Sandbox)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
