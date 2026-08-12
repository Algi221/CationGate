"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminLogin() {
  const { loginAdmin, adminToken, ppdbTitle, ppdbLogo, isSchoolNotFound } = usePPDB();
  const router = useRouter();
  const params = useParams();
  const schoolSlug = params?.school_slug as string;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (adminToken && schoolSlug) router.push(`/${schoolSlug}/dashboard`);
  }, [adminToken, router, schoolSlug]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "true") {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Harap isi username dan password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        router.push(`/${schoolSlug}/dashboard`);
      } else {
        setError(res.message || "Username atau Password tidak valid.");
      }
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (isSchoolNotFound) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-slate-500 dark:text-slate-400" />
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#0f172a] font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Left Panel - Dark Mode Design matching Image 2 */}
      <div className="w-full lg:w-[45%] bg-[#0b1121] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Dotted Pattern */}
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
                <img src={ppdbLogo} alt="Logo" className="w-8 h-8 object-contain" />
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
            Portal Admin<br />PPDB Online
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Kelola pendaftaran siswa baru, verifikasi dokumen, dan monitoring data secara real-time dalam satu platform yang terintegrasi.
          </p>

          <div className="space-y-4 pt-4 hidden lg:block">
            <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span>Manajemen Pendaftaran Siswa Baru</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span>Verifikasi Dokumen & Berkas Cepat</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span>Monitoring Pembayaran Otomatis</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between pt-6 relative z-10 border-t border-slate-800">
          <span>Powered by CationGate</span>
          <span>• Secure & Encrypted</span>
        </div>
      </div>

      {/* Right Panel – Admin Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white dark:bg-[#0f172a]">
        {/* Floating Card like in Image 2 */}
        <div className="w-full max-w-[440px] bg-[#f8fafc] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-sm">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Login Admin
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Masuk menggunakan akun admin atau panitia PPDB
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 text-left">
              <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-200 block">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Lanjutkan</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 mt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Lupa password atau kendala akses?
            </p>
            <p className="text-sm text-blue-600 font-semibold mt-1 cursor-pointer hover:underline">
              Hubungi Superadmin Sekolah
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
