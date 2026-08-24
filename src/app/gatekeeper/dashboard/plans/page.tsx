"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, Check, XCircle, LayoutGrid, AlertCircle, ChevronDown, ChevronUp, Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

interface Plan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
}

function formatRupiahDisplay(num: number): string {
  if (num === 0) return "Gratis";
  return `Rp ${num.toLocaleString('id-ID')}`;
}

function parseRupiahInput(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

function formatInputDisplay(num: number): string {
  if (num === 0) return '';
  return num.toLocaleString('id-ID');
}

export default function GatekeeperPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [priceYearly, setPriceYearly] = useState(0);
  const [priceYearlyDisplay, setPriceYearlyDisplay] = useState("");
  const [featuresRaw, setFeaturesRaw] = useState(""); 
  const [isActive, setIsActive] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' 
        ? (localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token"))
        : null;

      let res = await fetch("/api/gatekeeper/plans", {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) {
        res = await fetch("/api/saas/plans");
      }

      if (!res.ok) throw new Error("Gagal mengambil data paket");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPlans(json.data);
      }
    } catch (error) {
      console.warn("Plans fetch warning:", error);
      try {
        const fallbackRes = await fetch("/api/saas/plans");
        const fallbackJson = await fallbackRes.json();
        if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
          setPlans(fallbackJson.data);
          return;
        }
      } catch (_e) {
        // silent
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setName(plan.name);
      setPriceYearly(plan.price_yearly);
      setPriceYearlyDisplay(formatInputDisplay(plan.price_yearly));
      setFeaturesRaw(plan.features.join("\n"));
      setIsActive(plan.is_active);
    } else {
      setEditingPlan(null);
      setName("");
      setPriceYearly(0);
      setPriceYearlyDisplay("");
      setFeaturesRaw("");
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handlePriceChange = (rawValue: string) => {
    const num = parseRupiahInput(rawValue);
    setPriceYearly(num);
    setPriceYearlyDisplay(num > 0 ? formatInputDisplay(num) : '');
  };

  const handleSave = async () => {
    if (!name) {
      Swal.fire("Peringatan", "Mohon lengkapi nama paket", "warning");
      return;
    }

    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token"))
      : null;
    const features = featuresRaw.split("\n").map(f => f.trim()).filter(f => f.length > 0);

    const payload = {
      name,
      price_monthly: Math.round(priceYearly / 12), 
      price_yearly: priceYearly,
      features,
      is_active: isActive
    };

    try {
      const url = editingPlan 
        ? `/api/gatekeeper/plans/${editingPlan.id}`
        : `/api/gatekeeper/plans`;
      const method = editingPlan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        Swal.fire("Sukses", `Paket berhasil ${editingPlan ? "diperbarui" : "dibuat"}`, "success");
        setIsModalOpen(false);
        fetchPlans();
      } else {
        Swal.fire("Gagal", json.message || "Gagal menyimpan paket", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Terjadi kesalahan server", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Paket?',
      text: "Data tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
      }
    });

    if (result.isConfirmed) {
      try {
        const token = typeof window !== 'undefined' 
          ? (localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token"))
          : null;
        const res = await fetch(`/api/gatekeeper/plans/${id}`, {
          method: "DELETE",
          headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        const json = await res.json();
        if (json.success) {
          Swal.fire("Terhapus!", "Paket telah dihapus.", "success");
          fetchPlans();
        } else {
          Swal.fire("Gagal", json.message || "Gagal menghapus", "error");
        }
      } catch (_err) {
        Swal.fire("Error", "Terjadi kesalahan server", "error");
      }
    }
  };

  const toggleDetail = (id: number) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 md:px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFD33B]/20 text-[#2e3749] dark:text-[#FFD33B] rounded-xl">
            <Banknote size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#2e3749] dark:text-white">
              Manajemen Paket SaaS
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">
              Atur pilihan harga, fitur, dan penawaran subscription untuk sekolah.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] rounded-xl shadow-sm hover:shadow-md transition-all h-10 px-5 font-bold text-sm shrink-0"
        >
          <Plus className="mr-2" size={16} strokeWidth={3} /> Tambah Paket
        </Button>
      </div>

      {/* PLANS LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400 animate-pulse bg-white/50 dark:bg-slate-900/50 rounded-2xl">
          <LayoutGrid size={40} className="mb-3 opacity-20" />
          <p className="font-medium text-sm">Memuat data paket...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50">
          <div className="p-3 bg-[#FFD33B]/20 rounded-full mb-3">
            <AlertCircle size={28} className="text-[#2e3749] dark:text-[#FFD33B]" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Belum ada paket SaaS</h3>
          <Button onClick={() => handleOpenModal()} className="mt-2 bg-[#FFD33B] text-[#2e3749] font-bold rounded-xl h-9 hover:bg-[#F3C625] text-xs">
            Mulai Buat Paket
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-start">
          {plans.map((plan) => {
            const isExpanded = expandedPlanId === plan.id;

            return (
              <div 
                key={plan.id} 
                className={`relative flex flex-col transition-all duration-300 ease-in-out rounded-3xl p-6 shadow-sm hover:shadow-md ${
                  plan.is_active 
                    ? 'bg-[#FFD33B] border-none' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header Kartu */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className={`text-lg font-bold leading-tight ${plan.is_active ? 'text-[#2e3749]' : 'text-slate-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  {plan.is_active ? (
                    <span className="bg-[#2e3749] text-[#FFD33B] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest shrink-0 ml-2">
                      Aktif
                    </span>
                  ) : (
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700 shrink-0 ml-2">
                      Draft
                    </span>
                  )}
                </div>

                {/* Area Harga */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className={`text-3xl font-black tracking-tighter ${plan.is_active ? 'text-[#2e3749]' : 'text-slate-900 dark:text-white'}`}>
                      {formatRupiahDisplay(plan.price_yearly)}
                    </span>
                  </div>
                  {plan.price_yearly > 0 && (
                    <span className={`text-xs font-semibold mt-0.5 block ${plan.is_active ? 'text-[#2e3749]/70' : 'text-slate-500 dark:text-slate-400'}`}>
                      / Tahun
                    </span>
                  )}
                </div>

                {/* Row 3 Tombol */}
                <div className="flex gap-2 relative z-10">
                  <Button 
                    className={`flex-1 h-10 text-xs rounded-xl font-bold transition-colors shadow-sm ${
                      plan.is_active 
                        ? 'bg-[#2e3749] hover:bg-[#2e3749]/90 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                    onClick={() => toggleDetail(plan.id)}
                  >
                    {isExpanded ? (
                      <>Tutup <ChevronUp size={14} className="ml-1.5 opacity-70" /></>
                    ) : (
                      <>Detail Fitur <ChevronDown size={14} className="ml-1.5 opacity-70" /></>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-10 h-10 p-0 rounded-xl transition-colors shrink-0 ${
                      plan.is_active 
                        ? 'bg-black/5 hover:bg-[#2e3749] hover:text-white text-[#2e3749]' 
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                    onClick={() => handleOpenModal(plan)}
                    title="Edit Paket"
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-10 h-10 p-0 rounded-xl transition-colors shrink-0 ${
                      plan.is_active 
                        ? 'bg-black/5 hover:bg-red-500 hover:text-white text-[#2e3749]' 
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-400'
                    }`}
                    onClick={() => handleDelete(plan.id)}
                    title="Hapus Paket"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>

                {/* List Fitur Expandable */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] mt-6 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${plan.is_active ? 'text-[#2e3749]/60' : 'text-slate-400 dark:text-slate-500'}`}>
                      Key Features
                    </p>
                    <ul className="space-y-3 pb-1">
                      {plan.features.length === 0 ? (
                        <li className={`text-xs italic ${plan.is_active ? 'text-[#2e3749]/60' : 'text-slate-400'}`}>
                          Belum ada fitur.
                        </li>
                      ) : (
                        plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <div className={`w-4 h-4 mt-0.5 rounded-full flex items-center justify-center shrink-0 ${
                              plan.is_active ? 'bg-[#2e3749]' : 'bg-slate-200 dark:bg-slate-700'
                            }`}>
                              <Check size={10} strokeWidth={4} className={plan.is_active ? 'text-[#FFD33B]' : 'text-slate-500 dark:text-slate-300'} />
                            </div>
                            <span className={`text-xs font-semibold leading-relaxed ${
                              plan.is_active ? 'text-[#2e3749]' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {feat}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {editingPlan ? "Edit Paket SaaS" : "Tambah Paket Baru"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <XCircle size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nama Paket</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Misal: PRO INSTITUTION"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FFD33B] focus:ring-4 focus:ring-[#FFD33B]/20 focus:outline-none transition-all text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Harga (per Tahun)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceYearlyDisplay}
                    onChange={e => handlePriceChange(e.target.value)}
                    placeholder="0"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FFD33B] focus:ring-4 focus:ring-[#FFD33B]/20 focus:outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Daftar Fitur <span className="text-xs text-slate-400 font-normal">(1 baris = 1 fitur)</span>
                </label>
                <textarea 
                  value={featuresRaw} 
                  onChange={e => setFeaturesRaw(e.target.value)}
                  placeholder={"Multiple input sources\nCustom analytics"}
                  className="w-full h-28 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 p-3 text-sm focus:border-[#FFD33B] focus:ring-4 focus:ring-[#FFD33B]/20 focus:outline-none resize-none transition-all leading-relaxed font-medium"
                />
              </div>

              <div 
                className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors border ${
                  isActive ? 'bg-[#FFD33B]/10 border-[#FFD33B]/50' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                }`}
                onClick={() => setIsActive(!isActive)}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#FFD33B]' : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  {isActive && <Check size={12} strokeWidth={4} className="text-[#2e3749]" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Status Publikasi</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tampilkan paket berwarna menyala di halaman utama.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5 z-10">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)} 
                className="rounded-xl h-10 px-5 text-sm font-bold text-slate-600 dark:text-slate-300 dark:border-slate-700"
              >
                Batal
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] rounded-xl h-10 px-5 text-sm font-bold shadow-sm transition-all"
              >
                Simpan Paket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}