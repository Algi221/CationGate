"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, X, CheckCircle, Clock, XCircle, Moon, Sun, User, MapPin, Phone, FileText, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "Terverifikasi" || status === "Approved") return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><CheckCircle size={12}/> Terverifikasi</span>;
  if (status === "Menunggu Verifikasi" || status === "Pending") return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"><Clock size={12}/> Menunggu</span>;
  if (status === "Ditolak" || status === "Rejected") return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"><XCircle size={12}/> Ditolak</span>;
  return null;
};

export default function DataPendaftarPage() {
  const { publicApplicants } = usePPDB();
  const [isDark, setIsDark] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('ppdb-theme') === 'dark' || document.documentElement.classList.contains('dark') : false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [_filterStatus, _setFilterStatus] = useState("Semua");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ppdb-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ppdb-theme', 'light');
    }
  };

  const filteredData = publicApplicants.filter(item => {
    const matchName = (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) || (item.nisn || "").includes(searchTerm);
    const matchJurusan = filterJurusan === "Semua" || (item.jurusan_1 || item.jurusan1 || "").includes(filterJurusan);

    return matchName && matchJurusan;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">

      {}
      <div className="bg-glow-container opacity-60">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      {}
      <nav className="sticky top-0 z-40 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm">
        <Link href={`/${window.location.pathname.split('/')[1]}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
            <ArrowLeft size={18} className="text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white hidden sm:block">Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">
            PPDB <span className="text-blue-600">SMK TB</span>
          </span>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <button 
            onClick={toggleDark} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700" 
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Pangkalan Data Pendaftar</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">Transparansi data pendaftar PPDB Online SMK Taruna Bhakti secara real-time. Anda dapat mencari dan melihat rincian biodata calon siswa.</p>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 shrink-0">
            <User size={20} className="text-blue-500" />
            <div>
              <div className="text-xs font-semibold opacity-75">Total Pendaftar</div>
              <div className="text-xl font-black">{publicApplicants.length} Siswa</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Nama atau NISN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-white transition-all"
            />
          </div>
          <div className="flex gap-4 md:w-auto w-full">
            <div className="relative w-full md:w-48 shrink-0">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <label htmlFor="pendaftar-filter-jurusan" className="sr-only">Filter Jurusan</label>
              <select 
                id="pendaftar-filter-jurusan"
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-white appearance-none cursor-pointer transition-all"
              >
                <option value="Semua">Semua Jurusan</option>
                <option value="Rekayasa Perangkat Lunak">RPL</option>
                <option value="Teknik Jaringan Komputer & Telekomunikasi">TJKT</option>
                <option value="Desain Komunikasi Visual">DKV</option>
                <option value="Broadcasting">Broadcasting</option>
                <option value="Animasi">Animasi</option>
                <option value="Teknik Elektronika">Teknik Elektronika</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <User size={18} /> Daftar Calon Taruna Baru
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#020617]/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama & NISN</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asal Sekolah</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Program Studi Pilihan 1</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{startIndex + index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{item.nama}</div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 opacity-80">{item.nisn}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.sekolah_asal || item.asalSekolah}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.jurusan_1 || item.jurusan1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedStudent(item)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          Lihat Detail <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={40} className="text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-sm font-medium">Tidak ada data pendaftar yang cocok dengan filter Anda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-[#020617]/30">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} Data
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 px-4">
                  {currentPage} dari {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL BIODATA */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}></div>
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText size={22} /> Biodata Calon Taruna
              </h2>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-white/10 dark:bg-[#0f172a]/20 flex items-center justify-center text-white hover:bg-white/20 dark:hover:bg-[#0f172a]/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">

              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-24 h-24 rounded-2xl bg-blue-50 dark:bg-slate-700 border border-blue-100 dark:border-slate-600 flex flex-col items-center justify-center shrink-0">
                  <User size={40} className="text-blue-500 dark:text-slate-400 mb-1" />
                  <span className="text-[10px] font-bold text-blue-600 dark:text-slate-400 uppercase tracking-wider">FOTO</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{selectedStudent.nama}</h3>
                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5"><FileText size={16}/> NISN: {selectedStudent.nisn}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={16}/> {selectedStudent.sekolah_asal || selectedStudent.asalSekolah}</span>
                  </div>
                  <div className="inline-flex flex-col gap-2.5 w-full">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 w-fit">
                      SCAN QR PADA BUKTI PENDAFTARAN UNTUK CEK STATUS
                    </span>
                    <div className="flex gap-2 items-center text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                      <span>STATUS:</span>
                      <StatusBadge status={selectedStudent.status} />
                    </div>
                    {selectedStudent.status === "Rejected" && (
                      <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl w-full text-left">
                        <div className="text-xs font-black text-rose-600 dark:text-rose-455 uppercase tracking-wider mb-1">Alasan Penolakan:</div>
                        <div className="text-xs font-bold text-rose-700 dark:text-rose-300 leading-relaxed">
                          {selectedStudent.alasan_ditolak || "Tidak ada alasan spesifik yang diberikan."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Data Pribadi */}
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 uppercase tracking-wider flex items-center gap-2">
                    <User size={16} className="text-blue-500" /> Data Pribadi
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Jenis Kelamin</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.kelamin || (selectedStudent.jenis_kelamin === 'L' ? 'Laki-laki' : selectedStudent.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki')}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Alamat Lengkap</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{selectedStudent.alamat || "Alamat Disembunyikan (Privasi)"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Tanggal Daftar</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.tglDaftar || (selectedStudent.tgl_daftar ? new Date(selectedStudent.tgl_daftar).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : "-")}</div>
                    </div>
                  </div>
                </div>

                {/* Data Akademik & Pilihan */}
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" /> Pilihan Program Studi
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Program Studi Pilihan</div>
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{selectedStudent.jurusan_1 || selectedStudent.jurusan1}</div>
                    </div>
                  </div>
                </div>

                {/* Data Orang Tua */}
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 uppercase tracking-wider flex items-center gap-2">
                    <User size={16} className="text-blue-500" /> Data Orang Tua
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Nama Ayah</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.ayah || selectedStudent.nama_ayah || "Disembunyikan (Privasi)"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Nama Ibu</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.ibu || selectedStudent.nama_ibu || "Disembunyikan (Privasi)"}</div>
                    </div>
                  </div>
                </div>

                {/* Kontak */}
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={16} className="text-blue-500" /> Informasi Kontak
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">No. HP / WhatsApp</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.noHp || selectedStudent.whatsapp || "Disembunyikan (Privasi)"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Email</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedStudent.email || "Disembunyikan (Privasi)"}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-[#020617]/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 rounded-full font-bold text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
