"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );

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
      subtitle:
        "For school networks, foundation boards & education departments",
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
    <section
      id="pricing"
      className="py-20 bg-background border-b border-border relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8EC9F6]/20 text-[#2A1B1D] text-xs font-bold border border-border">
            <Sparkles className="w-3.5 h-3.5 text-[#2A1B1D]" />
            Transparent Ed-Tech SaaS Pricing
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
            Flexible Plans Built For Growth
          </h2>

          <p className="text-body text-base font-medium">
            30-day risk-free trial. No credit card required to start.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-bold ${billingCycle === "monthly" ? "text-heading" : "text-body"}`}
            >
              Billed Monthly
            </span>

            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
              className="w-14 h-8 rounded-full bg-primary p-1 relative transition-colors duration-200 focus:outline-none cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full bg-surface transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span
              className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-heading" : "text-body"}`}
            >
              <span>Billed Annually</span>
              <span className="bg-[#45C06B]/20 text-[#45C06B] text-[10px] font-bold px-2 py-0.5 rounded border border-border">
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
                  ? "bg-[#2A1B1D] text-white border-2 border-[#8EC9F6] shadow-xl"
                  : "bg-surface border border-border text-heading shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-md ${
                      plan.popular
                        ? "bg-[#8EC9F6] text-[#2A1B1D]"
                        : "bg-background text-heading border border-border"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold mb-1.5">{plan.name}</h3>

                <p
                  className={`text-xs mb-6 font-medium ${plan.popular ? "text-white/80" : "text-body"}`}
                >
                  {plan.subtitle}
                </p>

                <div
                  className={`mb-6 pb-6 border-b ${plan.popular ? "border-white/20" : "border-border"}`}
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      {billingCycle === "yearly"
                        ? plan.priceYearly
                        : plan.priceMonthly}
                    </span>
                    <span
                      className={`text-xs font-semibold ${plan.popular ? "text-white/70" : "text-body"}`}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mb-2 ${plan.popular ? "text-white/70" : "text-body"}`}
                  >
                    Included Capabilities:
                  </div>
                  {plan.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-2.5 text-xs font-semibold"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? "bg-[#8EC9F6] text-[#2A1B1D]" : "bg-[#45C06B]/20 text-[#45C06B]"}`}
                      >
                        <Check className="w-3 h-3 font-bold" />
                      </div>
                      <span
                        className={
                          plan.popular ? "text-white/90" : "text-heading"
                        }
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/daftar" className="w-full">
                <Button
                  size="lg"
                  className={`w-full font-bold text-xs rounded-xl py-5 ${
                    plan.popular
                      ? "bg-[#FFD33B] hover:bg-[#F3C625] text-[#2A1B1D] shadow-xs"
                      : "border-border hover:bg-background text-heading"
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
