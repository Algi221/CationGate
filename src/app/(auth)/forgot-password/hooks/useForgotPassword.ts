"use client";

import { useState, useEffect } from "react";
import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Format alamat email tidak valid.").trim().toLowerCase()
});

export const otpSchema = z.object({
  otp: z.string().length(6, "Kode OTP harus berjumlah tepat 6 digit.").regex(/^\d{6}$/, "Kode OTP hanya berupa angka.")
});

export const passwordSchema = z.object({
  newPassword: z.string().min(6, "Kata sandi baru minimal harus 6 karakter."),
  confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi.")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru.",
  path: ["confirmPassword"]
});

export function useForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminUser, setAdminUser] = useState<any>(null);
  const [schoolSlug, setSchoolSlug] = useState<string>("smktarunabhakti");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mailer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), type: "forgot-password" })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`Kode OTP 6 digit telah dikirim ke ${email}`);
        setStep(2);
        setCooldown(60);
      } else {
        setErrorMsg(data.message || "Email tidak ditemukan atau terjadi kesalahan.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kendala jaringan saat menghubungi server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0 || loading) return;
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/mailer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), type: "forgot-password" })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`Kode OTP baru telah dikirimkan ke ${email}`);
        setCooldown(60);
      } else {
        setErrorMsg(data.message || "Gagal mengirim ulang kode OTP.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kendala jaringan saat mengirim ulang OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validation = otpSchema.safeParse({ otp });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mailer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg("Kode OTP berhasil diverifikasi.");
        if (data.token) {
          setSessionToken(data.token);
          setAdminUser(data.admin);
          setSchoolSlug(data.schoolSlug || "smktarunabhakti");
        }
        setStep(3);
      } else {
        setErrorMsg(data.message || "Kode OTP tidak valid atau sudah kedaluwarsa.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kendala jaringan saat memverifikasi OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validation = passwordSchema.safeParse({ newPassword, confirmPassword });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep(5);
      } else {
        setErrorMsg(data.message || "Gagal memperbarui kata sandi.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan sistem saat memperbarui kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    cooldown,
    isMobile,
    sessionToken,
    adminUser,
    schoolSlug,
    handleSendOTP,
    handleResendOTP,
    handleVerifyOTP,
    handleResetPassword
  };
}
