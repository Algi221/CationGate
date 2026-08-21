"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { ArrowRight, ArrowLeft, Info, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/ui/password-strength";
import { OTPVerification } from "@/components/ui/otp-input";

const stepEditorialVisuals = [
  {
    step: 1,
    path: "/assets/lottie_animation/Resume Evaluation.json",
    title: "Data\nInstansi",
    desc: "Mulai buat portal PPDB sekolah Anda.",
    svgPathMobile: "M 0 0 L 414 0 L 414 120 C 280 170, 140 150, 0 180 Z",
    svgPathDesktop: "M 0 0 L 520 0 C 600 280, 440 480, 280 640 C 140 760, 0 700, 0 700 Z",
    solidColor: "#FFC02D",
  },
  {
    step: 2,
    path: "/assets/lottie_animation/Digital Portal.json",
    title: "Akun\nAdmin",
    desc: "Amankan hak akses administrator sistem.",
    svgPathMobile: "M 0 0 L 414 0 L 414 125 C 290 165, 150 155, 0 185 Z",
    svgPathDesktop: "M 0 0 L 540 0 C 620 300, 460 500, 280 670 C 130 740, 0 670, 0 670 Z",
    solidColor: "#0284C7",
  },
  {
    step: 3,
    path: "/assets/lottie_animation/Manbrown.json",
    title: "Konfirmasi\nAkhir",
    desc: "Verifikasi data dan aktifkan portal cloud.",
    svgPathMobile: "M 0 0 L 414 0 L 414 120 C 270 175, 130 160, 0 180 Z",
    svgPathDesktop: "M 0 0 L 500 0 C 580 290, 430 490, 270 650 C 120 760, 0 690, 0 690 Z",
    solidColor: "#B45309",
  }
];

