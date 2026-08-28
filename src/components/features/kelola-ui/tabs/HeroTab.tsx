"use client";

import React from "react";
import { Building, FileText, Info, Calendar, Upload } from "lucide-react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { formatPhoneNumber } from "../defaultData";

interface HeroTabProps {
  schoolLogo: string;
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
  heroBgImage?: string;
  setHeroBgImage?: (val: string) => void;
  handleHeroBgImageChange?: (file: File) => void;
}

export const HeroTab: React.FC<HeroTabProps> = ({
  schoolLogo,
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
  setG2Error,
  heroBgImage = "",
  setHeroBgImage,
  handleHeroBgImageChange
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building size={18} className="text-blue-600 dark:text-blue-500" />
          <span>Identitas &amp; Header Website</span>
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Logo resmi &amp; data legalitas dikelola di menu <strong className="text-blue-600 dark:text-blue-400">Profil Sekolah</strong>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 items-center bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0">
          {schoolLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={schoolLogo} alt="Logo Sekolah" className="max-w-full max-h-full object-contain rounded-md" />
          ) : (
            <Building className="w-6 h-6 text-slate-400" />
          )}
        </div>

        <div className="flex-1 space-y-1.5 text-left w-full">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Nama Instansi / Singkatan (Header Website)
            </label>
            <span className="text-[10px] text-slate-400 font-medium">{schoolTitle.length}/60</span>
          </div>
          <input
            type="text"
            maxLength={60}
            value={schoolTitle}
            onChange={(e) => setSchoolTitle(e.target.value)}
            placeholder="Contoh: PPDB SMK TB"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mt-8 mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText size={18} className="text-blue-600 dark:text-blue-500" />
          <span>Hero Section &amp; Header Utama</span>
        </h3>
      </div>

      {/* Hero Background Image Upload Section */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Foto Background Gedung / Hero Sekolah</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ganti foto gedung latar belakang di halaman depan portal sekolah Anda.
            </p>
          </div>
          {heroBgImage && setHeroBgImage && (
            <button
              type="button"
              onClick={() => setHeroBgImage("")}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer self-start sm:self-auto"
            >
              Reset ke Gambar Bawaan
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
            {heroBgImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroBgImage}
                  alt="Preview Background Hero"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                  Kustom
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                <Upload size={24} className="mb-1.5 opacity-60" />
                <span className="text-[11px] font-semibold">Belum ada foto</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <div className="flex flex-wrap gap-2.5 items-center">
              <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer w-auto shrink-0">
                <Upload size={13} />
                <span>Upload Foto Gedung</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && handleHeroBgImageChange) {
                      handleHeroBgImageChange(file);
                    }
                  }}
                />
              </label>
              <span className="text-[11px] text-slate-400">Rasio 16:9, JPG/PNG maks 5MB</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Foto gedung akan ditampilkan secara elegan dengan efek transparansi halus di bagian header landing page sekolah Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Title (Judul Utama)</label>
            <span className="text-[10px] text-slate-400 font-medium">{heroTitle.length}/80</span>
          </div>
          <input
            type="text"
            maxLength={80}
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Contoh: Penerimaan Siswa Baru"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Sub-Title (Judul Pelengkap)</label>
            <span className="text-[10px] text-slate-400 font-medium">{heroTitleSub.length}/100</span>
          </div>
          <input
            type="text"
            maxLength={100}
            value={heroTitleSub}
            onChange={(e) => setHeroTitleSub(e.target.value)}
            placeholder="Contoh: Portal PPDB SMK Taruna Bhakti"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hero Subtitle (Deskripsi Paragraf)</label>
            <span className="text-[10px] text-slate-400 font-medium">{heroSubtitle.length}/350</span>
          </div>
          <textarea
            maxLength={350}
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
            maxLength={60}
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
            maxLength={20}
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
            maxLength={60}
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
            maxLength={20}
            value={schoolPeriod}
            onChange={(e) => setSchoolPeriod(e.target.value)}
            placeholder="Contoh: 2026-2027"
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat Fisik Sekolah</label>
            <span className="text-[10px] text-slate-400 font-medium">{address.length}/200</span>
          </div>
          <input
            type="text"
            maxLength={200}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap sekolah..."
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Deskripsi Singkat Footer</label>
            <span className="text-[10px] text-slate-400 font-medium">{footerDesc.length}/250</span>
          </div>
          <textarea
            maxLength={250}
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
            maxLength={150}
            value={waGroupUrl}
            onChange={(e) => setWaGroupUrl(e.target.value)}
            placeholder="Contoh: https://chat.whatsapp.com/..."
            className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-1">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">No. WhatsApp Helpdesk Panitia</label>
          <input
            type="text"
            maxLength={20}
            value={waAdmin}
            onChange={(e) => setWaAdmin(formatPhoneNumber(e.target.value))}
            placeholder="Contoh: 6281292244456"
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
