"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Menu, X, CheckCircle2, ArrowRight, LayoutDashboard,
  Users, ShieldCheck, Database, Zap, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function CationGateSaaSLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden flex flex-col">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              CG
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">CationGate</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#preview" className="hover:text-blue-600 transition-colors">Preview</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/daftar">
              <Button className="rounded-full shadow-sm">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[60] bg-white p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <span className="text-lg font-bold tracking-tight text-slate-900">CationGate</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <div className="flex flex-col gap-4 text-base font-medium text-slate-600">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2">Features</a>
              <a href="#preview" onClick={() => setMobileMenuOpen(false)} className="py-2">Preview</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2">Pricing</a>
              <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-4">Mulai Sekarang</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Sistem PPDB Modern Generasi Baru
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Kelola Penerimaan Siswa <br className="hidden md:block" /> 
            Dengan Lebih <span className="text-blue-600">Cerdas.</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform SaaS minimalis namun kuat untuk manajemen PPDB sekolah Anda. Tanpa ribet instalasi server, cukup berlangganan dan langsung gunakan.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/daftar">
              <Button size="lg" className="rounded-full w-full sm:w-auto text-base h-12 px-8 shadow-sm">
                Deploy Instansi Anda
              </Button>
            </Link>
            <a href="#preview">
              <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto text-base h-12 px-8">
                Lihat Demo UI
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Dashboard Preview Section (Clean UI) */}
      <section id="preview" className="py-20 px-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pengalaman Admin yang Intuitif</h2>
            <p className="text-slate-500 mt-2">Antarmuka yang bersih dan mudah dimengerti, mempercepat kerja panitia.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
          >
            {/* Fake Browser Header */}
            <div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
              <div className="mx-auto flex items-center gap-2 bg-white border border-slate-200 px-3 py-1 rounded text-xs text-slate-400 font-mono shadow-sm">
                admin.cationgate.com
              </div>
            </div>

            {/* Fake Dashboard Body */}
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 border-r border-slate-100 p-4 hidden md:block space-y-1">
                {['Overview', 'Pendaftar', 'Validasi Berkas', 'Pengaturan'].map((item, i) => (
                  <div key={i} className={`px-3 py-2 rounded-md text-sm font-medium ${i === 0 ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>
                    {item}
                  </div>
                ))}
              </div>
              
              {/* Content area */}
              <div className="flex-1 p-6 md:p-8 bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Dashboard Overview</h3>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { l: "Total Pendaftar", v: "1,248", i: <Users className="w-4 h-4 text-blue-500" /> },
                    { l: "Terverifikasi", v: "892", i: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
                    { l: "Pending", v: "314", i: <LayoutDashboard className="w-4 h-4 text-amber-500" /> },
                    { l: "Ditolak", v: "42", i: <Database className="w-4 h-4 text-rose-500" /> }
                  ].map((s, idx) => (
                    <Card key={idx} className="shadow-none border-slate-200">
                      <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">{s.l}</span>
                          {s.i}
                        </div>
                        <span className="text-2xl font-bold text-slate-900">{s.v}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Table Mockup */}
                <Card className="shadow-none border-slate-200">
                  <div className="border-b border-slate-100 px-4 py-3 bg-slate-50/50 rounded-t-xl">
                    <h4 className="text-sm font-semibold text-slate-800">Pendaftar Terbaru</h4>
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-3 font-medium">Nama Siswa</th>
                          <th className="px-4 py-3 font-medium">Asal Sekolah</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { n: "Budi Santoso", s: "SMPN 1 Jakarta", st: "Terverifikasi", c: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                          { n: "Siti Aminah", s: "SMPN 3 Depok", st: "Pending", c: "text-amber-700 bg-amber-50 border-amber-200" },
                          { n: "Ahmad Rizky", s: "SMP PGRI 2", st: "Terverifikasi", c: "text-emerald-700 bg-emerald-50 border-emerald-200" }
                        ].map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-900">{r.n}</td>
                            <td className="px-4 py-3 text-slate-500">{r.s}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${r.c}`}>
                                {r.st}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Infrastruktur Andal</h2>
            <p className="text-slate-500 mt-2">Fokus pada proses penerimaan, biarkan kami yang mengurus sistemnya.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { t: "Multi-Tenant", d: "Data setiap instansi terpisah secara aman. Privasi pendaftar terjamin.", i: <Database className="w-5 h-5" /> },
              { t: "Dashboard Analitik", d: "Pantau statistik pendaftar dan kuota secara real-time tanpa delay.", i: <LayoutDashboard className="w-5 h-5" /> },
              { t: "Performa Tinggi", d: "Arsitektur cloud modern memastikan web tetap cepat diakses saat load tinggi.", i: <Zap className="w-5 h-5" /> }
            ].map((ft, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  {ft.i}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{ft.t}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{ft.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Investasi Terjangkau</h2>
          <p className="text-slate-500 mb-12">Satu harga transparan untuk semua fitur premium.</p>

          <Card className="mx-auto max-w-sm shadow-xl shadow-slate-200/50 border-slate-200 relative overflow-hidden">
            <div className="h-2 w-full bg-blue-600 absolute top-0 left-0"></div>
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Paket Institusi</h3>
              <div className="flex justify-center items-end gap-1 mb-8">
                <span className="text-sm font-medium text-slate-500 mb-2">Rp</span>
                <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">750k</span>
                <span className="text-sm font-medium text-slate-500 mb-2">/thn</span>
              </div>

              <div className="space-y-4 mb-8 text-left">
                {[
                  "Akses Dashboard Lengkap",
                  "Unlimited Data Calon Siswa",
                  "Subdomain Instansi Khusus",
                  "Dukungan Teknis Prioritas"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/daftar" className="block w-full">
                <Button className="w-full h-12 text-base shadow-sm">
                  Berlangganan Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-slate-100 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} CationGate Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
