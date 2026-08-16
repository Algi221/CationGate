"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Plan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
}

const formatRupiah = (num: number) => {
  return `Rp ${(num / 1000).toFixed(0)}k`;
};

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/saas/plans");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setPlans(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <section className="py-12 w-full font-sans bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#23191C] mb-4 tracking-tight">
            Paket Fleksibel untuk Kebutuhan Sekolah Anda
          </h2>
          <p className="text-[#58504E] text-base">
            Pilih paket yang sesuai untuk digitalisasi sistem pendaftaran dan manajemen sekolah Anda.
          </p>

          {/* Toggle Billing */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={`text-xs font-bold tracking-wider ${
                billingCycle === "monthly" ? "text-[#23191C]" : "text-[#58504E]"
              }`}
            >
              BULANAN
            </span>

            <button
              onClick={() =>
                setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
              }
              className="w-12 h-6 rounded-full bg-[#45C06B] relative transition-colors duration-200 focus:outline-none cursor-pointer flex items-center px-1"
              aria-label="Toggle billing cycle"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold tracking-wider ${
                  billingCycle === "yearly" ? "text-[#23191C]" : "text-[#58504E]"
                }`}
              >
                TAHUNAN
              </span>
              <span className="bg-[#8EC9F6]/20 text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded">
                HEMAT 20%
              </span>
            </div>
          </div>
        </div>

        {/* Cards Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:max-w-4xl lg:mx-auto gap-6 items-stretch">
          {loading ? (
            <div className="col-span-1 md:col-span-2 py-12 flex justify-center text-[#58504E]">
              Memuat harga paket...
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-12 flex justify-center text-[#58504E]">
              Belum ada paket yang tersedia.
            </div>
          ) : (
            plans.map((plan, index) => (
              <div
                key={plan.id}
                className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col justify-between space-y-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-full shrink-0 flex flex-col items-start gap-2 border-b border-gray-100 pb-6">
                  <span className="px-2.5 py-1 bg-gray-100 rounded text-xs font-bold text-[#58504E] uppercase tracking-wider">
                    {plan.name}
                  </span>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-3xl font-extrabold text-[#23191C] tracking-tight">
                      {billingCycle === "yearly"
                        ? formatRupiah(plan.price_yearly)
                        : formatRupiah(plan.price_monthly)}
                    </span>
                    <span className="text-[#58504E] text-sm font-medium">
                      /Bulan
                    </span>
                  </div>
                  <Link href="/daftar" className="w-full mt-2">
                    <Button className="w-full bg-[#8EC9F6] hover:bg-[#7DB8E5] text-[#2A1B1D] font-bold py-2.5 rounded-md transition-all">
                      {index === 0 ? "Mulai Sekarang" : "Pilih Paket Pro"}
                    </Button>
                  </Link>
                </div>

                <div className="flex-1 space-y-3 pt-2">
                  {plan.features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-sm text-[#23191C] leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-[#58504E] text-sm">
          Semua paket sudah termasuk update sistem berkala dan jaminan keamanan data.
        </div>
      </div>
    </section>
  );
}
