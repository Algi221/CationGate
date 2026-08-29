"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, CheckCircle2, Box, Sparkles, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

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
  if (num === 0) return "Gratis";
  return `Rp ${num.toLocaleString("id-ID")}`;
}

/** Parse "15.000.000" or "15000000" back to number */
function parseRupiahInput(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/** Format raw number to "15.000.000" display string for input */
function formatInputDisplay(num: number): string {
  if (num === 0) return "";
  return num.toLocaleString("id-ID");
}

export default function GatekeeperPackagesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);

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
        if (json.success && Array.isArray(json.data)) {
          // Limit to max 3 plans
          setPlans(json.data.slice(0, 3));
        }
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
    if (plans.length >= 3) {
      Swal.fire({
        title: "Batas Maksimal Paket",
        text: "Maksimal paket langganan dibatasi 3 paket untuk menjaga kesederhanaan pilihan instansi.",
        icon: "warning",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }
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
    setPriceYearlyDisplay(num > 0 ? formatInputDisplay(num) : "");
  };

  const handleSave = async () => {
    if (!formName.trim() || formPriceYearly < 0) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon lengkapi nama paket dan harga tahunan (minimal 0 untuk Free Trial).",
        icon: "warning",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token");
      const featuresArray = formFeatures
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const url = editingPlan ? `/api/gatekeeper/plans/${editingPlan.id}` : "/api/gatekeeper/plans";
      const method = editingPlan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formName,
          price_yearly: formPriceYearly,
          price_monthly: Math.round(formPriceYearly / 12),
          features: featuresArray,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchPlans();
        Swal.fire({
          title: "Paket Disimpan",
          text: `Paket ${formName} berhasil diperbarui.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
        });
      } else {
        Swal.fire({
          title: "Gagal Menyimpan",
          text: json.message || "Terjadi kesalahan saat menyimpan paket.",
          icon: "error",
          confirmButtonColor: "#DC2626",
          customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
        });
      }
    } catch (_err) {
      Swal.fire({
        title: "Kesalahan Server",
        text: "Gagal menghubungi server API Gatekeeper.",
        icon: "error",
        confirmButtonColor: "#DC2626",
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (plan: Plan) => {
    try {
      const token = localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/gatekeeper/plans/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !plan.is_active,
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (planId: number, planName: string) => {
    Swal.fire({
      title: `Hapus Paket ${planName}?`,
      text: "Paket ini akan dihapus dari daftar penawaran SaaS CationGate.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token");
          const res = await fetch(`/api/gatekeeper/plans/${planId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json();
          if (json.success) {
            fetchPlans();
            Swal.fire({
              title: "Dihapus",
              text: "Paket berhasil dihapus.",
              icon: "success",
              confirmButtonColor: "#2563EB",
              customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 transition-colors duration-300">
      {/* Header Top Section */}
      <div className="bg-white dark:bg-[#2e3749] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Box className="w-6 h-6 text-[#2e3749] dark:text-[#FFD33B]" />
              Manajemen Paket SaaS
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-[#FFD33B]/15 dark:bg-[#FFD33B]/20 text-[#2e3749] dark:text-[#FFD33B] text-xs font-mono font-bold border border-[#FFD33B]/30">
              {plans.length}/3 Paket
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-1">
            Kelola tingkatan paket langganan untuk sekolah yang mendaftar. Dibatasi maksimal 3 paket aktif.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={plans.length >= 3}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
            plans.length >= 3
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700 shadow-none"
              : "bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] shadow-[#FFD33B]/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          }`}
        >
          <Plus size={16} />
          {plans.length >= 3 ? "Batas 3 Paket Tercapai" : "Buat Paket Baru"}
        </button>
      </div>

      {/* ── 3-COLUMN PRODUCT PACKS GRID ────────────────────────────────────────── */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-16 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-400 dark:text-slate-500 font-mono text-sm font-bold animate-pulse">
            Memuat data paket langganan CationGate...
          </p>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-16 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-3">
          <Box className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Belum ada paket langganan terdaftar</p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#FFD33B] text-[#2e3749] font-bold rounded-xl text-xs"
          >
            Buat Paket Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isCard1 = index === 0;
            const isCard2 = index === 1;
            const _isCard3 = index === 2;

            if (isCard1) {
              // ── CARD 1: AMBER / WARM YELLOW CARD (PRODUCT PACKS STYLE) ──
              return (
                <div
                  key={plan.id}
                  className={`bg-amber-300 dark:bg-[#EAB844] text-neutral-950 rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-200 border-2 ${
                    plan.is_active ? "border-amber-400/80" : "border-neutral-400 opacity-75"
                  }`}
                >
                  {/* Top Header & Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-black/10 text-black text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-black/10">
                        {plan.is_active ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                            Aktif
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                            Nonaktif
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="p-2 hover:bg-black/10 rounded-xl text-black transition-colors"
                          title="Edit Paket"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id, plan.name)}
                          className="p-2 hover:bg-rose-500/20 rounded-xl text-rose-800 transition-colors"
                          title="Hapus Paket"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-black" />
                        {plan.name}
                      </h3>
                      <p className="text-neutral-800 text-xs font-semibold leading-relaxed">
                        Uji coba &amp; pengenalan sistem PPDB online untuk sekolah pendaftar baru.
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1 my-6">
                      <span className="text-4xl md:text-5xl font-black tracking-tight">
                        {plan.price_yearly === 0 ? "Free" : formatRupiahDisplay(plan.price_yearly)}
                      </span>
                      <span className="text-xs font-bold text-neutral-700">
                        {plan.price_yearly === 0 ? "Tanpa biaya tersembunyi selama masa uji coba." : "/tahun lisensi penuh"}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-6 border-t border-black/10 text-xs font-medium">
                      {(Array.isArray(plan.features) ? plan.features : []).map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-neutral-900 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />
                            <span>{item}</span>
                          </div>
                          <span className="text-[11px] font-mono font-black text-neutral-800 shrink-0">Tersedia</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Active Button */}
                  <Button
                    onClick={() => toggleActive(plan)}
                    variant="outline"
                    className="w-full h-12 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold border-2 border-black transition-all duration-100 shadow-[4px_4px_rgb(0_0_0)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    {plan.is_active ? "Nonaktifkan Paket" : "Aktifkan Paket"}
                  </Button>
                </div>
              );
            }

            if (isCard2) {
              // ── CARD 2: DEEP DARK / ENTERPRISE PRODUCT PACKS STYLE ──
              return (
                <div
                  key={plan.id}
                  className={`bg-neutral-950 dark:bg-[#151D2A] text-white rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-2xl space-y-6 relative overflow-hidden ring-2 ring-[#FFD33B]/40 transition-all duration-200 border border-white/10`}
                >
                  {/* Top Popular Glow Pill */}
                  <div className="absolute top-0 right-8 px-4 py-1 rounded-b-xl bg-[#FFD33B] text-black font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Crown size={12} /> Paling Populer
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        {plan.is_active ? "Aktif" : "Nonaktif"}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="p-2 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-colors"
                          title="Edit Paket"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id, plan.name)}
                          className="p-2 hover:bg-rose-500/20 rounded-xl text-rose-400 transition-colors"
                          title="Hapus Paket"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Box className="w-6 h-6 text-[#FFD33B]" />
                        {plan.name}
                      </h3>
                      <p className="text-neutral-400 text-xs font-semibold leading-relaxed">
                        Akses penuh seluruh fitur platform, multi-admin, export data, dan support 24/7.
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1 my-6">
                      <span className="text-4xl md:text-5xl font-black tracking-tight text-[#FFD33B]">
                        {formatRupiahDisplay(plan.price_yearly)}
                      </span>
                      <span className="text-xs font-medium text-neutral-400">
                        /tahun lisensi sekolah lengkap.
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-6 border-t border-neutral-800 text-xs font-medium">
                      {(Array.isArray(plan.features) ? plan.features : []).map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-white font-bold">
                            <CheckCircle2 className="w-4 h-4 text-[#FFD33B] shrink-0" />
                            <span>{item}</span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-neutral-400 shrink-0">Included</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Active Button */}
                  <Button
                    onClick={() => toggleActive(plan)}
                    variant="outline"
                    className="w-full h-12 rounded-2xl bg-[#FFD33B] hover:bg-[#F3C625] text-black font-black border-2 border-black transition-all duration-100 shadow-[4px_4px_rgb(255_210_48)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    {plan.is_active ? "Nonaktifkan Paket" : "Aktifkan Paket"}
                  </Button>
                </div>
              );
            }

            // ── CARD 3: SLEEK ENTERPRISE / CLEAN CARD (PRODUCT PACKS STYLE) ──
            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-[#1A2230] text-slate-900 dark:text-white rounded-4xl p-8 md:p-9 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-200 border-2 border-slate-200 dark:border-slate-800`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-blue-200 dark:border-blue-700/50">
                      <Shield size={13} /> {plan.is_active ? "Aktif" : "Nonaktif"}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
                        title="Edit Paket"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id, plan.name)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-rose-600 transition-colors"
                        title="Hapus Paket"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                      <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      {plan.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                      Kustomisasi penuh untuk yayasan sekolah besar &amp; multi-kampus.
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1 my-6">
                    <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                      {formatRupiahDisplay(plan.price_yearly)}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      /tahun paket kustom instansi.
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
                    {(Array.isArray(plan.features) ? plan.features : []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">Enterprise</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggle Active Button */}
                <Button
                  onClick={() => toggleActive(plan)}
                  variant="outline"
                  className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black border-2 border-slate-900 dark:border-white transition-all duration-100 shadow-[4px_4px_rgb(15_23_42)] dark:shadow-[4px_4px_rgb(255_255_255/20%)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  {plan.is_active ? "Nonaktifkan Paket" : "Aktifkan Paket"}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CREATE / EDIT PLAN MODAL ────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1e2533] rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-white/10">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#1e2533]/95 backdrop-blur z-10">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingPlan ? "Edit Paket SaaS" : "Buat Paket SaaS Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Paket *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="contoh: FREE TRIAL, PRO TAHUNAN, ENTERPRISE"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-bold outline-none focus:border-[#FFD33B] focus:ring-2 focus:ring-[#FFD33B]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Harga Tahunan *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 dark:text-slate-400 select-none">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceYearlyDisplay}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="1.200.000 (atau 0 untuk Free Trial)"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-xs font-mono font-bold transition-all focus:ring-2 focus:ring-[#FFD33B]/20 focus:border-[#FFD33B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Daftar Fitur Paket (1 per baris)
                </label>
                <textarea
                  rows={6}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder={`Mendapatkan subdomain\nLanding page sekolah\nProfil sekolah\nExport & import excel data siswa aktif\nMasa aktif 30 hari\nBelum bisa membuka SPMB`}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-medium outline-none focus:border-[#FFD33B] focus:ring-2 focus:ring-[#FFD33B]/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || (formPriceYearly > 0 && formPriceYearly < 10_000_000)}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] shadow-md shadow-[#FFD33B]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Menyimpan..." : "Simpan Paket"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
