"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  User, 
  Sparkles, 
  Lock,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PlanType = 'trial' | 'yearly';

export default function DaftarSaaS() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    school_name: '', slug: '', email: '', phone: '', address: '',
    admin_name: '', admin_username: '', admin_password: ''
  });
  
  const [plan, setPlan] = useState<PlanType>('trial');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Plan, 2: Instansi, 3: Admin, 4: Success
  const [errorMsg, setErrorMsg] = useState('');

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
    if (step === 1) {
      if (!formData.school_name || !formData.slug || !formData.email || !formData.phone) {
        setErrorMsg("Harap lengkapi semua data instansi");
        return;
      }
    }
    if (step === 2) {
      if (!formData.admin_name || !formData.admin_username || !formData.admin_password) {
        setErrorMsg("Harap lengkapi data administrator");
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
      router.push(`/${slug}/auth/login`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mengaktifkan layanan setelah pembayaran.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/saas/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, plan_type: 'trial' })
      });
      const data = await res.json();
      
      if (data.success) {
        router.push(`/${formData.slug}/auth/login?registered=true`);
      } else {
        setErrorMsg(data.message || "Gagal mendaftar");
      }
      setLoading(false);
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  const stepLabels = [
    { num: 1, label: 'Data Instansi' },
    { num: 2, label: 'Akun Admin' },
    { num: 3, label: 'Konfirmasi' },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      {/* Left Panel - Premium Dark Branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Header Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group inline-flex">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                CationGate
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Value Props */}
        <div className="relative z-10 max-w-md space-y-8">

          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Sistem PPDB Pintar untuk Sekolah Modern.
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Tinggalkan tumpukan kertas. Kelola pendaftaran, seleksi berkas, hingga pembayaran siswa baru otomatis dalam satu aplikasi yang mudah digunakan.
          </p>

          <div className="space-y-5 pt-2">
            <div className="flex items-start gap-4 text-sm font-medium text-slate-200">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <span>Siap pakai dalam 10 menit tanpa perlu tim IT khusus.</span>
            </div>
            <div className="flex items-start gap-4 text-sm font-medium text-slate-200">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <span>Terkoneksi dengan WhatsApp & gerbang pembayaran online.</span>
            </div>
            <div className="flex items-start gap-4 text-sm font-medium text-slate-200">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <span>Format ekspor data sesuai standar Dapodik Kemendikbud.</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 font-medium flex items-center gap-4">
          <span>© {new Date().getFullYear()} CationGate.</span>
          <span>•</span>
          <span className="flex items-center gap-1">ISO 27001 Certified</span>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-12 bg-slate-50">
        <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">CationGate</span>
          </div>

          {/* Step Indicator */}
          {step <= 3 && (
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-6">
              {stepLabels.map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > s.num 
                        ? 'bg-emerald-600 text-white' 
                        : step === s.num 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > s.num ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                    </div>
                    <span className={`text-sm font-semibold hidden sm:inline ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`flex-1 h-[2px] rounded-full ${step > s.num ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Step Title Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              {step === 1 && "Data Instansi Sekolah"}
              {step === 2 && "Akun Administrator"}
            </h2>
            <p className="text-sm text-slate-500">
              {step === 1 && "Lengkapi informasi sekolah dan subdomain Anda."}
              {step === 2 && "Buat kredensial login admin untuk mengelola sistem."}
              {step === 3 && "Periksa kembali data Anda sebelum mengaktifkan layanan."}
            </p>
          </div>

          <div>
              {errorMsg && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-start gap-2.5">
                  <Info className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
                {/* Step 1: School Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    
                    <div className="space-y-2">
                      <Label htmlFor="school_name" className="text-slate-700 text-sm font-semibold">Nama Sekolah / Instansi</Label>
                      <Input 
                        id="school_name"
                        required
                        value={formData.school_name} 
                        onChange={e => {
                          const val = e.target.value;
                          setFormData({
                            ...formData, 
                            school_name: val, 
                            slug: val.toLowerCase().replace(/[^a-z0-9-]/g, '')
                          });
                        }} 
                        placeholder="Contoh: SMA Negeri 1 Jakarta" 
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-slate-700 text-sm font-semibold">Subdomain Portal Sekolah</Label>
                      <div className="flex items-center shadow-sm rounded-xl">
                        <div className="h-12 flex items-center px-4 border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm rounded-l-xl font-mono shrink-0">
                          cationgate.com/
                        </div>
                        <Input 
                          id="slug"
                          required
                          value={formData.slug} 
                          onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                          className="h-12 rounded-l-none rounded-r-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm font-mono shadow-none"
                          placeholder="sman1jakarta" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 text-sm font-semibold">Email Resmi</Label>
                        <Input 
                          id="email" type="email"
                          required
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                          placeholder="info@sman1jakarta.sch.id" 
                          className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 text-sm font-semibold">No. Telepon / WA</Label>
                        <Input 
                          id="phone"
                          required
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})} 
                          placeholder="08123456789" 
                          className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-slate-700 text-sm font-semibold">Alamat Sekolah</Label>
                      <Input 
                        id="address"
                        required
                        value={formData.address} 
                        onChange={e => setFormData({...formData, address: e.target.value})} 
                        placeholder="Jl. Budi Utomo No. 7, Jakarta Pusat" 
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                      />
                    </div>
                    
                    <div className="flex gap-2.5 pt-4">
                      <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 text-white font-bold text-sm transition-all flex items-center justify-center">
                        Lanjutkan <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Admin Account */}
                {step === 2 && (
                  <div className="space-y-5">

                    <div className="space-y-2">
                      <Label htmlFor="admin_name" className="text-slate-700 text-sm font-semibold">Nama Lengkap Admin PPDB</Label>
                      <Input 
                        id="admin_name"
                        required
                        value={formData.admin_name} 
                        onChange={e => setFormData({...formData, admin_name: e.target.value})} 
                        placeholder="Drs. H. Ahmad Fauzi" 
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin_username" className="text-slate-700 text-sm font-semibold">Username Admin</Label>
                        <Input 
                          id="admin_username"
                          required
                          value={formData.admin_username} 
                          onChange={e => setFormData({...formData, admin_username: e.target.value})} 
                          placeholder="admin_ppdb" 
                          className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin_password" className="text-slate-700 text-sm font-semibold">Password Access</Label>
                        <Input 
                          id="admin_password" type="password"
                          required
                          value={formData.admin_password} 
                          onChange={e => setFormData({...formData, admin_password: e.target.value})} 
                          placeholder="••••••••" 
                          className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" className="w-1/3 h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm" onClick={() => setStep(1)} disabled={loading}>
                        Kembali
                      </Button>
                      <Button type="submit" className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 text-white font-bold text-sm transition-all flex items-center justify-center" disabled={loading}>
                        Lanjutkan <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <div className="space-y-6">
                    
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Ringkasan Pendaftaran</h3>
                          <p className="text-xs text-slate-500">Pastikan data di bawah ini sudah benar</p>
                        </div>
                      </div>
                      
                      <div className="p-5 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nama Instansi</p>
                            <p className="text-sm font-semibold text-slate-900">{formData.school_name || "-"}</p>
                            <p className="text-xs text-slate-500 mt-1">{formData.address || "-"}</p>
                          </div>
                          
                          <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Subdomain</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Globe className="w-3.5 h-3.5 text-slate-400" />
                              <p className="text-sm font-medium text-slate-900">cationgate.com/<span className="text-blue-600 font-bold">{formData.slug || "-"}</span></p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-px w-full bg-slate-100"></div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Resmi</p>
                            <p className="text-sm font-medium text-slate-900">{formData.email || "-"}</p>
                          </div>
                          
                          <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Akun Administrator</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                <User className="w-3 h-3 text-slate-500" />
                              </div>
                              <p className="text-sm font-medium text-slate-900">{formData.admin_name || "-"} <span className="text-slate-400 font-normal">(@{formData.admin_username || "-"})</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" className="w-1/3 h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm" onClick={() => setStep(2)} disabled={loading}>
                        Ubah Data
                      </Button>
                      <Button type="submit" className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 text-white font-bold text-sm transition-all flex items-center justify-center" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Selesaikan Pendaftaran"}
                      </Button>
                    </div>
                  </div>
                )}

              </form>
            </div>
          
          {step <= 3 && (
            <p className="text-left text-[11px] text-slate-500 mt-8 leading-relaxed">
              Dengan mendaftar, Anda menyetujui <Link href="/terms" className="text-blue-600 font-semibold hover:underline">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">Kebijakan Privasi</Link> CationGate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
