"use client";

import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface RejectModalProps {
  rejectingApplicantId: number | null;
  rejectionPreset: string;
  setRejectionPreset: (val: string) => void;
  rejectionNotes: string;
  setRejectionNotes: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  rejectingApplicantId,
  rejectionPreset,
  setRejectionPreset,
  rejectionNotes,
  setRejectionNotes,
  onClose,
  onConfirm
}) => {
  if (!rejectingApplicantId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <div className="space-y-2">
          <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Tolak Pendaftaran</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Silakan masukkan alasan mengapa pendaftaran calon siswa ini ditolak. Alasan ini akan langsung ditampilkan kepada calon siswa di halaman beranda.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              Alasan Penolakan (Wajib Pilih)
            </label>
            <Select value={rejectionPreset} onValueChange={(val) => setRejectionPreset(val)}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-[#020617]/40 border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white">
                <SelectValue placeholder="-- Pilih Alasan Penolakan --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dokumen atau berkas tidak lengkap">Dokumen atau berkas tidak lengkap</SelectItem>
                <SelectItem value="Dokumen atau data identitas tidak valid">Dokumen atau data identitas tidak valid</SelectItem>
                <SelectItem value="Nilai/hasil seleksi belum memenuhi syarat">Nilai/hasil seleksi belum memenuhi syarat</SelectItem>
                <SelectItem value="Kuota program keahlian sudah penuh">Kuota program keahlian sudah penuh</SelectItem>
                <SelectItem value="Tidak memenuhi ketentuan jalur pendaftaran">Tidak memenuhi ketentuan jalur pendaftaran</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="rejection-reason" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              id="rejection-reason"
              rows={2}
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Contoh: Scan rapor semester 4 belum diunggah..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold resize-none"
            />
          </div>
        </div>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all border border-slate-205 dark:border-slate-700 cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!rejectionPreset}
            onClick={onConfirm}
            className="flex-1 py-3.5 bg-linear-to-tr from-rose-600 to-red-500 hover:brightness-110 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow shadow-rose-500/20 transition-all cursor-pointer text-center"
          >
            Tolak Siswa
          </button>
        </div>
      </div>
    </div>
  );
};
