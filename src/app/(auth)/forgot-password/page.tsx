"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/ui/password-strength";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Format alamat email tidak valid.").trim().toLowerCase()
});

const otpSchema = z.object({
  otp: z.string().length(6, "Kode OTP harus berjumlah tepat 6 digit.").regex(/^\d{6}$/, "Kode OTP hanya berupa angka.")
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, "Kata sandi baru minimal harus 6 karakter."),
  confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi.")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru.",
  path: ["confirmPassword"]
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  // Step 1: Input Email
  // Step 2: Input & Verifikasi Kode OTP
  // Step 3: Pilihan Aksi (Perbarui Kata Sandi / Lewati)
  // Step 4: Form Input Kata Sandi Baru
  // Step 5: Sukses Diperbarui
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Step 1: Send OTP to registered email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mailer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), type: "forgot-password" })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`Kode OTP 6 digit telah dikirim ke ${email}`);
        setStep(2);
        setCooldown(60);
      } else {
        setErrorMsg(data.message || "Email tidak ditemukan atau terjadi kesalahan.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kendala jaringan saat menghubungi server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (cooldown > 0 || loading) return;
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/mailer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), type: "forgot-password" })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`Kode OTP baru telah dikirimkan ke ${email}`);
        setCooldown(60);
      } else {
        setErrorMsg(data.message || "Gagal mengirim ulang kode OTP.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kendala jaringan saat mengirim ulang OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validation = otpSchema.safeParse({ otp });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mailer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg("Kode OTP berhasil diverifikasi.");
        setStep(3); // Pindah ke layar opsi (Perbarui Kata Sandi / Lewati)
      } else {
        setErrorMsg(data.message || "Kode OTP tidak valid atau sudah kedaluwarsa.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kendala jaringan saat memverifikasi OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Submit New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validation = passwordSchema.safeParse({ newPassword, confirmPassword });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep(5); // Sukses diperbarui
      } else {
        setErrorMsg(data.message || "Gagal memperbarui kata sandi.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan sistem saat memperbarui kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  const svgPathMobile = "M 0 0 L 414 0 L 414 125 C 290 165, 150 155, 0 185 Z";
  const svgPathDesktop = "M 0 0 L 540 0 C 620 300, 460 500, 280 670 C 130 740, 0 670, 0 670 Z";
  const solidColor = "#0284C7"; // Deep Sky Blue

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-white text-slate-950 overflow-x-hidden relative flex flex-col justify-between p-4 sm:p-6 lg:p-10 pb-10">
      {/* BACKGROUND BUBBLE */}
      <div className="absolute top-0 left-0 w-full lg:w-[50vw] h-45 lg:h-[92vh] pointer-events-none z-0">
        <svg
          viewBox={isMobile ? "0 0 414 200" : "0 0 600 700"}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: isMobile ? svgPathMobile : svgPathDesktop, fill: solidColor }}
            animate={{ d: isMobile ? svgPathMobile : svgPathDesktop, fill: solidColor }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* HEADER / NAVBAR */}
      <div className="relative lg:absolute top-2 lg:top-8 left-2 lg:left-8 right-2 lg:right-8 flex items-center justify-between z-20 mb-4 lg:mb-0">
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-white/80 transition-all group drop-shadow-sm"
            title="Kembali ke Login"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Login</span>
          </Link>
        </div>

        {/* Center Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 group lg:absolute lg:left-[45vw] lg:translate-x-[-55%] transition-transform hover:scale-102"
        >
          <Image
            src="/assets/logo_cationgate/CationGate_Logo.png"
            alt="CationGate Logo"
            width={28}
            height={28}
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain transition-transform group-hover:rotate-6 drop-shadow-sm"
          />
          <div className="text-xl sm:text-2xl font-black tracking-tight font-sans select-none flex items-center">
            <span className="text-slate-950">Cation</span>
            <span style={{ color: solidColor }} className="drop-shadow-none">Gate</span>
          </div>
        </Link>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="hidden text-slate-500 font-medium sm:block">Sudah ingat password?</span>
          <Link
            href="/login"
            className="rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-1.5 font-bold text-slate-700 transition-all hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-sm active:scale-95 shadow-xs"
          >
            Masuk
          </Link>
        </div>
      </div>

      {/* KONTEN UTAMA GRID 50:50 */}
      <div className="w-full max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto z-10 relative lg:pt-8">
        {/* SISI KIRI: DESKTOP ONLY */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between relative pl-8 lg:pl-16 pr-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#FFD33B]" />
              <span>Pemulihan Akun Terenkripsi</span>
            </div>

            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] whitespace-pre-line drop-shadow-md">
              {"Pemulihan\nKata Sandi"}
            </h2>

            <p className="text-xs lg:text-sm text-white/90 mt-4 font-medium leading-relaxed max-w-md">
              Lupa kata sandi akun Admin Sekolah Anda? Ikuti panduan verifikasi OTP langkah demi langkah untuk memulihkan akses secara aman.
            </p>

            <div className="pt-4 flex items-center gap-4 text-white/80 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFD33B]"></span>
                Kode OTP Aman 15 Menit
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Enkripsi Hash SHA-256
              </div>
            </div>
          </motion.div>
        </div>

        {/* SISI KANAN: FORM CARD */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <div className="w-full max-w-115 mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
            <AnimatePresence mode="wait">
              {/* STEP 1: INPUT EMAIL */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                      Lupa Kata Sandi
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      Masukkan alamat email admin sekolah yang terdaftar di CationGate untuk menerima kode OTP.
                    </p>
                  </div>

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600"
                    >
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                        Alamat Email Resmi Sekolah
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@sekolah.sch.id"
                          className="h-11 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                        />
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                            <span>Mengirim Kode OTP...</span>
                          </>
                        ) : (
                          <>
                            <span>Kirim Kode OTP</span>
                            <ArrowRight className="w-4 h-4 text-slate-950" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-2 text-center text-xs text-slate-500">
                      <span>Ingat kata sandi Anda? </span>
                      <Link
                        href="/login"
                        className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        Kembali ke Login
                      </Link>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: VERIFIKASI KODE OTP */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950">
                      Verifikasi Kode OTP
                    </h1>
                    <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                      <span>Dikirim ke <strong className="text-slate-800">{email}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className="text-blue-600 hover:underline font-bold"
                      >
                        Ganti Email
                      </button>
                    </div>
                  </div>

                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600"
                    >
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="otp" className="text-xs font-bold text-slate-700">
                          Masukkan 6 Digit Kode OTP
                        </Label>
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={cooldown > 0 || loading}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 disabled:text-slate-400 flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw size={12} />
                          {cooldown > 0 ? `Kirim Ulang (${cooldown}s)` : "Kirim Ulang OTP"}
                        </button>
                      </div>
                      <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="• • • • • •"
                        className="h-13 rounded-2xl border-slate-200 bg-slate-50/70 text-center font-mono text-2xl font-black tracking-[10px] text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Memverifikasi Kode OTP...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-white" />
                            <span>Verifikasi Kode OTP</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setErrorMsg("");
                        }}
                        className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                      >
                        &larr; Kembali ke input email
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: PILIHAN AKSI SETELAH OTP VALID */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/10">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full mb-2">
                      Verifikasi Identitas Sukses
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Kode OTP Berhasil Diverifikasi!
                    </h2>
                    <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                      Identitas akun <strong className="text-slate-800">{email}</strong> telah terbukti sah. Silakan pilih tindakan selanjutnya:
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Opsi 1: Perbarui Kata Sandi */}
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg("");
                        setSuccessMsg("");
                        setStep(4);
                      }}
                      className="w-full p-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <KeyRound className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">Perbarui Kata Sandi</div>
                          <div className="text-[11px] font-normal text-white/80">Buat kata sandi baru untuk akun Anda</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Opsi 2: Lewati & Masuk ke Login */}
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Lewati & Kembali ke Login</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: FORM INPUT KATA SANDI BARU */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950">
                      Buat Kata Sandi Baru
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      Masukkan kata sandi baru yang kuat untuk akun <strong className="text-slate-800">{email}</strong>.
                    </p>
                  </div>

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600"
                    >
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700">
                        Kata Sandi Baru
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="h-11 pl-9 pr-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-blue-600 transition-all"
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="pt-1">
                        <PasswordStrength value={newPassword} />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                        Konfirmasi Kata Sandi Baru
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi baru"
                          className="h-11 pl-9 pr-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-blue-600 transition-all"
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Menyimpan Kata Sandi...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Simpan Kata Sandi Baru</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
                      >
                        Lewati & Masuk ke Login
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 5: SUCCESS CELEBRATION */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Kata Sandi Berhasil Diperbarui!
                    </h2>
                    <p className="mt-1.5 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Kata sandi akun Admin Sekolah Anda telah berhasil diubah. Silakan masuk kembali menggunakan kata sandi baru Anda.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => router.push("/login")}
                      className="w-full h-12 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-black text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                    >
                      <span>Masuk ke Dashboard</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full text-center text-xs text-slate-400 py-4 relative z-10">
        <p>&copy; {new Date().getFullYear()} CationGate. Hak Cipta Dilindungi.</p>
      </div>
    </main>
  );
}
