import React from "react";
import Image from "next/image";
import { KeyRound, Edit3, Trash2, Mail, CheckCircle2, Clock, Copy, RefreshCw } from "lucide-react";
import { AdminItem } from "../types";
import Swal from "sweetalert2";

interface AdminActiveTableProps {
  admins: AdminItem[];
  loading: boolean;
  adminUser: { id?: number; username?: string; role?: string } | null;
  schoolSlug?: string;
  isPro?: boolean;
  handleEditClick: (admin: AdminItem) => void;
  handleDeleteAdmin: (id: number, nama: string) => void;
  handleResendActivation?: (id: number, email?: string) => void;
}

export const AdminActiveTable: React.FC<AdminActiveTableProps> = ({
  admins,
  loading,
  adminUser,
  schoolSlug,
  isPro = true,
  handleEditClick,
  handleDeleteAdmin,
  handleResendActivation
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Memuat Daftar Admin...</p>
      </div>
    );
  }

  const handleCopyActivationLink = (admin: AdminItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://cationgate.site";
    const slug = schoolSlug || "demo";
    const link = admin.activation_link || `${origin}/${slug}/admin/activate?token=${admin.activation_token}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      Swal.fire({
        icon: "success",
        title: "Tautan Aktivasi Disalin!",
        html: `<p class="text-xs text-slate-500 mb-2">Kirimkan tautan ini kepada <strong>${admin.nama_lengkap}</strong>:</p><input readonly value="${link}" class="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono select-all" />`,
        confirmButtonText: "Selesai"
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] font-black text-slate-500">
            <tr>
              <th className="py-4 px-6">Nama Staf & Kredensial</th>
              <th className="py-4 px-6">Hak Akses / Peran</th>
              <th className="py-4 px-6">Status Aktivasi</th>
              <th className="py-4 px-6">Kehadiran</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 px-4">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Mail size={22} />
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Belum Ada Staf Admin Tambahan</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Instansi Anda belum menambahkan staf panitia PPDB baru. Klik tombol <strong>Tambah Admin Baru</strong> di atas untuk membuat akun staf panitia.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              admins.map((admin, idx) => {
                const isOnline = admin.is_online !== undefined ? admin.is_online : (idx === 0 || admin.username === adminUser?.username);
                const isActive = admin.is_active !== false;

                return (
                  <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black overflow-hidden">
                            {admin.foto_profil ? (
                              <Image src={admin.foto_profil} alt={admin.nama_lengkap} width={36} height={36} className="w-full h-full object-cover" unoptimized />
                            ) : (
                              <span className="text-sm font-black">{(admin.nama_lengkap || "A").charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0f172a] ${
                              isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                            }`}
                            title={isOnline ? "Online (Aktif)" : "Offline"}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold flex items-center gap-2">
                            {admin.nama_lengkap}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>@{admin.username}</span>
                            {admin.email && (
                              <span className="flex items-center gap-1 text-slate-400">
                                · <Mail size={11} /> {admin.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          admin.role === "superadmin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                            : admin.role === "panitia"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        }`}
                      >
                        <KeyRound size={10} />
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {isActive ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                          <CheckCircle2 size={12} />
                          <span>Terverifikasi</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 items-start">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                            <Clock size={12} />
                            <span>Menunggu Aktivasi Gmail</span>
                          </div>
                          {admin.activation_token && (
                            <button
                              type="button"
                              onClick={() => handleCopyActivationLink(admin)}
                              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer mt-0.5"
                            >
                              <Copy size={10} /> Salin Link Aktivasi
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        <span className={isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}>
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {!isActive && handleResendActivation && (
                          <button
                            onClick={() => {
                              if (!isPro) {
                                Swal.fire({
                                  icon: "warning",
                                  title: "Fitur Terkunci (Paket Berbayar)",
                                  text: "Fitur kelola staf panitia hanya tersedia untuk instansi yang berlangganan Paket Pro atau Enterprise.",
                                  confirmButtonText: "Mengerti",
                                  confirmButtonColor: "#2563eb"
                                });
                                return;
                              }
                              handleResendActivation(admin.id, admin.email);
                            }}
                            className={`p-2 rounded-xl text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition ${
                              !isPro ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                            title={!isPro ? "Hanya untuk paket Pro/Enterprise" : "Kirim Ulang Tautan Aktivasi"}
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (!isPro) {
                              Swal.fire({
                                icon: "warning",
                                title: "Fitur Terkunci (Paket Berbayar)",
                                text: "Fitur edit staf panitia hanya tersedia untuk instansi yang berlangganan Paket Pro atau Enterprise.",
                                confirmButtonText: "Mengerti",
                                confirmButtonColor: "#2563eb"
                              });
                              return;
                            }
                            handleEditClick(admin);
                          }}
                          className={`p-2 rounded-xl text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                            !isPro ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                          }`}
                          title={!isPro ? "Hanya untuk paket Pro/Enterprise" : "Edit Admin"}
                        >
                          <Edit3 size={15} />
                        </button>
                        {admin.id !== adminUser?.id && (
                          <button
                            onClick={() => {
                              if (!isPro) {
                                Swal.fire({
                                  icon: "warning",
                                  title: "Fitur Terkunci (Paket Berbayar)",
                                  text: "Fitur hapus staf panitia hanya tersedia untuk instansi yang berlangganan Paket Pro atau Enterprise.",
                                  confirmButtonText: "Mengerti",
                                  confirmButtonColor: "#2563eb"
                                });
                                return;
                              }
                              handleDeleteAdmin(admin.id, admin.nama_lengkap);
                            }}
                            className={`p-2 rounded-xl text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                              !isPro ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                            title={!isPro ? "Hanya untuk paket Pro/Enterprise" : "Hapus ke Sampah"}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
