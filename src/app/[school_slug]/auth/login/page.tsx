"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with lottie-react
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// ── Animated number counter ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

export default function AdminLogin() {
  const { loginAdmin, adminToken } = usePPDB();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const formElementsRef = useRef<(HTMLElement | null)[]>([]);
  const lottieRef = useRef<any>(null);

  // Stat counter start trigger
  const [counterStart, setCounterStart] = useState(false);
  const c1 = useCountUp(1240, 1400, counterStart);
  const c2 = useCountUp(98, 1600, counterStart);
  const c3 = useCountUp(6, 1000, counterStart);

  // ── Load Lottie JSON ───────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/assets/lottie_animation/verifyaplicants.json")
      .then(r => r.json())
      .then(setLottieData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMounted(true);
    if (adminToken) router.push("/dashboard");
  }, [adminToken, router]);

  // Expired session param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "true") {
        setError("Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan login kembali.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // ── Entrance animation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      // Left panel slides in from left
      gsap.fromTo(leftPanelRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      );
      // Brand elements stagger
      gsap.fromTo(".brand-element",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", delay: 0.3 }
      );
      // Lottie container
      gsap.fromTo(".lottie-container",
        { opacity: 0, scale: 0.88, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.4)", delay: 0.5 }
      );
      // Right panel form elements
      gsap.fromTo(formElementsRef.current.filter(Boolean),
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.4 }
      );
      // Start counters after a short delay
      setTimeout(() => setCounterStart(true), 1200);
    }, containerRef);
    return () => ctx.revert();
  }, [mounted]);

  // ── Split curtain on successful login ─────────────────────────────────────
  const triggerSplitAnimation = useCallback(() => {
    if (!leftPanelRef.current || !rightPanelRef.current) return;

    const isMobile = window.innerWidth < 1024; // lg breakpoint is 1024px
    const tl = gsap.timeline({ onComplete: () => router.push("/dashboard") });

    if (isMobile) {
      // On mobile, they are stacked vertically. Slide top panel UP and bottom panel DOWN.
      tl.to(leftPanelRef.current, { y: "-100%", duration: 0.85, ease: "power3.inOut" }, 0)
        .to(rightPanelRef.current, { y: "100%", duration: 0.85, ease: "power3.inOut" }, 0);
    } else {
      // On desktop, they are side-by-side. Split left panel LEFT and right panel RIGHT.
      tl.to(leftPanelRef.current, { x: "-100%", duration: 0.85, ease: "power3.inOut" }, 0)
        .to(rightPanelRef.current, { x: "100%", duration: 0.85, ease: "power3.inOut" }, 0);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        setLoginSuccess(true);
        // Small success pulse on button then split
        gsap.to(".login-btn", {
          scale: 1.04, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut",
          onComplete: triggerSplitAnimation
        });
      } else {
        setError(res.message || "Username atau Password salah.");
        gsap.fromTo(".login-form",
          { x: -8 },
          { x: 8, duration: 0.08, yoyo: true, repeat: 5, ease: "linear",
            onComplete: () => gsap.set(".login-form", { x: 0 }) }
        );
      }
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-100 dark:bg-[#0B1120] transition-colors duration-300">

      {/* ── Left Panel – Branding + Lottie ──────────────────────────────────── */}
      <div
        ref={leftPanelRef}
        className="relative w-full lg:w-[46%] xl:w-[48%] min-h-[50vh] lg:min-h-screen
          bg-slate-50 dark:bg-slate-900 z-10
          border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-white/5
          overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-14 transition-colors duration-300"
      >
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]
          bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]
          dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]
          bg-[size:28px_28px]" />

        {/* Soft radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10">
          <img
            src="/assets/logo_sekolah/logo_smktb.png"
            alt="Logo SMK Taruna Bhakti"
            className="brand-element w-14 h-14 object-contain mb-6 drop-shadow-md"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/logo_smktb.png";
            }}
          />
          <h1 className="brand-element text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-[1.15] mb-3">
            Portal Admin <br />
            <span className="text-blue-600 dark:text-blue-400">SMK Taruna Bhakti</span>
          </h1>
          <p className="brand-element text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-semibold">
            Sistem Informasi Manajemen Penerimaan Peserta Didik Baru (PPDB) terintegrasi.
          </p>
        </div>

        {/* Lottie Animation */}
        <div className="lottie-container relative z-10 my-4 lg:my-0 flex items-center justify-center flex-1">
          {lottieData ? (
            <div className="w-full max-w-[520px] mx-auto">
              <Lottie
                lottieRef={lottieRef}
                animationData={lottieData}
                loop={true}
                autoplay={true}
                className="w-full"
              />
            </div>
          ) : (
            /* Skeleton while loading */
            <div className="w-80 h-80 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
          )}
        </div>

        {/* Mini stats row */}
        <div className="brand-element relative z-10 grid grid-cols-3 gap-3">
          {[
            { label: "Pendaftar", value: c1, suffix: "+" },
            { label: "Akurasi Data", value: c2, suffix: "%" },
            { label: "Jurusan", value: c3, suffix: "" },
          ].map((s) => (
            <div key={s.label}
              className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200/60 dark:border-white/8
                rounded-xl p-3 text-center"
            >
              <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                {s.value}{s.suffix}
              </div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel – Login Form ─────────────────────────────────────────── */}
      <div
        ref={rightPanelRef}
        className="w-full lg:w-[54%] xl:w-[52%] min-h-[60vh] lg:min-h-screen z-10
          flex items-center justify-center
          p-6 md:p-12
          bg-white dark:bg-[#0B1120] transition-colors duration-300"
      >
        <div className="w-full max-w-[420px]">

          {/* Heading */}
          <div ref={el => { formElementsRef.current[0] = el; }} className="mb-9">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/40
              text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <ShieldCheck size={11} />
              Akses Admin
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
              Masukkan kredensial Anda untuk melanjutkan ke dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form space-y-5">
            {/* Error */}
            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20
                rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2.5
                animate-in slide-in-from-top-1 duration-200">
                <ShieldCheck size={15} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Username */}
            <div ref={el => { formElementsRef.current[1] = el as HTMLDivElement; }} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-350 uppercase tracking-wider">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none
                  text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <User size={17} />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50
                    border border-slate-200 dark:border-slate-800 rounded-xl
                    text-slate-900 dark:text-white placeholder:text-slate-450 text-sm
                    transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                    shadow-sm font-semibold"
                  placeholder="Masukkan username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div ref={el => { formElementsRef.current[2] = el as HTMLDivElement; }} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-350 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none
                  text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-900/50
                    border border-slate-200 dark:border-slate-800 rounded-xl
                    text-slate-900 dark:text-white placeholder:text-slate-450 text-sm
                    transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                    shadow-sm font-semibold"
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center
                    text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div ref={el => { formElementsRef.current[3] = el as HTMLDivElement; }} className="pt-3">
              <button
                type="submit"
                disabled={loading || loginSuccess}
                className="login-btn w-full flex items-center justify-center gap-2.5 py-3.5 px-4
                  bg-gradient-to-r from-blue-600 to-blue-500
                  hover:from-blue-700 hover:to-blue-600
                  text-white rounded-xl text-sm font-bold
                  transition-all active:scale-[0.98]
                  disabled:opacity-70 disabled:pointer-events-none
                  shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40
                  focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Memproses...</span>
                  </>
                ) : loginSuccess ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Berhasil!</span>
                  </>
                ) : (
                  <span>Masuk ke Dashboard</span>
                )}
              </button>
            </div>
          </form>

          <div ref={el => { formElementsRef.current[4] = el as HTMLDivElement; }} className="mt-7 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold
                text-slate-400 hover:text-blue-600 dark:hover:text-blue-400
                transition-colors"
            >
              <ArrowLeft size={14} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
