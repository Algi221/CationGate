"use client";

import React, { useRef, useState } from "react";
import { 
  Upload, FileText, ArrowLeft, ShieldCheck, CheckCircle2, 
  FileUp, Trash2, Eye, Award, Contact, Share2, Info
} from "lucide-react";
import { SchoolVerificationFormData, VerificationDocumentType, VerificationDocumentItem } from "../types";

interface Step3UploadSKProps {
  formData: SchoolVerificationFormData;
  loading: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileSelected?: (file: File, type?: VerificationDocumentType) => void;
  handleAddDocument?: (type: VerificationDocumentType, file: File) => void;
  handleRemoveDocument?: (docId: string) => void;
  handleSubmit: () => void;
  handlePrev: () => void;
}

const DOCUMENT_TYPES: Array<{
  id: VerificationDocumentType;
  title: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    id: "SK_OPERASIONAL",
    title: "SK Izin Operasional",
    desc: "Surat izin operasional / pendirian dari Kemendikbudristek / Kemenag.",
    icon: <Award size={18} />
  },
  {
    id: "ID_CARD",
    title: "Kartu Identitas (ID Card)",
    desc: "ID Card pegawai / SK penugasan resmi Kepala Sekolah atau Operator.",
    icon: <Contact size={18} />
  },
  {
    id: "SOSMED_PROOF",
    title: "Bukti Akun Sosmed Resmi",
    desc: "Tangkapan layar kepemilikan / dashboard admin media sosial resmi sekolah.",
    icon: <Share2 size={18} />
  }
];

export const Step3UploadSK: React.FC<Step3UploadSKProps> = ({
  formData,
  loading,
  handleFileSelected,
  handleAddDocument,
  handleRemoveDocument,
  handleSubmit,
  handlePrev
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<VerificationDocumentType>("SK_OPERASIONAL");
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalDoc, setPreviewModalDoc] = useState<VerificationDocumentItem | null>(null);

  // Normalize documents list
  const documents: VerificationDocumentItem[] = formData.documents && formData.documents.length > 0
    ? formData.documents
    : formData.sk_document_name
    ? [{
        id: "doc-sk-legacy",
        type: "SK_OPERASIONAL",
        name: formData.sk_document_name,
        url: formData.sk_document_url
      }]
    : [];

  const maxDocsReached = documents.length >= 2;

  const onProcessFile = (file: File) => {
    if (handleAddDocument) {
      handleAddDocument(selectedType, file);
    } else if (handleFileSelected) {
      handleFileSelected(file, selectedType);
    }
  };

  const handleBoxClick = () => {
    if (maxDocsReached) return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!maxDocsReached) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (maxDocsReached) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onProcessFile(file);
    }
  };

  const getTypeBadge = (type: VerificationDocumentType) => {
    switch (type) {
      case "SK_OPERASIONAL":
        return { label: "SK Izin Operasional", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800" };
      case "ID_CARD":
        return { label: "ID Card / KTP Penanggung Jawab", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800" };
      case "SOSMED_PROOF":
        return { label: "Bukti Sosmed Resmi", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300 border-pink-200 dark:border-pink-800" };
      default:
        return { label: "Dokumen Verifikasi", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
          Unggah Berkas Legalitas &amp; Verifikasi Instansi
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Unggah minimal 1 dokumen dan maksimal 2 dokumen pendukung (SK Operasional, ID Card Kepsek/Pegawai, atau Bukti Akun Sosmed Resmi Sekolah).
        </p>
      </div>

      {/* DOCUMENT TYPE SELECTOR PILLS */}
      {!maxDocsReached && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            Pilih Jenis Dokumen yang Akan Diunggah:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DOCUMENT_TYPES.map((dt) => {
              const isSelected = selectedType === dt.id;
              return (
                <button
                  key={dt.id}
                  type="button"
                  onClick={() => setSelectedType(dt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}>
                      {dt.icon}
                    </div>
                    {isSelected && <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                      {dt.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {dt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CLICKABLE & DRAGGABLE DROPZONE */}
      {!maxDocsReached ? (
        <div
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3.5 cursor-pointer transition-all duration-200 select-none group ${
            isDragging
              ? "border-blue-500 bg-blue-50/80 dark:bg-blue-950/50 scale-[1.01] shadow-lg shadow-blue-500/10"
              : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-950/20"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onProcessFile(file);
              e.target.value = "";
            }}
            className="hidden"
          />

          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm ${
              isDragging
                ? "bg-blue-600 text-white animate-pulse"
                : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white"
            }`}
          >
            {isDragging ? <FileUp size={26} /> : <Upload size={26} />}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-extrabold text-slate-800 dark:text-white">
              {isDragging
                ? `Lepaskan Berkas ${DOCUMENT_TYPES.find(d => d.id === selectedType)?.title} di Sini...`
                : `Klik untuk Mengunggah ${DOCUMENT_TYPES.find(d => d.id === selectedType)?.title}`}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Format: PDF, JPG, JPEG, PNG (Maks. 5 MB) • {documents.length}/2 Dokumen Terunggah
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl flex items-center gap-3 text-xs font-bold text-blue-700 dark:text-blue-300">
          <Info size={18} className="shrink-0" />
          <span>Batas maksimal 2 dokumen telah terpenuhi. Anda dapat menghapus salah satu jika ingin mengganti dokumen.</span>
        </div>
      )}

      {/* UPLOADED DOCUMENTS LIST */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Dokumen yang Siap Diajukan ({documents.length}/2):
            </h4>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ✓ Minimal 1 dokumen terpenuhi
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {documents.map((doc, idx) => {
              const badge = getTypeBadge(doc.type);

              return (
                <div
                  key={doc.id || idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Dokumen #{idx + 1}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                        {doc.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {doc.url && (
                      <button
                        type="button"
                        onClick={() => setPreviewModalDoc(doc)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye size={14} /> Preview
                      </button>
                    )}
                    {handleRemoveDocument && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        title="Hapus Dokumen"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Preview {getTypeBadge(previewModalDoc.type).label}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{previewModalDoc.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-auto flex items-center justify-center bg-slate-50 dark:bg-slate-950 min-h-75">
              {previewModalDoc.url && (previewModalDoc.url.startsWith("data:image/") || previewModalDoc.name.match(/\.(jpg|jpeg|png)$/i)) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewModalDoc.url}
                  alt={previewModalDoc.name}
                  className="max-h-[60vh] rounded-2xl object-contain shadow-md"
                />
              ) : previewModalDoc.url && previewModalDoc.url.startsWith("data:application/pdf") ? (
                <iframe
                  src={previewModalDoc.url}
                  className="w-full h-[60vh] rounded-2xl border border-slate-200 dark:border-slate-800"
                  title="PDF Preview"
                />
              ) : (
                <div className="text-center space-y-3">
                  <FileText size={48} className="text-blue-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Dokumen siap ditinjau: {previewModalDoc.name}
                  </p>
                  {previewModalDoc.url && (
                    <a
                      href={previewModalDoc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Buka Dokumen di Tab Baru
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP NAVIGATION BUTTONS */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handlePrev}
          className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          <ArrowLeft size={15} /> Kembali
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || documents.length === 0}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
        >
          <ShieldCheck size={16} />
          {loading ? "Mengajukan Dokumen..." : "Kirim Pengajuan Verifikasi"}
        </button>
      </div>
    </div>
  );
};
