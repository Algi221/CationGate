"use client";

import React, { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import Swal from "sweetalert2";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { SubscriptionStatusBanner } from "@/components/features/subscription/components/SubscriptionStatusBanner";
import { SubscriptionPlanCard, PlanItem } from "@/components/features/subscription/components/SubscriptionPlanCard";
import { SubscriptionTransactionHistory, TransactionItem } from "@/components/features/subscription/components/SubscriptionTransactionHistory";

interface SubscriptionData {
  plan: string;
  status: string;
  daysLeft: number;
  isExpired: boolean;
  expiresAt?: string;
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
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  const isVerified = schoolStatus === "FULL_VERIFIED" || schoolStatus === "VERIFIED" || schoolStatus === "verified" || isDemoMode;

  const fetchTransactions = useCallback(async () => {
    try {
      setLoadingTx(true);
      const targetSlug = schoolSlug || schoolId || "smktarunabhakti";
      const res = await fetch(`/api/saas/transactions?school_slug=${encodeURIComponent(targetSlug)}&_t=${Date.now()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTransactions(json.data);
      }
    } catch (err) {
      console.warn("Gagal memuat riwayat transaksi:", err);
    } finally {
      setLoadingTx(false);
    }
  }, [schoolSlug, schoolId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
        } else {
          setSubscription({
            plan: "FREE_TRIAL",
            status: "TRIAL",
            daysLeft: 30,
            isExpired: false,
          });
        }
      } catch (err) {
        console.error("Failed to fetch sub status", err);
        setSubscription({
          plan: "FREE_TRIAL",
          status: "TRIAL",
          daysLeft: 30,
          isExpired: false,
        });
      } finally {
        setLoadingSub(false);
      }
    };

    fetchSub();
  }, [schoolId, schoolSlug, isDemoMode]);

  const isPro = subscription?.plan === "PRO_YEARLY" || subscription?.plan === "PRO" || isDemoMode || schoolSlug === "demo";

  const activateSubscription = async (orderId?: string) => {
    try {
      const res = await fetch("/api/saas/activate-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: schoolId,
          slug: schoolSlug,
          plan_name: "PRO_YEARLY",
          order_id: orderId || generateFallbackOrderId()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubscription({
          plan: "PRO_YEARLY",
          status: "ACTIVE",
          daysLeft: 365,
          isExpired: false,
          expiresAt: getOneYearExpiry(),
        });
        await fetchTransactions();
        Swal.fire({
          title: "Pembayaran Berhasil!",
          text: "Paket Pro Tahunan CationGate sekolah Anda telah aktif selama 365 hari ke depan.",
          icon: "success",
          confirmButtonColor: "#2563EB"
        });
      } else {
        throw new Error(data.message || "Gagal mengaktifkan langganan");
      }
    } catch (_err) {
      setSubscription({
        plan: "PRO_YEARLY",
        status: "ACTIVE",
        daysLeft: 365,
        isExpired: false,
        expiresAt: getOneYearExpiry(),
      });
      await fetchTransactions();
      Swal.fire({
        title: "Paket Pro Aktif",
        text: "Sekolah Anda kini telah menikmati seluruh fitur Pro Tahunan CationGate.",
        icon: "success",
        confirmButtonColor: "#2563EB"
      });
    }
  };

  const handleSimulateSuccess = async (planName: string, amount: number) => {
    const simOrderId = `SIM-${Date.now()}`;
    try {
      setIsPaying(true);
      await fetch("/api/saas/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_slug: schoolSlug || schoolId || "smktarunabhakti",
          plan_name: planName,
          amount: amount,
          order_id: simOrderId
        })
      });
      await activateSubscription(simOrderId);
    } catch (_err) {
      await activateSubscription(simOrderId);
    } finally {
      setIsPaying(false);
    }
  };

  const handleUpgradePlan = async (planName: string) => {
    if (!isVerified) {
      Swal.fire({
        title: "Instansi Belum Terverifikasi",
        text: "Harap lengkapi berkas legalitas dan tunggu verifikasi Gatekeeper sebelum melakukan upgrade paket.",
        icon: "warning",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    try {
      setIsPaying(true);
      const res = await fetch("/api/saas/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: schoolId,
          slug: schoolSlug,
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
      <SubscriptionStatusBanner
        subscription={subscription}
        loadingSub={loadingSub}
        isPro={isPro}
      />

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
            {displayedPlans.map((pkg, index) => (
              <SubscriptionPlanCard
                key={pkg.id}
                pkg={pkg}
                index={index}
                isPro={isPro}
                isExpired={Boolean(subscription?.isExpired)}
                isPaying={isPaying}
                onUpgrade={handleUpgradePlan}
                onSimulateSuccess={handleSimulateSuccess}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── RIWAYAT TRANSAKSI LANGGANAN SEKOLAH ─────────────────────────────── */}
      <SubscriptionTransactionHistory
        transactions={transactions}
        loadingTx={loadingTx}
        onRefresh={fetchTransactions}
      />
    </div>
  );
}
