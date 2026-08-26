"use client";

import React, { createContext } from "react";
import { useToastStore, type Toast } from "@/stores/useToastStore";

export type { Toast } from "@/stores/useToastStore";

interface ToastContextType {
  toasts: Toast[];
  addToast: (title: string, message: string, type?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 w-full ${
            toast.type === "success"
              ? "bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : toast.type === "warning"
              ? "bg-amber-50/90 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
              : toast.type === "danger"
              ? "bg-rose-50/90 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
              : "bg-blue-50/90 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
              toast.type === "success"
                ? "bg-emerald-200/55 dark:bg-emerald-800/40"
                : toast.type === "warning"
                ? "bg-amber-200/55 dark:bg-amber-800/40"
                : toast.type === "danger"
                ? "bg-rose-200/55 dark:bg-rose-800/40"
                : "bg-blue-200/55 dark:bg-blue-800/40"
            }`}
          >
            {toast.type === "success" ? "✓" : toast.type === "warning" ? "⚠" : toast.type === "danger" ? "✕" : "ℹ"}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-0.5">{toast.title}</h4>
            <p className="text-xs font-medium leading-relaxed opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useToastStore((state) => state.toasts);
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toasts = useToastStore((state) => state.toasts);
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);

  return { toasts, addToast, removeToast };
}
