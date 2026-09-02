"use client";

import React from "react";
import { 
  Eye, 
  Pencil, 
  Check, 
  X, 
  Trash2 
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
    if (!createdDate) return { isExpired: false, text: "Sisa 24 Jam" };
    try {
      const created = new Date(createdDate).getTime();
      if (isNaN(created)) return { isExpired: false, text: "Sisa 24 Jam" };
      const now = currentTime ?? 0;
      if (!now) return { isExpired: false, text: "Sisa 24 Jam" };
      const diffMs = 24 * 60 * 60 * 1000 - (now - created);
      if (diffMs <= 0) {
        return { isExpired: true, text: "Kadaluarsa" };
      }
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { isExpired: false, text: `Sisa ${hours}j ${mins}m` };
    } catch (_) {
      return { isExpired: false, text: "Sisa 24 Jam" };
    }
  };

  const isCashTU = 
    a.metode_pembayaran === "Bayar Tunai di TU (Cash)" ||
    a.metode_pembayaran === "Tunai di TU" ||
    a.metode_pembayaran === "tu";
  const isLunas = a.status_pembayaran === "LUNAS" || a.status_pembayaran === "PAID" || a.status === "Approved" || a.status === "Terverifikasi" || a.payment_status === "LUNAS" || a.payment_status === "PAID";
  const cashTime = getRemainingCashTime(a.tgl_daftar || a.createdAt);

  return (
    <tr
      key={a.id || idx}
      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer border-b border-slate-100 dark:border-slate-800/60"
      onDoubleClick={() => onViewDetail(a)}
    >
      {/* No. Pendaftaran */}
      <td className="py-4 px-5 pl-6 whitespace-nowrap">
        <div className="font-bold text-blue-600 dark:text-blue-400 text-xs font-mono tracking-tight">
          {a.registration_no || formatNoPendaftaran(a.periode, a.id)}
        </div>
      </td>

      {/* Nama & Info */}
      <td className="py-4 px-5 min-w-50">
        <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs">{a.nama}</div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal mt-0.5">
          {(a.tgl_daftar || a.createdAt) ? new Date(a.tgl_daftar || a.createdAt).toLocaleDateString("id-ID") : "-"} · {a.gelombang || "Gelombang 1"} · {a.tempat_lahir || a.tempatLahir || "-"}, {a.tgl_lahir || a.tglLahir || "-"}
          {a.status === "Approved" && a.verified_by && ` · Diverifikasi: ${a.verified_by}`}
          {a.status === "Rejected" && a.rejected_by && ` · Digugurkan: ${a.rejected_by}`}
        </div>
      </td>

      {/* Jenis Kelamin */}
      <td className="py-4 px-4 text-center whitespace-nowrap">
        {(a.jenis_kelamin || a.jenisKelamin) ? (
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold border shadow-2xs ${
            (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
              : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
          }`}>
            {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">-</span>
        )}
      </td>

      {/* Asal Sekolah */}
      <td className="py-4 px-5 text-slate-600 dark:text-slate-300 text-xs">
        <div className="font-medium">{a.pindahan_dari || a.sekolah_asal || a.sekolahAsal || "-"}</div>
        {a.alasan_pindah && (
          <span
            className="text-[11px] text-slate-400 block truncate max-w-50"
            title={a.alasan_pindah}
          >
            {a.alasan_pindah}
          </span>
        )}
      </td>

      {/* Pilihan Jurusan */}
      <td className="py-4 px-5 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 font-medium text-xs">
          {a.jurusan_1 || a.jurusan1 || "-"}
        </span>
      </td>

      {/* Status Berkas */}
      <td className="py-4 px-4 text-center whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
            a.status === "Approved" || a.status === "Terverifikasi"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300"
              : a.status === "Rejected"
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900 text-rose-700 dark:text-rose-300"
                : "bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900 text-amber-800 dark:text-amber-300"
          }`}
        >
          {a.status === "Approved" || a.status === "Terverifikasi" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
        </span>
      </td>

      {/* Biaya Formulir */}
      <td className="py-4 px-5 text-center whitespace-nowrap">
        {isLunas ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            Lunas {isCashTU ? "(Tunai)" : "(Transfer)"}
          </span>
        ) : isCashTU ? (
          <div className="inline-flex flex-col items-center gap-0.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${
              cashTime.isExpired 
                ? "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
                : "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
            }`}>
              {cashTime.text}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenReceipt(a);
              }}
              className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Loket Kasir TU
            </button>
          </div>
        ) : (
          <div className="inline-flex flex-col items-center gap-0.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
              Transfer VA
            </span>
            {a.bukti_bayar ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReceipt(a);
                }}
                className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Lihat Struk
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Belum Ada Struk</span>
            )}
          </div>
        )}
      </td>

      {/* Berkas Fisik */}
      <td className="py-4 px-4 text-center whitespace-nowrap">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePhysicalDoc(a);
          }}
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
            a.physical_doc_verified
              ? "bg-emerald-50 border-emerald-200/80 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300 hover:bg-emerald-100/80"
              : "bg-rose-50 border-rose-200/80 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 hover:bg-rose-100/80"
          }`}
          title={a.physical_doc_verified ? `Diverifikasi oleh ${a.physical_doc_verified_by || 'Admin'} - Klik untuk batalkan` : "Klik jika Berkas Fisik siswa sudah diterima di sekolah"}
        >
          {a.physical_doc_verified ? "Diterima" : "Belum Ada"}
        </button>
      </td>

      {/* Aksi Administrasi */}
      <td className="py-4 px-5 text-right pr-6 shrink-0 whitespace-nowrap">
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onViewDetail(a)}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-slate-700/60 cursor-pointer"
            title="Lihat Detail Form"
          >
            <Eye size={13} />
          </button>

          <button
            type="button"
            onClick={() => onOpenEdit(a)}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors border border-blue-200/60 dark:border-blue-500/20 cursor-pointer"
            title="Edit Data Pendaftar"
          >
            <Pencil size={13} />
          </button>

          {a.status !== "Approved" && a.status !== "Terverifikasi" && (
            <button
              type="button"
              onClick={() => onVerify(a.id)}
              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-lg transition-colors border border-emerald-200/60 dark:border-emerald-500/20 cursor-pointer"
              title="Setujui & Verifikasi"
            >
              <Check size={13} />
            </button>
          )}

          {a.status !== "Rejected" && (
            <button
              type="button"
              onClick={() => onOpenReject(a.id)}
              className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-lg transition-colors border border-rose-200/60 dark:border-rose-500/20 cursor-pointer"
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
            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-slate-400 dark:hover:text-rose-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700/60 hover:border-rose-300 cursor-pointer"
            title="Pindahkan ke Tempat Sampah"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};
