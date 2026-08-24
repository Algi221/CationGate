import React from "react";
import { School, Layers } from "lucide-react";
import { Applicant } from "../../types";

interface DetailAkademikTabProps {
  applicant: Applicant;
}

export const DetailAkademikTab: React.FC<DetailAkademikTabProps> = ({ applicant }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <School size={12} />
          </div>
          Pendidikan Sebelumnya
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Asal Sekolah</span>
            <span className="text-slate-800 dark:text-white font-black uppercase">{applicant.sekolah_asal || applicant.sekolahAsal || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Tahun Lulus</span>
            <span className="text-slate-800 dark:text-white font-mono">{applicant.tgl_lulus || applicant.tglLulus || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKL</span>
            <span className="text-slate-800 dark:text-white font-mono">{applicant.no_ijazah || applicant.noIjazah || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">No. SKHUN</span>
            <span className="text-slate-800 dark:text-white font-mono">{applicant.no_skhun || applicant.noSkhun || "-"}</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Layers size={12} />
          </div>
          Pilihan Minat & Bakat
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Jurusan Pilihan</span>
            <span className="text-blue-600 dark:text-blue-400 font-black uppercase">{applicant.jurusan_1 || applicant.jurusan1 || "PPLG"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Cita - Cita</span>
            <span className="text-slate-800 dark:text-white font-bold">{applicant.cita_cita || applicant.citaCita || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.alasan_memilih || applicant.alasanMemilih || "Ingin belajar IT"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
