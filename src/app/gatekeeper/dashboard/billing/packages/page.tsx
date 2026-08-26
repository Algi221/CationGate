"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Pencil, Trash2, X, CheckCircle2, AlertTriangle } from "lucide-react";

interface Plan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  created_at: string;
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

export default function GatekeeperPackagesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPriceYearly, setFormPriceYearly] = useState(0);
  const [priceYearlyDisplay, setPriceYearlyDisplay] = useState("");
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
      } catch (_parseError) {
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
    setFormPriceYearly(0);
    setPriceYearlyDisplay("");
    setFormFeatures("");
    setShowModal(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormName(plan.name);
    setFormPriceYearly(plan.price_yearly);
    setPriceYearlyDisplay(formatInputDisplay(plan.price_yearly));
    setFormFeatures(Array.isArray(plan.features) ? plan.features.join("\n") : "");
    setShowModal(true);
  };

  const handlePriceChange = (rawValue: string) => {
    const num = parseRupiahInput(rawValue);
    setFormPriceYearly(num);
    setPriceYearlyDisplay(num > 0 ? formatInputDisplay(num) : '');
  };

  const handleSave = async () => {
    if (!formName.trim() || formPriceYearly <= 0) {
      alert("Mohon lengkapi nama paket dan harga tahunan");
      return;
    }

    if (formPriceYearly < 10_000_000) {
      alert("Harga tahunan paket dibatasi minimal Rp 10.000.000 (puluhan juta)");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token");
      const payload = {
        name: formName,
        price_monthly: Math.round(formPriceYearly / 12),
        price_yearly: formPriceYearly,
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
      } catch (_parseError) {
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
            <Package className="text-[#2e3749]" /> Paket Langganan
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Kelola tingkatan paket langganan untuk sekolah yang mendaftar. Data ini akan tampil di halaman Pricing Landing Page.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#FFD33B]/30 flex items-center gap-2"
        >
          <Plus size={16} /> Buat Paket Baru
        </button>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-400 dark:text-slate-500 animate-pulse">Memuat data paket...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center min-h-75 flex flex-col items-center justify-center gap-3">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-400 dark:text-slate-500 font-bold">Belum ada paket langganan</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-[#2e3749] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-sm font-bold transition-all"
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
                  ? "border-emerald-200 dark:border-emerald-800/60 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 opacity-70"
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
                    className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-[#2e3749] transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(plan.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Plan Name & Price */}
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-extrabold text-[#2e3749] dark:text-blue-500">{formatRupiahDisplay(plan.price_yearly)}</span>
                <span className="text-sm text-slate-400">/tahun</span>
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
                    ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
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
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur z-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingPlan ? "Edit Paket" : "Buat Paket Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nama Paket *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="contoh: STARTER, PRO INSTITUTION"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#FFD33B]/20 focus:border-[#FFD33B] outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Harga Tahunan *</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 dark:text-slate-400 select-none">
                        Rp
                    </span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={priceYearlyDisplay}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder="15.000.000 (Min. Rp 10.000.000)"
                        className={`w-full pl-12 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm font-semibold tracking-wide transition-all ${
                          formPriceYearly > 0 && formPriceYearly < 10_000_000
                            ? "border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                            : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#FFD33B]/20 focus:border-[#FFD33B]"
                        }`}
                    />
                </div>
                {formPriceYearly > 0 && formPriceYearly < 10_000_000 && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>Harga tahunan paket minimal Rp 10.000.000 (puluhan juta)</span>
                  </p>
                )}
                {formPriceYearly >= 10_000_000 && (
                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                    ≈ {formatRupiahDisplay(Math.round(formPriceYearly / 12))} / bulan
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Fitur (satu per baris)</label>
                <textarea
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder={"Subdomain (sekolah.cationgate.id)\n250 Active Learner Capacity\nAI Lesson Plan Generation (50/mo)\nEmail Support"}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#FFD33B]/20 focus:border-[#FFD33B] outline-none text-sm resize-none transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                {saving ? "Menyimpan..." : editingPlan ? "Simpan Perubahan" : "Buat Paket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
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
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-md shadow-red-500/20"
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
