"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, ShieldCheck, ShieldAlert, KeyRound, Server } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GatekeeperLoginPage() {
  const { loginGatekeeper, gatekeeperToken } = usePPDB();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    if (gatekeeperToken) {
      router.push("/gatekeeper/dashboard");
    }
    return () => clearTimeout(timer);
  }, [gatekeeperToken, router]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        router.push("/gatekeeper/dashboard");
      } else {
        setError(res.message || "Kredensial Gatekeeper tidak valid.");
      }
    } catch {
      setError("Terjadi kesalahan sistem atau jaringan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const svgPathMobile = "M 0 0 L 414 0 L 414 125 C 290 165, 150 155, 0 185 Z";
  const svgPathDesktop = "M 0 0 L 540 0 C 620 300, 460 500, 280 670 C 130 740, 0 670, 0 670 Z";
  const gatekeeperThemeColor = "#2e3749"; // Deep Slate Navy

  if (!mounted) return null;

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-slate-50 text-slate-950 overflow-x-hidden relative flex flex-col justify-between p-4 sm:p-6 lg:p-10 pb-10 selection:bg-[#FFD33B] selection:text-[#2e3749]">
      {/* BACKGROUND BUBBLE (Dark Navy Gatekeeper Palette) */}
      <div className="absolute top-0 left-0 w-full lg:w-[50vw] h-45 lg:h-[92vh] pointer-events-none z-0">
        <svg
          viewBox={isMobile ? "0 0 414 200" : "0 0 600 700"}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: isMobile ? svgPathMobile : svgPathDesktop, fill: gatekeeperThemeColor }}
            animate={{ d: isMobile ? svgPathMobile : svgPathDesktop, fill: gatekeeperThemeColor }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* HEADER / NAVBAR */}
      <div className="relative lg:absolute top-2 lg:top-8 left-2 lg:left-8 right-2 lg:right-8 flex items-center justify-between z-20 mb-4 lg:mb-0">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("cationgate_skip_splash", "true");
              }
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-white/80 transition-all group drop-shadow-sm"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Beranda</span>
          </Link>
        </div>

        {/* Center: Brand Logo & Gatekeeper Badge */}
        <Link
          href="/"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("cationgate_skip_splash", "true");
            }
          }}
          className="flex items-center gap-2 group lg:absolute lg:left-[45vw] lg:translate-x-[-55%] transition-transform hover:scale-102"
        >
          <div className="w-8 h-8 rounded-xl bg-[#2e3749] p-1 flex items-center justify-center shrink-0 border border-white/20 shadow-sm">
            <Image
              src="/assets/logo_cationgate/CationGate_Logo.png"
              alt="CationGate Logo"
              width={26}
              height={26}
              className="w-full h-full object-contain transition-transform group-hover:rotate-6 drop-shadow-sm"
            />
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight font-sans select-none flex items-center">
            <span className="text-slate-950">Cation</span>
            <span className="text-[#2e3749] drop-shadow-none">Gate</span>
            <span className="ml-2 text-[10px] font-black uppercase tracking-widest bg-[#FFD33B] text-[#2e3749] px-2 py-0.5 rounded-full border border-amber-400/40">
              Gatekeeper
            </span>
          </div>
        </Link>

        {/* Right Action: Admin Login Link */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="hidden text-slate-500 font-medium sm:block">Login Admin Sekolah?</span>
          <Link
            href="/login"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 font-bold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-950 active:scale-95 shadow-xs"
          >
            Portal Sekolah
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#FFD33B]" />
              <span>Root Console & SuperAdmin Security</span>
            </div>

            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] whitespace-pre-line drop-shadow-md">
              {"Gatekeeper\nPortal"}
            </h2>

            <p className="text-xs lg:text-sm text-slate-200 mt-4 font-medium leading-relaxed max-w-md">
              Akses panel kontrol sentral, verifikasi berkas SK sekolah, manajemen paket langganan, dan pengawasan multi-tenant platform CationGate.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 max-w-md">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-[#FFD33B]">
                  <Server size={14} /> Multi-Tenant
                </div>
                <p className="text-[11px] text-slate-300">Pengawasan instrumen seluruh sekolah pendaftar.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-[#FFD33B]">
                  <KeyRound size={14} /> SHA-256 Guard
                </div>
                <p className="text-[11px] text-slate-300">Isolasi sesi & perlindungan otorisasi root level.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SISI KANAN: FORM INPUT */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <div className="w-full max-w-115 mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
            <div className="mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#2e3749] text-[#FFD33B] flex items-center justify-center mb-3 shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2e3749]">
                Masuk Gatekeeper
              </h1>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Masukkan kredensial Super Administrator untuk mengakses panel kontrol.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600"
              >
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="gatekeeper-username" className="text-xs font-bold text-slate-700">
                  Username Gatekeeper
                </Label>
                <div className="relative">
                  <Input
                    id="gatekeeper-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username root"
                    className="h-11 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-[#2e3749] focus:ring-2 focus:ring-[#2e3749]/10 transition-all"
                  />
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gatekeeper-password" className="text-xs font-bold text-slate-700">
                    Kata Sandi Keamanan
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="gatekeeper-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi root"
                    className="h-11 pl-9 pr-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-[#2e3749] focus:ring-2 focus:ring-[#2e3749]/10 transition-all"
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
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] font-black text-sm shadow-md hover:shadow-lg shadow-[#FFD33B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#2e3749]" />
                      <span>Mengotentikasi SuperAdmin...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Konsol Gatekeeper</span>
                      <ArrowRight className="w-4 h-4 text-[#2e3749]" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Sistem Aktif & Terlindungi
                </span>
                <span>v2.4 Platform Control</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="w-full text-center text-xs text-slate-400 py-4 relative z-10">
        <p>&copy; {new Date().getFullYear()} CationGate Platform. Konsol SuperAdmin Terbatas.</p>
      </div>
    </main>
  );
}
