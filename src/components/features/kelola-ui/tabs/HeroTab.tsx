"use client";

import React from "react";
import { Building, Upload, FileText, Info, Calendar } from "lucide-react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { formatPhoneNumber } from "../defaultData";

interface HeroTabProps {
  schoolLogo: string;
  handleSchoolLogoChange: (file: File) => void;
  dragActiveStates: Record<string, boolean>;
  handleDragState: (e: React.DragEvent, key: string, status: boolean) => void;
  schoolTitle: string;
  setSchoolTitle: (val: string) => void;
  heroTitle: string;
  setHeroTitle: (val: string) => void;
  heroTitleSub: string;
  setHeroTitleSub: (val: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (val: string) => void;
  mapTitle: string;
  setMapTitle: (val: string) => void;
  mapUrl: string;
  setMapUrl: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  schoolPeriod: string;
  setSchoolPeriod: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  footerDesc: string;
  setFooterDesc: (val: string) => void;
  waGroupUrl: string;
  setWaGroupUrl: (val: string) => void;
  waAdmin: string;
  setWaAdmin: (val: string) => void;
  gelombangConfig: {
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  };
  setGelombangConfig: React.Dispatch<React.SetStateAction<{
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  }>>;
  g1Error: string | null;
  setG1Error: (err: string | null) => void;
  g2Error: string | null;
  setG2Error: (err: string | null) => void;
}

export const HeroTab: React.FC<HeroTabProps> = ({
  schoolLogo,
  handleSchoolLogoChange,
  dragActiveStates,
  handleDragState,
  schoolTitle,
  setSchoolTitle,
  heroTitle,
  setHeroTitle,
  heroTitleSub,
  setHeroTitleSub,
  heroSubtitle,
  setHeroSubtitle,
  mapTitle,
  setMapTitle,
  mapUrl,
  setMapUrl,
  phone,
  setPhone,
  email,
  setEmail,
  schoolPeriod,
  setSchoolPeriod,
  address,
  setAddress,
  footerDesc,
  setFooterDesc,
  waGroupUrl,
  setWaGroupUrl,
  waAdmin,
  setWaAdmin,
  gelombangConfig,
  setGelombangConfig,
  g1Error,
  setG1Error,
  g2Error,
  setG2Error
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building size={18} className="text-blue-600 dark:text-blue-500" />
          <span>Logo &amp; Nama Instansi (Header Website)</span>
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Logo Drag & Drop */}
        <div className="flex flex-col items-start gap-3 shrink-0">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Logo Instansi (Header)</label>
          <div
            className={`w-full md:w-56 h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all duration-300 ${
              dragActiveStates["school_logo"]
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50"
            }`}
            onDragEnter={(e) => handleDragState(e, "school_logo", true)}
            onDragOver={(e) => handleDragState(e, "school_logo", true)}
            onDragLeave={(e) => handleDragState(e, "school_logo", false)}
            onDrop={(e) => {
              handleDragState(e, "school_logo", false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleSchoolLogoChange(file);
            }}
          >
            {schoolLogo && (schoolLogo.startsWith('data:image/') || schoolLogo.startsWith('https://')) ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={schoolLogo} alt="Logo Sekolah" className="max-w-full max-h-full object-contain rounded-lg" />
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400">
                <Upload size={24} className="mx-auto mb-2 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-medium">Upload Logo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSchoolLogoChange(file);
              }}
            />
          </div>
        </div>

        {/* Nama Sekolah / Title */}
        <div className="flex-1 space-y-4 text-left w-full">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Instansi / Singkatan (Header)</label>
            <input
              type="text"
              value={schoolTitle}
              onChange={(e) => setSchoolTitle(e.target.value)}
              placeholder="Contoh: PPDB SMK TB"
              className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mt-8 mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText size={18} className="text-blue-600 dark:text-blue-500" />
          <span>Hero Section &amp; Header Utama</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Title (Judul Utama)</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Contoh: Penerimaan Siswa Baru"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Sub-Title (Judul Pelengkap)</label>
          <input
            type="text"
            value={heroTitleSub}
            onChange={(e) => setHeroTitleSub(e.target.value)}
            placeholder="Contoh: Portal PPDB SMK Taruna Bhakti"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Subtitle (Deskripsi Paragraf)</label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={3}
            placeholder="Tuliskan deskripsi singkat mengenai portal pendaftaran di halaman utama..."
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y"
          />
        </div>
      </div>

      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mt-8 mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info size={18} className="text-blue-600 dark:text-blue-500" />
          <span>Informasi Sekolah &amp; Google Maps</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-1">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Judul Seksi Google Maps</label>
          <input
            type="text"
            value={mapTitle}
            onChange={(e) => setMapTitle(e.target.value)}
            placeholder="Contoh: Kunjungi Kampus Sekolah"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google Maps Embed iFrame URL</label>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Auto-Extract &lt;iframe&gt; src</span>
          </div>
          <input
            type="text"
            value={mapUrl}
            onChange={(e) => {
              let val = e.target.value.trim();
              const srcMatch = val.match(/src=["']([^"']+)["']/i);
              if (srcMatch && srcMatch[1]) {
                val = srcMatch[1];
              }
              setMapUrl(val);
            }}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            💡 <strong>Cara ambil:</strong> Buka Google Maps ➔ Cari lokasi sekolah ➔ Klik tombol <strong>Bagikan (Share)</strong> ➔ Pilih tab <strong>Sematkan peta (Embed a map)</strong> ➔ Klik <strong>Salin HTML</strong> lalu tempel (paste) langsung ke kotak ini.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nomor Telepon Sekolah</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            placeholder="Contoh: +62218740756"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Resmi Sekolah</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Contoh: info@smktarunabhakti.sch.id"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tahun Pelajaran Terbit (Periode)</label>
          <input
            type="text"
            value={schoolPeriod}
            onChange={(e) => setSchoolPeriod(e.target.value)}
            placeholder="Contoh: 2026-2027"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat Fisik Sekolah</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap sekolah..."
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Deskripsi Singkat Footer</label>
          <textarea
            value={footerDesc}
            onChange={(e) => setFooterDesc(e.target.value)}
            rows={2}
            placeholder="Pionir pendidikan kejuruan teknologi informasi..."
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Link Grup WhatsApp PPDB Calon Siswa</label>
          <input
            type="text"
            value={waGroupUrl}
            onChange={(e) => setWaGroupUrl(e.target.value)}
            placeholder="Contoh: https://chat.whatsapp.com/..."
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-1">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nomor WhatsApp Tim PPDB (Konsultasi)</label>
          <input
            type="text"
            value={waAdmin}
            onChange={(e) => setWaAdmin(formatPhoneNumber(e.target.value))}
            placeholder="Contoh: +6281292244456"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Gelombang Pendaftaran Section */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-8 pb-4 mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar size={18} className="text-indigo-600 dark:text-indigo-500" />
          <span>Rentang Tanggal Gelombang Pendaftaran</span>
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Konfigurasikan masa aktif Gelombang 1 dan Gelombang 2 untuk portal pendaftaran.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateRangeCalendar
          label="Gelombang 1"
          startValue={gelombangConfig.gelombang1.start}
          endValue={gelombangConfig.gelombang1.end}
          onSelectRange={(start, end) => {
            setGelombangConfig(prev => ({
              ...prev,
              gelombang1: { start, end }
            }));
          }}
          excludeRange={gelombangConfig.gelombang2.start && gelombangConfig.gelombang2.end ? gelombangConfig.gelombang2 : null}
          error={g1Error}
          setError={setG1Error}
        />

        <DateRangeCalendar
          label="Gelombang 2"
          startValue={gelombangConfig.gelombang2.start}
          endValue={gelombangConfig.gelombang2.end}
          onSelectRange={(start, end) => {
            setGelombangConfig(prev => ({
              ...prev,
              gelombang2: { start, end }
            }));
          }}
          excludeRange={gelombangConfig.gelombang1.start && gelombangConfig.gelombang1.end ? gelombangConfig.gelombang1 : null}
          error={g2Error}
          setError={setG2Error}
        />
      </div>
    </div>
  );
};
