"use client";

import React from "react";
import {
  Users,
  BookOpen,
  Database,
  Award,
  Activity,
} from "lucide-react";

export function RegionalStatsSection() {
  const metrics = [
    {
      label: "Total Siswa Terdaftar",
      value: "420.000+",
      sub: "Siswa Aktif Terdaftar",
      badge: "TK, SD, SMP & SMA/SMK",
      icon: Users,
      color: "text-[#8EC9F6] bg-[#8EC9F6]/10 border-[#8EC9F6]",
    },
    {
      label: "Modul & Mata Pelajaran",
      value: "1.250+",
      sub: "Modul Pembelajaran Interaktif",
      badge: "Kurikulum Merdeka",
      icon: BookOpen,
      color: "text-[#FFD33B] bg-[#FFD33B]/10 border-[#FFD33B]",
    },
    {
      label: "Data Transaksi Terproses",
      value: "1,8 Miliar+",
      sub: "Data Akademik & Nilai Real-Time / Hari",
      badge: "Infrastruktur Cepat",
      icon: Database,
      color: "text-[#E86BC6] bg-[#E86BC6]/10 border-[#E86BC6]",
    },
    {
      label: "Tingkat Kepuasan Sekolah",
      value: "99,4%",
      sub: "Kelulusan & Keandalan Sistem",
      badge: "Terverifikasi",
      icon: Award,
      color: "text-[#45C06B] bg-[#45C06B]/10 border-[#45C06B]",
    },
  ];

  return (
    <section className="py-20 bg-[#2A1B1D] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD33B]/20 text-[#FFD33B] text-xs font-bold border border-[#FFD33B]/60">
            <Activity className="w-3.5 h-3.5 text-[#FFD33B]" />
            Data & Statistik
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dampak Terukur Secara Nasional
          </h2>

          <p className="text-white/75 text-base leading-relaxed font-medium">
            Data empiris yang mendorong transformasi digital pendidikan di ribuan sekolah di Indonesia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/10 border border-white/30 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FFD33B]/20 border border-[#FFD33B]/30 text-[#FFD33B] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-white border border-white/30">
                      {m.badge}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {m.value}
                  </div>

                  <h3 className="text-sm font-bold text-[#8EC9F6] mb-1">
                    {m.label}
                  </h3>

                  <p className="text-xs text-white/70">{m.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
