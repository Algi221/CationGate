"use client";

import React from "react";
import Cropper, { Area } from "react-easy-crop";
import { Crop, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface CropPhotoModalProps {
  isOpen: boolean;
  cropImageSrc: string | null;
  crop: { x: number; y: number };
  setCrop: (val: { x: number; y: number }) => void;
  zoom: number;
  setZoom: (val: number) => void;
  rotation: number;
  setRotation: (val: number) => void;
  onCropComplete: (_: Area, croppedPixels: Area) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function CropPhotoModal({
  isOpen,
  cropImageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  rotation,
  setRotation,
  onCropComplete,
  onClose,
  onSave,
}: CropPhotoModalProps) {
  if (!isOpen || !cropImageSrc) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Sesuaikan Foto</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="relative w-full h-80 bg-slate-900">
          <Cropper
            image={cropImageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-6 py-4 space-y-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-slate-500" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <ZoomIn size={16} className="text-slate-500" />
          </div>
          <div className="flex items-center gap-3">
            <RotateCw size={16} className="text-slate-500" />
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs font-medium text-slate-500 w-10 text-right">
              {rotation}°
            </span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Crop size={14} /> Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
