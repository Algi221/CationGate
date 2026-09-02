"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import Swal from "sweetalert2";
import { safeRedirect, sanitizeSlug } from "@/lib/sanitizeUrl";
import {
  LoginBackgroundBubble,
  LoginNavbar,
  LoginHeroPanel,
  LoginFormCard,
} from "./components";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Harap masukkan alamat email akun Anda.")
    .email("Format alamat email tidak valid.")
    .trim(),
  password: z.string().min(1, "Harap masukkan kata sandi akun Anda."),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const [email, setEmail] = useState("");
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

  // System Flow: Load remembered email if 'Ingat Saya' was checked
  useEffect(() => {
    try {
      const savedRemember = localStorage.getItem("cationgate_remember_me");
      const savedEmail =
        localStorage.getItem("cationgate_remembered_email") ||
        localStorage.getItem("cationgate_remembered_username");
      if (savedRemember === "true" && savedEmail) {
        setEmail(savedEmail);
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
    const validation = loginFormSchema.safeParse({ email, password });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setIsRateLimited(true);
        setErrorMsg(
          data.message ||
            "Batas percobaan login terlampaui. Silakan tunggu beberapa menit.",
        );
        return;
      }

      if (res.status === 403 && data.message?.includes("Gatekeeper")) {
        setErrorMsg(data.message);
        return;
      }

      if (res.status === 403 && data.requires_verification) {
        Swal.fire({
          title: "Verifikasi Akun Admin",
          html: `<p class="text-xs text-slate-500 mb-3">Akun Anda belum aktif. Masukkan 6 digit Kode OTP yang dikirimkan ke <strong>${data.email || email}</strong>:</p><input id="otp-input" class="w-full text-center text-lg font-mono tracking-widest p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="Contoh: 849201" maxlength="6" />`,
          showCancelButton: true,
          confirmButtonText: "Verifikasi OTP",
          cancelButtonText: "Batal",
          confirmButtonColor: "#2563eb",
          preConfirm: () => {
            const input = document.getElementById(
              "otp-input",
            ) as HTMLInputElement;
            if (!input || !input.value.trim()) {
              Swal.showValidationMessage("Harap masukkan kode OTP");
              return false;
            }
            return input.value.trim();
          },
        }).then(async (result) => {
          if (result.isConfirmed && result.value) {
            try {
              const vRes = await fetch("/api/admin/users/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  token: result.value,
                  otp: result.value,
                  email: (data.email || email).trim().toLowerCase(),
                  school_slug:
                    searchParams.get("school_slug") || "smktarunabhakti",
                }),
              });
              const vData = await vRes.json();
              if (vData.success) {
                Swal.fire({
                  icon: "success",
                  title: "Akun Berhasil Diverifikasi! 🎉",
                  text: "Silakan klik tombol Masuk kembali untuk login.",
                  confirmButtonColor: "#2563eb",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Verifikasi Gagal",
                  text:
                    vData.message ||
                    "Kode OTP tidak valid atau telah kedaluwarsa.",
                  confirmButtonColor: "#2563eb",
                });
              }
            } catch (_err) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Terjadi kesalahan saat memverifikasi kode OTP.",
                confirmButtonColor: "#2563eb",
              });
            }
          }
        });
        setErrorMsg(data.message);
        return;
      }

      if (data.success && data.token) {
        // System Flow: Remember Me Logic on successful login
        if (rememberMe) {
          localStorage.setItem("cationgate_remember_me", "true");
          localStorage.setItem("cationgate_remembered_email", email.trim());
        } else {
          localStorage.removeItem("cationgate_remember_me");
          localStorage.removeItem("cationgate_remembered_email");
        }

        localStorage.setItem("ppdb_admin_token", data.token);
        if (data.admin) {
          localStorage.setItem("ppdb_admin_user", JSON.stringify(data.admin));
        }
        localStorage.setItem("ppdb_admin_last_active", Date.now().toString());

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
        }

        const rawSlug =
          data.school_slug ||
          data.admin?.school_slug ||
          (data.admin?.school_id && !String(data.admin.school_id).includes("-")
            ? data.admin.school_id
            : null);
        const targetSlug = sanitizeSlug(rawSlug);
        const isVerifiedSchool =
          data.is_verified === true ||
          data.school_status === "FULL_VERIFIED" ||
          data.school_status === "VERIFIED" ||
          targetSlug === "smktarunabhakti" ||
          targetSlug === "smktiglobal" ||
          targetSlug === "demo";

        if (targetSlug) {
          if (typeof window !== "undefined") {
            localStorage.setItem("ppdb_admin_token", String(data.token || ""));
            localStorage.setItem(
              "ppdb_admin_last_active",
              Date.now().toString(),
            );

            const host = window.location.host.toLowerCase();
            const isLocalhost = host.includes("localhost");
            const port = window.location.port ? `:${window.location.port}` : "";
            const path = isVerifiedSchool
              ? "/dashboard"
              : "/dashboard/verification";
            const targetUrl = isLocalhost
              ? `http://${targetSlug}.localhost${port}${path}?auth_token=${encodeURIComponent(data.token)}`
              : `https://${targetSlug}.cationgate.site${path}?auth_token=${encodeURIComponent(data.token)}`;

            safeRedirect(targetUrl, `/${targetSlug}${path}`);
            return;
          }
          if (isVerifiedSchool) {
            router.push(`/${targetSlug}/dashboard`);
          } else {
            router.push(`/${targetSlug}/dashboard/verification`);
          }
        } else if (data.admin?.role === "gatekeeper") {
          router.push("/gatekeeper/login");
        } else {
          router.push("/");
        }
      } else {
        setErrorMsg(data.message || "Email atau kata sandi tidak sesuai.");
      }
    } catch (_err) {
      setErrorMsg(
        "Terjadi kendala jaringan atau server. Silakan coba sesaat lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cationgate_skip_splash", "true");
      sessionStorage.setItem("cationgate_internal_navigation", "true");
      const host = window.location.host.toLowerCase();
      const isLocalhost = host.includes("localhost");
      const port = window.location.port ? `:${window.location.port}` : "";
      const homeUrl = isLocalhost
        ? `http://localhost${port}/`
        : "https://cationgate.site/";
      safeRedirect(homeUrl, "/");
    }
  };

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-white text-slate-950 overflow-x-hidden relative flex flex-col justify-between p-4 sm:p-6 lg:p-10 pb-10 font-sans scheme-light">
      {/* 1. Animated Background Bubble */}
      <LoginBackgroundBubble isMobile={isMobile} />

      {/* 2. Header / Navbar */}
      <LoginNavbar onGoToHome={handleGoToHome} />

      {/* 3. Main Grid (Hero Panel + Form Card) */}
      <div className="w-full max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto z-10 relative lg:pt-8">
        <LoginHeroPanel animationData={animationData} />
        <LoginFormCard
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loading={loading}
          errorMsg={errorMsg}
          isRateLimited={isRateLimited}
          isRegistered={isRegistered}
          onSubmit={handleLogin}
        />
      </div>

      {/* 4. Footer */}
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
