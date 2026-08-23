"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowUp } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    color-mix(in oklch, var(--primary) 15%, transparent) 0%, 
    color-mix(in oklch, var(--secondary) 15%, transparent) 40%, 
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 22vw;
  line-height: 0.72;
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(35, 25, 28, 0.08) 0%, rgba(35, 25, 28, 0.005) 85%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .footer-giant-bg-text {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.01) 85%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;

export type MagneticButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as?: React.ElementType;
    };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  (
    { className, children, as: Component = "button", ...props },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.3,
            y: y * 0.3,
            rotationX: -y * 0.1,
            rotationY: x * 0.1,
            scale: 1.03,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
MagneticButton.displayName = "MagneticButton";

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "3vh", scale: 0.96 },
        {
          y: "0vh",
          scale: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 95%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div ref={wrapperRef} className="relative w-full bg-white">
        <footer className="relative flex w-full flex-col justify-between overflow-hidden text-foreground cinematic-footer-wrapper border-t border-zinc-200 bg-white pt-16 pb-8 px-6 md:px-16">
          {}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 footer-bg-grid opacity-30" />
            <div className="absolute left-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full footer-aurora opacity-30 blur-[120px]" />
          </div>

          {}
          <div
            ref={giantTextRef}
            className="absolute bottom-[-2%] left-1/2 z-0 flex w-full -translate-x-1/2 justify-center pointer-events-none"
          >
            <span className="footer-giant-bg-text">CATIONGATE</span>
          </div>

          {}
          <div
            ref={contentRef}
            className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-10"
          >
            {}
            <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-3xl mx-auto pb-10 border-b border-zinc-200 w-full">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900">
                Siap Modernisasi Sekolah Anda?
              </h2>
              <p className="text-sm md:text-base text-zinc-600 max-w-xl mx-auto">
                Platform penyedia layanan sistem penerimaan murid baru dan
                manajemen siswa terpadu #1 di Indonesia.
              </p>
              <div className="pt-2">
                <Link
                  href="/daftar"
                  className="px-8 py-3.5 rounded-full bg-zinc-900 text-white font-bold text-sm border border-zinc-900 hover:bg-zinc-800 transition-colors shadow-xs inline-flex items-center justify-center gap-2"
                >
                  <span>Mulai Pendaftaran</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </Link>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-4">
              {}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/assets/logo_cationgate/CationGate_Logo.png"
                    alt="CationGate Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-extrabold text-xl tracking-wide text-zinc-900">
                    CationGate
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-600">
                  Solusi manajemen pendidikan modern berbasis cloud.
                  Mengintegrasikan penerimaan siswa (PPDB), administrasi
                  sekolah, asesmen CBT, hingga laporan sinkronisasi Dapodik.
                </p>
              </div>

              {}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Solusi & Fitur
                </h3>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li>
                    <a
                      href="#hero"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Sistem Penerimaan Murid Baru (PPDB)
                    </a>
                  </li>
                  <li>
                    <a
                      href="#capabilities"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Manajemen Siswa & Akademik
                    </a>
                  </li>
                  <li>
                    <a
                      href="#capabilities"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Ujian & Asesmen CBT Pintar
                    </a>
                  </li>
                  <li>
                    <a
                      href="#capabilities"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Dashboard Analitik Real-time
                    </a>
                  </li>
                  <li>
                    <a
                      href="#capabilities"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Integrasi Data Dapodik
                    </a>
                  </li>
                </ul>
              </div>

              {}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Navigasi
                </h3>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li>
                    <a
                      href="#hero"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Beranda
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Fitur Unggulan
                    </a>
                  </li>
                  <li>
                    <a
                      href="#kemitraan"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Mitra Industri
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Paket Biaya
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Pertanyaan Umum (FAQ)
                    </a>
                  </li>
                </ul>
              </div>

              {}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Dukungan & Legal
                </h3>
                <ul className="space-y-2 text-xs text-zinc-600">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Pusat Bantuan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Dokumentasi API
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Kebijakan Privasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Syarat & Ketentuan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Status Sistem (Online)
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {}
            <div className="pt-6 border-t border-zinc-200 flex items-center justify-between gap-4">
              <div className="text-xs text-zinc-500 font-medium">
                © 2026 CationGate. All rights reserved.
              </div>

              <MagneticButton
                as="button"
                onClick={scrollToTop}
                aria-label="Kembali ke atas"
                className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 flex items-center justify-center group transition-colors"
              >
                <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" />
              </MagneticButton>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
