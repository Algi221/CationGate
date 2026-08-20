"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  Info, 
  Check, 
  ShieldCheck, 
  Building2, 
  Users,
  User, 
  Sparkles, 
  Lock,
  Globe,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/ui/password-strength";
import { OTPVerification } from "@/components/ui/otp-input";

type PlanType = 'trial' | 'yearly';

export default function DaftarSaaS() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    school_name: '', slug: '', email: '', phone: '', address: '',
    admin_name: '', admin_password: ''
  });
  
  const [_plan, _setPlan] = useState<PlanType>('trial');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Plan, 2: Instansi, 3: Admin, 4: Success
  const [errorMsg, setErrorMsg] = useState('');

  const [emailChecking, setEmailChecking] = useState(false);
  const [emailErrorState, setEmailErrorState] = useState('');
  const [emailSuccessState, setEmailSuccessState] = useState(false);
  
  const [_otpSent, setOtpSent] = useState(false);
  const [_otpCode, _setOtpCode] = useState('');
  const [_otpVerified, setOtpVerified] = useState(false);
  const [_otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrorMsg("Harap isi Email Resmi instansi terlebih dahulu.");
      return;
    }
    setOtpLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch('/api/mailer/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'registration' })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setCooldown(60);
      } else {
        setErrorMsg(data.message || "Gagal mengirim OTP.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan sistem saat mengirim OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTPAsync = async (code: string) => {
    try {
      const res = await fetch('/api/mailer/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: code })
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        setErrorMsg("");
        return true;
      } else {
        setErrorMsg(data.message || "Kode OTP salah atau kedaluwarsa.");
        return false;
      }
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan sistem saat verifikasi OTP.");
      return false;
    }
  };

  const handleResendAsync = async () => {
    try {
      const res = await fetch('/api/mailer/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'registration' })
      });
      const data = await res.json();
      return data.success;
    } catch (_e) {
      return false;
    }
  };

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
      if (!formData.admin_name || !formData.admin_password) {
        setErrorMsg("Harap lengkapi data administrator");
        return;
      }
    }
    if (emailChecking) {
      setErrorMsg("Mohon tunggu, sedang memverifikasi ketersediaan email...");
      return;
    }
    if (emailErrorState) {
      setErrorMsg("Email sudah terdaftar, silakan gunakan email lain.");
      return;
    }
    setErrorMsg("");
    setStep(prev => prev + 1);
  };

  const _handleActivate = async (schoolId: string, slug: string) => {
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

  const handleEmailCheck = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (!email) {
      setEmailErrorState('');
      setEmailSuccessState(false);
      return;
    }

    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailErrorState('Format email tidak valid (harus mengandung @ dan domain).');
      setEmailSuccessState(false);
      return;
    }
    
    setEmailChecking(true);
    setEmailErrorState('');
    setEmailSuccessState(false);
    
    try {
      // Fake delay to make it feel like real checking
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const res = await fetch('/api/saas/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.available) {
        setEmailErrorState('Email sudah terdaftar di sistem.');
        setEmailSuccessState(false);
      } else {
        setEmailErrorState('');
        setEmailSuccessState(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/saas/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, admin_username: formData.email, admin_email: formData.email, plan_type: 'trial' })
      });
      const data = await res.json();
      
      if (data.success) {
        router.push(`/${formData.slug}/auth/login?registered=true`);
      } else {
        setErrorMsg(data.message || "Gagal mendaftar");
      }
      setLoading(false);
    } catch (_err) {
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
    <div className="flex min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-yellow-400 selection:text-zinc-950 transition-colors duration-300">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      {/* Left Panel - Premium Dark Branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0E1726] flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-400/[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Header Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group inline-flex">
            <div className="relative w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/assets/catpeer/logo_cationGate.svg"
                alt="CationGate Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain drop-shadow-md"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                CationGate
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Value Props & Illustration */}
        <div className="relative z-10 max-w-md space-y-6 flex-1 flex flex-col justify-center mt-8">

          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Sistem SPMB Pintar untuk Sekolah Modern.
          </h1>

          <div className="relative z-10 flex items-center justify-center my-6 w-full">
            <div className="absolute inset-0 bg-yellow-400/20 blur-[60px] rounded-full scale-125 z-0"></div>
            <div className="absolute inset-0 bg-white/5 blur-[40px] rounded-full scale-150 z-0"></div>
            <Image 
              src="/assets/lottie_ilustration/Register.svg" 
              alt="Register Illustration"
              width={780}
              height={780}
              className="relative z-10 w-full max-w-[780px] drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
              priority
            />
          </div>

          <p className="text-white text-sm leading-relaxed">
            Tinggalkan tumpukan kertas. Kelola pendaftaran, seleksi berkas, hingga pembayaran siswa baru otomatis dalam satu aplikasi yang mudah digunakan.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 text-sm font-medium text-white">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span>Siap pakai dalam 10 menit tanpa perlu tim IT.</span>
            </div>
            <div className="flex items-start gap-3 text-sm font-medium text-white">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span>Terkoneksi WhatsApp & gerbang pembayaran.</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 font-medium flex items-center gap-4 mt-8">
          <span>© {new Date().getFullYear()} CationGate.</span>
          <span>•</span>
          <span className="flex items-center gap-1">ISO 27001 Certified</span>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-12 bg-white relative">
        <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Image
                src="/assets/catpeer/logo_cationGate.svg"
                alt="CationGate Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                priority
              />
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
                        ? 'bg-yellow-400 text-zinc-950' 
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
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-slate-700 text-sm font-semibold">Subdomain Portal Sekolah</Label>
                      <div className="flex items-center shadow-sm rounded-xl">
                        <div className="h-12 flex items-center px-4 border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm rounded-l-xl font-mono shrink-0">
                          cationgate.site/
                        </div>
                        <Input 
                          id="slug"
                          required
                          value={formData.slug} 
                          onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                          className="h-12 rounded-l-none rounded-r-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all text-slate-900 placeholder:text-slate-400 text-sm font-mono shadow-none"
                          placeholder="sman1jakarta" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 text-sm font-semibold">Email Resmi</Label>
                        <Input 
                          id="email" type="email"
                          required
                          value={formData.email} 
                          onBlur={handleEmailCheck}
                          onChange={e => {
                            setFormData({...formData, email: e.target.value});
                            if (emailErrorState) setEmailErrorState('');
                            if (emailSuccessState) setEmailSuccessState(false);
                          }} 
                          placeholder="info@sman1jakarta.sch.id" 
                          className={`h-12 rounded-xl transition-all text-sm shadow-sm ${
                            emailErrorState 
                              ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/20' 
                              : emailSuccessState
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 focus:border-emerald-500 focus:ring-emerald-500/20'
                                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                        {emailChecking && <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Memeriksa ketersediaan email...</p>}
                        {emailErrorState && <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1"><Info className="w-3.5 h-3.5" /> {emailErrorState}</p>}
                        {emailSuccessState && <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Email tersedia dan valid.</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 text-sm font-semibold">No. Telepon / WA</Label>
                        <Input 
                          id="phone"
                          required
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})} 
                          placeholder="08123456789" 
                          className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
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
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                      />
                    </div>
                    
                    <div className="flex gap-2.5 pt-4">
                      <button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Lanjutkan <ArrowRight className="w-4 h-4" />
                      </button>
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
                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin_password" className="text-slate-700 text-sm font-semibold">Password Access</Label>
                        <div className="relative">
                          <Input 
                            id="admin_password" type={showPassword ? "text" : "password"}
                            required
                            value={formData.admin_password} 
                            onChange={e => setFormData({...formData, admin_password: e.target.value})} 
                            placeholder="••••••••" 
                            className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <div className="pt-2">
                          <PasswordStrength value={formData.admin_password} />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={loading}
                        className="w-1/3 h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        Lanjutkan <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {step >= 3 && (
                  <div className="space-y-6">
                    
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
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
                            <div className="flex items-start gap-1.5 mt-0.5">
                              <Globe className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <p className="text-sm font-medium text-slate-900 break-all leading-tight">cationgate.site/<span className="text-blue-600 font-bold">{formData.slug || "-"}</span></p>
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
                              <p className="text-sm font-medium text-slate-900">{formData.admin_name || "-"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={loading}
                        className="w-1/3 h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60"
                      >
                        Ubah Data
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleSendOTP();
                          setStep(4);
                        }}
                        disabled={loading}
                        className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <>
                            <span>Kirim Kode OTP</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: OTP Verification Modal */}
                <AnimatePresence>
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md"
                      >
                        {/* Close / Back button */}
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="absolute -top-12 right-0 sm:-right-12 sm:top-0 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border border-white/20 backdrop-blur-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>

                        <OTPVerification 
                          email={formData.email}
                          length={6}
                          onVerify={async (code) => {
                            const isValid = await handleVerifyOTPAsync(code);
                            if (isValid) {
                              // After OTP verified, wait a bit for success animation then submit
                              setTimeout(() => {
                                handleSubmit();
                              }, 1200);
                            }
                            return isValid;
                          }}
                          onResend={handleResendAsync}
                          className="mx-auto"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            </div>
          
          {step <= 4 && (
            <p className="text-left text-[11px] text-slate-500 mt-8 leading-relaxed">
              Dengan mendaftar, Anda menyetujui <Link href="/terms" className="text-amber-500 font-semibold hover:underline">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="text-amber-500 font-semibold hover:underline">Kebijakan Privasi</Link> CationGate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
