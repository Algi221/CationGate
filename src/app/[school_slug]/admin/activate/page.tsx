"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, School } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";
import { useSchoolHref } from "@/hooks/useSchoolHref";
import Swal from "sweetalert2";

function ActivateAdminContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { href } = useSchoolHref();
  const { ppdbTitle, ppdbLogo } = usePPDB();

  const schoolSlug = (params?.school_slug as string) || "";
  const tokenParam = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activatedSuccess, setActivatedSuccess] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMessage("Token aktivasi tidak boleh kosong.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal harus 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await fetch("/api/admin/users/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.trim(),
          password,
          school_slug: schoolSlug
        })
      });

      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem("ppdb_admin_token", data.token);
        }
        setActivatedSuccess(true);
        Swal.fire({
          icon: "success",
          title: "Aktivasi Berhasil! 🎉",
          text: "Akun admin Anda telah aktif. Mengalihkan ke dashboard...",
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => {
          router.push(href("/dashboard"));
        }, 1500);
      } else {
        setErrorMessage(data.message || "Gagal mengaktivasi akun admin.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center mx-auto mb-3 shadow-xs">
            {ppdbLogo ? (
              <Image src={ppdbLogo} alt="Logo" width={36} height={36} className="object-contain" />
            ) : (
              <ShieldCheck size={28} className="text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-2">
            <School size={11} />
            {ppdbTitle || schoolSlug.toUpperCase()}
          </span>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Aktivasi Akun Admin
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Atur kata sandi akun panitia Anda untuk mulai mengelola dashboard sekolah.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {activatedSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Akun Berhasil Diaktifkan!</h3>
            <p className="text-xs text-slate-500">Anda sedang dialihkan ke dashboard portal admin...</p>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="space-y-4">
            {!tokenParam && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                  Token Aktivasi Gmail
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Tempel token aktivasi dari email"
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Memproses Aktivasi...</span>
              ) : (
                <>
                  <span>Aktivasi Akun & Masuk Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ActivateAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat Halaman Aktivasi...</div>}>
      <ActivateAdminContent />
    </Suspense>
  );
}
