"use client";

import React from "react";
import { Briefcase, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import DOMPurify from "dompurify";
import { sanitizeSrc } from "@/utils/security";
import { PartnerItem } from "../types";

interface PartnersTabProps {
  partnersList: PartnerItem[];
  setPartnersList: React.Dispatch<React.SetStateAction<PartnerItem[]>>;
}

export const PartnersTab: React.FC<PartnersTabProps> = ({
  partnersList,
  setPartnersList
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
            <Briefcase size={16} className="text-blue-500" />
            <span>Daftar Partner Industri</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            Kelola logo, nama, URL, dan ukuran logo perusahaan industri (Hanya tampil 20 di Landing Page, sisanya dipaginasi)
          </p>
        </div>

        <button
          onClick={() => {
            const nextId = partnersList.length > 0 ? Math.max(...partnersList.map(p => p.id)) + 1 : 1;
            setPartnersList(prev => [{ id: nextId, name: "Partner Baru", logo: "", url: "#", h: "h-12" }, ...prev]);
          }}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah Partner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partnersList.map((partner) => (
          <div 
            key={partner.id}
            className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-5 relative overflow-hidden transition-all duration-300"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setPartnersList(prev => prev.filter(p => p.id !== partner.id))}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                title="Hapus Partner"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center p-2">
                  {partner.logo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={DOMPurify.sanitize(sanitizeSrc(partner.logo) || "") || undefined} 
                      alt={partner.name} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  ) : (
                    <ImageIcon size={24} className="text-slate-300" />
                  )}
                </div>

                <input
                  type="text"
                  value={partner.logo}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPartnersList(prev => prev.map(p => p.id === partner.id ? { ...p, logo: val } : p));
                  }}
                  placeholder="URL Logo (https://...)"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-[10px] focus:outline-none focus:border-blue-500 text-center"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Partner</label>
                <input
                  type="text"
                  value={partner.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPartnersList(prev => prev.map(p => p.id === partner.id ? { ...p, name: val } : p));
                  }}
                  placeholder="Contoh: PT Telkom"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Link Website</label>
                <input
                  type="text"
                  value={partner.url}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPartnersList(prev => prev.map(p => p.id === partner.id ? { ...p, url: val } : p));
                  }}
                  placeholder="https://"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Ukuran Logo</label>
                <select
                  value={partner.h}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPartnersList(prev => prev.map(p => p.id === partner.id ? { ...p, h: val } : p));
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="h-8">Sangat Kecil (h-8)</option>
                  <option value="h-10">Kecil (h-10)</option>
                  <option value="h-12">Sedang (h-12)</option>
                  <option value="h-14">Besar (h-14)</option>
                  <option value="h-16">Sangat Besar (h-16)</option>
                  <option value="h-20">Raksasa (h-20)</option>
                </select>
              </div>

            </div>
          </div>
        ))}

        {partnersList.length === 0 && (
          <div className="col-span-3 text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            Belum ada partner industri. Tambah partner baru dengan tombol diatas.
          </div>
        )}
      </div>
    </div>
  );
};
