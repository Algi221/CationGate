"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GatekeeperLoginPage() {
  const { loginGatekeeper, gatekeeperToken } = usePPDB();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

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

  // Fetch Lottie JSON dari folder public
  useEffect(() => {
    fetch("/assets/lottie_animation/verifyaplicants.json")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat animasi");
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie fetch error:", err));
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
  const svgPathMobileInitial =
    "M 0 0 L 414 0 L 414 40 C 200 60, 100 20, 0 30 Z";

  const svgPathDesktop =
    "M 0 0 L 540 0 C 620 300, 460 500, 280 670 C 130 740, 0 670, 0 670 Z";
  const svgPathDesktopInitial =
    "M 0 0 L 200 0 C 250 100, 150 200, 100 250 C 50 300, 0 250, 0 250 Z";

  const gatekeeperThemeColor = "#2e3749"; // Deep Slate Navy

  if (!mounted) return null;

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-white text-slate-950 overflow-x-hidden relative flex flex-col justify-between p-4 sm:p-6 lg:p-10 pb-10 selection:bg-[#FFD33B] selection:text-[#2e3749]">
      {/* BACKGROUND BUBBLE (Dark Navy Gatekeeper Palette dengan Animasi Masuk) */}
      <div className="absolute top-0 left-0 w-full lg:w-[50vw] h-45 lg:h-[92vh] pointer-events-none z-0">
        <svg
          viewBox={isMobile ? "0 0 414 200" : "0 0 600 700"}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{
              d: isMobile ? svgPathMobileInitial : svgPathDesktopInitial,
              fill: gatekeeperThemeColor,
              opacity: 0,
            }}
            animate={{
              d: isMobile ? svgPathMobile : svgPathDesktop,
              fill: gatekeeperThemeColor,
              opacity: 1,
            }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
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

        {/* Center: Brand Logo & Typography */}
        <Link
          href="/"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("cationgate_skip_splash", "true");
            }
          }}
          className="flex items-center gap-2 group lg:absolute lg:left-[45vw] lg:translate-x-[-55%] transition-transform hover:scale-102"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm p-1 flex items-center justify-center shrink-0 border border-white/20 shadow-sm">
            <Image
              src="/assets/logo_cationgate/CationGate_Logo.png"
              alt="CationGate Logo"
              width={26}
              height={26}
              className="w-full h-full object-contain transition-transform group-hover:rotate-6 drop-shadow-md"
            />
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight font-sans select-none flex items-center">
            <span className="text-yellow-500 drop-shadow-md">Cation</span>
            <span
              style={{ color: gatekeeperThemeColor }}
              className="drop-shadow-none"
            >
              Gate
            </span>
          </div>
        </Link>
      </div>

      {/* KONTEN UTAMA GRID 50:50 */}
      <div className="w-full max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto z-10 relative lg:pt-8">
        {/* SISI KIRI: DESKTOP ONLY (Teks & Lottie Animation) */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-between relative pl-8 lg:pl-16 pr-4">
          <div className="z-10 w-1/2 pr-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] whitespace-pre-line drop-shadow-md">
                {"Gatekeeper\nPortal"}
              </h2>
              <p className="text-xs lg:text-sm text-white/90 mt-5 font-medium leading-relaxed max-w-55">
                Akses panel kontrol sentral, verifikasi berkas SK sekolah, dan
                pengawasan multi-tenant platform CationGate.
              </p>
            </motion.div>
          </div>

          {/* AREA LOTTIE & FLOATING CAPSULE */}
          <div className="z-10 w-1/2 flex items-center justify-center relative">
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
              }}
              className="absolute -right-2 top-0 w-16 h-8 rounded-full bg-white/30 backdrop-blur-md shadow-lg z-30"
            />

            <div className="w-full max-w-80 h-80 z-20">
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-white/60" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SISI KANAN: FORM INPUT */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <div className="w-full max-w-115 mx-auto bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none">
            <div className="mb-7 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-extrabold tracking-tight text-slate-900 leading-tight">
                Konsol <br className="hidden sm:inline" />
                Gatekeeper
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Masukkan kredensial Super Administrator untuk mengakses panel
                kontrol sentral.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600"
              >
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label
                  htmlFor="gatekeeper-username"
                  className="text-[11px] font-bold text-slate-700"
                >
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
                    className="h-10 sm:h-11 pl-9 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-[#2e3749] focus:ring-0 transition-all"
                  />
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="gatekeeper-password"
                  className="text-[11px] font-bold text-slate-700"
                >
                  Kata Sandi Keamanan
                </Label>
                <div className="relative">
                  <Input
                    id="gatekeeper-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi root"
                    className="h-10 sm:h-11 pl-9 pr-10 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-[#2e3749] focus:ring-0 transition-all"
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Checkbox "Ingatkan saya" & Link Bantuan */}
              <div className="pt-1 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#2e3749] focus:ring-[#2e3749] accent-[#2e3749] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600">
                    Ingatkan saya
                  </span>
                </label>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-500 hover:text-[#2e3749] transition-colors"
                >
                  Masuk sebagai Admin Sekolah?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="w-full text-center text-xs text-slate-400 py-4 relative z-10">
        <p>
          &copy; {new Date().getFullYear()} CationGate Platform. Hak Cipta
          Dilindungi.
        </p>
      </div>
    </main>
  );
}
