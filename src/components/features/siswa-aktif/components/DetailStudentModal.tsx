"use client";

import React, { useState } from "react";
import { 
  User, 
  BookOpen, 
  X, 
  Calendar, 
  Heart, 
  HelpCircle, 
  Layers, 
  School, 
  Users 
} from "lucide-react";
import { ActiveStudent } from "../types";
import { formatNoPendaftaran } from "../utils/excelHelper";

interface DetailStudentModalProps {
  selectedApplicant: ActiveStudent | null;
  nipdMap: Map<number, string>;
  onClose: () => void;
}

export const DetailStudentModal: React.FC<DetailStudentModalProps> = ({
  selectedApplicant,
  nipdMap,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<string>("biodata");

  if (!selectedApplicant) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-left border border-slate-200 dark:border-white/10">

        {/* Modal Top Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-start border-b border-slate-100 dark:border-white/5">
          <div className="flex gap-5 items-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/30 shrink-0">
              {(selectedApplicant.nama || "K")[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  {selectedApplicant.nama}
                </h2>
                <span className="px-3 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-500/30 rounded-full uppercase tracking-widest whitespace-nowrap">
                  Siswa Aktif
                </span>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 flex-wrap mb-2">
                <span className="text-blue-500 font-mono">
                  NIPD: {nipdMap.get(selectedApplicant.id) || selectedApplicant.nipd || "-"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-white/10 shadow-xs backdrop-blur-md text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
                <BookOpen size={13} className="text-blue-400" />
                <span className="text-blue-500 font-mono font-bold">
                  NO. DAFTAR: {formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-blue-500">NISN: {selectedApplicant.nisn}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>NIK: {selectedApplicant.nik || "-"}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>ANGKATAN: {selectedApplicant.periode || "2026-2027"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:text-slate-300 transition-colors shrink-0 ml-4 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 pt-4 shrink-0">
          <div className="bg-slate-100 dark:bg-[#1e293b] p-1.5 rounded-2xl flex items-center gap-1 w-full overflow-x-auto">
            {[
              { id: "biodata", label: "Biodata" },
              { id: "periodik", label: "Periodik" },
              { id: "bantuan", label: "Bantuan" },
              { id: "orangtua", label: "Orang Tua" },
              { id: "akademik", label: "Akademik" },
              { id: "pernyataan", label: "Pernyataan" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl shrink-0 transition-colors cursor-pointer ${
                  activeTab === t.id
                    ? "bg-white dark:bg-[#0f172a] text-blue-600 dark:text-white shadow-xs font-black"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Tab Content Viewport */}
        <div className="flex-1 overflow-y-auto p-8 max-h-[60vh] transition-colors duration-300">
          {activeTab === "biodata" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <h3 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                    Identitas Diri
                  </h3>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nama Lengkap</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedApplicant.nama}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">NISN / NIK</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tempat, Tanggal Lahir</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jenis Kelamin / Agama</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">
                    <span className="text-blue-500 font-bold" style={{ fontSize: "12px" }}>!</span>
                  </div>
                  <h3 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                    Alamat & Kontak
                  </h3>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp / Email</div>
                  <div className="text-sm font-bold text-blue-500">{selectedApplicant.whatsapp || "-"} / {selectedApplicant.email || "-"}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Alamat Tempat Tinggal</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kelurahan / Kecamatan</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tinggal Dengan / Transportasi</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "periodik" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <Calendar size={12} className="text-blue-500" /> Data Fisik & Periodik
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <Heart size={12} className="text-blue-500" /> Kondisi Kesehatan
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span>
                    <span className="text-rose-600 dark:text-rose-400 font-black">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bantuan" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <HelpCircle size={12} className="text-blue-500" /> Jaminan Sosial / Bantuan
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <Layers size={12} className="text-blue-500" /> Prestasi & Beasiswa
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Beasiswa</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orangtua" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <Users size={12} className="text-blue-500" /> Data Orang Tua (Ayah)
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Ayah</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pekerjaan Ayah</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Ayah</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <Users size={12} className="text-blue-500" /> Data Orang Tua (Ibu)
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Ibu</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pekerjaan Ibu</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Telepon Orang Tua</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "akademik" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <School size={12} className="text-blue-500" /> Pendidikan Sebelumnya
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Asal Sekolah</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tahun Lulus</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <Layers size={12} className="text-blue-500" /> Program Keahlian
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jurusan</span>
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold">{selectedApplicant.jurusan || selectedApplicant.jurusan_1 || selectedApplicant.jurusan1 || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Kelas / Rombel</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">{selectedApplicant.diterima_kelas || selectedApplicant.diterimaKelas || "Belum ada"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pernyataan" && (
            <div className="space-y-4">
              <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                <School size={12} className="text-blue-500" /> Komitmen & Pernyataan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl">
                  <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px]">Tawuran / Perkelahian</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedApplicant.perkelahian || "Tidak"}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl">
                  <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px]">Penyalahgunaan Narkoba</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedApplicant.narkoba || "Tidak"}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl">
                  <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px]">Pelanggaran Hukum Lain</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
