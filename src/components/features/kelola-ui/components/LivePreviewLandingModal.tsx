"use client";

import React, { useState } from "react";
import { X, Smartphone, Monitor, Check } from "lucide-react";
import { SchoolHero } from "@/components/features/school-landing/components/SchoolHero";
import { SchoolGelombang } from "@/components/features/school-landing/components/SchoolGelombang";
import { SchoolAlur } from "@/components/features/school-landing/components/SchoolAlur";
import { SchoolMajors } from "@/components/features/school-landing/components/SchoolMajors";
import { SchoolKemitraan } from "@/components/features/school-landing/components/SchoolKemitraan";
import { SchoolFaq } from "@/components/features/school-landing/components/SchoolFaq";
import { SchoolContact } from "@/components/features/school-landing/components/SchoolContact";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { AlurItem, FaqItem, MajorItem, PartnerItem } from "../types";

interface LivePreviewLandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: () => void;
  schoolSlug: string;
  schoolDisplayName: string;
  heroTitle: string;
  heroTitleSub: string;
  heroSubtitle: string;
  address: string;
  mapTitle: string;
  mapUrl: string;
  waAdmin: string;
  schoolPeriod: string;
  faqList: FaqItem[];
  faqTitle: string;
  faqSubtitle: string;
  alurList: AlurItem[];
  majorsList: MajorItem[];
  partnersList: PartnerItem[];
  gelombangConfig: {
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  };
  heroBgImage?: string;
}

export const LivePreviewLandingModal: React.FC<LivePreviewLandingModalProps> = ({
  isOpen,
  onClose,
  onConfirmSave,
  schoolSlug,
  schoolDisplayName,
  heroTitle,
  heroTitleSub,
  heroSubtitle,
  heroBgImage,
  address,
  mapTitle,
  mapUrl,
  waAdmin,
  schoolPeriod,
  faqList,
  faqTitle,
  faqSubtitle,
  alurList,
  majorsList,
  partnersList,
  gelombangConfig
}) => {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

  if (!isOpen) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric"
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch (_e) {
      return dateString;
    }
  };

  const landingMajors = (majorsList || []).map((m) => ({
    code: m.code,
    name: m.title || m.code,
    title: m.title || m.code,
    desc: m.desc || "",
    color: m.color || "#2563EB",
    logo: m.logo || "",
    banner: m.banner || "",
    careers: Array.isArray(m.careers)
      ? m.careers.map((c) => (typeof c === "string" ? c : c.title)).join(", ")
      : typeof m.careers === "string"
      ? m.careers
      : "",
    facilities: Array.isArray(m.facilities)
      ? m.facilities.join(", ")
      : typeof m.facilities === "string"
      ? m.facilities
      : ""
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-6xl bg-slate-900/95 border border-slate-800 text-white rounded-2xl px-4 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              Live Preview Draf Landing Page
              <span className="text-[10px] font-normal lowercase bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                unsaved changes
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Pratinjau tampilan publik sebelum disimpan resmi dan dipublikasikan
            </p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor size={14} /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone size={14} /> Mobile (390px)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-700"
          >
            <X size={14} /> Tutup Preview
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirmSave();
            }}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Check size={14} /> Simpan &amp; Publikasikan
          </button>
        </div>
      </div>

      {/* Screen Frame Container */}
      <div
        className={`grow w-full overflow-hidden transition-all duration-300 rounded-3xl border border-slate-800 bg-white dark:bg-[#020617] shadow-2xl flex flex-col ${
          deviceMode === "mobile" ? "max-w-100 max-h-[85vh] ring-8 ring-slate-800" : "max-w-6xl max-h-[85vh]"
        }`}
      >
        <div className="grow overflow-y-auto w-full">
          {/* Simulated Landing Page Content */}
          <main className="w-full relative z-0">
            <SchoolHero
              schoolSlug={schoolSlug}
              schoolDisplayName={schoolDisplayName || "Nama Sekolah"}
              heroTitle={heroTitle || "Penerimaan Peserta Didik Baru"}
              heroTitleSub={heroTitleSub || "SPMB Online"}
              heroSubtitle={heroSubtitle || "Mulai langkah awal wujudkan masa depan cemerlang."}
              address={address || ""}
              majors={landingMajors}
              heroBgImage={heroBgImage}
            />

            <SchoolGelombang
              schoolPeriod={schoolPeriod || "2026-2027"}
              gelombangConfig={gelombangConfig}
              formatDate={formatDate}
            />

            <SchoolAlur
              schoolPeriod={schoolPeriod || "2026-2027"}
              alurList={alurList}
            />

            <SchoolMajors
              schoolSlug={schoolSlug}
              majors={landingMajors}
            />

            <SchoolKemitraan
              partnersList={partnersList}
            />

            <SchoolFaq
              faqTitle={faqTitle || "Pertanyaan yang Sering Diajukan"}
              faqSubtitle={faqSubtitle || "Temukan jawaban cepat untuk kendala dan pertanyaan umum."}
              faqList={faqList}
            />

            <SchoolContact
              mapTitle={mapTitle || "Lokasi Kampus Sekolah"}
              mapUrl={mapUrl}
              address={address || "Alamat Lengkap Sekolah"}
              waAdmin={waAdmin}
              schoolDisplayName={schoolDisplayName || "Nama Sekolah"}
            />
          </main>

          <SchoolFooter schoolSlug={schoolSlug} />
        </div>
      </div>
    </div>
  );
};
