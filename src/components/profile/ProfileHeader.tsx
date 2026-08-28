"use client";

import React, { useRef } from "react";
import NextImage from "next/image";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  displayNama: string;
  displayRole: string;
  displaySchool: string;
  previewPhoto: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileHeader({
  displayNama,
  displayRole,
  displaySchool,
  previewPhoto,
  onPhotoChange,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
      <div className="relative group shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
          {previewPhoto ? (
            <NextImage src={previewPhoto} alt="Profil" width={80} height={80} unoptimized className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-slate-400">
              {displayNama.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
        >
          <Camera size={14} />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
      </div>
      
      <div className="flex-1 mt-1">
        <h2 className="text-xl font-bold text-slate-800 mb-1">{displayNama}</h2>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-slate-500 mt-1">
          <span className="flex items-center gap-1.5">
            {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} <span className="hidden md:inline mx-1">|</span>
          </span>
          <span className="flex items-center gap-1.5">
            {displaySchool}
          </span>
        </div>
      </div>
    </div>
  );
}