"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Search, 
  X, 
  Sparkles, 
  Check 
} from "lucide-react";
import { AlurItem } from "../types";
import { 
  ALUR_ICON_OPTIONS, 
  getAlurIconComponent 
} from "@/utils/alurIcons";

interface AlurTabProps {
  alurList: AlurItem[];
  setAlurList: React.Dispatch<React.SetStateAction<AlurItem[]>>;
}

export const AlurTab: React.FC<AlurTabProps> = ({
  alurList,
  setAlurList
}) => {
  const [activePickerId, setActivePickerId] = useState<number | null>(null);
  const [iconSearch, setIconSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = ["Semua", "Administrasi", "Pembayaran", "Hasil & Seleksi", "Akademik", "Komunikasi", "Dokumen", "Teknologi", "Lokasi", "Waktu", "Verifikasi"];

  const filteredIcons = ALUR_ICON_OPTIONS.filter((opt) => {
    const matchCat = selectedCategory === "Semua" || opt.category === selectedCategory;
    const matchSearch =
      opt.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
      opt.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
      opt.category.toLowerCase().includes(iconSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddAlur = () => {
    const nextId = alurList.length > 0 ? Math.max(...alurList.map(a => a.id)) + 1 : 1;
    const fallbackIcons = ["FileText", "CreditCard", "Phone", "Users", "Award", "ShieldCheck"];
    const chosenIcon = fallbackIcons[(nextId - 1) % fallbackIcons.length];

    setAlurList(prev => [
      ...prev,
      {
        id: nextId,
        title: "Tahapan Baru",
        desc: "Deskripsi singkat mengenai tahapan ini...",
        icon: chosenIcon
      }
    ]);
  };

  const handleUpdateAlur = (id: number, field: "title" | "desc" | "icon", value: string) => {
    setAlurList(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleRemoveAlur = (id: number) => {
    setAlurList(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveAlur = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= alurList.length) return;
    setAlurList(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIdx];
      copy[newIdx] = temp;
      return copy;
    });
  };

  const activeItem = alurList.find(a => a.id === activePickerId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
            <Settings size={16} className="text-blue-500" />
            <span>Tahapan Proses / Alur Pendaftaran Calon Siswa</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            Ubah teks, urutan, dan pilih icon visual interaktif untuk setiap langkah pendaftaran
          </p>
        </div>

        <button
          onClick={handleAddAlur}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          <span>Langkah Baru</span>
        </button>
      </div>

      <div className="space-y-4">
        {alurList.map((item, idx) => {
          const StepIcon = getAlurIconComponent(item.icon, idx);

          return (
            <div 
              key={item.id}
              className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all hover:border-blue-500/30"
            >
              {/* Step Number & Icon Picker Trigger */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black flex items-center justify-center text-xs shadow-xs">
                  {idx + 1}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivePickerId(item.id);
                    setIconSearch("");
                    setSelectedCategory("Semua");
                  }}
                  className="group relative flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#0f172a] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-400 rounded-2xl transition-all shadow-xs cursor-pointer"
                  title="Klik untuk memilih icon langkah ini"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <StepIcon size={18} />
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block">Icon</span>
                    <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 block max-w-20 truncate">
                      {item.icon || "Default"}
                    </span>
                  </div>
                </button>
              </div>

              {/* Form Input Fields */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Judul Langkah</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateAlur(item.id, "title", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Deskripsi Singkat</label>
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) => handleUpdateAlur(item.id, "desc", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Sorting & Control Actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleMoveAlur(idx, "up")}
                  disabled={idx === 0}
                  className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-900 transition-all cursor-pointer ${
                    idx === 0 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  title="Pindah ke Atas"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => handleMoveAlur(idx, "down")}
                  disabled={idx === alurList.length - 1}
                  className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-900 transition-all cursor-pointer ${
                    idx === alurList.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  title="Pindah ke Bawah"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => handleRemoveAlur(item.id)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                  title="Hapus Langkah"
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          );
        })}

        {alurList.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            Belum ada alur tahapan. Tambah tahapan baru dengan tombol diatas.
          </div>
        )}
      </div>

      {/* MODAL / ICON PICKER DIALOG */}
      {activePickerId !== null && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-[#020617]/50">
              <div>
                <h4 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-500" />
                  <span>Pilih Icon Langkah #{alurList.findIndex(a => a.id === activePickerId) + 1}: {activeItem.title}</span>
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  Pilih icon visual yang sesuai dengan tahapan pendaftaran
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePickerId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Bar & Category Filter */}
            <div className="p-4 border-b border-slate-100 dark:border-white/5 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Cari nama icon atau fungsi (contoh: berkas, bayar, kontak, ujian, kelulusan)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredIcons.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = activeItem.icon === opt.name;

                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => {
                      handleUpdateAlur(activeItem.id, "icon", opt.name);
                      setActivePickerId(null);
                    }}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all cursor-pointer group ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-[#1e293b] text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected 
                        ? "bg-blue-500 text-white shadow" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-500/10 group-hover:text-blue-500"
                    }`}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black block group-hover:text-blue-500 leading-tight">
                        {opt.name}
                      </span>
                      <span className="text-[8px] font-semibold text-slate-400 block mt-0.5 leading-tight line-clamp-1">
                        {opt.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[8px] font-black text-blue-600 uppercase mt-0.5">
                        <Check size={10} /> Dipilih
                      </span>
                    )}
                  </button>
                );
              })}

              {filteredIcons.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 font-bold text-xs uppercase">
                  Tidak ada icon yang cocok dengan pencarian &quot;{iconSearch}&quot;
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#020617]/50 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePickerId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-[#1e293b] hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
