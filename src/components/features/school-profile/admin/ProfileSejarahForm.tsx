"use client";

import React from "react";

interface ProfileSejarahFormProps {
  ringkasan: string;
  setRingkasan: (val: string) => void;
  videoProfilUrl: string;
  setVideoProfilUrl: (val: string) => void;
  sejarah: string;
  setSejarah: (val: string) => void;
}

export function ProfileSejarahForm({
  ringkasan,
  setRingkasan,
  videoProfilUrl,
  setVideoProfilUrl,
  sejarah,
  setSejarah,
}: ProfileSejarahFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Sejarah &amp; Media Profil
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Atur deskripsi ringkas, video YouTube company profile, dan sejarah lengkap.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Ringkasan / Tagline Profil (Hero)
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {ringkasan.length}/300
            </span>
          </div>
          <textarea
            maxLength={300}
            value={ringkasan}
            onChange={(e) => setRingkasan(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Deskripsi ringkas yang tampil di bawah judul 'Tentang Sekolah'..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            URL Video YouTube Company Profile
          </label>
          <input
            type="text"
            maxLength={255}
            value={videoProfilUrl}
            onChange={(e) => setVideoProfilUrl(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Contoh: https://www.youtube.com/watch?v=GR5wYYT4PJ8"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Sejarah Lengkap Sekolah
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {sejarah.length}/5000
            </span>
          </div>
          <textarea
            maxLength={5000}
            value={sejarah}
            onChange={(e) => setSejarah(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="SMK Taruna Bhakti didirikan pada tahun..."
          />
        </div>
      </div>
    </div>
  );
}
