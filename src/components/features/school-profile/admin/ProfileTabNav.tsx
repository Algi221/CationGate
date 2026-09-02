"use client";

import React from "react";
import { School, Video, UserCheck, Target, ListChecks } from "lucide-react";

interface ProfileTabNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProfileTabNav({ activeTab, setActiveTab }: ProfileTabNavProps) {
  const tabs = [
    { id: "identitas", label: "Identitas & Logo", icon: School },
    { id: "sejarah", label: "Sejarah & Video Profil", icon: Video },
    { id: "pimpinan", label: "Pimpinan Sekolah", icon: UserCheck },
    { id: "visi_misi", label: "Visi & Misi", icon: Target },
    { id: "tujuan", label: "Tujuan Institusi", icon: ListChecks },
  ];

  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              isActive
                ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
