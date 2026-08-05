"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LottiePlaceholder } from "@/components/ui/LottiePlaceholder";

export default function GatekeeperLogin() {
  const { loginAdmin, adminToken } = usePPDB();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (adminToken) router.push("/gatekeeper/dashboard");
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
      const res = await loginAdmin(username, password);
      if (res.success) {
        router.push("/gatekeeper/dashboard");
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground font-sans selection:bg-primary selection:text-white">

      {/* Left Panel – Clean Light Mode Branding */}
      <div className="w-full lg:w-[45%] bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        
        {/* Top Link & Logo */}
        <div className="space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Landing Page CationGate</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-foreground block">
                Cation<span className="text-primary">Gate</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Gatekeeper Platform Console</span>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="my-10 space-y-6 max-w-md">
          <LottiePlaceholder title="Login Animation" className="min-h-[200px]" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Platform Superadmin Console
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
            Selamat Datang, Gatekeeper CationGate
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed font-normal">
            Verifikasi pendaftaran sekolah baru, atur lisensi multi-tenant, dan pantau kesehatan node platform CationGate.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verifikasi & Unlock Akun Sekolah Tenant</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Manajemen Feedback & Laporan Bug Platform</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Audit Log Multitenant & Billing SLA</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Info */}
        <div className="text-xs text-slate-500 font-medium flex items-center justify-between border-t border-slate-100 pt-6">
          <span>Protected by AES-256 Gatekeeper Security</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
            SLA Uptime 99.99%
          </span>
        </div>

      </div>

      {/* Right Panel – Gatekeeper Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-background">
        <div className="w-full max-w-[420px] bg-card p-8 sm:p-10 rounded-3xl border border-border shadow-card">
          
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Lock className="w-3.5 h-3.5 text-primary" />
              Autentikasi Gatekeeper
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
              Login Gatekeeper
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Masukkan username & password Gatekeeper CationGate Anda.
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
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Username / Email Gatekeeper
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="gatekeeper / admin_cationgate"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input text-xs text-foreground bg-input/30 focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password Access
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-input text-xs text-foreground bg-input/30 focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs shadow-md tracking-wider uppercase transition-all duration-200 mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </div>
              ) : (
                "Masuk Konsol Gatekeeper"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Kendala autentikasi Gatekeeper? Contact Support Team.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
