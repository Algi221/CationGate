"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SaaSFormData, StepVisual } from "../types";

export const stepEditorialVisuals: StepVisual[] = [
  {
    step: 1,
    path: "/assets/lottie_animation/Resume Evaluation.json",
    title: "Data\nInstansi",
    desc: "Mulai buat portal PPDB sekolah Anda.",
    svgPathMobile: "M 0 0 L 414 0 L 414 120 C 280 170, 140 150, 0 180 Z",
    svgPathDesktop: "M 0 0 L 520 0 C 600 280, 440 480, 280 640 C 140 760, 0 700, 0 700 Z",
    solidColor: "#FFC02D"
  },
  {
    step: 2,
    path: "/assets/lottie_animation/Digital Portal.json",
    title: "Akun\nAdmin",
    desc: "Amankan hak akses administrator sistem.",
    svgPathMobile: "M 0 0 L 414 0 L 414 125 C 290 165, 150 155, 0 185 Z",
    svgPathDesktop: "M 0 0 L 540 0 C 620 300, 460 500, 280 670 C 130 740, 0 670, 0 670 Z",
    solidColor: "#0284C7"
  },
  {
    step: 3,
    path: "/assets/lottie_animation/Manbrown.json",
    title: "Konfirmasi\nAkhir",
    desc: "Verifikasi data dan aktifkan portal cloud.",
    svgPathMobile: "M 0 0 L 414 0 L 414 120 C 270 175, 130 160, 0 180 Z",
    svgPathDesktop: "M 0 0 L 500 0 C 580 290, 430 490, 270 650 C 120 760, 0 690, 0 690 Z",
    solidColor: "#B45309"
  }
];

