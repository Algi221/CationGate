"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LottiePlaceholder } from "@/components/ui/LottiePlaceholder";

export default function GatekeeperLogin() {
  const { loginGatekeeper, adminToken } = usePPDB();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (adminToken) window.location.href = "/gatekeeper/dashboard";
  }, [adminToken, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Harap isi username dan password Gatekeeper.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginGatekeeper(username, password);
      if (res.success) {
        window.location.href = "/gatekeeper/dashboard";
      } else {
        setError(res.message || "Kredensial Gatekeeper tidak valid.");
      }
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div data-dashboard="true" className="min-h-screen w-full flex flex-col lg:flex-row font-sans selection:bg-blue-600 selection:text-white">

      {/* Left Panel - Dark Mode Design matching Image 2 */}
      <div className="w-full lg:w-[45%] bg-[#0b1121] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        
        {/* Dotted Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        {/* Top Link & Logo */}
        <div className="space-y-6 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Landing Page CationGate</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white block">
                CationGate
              </span>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="my-10 space-y-8 max-w-md relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Selamat Datang, Gatekeeper CationGate.
          </h1>

          <p className="text-slate-400 text-base leading-relaxed">
            Verifikasi pendaftaran sekolah baru, atur lisensi multi-tenant, dan pantau kesehatan node platform CationGate secara mudah dan terpusat.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span>Verifikasi & Unlock Akun Sekolah Tenant</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span>Manajemen Feedback & Laporan Bug Platform</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span>Audit Log Multitenant & Billing SLA</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Info */}
        <div className="text-sm text-slate-500 flex items-center justify-between pt-6 relative z-10">
          <span>© 2026 CationGate. • ISO 27001 Certified</span>
        </div>

      </div>

      {/* Right Panel – Gatekeeper Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        {/* Floating Card like in Image 2 */}
        <div className="w-full max-w-[440px] bg-[#f8fafc] border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-sm">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Login Gatekeeper
            </h2>
            <p className="text-sm text-slate-500">
              Lengkapi informasi kredensial admin Anda.
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
              <label className="text-sm font-medium text-slate-700 block">
                Username / Email Gatekeeper
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: admin_cationgate"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-700 block">
                Password Access
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Lanjutkan</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            Dengan mendaftar, Anda menyetujui <span className="text-blue-600 font-medium">Syarat & Ketentuan</span> serta <span className="text-blue-600 font-medium">Kebijakan Privasi</span> CationGate.
          </div>

        </div>
      </div>

    </div>
  );
}
