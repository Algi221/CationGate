import React from "react";
import Image from "next/image";
import { FileCheck, Check } from "lucide-react";
import { Applicant } from "../../types";
import { sanitizeSrc } from "./sanitizeUrl";

interface DetailBerkasTabProps {
  applicant: Applicant;
  onChecklistChange: (applicantId: number, newChecklist: Record<string, boolean>) => Promise<void>;
  onOpenFullscreenImage: () => void;
}

export const DetailBerkasTab: React.FC<DetailBerkasTabProps> = ({
  applicant,
  onChecklistChange,
  onOpenFullscreenImage
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
        <FileCheck size={12} className="text-blue-500" /> Status Verifikasi Berkas Fisik
      </h4>
      <div className="p-6 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-3xl flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="space-y-1">
            <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Check size={12} />
              </div>
              Checklist Berkas Fisik
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Tandai dokumen yang telah diserahkan secara fisik ke sekolah.</p>
            {applicant.physical_doc_verified && applicant.physical_doc_verified_by && (
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                ✓ Diverifikasi oleh admin {applicant.physical_doc_verified_by}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              applicant.physical_doc_verified
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
            }`}>
              {applicant.physical_doc_verified ? "Lengkap & Valid" : "Belum Lengkap"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'kk', label: 'Fotokopi Kartu Keluarga (KK)' },
            { id: 'ktp_ortu', label: 'Fotokopi KTP Orang Tua (Ayah & Ibu)' },
            { id: 'akta', label: 'Akta Kelahiran asli & 1 Fotokopi' },
            { id: 'ijazah', label: 'Fotokopi Ijazah / SKL legalisir' },
            { id: 'pas_foto', label: 'Pas foto berwarna 3x4 (3 lembar)' },
            { id: 'bukti_bayar', label: 'Bukti Pembayaran Pendaftaran' }
          ].map(doc => {
            const isChecked = applicant.physical_docs_checklist?.[doc.id] || false;
            return (
              <button
                key={doc.id}
                onClick={() => {
                  const currentChecklist = applicant.physical_docs_checklist || {};
                  const newChecklist = { ...currentChecklist, [doc.id]: !isChecked };
                  onChecklistChange(applicant.id, newChecklist);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isChecked 
                    ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50" 
                    : "bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-400/50"
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                  isChecked ? "bg-emerald-500 border-emerald-600 text-white" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                }`}>
                  {isChecked && <Check size={12} strokeWidth={3} />}
                </div>
                <span className={`text-xs font-bold leading-tight ${isChecked ? "text-emerald-900 dark:text-emerald-100" : "text-slate-600 dark:text-slate-400"}`}>
                  {doc.label}
                </span>
              </button>
            );
          })}
        </div>

        {applicant.bukti_bayar && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Foto / Bukti Transfer:</span>
            <div
              onClick={onOpenFullscreenImage}
              className="cursor-pointer inline-block border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:opacity-90 transition"
            >
              <Image
                src={sanitizeSrc(applicant.bukti_bayar)}
                alt="Bukti Transfer"
                width={200}
                height={150}
                className="object-cover h-32 w-48"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
