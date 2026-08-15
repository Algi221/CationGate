"use client";

import React, { useEffect, useState } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, School, Target, ListChecks, FileText } from "lucide-react";

import SafeImage from "@/components/SafeImage";

export default function ProfilSekolahPublicPage() {
  const { ppdbLogo, ppdbTitle, profilSekolah, isSchoolNotFound, schoolStatus } = usePPDB();
  const params = useParams();
  const router = useRouter();
  const schoolSlug = params?.school_slug as string;
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("sejarah");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (isSchoolNotFound || schoolStatus === 'TAKEDOWN') {
    router.push('/');
    return null;
  }

  const identitas = profilSekolah?.identitas || {};
  const sejarah = profilSekolah?.sejarah || "Sejarah belum ditambahkan.";
  const visi = profilSekolah?.visi_misi?.visi || "Visi belum ditambahkan.";
  const misi = profilSekolah?.visi_misi?.misi || "Misi belum ditambahkan.";
  const tujuan = profilSekolah?.tujuan || "Tujuan belum ditambahkan.";

  const navItems = [
    { id: 'sejarah', label: 'Sejarah', icon: <FileText size={18} /> },
    { id: 'identitas', label: 'Identitas Sekolah', icon: <School size={18} /> },
    { id: 'visimisi', label: 'Visi & Misi', icon: <Target size={18} /> },
    { id: 'tujuan', label: 'Tujuan', icon: <ListChecks size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
      
      {/* Navbar Minimalis */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-16 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href={`/${schoolSlug}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
              <SafeImage src={ppdbLogo} alt="Logo" fill sizes="32px" className="object-cover" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white hidden sm:block truncate max-w-[200px]">{ppdbTitle}</span>
          </div>
        </div>
      </nav>

      {/* Hero Profil */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 border border-slate-200 dark:border-slate-700">
            <Building2 size={32} className="text-slate-700 dark:text-slate-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">Profil Sekolah</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">Mengenal lebih dekat {ppdbTitle}, mulai dari sejarah, identitas, hingga visi dan misi pendidikan kami.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-1 shadow-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all text-left ${
                  activeSection === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`${activeSection === item.id ? 'opacity-100' : 'opacity-50'}`}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-sm min-h-[500px]">
            
            {activeSection === 'sejarah' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-6">
                  <FileText size={28} />
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sejarah Singkat</h2>
                </div>
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {sejarah}
                </div>
              </div>
            )}

            {activeSection === 'identitas' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-6">
                  <School size={28} />
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Identitas Sekolah</h2>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {[
                      { label: "Nama Sekolah", value: identitas.nama },
                      { label: "Status Akreditasi", value: identitas.akreditasi },
                      { label: "Alamat Lengkap", value: identitas.alamat },
                      { label: "NPSN", value: identitas.npsn },
                      { label: "NIS", value: identitas.nis },
                      { label: "NSS", value: identitas.nss },
                      { label: "Tahun Berdiri", value: identitas.tahun_berdiri },
                      { label: "Email", value: identitas.email }
                    ].map((row, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                        <div className="w-full sm:w-1/3 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 sm:mb-0 shrink-0">
                          {row.label}
                        </div>
                        <div className="w-full sm:w-2/3 text-sm font-bold text-slate-900 dark:text-slate-200 whitespace-pre-wrap">
                          {row.value || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'visimisi' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-2">
                  <Target size={28} />
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Visi & Misi</h2>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Visi Sekolah</h3>
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 rounded-xl font-medium text-lg leading-relaxed border border-blue-100 dark:border-blue-800/50">
                    "{visi}"
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Misi Sekolah</h3>
                  <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {misi}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'tujuan' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-6">
                  <ListChecks size={28} />
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Tujuan Sekolah</h2>
                </div>
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {tujuan}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
    </div>
  );
}
