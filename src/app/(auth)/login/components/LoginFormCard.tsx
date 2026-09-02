"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Info,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormCardProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  loading: boolean;
  errorMsg: string;
  isRateLimited: boolean;
  isRegistered: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginFormCard({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  loading,
  errorMsg,
  isRateLimited,
  isRegistered,
  onSubmit,
}: LoginFormCardProps) {
  return (
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
              Registrasi sekolah berhasil! Silakan masuk dengan email dan kata sandi yang telah Anda buat.
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

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-[11px] font-bold text-slate-700">
              Alamat Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sekolah.sch.id"
                className="h-10 sm:h-11 pl-9 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
              />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-[11px] font-bold text-slate-700">
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
  );
}
