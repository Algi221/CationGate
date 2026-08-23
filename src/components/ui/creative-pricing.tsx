"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PricingTier {
    name: string;
    icon: React.ReactNode;
    price: number;
    description: string;
    features: string[];
    popular?: boolean;
    color: string;
}

const colorMap: Record<string, string> = {
  amber: "text-amber-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
  emerald: "text-emerald-500",
  rose: "text-rose-500"
};

function CreativePricing({
    tag = "Simple Pricing",
    title = "Make Short Videos That Pop",
    description = "Edit, enhance, and go viral in minutes",
    tiers,
}: {
    tag?: string;
    title?: string;
    description?: string;
    tiers: PricingTier[];
}) {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
            <style dangerouslySetInnerHTML={{__html: `
              @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap');
              .font-handwritten {
                font-family: 'Kalam', cursive;
              }
            `}} />
            <div className="text-center space-y-6 mb-20">
                <div className="font-handwritten text-xl text-blue-500 -rotate-1 mb-2">
                    {tag}
                </div>
                <div className="relative inline-block mt-4 mb-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-handwritten text-zinc-900 dark:text-white -rotate-1 relative z-10 px-8 py-2">
                        {title}
                    </h2>
                    <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[110%] h-4 bg-blue-500/20 
                        -rotate-1 rounded-full blur-sm"
                    />
                </div>
                <p className="font-handwritten text-xl text-zinc-600 dark:text-zinc-400 -rotate-1 mt-4">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, index) => (
                    <div
                        key={tier.name}
                        className={cn(
                            "relative group",
                            "transition-all duration-300",
                            index === 0 && "-rotate-1",
                            index === 1 && "rotate-1 z-10",
                            index === 2 && "-rotate-2"
                        )}
                    >
                        <div
                            className={cn(
                                "absolute inset-0 bg-white dark:bg-zinc-900",
                                "border-2 border-zinc-900 dark:border-white",
                                "rounded-lg shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white",
                                "transition-all duration-300",
                                "group-hover:shadow-[8px_8px_0px_0px]",
                                "group-hover:-translate-x-1",
                                "group-hover:-translate-y-1"
                            )}
                        />

                        <div className="relative p-6 bg-white dark:bg-zinc-900 rounded-lg">
                            {tier.popular && (
                                <div
                                    className="absolute -top-4 -right-4 bg-amber-400 text-zinc-900 
                                    font-handwritten font-bold px-4 py-1.5 rounded-full rotate-12 text-sm border-2 border-zinc-900 shadow-[2px_2px_0px_0px] shadow-zinc-900 z-20"
                                >
                                    Popular!
                                </div>
                            )}

                            <div className="mb-6">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full mb-4",
                                        "flex items-center justify-center",
                                        "border-2 border-zinc-900 dark:border-white",
                                        colorMap[tier.color] || "text-zinc-500"
                                    )}
                                >
                                    {tier.icon}
                                </div>
                                <h3 className="font-handwritten text-2xl font-bold text-zinc-900 dark:text-white">
                                    {tier.name}
                                </h3>
                                <p className="font-handwritten text-zinc-600 dark:text-zinc-400 text-sm mt-1">
                                    {tier.description}
                                </p>
                            </div>

                            {}
                            <div className="mb-6 font-handwritten flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                                    Rp {tier.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                </span>
                                <span className="text-zinc-600 dark:text-zinc-400 font-bold text-sm">
                                    {tier.price === 0 ? " /20 Hari" : " /tahun"}
                                </span>
                            </div>

                            <div className="space-y-3 mb-8">
                                {tier.features.map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className="mt-1 w-5 h-5 rounded-full border-2 border-zinc-900 
                                            dark:border-white flex items-center justify-center shrink-0"
                                        >
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        <span className="font-handwritten text-[17px] leading-tight text-zinc-900 dark:text-white">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={cn(
                                    "w-full h-12 font-handwritten font-bold text-lg relative",
                                    "border-2 border-zinc-900 dark:border-white",
                                    "transition-all duration-300",
                                    "shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white",
                                    "hover:shadow-[6px_6px_0px_0px]",
                                    "hover:-translate-x-0.5 hover:-translate-y-0.5",
                                    tier.popular
                                        ? [
                                              "bg-amber-400 text-zinc-900",
                                              "hover:bg-amber-300",
                                              "active:bg-amber-400",
                                          ]
                                        : [
                                              "bg-white dark:bg-zinc-800",
                                              "text-zinc-900 dark:text-white",
                                              "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                                              "active:bg-white dark:active:bg-zinc-800",
                                          ]
                                )}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { CreativePricing, type PricingTier };
