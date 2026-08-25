import React from "react";
import { User, Info } from "lucide-react";
import { Applicant } from "../../types";

interface DetailBiodataTabProps {
  applicant: Applicant;
}

export const DetailBiodataTab: React.FC<DetailBiodataTabProps> = ({ applicant }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <User size={12} />
          </div>
          Identitas Diri
        </h4>
        <div className="flex flex-col gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
            <span className="text-slate-800 dark:text-white text-sm font-black">{applicant.nama}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">NISN / NIK</span>
            <span className="text-slate-800 dark:text-white font-mono font-bold text-xs">{applicant.nisn} / {applicant.nik || "-"}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tempat, Tanggal Lahir</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.tempat_lahir || applicant.tempatLahir}, {applicant.tgl_lahir || applicant.tglLahir}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Kelamin / Agama</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.jenis_kelamin || applicant.jenisKelamin} / {applicant.agama}</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Info size={12} />
          </div>
          Alamat & Kontak
        </h4>
        <div className="flex flex-col gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">WhatsApp / Email</span>
            <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-black">{applicant.whatsapp} / {applicant.email}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Alamat Tempat Tinggal</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.alamat} (RT/RW {applicant.rt_rw || applicant.rtRw})</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Kelurahan / Kecamatan</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.kelurahan} / {applicant.kecamatan}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
            <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggal Dengan / Transportasi</span>
            <span className="text-slate-800 dark:text-white font-bold text-xs">{applicant.tinggal_dengan || applicant.tinggalDengan} / {applicant.transportasi}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
