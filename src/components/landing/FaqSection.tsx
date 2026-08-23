"use client";

import React, { useEffect, useState } from "react";
import { HelpCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dynamic from "next/dynamic";
import Link from "next/link";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function FaqSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lottieData, setLottieData] = useState<any>(null);

  useEffect(() => {
    fetch("/assets/lottie_animation/question.json")
      .then((response) => response.json())
      .then((data) => setLottieData(data))
      .catch((error) =>
        console.error("Error loading Lottie animation:", error),
      );
  }, []);

  const faqs = [
    {
      id: "faq-1",
      q: "Bagaimana CationGate menjamin keamanan data & privasi sekolah?",
      a: "CationGate menerapkan enkripsi AES-256 tingkat tinggi untuk seluruh data pendaftaran dan akademik. Infrastruktur cloud kami mematuhi standar ISO 27001 dan panduan keamanan data Kemendikbudristek Dapodik.",
    },
    {
      id: "faq-2",
      q: "Bagaimana alur pendaftaran murid baru (PPDB) bekerja di platform ini?",
      a: "Calon siswa dapat mendaftar secara mandiri lewat formulir online yang responsif, mengunggah berkas, hingga mengikuti ujian seleksi CBT. Panitia sekolah dapat memverifikasi berkas dan mengumumkan kelulusan secara otomatis.",
    },
    {
      id: "faq-3",
      q: "Apakah data pendaftar dapat diekspor langsung ke Dapodik?",
      a: "Ya, CationGate menyediakan fitur ekspor data satu klik yang disesuaikan secara khusus dengan format upload resmi Dapodik (Excel/CSV), menghilangkan kebutuhan input ulang secara manual.",
    },
    {
      id: "faq-4",
      q: "Perangkat apa saja yang dibutuhkan oleh guru dan siswa?",
      a: "CationGate berbasis cloud 100% dan sepenuhnya responsif. Dapat diakses dengan lancar di komputer, laptop, tablet, maupun smartphone tanpa perlu menginstal aplikasi berat.",
    },
    {
      id: "faq-5",
      q: "Apakah ada pelatihan untuk staf sekolah sebelum implementasi?",
      a: "Tentu. Kami menyediakan sesi on-boarding khusus, modul panduan lengkap, dan dukungan teknis proaktif selama masa transisi untuk memastikan seluruh staf sekolah nyaman menggunakan sistem.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-24 bg-[#FAFAFA] text-zinc-900 border-t border-[#FAFAFA]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {}
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-200/50 text-zinc-700 text-xs font-bold uppercase tracking-widest mb-6">
                <HelpCircle className="w-4 h-4" />
                Pusat Bantuan
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6">
                Pertanyaan Umum
              </h2>
              <p className="text-lg text-zinc-500 leading-relaxed max-w-xl">
                Temukan jawaban cepat dan komprehensif mengenai keamanan,
                implementasi, dan fitur operasional CationGate di sekolah Anda.
              </p>
            </div>

            {}
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-zinc-200/80 py-2"
                >
                  <AccordionTrigger className="text-left text-lg font-bold text-zinc-800 hover:text-zinc-600 hover:no-underline transition-colors data-[state=open]:text-zinc-900">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-zinc-600 leading-relaxed pt-2 pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {}
          <div className="relative w-full">
            <div className="sticky top-32 flex flex-col gap-6 w-full max-w-125 mx-auto lg:mx-0 lg:ml-auto">
              {}
              <div className="w-full flex items-center justify-center relative group">
                {lottieData ? (
                  <Lottie
                    animationData={lottieData}
                    loop={true}
                    className="w-full max-w-100 h-auto object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-10 h-10 border-4 border-zinc-300 border-t-zinc-600 rounded-full animate-spin relative z-10 my-20"></div>
                )}
              </div>

              {}
              <div className="p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col gap-5">
                <div>
                  <h3 className="font-bold text-xl mb-2 text-white">
                    Ingin Coba Langsung?
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Uji coba alur pendaftaran siswa dan jelajahi dashboard admin simulasi kami secara instan tanpa perlu mendaftar.
                  </p>
                </div>

                <Link href="/demo" className="mt-1 w-full">
                  <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold h-12 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    Buka Demo Interaktif <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