export function useDaftarSaaSState() {
  const router = useRouter();
  const [formData, setFormData] = useState<SaaSFormData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("cationgate_daftar_form_draft");
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (_e) {}
    }
    return {
      school_name: "",
      slug: "",
      email: "",
      phone: "",
      address: "",
      admin_name: "",
      admin_password: ""
    };
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedStep = sessionStorage.getItem("cationgate_daftar_step");
        if (savedStep) {
          const parsed = parseInt(savedStep, 10);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= 4) {
            return parsed;
          }
        }
      } catch (_e) {}
    }
    return 1;
  });

  const [maxReachedStep, setMaxReachedStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMax = sessionStorage.getItem("cationgate_daftar_max_step");
        if (savedMax) {
          const parsed = parseInt(savedMax, 10);
          if (!isNaN(parsed) && parsed >= 1) return parsed;
        }
      } catch (_e) {}
    }
    return 1;
  });

  const [errorMsg, setErrorMsg] = useState("");

  const [emailChecking, setEmailChecking] = useState(false);
  const [emailErrorState, setEmailErrorState] = useState("");
  const [emailSuccessState, setEmailSuccessState] = useState(false);

  const [slugChecking, setSlugChecking] = useState(false);
  const [slugErrorState, setSlugErrorState] = useState("");
  const [slugSuccessState, setSlugSuccessState] = useState(false);

  const [_otpSent, setOtpSent] = useState(false);
  const [_otpVerified, setOtpVerified] = useState(false);
  const [_otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const sentTimeStr = sessionStorage.getItem("cationgate_otp_sent_time");
        if (sentTimeStr) {
          const sentTime = parseInt(sentTimeStr, 10);
          const elapsed = Math.floor((Date.now() - sentTime) / 1000);
          if (elapsed < 60) return 60 - elapsed;
        }
      } catch (_e) {}
    }
    return 0;
  });

  // Persist form state & step to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("cationgate_daftar_form_draft", JSON.stringify(formData));
      } catch (_e) {}
    }
  }, [formData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("cationgate_daftar_step", String(step));
        sessionStorage.setItem("cationgate_daftar_max_step", String(maxReachedStep));
      } catch (_e) {}
    }
  }, [step, maxReachedStep]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationsData, setAnimationsData] = useState<{ [key: number]: any }>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    Promise.all(
      stepEditorialVisuals.map(async (item) => {
        try {
          const res = await fetch(item.path);
          const data = await res.json();
          return { step: item.step, data };
        } catch {
          return { step: item.step, data: null };
        }
      })
    ).then((results) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map: { [key: number]: any } = {};
      results.forEach((r) => {
        map[r.step] = r.data;
      });
      setAnimationsData(map);
    });
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    const email = formData.email.trim();
    if (!email) {
      const id = setTimeout(() => {
        setEmailErrorState("");
        setEmailSuccessState(false);
        setEmailChecking(false);
      }, 0);
      return () => clearTimeout(id);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const id = setTimeout(() => {
        setEmailSuccessState(false);
      }, 0);
      return () => clearTimeout(id);
    }

    const timer = setTimeout(async () => {
      setEmailChecking(true);
      setEmailErrorState("");
      setEmailSuccessState(false);

      try {
        const res = await fetch("/api/saas/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.exists || !data.available) {
          setEmailErrorState("Email sudah terdaftar. Gunakan email lain.");
          setEmailSuccessState(false);
        } else {
          setEmailErrorState("");
          setEmailSuccessState(true);
        }
      } catch {
        setEmailErrorState("");
      } finally {
        setEmailChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  useEffect(() => {
    const slug = formData.slug.trim().toLowerCase();
    if (!slug) {
      const id = setTimeout(() => {
        setSlugErrorState("");
        setSlugSuccessState(false);
        setSlugChecking(false);
      }, 0);
      return () => clearTimeout(id);
    }

    if (slug.length < 3) {
      const id = setTimeout(() => {
        setSlugErrorState("Subdomain minimal 3 karakter.");
        setSlugSuccessState(false);
        setSlugChecking(false);
      }, 0);
      return () => clearTimeout(id);
    }

    const timer = setTimeout(async () => {
      setSlugChecking(true);
      setSlugErrorState("");
      setSlugSuccessState(false);

      try {
        const res = await fetch("/api/saas/check-slug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug })
        });
        const data = await res.json();
        if (data.exists || !data.available) {
          setSlugErrorState(data.message || "Subdomain sudah digunakan sekolah lain.");
          setSlugSuccessState(false);
        } else {
          setSlugErrorState("");
          setSlugSuccessState(true);
        }
      } catch {
        setSlugErrorState("");
      } finally {
        setSlugChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.slug]);

  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrorMsg("Harap isi Email Resmi instansi terlebih dahulu.");
      return;
    }
    setOtpLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/mailer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "registration" })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("cationgate_otp_sent_time", String(Date.now()));
        }
        setCooldown(60);
      } else {
        setErrorMsg(data.message || "Gagal mengirim OTP.");
      }
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan sistem saat mengirim OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTPAsync = async (code: string) => {
    try {
      const res = await fetch("/api/mailer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: code })
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        setErrorMsg("");
        return true;
      } else {
        setErrorMsg(data.message || "Kode OTP salah atau kedaluwarsa.");
        return false;
      }
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan sistem saat verifikasi OTP.");
      return false;
    }
  };

  const handleResendAsync = async () => {
    try {
      const res = await fetch("/api/mailer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "registration" })
      });
      const data = await res.json();
      return data.success;
    } catch (_e) {
      return false;
    }
  };

  const handleEmailCheck = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    if (!email) {
      setEmailErrorState("");
      setEmailSuccessState(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailErrorState("Format email tidak valid.");
      setEmailSuccessState(false);
      return;
    }

    if (emailSuccessState || emailChecking) return;

    setEmailChecking(true);
    setEmailErrorState("");
    setEmailSuccessState(false);

    try {
      const res = await fetch("/api/saas/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.available) {
        setEmailErrorState("Email sudah terdaftar di sistem.");
        setEmailSuccessState(false);
      } else {
        setEmailErrorState("");
        setEmailSuccessState(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEmailChecking(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.school_name || !formData.slug || !formData.email || !formData.phone) {
        setErrorMsg("Harap lengkapi semua data instansi");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        setEmailErrorState("Format email tidak valid.");
        setErrorMsg("Format email tidak valid.");
        return;
      }

      if (slugChecking) {
        setErrorMsg("Mohon tunggu, sedang memverifikasi ketersediaan subdomain...");
        return;
      }

      if (slugErrorState) {
        setErrorMsg(slugErrorState);
        return;
      }

      if (!slugSuccessState) {
        setSlugChecking(true);
        try {
          const res = await fetch("/api/saas/check-slug", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: formData.slug.trim().toLowerCase() })
          });
          const data = await res.json();
          if (data.exists || !data.available) {
            setSlugErrorState(data.message || "Subdomain sudah digunakan sekolah lain.");
            setErrorMsg(data.message || "Subdomain sudah digunakan sekolah lain.");
            setSlugSuccessState(false);
            setSlugChecking(false);
            return;
          } else {
            setSlugErrorState("");
            setSlugSuccessState(true);
          }
        } catch (_err) {
        } finally {
          setSlugChecking(false);
        }
      }

      if (emailChecking) {
        setErrorMsg("Mohon tunggu, sedang memverifikasi ketersediaan email...");
        return;
      }

      if (emailErrorState) {
        setErrorMsg(emailErrorState);
        return;
      }

      if (!emailSuccessState) {
        setEmailChecking(true);
        try {
          const res = await fetch("/api/saas/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email.trim() })
          });
          const data = await res.json();
          if (!data.available) {
            setEmailErrorState("Email sudah terdaftar di sistem.");
            setErrorMsg("Email sudah terdaftar di sistem.");
            setEmailSuccessState(false);
            setEmailChecking(false);
            return;
          } else {
            setEmailErrorState("");
            setEmailSuccessState(true);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setEmailChecking(false);
        }
      }
    }
    if (step === 2) {
      if (!formData.admin_name || !formData.admin_password) {
        setErrorMsg("Harap lengkapi data administrator");
        return;
      }
    }
    setErrorMsg("");
    const nextStep = Math.min(step + 1, 3);
    setStep(nextStep);
    setMaxReachedStep((prev) => Math.max(prev, nextStep));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/saas/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          admin_username: formData.email,
          admin_email: formData.email,
          plan_type: "trial"
        })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== "undefined") {
          try {
            sessionStorage.removeItem("cationgate_daftar_form_draft");
            sessionStorage.removeItem("cationgate_daftar_step");
            sessionStorage.removeItem("cationgate_daftar_max_step");
            sessionStorage.removeItem("cationgate_otp_sent_time");
          } catch (_e) {}
        }
        router.push("/login?registered=true");
      } else {
        setErrorMsg(data.message || "Gagal mendaftar");
      }
      setLoading(false);
    } catch (_err) {
      setErrorMsg("Terjadi kesalahan sistem, silakan coba lagi.");
      setLoading(false);
    }
  };

  const currentVisual =
    stepEditorialVisuals.find((item) => item.step === Math.min(step, 3)) || stepEditorialVisuals[0];

  return {
    formData,
    setFormData,
    step,
    setStep,
    maxReachedStep,
    loading,
    errorMsg,
    emailChecking,
    emailSuccessState,
    emailErrorState,
    slugChecking,
    slugSuccessState,
    slugErrorState,
    setSlugErrorState,
    setSlugSuccessState,
    showPassword,
    setShowPassword,
    animationsData,
    isMobile,
    currentVisual,
    handleEmailCheck,
    setEmailErrorState,
    setEmailSuccessState,
    handleSendOTP,
    handleVerifyOTPAsync,
    handleResendAsync,
    handleNext,
    handleSubmit
  };
}
