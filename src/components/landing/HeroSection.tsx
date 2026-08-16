'use client';

import { motion } from 'framer-motion';
import { 
  Star, 
  Tag,
  Home, 
  Handshake, 
  Globe,
  Users,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  Play,
  ArrowUpRight
} from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';

export default function HeroPPDB() {
  // ARRAY UNTUK FITUR KARTU 5 (ALL-IN-ONE PACKAGE)
  const features = [
    { icon: Globe, text: 'Website Profil Sekolah Modern' },
    { icon: Users, text: 'Sistem PPDB Online Otomatis' },
    { icon: LayoutDashboard, text: 'Dashboard Admin & Siswa' },
    { icon: ShieldCheck, text: 'Domain SSL & Cloud Hosting' },
    { icon: Zap, text: 'Fitur Export & Import Data' },
  ];

  return (
    <div className="w-full min-h-screen pt-32 pb-12 px-4 sm:p-8 md:p-12 flex flex-col items-center justify-center font-sans text-heading relative overflow-hidden">
      
      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--green) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="w-full max-w-7xl mx-auto z-10 flex flex-col items-center gap-8 py-2">

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-3xl mx-auto my-1 space-y-4"
        >
          <h3 className="text-xl sm:text-2xl font-black text-heading tracking-tight">
            "Satu Platform Terpadu Untuk Transformasi Digital Sekolah Anda"
          </h3>

          <p className="text-xs sm:text-sm text-body font-medium max-w-xl mx-auto">
            Kelola pendaftaran siswa baru, informasi sekolah, hingga manajemen admin tanpa ribet.
          </p>

          {/* DUA TOMBOL WAJIB: LIVE PREVIEW & WATCH DEMO */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button className="px-6 py-3 rounded-full bg-[#23191C] hover:bg-[#3A2B30] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 group">
              <span>Live Preview</span>
              <ArrowUpRight className="w-4 h-4 text-[#F3C625] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button className="px-6 py-3 rounded-full bg-surface hover:bg-background text-heading font-extrabold text-xs sm:text-sm border border-border transition-all shadow-sm hover:-translate-y-0.5 flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-green fill-green" />
              <span>Watch Demo</span>
            </button>
          </div>
        </motion.div>

        {/* BENTO GRID WRAPPER */}
        <div className="w-full relative">

          {/* AVATAR STACK MELAYANG DI TENGAH GRID */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            transition={{ delay: 0.35 }}
            className="absolute top-[38%] left-[50%] md:top-10/12 md:left-2/3 ml-0 md:ml-6 -translate-x-1/2 md:-translate-x-10/12 -translate-y-1/2 z-30 flex items-center justify-center gap-2 md:gap-3 py-2 px-3 md:px-4 rounded-full border border-border shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-[#0f172a]/80 pointer-events-auto scale-90 md:scale-100"
          >
            {/* Stack Avatar */}
            <div className="flex items-center -space-x-2.5 overflow-hidden p-0.5">
              <img 
                className="inline-block h-7 w-7 rounded-full ring-2 ring-surface object-cover shadow-xs" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Mitra Sekolah 1" 
              />
              <img 
                className="inline-block h-7 w-7 rounded-full ring-2 ring-surface object-cover shadow-xs" 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                alt="Mitra Sekolah 2" 
              />
              <img 
                className="inline-block h-7 w-7 rounded-full ring-2 ring-surface object-cover shadow-xs" 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" 
                alt="Mitra Sekolah 3" 
              />
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2A1B1D] text-[#F3C625] text-[9px] font-black ring-2 ring-surface shadow-xs">
                +12
              </div>
            </div>

            {/* Rating & Text */}
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                ))}
                <span className="text-[10px] font-black text-heading ml-1">5.0</span>
              </div>
              <span className="text-[10px] font-bold text-muted mt-0.5">
                99+ Sekolah menilai
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start"
          >
            
            {/* KARTU 1: PREVIEW DASHBOARD / PORTAL */}
            <div className="md:col-span-3 h-[420px] sm:h-[480px] rounded-2xl overflow-hidden relative shadow-md group border border-border">
              <img 
                src="/assets/landing/mockup.png" 
                alt="PPDB Dashboard Preview" 
                className="w-full h-full object-cover object-left transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B1D]/80 via-transparent to-transparent flex flex-col justify-end p-4 text-slate-50">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-green px-2 py-0.5 rounded-md w-fit mb-1 text-dark-brown">
                  Portal PPDB
                </span>
                <p className="text-xs font-semibold">Sistem Pendaftaran Online</p>
              </div>
            </div>

            {/* KARTU 2: PINK CARD */}
            <div className="md:col-span-2 h-70 sm:h-78 bg-[#E86BC6] text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 blur-sm pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/15 pointer-events-none" />

              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2 z-10">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="text-4xl font-black tracking-tight text-white z-10">
                <NumberTicker value={127} className="font-black text-white" />+
              </div>
              <p className="text-sm font-bold text-white/90 leading-tight mt-1 z-10">
                Sekolah Terdaftar
              </p>
            </div>

            {/* KARTU 3: DISKON & PROMO SPESIAL */}
            <div className="md:col-span-3 h-55 sm:h-50 bg-surface rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group border border-border">
              <div className="absolute top-0 right-0 bg-[#23191C] text-white font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-bl-xl shadow-xs tracking-wider flex items-center gap-1 z-10">
                <Tag className="w-3 h-3 text-[#F3C625]" />
                <span>HEMAT 30%</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-green">Early Bird Promo</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-heading tracking-tight">
                    <NumberTicker value={30} className="font-black text-heading" />%
                  </span>
                  <span className="text-xs font-bold text-green uppercase tracking-wide">OFF</span>
                </div>
                <p className="text-xs font-extrabold text-heading mt-1">Diskon Langganan PPDB</p>
                <p className="text-[10px] text-muted">Khusus 50 sekolah pendaftar pertama</p>
              </div>
            </div>

            {/* KARTU 4: BIRU CARD */}
            <div className="md:col-span-2 h-70 sm:h-78 bg-[#8EC9F6] text-surface rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/30 blur-sm pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />

              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2 z-10">
                <Handshake className="w-5 h-5 text-[#2A1B1D]" />
              </div>
              <div className="text-4xl font-black tracking-tight text-[#2A1B1D] z-10">
                <NumberTicker value={12} className="font-black text-[#2A1B1D]" />+
              </div>
              <p className="text-sm font-bold text-[#2A1B1D]/80 leading-tight mt-1 z-10">
                Mitra Lembaga
              </p>
            </div>

       
