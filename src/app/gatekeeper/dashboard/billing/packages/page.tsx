"use client";

import React, { useState, useEffect } from "react";
import { Plus, Box } from "lucide-react";
import Swal from "sweetalert2";
import {
  Plan,
  formatInputDisplay,
  parseRupiahInput,
  PackageCardItem,
  PackageEditModal,
} from "@/components/features/gatekeeper/packages";

export default function GatekeeperPackagesPage() {
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPriceYearly, setFormPriceYearly] = useState(0);
  const [priceYearlyDisplay, setPriceYearlyDisplay] = useState("");
  const [formFeatures, setFormFeatures] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("gatekeeper_token") ||
        localStorage.getItem("ppdb_admin_token");
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
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" },
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
    setFormFeatures(
      Array.isArray(plan.features) ? plan.features.join("\n") : "",
    );
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
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" },
      });
      return;
    }

    setSaving(true);
    try {
      const token =
        localStorage.getItem("gatekeeper_token") ||
        localStorage.getItem("ppdb_admin_token");
      const featuresArray = formFeatures
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const url = editingPlan
        ? `/api/gatekeeper/plans/${editingPlan.id}`
        : "/api/gatekeeper/plans";
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
          customClass: {
            popup: "rounded-3xl dark:bg-slate-900 dark:text-white",
          },
        });
      } else {
        Swal.fire({
          title: "Gagal Menyimpan",
          text: json.message || "Terjadi kesalahan saat menyimpan paket.",
          icon: "error",
          confirmButtonColor: "#DC2626",
          customClass: {
            popup: "rounded-3xl dark:bg-slate-900 dark:text-white",
          },
        });
      }
    } catch (_err) {
      Swal.fire({
        title: "Kesalahan Server",
        text: "Gagal menghubungi server API Gatekeeper.",
        icon: "error",
        confirmButtonColor: "#DC2626",
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" },
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (plan: Plan) => {
    try {
      const token =
        localStorage.getItem("gatekeeper_token") ||
        localStorage.getItem("ppdb_admin_token");
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
      customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token =
            localStorage.getItem("gatekeeper_token") ||
            localStorage.getItem("ppdb_admin_token");
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
              customClass: {
                popup: "rounded-3xl dark:bg-slate-900 dark:text-white",
              },
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 transition-colors animate-in fade-in duration-500">
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
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            Belum ada paket langganan terdaftar
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#FFD33B] text-[#2e3749] font-bold rounded-xl text-xs cursor-pointer"
          >
            Buat Paket Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <PackageCardItem
              key={plan.id}
              plan={plan}
              index={index}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggleActive={toggleActive}
            />
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT PLAN MODAL ────────────────────────────────────────── */}
      <PackageEditModal
        isOpen={showModal}
        mounted={mounted}
        editingPlan={editingPlan}
        formName={formName}
        setFormName={setFormName}
        priceYearlyDisplay={priceYearlyDisplay}
        handlePriceChange={handlePriceChange}
        formFeatures={formFeatures}
        setFormFeatures={setFormFeatures}
        formPriceYearly={formPriceYearly}
        saving={saving}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
