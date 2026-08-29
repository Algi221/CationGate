import React from "react";
import { KuotaItem } from "../types";

interface KuotaTargetTableProps {
  title: string;
  items: KuotaItem[];
  totalJumlah: number;
  totalTarget: number;
  selectedPeriode: string;
  schoolName?: string;
  schoolPeriod?: string;
  variant?: "default" | "minimal";
  editMode: boolean;
  editingTargets: Record<string, number>;
  onTargetChange: (key: string, value: string) => void;
}

export const KuotaTargetTable: React.FC<KuotaTargetTableProps> = ({
  title,
  items,
  totalJumlah,
  totalTarget,
  selectedPeriode,
  schoolName = "SMK TARUNA BHAKTI DEPOK",
  schoolPeriod = "2026-2027",
  variant = "default",
  editMode,
  editingTargets,
  onTargetChange
}) => {
  const periodeToUse = selectedPeriode && selectedPeriode !== "ALL"
    ? selectedPeriode
    : (schoolPeriod || "2026-2027");

  const tahunAjaranDisplay = `TAHUN AJARAN ${periodeToUse.replace("-", "/")}`;

  const totalTargetEditing = Object.values(editingTargets).reduce((acc, val) => acc + (val || 0), 0);

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm ${variant === "minimal" ? "p-4" : ""}`}>
      <div className={`text-center ${variant === "minimal" ? "pb-4" : "p-6 border-b border-slate-200 dark:border-white/10"}`}>
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">{title}</h3>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">{schoolName}</p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{tahunAjaranDisplay}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-semibold">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-b border-slate-200 dark:border-white/10">
              <th className="p-4 border-r border-slate-200 dark:border-white/10 text-center w-12">NO</th>
              <th className="p-4 border-r border-slate-200 dark:border-white/10">KONSENTRASI KEAHLIAN</th>
              <th className="p-4 border-r border-slate-200 dark:border-white/10 text-center w-24">JUMLAH</th>
              <th className="p-4 border-r border-slate-200 dark:border-white/10 text-center w-32">TARGET</th>
              <th className="p-4 text-center w-24">PRESENTASE</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                <td colSpan={5} className="p-8 text-center text-xs font-normal">
                  Belum ada program keahlian yang terdaftar. Tambahkan jurusan melalui menu <strong className="font-semibold text-blue-600 dark:text-blue-400">Kelola UI/Data &gt; Program Keahlian (Jurusan)</strong>.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.no} className="border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300">
                  <td className="p-4 border-r border-slate-200 dark:border-white/10 text-center">{item.no}</td>
                  <td className="p-4 border-r border-slate-200 dark:border-white/10">{item.konsentrasi_keahlian}</td>
                  <td className="p-4 border-r border-slate-200 dark:border-white/10 text-center">{item.jumlah}</td>
                  <td className="p-4 border-r border-slate-200 dark:border-white/10 text-center">
                    {editMode && item.key !== "Belum Memilih" ? (
                      <input 
                        type="number" 
                        value={editingTargets[item.key] ?? 0} 
                        onChange={(e) => onTargetChange(item.key, e.target.value)}
                        className="w-full text-center py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600"
                        min="0"
                      />
                    ) : (
                      item.target
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editMode && item.key !== "Belum Memilih"
                      ? (editingTargets[item.key] > 0
                          ? `${Math.round((item.jumlah / editingTargets[item.key]) * 100)}%`
                          : "0%")
                      : (item.target > 0 ? item.presentase : "0%")}
                  </td>
                </tr>
              ))
            )}
            <tr className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 font-bold">
              <td colSpan={2} className="p-4 border-r border-amber-200 dark:border-amber-900/50 text-center uppercase">TOTAL KESELURUHAN</td>
              <td className="p-4 border-r border-amber-200 dark:border-amber-900/50 text-center">{totalJumlah}</td>
              <td className="p-4 border-r border-amber-200 dark:border-amber-900/50 text-center">{editMode ? totalTargetEditing : totalTarget}</td>
              <td className="p-4 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
