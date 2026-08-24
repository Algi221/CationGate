"use client";

import React from "react";
import { HelpCircle, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { FaqItem } from "../types";

interface FaqTabProps {
  faqList: FaqItem[];
  setFaqList: React.Dispatch<React.SetStateAction<FaqItem[]>>;
  faqTitle: string;
  setFaqTitle: (val: string) => void;
  faqSubtitle: string;
  setFaqSubtitle: (val: string) => void;
}

export const FaqTab: React.FC<FaqTabProps> = ({
  faqList,
  setFaqList,
  faqTitle,
  setFaqTitle,
  faqSubtitle,
  setFaqSubtitle
}) => {
  const handleAddFaq = () => {
    setFaqList(prev => [
      ...prev,
      {
        q: "Pertanyaan baru...",
        a: "Tuliskan jawaban penjelasan di sini secara lengkap dan jelas."
      }
    ]);
  };

  const handleUpdateFaq = (index: number, field: "q" | "a", value: string) => {
    setFaqList(prev => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const handleRemoveFaq = (index: number) => {
    setFaqList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= faqList.length) return;
    setFaqList(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIdx];
      copy[newIdx] = temp;
      return copy;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
            <HelpCircle size={16} className="text-blue-500" />
            <span>Tanya Jawab &amp; Bantuan PPDB (FAQ)</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            Kelola daftar pertanyaan yang sering diajukan untuk mempermudah calon pendaftar
          </p>
        </div>

        <button
          onClick={handleAddFaq}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah Pertanyaan</span>
        </button>
      </div>

      {/* FAQ Header Text Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Judul Section FAQ</label>
          <input
            type="text"
            value={faqTitle}
            onChange={(e) => setFaqTitle(e.target.value)}
            placeholder="Pertanyaan yang Sering Diajukan"
            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sub-judul Section FAQ</label>
          <input
            type="text"
            value={faqSubtitle}
            onChange={(e) => setFaqSubtitle(e.target.value)}
            placeholder="Temukan jawaban cepat untuk kendala dan pertanyaan umum..."
            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {faqList.map((item, idx) => (
          <div 
            key={idx}
            className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-5 flex items-start gap-4 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow shadow-blue-500/10">
              {idx + 1}
            </div>

            <div className="flex-1 grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Pertanyaan (Question)</label>
                <input
                  type="text"
                  value={item.q}
                  onChange={(e) => handleUpdateFaq(idx, "q", e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Jawaban (Answer)</label>
                <textarea
                  value={item.a}
                  onChange={(e) => handleUpdateFaq(idx, "a", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* Sorting & Control Actions */}
            <div className="flex items-center gap-1.5 shrink-0 self-center">
              <button
                onClick={() => handleMoveFaq(idx, "up")}
                disabled={idx === 0}
                className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-900 transition-all cursor-pointer ${
                  idx === 0 ? "opacity-30 cursor-not-allowed" : ""
                }`}
                title="Pindah ke Atas"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => handleMoveFaq(idx, "down")}
                disabled={idx === faqList.length - 1}
                className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-900 transition-all cursor-pointer ${
                  idx === faqList.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                }`}
                title="Pindah ke Bawah"
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => handleRemoveFaq(idx)}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                title="Hapus Pertanyaan"
              >
                <Trash2 size={14} />
              </button>
            </div>

          </div>
        ))}

        {faqList.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            Belum ada tanya-jawab FAQ. Tambah pertanyaan baru dengan tombol diatas.
          </div>
        )}
      </div>
    </div>
  );
};
