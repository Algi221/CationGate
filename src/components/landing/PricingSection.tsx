"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = {
    starter: {
      name: "STARTER",
      priceMonthly: "Rp 649k",
      priceYearly: "Rp 499k",
      period: "/Month",
      features: [
        "Subdomain (sekolah.cationgate.id)",
        "250 Active Learner Capacity",
        "AI Lesson Plan Generation (50/mo)",
        "Email Support",
      ],
      cta: "Get Started Now",
    },
    pro: {
      name: "PRO INSTITUTION",
      priceMonthly: "Rp 1.299k",
      priceYearly: "Rp 999k",
      period: "/Month",
      badge: "Most Popular",
      features: [
        "All Starter Plan Features",
        "UNLIMITED Active Learners",
        "Custom Domain (sch.id / edu)",
        "Unlimited AI Lesson & Assessment",
        "Real-Time Telemetry & Skill Heatmaps",
        "WhatsApp Broadcast API Integration",
      ],
      cta: "Buy Now",
    },
  };

  return (
    <section className="min-h-screen w-full py-20 bg-[#FAF8F2] font-sans">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white w-full rounded-3xl p-8 md:p-12 shadow-sm border border-[#E7E1D6]">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#23191C] mb-4 tracking-tight">
              Flexible Plans Built For Growth
            </h2>
            <p className="text-[#58504E] text-base">
              Get started free or upgrade to unlock complete AI learning & telemetry stack for your institution.
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-xs font-bold tracking-wider ${billingCycle === "monthly" ? "text-[#23191C]" : "text-[#58504E]"}`}>
                MONTHLY
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="w-12 h-6 rounded-full bg-[#45C06B] relative transition-colors duration-200 focus:outline-none cursor-pointer flex items-center px-1"
                aria-label="Toggle billing cycle"
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold tracking-wider ${billingCycle === "yearly" ? "text-[#23191C]" : "text-[#58504E]"}`}>
                  ANNUAL
                </span>
                <span className="bg-[#8EC9F6]/10 text-[#8EC9F6] text-[10px] font-bold px-2 py-0.5 rounded-sm">SAVE 20%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <div className="flex-1 rounded-2xl bg-[#FAFAFA] border border-[#E7E1D6] flex flex-col overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              {[plans.starter, plans.pro].map((plan, idx) => (
                <div key={plan.name} className={`flex flex-col md:flex-row p-8 gap-8 ${idx === 0 ? "border-b border-[#E7E1D6]" : "bg-white relative"}`}>
                  {idx === 1 && (
                    <div className="absolute top-6 right-6 hidden md:block">
                      <span className="px-3 py-1 border border-[#8EC9F6] text-[#8EC9F6] rounded text-xs font-bold bg-[#8EC9F6]/5">{plans.pro.badge}</span>
                    </div>
                  )}
                  <div className="w-full md:w-48 shrink-0 flex flex-col items-start gap-4">
                    <span className="px-3 py-1 bg-white border border-[#E7E1D6] rounded text-xs font-bold text-[#58504E] uppercase tracking-wider">{plan.name}</span>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-extrabold text-[#23191C] tracking-tighter">{billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly}</span>
                      <span className="text-[#58504E] text-sm font-medium">{plan.period}</span>
                    </div>
                    <Link href="/daftar" className="w-full mt-2">
                      <Button className="w-full bg-[#8EC9F6] hover:bg-[#7DB8E5] text-[#2A1B1D] font-bold py-5 rounded-lg shadow-sm">{plan.cta}</Button>
                    </Link>
                  </div>
                  <div className="flex-1 flex flex-col justify-center space-y-3 pt-2">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#2A1B1D] shrink-0" strokeWidth={2.5} />
                        <span className="text-sm font-medium text-[#23191C]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-[320px] shrink-0 bg-[#2A1B1D] rounded-2xl p-8 flex flex-col text-white shadow-lg">
              <div className="w-12 h-12 bg-white rounded-xl mb-6 flex items-center justify-center">
                <PhoneCall className="w-6 h-6 text-[#2A1B1D]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-[#FFD33B] text-sm font-bold mb-4">Custom Tiers</div>
              <p className="text-white/80 text-sm leading-relaxed mb-6 flex-1">
                For school networks, foundation boards & education departments requiring dedicated infrastructure.
              </p>
              <Link href="/contact" className="w-full">
                <Button className="w-full bg-white hover:bg-[#FAF8F2] text-[#2A1B1D] font-bold py-6 rounded-lg mb-6 shadow-sm">Contact Sales</Button>
              </Link>
              <ul className="text-xs text-white/80 space-y-2.5 pl-4 list-disc marker:text-[#8EC9F6]">
                <li>Multi-School Central Command Portal</li>
                <li>Dedicated Isolated Server Nodes (99.99% SLA)</li>
                <li>Custom ERP & AXSI CBT API Integration</li>
                <li>On-Site Staff Training & Workshop</li>
                <li>Dedicated Technical Account Manager</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-10 text-sm font-medium text-[#58504E]">
            All plans feature basic dapodik export, standard telemetry, and email support.
          </div>
        </div>
      </div>
    </section>
  );
}
