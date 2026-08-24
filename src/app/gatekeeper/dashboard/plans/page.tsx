"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, CheckCircle2, XCircle
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
  return `Rp ${num.toLocaleString('id-ID')}`;
}

/** Parse "750.000" or "750000" back to number */
function parseRupiahInput(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/** Format raw number to "750.000" display string for input */
function formatInputDisplay(num: number): string {
  if (num === 0) return '';
  return num.toLocaleString('id-ID');
}

export default function GatekeeperPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [priceYearly, setPriceYearly] = useState(0);
  const [priceYearlyDisplay, setPriceYearlyDisplay] = useState("");
  const [featuresRaw, setFeaturesRaw] = useState(""); // newline separated
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
        // Fallback to saas public plans route if gatekeeper endpoint returns 401/500
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
    if (!name || priceYearly <= 0) {
      Swal.fire("Peringatan", "Mohon lengkapi nama paket dan harga tahunan", "warning");
      return;
    }

    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token"))
      : null;
    const features = featuresRaw.split("\n").map(f => f.trim()).filter(f => f.length > 0);

    const payload = {
      name,
      price_monthly: Math.round(priceYearly / 12), // auto-calculate monthly from yearly
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
      title: 'Apakah Anda yakin?',
      text: "Data paket tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
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
          Swal.fire("Gagal", json.message || "Gagal menghapus paket", "error");
        }
      } catch (_err) {
        Swal.fire("Error", "Terjadi kesalahan server", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Manajemen Paket SaaS</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Atur pilihan harga, fitur, dan penawaran subscription tahunan untuk sekolah.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2" size={16} /> Tambah Paket Baru
        </Button>
      </div>

      {/* PLANS LIST */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 animate-pulse">
          Memuat data paket...
        </div>
      ) : plans.length === 0 ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900">
          Belum ada paket SaaS. Silakan buat paket pertama Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              {!plan.is_active && (
                <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-1 rounded-md font-medium">
                  Tidak Aktif
                </div>
              )}
              {plan.is_active && (
                <div className="absolute top-4 right-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Aktif
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>

              <div className="mt-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{formatRupiahDisplay(plan.price_yearly)}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">/ tahun</span>
                </div>
              </div>

              <div className="grow">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Fitur Termasuk</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 mt-auto">
                <Button variant="outline" className="flex-1 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => handleOpenModal(plan)}>
                  <Edit2 size={14} className="mr-2" /> Edit
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-slate-700 dark:hover:bg-red-950 px-3" onClick={() => handleDelete(plan.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingPlan ? "Edit Paket SaaS" : "Tambah Paket Baru"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Nama Paket */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Paket <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Misal: PRO INSTITUTION"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
                />
              </div>

              {/* Harga Tahunan */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Harga Tahunan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 dark:text-slate-400 select-none">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceYearlyDisplay}
                    onChange={e => handlePriceChange(e.target.value)}
                    placeholder="750.000"
                    className="w-full h-11 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-sm font-semibold tracking-wide"
                  />
                </div>
                {priceYearly > 0 && (
                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                    ≈ {formatRupiahDisplay(Math.round(priceYearly / 12))} / bulan
                  </p>
                )}
              </div>

              {/* Fitur */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Fitur (1 fitur per baris)</label>
                <textarea 
                  value={featuresRaw} 
                  onChange={e => setFeaturesRaw(e.target.value)}
                  placeholder={"Subdomain (sekolah.cationgate.id)\n250 Active Learner Capacity\nEmail Support"}
                  className="w-full h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none transition-all"
                />
              </div>

              {/* Paket Aktif */}
              <div className="flex items-center gap-3 pt-1">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={isActive} 
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-600 bg-white dark:bg-slate-800"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Paket Aktif (Ditampilkan di Landing Page)
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 sticky bottom-0">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                Simpan Paket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
