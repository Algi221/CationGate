"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Starter School Plan",
      priceMonthly: "Rp 649.000",
      priceYearly: "Rp 499.000",
      period: "/ month",
      subtitle: "For single institutions with up to 250 active learners",
      badge: "Starter",
      popular: false,
      features: [
        "Subdomain (sekolah.cationgate.id)",
        "250 Active Learner Capacity",
        "AI Lesson Plan Generation (50/mo)",
        "Standard Progress Telemetry",
        "Dapodik & CSV Export",
        "Email Support",
      ],
      cta: "Select Starter Plan",
      variant: "outline" as const,
    },
    {
      name: "Pro Institution Plan",
      priceMonthly: "Rp 1.299.000",
      priceYearly: "Rp 999.000",
      period: "/ month",
      subtitle: "Complete AI learning & telemetry stack for leading academies",
      badge: "Most Popular 🔥",
      popular: true,
      features: [
        "All Starter Plan Features",
        "UNLIMITED Active Learners",
        "Custom Domain (sch.id / edu)",
        "Unlimited AI Lesson & Assessment Synthesis",
        "Real-Time Telemetry & Skill Heatmaps",
        "Midtrans Payment Gateway (QRIS/VA)",
        "WhatsApp Broadcast API Integration",
        "24/7 Priority Support & SLA Uptime",
      ],
      cta: "Start 30-Day Free Trial",
      variant: "default" as const,
    },
    {
      name: "Enterprise Multi-Tenant",
      priceMonthly: "Custom Tiers",
      priceYearly: "Custom Tiers",
      period: "",
      subtitle: "For school networks, foundation boards & education departments",
      badge: "Enterprise",
      popular: false,
      features: [
        "Multi-School Central Command Portal",
        "Unlimited Tenant Subdomains",
        "Dedicated Isolated Server Nodes (99.99% SLA)",
        "Custom ERP & AXSI CBT API Integration",
        "On-Site Staff Training & Workshop",
        "Dedicated Technical Account Manager",
      ],
      cta: "Contact Enterprise Sales",
      variant: "outline" as const,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Transparent Ed-Tech SaaS Pricing
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Flexible Plans Built For Growth
          </h2>

          <p className="text-slate-600 text-base font-medium">
            30-day risk-free trial. No credit card required to start.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-500"}`}>
              Billed Monthly
            </span>

            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-8 rounded-full bg-blue-600 p-1 relative transition-colors duration-200 focus:outline-none cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-slate-900" : "text-slate-500"}`}>
              <span>Billed Annually</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 relative flex flex-col justify-between transition-all duration-200 ${
                plan.popular
                  ? "bg-slate-900 text-white border-2 border-blue-600 shadow-xl"
                  : "bg-white border border-slate-200 text-slate-900 shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                    plan.popular
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}>
                    {plan.badge}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold mb-1.5">
                  {plan.name}
                </h3>

                <p className={`text-xs mb-6 font-medium ${plan.popular ? "text-slate-300" : "text-slate-500"}`}>
                  {plan.subtitle}
                </p>

                <div className={`mb-6 pb-6 border-b ${plan.popular ? "border-slate-800" : "border-slate-100"}`}>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      {billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className={`text-xs font-semibold ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                    Included Capabilities:
                  </div>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs font-semibold">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? "bg-blue-900 text-blue-300" : "bg-emerald-50 text-emerald-600"}`}>
                        <Check className="w-3 h-3 font-bold" />
                      </div>
                      <span className={plan.popular ? "text-slate-200" : "text-slate-700"}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/daftar" className="w-full">
                <Button
                  size="lg"
                  className={`w-full font-bold text-xs rounded-xl py-5 ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-900"
                  }`}
                  variant={plan.variant}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
