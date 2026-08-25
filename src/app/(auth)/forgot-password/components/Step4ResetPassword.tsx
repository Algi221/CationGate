import React from "react";
import { motion } from "framer-motion";
import { Lock, Info, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/ui/password-strength";

interface Step4ResetPasswordProps {
  email: string;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  errorMsg: string;
  loading: boolean;
  onResetPassword: (e: React.FormEvent) => void;
  onBackToChoices: () => void;
}

export const Step4ResetPassword: React.FC<Step4ResetPasswordProps> = ({
  email,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  errorMsg,
  loading,
  onResetPassword,
  onBackToChoices
}) => {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-5">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950">
          Buat Kata Sandi Baru
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Masukkan kata sandi baru yang kuat untuk akun <strong className="text-slate-800">{email}</strong>.
        </p>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <form onSubmit={onResetPassword} className="space-y-4">
        {/* New Password */}
        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700">
            Kata Sandi Baru
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="h-11 pl-9 pr-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
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
          <div className="pt-1">
            <PasswordStrength value={newPassword} />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
            Konfirmasi Kata Sandi Baru
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="h-11 pl-9 pr-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#FFC000] hover:bg-[#F3C625] text-slate-950 font-bold text-sm shadow-md shadow-[#FFC000]/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Menyimpan Kata Sandi...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Simpan Kata Sandi Baru</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBackToChoices}
            className="w-full p-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer text-center transition-colors"
          >
            &larr; Pilihan opsi lain
          </button>
        </div>
      </form>
    </motion.div>
  );
};
