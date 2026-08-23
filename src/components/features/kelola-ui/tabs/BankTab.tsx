"use client";

import React from "react";
import { Database, Plus, Trash2 } from "lucide-react";
import { BankConfigItem } from "../types";

interface BankTabProps {
  bankConfigList: BankConfigItem[];
  setBankConfigList: React.Dispatch<React.SetStateAction<BankConfigItem[]>>;
}

export const BankTab: React.FC<BankTabProps> = ({
  bankConfigList,
  setBankConfigList
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
            <Database size={16} className="text-blue-500" />
            <span>Daftar Rekening Bank Sekolah</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            Ubah, tambah, atau hapus rekening tujuan transfer manual pendaftaran
          </p>
        </div>

        <button
          onClick={() => setBankConfigList(prev => [...prev, { bankName: "", accountNumber: "", accountHolder: "" }])}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah Rekening Bank</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bankConfigList.map((bank, idx) => (
          <div 
            key={idx}
            className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 relative overflow-hidden transition-all duration-300"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setBankConfigList(prev => prev.filter((_, i) => i !== idx))}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                title="Hapus Rekening"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-black rounded-lg text-[9px] uppercase tracking-wider">
                  Rekening #{idx + 1}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Bank</label>
                <input
                  type="text"
                  value={bank.bankName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBankConfigList(prev => prev.map((item, i) => i === idx ? { ...item, bankName: val } : item));
                  }}
                  placeholder="Contoh: Bank Mandiri, BCA, BJB..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nomor Rekening</label>
                  <input
                    type="text"
                    value={bank.accountNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBankConfigList(prev => prev.map((item, i) => i === idx ? { ...item, accountNumber: val } : item));
                    }}
                    placeholder="Contoh: 157-00-0174092-2"
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    value={bank.accountHolder}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBankConfigList(prev => prev.map((item, i) => i === idx ? { ...item, accountHolder: val } : item));
                    }}
                    placeholder="Contoh: Yayasan Taruna Bhakti"
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {bankConfigList.length === 0 && (
          <div className="col-span-2 text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            Belum ada rekening bank yang dikonfigurasi. Tambah rekening baru dengan tombol diatas.
          </div>
        )}
      </div>
    </div>
  );
};
