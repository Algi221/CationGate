"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, GraduationCap, School } from "lucide-react";
import { CreativePricing, type PricingTier } from "@/components/ui/creative-pricing";

interface Plan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
}

export function PricingSection() {
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

  if (loading) {
    return (
      <section className="py-24 w-full bg-slate-50 dark:bg-slate-950 flex justify-center items-center">
        <div className="animate-pulse text-lg text-slate-500 font-handwritten">
          Memuat harga paket...
        </div>
      </section>
    );
  }

  // Map API plans to CreativePricing format
  const mappedTiers: PricingTier[] = plans.map((plan, index) => {
    let icon = <BookOpen className="w-6 h-6" />;
    let color = "amber";
    let description = "Untuk langkah pertama digitalisasi";
    
    if (index === 1) {
      icon = <GraduationCap className="w-6 h-6" />;
      color = "blue";
      description = "Pilihan terbaik untuk sekolah";
    } else if (index === 2) {
      icon = <School className="w-6 h-6" />;
      color = "purple";
      description = "Fitur penuh untuk manajemen";
    }

    return {
      name: plan.name,
      icon,
      price: plan.price_yearly,
      description,
      features: plan.features,
      popular: index === 1,
      color,
    };
  });

  return (
    <section className="pb-24 w-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative z-10">
      <CreativePricing 
        tag="Paket & Biaya"
        title="Paket Fleksibel untuk Sekolah Anda"
        description="Mulai dari gratis hingga kustomisasi penuh tanpa biaya tersembunyi"
        tiers={mappedTiers.length > 0 ? mappedTiers : [
          // Fallback if no plans available
          {
            name: "Belum Ada Paket",
            icon: <BookOpen className="w-6 h-6" />,
            price: 0,
            description: "Silakan hubungi admin",
            features: [],
            color: "amber"
          }
        ]}
      />
    </section>
  );
}
