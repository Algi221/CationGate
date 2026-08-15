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
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/saas/plans");
        const json = await res.json();
        if (json.success) {
          setPlans(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Fallback static data if API fails
  const fallbackPlans = [
    {
      id: 1,
      name: "STARTER",
      priceMonthly: 649000,
      priceYearly: 499000,
      features: [
        "Subdomain (sekolah.cationgate.id)",
        "250 Active Learner Capacity",
        "AI Lesson Plan Generation (50/mo)",
        "Email Support",
      ],
    },
    {
      id: 2,
      name: "PRO INSTITUTION",
      priceMonthly: 1299000,
      priceYearly: 999000,
      features: [
        "All Starter Plan Features",
        "UNLIMITED Active Learners",
        "Custom Domain (sch.id / edu)",
        "Unlimited AI Lesson & Assessment",
        "Real-Time Telemetry & Skill Heatmaps",
        "WhatsApp Broadcast API Integration",
      ],
    },
  ];

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;

  return (
    <section className="py-12 w-full font-sans bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#23191C] mb-4 tracking-tight">
            Flexible Plans Built For Growth
          </h2>
          <p className="text-[#58504E] text-base">
            Get started free or upgrade to unlock complete AI learning & telemetry stack for your institution.
          </p>

          {/* Toggle Billing */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={`text-xs font-bold tracking-wider ${
                billingCycle === "monthly" ? "text-[#23191C]" : "text-[#58504E]"
              }`}
            >
              MONTHLY
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
                ANNUAL
              </span>
              <span className="bg-[#8EC9F6]/20 text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400 animate-pulse">Memuat paket...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Main Plans (Starter & Pro) - Clean Flat Split */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col justify-between space-y-8">
              {displayPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`flex flex-col md:flex-row gap-6 md:items-center justify-between ${
                    index < displayPlans.length - 1 ? "pb-8 border-b border-gray-100" : "pt-2"
                  }`}
                >
                  <div className="w-full md:w-56 shrink-0 flex flex-col items-start gap-2">
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
                        /Month
                      </span>
                    </div>
                    <Link href="/daftar" className="w-full">
                      <Button className="w-full bg-[#8EC9F6] hover:bg-[#7DB8E5] text-[#2A1B1D] font-bold py-2.5 rounded-md transition-all">
                        {index === 0 ? "Get Started Now" : "Buy Now"}
                      </Button>
                    </Link>
                  </div>

                  <div className="flex-1 space-y-2.5">
                    {plan.features.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
                        <span className="text-sm text-[#23191C]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Enterprise Plan (Right Card) */}
            <div className="bg-[#2A1B1D] rounded-xl p-6 md:p-8 flex flex-col justify-between text-white">
              <div>
                <div className="w-10 h-10 bg-white/10 rounded-lg mb-4 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-1">Enterprise</h3>
                <div className="text-[#FFD33B] text-xs font-bold uppercase tracking-wider mb-3">Custom Tiers</div>

                <p className="text-white/80 text-xs leading-relaxed mb-6">
                  For school networks, foundation boards & education departments requiring dedicated infrastructure.
                </p>

                <div className="space-y-2.5 mb-6">
                  <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Enterprise Features:</p>
                  <ul className="text-xs text-white/80 space-y-2 pl-4 list-disc marker:text-[#8EC9F6]">
                    <li>Multi-School Central Command Portal</li>
                    <li>Dedicated Isolated Server Nodes (99.99% SLA)</li>
                    <li>Custom ERP & AXSI CBT API Integration</li>
                    <li>On-Site Staff Training & Workshop</li>
                    <li>Dedicated Technical Account Manager</li>
                  </ul>
                </div>
              </div>

              <Link href="/contact" className="w-full mt-4">
                <Button className="w-full bg-white hover:bg-gray-100 text-[#2A1B1D] font-bold py-2.5 rounded-md transition-all">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-center mt-8 text-xs text-[#58504E]">
          All plans feature basic dapodik export, standard telemetry, and email support.
        </p>
      </div>
    </section>
  );
}
