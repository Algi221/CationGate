"use client";

import React from "react";
import Link from "next/link";
import { Check, CheckCircle2, AlertCircle, Phone, Printer, Home } from "lucide-react";
import { sanitizeUrl } from "./types";

interface SuccessInvoiceViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  successData: any;
  schoolPeriod: string;
  regCost: number;
  waGroupUrl: string;
  ppdbLogo: string | null;
  ppdbTitle: string | null;
  schoolSlug: string;
  onRegisterNew: () => void;
}

export const SuccessInvoiceView: React.FC<SuccessInvoiceViewProps> = ({
  successData,
  schoolPeriod,
  regCost,
  waGroupUrl,
  ppdbLogo,
  ppdbTitle,
  schoolSlug,
  onRegisterNew
}) => {
  const tglDaftarFormatted = new Date(successData.tgl_daftar).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="ppdb-print-container relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-10 bg-background dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 transition-colors duration-300 print:bg-white print:p-0">
      {/* CSS print override style block to hide headers/footers and fix blank page */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .bg-glow-container, .print-hide-sidebar, .signature-block, .floating-action-nav, button, a, nav, header, footer {
            display: none !important;
          }

          html,
          body,
          body > div,
          main,
          #__next,
          .ppdb-print-container,
          .ppdb-print-content {
            display: block !important;
            overflow: visible !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            height: auto !important;
            min-height: auto !important;
            position: static !important;
          }

          .printable-invoice-sheet {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 1.5cm !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            background-color: white !important;
            color: #0f172a !important;
            overflow: visible !important;
            position: static !important;
          }

          .printable-invoice-sheet *,
          .printable-invoice-sheet span,
          .printable-invoice-sheet p,
          .printable-invoice-sheet h1,
          .printable-invoice-sheet h2,
          .printable-invoice-sheet h4,
          .printable-invoice-sheet td,
          .printable-invoice-sheet th {
            color: #0f172a !important;
            background: transparent !important;
            background-color: transparent !important;
          }

          .printable-invoice-sheet .text-blue-650,
          .printable-invoice-sheet .text-primary {
            color: #2563eb !important;
          }

          .printable-invoice-sheet .text-emerald-600 {
            color: #059669 !important;
          }

          .printable-invoice-sheet .text-amber-500 {
            color: #d97706 !important;
          }

          .printable-invoice-sheet border,
          .printable-invoice-sheet td,
          .printable-invoice-sheet th,
          .printable-invoice-sheet tr,
          .printable-invoice-sheet table {
            border-color: #000000 !important;
          }

          @page {
            size: auto;
            margin: 0mm; 
          }
        }

        html.dark .printable-invoice-sheet,
        html.dark .printable-invoice-sheet.bg-white dark:bg-[#0f172a],
        .printable-invoice-sheet {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-color: #e2e8f0 !important;
        }

        html.dark .printable-invoice-sheet .text-slate-900,
        html.dark .printable-invoice-sheet .text-slate-800,
        html.dark .printable-invoice-sheet .text-slate-700 dark:text-slate-200,
        .printable-invoice-sheet .text-slate-900,
        .printable-invoice-sheet .text-slate-800,
        .printable-invoice-sheet .text-slate-700 dark:text-slate-200 {
          color: #0f172a !important;
        }

        html.dark .printable-invoice-sheet .text-slate-500 dark:text-slate-400,
        html.dark .printable-invoice-sheet .text-slate-400,
        .printable-invoice-sheet .text-slate-500 dark:text-slate-400,
        .printable-invoice-sheet .text-slate-400 {
          color: #64748b !important;
        }

        html.dark .printable-invoice-sheet .bg-background,
        .printable-invoice-sheet .bg-background {
          background-color: #f8fafc !important;
        }

        html.dark .printable-invoice-sheet .bg-white dark:bg-[#0f172a],
        .printable-invoice-sheet .bg-white dark:bg-[#0f172a] {
          background-color: #ffffff !important;
        }

        html.dark .printable-invoice-sheet .border-slate-200 dark:border-slate-700,
        html.dark .printable-invoice-sheet .border-slate-100 dark:border-slate-800,
        .printable-invoice-sheet .border-slate-200 dark:border-slate-700,
        .printable-invoice-sheet .border-slate-100 dark:border-slate-800 {
          border-color: #e2e8f0 !important;
        }

        html.dark .printable-invoice-sheet .border-slate-800,
        html.dark .printable-invoice-sheet .border-slate-900,
        .printable-invoice-sheet .border-slate-800,
        .printable-invoice-sheet .border-slate-900 {
          border-color: #1e293b !important;
        }

        html.dark .printable-invoice-sheet .divide-slate-200,
        .printable-invoice-sheet .divide-slate-200 {
          border-color: #e2e8f0 !important;
        }

        html.dark .printable-invoice-sheet .text-primary,
        .printable-invoice-sheet .text-primary {
          color: #2563eb !important;
        }
      `}} />

      {/* Background Glowing Blobs */}
      <div className="bg-glow-container">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>

      {/* MOBILE VIEW (< 1024px) */}
      <div className="block lg:hidden bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center relative z-10 print-hide-sidebar">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
          <Check size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Pendaftaran Sukses!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">
          Terima kasih, <strong>{successData.nama || "Calon Bintang"}</strong>.
          Data pendaftaran Anda telah berhasil direkam di sistem PPDB SMK Taruna Bhakti.
        </p>
        <div className="bg-background/70 dark:bg-slate-950/30 backdrop-blur-sm border border-slate-100 dark:border-slate-800 rounded-xl p-4 mb-6 text-left text-xs space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-400">NISN:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{successData.nisn}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-400">Sekolah Asal:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{successData.sekolah_asal || successData.sekolahAsal || "-"}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400 dark:text-slate-400">Jurusan Utama:</span>
            <span className="font-bold text-primary dark:text-sky-400">{successData.jurusan_1 || successData.jurusan1 || "-"}</span>
          </div>
        </div>

        {/* Warning box */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900 rounded-2xl p-4.5 mb-6 text-left text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
          <div className="font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={14} className="shrink-0" />
            PENTING: Bawa Berkas Fisik!
          </div>
          Calon siswa diimbau untuk datang langsung ke sekretariat PPDB sekolah guna melakukan verifikasi berkas fisik. Mohon persiapkan dan bawa dokumen berikut:
          <ul className="list-disc pl-4.5 mt-1 space-y-0.5 font-semibold">
            <li>Fotokopi Kartu Keluarga (KK)</li>
            <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
            <li>Akta Kelahiran asli &amp; Fotokopi</li>
            <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
            <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
          </ul>
        </div>

        {/* Whatsapp join CTA */}
        {((successData && successData.payment_status === "Paid") || true) && (
          <div className="bg-primary/5 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900 rounded-2xl p-4.5 mb-6 text-center text-xs">
            <p className="font-bold text-blue-800 dark:text-blue-300 mb-2.5">
              Mari Bergabung ke Grup PPDB WhatsApp!
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mb-3.5">
              Dapatkan info berkas fisik, jadwal tes bakat minat, dan pengumuman resmi langsung di ponsel Anda.
            </p>
            <a 
              href={sanitizeUrl(waGroupUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-6 bg-linear-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow shadow-emerald-500/20 transition duration-300"
            >
              <Phone size={14} />
              <span>Gabung Grup WA Pendaftar</span>
            </a>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href={`/invoice?nisn=${successData.nisn}`} target="_blank" className="w-full flex justify-center items-center py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]">
            Lihat &amp; Cetak Invoice
          </Link>
          <Link href={`/${schoolSlug || ''}`} className="w-full flex justify-center items-center py-3.5 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all">
            Kembali ke Beranda
          </Link>
          <button
            type="button"
            onClick={onRegisterNew}
            className="w-full flex justify-center items-center gap-1.5 py-3 bg-primary/5 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-primary dark:text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-blue-200/50 dark:border-blue-800/30"
          >
            Daftar Calon Baru Lainnya
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW (>= 1024px) */}
      <div className="ppdb-print-content hidden lg:grid grid-cols-12 gap-8 max-w-6xl w-full relative z-10 items-start">
        {/* Left Column: Sidebar Stats, Documents checklist and WhatsApp CTA */}
        <div className="lg:col-span-5 space-y-6 print-hide-sidebar">
          {/* Congrats Info Box */}
          <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>

            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mb-4.5 shadow-sm">
              <CheckCircle2 size={28} className="animate-pulse" />
            </div>

            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2 leading-tight">Pendaftaran Sukses!</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-bold">
              Terima kasih, <strong className="text-slate-750 dark:text-white">{successData.nama}</strong>. Data registrasi administrasi Anda telah tersimpan secara resmi di sistem PPDB SMK Taruna Bhakti Depok.
            </p>
          </div>

          {/* Documents Checklist warning Box */}
          <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/40 rounded-3xl p-6 text-left space-y-3 shadow-sm">
            <div className="font-black text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5 border-b border-amber-200/50 dark:border-amber-900/20 pb-2">
              <AlertCircle size={14} className="shrink-0" />
              PENTING: BAWA BERKAS FISIK KE SEKOLAH
            </div>
            <p className="text-[10px] text-amber-700/90 dark:text-amber-300/85 leading-relaxed font-bold">
              Harap datang langsung ke loket sekretariat PPDB sekolah untuk verifikasi fisik berkas-berkas pendaftaran berikut:
            </p>
            <ul className="text-[10px] text-amber-805 dark:text-amber-350 font-bold space-y-1 pl-4 list-disc leading-normal">
              <li>Fotokopi Kartu Keluarga (KK)</li>
              <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
              <li>Akta Kelahiran asli &amp; Fotokopi</li>
              <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
              <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
            </ul>
          </div>

          {/* WhatsApp Group card */}
          {((successData && successData.payment_status === "Paid") || true) && (
            <div className="bg-primary/5/60 dark:bg-blue-950/15 border border-blue-200/55 dark:border-blue-900/45 rounded-3xl p-6 text-center space-y-3.5 shadow-sm">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Phone size={18} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-wide">Mari Bergabung ke Grup WhatsApp</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-1 font-bold">
                  Hubungkan dengan calon pendaftar lainnya dan dapatkan pembaruan informasi seleksi bakat minat.
                </p>
              </div>
              <a
                href={sanitizeUrl(waGroupUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center gap-2 py-3 bg-linear-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow shadow-emerald-500/10 transition"
              >
                <Phone size={12} />
                Gabung Grup WA Pendaftar
              </a>
            </div>
          )}

          {/* Print and Main Action controls */}
          <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 space-y-4">
            <button 
              onClick={() => window.print()}
              className="w-full flex justify-center items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-755 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/15 transition transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Printer size={14} />
              Cetak Invoice Resmi (PDF)
            </button>

            <Link href={`/${schoolSlug || ''}`} className="w-full flex justify-center items-center gap-1.5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider rounded-xl transition">
              <Home size={13} />
              Kembali ke Beranda
            </Link>

            <button
              type="button"
              onClick={onRegisterNew}
              className="w-full flex justify-center items-center gap-1.5 py-3.5 bg-primary/5 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-primary dark:text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-blue-200/50 dark:border-blue-800/30"
            >
              Daftar Calon Baru Lainnya
            </button>
          </div>
        </div>

        {/* Right Column: Detailed High-Fidelity Printable Invoice Container */}
        <div className="lg:col-span-7 w-full bg-white dark:bg-[#0f172a] text-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700/50 print-full-width relative overflow-hidden invoice-sheet-container printable-invoice-sheet">
          {/* Official stamp seal */}
          {successData.payment_status === "Paid" ? (
            <div className="absolute top-28 right-8 border-4 border-emerald-500/60 text-emerald-500/60 font-black text-sm uppercase tracking-widest px-4 py-2 rounded-xl -rotate-12 pointer-events-none select-none z-10 bg-white dark:bg-[#0f172a]/70 backdrop-blur-xs font-mono">
              LUNAS / VERIFIED
            </div>
          ) : (
            <div className="absolute top-28 right-8 border-4 border-amber-500/60 text-amber-500/60 font-black text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl -rotate-12 pointer-events-none select-none z-10 bg-white dark:bg-[#0f172a]/70 backdrop-blur-xs font-mono">
              PROSES VERIFIKASI
            </div>
          )}

          {/* School Letterhead */}
          <div className="flex items-center gap-4 border-b-4 border-double border-slate-800 pb-4 mb-6">
            {ppdbLogo && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={ppdbLogo || undefined}
                alt="Logo Sekolah"
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/cropped-logo-tb-32x32.png";
                }}
              />
            )}
            <div className="text-left">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">Panitia Penerimaan Peserta Didik Baru</h4>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {ppdbTitle ? ppdbTitle.replace(/^(ppdb\s+)/i, '').toUpperCase() : "SMK TARUNA BHAKTI DEPOK"}
              </h2>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Terakreditasi A · Jl. Pekapuran No. 22, Cimanggis, Depok, Jawa Barat</p>
              <p className="text-[9px] text-slate-400">Telp: (021) 874 7475 · Website: www.smktarunabhakti.sch.id</p>
            </div>
          </div>

          {/* Invoice Header */}
          <div className="text-center mb-6">
            <h1 className="text-base font-black uppercase tracking-widest text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 inline-block pb-1.5 mb-1.5">TANDA BUKTI REGISTRASI & INVOICE PEMBAYARAN</h1>
            <p className="text-[10px] font-mono font-bold text-slate-400">Nomor Dokumen: INV-{successData.nisn}</p>
          </div>

          {/* Invoice details layout: 2-Columns grid */}
          <div className="grid grid-cols-2 gap-4 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 shadow-sm rounded-2xl p-4.5 text-[10px] leading-relaxed text-left text-slate-700 dark:text-slate-200 font-bold mb-6">
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="text-slate-400 w-24">No. Invoice:</span>
                <span className="text-slate-900 font-mono font-extrabold">INV-{successData.nisn}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-24">Tanggal Daftar:</span>
                <span className="text-slate-900">{tglDaftarFormatted}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-24">Periode Ajaran:</span>
                <span className="text-slate-900 font-extrabold">{successData.periode || schoolPeriod}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="text-slate-400 w-24">Nama Pendaftar:</span>
                <span className="text-slate-900 uppercase font-extrabold">{successData.nama}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-24">NISN Pendaftar:</span>
                <span className="text-slate-900 font-mono font-extrabold">{successData.nisn}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-24">Program Rombel:</span>
                <span className="text-primary font-extrabold uppercase">{successData.jurusan_1 || successData.jurusan1 || "-"}</span>
              </div>
            </div>
          </div>

          {/* Fee item details table */}
          <table className="w-full text-left text-[11px] font-bold text-slate-700 dark:text-slate-200 border-collapse mb-6">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-2.5">Deskripsi Alokasi Tagihan</th>
                <th className="py-2.5 text-right w-36">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 text-slate-900 font-extrabold">
                  Biaya Registrasi Formulir PPDB SMK Taruna Bhakti
                  <span className="block text-[9px] font-bold text-slate-400 mt-0.5">Alokasi administrasi berkas dan formulir online</span>
                </td>
                <td className="py-3 text-right text-slate-900 font-black">
                  Rp { regCost.toLocaleString("id-ID") }
                </td>
              </tr>
            </tbody>
          </table>

          {/* Bottom Total summary */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-1.5 text-[10px] font-bold">
              <div className="flex justify-between text-slate-500 dark:text-slate-400 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Subtotal:</span>
                <span>Rp {regCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-slate-550">
                <span>Pajak (PPN 0%):</span>
                <span>Nihil</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-xs py-2 border-t-2 border-slate-800">
                <span>Total Tagihan:</span>
                <span className="text-primary font-black text-sm">Rp {regCost.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* Payment Details footer */}
          <div className="flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-400 leading-normal border-t border-slate-100 pt-4 mb-8 print:hidden">
            <div className="flex gap-4">
              <div>
                <span className="font-black">Metode Bayar:</span> <span className="text-slate-800 dark:text-white font-bold uppercase">
                  {successData.metode_pembayaran === 'Transfer Manual' ? 'Transfer' : successData.metode_pembayaran}
                </span>
              </div>
              <div>
                <span className="font-black">Status Bayar:</span> <span className={`font-black uppercase ${successData.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>{successData.payment_status === 'Paid' ? 'LUNAS (VERIFIED)' : 'PENDING'}</span>
              </div>
            </div>
            <p className="text-[8px] font-bold text-slate-400">
              * Tanda terima digital PPDB SMK Taruna Bhakti.
            </p>
          </div>

          {/* Physical Documents Warning Block */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4 mt-5 text-[11px] text-amber-800 dark:text-amber-500 leading-relaxed font-bold">
            <div className="flex items-center gap-2 mb-2 font-black text-amber-700 dark:text-amber-500 uppercase tracking-wider text-xs">
              <span className="text-sm">⚠️</span>
              Penting: Bawa Berkas Fisik!
            </div>
            <p className="mb-2">
              Harap datang langsung ke loket sekretariat PPDB sekolah untuk verifikasi fisik berkas-berkas pendaftaran berikut:
            </p>
            <ul className="list-disc pl-5 m-0 space-y-1">
              <li>Fotokopi Kartu Keluarga (KK)</li>
              <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
              <li>Akta Kelahiran asli &amp; Fotokopi</li>
              <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
              <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
            </ul>
          </div>

          {/* Button Cetak Kartu Pendaftaran SPMB */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
            <Link
              href={`kartu-pendaftaran?nisn=${encodeURIComponent(successData?.nisn || '')}`}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              Cetak Kartu Pendaftaran SPMB
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
