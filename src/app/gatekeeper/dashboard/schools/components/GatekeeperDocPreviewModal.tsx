"use client";

import React from "react";
import { FileText, Download, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadDocFile, safeOpenWindow, sanitizeDocPreviewUrl } from "@/lib/sanitizeUrl";

interface GatekeeperDocPreviewModalProps {
  previewDoc: { url: string; name: string; type?: string } | null;
  onClose: () => void;
}

export const GatekeeperDocPreviewModal: React.FC<GatekeeperDocPreviewModalProps> = ({
  previewDoc,
  onClose
}) => {
  if (!previewDoc) return null;

  const safePreviewUrl = sanitizeDocPreviewUrl(previewDoc.url);

  return (
    <div className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {previewDoc.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {previewDoc.type || "Dokumen Bukti Verifikasi Instansi"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => downloadDocFile(previewDoc.url, previewDoc.name)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Berkas
            </button>
            <button
              type="button"
              onClick={() => safeOpenWindow(previewDoc.url, previewDoc.name)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Tab Baru
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-auto bg-slate-100/50 dark:bg-slate-950/50 flex items-center justify-center min-h-[60vh]">
          {Boolean(previewDoc.name?.toLowerCase().endsWith(".pdf") || previewDoc.url?.includes("application/pdf") || previewDoc.url?.toLowerCase().endsWith(".pdf")) ? (
            <iframe
              src={safePreviewUrl}
              className="w-full h-[70vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              title={previewDoc.name}
            />
          ) : previewDoc.url?.startsWith("data:image/") || previewDoc.name?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
            <div className="max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={safePreviewUrl}
                alt={previewDoc.name}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
              />
            </div>
          ) : (
            <div className="text-center space-y-3 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
              <FileText className="w-12 h-12 text-blue-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{previewDoc.name}</h4>
              <p className="text-xs text-slate-500">Format berkas ini dapat langsung dibuka di tab baru atau diunduh ke perangkat Anda.</p>
              <div className="pt-2 flex justify-center gap-2">
                <Button onClick={() => downloadDocFile(previewDoc.url, previewDoc.name)} className="bg-blue-600 text-white text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" /> Unduh Dokumen
                </Button>
                <Button onClick={() => safeOpenWindow(previewDoc.url, previewDoc.name)} variant="outline" className="text-xs">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Buka Tab Baru
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
