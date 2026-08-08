"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Ed-Tech SaaS FAQs specified in PRD
  const faqs = [
    {
      q: "How does CationGate ensure data privacy & regulatory security?",
      a: "CationGate employs end-to-end AES-256 encryption at rest and in transit. Our infrastructure complies fully with ISO 27001 data protection standards and Kemendikbudristek Dapodik security guidelines.",
    },
    {
      q: "How accurate is the AI-Powered Lesson & Assessment Generation?",
      a: "Our AI model is fine-tuned specifically on accredited national K-12 and higher-ed curricula. Every generated lesson plan and quiz undergoes automated validation checks against grade-level learning benchmarks.",
    },
    {
      q: "Can CationGate export student records directly to Dapodik?",
      a: "Absolutely. CationGate provides one-click export formatted specifically for official Dapodik Excel/CSV upload requirements, eliminating duplicate manual data entry.",
    },
    {
      q: "What hardware is required for teachers and students?",
      a: "CationGate is 100% cloud-based and responsive. It operates smoothly on any modern browser across laptops, Chromebooks, tablets, or mobile devices with low-bandwidth optimization.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 bg-background border-b border-border relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8EC9F6]/20 text-[#2A1B1D] text-xs font-bold border border-border">
            <HelpCircle className="w-3.5 h-3.5 text-[#2A1B1D]" />
            Ed-Tech Platform FAQ
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-body text-base font-medium">
            Everything you need to know about implementing CationGate in your
            school.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 items-start">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-surface border border-border overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-heading hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-[#FFD33B]/30 text-primary" : "bg-background text-body"}`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-body leading-relaxed border-t border-border pt-3 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp / Direct Contact Support Box */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-heading">
                Have Additional Technical Questions?
              </div>
              <div className="text-xs text-body font-medium">
                Our Ed-Tech engineering team is available for 1-on-1
                consultations.
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/6281292244456?text=Hello%20CationGate%20Team,%20I%20have%20technical%20questions%20about%20the%20Ed-Tech%20SaaS"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              className="bg-primary hover:bg-[#F3C625] text-white font-bold rounded-xl text-xs px-5 shadow-2xs"
            >
              Speak With Engineering
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
