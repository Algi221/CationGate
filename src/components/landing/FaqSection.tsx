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
  const [demoLandingHref, setDemoLandingHref] = useState("https://demo.cationgate.site");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      const protocol = window.location.protocol;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        setDemoLandingHref(`${protocol}//demo.localhost${port}`);
      } else if (hostname.endsWith(".vercel.app")) {
        setDemoLandingHref(`${protocol}//demo.${hostname}`);
      }
    }
  }, []);

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
      q: "Bagaimana alur SPMB bekerja di platform ini?",
      a: "Calon siswa dapat mendaftar secara mandiri lewat formulir online yang responsif, mengunggah berkas. Panitia sekolah dapat memverifikasi berkas dan mengumumkan kelulusan secara otomatis.",
    },
    {
      id: "faq-3",
      q: "Apakah data pendaftar dapat diekspor langsung ke Dapodik?",
      a: "Ya, CationGate menyediakan fitur ekspor data satu klik yang disesuaikan secara khusus dengan format upload resmi Dapodik (Excel/CSV), menghilangkan kebutuhan input ulang secara manual.",
    },
    {
      id: "faq-4",
      q: "Berapa lama proses implementasi untuk satu sekolah?",
      a: "Sekolah Anda dapat langsung siap beroperasi dalam hitungan menit setelah aktivasi domain dan pengaturan data dasar jurusan serta gelombang pendaftaran.",
    },
  ];

  return (
    <section className="py-24 bg-white text-zinc-900 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold uppercase tracking-wider w-fit">
              <HelpCircle className="w-4 h-4 text-zinc-500" />
              Frequently Asked Questions
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
              Pertanyaan yang Sering Diajukan
            </h2>

            <p className="text-zinc-500 text-base leading-relaxed">
              Temukan jawaban untuk berbagai pertanyaan umum seputar implementasi, fitur sistem, dan keamanan platform CationGate.
            </p>

            <div className="hidden lg:flex justify-center items-center p-6 bg-zinc-50 rounded-3xl border border-zinc-100 max-w-sm">
              {lottieData && (
                <Lottie
                  animationData={lottieData}
                  loop={true}
                  className="w-48 h-48"
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8 text-left">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-zinc-200 rounded-2xl px-6 bg-zinc-50/50 hover:bg-zinc-50 transition-colors shadow-2xs"
                >
                  <AccordionTrigger className="text-left font-bold text-zinc-900 text-base py-5 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between gap-5">
                <div>
                  <h3 className="font-bold text-xl mb-2 text-zinc-900">
                    Masih Memiliki Pertanyaan?
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Tim konsultan kami siap membantu memberikan solusi terbaik sesuai kebutuhan instansi Anda.
                  </p>
                </div>
                <Link href="/kontak" className="mt-1 w-full">
                  <Button className="w-full bg-[#172A35] hover:bg-zinc-800 text-white font-bold h-12 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    Hubungi Tim Kami <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col gap-5">
                <div>
                  <h3 className="font-bold text-xl mb-2 text-white">
                    Ingin Coba Langsung?
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Uji coba alur pendaftaran siswa dan jelajahi dashboard admin simulasi kami secara instan tanpa perlu mendaftar.
                  </p>
                </div>

                <a href={demoLandingHref} className="mt-1 w-full">
                  <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold h-12 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    Buka Demo Interaktif <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
