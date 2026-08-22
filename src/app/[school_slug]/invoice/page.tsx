"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Printer, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import dompurify from "dompurify";

const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (_e) {
    return "";
  }
};
const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
  try {
    const parts = (periode || "2026-2027").split("-");
    const year1 = parts[0].slice(-2);
    const year2 = parts[1].slice(-2);
    const prefix = `${year1}${year2}`;
    const sequence = 10000 + id;
    return `${prefix}${sequence}`;
  } catch (_e) {
    return `2627${10000 + id}`;
  }
};

function InvoiceContent() {
  const searchParams = useSearchParams();
  const nisn = searchParams.get("nisn");
  const isAdmin = searchParams.get("isAdmin") === "true";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [regCost, setRegCost] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCost = localStorage.getItem('ppdb_reg_cost');
      if (savedCost) {
        const parsed = parseInt(savedCost);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 250000;
  });
  const [waGroupUrl, setWaGroupUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('ppdb_wa_group_url') || "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS";
    }
    return "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS";
  });
  const [loading, setLoading] = useState(() => !!nisn);
  const [error, setError] = useState<string | null>(() => !nisn ? "NISN tidak ditemukan." : null);

  // Bersihkan nomor WhatsApp calon siswa ke format internasional
  const getCleanWaNumber = () => {
    if (!data || !data.whatsapp) return "";
    let cleanPhone = data.whatsapp.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('08')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    }
    return cleanPhone;
  };

  const getWaSendUrl = () => {
    if (typeof window === 'undefined' || !data) return "";
    const cleanPhone = getCleanWaNumber();
    const invoiceUrl = `${window.location.origin}/invoice?nisn=${data.nisn}`;
    const messageText = `Halo ${data.nama},\n\nPembayaran registrasi formulir PPDB SMK Taruna Bhakti Depok Anda dengan NISN: ${data.nisn} telah BERHASIL DIVERIFIKASI dan dinyatakan LUNAS.\n\nBerikut adalah tautan bukti registrasi & invoice resmi pembayaran Anda:\n${invoiceUrl}\n\nTerima kasih.\nPanitia PPDB SMK Taruna Bhakti`;
    const encodedMessage = encodeURIComponent(messageText);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || '';

  const handleSendWhatsApp = () => {
    const url = getWaSendUrl();
    if (url) {
      window.open(url, '_blank');

      setTimeout(() => {
        window.location.href = schoolSlug ? `/${schoolSlug}/dashboard/pendaftar` : "/dashboard/pendaftar";
      }, 1000);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('ppdb-theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    const loadLiveCost = async () => {
      try {
        const res = await fetch("/api/config");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.ppdb_form_fee) {
            const parsed = parseInt(json.data.ppdb_form_fee);
            if (!isNaN(parsed)) {
              setRegCost(parsed);
              localStorage.setItem('ppdb_reg_cost', json.data.ppdb_form_fee);
            }
          }
          if (json.data.ppdb_wa_group_url) {
            setWaGroupUrl(json.data.ppdb_wa_group_url);
            localStorage.setItem('ppdb_wa_group_url', json.data.ppdb_wa_group_url);
          }
        }
      } catch (err) {
        console.log("Failed to fetch live config for invoice:", err);
      }
    };
    loadLiveCost();
  }, []);

  useEffect(() => {
    if (!nisn) return;

    const fetchInvoice = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
        const res = await fetch(`${backendUrl}/api/applicants/public-invoice/${nisn}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.message || "Gagal mengambil data invoice.");
        }
      } catch (err: unknown) {
        setError("Error: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [nisn]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] p-6">
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Oops!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error || "Data tidak ditemukan."}</p>
          <Link href={schoolSlug ? `/${schoolSlug}` : "/"} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const tglDaftarFormatted = new Date(data.tgl_daftar).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 print-root">

      {/* Print-only styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }

          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
          }

          .no-print, .action-panel, .signature-block, nav, header, footer, button, a {
            display: none !important;
          }

          html,
          body,
          body > div,
          .print-root,
          .screen-layout {
            display: block !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            position: static !important;
          }

          .invoice-sheet {
            display: block !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            background: white !important;
            background-color: white !important;
            color: #0f172a !important;
            overflow: visible !important;
            position: static !important;
          }

          .invoice-inner {
            padding: 0 !important;
            width: 100% !important;
            background: white !important;
          }

          .invoice-sheet *,
          .invoice-sheet span,
          .invoice-sheet p,
          .invoice-sheet h1,
          .invoice-sheet h2,
          .invoice-sheet h4,
          .invoice-sheet td,
          .invoice-sheet th {
            color: #0f172a !important;
            background: transparent !important;
            background-color: transparent !important;
          }

          .invoice-sheet .text-blue-600,
          .invoice-sheet span[style*="color: rgb(37, 99, 235)"],
          .invoice-sheet span[style*="color:#2563eb"],
          .invoice-sheet span[style*="color: #2563eb"] {
            color: #2563eb !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .invoice-sheet, .invoice-inner {
            page-break-inside: avoid;
          }
        }

        html.dark .invoice-sheet,
        html.dark .invoice-sheet.bg-white dark:bg-[#0f172a] {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-color: #e2e8f0 !important;
        }

        html.dark .invoice-sheet * {
          border-color: #e2e8f0 !important;
        }

        html.dark .invoice-sheet div[style*="background: #f8fafc"],
        html.dark .invoice-sheet div[style*="background-color: #f8fafc"] {
          background-color: #f8fafc !important;
          background: #f8fafc !important;
        }

        @media screen {
          .screen-layout {
            display: flex;
            gap: 2rem;
            max-width: 72rem;
            margin: 0 auto;
            align-items: flex-start;
          }

          .invoice-sheet {
            flex: 1;
            min-width: 0;
          }

          .action-panel {
            width: 280px;
            flex-shrink: 0;
          }

          @media (max-width: 1023px) {
            .screen-layout {
              flex-direction: column;
            }
            .action-panel {
              width: 100%;
            }
          }
        }
      `}} />

      <div className="screen-layout">

        {/* ===== INVOICE SHEET ===== */}
        <div className="invoice-sheet bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800/50 overflow-hidden" style={{ position: 'relative' }}>

          {/* Stamp */}
          {data.payment_status === "Paid" ? (
            <div style={{
              position: 'absolute', top: '120px', right: '32px',
              border: '3px solid rgba(16,185,129,0.5)',
              color: 'rgba(16,185,129,0.5)',
              fontWeight: 900, fontSize: '12px',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              padding: '6px 14px', borderRadius: '10px',
              transform: 'rotate(-12deg)',
              pointerEvents: 'none', userSelect: 'none',
              zIndex: 10, background: 'rgba(255,255,255,0.7)',
              fontFamily: 'monospace'
            }}>
              LUNAS / VERIFIED
            </div>
          ) : (
            <div style={{
              position: 'absolute', top: '120px', right: '32px',
              border: '3px solid rgba(245,158,11,0.5)',
              color: 'rgba(245,158,11,0.5)',
              fontWeight: 900, fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              padding: '5px 12px', borderRadius: '10px',
              transform: 'rotate(-12deg)',
              pointerEvents: 'none', userSelect: 'none',
              zIndex: 10, background: 'rgba(255,255,255,0.7)',
              fontFamily: 'monospace'
            }}>
              PROSES VERIFIKASI
            </div>
          )}

          <div className="invoice-inner" style={{ padding: '32px' }}>

            {/* ── KOPSURAT / LETTERHEAD ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '3px double #1e293b', paddingBottom: '14px', marginBottom: '20px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo_smktb.png" 
                alt="Logo SMK Taruna Bhakti" 
                style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = "https://smktarunabhakti.sch.id/wp-content/uploads/2019/02/cropped-logo-tb-32x32.png";
                }}
              />
              <div>
                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b', margin: '0 0 2px 0' }}>
                  Panitia Penerimaan Peserta Didik Baru
                </p>
                <h2 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: '0 0 2px 0', lineHeight: 1.2 }}>
                  SMK TARUNA BHAKTI DEPOK
                </h2>
                <p style={{ fontSize: '9px', fontWeight: 600, color: '#64748b', margin: 0 }}>
                  Terakreditasi A · Jl. Pekapuran No. 22, Cimanggis, Depok, Jawa Barat
                </p>
                <p style={{ fontSize: '9px', color: '#94a3b8', margin: 0 }}>
                  Telp: (021) 874 7475 · Website: www.smktarunabhakti.sch.id
                </p>
              </div>
            </div>

            {/* ── JUDUL DOKUMEN ── */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1e293b', margin: '0 0 6px 0', borderBottom: '1px solid #e2e8f0', display: 'inline-block', paddingBottom: '6px' }}>
                TANDA BUKTI REGISTRASI & INVOICE PEMBAYARAN
              </h1>
              <p style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: '#64748b', margin: 0 }}>
                Nomor Dokumen: INV-{formatNoPendaftaran(data.periode, data.id)}
              </p>
            </div>

            {/* ── DATA PENDAFTAR (2 columns) ── */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
              padding: '14px 16px', marginBottom: '20px',
              fontSize: '11px', lineHeight: 1.8, fontWeight: 600, color: '#475569'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', width: '110px', flexShrink: 0 }}>No. Pendaftaran</span>
                  <span style={{ color: '#0f172a', fontFamily: 'monospace', fontWeight: 800 }}>: {formatNoPendaftaran(data.periode, data.id)}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', width: '110px', flexShrink: 0 }}>No. Invoice</span>
                  <span style={{ color: '#0f172a', fontFamily: 'monospace', fontWeight: 800 }}>: INV-{formatNoPendaftaran(data.periode, data.id)}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', width: '110px', flexShrink: 0 }}>Tanggal Daftar</span>
                  <span style={{ color: '#0f172a' }}>: {tglDaftarFormatted}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', width: '110px', flexShrink: 0 }}>Periode Ajaran</span>
                  <span style={{ color: '#0f172a', fontWeight: 800 }}>: {data.periode || "2026-2027"}</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', width: '110px', flexShrink: 0 }}>Nama Pendaftar</span>
                  <span style={{ color: '#0f172a', fontWeight: 800, textTransform: 'uppercase' }}>: {data.nama}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', width: '110px', flexShrink: 0 }}>NISN Pendaftar</span>
                  <span style={{ color: '#0f172a', fontFamily: 'monospace', fontWeight: 800 }}>: {data.nisn}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', width: '110px', flexShrink: 0 }}>Program Rombel</span>
                  <span style={{ color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>: {data.jurusan_1 || "-"}</span>
                </div>
              </div>
            </div>

            {/* ── TABEL TAGIHAN ── */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1e293b' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b' }}>
                    No.
                  </th>
                  <th style={{ padding: '8px 0', textAlign: 'left', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b' }}>
                    Deskripsi Alokasi Tagihan
                  </th>
                  <th style={{ padding: '8px 0', textAlign: 'right', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', width: '140px' }}>
                    Jumlah (Rp)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 0', color: '#0f172a' }}>1</td>
                  <td style={{ padding: '10px 0', color: '#0f172a', fontWeight: 700 }}>
                    Biaya Registrasi Formulir PPDB SMK Taruna Bhakti
                    <span style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: '#94a3b8', marginTop: '2px' }}>
                      Alokasi administrasi berkas dan formulir online
                    </span>
                  </td>
                  <td style={{ padding: '10px 0', textAlign: 'right', color: '#0f172a', fontWeight: 800 }}>
                    Rp {regCost.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── TOTAL ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <div style={{ width: '260px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#64748b', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span>Subtotal</span>
                  <span>Rp {regCost.toLocaleString("id-ID")}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#64748b', padding: '6px 0' }}>
                  <span>Pajak (PPN 0%)</span>
                  <span>Nihil</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 900, color: '#0f172a', padding: '8px 0', borderTop: '2px solid #1e293b' }}>
                  <span>Total Tagihan</span>
                  <span style={{ color: '#2563eb', fontWeight: 900 }}>Rp {regCost.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* ── INFO PEMBAYARAN (screen only) ── */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div>
                  <span style={{ fontWeight: 800 }}>Metode Bayar: </span>
                  <span style={{ color: '#0f172a', fontWeight: 700, textTransform: 'uppercase' }}>
                    {data.metode_pembayaran === 'Transfer Manual' ? 'Transfer' : data.metode_pembayaran}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: 800 }}>Status Bayar: </span>
                  <span style={{ fontWeight: 800, textTransform: 'uppercase', color: data.payment_status === 'Paid' ? '#059669' : '#d97706' }}>
                    {data.payment_status === 'Paid' ? 'LUNAS (VERIFIED)' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── HIMBAUAN BERKAS FISIK ── */}
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '20px',
              fontSize: '11px',
              color: '#92400e',
              lineHeight: '1.6',
              fontWeight: 600
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 900, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ fontSize: '14px' }}>⚠️</span>
                Penting: Bawa Berkas Fisik!
              </div>
              <p style={{ margin: '0 0 8px 0' }}>
                Harap datang langsung ke loket sekretariat PPDB sekolah untuk verifikasi fisik berkas-berkas pendaftaran berikut:
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                <li>Fotokopi Kartu Keluarga (KK)</li>
                <li>Fotokopi KTP Orang Tua (Ayah &amp; Ibu)</li>
                <li>Akta Kelahiran asli &amp; Fotokopi</li>
                <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir</li>
                <li>Pas foto berwarna terbaru ukuran 3x4 (3 lembar)</li>
              </ul>
            </div>

            {/* ── FOOTER NOTE (print only) ── */}
            <p style={{ marginTop: '16px', fontSize: '8px', color: '#94a3b8', textAlign: 'center', fontWeight: 500 }}>
              Dokumen ini dicetak otomatis oleh Sistem PPDB SMK Taruna Bhakti Depok dan sah sebagai bukti registrasi.
            </p>

          </div>
        </div>

        {/* ===== ACTION PANEL (screen only) ===== */}
        <div className="action-panel no-print" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Himbauan Pengiriman Struk untuk Siswa */}
          {!isAdmin && data.payment_status === "Paid" && (
            <div className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" style={{
              border: '1px solid',
              borderRadius: '20px',
              padding: '20px',
              fontSize: '10px',
              fontWeight: 'bold',
              lineHeight: '1.6',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
            }}>
              📢 HIMBAUAN:<br />
              Struk bukti registrasi & invoice resmi pembayaran yang telah diverifikasi akan dikirimkan oleh Panitia PPDB ke nomor WhatsApp Anda yang terdaftar.
            </div>
          )}

          {/* Print & Return */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800" style={{ borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <h3 className="text-slate-700 dark:text-slate-200" style={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              Tindakan Nota
            </h3>

            <button 
              onClick={handlePrint}
              style={{
                width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #2563eb, #4338ca)',
                color: 'white', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                padding: '14px 20px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37,99,235,0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.2)'; }}
            >
              <Printer size={15} />
              Cetak / Simpan PDF
            </button>

            <Link href={isAdmin ? (schoolSlug ? `/${schoolSlug}/dashboard/pendaftar` : "/dashboard/pendaftar") : (schoolSlug ? `/${schoolSlug}` : "/")} className="bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300" style={{
              width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              fontWeight: 900, fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '12px 20px', borderRadius: '14px', textDecoration: 'none',
              marginTop: '10px', transition: 'background 0.2s'
            }}>
              <ArrowLeft size={13} />
              {isAdmin ? "Kembali ke Dashboard" : "Kembali ke Beranda"}
            </Link>
          </div>

          {/* WhatsApp Action */}
          {data.payment_status === "Paid" && (
            isAdmin ? (
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-200/50 dark:border-slate-700" style={{
                borderRadius: '20px',
                padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '44px', height: '44px', background: '#d1fae5', color: '#059669',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <Phone size={18} />
                </div>
                <h4 className="text-slate-700 dark:text-slate-200" style={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 0' }}>
                  Kirim Invoice WA
                </h4>
                <p className="text-slate-500 dark:text-slate-400" style={{ fontSize: '10px', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                  Kirim dokumen bukti registrasi & invoice resmi ke nomor WhatsApp calon siswa ({data.whatsapp}).
                </p>
                <button
                  onClick={handleSendWhatsApp}
                  style={{
                    width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                    padding: '12px 20px', background: 'linear-gradient(135deg, #059669, #22c55e)',
                    color: 'white', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase',
                    letterSpacing: '0.1em', borderRadius: '14px', border: 'none', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(5,150,105,0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Phone size={12} />
                  Kirim Invoice WA
                </button>
              </div>
            ) : (
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-200/50 dark:border-slate-700" style={{
                borderRadius: '20px',
                padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '44px', height: '44px', background: '#d1fae5', color: '#059669',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <Phone size={18} />
                </div>
                <h4 className="text-slate-700 dark:text-slate-200" style={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 0' }}>
                  Gabung Grup WhatsApp
                </h4>
                <p className="text-slate-500 dark:text-slate-400" style={{ fontSize: '10px', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                  Hubungkan dengan pendaftar PPDB lainnya, berkas fisik, dan info jadwal tes seleksi.
                </p>
                <a
                  href={sanitizeUrl(waGroupUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                    padding: '12px 20px', background: 'linear-gradient(135deg, #059669, #22c55e)',
                    color: 'white', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase',
                    letterSpacing: '0.1em', borderRadius: '14px', textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(5,150,105,0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Phone size={12} />
                  Gabung WhatsApp
                </a>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
