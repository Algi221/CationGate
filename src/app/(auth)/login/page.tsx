"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, "Harap masukkan username atau email resmi Anda.")
    .trim(),
  password: z.string().min(1, "Harap masukkan kata sandi akun Anda."),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // System Flow: Load remembered username if 'Ingat Saya' was checked
  useEffect(() => {
    try {
      const savedRemember = localStorage.getItem("cationgate_remember_me");
      const savedUsername = localStorage.getItem(
        "cationgate_remembered_username"
      );
      if (savedRemember === "true" && savedUsername) {
        setUsername(savedUsername);
        setRememberMe(true);
      }
    } catch (_e) {}
  }, []);

  useEffect(() => {
    fetch("/assets/lottie_animation/Digital Portal.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie fetch error:", err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsRateLimited(false);

    // Zod Client Validation
    const validation = loginFormSchema.safeParse({ username, password });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setIsRateLimited(true);
        setErrorMsg(
          data.message ||
            "Batas percobaan login terlampaui. Silakan tunggu beberapa menit."
        );
        return;
      }

      if (res.status === 403 && data.message?.includes("Gatekeeper")) {
        setErrorMsg(data.message);
        return;
      }

      if (data.success && data.token) {
        // System Flow: Remember Me Logic on successful login
        if (rememberMe) {
          localStorage.setItem("cationgate_remember_me", "true");
          localStorage.setItem("cationgate_remembered_username", username);
        } else {
          localStorage.removeItem("cationgate_remember_me");
          localStorage.removeItem("cationgate_remembered_username");
        }

        localStorage.setItem("ppdb_admin_token", data.token);
        if (data.admin) {
          localStorage.setItem("ppdb_admin_user", JSON.stringify(data.admin));
        }
        localStorage.setItem("ppdb_admin_last_active", Date.now().toString());

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
        }

        const targetSlug =
          data.school_slug ||
          data.admin?.school_slug ||
          (data.admin?.school_id && !String(data.admin.school_id).includes("-")
            ? data.admin.school_id
            : null);

        if (targetSlug) {
          router.push(`/${targetSlug}/dashboard`);
        } else if (data.admin?.role === "gatekeeper") {
          router.push("/gatekeeper/login");
        } else {
          router.push("/");
        }
      } else {
        setErrorMsg(
          data.message || "Username / Email atau kata sandi tidak sesuai."
        );
      }
    } catch (_err) {
      setErrorMsg(
        "Terjadi kendala jaringan atau server. Silakan coba sesaat lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const svgPathMobileInitial =
    "M 0 0 L 414 0 L 414 70 C 260 100, 120 90, 0 110 Z";
  const svgPathMobile =
    "M 0 0 L 414 0 L 414 125 C 290 165, 150 155, 0 185 Z";

  const svgPathDesktopInitial =
    "M 0 0 L 420 0 C 480 220, 360 380, 200 520 C 90 600, 0 540, 0 540 Z";
  const svgPathDesktop =
    "M 0 0 L 540 0 C 620 300, 460 500, 280 670 C 130 740, 0 670, 0 670 Z";
  const solidColor = "#0077c8"; // Vibrant Azure Blue from design screenshot

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-white text-slate-950 overflow-x-hidden relative flex flex-col justify-between p-4 sm:p-6 lg:p-10 pb-10 font-sans scheme-light">
      {/* BACKGROUND BUBBLE DENGAN ANIMASI SAAT MUNCUL (ENTRANCE) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 w-full lg:w-[50vw] h-45 lg:h-[92vh] pointer-events-none z-0"
      >
        <svg
          viewBox={isMobile ? "0 0 414 200" : "0 0 600 700"}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d={isMobile ? svgPathMobile : svgPathDesktop}
            fill={solidColor}
          />
        </svg>
      </motion.div>

      {/* HEADER / NAVBAR WITH ENTRANCE ANIMATION */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative lg:absolute top-2 lg:top-8 left-2 lg:left-8 right-2 lg:right-8 flex items-center justify-between z-20 mb-4 lg:mb-0"
      >
        <div className="flex items-center gap-2">
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(
                  "cationgate_internal_navigation",
                  "true"
                );
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

        {/* Center: Brand Logo */}
        <Link
          href="/"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem(
                "cationgate_internal_navigation",
                "true"
              );
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
            <span className="text-slate-950">Cation</span>
            <span style={{ color: solidColor }} className="drop-shadow-none">
              Gate
            </span>
          </div>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="hidden text-slate-500 font-medium lg:block">
            Belum mendaftarkan instansi?
          </span>
          <Link
            href="/daftar"
            className="rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-1.5 font-bold text-slate-700 transition-all hover:bg-white hover:text-[#0077c8] hover:border-[#0077c8]/40 hover:shadow-sm active:scale-95 shadow-xs"
          >
            Daftar Sekolah
          </Link>
        </div>
      </motion.div>

      {/* KONTEN UTAMA GRID 50:50 */}
      <div className="w-full max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto z-10 relative lg:pt-8">
        {/* SISI KIRI: DESKTOP ONLY */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-between relative pl-8 lg:pl-16 pr-4">
          {/* TEKS UTAMA DENGAN ENTRANCE ANIMATION */}
          <div className="z-10 w-1/2 pr-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] whitespace-pre-line drop-shadow-md">
                {"Portal\nAdmin"}
              </h2>
              <p className="text-xs lg:text-sm text-white/90 mt-5 font-medium leading-relaxed max-w-55">
                Masuk untuk mengelola sistem PPDB & operasional sekolah Anda.
              </p>
            </motion.div>
          </div>

          {/* AREA LOTTIE & FLOATING CAPSULE DENGAN ENTRANCE ANIMATION */}
          <div className="z-10 w-1/2 flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
                rotate: [0, 6, 0],
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.1 },
                scale: { duration: 0.4, delay: 0.1 },
                y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
              }}
              className="absolute -right-2 top-0 w-16 h-8 rounded-full bg-white/30 backdrop-blur-md shadow-lg z-30 border border-white/20"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full max-w-80 h-80 z-20"
            >
              {animationData && (
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* SISI KANAN: FORM INPUT DENGAN ENTRANCE ANIMATION */}
        <div className="lg:col-span-6 flex flex-col justify-center px-1 sm:px-6 lg:px-12 z-10">
          <motion.div
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full max-w-115 mx-auto bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none"
          >
            <div className="mb-7 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-extrabold tracking-tight text-slate-900 leading-tight">
                Hai, selamat datang <br className="hidden sm:inline" />
                kembali
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Baru di CationGate?{" "}
                <Link
                  href="/daftar"
                  className="font-bold text-[#0077c8] hover:text-[#005fa3] hover:underline transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>

            {isRegistered && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Registrasi sekolah berhasil! Silakan masuk dengan email dan
                  kata sandi yang telah Anda buat.
                </span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 flex items-start gap-2.5 rounded-xl border p-3 text-xs font-semibold ${
                  isRateLimited
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-red-100 bg-red-50 text-red-600"
                }`}
              >
                {isRateLimited ? (
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                ) : (
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                )}
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <Label
                  htmlFor="username"
                  className="text-[11px] font-bold text-slate-700"
                >
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
                    className="h-10 sm:h-11 pl-9 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                  />
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-[11px] font-bold text-slate-700"
                >
                  Kata Sandi
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="h-10 sm:h-11 pl-9 pr-10 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                  className="w-full h-12 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-sm shadow-md shadow-[#FFC000]/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div className="pt-1 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0077c8] focus:ring-[#0077c8] accent-[#0077c8] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600">
                    Ingatkan saya
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#0077c8] hover:text-[#005fa3] hover:underline transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* FOOTER INFO WITH ENTRANCE ANIMATION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full text-center text-xs text-slate-400 py-4 relative z-10"
      >
        <p>
          &copy; {new Date().getFullYear()} CationGate. Hak Cipta Dilindungi.
        </p>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0077c8]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
