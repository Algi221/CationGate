"use client";

import React from "react";
import { Download, RefreshCw, Pencil, Save, X, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { usePPDB } from "@/context/PPDBContext";
import { KuotaTabProps } from "./features/kuota/types";
import { useKuotaData } from "./features/kuota/hooks/useKuotaData";
import { exportKuotaToExcel } from "./features/kuota/utils/exportKuotaExcel";
import { KuotaTargetTable } from "./features/kuota/components/KuotaTargetTable";
import { KuotaDonutChart, KuotaOverallDonutChart } from "./features/kuota/components/KuotaDonutChart";

export type { KuotaTabProps };

export default function KuotaTab({ type = "pendaftar", variant = "default" }: KuotaTabProps) {
  const { schoolId, ppdbTitle, profilSekolah, schoolPeriod } = usePPDB();
  const {
    data,
    editMode,
    setEditMode,
    editingTargets,
    isSavingTargets,
    isExporting,
    setIsExporting,
    selectedPeriode,
    availablePeriodes,
    handlePeriodeChange,
    handleEditClick,
    handleTargetChange,
    saveTargets
  } = useKuotaData(schoolId);

  const schoolName = (
    profilSekolah?.identitas?.nama ||
    (ppdbTitle ? ppdbTitle.replace(/^(ppdb\s+)/i, "") : "") ||
    "SMK TARUNA BHAKTI DEPOK"
  ).toUpperCase();

  const handleExport = async () => {
    if (!data) return;
    try {
      setIsExporting(true);
      await exportKuotaToExcel(data, selectedPeriode, schoolName, schoolPeriod);
    } catch (err) {
      console.error(err);
      alert("Gagal mengekspor data kuota ke Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`w-full space-y-6 ${variant === "minimal" ? "" : "animate-in fade-in zoom-in-95 duration-300"}`}>
      {variant !== "minimal" && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-full">
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Data Kuota & Presentase</h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Rekapitulasi target dan pencapaian pendaftar</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Periode Selector */}
            <div className="w-48">
              <Select
                value={selectedPeriode || "ALL"}
                onValueChange={(val) => handlePeriodeChange(val === "ALL" ? "" : val)}
                disabled={editMode}
              >
                <SelectTrigger className="h-9.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <SelectValue placeholder="Semua Periode" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Periode</SelectItem>
                  {availablePeriodes.map((p) => (
                    <SelectItem key={p} value={p}>
                      TA {p.replace("-", "/")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Batal
                </button>
                <button
                  onClick={saveTargets}
                  disabled={isSavingTargets}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-70 cursor-pointer"
                >
                  {isSavingTargets ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Target
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="w-4 h-4" /> Edit Target Kuota
              </button>
            )}

            <button
              onClick={handleExport}
              disabled={isExporting || editMode}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm shadow-emerald-600/20 cursor-pointer"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? "Mengekspor..." : "Export Excel"}
            </button>
          </div>
        </div>
      )}

      {data && (
        <div className="flex justify-start w-full">
          {variant === "minimal" ? (
            <>
              {type === "keseluruhan" && <KuotaOverallDonutChart data={data} />}
              {type === "pendaftar" && (
                <KuotaDonutChart
                  title="PRESENTASE PEMBELIAN FORMULIR CALON PESERTA DIDIK"
                  rawItems={data.pendaftar}
                  totalJumlah={data.totalPendaftar}
                />
              )}
              {type === "siswa-aktif" && (
                <KuotaDonutChart
                  title="PRESENTASE FIX MASUK PESERTA DIDIK"
                  rawItems={data.siswaAktif}
                  totalJumlah={data.totalSiswaAktif}
                />
              )}
            </>
          ) : (
            <div className="w-full">
              {type === "pendaftar" && (
                <div className="flex flex-col xl:flex-row gap-6 w-full">
                  <div className="flex-1 min-w-0">
                    <KuotaTargetTable
                      title="PRESENTASE PEMBELIAN FORMULIR CALON PESERTA DIDIK"
                      items={data.pendaftar}
                      totalJumlah={data.totalPendaftar}
                      totalTarget={data.totalTarget}
                      selectedPeriode={selectedPeriode}
                      schoolName={schoolName}
                      schoolPeriod={schoolPeriod}
                      editMode={editMode}
                      editingTargets={editingTargets}
                      onTargetChange={handleTargetChange}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <KuotaTargetTable
                      title="PRESENTASE FIX MASUK PESERTA DIDIK"
                      items={data.siswaAktif}
                      totalJumlah={data.totalSiswaAktif}
                      totalTarget={data.totalTarget}
                      selectedPeriode={selectedPeriode}
                      schoolName={schoolName}
                      schoolPeriod={schoolPeriod}
                      editMode={editMode}
                      editingTargets={editingTargets}
                      onTargetChange={handleTargetChange}
                    />
                  </div>
                </div>
              )}
              {type === "siswa-aktif" && (
                <KuotaTargetTable
                  title="PRESENTASE FIX MASUK PESERTA DIDIK"
                  items={data.siswaAktif}
                  totalJumlah={data.totalSiswaAktif}
                  totalTarget={data.totalTarget}
                  selectedPeriode={selectedPeriode}
                  schoolName={schoolName}
                  schoolPeriod={schoolPeriod}
                  editMode={editMode}
                  editingTargets={editingTargets}
                  onTargetChange={handleTargetChange}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
