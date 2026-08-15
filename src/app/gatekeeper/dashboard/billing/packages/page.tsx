"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Pencil, Trash2, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Plan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

const formatRupiah = (num: number) => {
  return `Rp ${(num / 1000).toFixed(0)}k`;
};

export default function GatekeeperPackagesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPriceMonthly, setFormPriceMonthly] = useState(0);
  const [formPriceYearly, setFormPriceYearly] = useState(0);
  const [formFeatures, setFormFeatures] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token");
      const res = await fetch("/api/gatekeeper/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json.success) setPlans(json.data || []);
      } catch (parseError) {
        console.error("Invalid JSON from API:", text.substring(0, 150));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormName("");
    setFormPriceMonthly(499000);
    setFormPriceYearly(999000);
    setFormFeatures("");
    setShowModal(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormName(plan.name);
    setFormPriceMonthly(plan.price_monthly);
    setFormPriceYearly(plan.price_yearly);
    setFormFeatures(Array.isArray(plan.features) ? plan.features.join("\n") : "");
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token");
      const payload = {
        name: formName,
        price_monthly: Number(formPriceMonthly),
        price_yearly: Number(formPriceYearly),
        features: formFeatures.split("\n").map((f) => f.trim()).filter(Boolean),
      };

      let url = "/api/gatekeeper/plans";
      let method = "POST";

      if (editingPlan) {
        url += `/${editingPlan.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json.success) {
          setShowModal(false);
          fetchPlans();
        } else {
          alert("Gagal menyimpan paket");
        }
      } catch (parseError) {
        console.error("Invalid JSON:", text.substring(0, 150));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/gatekeeper/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirm(null);
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (plan: Plan) => {
    try {
      const token = localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token");
      await fetch(`/api/gatekeeper/plans/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !plan.is_active }),
      });
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="text-blue-600" /> Paket Langganan
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Kelola tingkatan paket langganan untuk sekolah yang mendaftar. Data ini akan tampil di halaman Pricing Landing Page.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <Plus size={16} /> Buat Paket Baru
        </button>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-400 animate-pulse">Memuat data paket...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center min-h-[300px] flex flex-col items-center justify-center gap-3">
          <Package className="w-12 h-12 text-slate-300" />
          <p className="text-slate-400 font-bold">Belum ada paket langganan</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-all"
          >
            Buat Paket Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 transition-all ${
                plan.is_active
                  ? "border-emerald-200 dark:border-emerald-800 shadow-sm"
                  : "border-slate-200 dark:border-slate-700 opacity-60"
              }`}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    plan.is_active
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {plan.is_active ? (
                    <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Aktif</span>
                  ) : (
                    <span className="flex items-center gap-1"><AlertTriangle size={14} /> Nonaktif</span>
                  )}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(plan.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Plan Name & Price */}
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-extrabold text-blue-600">{formatRupiah(plan.price_yearly)}</span>
                <span className="text-sm text-slate-400">/tahun</span>
                <span className="text-xs text-slate-300">({formatRupiah(plan.price_monthly)}/bulan)</span>
              </div>

              {/* Features */}
              {Array.isArray(plan.features) && plan.features.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              )}

              {/* Toggle Active */}
              <button
                onClick={() => toggleActive(plan)}
                className={`w-full mt-auto py-2 rounded-xl text-xs font-bold transition-all ${
                  plan.is_active
                    ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {plan.is_active ? "Nonaktifkan" : "Aktifkan"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingPlan ? "Edit Paket" : "Buat Paket Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Paket *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="contoh: STARTER, PRO INSTITUTION"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Bulanan (Rp) *</label>
                  <input
                    type="number"
                    value={formPriceMonthly}
                    onChange={(e) => setFormPriceMonthly(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Tahunan (Rp) *</label>
                  <input
                    type="number"
                    value={formPriceYearly}
                    onChange={(e) => setFormPriceYearly(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Fitur (satu per baris)</label>
                <textarea
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder={"Subdomain (sekolah.cationgate.id)\n250 Active Learner Capacity\nAI Lesson Plan Generation (50/mo)\nEmail Support"}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors flex items-center gap-2"
              >
                {saving ? "Menyimpan..." : editingPlan ? "Simpan Perubahan" : "Buat Paket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hapus Paket?</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Paket yang dihapus tidak bisa dikembalikan. Pastikan tidak ada sekolah yang sedang menggunakan paket ini.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