export default function DaftarSaaS() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    school_name: '', slug: '', email: '', phone: '', address: '',
    admin_name: '', admin_password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); 
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  const [emailChecking, setEmailChecking] = useState(false);
  const [emailErrorState, setEmailErrorState] = useState('');
  const [emailSuccessState, setEmailSuccessState] = useState(false);
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [animationsData, setAnimationsData] = useState<{ [key: number]: any }>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    Promise.all(
      stepEditorialVisuals.map(async (item) => {
        try {
          const res = await fetch(item.path);
          const data = await res.json();
          return { step: item.step, data };
        } catch {
          return { step: item.step, data: null };
        }
      })
    ).then((results) => {
      const map: { [key: number]: any } = {};
      results.forEach((r) => { map[r.step] = r.data; });
      setAnimationsData(map);
    });
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Debounced email availability check
  useEffect(() => {
    const email = formData.email.trim();
    if (!email) {
      setEmailErrorState('');
      setEmailSuccessState(false);
      setEmailChecking(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailSuccessState(false);
      return;
    }

    const timer = setTimeout(async () => {
      setEmailChecking(true);
      setEmailErrorState('');
      setEmailSuccessState(false);

      try {
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
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

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

  useEffect(() => {
    if ((step === 2) && formData.school_name) {
      const generated = formData.school_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (formData.slug !== generated) {
        setFormData(prev => ({...prev, slug: generated}));
      }
    }
  }, [formData.school_name, step]);

  const handleEmailCheck = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    if (!email) {
      setEmailErrorState('');
      setEmailSuccessState(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailErrorState('Format email tidak valid.');
      setEmailSuccessState(false);
      return;
    }
    
    if (emailSuccessState || emailChecking) return;

    setEmailChecking(true);
    setEmailErrorState('');
    setEmailSuccessState(false);
    
    try {
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

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.school_name || !formData.slug || !formData.email || !formData.phone) {
        setErrorMsg("Harap lengkapi semua data instansi");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setEmailErrorState('Format email tidak valid.');
        setErrorMsg("Format email tidak valid.");
        return;
      }

      if (emailChecking) {
        setErrorMsg("Mohon tunggu, sedang memverifikasi ketersediaan email...");
        return;
      }

      if (emailErrorState) {
        setErrorMsg(emailErrorState);
        return;
      }

      if (!emailSuccessState) {
        setEmailChecking(true);
        try {
          const res = await fetch('/api/saas/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email.trim() })
          });
          const data = await res.json();
          if (!data.available) {
            setEmailErrorState('Email sudah terdaftar di sistem.');
            setErrorMsg('Email sudah terdaftar di sistem.');
            setEmailSuccessState(false);
            setEmailChecking(false);
            return;
          } else {
            setEmailErrorState('');
            setEmailSuccessState(true);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setEmailChecking(false);
        }
      }
    }
    if (step === 2) {
      if (!formData.admin_name || !formData.admin_password) {
        setErrorMsg("Harap lengkapi data administrator");
        return;
      }
    }
    setErrorMsg("");
    const nextStep = Math.min(step + 1, 3);
    setStep(nextStep);
    setMaxReachedStep(prev => Math.max(prev, nextStep));
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
        router.push(`/masuk?registered=true`);
      } else {
        setErrorMsg(data.message || "Gagal mendaftar");
      }
      setLoading(false);
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  const currentVisual = stepEditorialVisuals.find(v => v.step === Math.min(step, 3)) || stepEditorialVisuals[0];

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-white text-slate-950 overflow-x-hidden relative flex flex-col justify-between p-4 sm:p-6 lg:p-10 pb-10">
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      {/* BACKGROUND BUBBLE */}
      <div className="absolute top-0 left-0 w-full lg:w-[50vw] h-[180px] lg:h-[92vh] pointer-events-none z-0">
        <svg viewBox={isMobile ? "0 0 414 200" : "0 0 600 700"} className="w-full h-full" preserveAspectRatio="none">
          <motion.path
            initial={{ 
              d: isMobile ? currentVisual.svgPathMobile : currentVisual.svgPathDesktop, 
              fill: currentVisual.solidColor 
            }}
            animate={{ 
              d: isMobile ? currentVisual.svgPathMobile : currentVisual.svgPathDesktop, 
              fill: currentVisual.solidColor 
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* TOP NAVBAR */}
      <div className="relative lg:absolute top-2 lg:top-10 left-2 lg:left-10 right-2 lg:right-10 flex items-center justify-between z-10 mb-4 lg:mb-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("cationgate_skip_splash", "true");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm transition-all group"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-xs font-bold hidden sm:inline">Beranda</span>
          </Link>
          <Link 
            href="/"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("cationgate_skip_splash", "true");
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/assets/logo_cationgate/CationGate_Logo.png"
              alt="CationGate Logo"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans">
              CationGate
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden text-slate-400 sm:block">Sudah punya akun?</span>
          <Link
            href="/masuk"
            className="rounded-full border border-slate-200 bg-white/90 backdrop-blur-sm px-4 py-1.5 font-bold text-slate-800 transition hover:bg-slate-950 hover:text-white shadow-sm"
          >
            Masuk
          </Link>
        </div>
      </div>

      {/* STEP BAR DI MOBILE (LANGSUNG DI ATAS FORM INPUT) */}
      <div className="lg:hidden flex justify-center z-30 relative my-3">
        <div className="inline-flex items-center gap-1.5 bg-[#F1F3F6] p-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/80">
          {[1, 2, 3].map((s) => {
            const isActive = Math.min(step, 3) === s;
            const isAccessible = s <= maxReachedStep;

            return (
              <button
                key={s}
                type="button"
                disabled={!isAccessible}
                onClick={() => {
                  if (isAccessible) setStep(s);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive 
                    ? "bg-[#FFC000] text-slate-950 shadow-sm cursor-pointer" 
                    : isAccessible
                    ? "text-slate-600 hover:text-slate-950 hover:bg-white/70 cursor-pointer"
                    : "text-slate-400 opacity-50 cursor-not-allowed"
                }`}
              >
                <span className={`font-black text-xs ${isActive ? "text-slate-950" : "text-slate-700"}`}>
                  0{s}
                </span>
                <span className={`text-[12px] ${isActive ? "font-bold text-slate-950" : "font-medium text-slate-600"}`}>
                  {s === 1 ? 'Instansi' : s === 2 ? 'Admin' : 'Konfirmasi'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KONTEN UTAMA GRID 50:50 */}
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto z-10 relative lg:pt-8">

        {/* SISI KIRI: HANYA MUNCUL DI DESKTOP */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-between relative pl-8 lg:pl-16 pr-4">
          
          {/* TEKS UTAMA */}
          <div className="z-10 w-1/2 pr-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVisual.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] whitespace-pre-line drop-shadow-md">
                  {currentVisual.title}
                </h2>
                <p className="text-xs lg:text-sm text-white/90 mt-5 font-medium leading-relaxed max-w-[220px]">
                  {currentVisual.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* AREA LOTTIE & FLOATING CAPSULE */}
          <div className="z-10 w-1/2 flex items-center justify-center relative">
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -right-2 top-0 w-16 h-8 rounded-full bg-white/30 backdrop-blur-md shadow-lg z-30"
            />

            <div className="w-full max-w-[320px] h-[320px] z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVisual.step}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {animationsData[currentVisual.step] && (
                    <Lottie
                      animationData={animationsData[currentVisual.step]}
                      loop
                      autoplay
                      className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* SISI KANAN: FORM INPUT */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <div className="w-full max-w-[460px] mx-auto bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Buat akun sekolah
              </h1>
              <p className="mt-1.5 text-xs text-slate-400">
                Daftarkan instansi kamu dan mulai kelola sistem PPDB dengan CationGate.
              </p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <form
              onSubmit={
                step === 3
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      handleNext();
                    }
              }
            >
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="school_name" className="text-[11px] font-bold text-slate-700">Nama Sekolah / Instansi</Label>
                        <Input
                          id="school_name"
                          required
                          value={formData.school_name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({
                              ...formData,
                              school_name: val,
                              slug: val.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                            });
                          }}
                          placeholder="Contoh: SMA Negeri 1 Jakarta"
                          className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="slug" className="text-[11px] font-bold text-slate-700">Subdomain Portal Sekolah</Label>
                        <div className="flex">
                          <div className="flex h-10 sm:h-11 items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-[10px] font-medium text-slate-400">
                            cationgate.site/
                          </div>
                          <Input
                            id="slug"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                            placeholder="sman1jakarta"
                            className="h-10 sm:h-11 rounded-l-none rounded-r-xl border-slate-200 bg-white font-mono text-xs shadow-none focus:border-slate-900 focus:ring-0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email" className="text-[11px] font-bold text-slate-700">Email Resmi</Label>
                            {emailChecking && (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
                                <Loader2 className="h-3 w-3 animate-spin" /> Memeriksa...
                              </span>
                            )}
                            {emailSuccessState && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                                <Check className="h-3 w-3" /> Tersedia
                              </span>
                            )}
                            {emailErrorState && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600">
                                <AlertCircle className="h-3 w-3" /> Terdaftar
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onBlur={handleEmailCheck}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (emailErrorState) setEmailErrorState("");
                                if (emailSuccessState) setEmailSuccessState(false);
                              }}
                              placeholder="info@sman1jakarta.sch.id"
                              className={`h-10 sm:h-11 rounded-xl bg-white text-xs shadow-none pr-9 transition-colors ${
                                emailErrorState
                                  ? "border-rose-400 bg-rose-50/20 text-rose-950 focus:border-rose-500 focus:ring-0"
                                  : emailSuccessState
                                  ? "border-emerald-400 bg-emerald-50/20 text-slate-900 focus:border-emerald-500 focus:ring-0"
                                  : "border-slate-200 focus:border-slate-900 focus:ring-0"
                              }`}
                            />
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                              {emailChecking && <Loader2 className="h-4 w-4 animate-spin text-amber-500" />}
                              {!emailChecking && emailSuccessState && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                              {!emailChecking && emailErrorState && <AlertCircle className="h-4 w-4 text-rose-500" />}
                            </div>
                          </div>
                          {emailErrorState ? (
                            <p className="flex items-center gap-1 text-[10px] font-medium text-rose-600 mt-0.5">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              {emailErrorState}
                            </p>
                          ) : emailSuccessState ? (
                            <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 mt-0.5">
                              <Check className="h-3 w-3 shrink-0" />
                              Email tersedia dan siap digunakan
                            </p>
                          ) : null}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="phone" className="text-[11px] font-bold text-slate-700">No. Telepon / WA</Label>
                          <Input
                            id="phone"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="08123456789"
                            className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="address" className="text-[11px] font-bold text-slate-700">Alamat Sekolah</Label>
                        <Input
                          id="address"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Jl. Budi Utomo No. 7, Jakarta Pusat"
                          className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 flex justify-end border-t border-slate-100 pt-4">
                      <Button type="submit" className="h-10 sm:h-11 rounded-xl bg-[#EAB844] px-6 text-xs font-bold text-white shadow-none hover:bg-[#d9a92f]">
                        Lanjutkan <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="admin_name" className="text-[11px] font-bold text-slate-700">Nama Lengkap Admin PPDB</Label>
                        <Input
                          id="admin_name"
                          required
                          value={formData.admin_name}
                          onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                          placeholder="Drs. H. Ahmad Fauzi"
                          className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="admin_password" className="text-[11px] font-bold text-slate-700">Password Access</Label>
                        <div className="relative">
                          <Input
                            id="admin_password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.admin_password}
                            onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                            placeholder="••••••••"
                            className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white pr-10 text-xs shadow-none focus:border-slate-900 focus:ring-0"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700"
                          >
                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <div className="pt-1">
                          <PasswordStrength value={formData.admin_password} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 flex justify-between border-t border-slate-100 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={loading} className="h-10 sm:h-11 px-4 text-xs font-bold text-slate-500">
                        Kembali
                      </Button>
                      <Button type="submit" disabled={loading} className="h-10 sm:h-11 rounded-xl bg-[#EAB844] px-6 text-xs font-bold text-white shadow-none hover:bg-[#d9a92f]">
                        Lanjutkan <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step >= 3 && (
                  <motion.div key="step-3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                    <div className="divide-y divide-slate-100 border-y border-slate-100 text-xs mb-4">
                      <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
                        <span className="font-bold text-slate-400">Instansi</span>
                        <div>
                          <p className="font-bold text-slate-900">{formData.school_name || "-"}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">{formData.address || "-"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
                        <span className="font-bold text-slate-400">Subdomain</span>
                        <p className="font-medium text-slate-700">cationgate.site/<span className="font-bold text-[#EAB844]">{formData.slug}</span></p>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
                        <span className="font-bold text-slate-400">Email</span>
                        <p className="font-medium text-slate-700 break-all">{formData.email}</p>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
                        <span className="font-bold text-slate-400">Admin</span>
                        <p className="font-medium text-slate-700">{formData.admin_name}</p>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 flex justify-between border-t border-slate-100 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setStep(2)} disabled={loading} className="h-10 sm:h-11 px-4 text-xs font-bold text-slate-500">
                        Ubah Data
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          handleSendOTP();
                          setStep(4);
                        }}
                        disabled={loading}
                        className="h-10 sm:h-11 rounded-xl bg-[#EAB844] px-6 text-xs font-bold text-white shadow-none hover:bg-[#d9a92f]"
                      >
                        Kirim Kode OTP <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OTP MODAL */}
             {/* OTP MODAL - UBAH DI BAGIAN INI */}
<AnimatePresence>
  {step === 4 && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md z-[10000]"
      >
        <button
          type="button"
          onClick={() => setStep(3)}
          className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
        >
          <span className="text-lg">×</span>
        </button>
        <div className="rounded-2xl bg-white shadow-2xl p-2 relative z-[10001]">
          <OTPVerification
            email={formData.email}
            length={6}
            onVerify={async (code) => {
              const isValid = await handleVerifyOTPAsync(code);
              if (isValid) {
                setTimeout(() => {
                  handleSubmit();
                }, 1200);
              }
              return isValid;
            }}
            onResend={handleResendAsync}
            className="mx-auto"
          />
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
            </form>
          </div>
        </div>

      </div>

      {/* STEP BAR DESKTOP (TETAP DI BOTTOM SCREEN) */}
      <div className="hidden lg:flex justify-center z-20 relative pb-2 w-full max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#F1F3F6] p-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/80">
          {[1, 2, 3].map((s) => {
            const isActive = Math.min(step, 3) === s;
            const isAccessible = s <= maxReachedStep;

            return (
              <button
                key={s}
                type="button"
                disabled={!isAccessible}
                onClick={() => {
                  if (isAccessible) setStep(s);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive 
                    ? "bg-[#FFC000] text-slate-950 shadow-sm cursor-pointer" 
                    : isAccessible
                    ? "text-slate-600 hover:text-slate-950 hover:bg-white/70 cursor-pointer"
                    : "text-slate-400 opacity-50 cursor-not-allowed"
                }`}
              >
                <span className={`font-black text-xs ${isActive ? "text-slate-950" : "text-slate-700"}`}>
                  0{s}
                </span>
                <span className={`text-[12px] ${isActive ? "font-bold text-slate-950" : "font-medium text-slate-600"}`}>
                  {s === 1 ? 'Instansi' : s === 2 ? 'Admin' : 'Konfirmasi'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="w-full text-center text-xs text-slate-400 py-3 relative z-10">
        <p>&copy; {new Date().getFullYear()} CationGate. Hak Cipta Dilindungi.</p>
      </div>

    </main>
  );
}