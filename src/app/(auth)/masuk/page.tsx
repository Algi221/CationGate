"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { ArrowLeft, ArrowRight, Info, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MasukUniversal() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/assets/lottie_animation/Digital Portal.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie fetch error:", err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Harap masukkan username / email dan password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success && data.token) {

        localStorage.setItem("ppdb_admin_token", data.token);
        if (data.admin) {
          localStorage.setItem("ppdb_admin_user", JSON.stringify(data.admin));
        }
        localStorage.setItem("ppdb_admin_last_active", Date.now().toString());

        if (data.school_slug) {
          router.push(`/${data.school_slug}/dashboard`);
        } else if (data.admin?.role === "gatekeeper" || data.admin?.role === "superadmin") {
          router.push("/gatekeeper/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setErrorMsg(data.message || "Username atau password salah.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan jaringan atau server. Silakan coba lagi.");
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

        {/* Center: Brand Logo & Typography Split Between Wave and White Background */}
        <Link 
          href="/"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("cationgate_skip_splash", "true");
            }
          }}
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
            {/* 'Cation' in black */}
            <span className="text-slate-950">
              Cation
            </span>
            {/* 'Gate' in solid wave color */}
            <span style={{ color: solidColor }} className="drop-shadow-none">
              Gate
            </span>
          </div>
        </Link>

        {/* LINK DAFTAR INSTANSI */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="hidden text-slate-500 font-medium sm:block">Belum mendaftarkan instansi?</span>
          <Link
            href="/daftar"
            className="rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-1.5 font-bold text-slate-700 transition-all hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-sm active:scale-95 shadow-xs"
          >
            Daftar Sekolah
          </Link>
        </div>
      </div>

      {/* KONTEN UTAMA GRID 50:50 */}
      <div className="w-full max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto z-10 relative lg:pt-8">
        {/* SISI KIRI: HANYA MUNCUL DI DESKTOP */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-between relative pl-8 lg:pl-16 pr-4">
          {/* TEKS UTAMA */}
          <div className="z-10 w-1/2 pr-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] whitespace-pre-line drop-shadow-md">
                {"Portal\nAdmin"}
              </h2>
              <p className="text-xs lg:text-sm text-white/90 mt-5 font-medium leading-relaxed max-w-55">
                Masuk untuk mengelola sistem PPDB & operasional sekolah Anda.
              </p>
            </motion.div>
          </div>

          {/* AREA LOTTIE & FLOATING CAPSULE */}
          <div className="z-10 w-1/2 flex items-center justify-center relative">
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -right-2 top-0 w-16 h-8 rounded-full bg-white/30 backdrop-blur-md shadow-lg z-30"
            />

            <div className="w-full max-w-80 h-80 z-20">
              {animationData && (
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>

        {/* SISI KANAN: FORM INPUT */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <div className="w-full max-w-115 mx-auto bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                Masuk ke Dashboard
              </h1>
              <p className="mt-1.5 text-xs text-slate-400">
                Akses panel kontrol dan dashboard instansi Anda secara langsung.
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

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username" className="text-[11px] font-bold text-slate-700">
                  Username atau Email Resmi
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@sekolah.sch.id atau username"
                    className="h-10 sm:h-11 pl-9 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
                  />
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[11px] font-bold text-slate-700">
                    Kata Sandi
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="h-10 sm:h-11 pl-9 pr-10 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
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
                  className="w-full h-12 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>Belum punya akun? </span>
                <Link
                  href="/daftar"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Daftar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="w-full text-center text-xs text-slate-400 py-4 relative z-10">
        <p>&copy; {new Date().getFullYear()} CationGate. Hak Cipta Dilindungi.</p>
      </div>
    </main>
  );
}
