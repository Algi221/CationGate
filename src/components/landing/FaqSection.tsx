"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana CationGate menjamin keamanan data & privasi sekolah?",
      a: "CationGate menerapkan enkripsi AES-256 tingkat tinggi untuk seluruh data pendaftaran dan akademik. Infrastruktur cloud kami mematuhi standar ISO 27001 dan panduan keamanan data Kemendikbudristek Dapodik.",
    },
    {
      q: "Bagaimana alur pendaftaran murid baru (PPDB) bekerja di platform ini?",
      a: "Calon siswa dapat mendaftar secara mandiri lewat formulir online yang responsif, mengunggah berkas, hingga mengikuti ujian seleksi CBT. Panitia sekolah dapat memverifikasi berkas dan mengumumkan kelulusan secara otomatis.",
    },
    {
      q: "Apakah data pendaftar dapat diekspor langsung ke Dapodik?",
      a: "Ya, CationGate menyediakan fitur ekspor data satu klik yang disesuaikan secara khusus dengan format upload resmi Dapodik (Excel/CSV), menghilangkan kebutuhan input ulang secara manual.",
    },
    {
      q: "Perangkat apa saja yang dibutuhkan oleh guru dan siswa?",
      a: "CationGate berbasis cloud 100% dan sepenuhnya responsif. Dapat diakses dengan lancar di komputer, laptop, tablet, maupun smartphone tanpa perlu menginstal aplikasi berat.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 bg-background border-b border-border relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8EC9F6]/20 text-[#2A1B1D] text-xs font-bold border border-border">
            <HelpCircle className="w-3.5 h-3.5 text-[#2A1B1D]" />
            Pertanyaan Umum (FAQ)
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
            Pertanyaan Yang Sering Diajukan
          </h2>

          <p className="text-body text-base font-medium">
            Segala hal yang perlu Anda ketahui tentang implementasi CationGate di sekolah Anda.
          </p>
        </div>

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

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-heading">
                Punya Pertanyaan Teknis Lainnya?
              </div>
              <div className="text-xs text-body font-medium">
                Tim teknis CationGate siap membantu konsultasi 1-on-1 kapan saja.
              </div>
            </div>
          </div>

          <a href="/daftar">
            <Button className="bg-[#2A1B1D] text-white hover:bg-[#58504E] font-bold text-xs px-5 py-2.5 rounded-xl shrink-0">
              Hubungi Tim Teknis
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
