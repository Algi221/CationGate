"use client";

import React, { useEffect, useState, use } from "react";
import { Printer, ArrowLeft, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

interface ApplicantCardData {
  id: number;
  nama: string;
  nisn: string;
  registration_no?: string;
  jurusan_1: string;
  sekolah_asal: string;
  jenis_kelamin: string;
  status: string;
  tgl_daftar: string;
  gelombang?: string;
  periode?: string;
  physical_doc_verified?: boolean;
}

export default function KartuPendaftaranPage({
  params,
  searchParams
}: {
  params: Promise<{ school_slug: string }>;
  searchParams: Promise<{ nisn?: string; id?: string }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const { school_slug } = resolvedParams;
  const nisn = resolvedSearchParams.nisn;

  const [applicant, setApplicant] = useState<ApplicantCardData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const schoolRes = await fetch(`/api/saas/school-by-slug/${school_slug}`);
        const schoolJson = await schoolRes.json();
        if (schoolJson.success) {
          setSchoolData(schoolJson.data);
        }

        if (!nisn) {
          setError("Parameter NISN pendaftar tidak ditemukan.");
          setLoading(false);
          return;
        }

        // Fetch Applicant Data
        const appRes = await fetch(`/api/applicants/registration-card/${nisn}?school_slug=${school_slug}`);
        const appJson = await appRes.json();

        if (appJson.success && appJson.data) {
          setApplicant(appJson.data);
        } else {
          setError(appJson.message || "Data pendaftar tidak ditemukan.");
        }
      } catch (err: unknown) {
        setError("Gagal memuat kartu pendaftaran: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [school_slug, nisn]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-slate-700 dark:text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-semibold text-sm">Memuat Kartu Pendaftaran SPMB...</p>
        </div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Gagal Memuat Kartu</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{error || "Data pendaftar tidak ditemukan."}</p>
          <Link
            href={`/${school_slug}/daftar`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Form Pendaftaran
          </Link>
        </div>
      </div>
    );
  }

  const schoolName = schoolData?.name || "SMK TARUNA BHAKTI DEPOK";
  const regNo = applicant.registration_no || `SPMB-${new Date().getFullYear()}-${String(applicant.id).padStart(5, '0')}`;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 sm:px-6">
      {/* Top Action Bar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href={`/${school_slug}/daftar`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Printer className="w-4 h-4" /> Cetak Kartu SPMB
        </button>
      </div>

      {/* Printable Card Area */}
      <div id="printable-card" className="max-w-4xl mx-auto bg-white dark:bg-[#0f172a] text-slate-900 rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800">

        {/* Header Sekolahan */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-slate-800 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-2xl tracking-wider">
              {schoolName.substring(0, 3).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">{schoolName}</h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Sistem Penerimaan Murid Baru (SPMB) • Tahun Ajaran {applicant.periode || "2026/2027"}</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              {applicant.gelombang || "Gelombang 1"}
            </span>
          </div>
        </div>

        {/* Card Title & Registration No */}
        <div className="bg-slate-900 text-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Kartu Pendaftaran Resmi</span>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">KARTU PESERTA SELEKSI SPMB</h2>
          </div>
          <div className="text-center sm:text-right bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Nomor Pendaftaran</span>
            <span className="font-mono text-lg font-black text-white tracking-widest">{regNo}</span>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider pb-1 border-b border-slate-200 dark:border-slate-800">Data Calon Siswa</h3>

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Nama Lengkap</span>
              <span className="font-bold text-slate-900">{applicant.nama}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">NISN</span>
              <span className="font-mono font-bold text-slate-900">{applicant.nisn}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Jenis Kelamin</span>
              <span className="font-medium text-slate-900">{applicant.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Sekolah Asal</span>
              <span className="font-medium text-slate-900">{applicant.sekolah_asal}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider pb-1 border-b border-slate-200 dark:border-slate-800">Program & Status</h3>

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Program Keahlian</span>
              <span className="font-bold text-blue-700">{applicant.jurusan_1}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Tanggal Pendaftaran</span>
              <span className="font-medium text-slate-900">{new Date(applicant.tgl_daftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Status Pendaftaran</span>
              <span className="font-bold text-amber-600">{applicant.status}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Verifikasi Berkas Fisik</span>
              <span className={`font-bold ${applicant.physical_doc_verified ? 'text-emerald-600' : 'text-rose-600'}`}>
                {applicant.physical_doc_verified ? '✓ Berkas Lengkap' : '⌛ Belum Diserahkan'}
              </span>
            </div>
          </div>
        </div>

        {/* Physical Document Checklist Table */}
        <div className="mb-8 border border-slate-300 dark:border-slate-700 rounded-xl p-5 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-blue-900" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Checklist Berkas Fisik Yang Wajib Dibawa Saat Verifikasi Ke Sekolah</h3>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Calon siswa wajib menyerahkan berkas fisik berikut ke panitia verifikasi di sekolah untuk penyelesaian verifikasi kelulusan:
          </p>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold bg-slate-200">
                <th className="py-2 px-3 w-12 text-center border-r border-slate-300 dark:border-slate-700">Cek</th>
                <th className="py-2 px-3">Nama Berkas Fisik</th>
                <th className="py-2 px-3 w-32">Ketentuan</th>
                <th className="py-2 px-3 w-28 text-center">Paraf Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200 dark:border-slate-800 text-slate-400">[ &nbsp; ]</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">Fotokopi Kartu Keluarga (KK)</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">1 Lembar</td>
                <td className="py-2.5 px-3 border-l border-slate-200 dark:border-slate-800"></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200 dark:border-slate-800 text-slate-400">[ &nbsp; ]</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">1 Lembar</td>
                <td className="py-2.5 px-3 border-l border-slate-200 dark:border-slate-800"></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200 dark:border-slate-800 text-slate-400">[ &nbsp; ]</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">Akta Kelahiran</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">Asli &amp; 1 Fotokopi</td>
                <td className="py-2.5 px-3 border-l border-slate-200 dark:border-slate-800"></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200 dark:border-slate-800 text-slate-400">[ &nbsp; ]</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">Fotokopi Ijazah / Surat Keterangan Lulus (SKL)</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">Legalisir 1 Lembar</td>
                <td className="py-2.5 px-3 border-l border-slate-200 dark:border-slate-800"></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200 dark:border-slate-800 text-slate-400">[ &nbsp; ]</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">Pas Foto Berwarna Terbaru (3x4)</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">3 Lembar</td>
                <td className="py-2.5 px-3 border-l border-slate-200 dark:border-slate-800"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Area */}
        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Calon Siswa Pendaftar,</p>
            <div className="h-16"></div>
            <p className="text-xs font-bold underline text-slate-900">{applicant.nama}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Panitia Verifikasi SPMB,</p>
            <div className="h-16"></div>
            <p className="text-xs font-bold text-slate-900">( .................................................... )</p>
          </div>
        </div>

        {/* Card Footer Note */}
        <div className="mt-8 pt-4 border-t border-dashed border-slate-300 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 text-center">
          <p>Kartu ini merupakan bukti cetak sah pendaftaran online SPMB {schoolName}. Harap simpan dan bawa saat verifikasi berkas ke sekolah.</p>
        </div>

      </div>
    </div>
  );
}
