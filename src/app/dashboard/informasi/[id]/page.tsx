// src/app/dashboard/informasi/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { Loader2, Check, X, ArrowRight, FileText, Calendar } from "lucide-react";

interface Informasi {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
  created_at?: string;
}

/**
 * Sanitize image URL to prevent DOM-based XSS.
 * Only allows safe schemes: https, http, or data:image (base64 from FileReader).
 */
function sanitizeImageUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }
  return ""; // Reject javascript: and other dangerous schemes
}

export default function EditInformasi({ params }: { params: { id: string } }) {
  const { adminToken, addToast } = usePPDB();
  const [informasi, setInformasi] = useState<Informasi | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [judul, setJudul] = useState<string>("");
  const [konten, setKonten] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string>("");

  const BACKEND_URL = "http://localhost:5000";

  const fetchDetail = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/informasi/${params.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setInformasi(data.data);
        setJudul(data.data.judul);
        setKonten(data.data.konten);
        setTanggal(data.data.tanggal?.split('T')[0] || data.data.tanggal);
        // parse foto_url if present
        if (data.data.foto_url) {
          try {
            const parsed = JSON.parse(data.data.foto_url);
            setFotoUrl(parsed.foto || "");
          } catch {
            setFotoUrl(data.data.foto_url as string);
          }
        }
      } else {
        addToast && addToast("Error", "Tidak dapat memuat data.", "danger");
      }
    } catch (e) {
      console.error(e);
      addToast && addToast("Error", "Gagal terhubung ke server.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !konten.trim() || !tanggal) {
      addToast && addToast("Warning", "Harap lengkapi semua kolom.", "warning");
      return;
    }
    setSubmitting(true);
    const mediaObj = fotoUrl ? { foto: fotoUrl } : {};
    const payload = {
      judul: judul.trim(),
      konten: konten.trim(),
      tanggal,
      foto_url: fotoUrl ? JSON.stringify(mediaObj) : null,
    };
    try {
      const res = await fetch(`${BACKEND_URL}/api/informasi/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        addToast && addToast("Berhasil Diperbarui", "Informasi berhasil diperbarui.", "success");
      } else {
        addToast && addToast("Error", json.message || "Gagal memperbarui.", "danger");
      }
    } catch (err) {
      console.error(err);
      addToast && addToast("Error", "Kesalahan jaringan.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!informasi) {
    return <p className="text-center py-12">Data tidak ditemukan.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
        Edit Informasi #{informasi.id}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Judul
          </label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Konten
          </label>
          <textarea
            value={konten}
            onChange={(e) => setKonten(e.target.value)}
            rows={6}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Foto / Poster (opsional)
          </label>
          {sanitizeImageUrl(fotoUrl) ? (
            <div className="flex items-center space-x-4 mb-2">
              <img src={sanitizeImageUrl(fotoUrl)} alt="Preview" className="h-24 w-24 object-cover rounded" />
              <button
                type="button"
                onClick={() => setFotoUrl("")}
                className="px-3 py-1 bg-rose-600 text-white rounded"
              >
                Hapus Foto
              </button>
            </div>
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === "string") {
                  setFotoUrl(reader.result);
                }
              };
              reader.readAsDataURL(file);
            }}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
          <a href="/dashboard/informasi" className="px-6 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 flex items-center">
            <ArrowRight size={16} />
            <span>Kembali ke Daftar</span>
          </a>
        </div>
      </form>
    </div>
  );
}
