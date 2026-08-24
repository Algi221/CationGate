import React from "react";
import { Calendar, Heart } from "lucide-react";
import { Applicant } from "../../types";

interface DetailPeriodikTabProps {
  applicant: Applicant;
}

export const DetailPeriodikTab: React.FC<DetailPeriodikTabProps> = ({ applicant }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Calendar size={12} />
          </div>
          Data Fisik & Periodik
        </h4>
        <div className="flex flex-col gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.tinggi_badan || applicant.tinggiBadan || "-"} cm / {applicant.berat_badan || applicant.beratBadan || "-"} kg</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.jarak_sekolah || applicant.jarakSekolah || "-"} km</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.waktu_jam || applicant.waktuJam || 0} Jam {applicant.waktu_menit || applicant.waktuMenit || 0} Menit</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.jumlah_saudara || applicant.jumlahSaudara || 0} orang</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Heart size={12} />
          </div>
          Kondisi Kesehatan
        </h4>
        <div className="flex flex-col gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span>
            <span className="text-rose-600 dark:text-rose-400 font-black text-xs uppercase">{applicant.golongan_darah || applicant.golonganDarah || "-"}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.penyakit_diderita || applicant.penyakitDiderita || "Tidak Ada"}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-2 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(applicant.kebutuhan_khusus) ? applicant.kebutuhan_khusus.map((k, idx) => (
                <span key={idx} className="bg-slate-100 dark:bg-[#1e293b] text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase shadow-sm">{k}</span>
              )) : <span className="text-slate-400 italic font-semibold">Tidak Ada</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
