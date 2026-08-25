import React from "react";
import { HelpCircle, Layers } from "lucide-react";
import { Applicant } from "../../types";
import { sanitizeUrl } from "./sanitizeUrl";

interface DetailBantuanTabProps {
  applicant: Applicant;
}

export const DetailBantuanTab: React.FC<DetailBantuanTabProps> = ({ applicant }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
            <HelpCircle size={12} />
          </div>
          Jaminan Sosial / Bantuan
        </h4>
        <div className="flex flex-col gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.punya_kps || applicant.punyaKps || "Tidak"} {applicant.no_kps || applicant.noKps ? `(No: ${applicant.no_kps || applicant.noKps})` : ""}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.punya_kip || applicant.punyaKip || "Tidak"} {applicant.no_kip || applicant.noKip ? `(No: ${applicant.no_kip || applicant.noKip})` : ""}</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Layers size={12} />
          </div>
          Beasiswa & Prestasi
        </h4>
        <div className="flex flex-col gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Prestasi</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{String(Array.isArray(applicant.jenis_prestasi) ? applicant.jenis_prestasi.join(", ") : (applicant.jenis_prestasi || applicant.jenisPrestasi || "Tidak Ada"))}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tingkat Prestasi</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{String(Array.isArray(applicant.tingkat_prestasi) ? applicant.tingkat_prestasi.join(", ") : (applicant.tingkat_prestasi || applicant.tingkatPrestasi || "Tidak Ada"))}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{String(applicant.uraian_prestasi || applicant.uraianPrestasi || "Tidak Ada")}</span>
          </div>
          {applicant.berkas_prestasi && (
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Berkas Prestasi</span>
              <a href={sanitizeUrl(typeof applicant.berkas_prestasi === "string" ? applicant.berkas_prestasi : undefined)} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-bold text-xs">Lihat Berkas</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
