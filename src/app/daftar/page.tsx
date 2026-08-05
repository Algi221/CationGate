"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Info, 
  Check, 
  ShieldCheck, 
  Building2, 
  Users, 
  Sparkles, 
  Lock,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PlanType = 'trial' | 'yearly';

export default function DaftarSaaS() {
  const [formData, setFormData] = useState({
    school_name: '', slug: '', email: '', phone: '', address: '',
    admin_name: '', admin_username: '', admin_password: ''
  });
  
  const [plan, setPlan] = useState<PlanType>('trial');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Plan, 2: Instansi, 3: Admin, 4: Success
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{slug: string, school_id: string} | null>(null);

  // Auto-generate slug from school name
  useEffect(() => {
    if ((step === 2) && formData.school_name) {
      const generated = formData.school_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (formData.slug !== generated) {
        setFormData(prev => ({...prev, slug: generated}));
      }
    }
  }, [formData.school_name, step]);

  const handleNext = () => {
    if (step === 2) {
      if (!formData.school_name || !formData.slug || !formData.email || !formData.phone) {
        setErrorMsg("Harap lengkapi semua data instansi");
        return;
      }
    }
    setErrorMsg("");
    setStep(prev => prev + 1);
  };

  const handleActivate = async (schoolId: string, slug: string) => {
    try {
      await fetch('/api/saas/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_id: schoolId })
      });
      setSuccessData({ slug, school_id: schoolId });
      setStep(4);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mengaktifkan layanan setelah pembayaran.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.admin_name || !formData.admin_username || !formData.admin_password) {
      setErrorMsg("Harap lengkapi data administrator");
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/saas/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, plan_type: plan })
      });
      const data = await res.json();
      
      if (plan === 'trial' || data.success) {
        if (data.success) {
          localStorage.setItem("ppdb_admin_token", `token_admin_${data.school_id}`);
          localStorage.setItem("ppdb_admin_user", JSON.stringify({
            id: 1,
            username: formData.admin_username || 'admin',
            nama_lengkap: formData.admin_name || 'Admin Sekolah',
            role: "superadmin",
            school_id: data.school_id
          }));
          setSuccessData({ slug: formData.slug, school_id: data.school_id });
          setStep(4);
        } else {
          setErrorMsg(data.message || "Gagal mendaftar");
        }
        setLoading(false);
      } else {
        if (data.success && data.token) {
          // @ts-ignore
          window.snap.pay(data.token, {
            onSuccess: function(result: any) {
              handleActivate(data.school_id, formData.slug);
            },
            onPending: function(result: any) {
              setErrorMsg("Menunggu pembayaran...");
              setLoading(false);
            },
            onError: function(result: any) {
              setErrorMsg("Pembayaran gagal!");
              setLoading(false);
            },
            onClose: function() {
              setErrorMsg("Anda menutup popup pembayaran sebelum menyelesaikannya.");
              setLoading(false);
            }
          });
        } else {
          setErrorMsg(data.message || "Gagal mendaftar");
          setLoading(false);
        }
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  const stepLabels = [
    { num: 1, label: 'Pilih Paket' },
    { num: 2, label: 'Data Instansi' },
    { num: 3, label: 'Akun Admin' },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      {/* Left Panel - Crisp Light Mode Branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-white border-r border-slate-200 flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Header Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group inline-flex">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Cation<span className="text-blue-600">Gate</span>
              </span>
              <span className="text-xs text-slate-500 font-medium -mt-1">
                SaaS SPMB Multi-Tenant Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Value Props */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Platform PPDB Terpercaya #1
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
            Digitalisasi Penerimaan Siswa Baru dalam Satu Platform SaaS Modern.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Bergabunglah dengan ribuan sekolah yang telah mengotomatisasi pendaftaran, verifikasi berkas AI, dan pembayaran online.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 font-bold" />
              </div>
              <span>Setup Cepat 10 Menit — Langsung Siap Pakai</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 font-bold" />
              </div>
              <span>Integrasi Midtrans Payment & WhatsApp Gateway</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 font-bold" />
              </div>
              <span>Standar Ekspor Dapodik Kemendikbud</span>
            </div>
          </div>

          {/* Social Proof Badge Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
              7.9k+
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">7.920+ Sekolah Aktif Terhubung</div>
              <div className="text-[11px] text-slate-500 font-medium">Melayani 520.000+ calon siswa di 38 provinsi</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 font-medium flex items-center gap-4">
          <span>© {new Date().getFullYear()} CationGate.</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-600" /> ISO 27001 Certified</span>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-12 bg-slate-50">
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">CationGate</span>
          </div>

          {/* Step Indicator */}
          {step < 4 && (
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-6">
              {stepLabels.map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.num 
                        ? 'bg-emerald-600 text-white' 
                        : step === s.num 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > s.num ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:inline ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`flex-1 h-0.5 ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Step Title Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
              {step === 1 && "Pilih Paket Langganan"}
              {step === 2 && "Data Instansi Sekolah"}
              {step === 3 && "Akun Administrator"}
              {step === 4 && "Pendaftaran Selesai"}
            </h2>
            <p className="text-xs text-slate-500">
              {step === 1 && "Mulai dengan trial gratis 30 hari atau langsung berlangganan."}
              {step === 2 && "Lengkapi informasi sekolah dan subdomain Anda."}
              {step === 3 && "Buat kredensial login admin untuk mengelola sistem."}
              {step === 4 && "Selamat! Akun instansi Anda siap digunakan."}
            </p>
          </div>

          {step === 4 && successData ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {plan === 'trial' ? 'Registrasi Trial Berhasil 🎉' : 'Pembayaran & Registrasi Berhasil 🎉'}
              </h3>
              
              <p className="text-slate-600 text-xs mb-6 leading-relaxed">
                {plan === 'trial' 
                  ? 'Akun trial CationGate Anda aktif selama 30 hari penuh. Silakan login ke dashboard sekolah Anda.'
                  : 'Pembayaran telah terverifikasi otomatis. Silakan login ke dashboard sekolah Anda.'
                }
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">URL Portal Sekolah Anda:</p>
                <p className="font-mono text-sm font-bold text-blue-600">
                  cationgate.com/{successData.slug}
                </p>
              </div>

              <div className="bg-blue-50/70 rounded-xl p-4 mb-6 border border-blue-100 text-xs text-blue-800 leading-relaxed">
                <strong>Langkah Selanjutnya:</strong> Login dengan username & password admin yang baru saja Anda buat untuk menyelesaikan konfigurasi jalur & kuota PPDB.
              </div>

              <Link href={`/${encodeURIComponent(successData.slug)}/auth/login`} className="w-full block">
                <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-12 transition-all font-bold text-sm shadow-md">
                  Masuk ke Dashboard Sekolah <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {errorMsg && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-start gap-2.5">
                  <Info className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 1: Plan Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Trial Card */}
                  <button
                    type="button"
                    onClick={() => setPlan('trial')}
                    className={`w-full text-left rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                      plan === 'trial'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900">Trial Gratis 30 Hari</p>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                            Tanpa Kartu Kredit
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Coba semua fitur unggulan SaaS CationGate</p>
                        <p className="text-2xl font-extrabold tracking-tight text-slate-900">Rp 0</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                        plan === 'trial' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {plan === 'trial' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                  </button>

                  {/* Yearly Card */}
                  <button
                    type="button"
                    onClick={() => setPlan('yearly')}
                    className={`w-full text-left rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                      plan === 'yearly'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900">Langganan Tahunan Pro</p>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                            Hemat 20%
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Akses penuh unlimited siswa selama 1 tahun</p>
                        <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                          Rp 750.000 <span className="text-xs font-normal text-slate-500">/ tahun</span>
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                        plan === 'yearly' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {plan === 'yearly' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                  </button>

                  <div className="pt-3">
                    <Button 
                      type="button" 
                      onClick={handleNext} 
                      className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md font-bold text-sm"
                    >
                      Lanjutkan <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: School Info */}
              <form onSubmit={step === 2 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4">
                {step === 2 && (
                  <div className="space-y-4">
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="school_name" className="text-slate-700 text-xs font-bold">Nama Sekolah / Instansi</Label>
                      <Input 
                        id="school_name"
                        value={formData.school_name} 
                        onChange={e => setFormData({...formData, school_name: e.target.value})} 
                        placeholder="Contoh: SMA Negeri 1 Jakarta" 
                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="slug" className="text-slate-700 text-xs font-bold">Subdomain Portal Sekolah</Label>
                      <div className="flex items-center">
                        <div className="h-11 flex items-center px-3 border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs rounded-l-xl font-mono shrink-0">
                          cationgate.com/
                        </div>
                        <Input 
                          id="slug"
                          value={formData.slug} 
                          onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                          className="h-11 rounded-l-none rounded-r-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 font-mono text-xs bg-white text-slate-900 placeholder:text-slate-400 font-medium"
                          placeholder="sman1jakarta" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-slate-700 text-xs font-bold">Email Resmi</Label>
                        <Input 
                          id="email" type="email"
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                          placeholder="info@sman1jakarta.sch.id" 
                          className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-slate-700 text-xs font-bold">No. Telepon / WA</Label>
                        <Input 
                          id="phone"
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})} 
                          placeholder="08123456789" 
                          className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-slate-700 text-xs font-bold">Alamat Sekolah</Label>
                      <Input 
                        id="address"
                        value={formData.address} 
                        onChange={e => setFormData({...formData, address: e.target.value})} 
                        placeholder="Jl. Budi Utomo No. 7, Jakarta Pusat" 
                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                      />
                    </div>
                    
                    <div className="flex gap-2.5 pt-3">
                      <Button type="button" variant="outline" className="w-1/3 h-11 rounded-xl border-slate-200 text-slate-700 font-semibold text-xs" onClick={() => setStep(1)}>
                        Kembali
                      </Button>
                      <Button type="submit" className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
                        Lanjutkan <ArrowRight className="ml-1.5 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Admin Account */}
                {step === 3 && (
                  <div className="space-y-4">

                    <div className="space-y-1.5">
                      <Label htmlFor="admin_name" className="text-slate-700 text-xs font-bold">Nama Lengkap Admin PPDB</Label>
                      <Input 
                        id="admin_name"
                        value={formData.admin_name} 
                        onChange={e => setFormData({...formData, admin_name: e.target.value})} 
                        placeholder="Drs. H. Ahmad Fauzi" 
                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="admin_username" className="text-slate-700 text-xs font-bold">Username Admin</Label>
                        <Input 
                          id="admin_username"
                          value={formData.admin_username} 
                          onChange={e => setFormData({...formData, admin_username: e.target.value})} 
                          placeholder="admin_ppdb" 
                          className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="admin_password" className="text-slate-700 text-xs font-bold">Password Access</Label>
                        <Input 
                          id="admin_password" type="password"
                          value={formData.admin_password} 
                          onChange={e => setFormData({...formData, admin_password: e.target.value})} 
                          placeholder="••••••••" 
                          className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 transition-all bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Paket SaaS:</p>
                          <p className="font-bold text-slate-900">{plan === 'trial' ? 'Trial Gratis 30 Hari' : 'Langganan Tahunan Pro'}</p>
                        </div>
                        <p className="text-base font-extrabold text-blue-600">{plan === 'trial' ? 'Rp 0' : 'Rp 750.000'}</p>
                      </div>
                      <div className="border-t border-slate-200 pt-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instansi:</p>
                        <p className="font-bold text-slate-900">{formData.school_name || '—'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <Button type="button" variant="outline" className="w-1/3 h-11 rounded-xl border-slate-200 text-slate-700 font-semibold text-xs" onClick={() => setStep(2)} disabled={loading}>
                        Kembali
                      </Button>
                      <Button type="submit" className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Memproses..." : plan === 'trial' ? "Aktifkan Akun Sekolah" : "Bayar & Aktifkan"}
                      </Button>
                    </div>
                  </div>
                )}
                
              </form>
            </div>
          )}
          
          {step < 4 && (
            <p className="text-left text-[11px] text-slate-500 mt-8 leading-relaxed">
              Dengan mendaftar, Anda menyetujui <Link href="/terms" className="text-blue-600 font-semibold hover:underline">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">Kebijakan Privasi</Link> CationGate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
