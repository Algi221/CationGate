"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Settings, DollarSign, Save } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";

export default function ConfigPage() {
  const { schoolId, adminToken, addToast } = usePPDB();
  const [regFee, setRegFee] = useState(0);
  const [initialRegFee, setInitialRegFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      if (!schoolId) return;
      const res = await fetch(`/api/config/registration_fee`, {
        headers: { "X-School-Id": schoolId },
      });
      const json = await res.json();
      if (json.success && json.data) {
        const fee = Number(json.data.config_value?.amount || 0);
        setRegFee(fee);
        setInitialRegFee(fee);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/config/registration_fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
          "X-School-Id": schoolId,
        },
        body: JSON.stringify({ amount: Number(regFee) }),
      });
      const json = await res.json();
      if (json.success) {
        addToast("Berhasil", "Biaya formulir berhasil diperbarui", "success");
        setInitialRegFee(regFee);
      } else {
        addToast("Gagal", json.message || "Gagal menyimpan", "danger");
      }
    } catch (_err) {
      addToast("Error", "Terjadi kesalahan", "danger");
    } finally {
      setSaving(false);
    }
  };

  const isDirty = regFee !== initialRegFee;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings size={20} /> Pengaturan PPDB
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="max-w-md">
          <h2 className="text-lg font-bold">Biaya Formulir Pendaftaran</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            Atur biaya yang harus dibayar oleh calon siswa saat mendaftar. Kosongkan atau isi dengan 0 jika gratis.
          </p>

          <div className="relative">
            <DollarSign
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="number"
              value={regFee}
              onChange={(e) => setRegFee(Number(e.target.value))}
              disabled={loading}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={!isDirty || saving || loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
