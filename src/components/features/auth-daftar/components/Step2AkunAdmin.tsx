"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordStrength } from "@/components/ui/password-strength";
import { SaaSFormData } from "../types";

interface Step2AkunAdminProps {
  formData: SaaSFormData;
  setFormData: React.Dispatch<React.SetStateAction<SaaSFormData>>;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
}

export const Step2AkunAdmin: React.FC<Step2AkunAdminProps> = ({
  formData,
  setFormData,
  showPassword,
  setShowPassword
}) => {
  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="text-left"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="admin_name" className="text-[11px] font-bold text-slate-700">
            Nama Lengkap Administrator
          </Label>
          <Input
            id="admin_name"
            required
            value={formData.admin_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, admin_name: e.target.value }))}
            placeholder="Contoh: Budi Setiawan, M.Kom"
            className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="admin_password" className="text-[11px] font-bold text-slate-700">
            Kata Sandi Utama
          </Label>
          <div className="relative">
            <Input
              id="admin_password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.admin_password}
              onChange={(e) => setFormData((prev) => ({ ...prev, admin_password: e.target.value }))}
              placeholder="Minimal 8 karakter"
              className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none pr-10 focus:border-slate-900 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <PasswordStrength value={formData.admin_password} />
        </div>
      </div>
    </motion.div>
  );
};