<div className="md:col-span-2 h-[420px] sm:h-[480px] bg-transparent text-[#2A1B1D] rounded-2xl flex flex-col justify-between relative group border-0">
  
  <div className="space-y-1.5 z-10 bg-[#F3C625] p-6 rounded-2xl">
    <h1 className="text-2xl font-black leading-tight tracking-tight pt-1">
      Apa Saja Yang Anda Dapatkan?
    </h1>
  </div>

  <div className="grid lg:grid-cols-1 grid-cols-2 gap-3 my-auto py-2 z-10">
    {features.map((item, index) => {
      const Icon = item.icon;
      return (
        <div key={index} className="flex items-center gap-2.5 p-3 bg-white/40 backdrop-blur-xs rounded-xl border border-white/10 shadow-sm transition hover:bg-white/60">
          <div className="w-6 h-6 rounded-lg bg-[#2A1B1D] flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-[#F3C625]" />
          </div>
          <span className="text-sm font-extrabold leading-tight text-[#2A1B1D]">
            {item.text}
          </span>
        </div>
      );
    })}
  </div>

</div>
          </motion.div>
        </div>

        <div className="flex md:hidden justify-center items-center gap-3 py-2 px-4 rounded-full bg-surface border border-border shadow-xs mt-2">
          <div className="flex items-center -space-x-2">
            <img className="h-6 w-6 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
            <img className="h-6 w-6 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2A1B1D] text-[#F3C625] text-[8px] font-bold">+12</div>
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>5.0 (99+ Sekolahmenilai)</span>
          </div>
        </div>

      </div>

    </div>
  );
}