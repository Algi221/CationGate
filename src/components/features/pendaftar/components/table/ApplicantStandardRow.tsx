"use client";

import React from "react";
import { 
  Eye, 
  Pencil, 
  Check, 
  X, 
  Trash2, 
  CreditCard, 
  Banknote, 
  FileImage 
} from "lucide-react";
import Swal from "sweetalert2";
import { Applicant } from "../../types";
import { formatNoPendaftaran } from "../DetailModal";

interface ApplicantStandardRowProps {
  applicant: Applicant;
  idx: number;
  currentTime: number | null;
  onViewDetail: (applicant: Applicant) => void;
  onOpenEdit: (applicant: Applicant) => void;
  onVerify: (id: number) => void;
  onOpenReject: (id: number) => void;
  onDelete: (id: number) => void;
  onTogglePhysicalDoc: (applicant: Applicant) => Promise<void>;
  onOpenReceipt: (applicant: Applicant) => void;
}

export const ApplicantStandardRow: React.FC<ApplicantStandardRowProps> = ({
  applicant: a,
  idx,
  currentTime,
  onViewDetail,
  onOpenEdit,
  onVerify,
  onOpenReject,
  onDelete,
  onTogglePhysicalDoc,
  onOpenReceipt
}) => {
  const getRemainingCashTime = (createdDate?: string) => {
    if (!createdDate) return { isExpired: false, text: "24 Jam" };
    try {
      const created = new Date(createdDate).getTime();
      if (isNaN(created)) return { isExpired: false, text: "24 Jam" };
      const now = currentTime ?? 0;
      if (!now) return { isExpired: false, text: "24 Jam" };
      const diffMs = 24 * 60 * 60 * 1000 - (now - created);
      if (diffMs <= 0) {
        return { isExpired: true, text: "Lewat 24 Jam" };
      }
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { isExpired: false, text: `Sisa ${hours}j ${mins}m` };
    } catch (_) {
      return { isExpired: false, text: "24 Jam" };
    }
  };

  const isCashTU = 
    a.metode_pembayaran === "Bayar Tunai di TU (Cash)" ||
    a.metode_pembayaran === "Tunai di TU" ||
    a.metode_pembayaran === "tu";
  const isLunas = a.status_pembayaran === "LUNAS" || a.status_pembayaran === "PAID" || a.status === "Approved";
  const cashTime = getRemainingCashTime(a.tgl_daftar || a.createdAt);

  return (
    <tr
      key={a.id || idx}
      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group cursor-pointer"
      onDoubleClick={() => onViewDetail(a)}
    >
      <td className="py-4 px-6 pl-8">
        <div className="font-extrabold text-blue-600 dark:text-blue-400 text-sm font-mono">
          {a.registration_no || formatNoPendaftaran(a.periode, a.id)}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="font-extrabold text-slate-800 dark:text-white text-sm">{a.nama}</div>
        <span className="text-[9px] text-slate-400 font-bold tracking-wide uppercase mt-0.5 block">
          Daftar: {(a.tgl_daftar || a.createdAt) ? new Date(a.tgl_daftar || a.createdAt).toLocaleDateString("id-ID") : "-"} · {a.gelombang || "Gelombang 1"} · Lahir: {a.tempat_lahir || a.tempatLahir || "-"}, {a.tgl_lahir || a.tglLahir || "-"}
          {a.status === "Approved" && a.verified_by && ` · Diverifikasi: ${a.verified_by}`}
          {a.status === "Rejected" && a.rejected_by && ` · Digugurkan: ${a.rejected_by}`}
        </span>
      </td>
      <td className="py-4 px-6 text-center">
        {(a.jenis_kelamin || a.jenisKelamin) ? (
          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
            (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
              : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
          }`}>
            {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-semibold">
        <div>{a.pindahan_dari || a.sekolah_asal || a.sekolahAsal}</div>
        {a.alasan_pindah && (
          <span
            className="text-[9px] text-slate-400 font-normal block truncate max-w-55"
            title={a.alasan_pindah}
          >
            {a.alasan_pindah}
          </span>
        )}
      </td>
      <td className="py-4 px-6">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 font-bold text-[10px] uppercase tracking-tight whitespace-nowrap">
          {a.jurusan_1 || a.jurusan1 || "-"}
        </span>
      </td>
      <td className="py-4 px-6 text-center">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
            a.status === "Approved"
              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
              : a.status === "Rejected"
                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                : "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
          }`}
        >
          {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
        </span>
      </td>

      {/* Biaya Formulir Column */}
      <td className="py-4 px-6 text-center">
        {isLunas ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 shadow-2xs">
            LUNAS {isCashTU ? "(Tunai)" : "(Transfer)"}
          </span>
        ) : isCashTU ? (
          <div className="flex flex-col items-center gap-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
              cashTime.isExpired 
                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300"
            }`}>
              <Banknote size={11} />
              <span>{cashTime.isExpired ? "kadaluarsa 24 jam" : `🏢 ${cashTime.text}`}</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenReceipt(a);
              }}
              className="text-[9px] font-black text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              Loket Kasir TU
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300">
              <CreditCard size={11} />
              <span>Transfer</span>
            </span>
            {a.bukti_bayar ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReceipt(a);
                }}
                className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <FileImage size={11} /> Lihat Struk
              </button>
            ) : (
              <span className="text-[9px] text-slate-400 font-bold">Belum Ada Struk</span>
            )}
          </div>
        )}
      </td>

      <td className="py-4 px-6 text-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePhysicalDoc(a);
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-wider cursor-pointer transition-all ${
            a.physical_doc_verified
              ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-400 hover:bg-emerald-100"
              : "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400 hover:bg-rose-100"
          }`}
          title={a.physical_doc_verified ? `Diverifikasi oleh ${a.physical_doc_verified_by || 'Admin'} - Klik untuk batalkan` : "Klik jika Berkas Fisik siswa sudah diterima di sekolah"}
        >
          {a.physical_doc_verified ? "Diterima" : "Belum Ada"}
        </button>
      </td>

      <td className="py-4 px-6 text-right pr-8 shrink-0">
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onViewDetail(a)}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all border border-slate-200 dark:border-slate-800/50 cursor-pointer"
            title="Lihat Detail Form"
          >
            <Eye size={13} />
          </button>

          <button
            type="button"
            onClick={() => onOpenEdit(a)}
            className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl transition-all border border-blue-200/50 dark:border-blue-500/20 cursor-pointer"
            title="Edit Data Pendaftar"
          >
            <Pencil size={13} />
          </button>

          {a.status !== "Approved" && (
            <button
              type="button"
              onClick={() => onVerify(a.id)}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl transition-all border border-emerald-200 dark:border-emerald-500/20 cursor-pointer"
              title="Setujui & Verifikasi"
            >
              <Check size={13} />
            </button>
          )}

          {a.status !== "Rejected" && (
            <button
              type="button"
              onClick={() => onOpenReject(a.id)}
              className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl transition-all border border-rose-200 dark:border-rose-500/20 cursor-pointer"
              title="Tolak Pendaftaran"
            >
              <X size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={async () => {
              const result = await Swal.fire({
                title: 'Konfirmasi',
                text: "Apakah Anda yakin ingin memindahkan data pendaftar ini ke tempat sampah?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                cancelButtonText: 'Batal'
              });
              if (result.isConfirmed) {
                onDelete(a.id);
              }
            }}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 rounded-xl transition-all border border-slate-200 dark:border-slate-800/50 hover:border-rose-500/25 cursor-pointer"
            title="Pindahkan ke Tempat Sampah"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};
