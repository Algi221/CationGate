"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        
        <div className="relative z-10">
          <Link 
            href={`/${schoolSlug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Halaman Utama
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              {ppdbLogo ? (
                <img src={ppdbLogo} alt="Logo" className="w-10 h-10 object-contain" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {ppdbTitle || "Portal PPDB"}
              </h2>
              <p className="text-sm text-white/70">Admin Dashboard</p>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Portal Admin<br />PPDB Online
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Kelola pendaftaran siswa baru, verifikasi dokumen, dan monitoring data secara real-time.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-white/60">
          <span>Powered by CationGate</span>
          <span>•</span>
          <span>Secure & Encrypted</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                {ppdbLogo ? (
                  <img src={ppdbLogo} alt="Logo" className="w-7 h-7 object-contain" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {ppdbTitle || "Portal PPDB"}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Login Admin
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Masuk menggunakan akun admin atau panitia PPDB
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400 flex items-start gap-3">
              <Lock className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{loading ? "Memproses..." : "Masuk Dashboard"}</span>
            </button>
          </form>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Lupa password atau kendala akses?
            </p>
            <p className="text-sm text-slate-900 dark:text-white font-semibold mt-1">
              Hubungi Superadmin Sekolah
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
