"use client";

import React from "react";
import { X, Save, RefreshCw, User } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempNama: string;
  setTempNama: (val: string) => void;
  tempUsername: string;
  setTempUsername: (val: string) => void;
  tempEmail: string;
  setTempEmail: (val: string) => void;
  onSave: () => void;
  saving: boolean;
  inputClass: string;
  labelClass: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  tempNama,
  setTempNama,
  tempUsername,
  setTempUsername,
  tempEmail,
  setTempEmail,
  onSave,
  saving,
  inputClass,
  labelClass,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <User size={18} className="text-blue-600" /> Edit Biodata Profil
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Nama Lengkap</label>
            <input type="text" value={tempNama} onChange={(e) => setTempNama(e.target.value)} className={inputClass} placeholder="Masukkan nama lengkap" />
          </div>
          <div>
            <label className={labelClass}>Username</label>
            <input type="text" value={tempUsername} onChange={(e) => setTempUsername(e.target.value)} className={inputClass} placeholder="Masukkan username" />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} className={inputClass} placeholder="contoh@sekolah.com" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium transition-colors">
            Batal
          </button>
          <button onClick={onSave} disabled={saving} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70">
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}