"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, Building2 } from "lucide-react";

export default function AdminLogin() {
  const { loginAdmin, adminToken, ppdbTitle } = usePPDB();
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
  }, [adminToken, router]);

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

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">

      {/* Left Panel – Clean Light Mode Branding */}
      <div className="w-full lg:w-[45%] bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        
        {/* Top Link & Logo */}
        <div className="space-y-6">
          <Link 
            href="../" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Landing Page Sekolah</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block">
                Cation<span className="text-blue-600">Gate</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Portal Admin PPDB</span>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="my-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Akses Terenkripsi & Terverifikasi
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
            Selamat Datang di Portal Pengelola PPDB
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed font-normal">
            Kelola pendaftaran calon peserta didik baru, lakukan verifikasi dokumen AI/manual, dan pantau kuota secara real-time.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verifikasi Berkas Otomatis & AI OCR</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sistem Pembayaran Auto-Sync Midtrans</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Data Format Kemendikbud (Dapodik)</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Info */}
        <div className="text-xs text-slate-500 font-medium flex items-center justify-between border-t border-slate-100 pt-6">
          <span>Protected by AES-256 Encryption</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
            SLA Uptime 99.99%
          </span>
        </div>

      </div>

      {/* Right Panel – Clean Stripe / Vercel Style Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50">
        <div className="w-full max-w-[420px] bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md">
          
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Autentikasi Pengelola
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
              Login Admin Sekolah
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Masukkan kredensial username dan password akun panitia PPDB Anda.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-start gap-2.5">
              <Lock className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-bold text-slate-700">
                Username Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_ppdb"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold text-slate-700">
                  Password Access
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Memproses Autentikasi..." : "Masuk ke Dashboard Admin"}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-medium space-y-1">
            <p>Kendala login atau lupa password?</p>
            <p className="text-slate-700 font-semibold">Hubungi Superadmin CationGate via WhatsApp Support</p>
          </div>

        </div>
      </div>

    </div>
  );
}
