"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PasswordStrength } from "@/components/ui/password-strength";

export default function ForgotPassword() {
  const { ppdbTitle, ppdbLogo, isSchoolNotFound } = usePPDB();
  const router = useRouter();
  const params = useParams();
  const schoolSlug = params?.school_slug as string;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [_showPassword, _setShowPassword] = useState(false);
  const [step, setStep] = useState(1); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Harap isi alamat Gmail Anda.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch('/api/mailer/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'forgot-password' })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Kode OTP berhasil dikirim ke email Anda.");
        setStep(2);
        setCooldown(60);
      } else {
        setError(data.message || "Gagal mengirim OTP.");
      }
    } catch (_err) {
      setError("Terjadi kesalahan sistem saat mengirim OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError("Harap isi kode OTP dan password baru Anda.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch('/api/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push(`/${schoolSlug}/auth/login`);
        }, 2000);
      } else {
        setError(data.message || "Kode OTP salah atau kedaluwarsa.");
      }
    } catch (_err) {
      setError("Terjadi kesalahan sistem saat verifikasi OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (isSchoolNotFound) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-slate-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sekolah Tidak Ditemukan</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Tautan (slug) sekolah yang Anda tuju (<span className="font-semibold text-blue-600">{schoolSlug}</span>) tidak terdaftar di sistem CationGate. Pastikan URL sudah benar.
          </p>
          <div className="pt-6">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Kembali ke Beranda CationGate
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans selection:bg-blue-600 selection:text-white">

      {/* Left Panel - Dark Mode Design matching Image 2 */}
      <div className="w-full lg:w-[45%] bg-[#0b1121] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 space-y-6">
          <Link 
            href={`/${schoolSlug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Utama</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden">
              {ppdbLogo ? (
                <Image src={ppdbLogo} alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" unoptimized />
              ) : (
                <ShieldCheck className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white block">
                {ppdbTitle || "Portal PPDB"}
              </span>
              <span className="text-sm text-slate-400">Admin Dashboard</span>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="my-10 space-y-8 max-w-md relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Pemulihan<br />Akses Admin
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Lupa password? Jangan khawatir. Kami akan mengirimkan kode verifikasi OTP ke Gmail Anda untuk mereset kata sandi.
          </p>
        </div>

        <div className="text-sm text-slate-500 flex items-center justify-between pt-6 relative z-10 border-t border-slate-800">
          <span>Powered by CationGate</span>
          <span>• Secure & Encrypted</span>
        </div>
      </div>

      {/* Right Panel – Admin Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-110 bg-[#f8fafc] border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-sm">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Lupa Password
            </h2>
            <p className="text-sm text-slate-500">
              {step === 1 ? "Masukkan alamat Gmail yang terdaftar di sistem." : "Masukkan OTP yang dikirim ke Gmail Anda."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-2 text-left">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 block">
                  Alamat Gmail
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all mt-6 flex items-center justify-center gap-2 disabled:bg-blue-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>{cooldown > 0 ? `Tunggu ${cooldown}s` : 'Kirim Kode OTP'}</span>
                    {!cooldown && <ArrowLeft className="w-4 h-4 rotate-180" />}
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2 text-left">
                <label htmlFor="otp" className="text-sm font-medium text-slate-700 block">
                  Kode OTP
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all text-sm text-slate-900 placeholder:text-slate-400 font-mono tracking-widest text-center"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="newPassword" className="text-sm font-medium text-slate-700 block">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    id="new_password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Sandi baru (Min. 6 Karakter)"
                    className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 text-sm shadow-sm px-4"
                  />
                </div>
                <div className="pt-2">
                  <PasswordStrength value={newPassword} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all mt-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Simpan Password Baru</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Kirim ulang kode OTP
                </button>
              </div>
            </form>
          )}

          <div className="pt-6 mt-8 border-t border-slate-200 text-center">
            <Link href={`/${params.school_slug}/auth/login`} className="inline-block text-sm text-slate-500 font-semibold cursor-pointer hover:text-slate-800 transition-colors">
              Kembali ke Halaman Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
