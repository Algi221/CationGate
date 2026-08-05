import React from 'react';

interface LottiePlaceholderProps {
  title?: string;
  className?: string;
}

export const LottiePlaceholder: React.FC<LottiePlaceholderProps> = ({ 
  title = "Lottie Animation Placeholder", 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 min-h-[300px] text-center ${className}`}>
      <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{title}</h3>
      <p className="text-xs text-slate-500 mt-2 max-w-xs">
        Tempatkan file JSON Lottie Anda di sini. Komponen ini dapat diganti dengan Player Lottie React.
      </p>
    </div>
  );
};

export default LottiePlaceholder;
