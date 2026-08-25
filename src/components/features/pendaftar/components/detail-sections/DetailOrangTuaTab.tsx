import React from "react";
import { User } from "lucide-react";
import { Applicant } from "../../types";

interface DetailOrangTuaTabProps {
  applicant: Applicant;
}

export const DetailOrangTuaTab: React.FC<DetailOrangTuaTabProps> = ({ applicant }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <User size={12} />
          </div>
          Data Ayah Kandung
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Nama Ayah</span>
            <span className="text-slate-800 dark:text-white font-black">{applicant.nama_ayah || applicant.namaAyah || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Pekerjaan</span>
            <span className="text-slate-800 dark:text-white font-bold">{applicant.pekerjaan_ayah || applicant.pekerjaanAyah || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Penghasilan</span>
            <span className="text-slate-800 dark:text-white font-bold">{applicant.penghasilan_ayah || applicant.penghasilanAyah || "-"}</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <User size={12} />
          </div>
          Data Ibu Kandung
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Nama Ibu</span>
            <span className="text-slate-800 dark:text-white font-black">{applicant.nama_ibu || applicant.namaIbu || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Pekerjaan</span>
            <span className="text-slate-800 dark:text-white font-bold">{applicant.pekerjaan_ibu || applicant.pekerjaanIbu || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Penghasilan</span>
            <span className="text-slate-800 dark:text-white font-bold">{applicant.penghasilan_ibu || applicant.penghasilanIbu || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Telepon Ortu</span>
            <span className="text-blue-600 dark:text-blue-400 font-mono font-black">{applicant.telepon_ortu || applicant.teleponOrtu || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
