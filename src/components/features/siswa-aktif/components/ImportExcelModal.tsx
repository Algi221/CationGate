"use client";

import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, X } from "lucide-react";
import { parseActiveStudentsFile, downloadActiveStudentsTemplate } from "../utils/excelHelper";
import { ImportPreviewRow } from "../types";

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  addToast: (title: string, message: string, type: "success" | "error" | "info" | "warning") => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  addToast
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
  const [rawStudents, setRawStudents] = useState<Record<string, unknown>[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      addToast("Format File Salah", "Harap unggah file dengan format .xlsx atau .xls", "error");
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);
    setValidationErrors([]);
    setPreviewRows([]);
    setRawStudents([]);

    try {
      const { rows, rawStudents: students, errors } = await parseActiveStudentsFile(selectedFile);
      if (rows.length === 0) {
        addToast("File Kosong", "Tidak ditemukan data siswa pada file Excel yang diunggah.", "warning");
        setFile(null);
      } else {
        setPreviewRows(rows);
        setRawStudents(students);
        setValidationErrors(errors);
        addToast("File Berhasil Dibaca", `Terdeteksi ${rows.length} calon/siswa aktif siap diimpor.`, "info");
      }
    } catch (err: unknown) {
      console.error("Parse error:", err);
      addToast("Gagal Membaca File", err instanceof Error ? err.message : "Terjadi kesalahan membaca file Excel.", "error");
      setFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConfirmImport = async () => {
    if (rawStudents.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const token = localStorage.getItem("ppdb_admin_token");

      // Upload in chunks of 500
      const chunkSize = 500;
      const totalChunks = Math.ceil(rawStudents.length / chunkSize);
      let totalImported = 0;

      for (let i = 0; i < totalChunks; i++) {
        const chunk = rawStudents.slice(i * chunkSize, (i + 1) * chunkSize);
        const res = await fetch(`/api/siswa-aktif/import`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ students: chunk })
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || `Gagal mengimpor batch ${i + 1}`);
        }

        totalImported += data.count || chunk.length;
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      addToast("Impor Berhasil", `Berhasil memasukkan ${totalImported} siswa aktif ke dalam database.`, "success");
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      console.error("Upload error:", err);
      addToast("Gagal Mengimpor", err instanceof Error ? err.message : "Terjadi kesalahan koneksi server.", "error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewRows([]);
    setRawStudents([]);
    setValidationErrors([]);
    setIsUploading(false);
    setIsParsing(false);
    onClose();
  };

  // Group stats from preview
  const uniquePeriods = Array.from(new Set(previewRows.map(r => r.periode)));
  const uniqueClasses = Array.from(new Set(previewRows.map(r => r.diterima_kelas)));

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 lg:p-8 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all text-left">
        
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between bg-white dark:bg-[#0f172a] shrink-0 relative">
          <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide">
                Impor Data Siswa Aktif (Bulk Migrasi)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Masukkan ratusan atau ribuan data siswa dari Dapodik / Excel sekaligus tanpa input manual.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isUploading}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all relative z-10 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50 dark:bg-slate-950/20">
          
          {/* Step 1: Download Template Banner */}
          <div className="p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider block">
                1. Belum memiliki format file?
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Unduh template resmi CationGate yang sudah disesuaikan dengan 18 kolom lengkap (Nama Lengkap, NISN, NIK, NIPD, Jurusan, Kelas, Periode, L/P, dll).
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadActiveStudentsTemplate()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Download size={14} />
              <span>Unduh Template (.xlsx)</span>
            </button>
          </div>

          {/* Step 2: Upload Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]"
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
              <Upload size={24} />
            </div>

            {isParsing ? (
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider block">
                  Sedang Membaca & Memvalidasi File...
                </span>
                <p className="text-xs text-slate-400 font-medium">Harap tunggu sebentar.</p>
              </div>
            ) : file ? (
              <div className="space-y-1">
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={16} /> File Terpilih: {file.name}
                </span>
                <p className="text-xs text-slate-400 font-medium">
                  Ukuran: {(file.size / 1024).toFixed(1)} KB • Klik untuk mengganti file
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider block">
                  Tarik & Lepas File Excel Disini, atau <span className="text-blue-600 dark:text-blue-400 underline">Pilih File</span>
                </span>
                <p className="text-xs text-slate-400 font-medium">
                  Mendukung format Microsoft Excel (.xlsx, .xls).
                </p>
              </div>
            )}
          </div>

          {/* Validation Warnings if any */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs space-y-1">
              <span className="font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={14} /> Peringatan Validasi ({validationErrors.length} baris):
              </span>
              <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 font-medium max-h-24 overflow-y-auto">
                {validationErrors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
                {validationErrors.length > 5 && <li>...dan {validationErrors.length - 5} lainnya</li>}
              </ul>
            </div>
          )}

          {/* Preview Section */}
          {previewRows.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-black uppercase tracking-wider">
                    Total: {previewRows.length} Siswa
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-black uppercase tracking-wider">
                    {uniquePeriods.length} Periode ({uniquePeriods.join(", ")})
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-black uppercase tracking-wider">
                    {uniqueClasses.length} Kelas Rombel
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Menampilkan preview 5 baris pertama:
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                <div className="overflow-x-auto">                  <table className="w-full text-left text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-black text-[9px] uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50">
                        <th className="p-3 pl-4">NISN</th>
                        <th className="p-3">NIK</th>
                        <th className="p-3">NIPD</th>
                        <th className="p-3">Nama Lengkap</th>
                        <th className="p-3 text-center">L/P</th>
                        <th className="p-3">Tempat Lahir</th>
                        <th className="p-3">Tanggal Lahir</th>
                        <th className="p-3">Agama</th>
                        <th className="p-3">Alamat Lengkap</th>
                        <th className="p-3">No WhatsApp</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Asal Sekolah</th>
                        <th className="p-3">Jurusan</th>
                        <th className="p-3">Kelas</th>
                        <th className="p-3">Periode</th>
                        <th className="p-3">Nama Ayah</th>
                        <th className="p-3">Nama Ibu</th>
                        <th className="p-3">Telepon Ortu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {previewRows.slice(0, 5).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 pl-4 font-mono text-blue-600 dark:text-blue-400">{row.nisn || "-"}</td>
                          <td className="p-3">{row.nik || "-"}</td>
                          <td className="p-3">{row.nipd || "-"}</td>
                          <td className="p-3 font-extrabold text-slate-800 dark:text-white">{row.nama}</td>
                          <td className="p-3 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase border">
                              {(row.jenis_kelamin || "").startsWith("L") ? "L" : (row.jenis_kelamin || "").startsWith("P") ? "P" : "-"}
                            </span>
                          </td>
                          <td className="p-3">{row.tempat_lahir || "-"}</td>
                          <td className="p-3">{row.tgl_lahir || "-"}</td>
                          <td className="p-3">{row.agama || "-"}</td>
                          <td className="p-3">{row.alamat || "-"}</td>
                          <td className="p-3">{row.whatsapp || "-"}</td>
                          <td className="p-3">{row.email || "-"}</td>
                          <td className="p-3">{row.sekolah_asal || "-"}</td>
                          <td className="p-3">{row.jurusan || "-"}</td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.diterima_kelas || "-"}</td>
                          <td className="p-3 font-mono">{row.periode || "-"}</td>
                          <td className="p-3">{row.nama_ayah || "-"}</td>
                          <td className="p-3">{row.nama_ibu || "-"}</td>
                          <td className="p-3">{row.telepon_ortu || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar during Upload */}
          {isUploading && (
            <div className="space-y-2 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-blue-100 dark:border-blue-900/40">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <span>Mengunggah data siswa ({uploadProgress}%)...</span>
                <span>Harap tidak menutup halaman</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-600 to-indigo-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-white/5 cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={rawStudents.length === 0 || isUploading}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_8px_20px_rgba(16,185,129,0.25)] flex items-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Mengimpor ({rawStudents.length} Siswa)...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                <span>Mulai Impor {rawStudents.length > 0 ? `(${rawStudents.length} Siswa)` : ""}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
