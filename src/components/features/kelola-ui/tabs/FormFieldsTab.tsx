"use client";

import React from "react";
import { Info, FileText } from "lucide-react";
import { FieldConfigItem } from "../types";
import { DEFAULT_FIELDS_CONFIG_UI, formatRupiah } from "../defaultData";

interface FormFieldsTabProps {
  formFee: string;
  setFormFee: (val: string) => void;
  formGuideline: string;
  setFormGuideline: (val: string) => void;
  fieldsConfigUI: Record<string, FieldConfigItem>;
  setFieldsConfigUI: React.Dispatch<React.SetStateAction<Record<string, FieldConfigItem>>>;
}

export const FormFieldsTab: React.FC<FormFieldsTabProps> = ({
  formFee,
  setFormFee,
  formGuideline,
  setFormGuideline,
  fieldsConfigUI,
  setFieldsConfigUI
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
          <Info size={16} className="text-blue-500" />
          <span>Panduan Pengisian Formulir &amp; Biaya</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            Biaya Formulir Pendaftaran (Rupiah)
          </label>
          <input
            type="text"
            value={formatRupiah(formFee)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setFormFee(raw);
            }}
            placeholder="Contoh: Rp 250.000"
            className="w-full max-w-sm px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            Petunjuk / Panduan Registrasi (Form Wizard)
          </label>
          <textarea
            value={formGuideline}
            onChange={(e) => setFormGuideline(e.target.value)}
            rows={5}
            placeholder="Tuliskan catatan panduan yang akan tampil diatas form pengisian wizard..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none focus:border-blue-500 resize-y"
          />
        </div>
      </div>

      {/* ── Konfigurasi Field Form Pendaftaran */}
      <div className="border-t border-slate-100 dark:border-white/5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-indigo-500" />
              <span>Konfigurasi Field Form Pendaftaran</span>
            </h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Atur field mana yang aktif dan apakah wajib diisi atau opsional
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFieldsConfigUI(DEFAULT_FIELDS_CONFIG_UI)}
            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-900 transition-all cursor-pointer"
          >
            Reset Default
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#020617]/60 border-b border-slate-200 dark:border-white/5">
                <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400">Field / Kolom</th>
                <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400 text-center">Aktif</th>
                <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-slate-500 dark:text-slate-400 text-center">Wajib Diisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {Object.entries(fieldsConfigUI).map(([key, cfg]) => (
                <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white text-xs">{cfg.label}</span>
                      <span className="ml-2 text-[9px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">{key}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => setFieldsConfigUI(prev => ({ ...prev, [key]: { ...prev[key], active: !prev[key].active } }))}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${
                        cfg.active ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      title={cfg.active ? 'Nonaktifkan field' : 'Aktifkan field'}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-[#0f172a] shadow transition-all duration-200 ${
                        cfg.active ? 'left-4.5' : 'left-0.5'
                      }`} />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      disabled={!cfg.active}
                      onClick={() => setFieldsConfigUI(prev => ({ ...prev, [key]: { ...prev[key], required: !prev[key].required } }))}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                        cfg.required && cfg.active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      title={cfg.required ? 'Jadikan opsional' : 'Jadikan wajib'}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-[#0f172a] shadow transition-all duration-200 ${
                        cfg.required && cfg.active ? 'left-4.5' : 'left-0.5'
                      }`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
