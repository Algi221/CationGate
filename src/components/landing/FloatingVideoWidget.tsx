"use client";

import React, { useState, useRef, useEffect } from "react";

interface FloatingVideoWidgetProps {
  onClick: () => void;
}

export const FloatingVideoWidget: React.FC<FloatingVideoWidgetProps> = ({
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Tambahan Ref untuk menghitung batas (bounding box) elemen
  const widgetRef = useRef<HTMLDivElement>(null);

  // Nambahin variabel buat nyimpen ukuran layar dan posisi asal
  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    isMoved: false,
    baseX: 0,
    baseY: 0,
    width: 0,
    height: 0,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".close-btn")) return;

    e.preventDefault();
    setIsDragging(true);
    dragInfo.current.isMoved = false;

    dragInfo.current.startX = e.clientX - position.x;
    dragInfo.current.startY = e.clientY - position.y;

    // Hitung posisi asli dan ukuran elemen saat mulai di-drag
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      dragInfo.current.baseX = rect.left - position.x;
      dragInfo.current.baseY = rect.top - position.y;
      dragInfo.current.width = rect.width;
      dragInfo.current.height = rect.height;
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      let newX = e.clientX - dragInfo.current.startX;
      let newY = e.clientY - dragInfo.current.startY;

      const { baseX, baseY, width, height } = dragInfo.current;

      // Kasih jarak (padding) 16px biar nggak nempel banget di pojok layar
      const padding = 16;

      // Hitung batas minimal dan maksimal koordinat pergerakan
      const minX = -baseX + padding;
      const maxX = window.innerWidth - width - baseX - padding;

      const minY = -baseY + padding;
      const maxY = window.innerHeight - height - baseY - padding;

      // Kunci (Clamp) nilai X dan Y supaya nggak keluar dari batas layar
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      // Gunakan callback di setPosition biar state-nya selalu fresh dan performanya aman
      setPosition((prev) => {
        if (Math.abs(newX - prev.x) > 3 || Math.abs(newY - prev.y) > 3) {
          dragInfo.current.isMoved = true;
        }
        return { x: newX, y: newY };
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]); // Hapus position.x & y dari dependency biar event listener gak bolak-balik nge-reset

  const handleClick = () => {
    if (!dragInfo.current.isMoved) {
      onClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={widgetRef} // Jangan lupa sambungin Ref ke parent div ini
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={`fixed bottom-6 right-6 w-[200px] aspect-video rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)] z-[90] group bg-slate-900 border border-slate-700 touch-none select-none ${
        isDragging
          ? "cursor-grabbing"
          : "cursor-grab hover:scale-105 transition-transform duration-300"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}
        className="close-btn absolute top-2 right-2 z-30 w-6 h-6 flex items-center justify-center bg-black/60 hover:bg-red-500/90 text-white rounded-full transition-colors duration-200 backdrop-blur-md opacity-0 group-hover:opacity-100"
        title="Close Video"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="absolute inset-0 pointer-events-none w-[400px] origin-top-left scale-50">
        <iframe
          src="https://www.youtube-nocookie.com/embed/1FcVJxxPWh4?autoplay=1&mute=1&loop=1&playlist=1FcVJxxPWh4&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1"
          title="Floating Background Video"
          className="w-full aspect-video object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

      <div className="absolute bottom-2 left-2 flex items-center text-white z-20 pointer-events-none">
        <div className="w-6 h-6 border border-white/50 rounded-full flex items-center justify-center mr-2 bg-black/40 backdrop-blur-md">
          <span className="text-[8px] ml-[2px]">▶</span>
        </div>
        <span className="text-xs font-semibold tracking-wide drop-shadow-lg">
          Watch Demo
        </span>
      </div>
    </div>
  );
};
