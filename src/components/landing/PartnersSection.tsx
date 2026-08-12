"use client";

import React from "react";
import { ShieldCheck, Server, Database, Users, GraduationCap, LayoutDashboard } from "lucide-react";

export function PartnersSection() {
  const capabilities = [
    {
      name: "Sistem PPDB Cerdas",
      icon: <Users className="w-5 h-5 text-slate-700" />,
      desc: "Penerimaan murid baru otomatis dan transparan.",
    },
    {
      name: "Manajemen Siswa",
      icon: <GraduationCap className="w-5 h-5 text-slate-700" />,
      desc: "Kelola data akademik dan administrasi terpadu.",
    },
    {
      name: "Keamanan Data",
      icon: <ShieldCheck className="w-5 h-5 text-slate-700" />,
      desc: "Infrastruktur cloud dengan enkripsi standar bank.",
    },
    {
      name: "Dashboard Real-time",
      icon: <LayoutDashboard className="w-5 h-5 text-slate-700" />,
      desc: "Pantau performa sekolah dari satu layar.",
    },
    {
      name: "Infrastruktur Cloud",
      icon: <Server className="w-5 h-5 text-slate-700" />,
      desc: "Server berkinerja tinggi tanpa downtime.",
    },
    {
      name: "Integrasi Dapodik",
      icon: <Database className="w-5 h-5 text-slate-700" />,
      desc: "Sinkronisasi otomatis dengan data nasional.",
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          
          {/* SEO Optimized Copy */}
          <div className="md:w-1/3">
            <h2 className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-3">
              Infrastruktur Pendidikan
            </h2>
            <h3 className="text-3xl font-semibold text-slate-900 tracking-tight leading-tight mb-4">
              Platform penyedia layanan sistem penerimaan murid baru dan manajemen siswa yang baik.
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              CationGate didesain untuk skalabilitas dan keandalan tingkat tinggi. Membantu institusi pendidikan mengotomatisasi PPDB, sinkronisasi Dapodik, hingga manajemen akademik harian dalam satu ekosistem yang terjamin keamanannya.
            </p>
          </div>

          {/* Capabilities Bento Grid */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => (
              <div 
                key={i}
                className="group flex flex-col gap-3 p-5 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  {cap.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">{cap.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
