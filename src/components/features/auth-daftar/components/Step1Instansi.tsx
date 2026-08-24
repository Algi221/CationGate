"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SaaSFormData } from "../types";

interface Step1InstansiProps {
  formData: SaaSFormData;
  setFormData: React.Dispatch<React.SetStateAction<SaaSFormData>>;
  emailChecking: boolean;
  emailSuccessState: boolean;
  emailErrorState: string;
  handleEmailCheck: (e: React.FocusEvent<HTMLInputElement>) => void;
  setEmailErrorState: (val: string) => void;
  setEmailSuccessState: (val: boolean) => void;
}

export const Step1Instansi: React.FC<Step1InstansiProps> = ({
  formData,
  setFormData,
  emailChecking,
  emailSuccessState,
  emailErrorState,
  handleEmailCheck,
  setEmailErrorState,
  setEmailSuccessState
}) => {
  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="text-left"
    >
      <div className="space-y-3.5 sm:space-y-4">
        <div className="space-y-1">
          <Label htmlFor="school_name" className="text-[11px] font-bold text-slate-700">
            Nama Sekolah / Instansi
          </Label>
          <Input
            id="school_name"
            required
            value={formData.school_name}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({
                ...prev,
                school_name: val,
                slug: val.toLowerCase().replace(/[^a-z0-9-]/g, "")
              }));
            }}
            placeholder="Contoh: SMA Negeri 1 Jakarta"
            className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="slug" className="text-[11px] font-bold text-slate-700">
            Subdomain Portal Sekolah
          </Label>
          <div className="flex">
            <div className="flex h-10 sm:h-11 items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-[10px] font-medium text-slate-400">
              cationgate.site/
            </div>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                }))
              }
              placeholder="sman1jakarta"
              className="h-10 sm:h-11 rounded-l-none rounded-r-xl border-slate-200 bg-white font-mono text-xs shadow-none focus:border-slate-900 focus:ring-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-[11px] font-bold text-slate-700">
                Email Resmi
              </Label>
              {emailChecking && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
                  <Loader2 className="h-3 w-3 animate-spin" /> Memeriksa...
                </span>
              )}
              {emailSuccessState && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <Check className="h-3 w-3" /> Tersedia
                </span>
              )}
              {emailErrorState && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {emailErrorState.toLowerCase().includes("terdaftar") ? "Terdaftar" : "Format Tidak Valid"}
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onBlur={handleEmailCheck}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (emailErrorState) setEmailErrorState("");
                  if (emailSuccessState) setEmailSuccessState(false);
                }}
                placeholder="info@sman1jakarta.sch.id"
                className={`h-10 sm:h-11 rounded-xl bg-white text-xs shadow-none pr-9 transition-colors ${
                  emailErrorState
                    ? "border-rose-400 bg-rose-50/20 text-rose-950 focus:border-rose-500 focus:ring-0"
                    : emailSuccessState
                    ? "border-emerald-400 bg-emerald-50/20 text-slate-900 focus:border-emerald-500 focus:ring-0"
                    : "border-slate-200 focus:border-slate-900 focus:ring-0"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="text-[11px] font-bold text-slate-700">
              No. Telepon / WhatsApp
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="081234567890"
              className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="address" className="text-[11px] font-bold text-slate-700">
            Alamat Lengkap Sekolah
          </Label>
          <Input
            id="address"
            required
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Jl. Pendidikan No. 1, Jakarta"
            className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-xs shadow-none focus:border-slate-900 focus:ring-0"
          />
        </div>
      </div>
    </motion.div>
  );
};
