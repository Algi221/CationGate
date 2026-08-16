"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet, Plus, Edit2, Trash2, CheckCircle2, XCircle, Settings, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

interface Plan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
}

export default function GatekeeperPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Form Fields
  const [name, setName] = useState("");
  const [priceMonthly, setPriceMonthly] = useState<number | "">("");
  const [priceYearly, setPriceYearly] = useState<number | "">("");
  const [featuresRaw, setFeaturesRaw] = useState(""); // newline separated
  const [isActive, setIsActive] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("ppdb_admin_token") : null;
      
      const res = await fetch("/api/gatekeeper/plans", {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) throw new Error("Gagal mengambil data paket");
      const json = await res.json();
      if (json.success) {
        setPlans(json.data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal mengambil data paket dari server", "error");
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
      setPriceMonthly(plan.price_monthly);
      setPriceYearly(plan.price_yearly);
      setFeaturesRaw(plan.features.join("\n"));
      setIsActive(plan.is_active);
    } else {
      setEditingPlan(null);
      setName("");
      setPriceMonthly("");
      setPriceYearly("");
      setFeaturesRaw("");
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name || priceMonthly === "" || priceYearly === "") {
      Swal.fire("Peringatan", "Mohon lengkapi semua field wajib", "warning");
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem("ppdb_admin_token") : null;
    const features = featuresRaw.split("\n").map(f => f.trim()).filter(f => f.length > 0);

    const payload = {
      name,
      price_monthly: Number(priceMonthly),
      price_yearly: Number(priceYearly),
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
      const token = typeof window !== 'undefined' ? localStorage.getItem("ppdb_admin_token") : null;
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
      } catch (err) {
        Swal.fire("Error", "Terjadi kesalahan server", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Paket SaaS</h1>
          <p className="text-slate-500 text-sm mt-1">
            Atur pilihan harga, fitur, dan penawaran subscription untuk sekolah.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2" size={16} /> Tambah Paket Baru
        </Button>
      </div>

      {/* PLANS LIST */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 animate-pulse">
          Memuat data paket...
        </div>
      ) : plans.length === 0 ? (
        <div className="p-12 text-center text-slate-500 border border-slate-200 rounded-xl bg-white">
          Belum ada paket SaaS. Silakan buat paket pertama Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              {!plan.is_active && (
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">
                  Tidak Aktif
                </div>
              )}
              {plan.is_active && (
                <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Aktif
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
              
              <div className="mt-4 mb-6 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">Rp {plan.price_monthly.toLocaleString('id-ID')}</span>
                  <span className="text-sm text-slate-500 font-medium">/ bulan</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-600 font-semibold">Rp {plan.price_yearly.toLocaleString('id-ID')}</span>
                  <span className="text-sm text-slate-400 font-medium">/ tahun</span>
                </div>
              </div>

              <div className="flex-grow">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Fitur Termasuk</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3 mt-auto">
                <Button variant="outline" className="flex-1" onClick={() => handleOpenModal(plan)}>
                  <Edit2 size={14} className="mr-2" /> Edit
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3" onClick={() => handleDelete(plan.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPlan ? "Edit Paket SaaS" : "Tambah Paket Baru"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Paket <span className="text-red-500">*</span></label>
                <Input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Misal: PRO INSTITUTION"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Harga Bulanan (Rp) <span className="text-red-500">*</span></label>
                  <Input 
                    type="number" 
                    value={priceMonthly} 
                    onChange={e => setPriceMonthly(e.target.value === "" ? "" : Number(e.target.value))} 
                    placeholder="Misal: 649000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Harga Tahunan (Rp) <span className="text-red-500">*</span></label>
                  <Input 
                    type="number" 
                    value={priceYearly} 
                    onChange={e => setPriceYearly(e.target.value === "" ? "" : Number(e.target.value))} 
                    placeholder="Misal: 499000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Fitur (1 fitur per baris)</label>
                <textarea 
                  value={featuresRaw} 
                  onChange={e => setFeaturesRaw(e.target.value)}
                  placeholder="Subdomain (sekolah.cationgate.id)&#10;250 Active Learner Capacity&#10;Email Support"
                  className="w-full h-32 rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={isActive} 
                  onChange={e => setIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Paket Aktif (Ditampilkan di Landing Page)
                </label>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 sticky bottom-0">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
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
