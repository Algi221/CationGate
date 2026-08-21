"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Target, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Data 4 Anggota Utama dengan Path Aset Lokal di public/assets/team/
  const defaultTeam = [
    {
      id: 1,
      name: "Algifahri Tri Ramadhan",
      role: "Fullstack Developer",
      photo_url: "/assets/team/algifahri.jpg",
    },
    {
      id: 2,
      name: "Zefanya Law Prasetyo",
      role: "Frontend Developer",
      photo_url: "/assets/team/pak-joy.jpg",
    },
    {
      id: 3,
      name: "Farel Al Fatir Fauzan",
      role: "Frontend Developer",
      photo_url: "/assets/team/bu-miranda.jpg",
    },
    {
      id: 4,
      name: "Husein",
      role: "Testing",
      photo_url: "/assets/team/husein.jpg",
    },
  ];

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        if (!supabase) {
          setMembers(defaultTeam);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("team_members")
          .select("id, name, role, photo_url");

        if (error || !data || data.length === 0) {
          setMembers(defaultTeam);
        } else {
          setMembers(data);
        }
      } catch (_error) {
        setMembers(defaultTeam);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  // Animasi GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-content > *", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });

      gsap.to(".floating-img-1", {
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      gsap.to(".floating-img-2", {
        y: 150,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      [section1Ref, section2Ref, section3Ref].forEach((ref) => {
        if (!ref.current) return;
        const elements = ref.current.querySelectorAll(".animate-up");
        if (elements && elements.length > 0) {
          gsap.from(elements, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#FAF8F2] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white overflow-x-hidden flex flex-col justify-between"
    >
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating-img-1"></div>
          <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl floating-img-2"></div>

          <div className="max-w-4xl hero-content relative z-10 space-y-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-zinc-900 leading-none">
              Membangun Masa Depan <br />{" "}
              <span className="text-yellow-400">Digital Pendidikan</span>
            </h1>
            <p className="text-lg md:text-2xl text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto">
              CationGate adalah platform SaaS terpadu yang membantu ratusan
              sekolah di Indonesia menyederhanakan PPDB, ujian CBT, dan
              manajemen akademik.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section
          ref={section1Ref}
          id="story"
          className="py-24 px-6 max-w-7xl mx-auto overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 relative animate-up w-full">
              {/* Kotak Vokasi dengan Logo Diperbesar */}
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02] flex items-center justify-center bg-white border border-zinc-200 p-12">
                <div className="text-center space-y-4 flex flex-col items-center">
                  {/* Ukuran wrapper logo diperbesar dari w-24 h-24 jadi w-36 h-36 */}
                  <div className="w-36 h-36 relative mb-2 flex items-center justify-center">
                    <Image
                      src="/assets/logo_cationgate/CationGate_Logo.png"
                      alt="CationGate Logo"
                      fill
                      sizes="144px"
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900">
                    CationGate
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    Dari SMK untuk kemajuan sistem pendidikan nasional.
                  </p>
                </div>
              </div>

              {/* Decorative Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-zinc-900 text-white p-6 rounded-3xl shadow-xl max-w-[260px] hidden md:block border border-zinc-800">
                <p className="font-bold text-sm leading-snug">
                  Dimulai dari kebutuhan nyata sekolah, berkembang jadi solusi
                  nasional.
                </p>
              </div>
            </div>

            <div className="flex-1 animate-up space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 leading-tight">
                Awal Mula <br />{" "}
                <span className="text-yellow-400">Cerita Kami</span>
              </h2>
              <div className="space-y-4 text-zinc-600 font-medium text-lg leading-relaxed">
                <p>
                  Berawal dari kebutuhan SMK Taruna Bhakti Depok untuk
                  mengotomatisasi antrean berkas calon murid baru yang membludak
                  setiap tahun ajaran baru.
                </p>
                <p>
                  Kami merancang sistem yang transparan, cepat, dan terintegrasi
                  penuh. Dari sana, CationGate berkembang menjadi ekosistem
                  manajemen pendidikan terpadu yang andal.
                </p>
                <p>
                  Kini, platform kami dipercaya untuk mengawal proses penerimaan
                  siswa dan ujian berbasis digital di berbagai daerah dengan
                  performa server yang stabil dan anti <i>down</i>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visi & Misi Section */}
        <section
          ref={section2Ref}
          id="mission"
          className="py-32 bg-zinc-900 text-white px-6 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
            <div className="text-center mb-20 max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight text-white leading-none">
                Visi & Misi Kami
              </h2>
              <div className="w-24 h-2 bg-blue-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-zinc-400 text-lg font-medium">
                Komitmen penuh menghadirkan standar infrastruktur digital
                terbaik untuk sekolah di seluruh Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-5xl">
              <div className="group relative bg-zinc-800/80 hover:bg-zinc-800 p-10 md:p-12 rounded-[3rem] border border-zinc-700/60 hover:border-blue-500/50 transition-all duration-500 shadow-xl flex flex-col items-start">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                  <Target size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4 text-white">
                  Visi Utama
                </h3>
                <p className="text-zinc-300 font-medium text-lg leading-relaxed">
                  Menjadi standar infrastruktur digital utama bagi setiap
                  lembaga pendidikan di Indonesia, mewujudkan tata kelola
                  sekolah yang transparan dan modern berbasis cloud.
                </p>
              </div>

              <div className="group relative bg-zinc-800/80 hover:bg-zinc-800 p-10 md:p-12 rounded-[3rem] border border-zinc-700/60 hover:border-amber-500/50 transition-all duration-500 shadow-xl flex flex-col items-start">
                <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4 text-white">
                  Misi Kami
                </h3>
                <p className="text-zinc-300 font-medium text-lg leading-relaxed">
                  Menghadirkan perangkat lunak berstandar enterprise yang aman,
                  ramah pengguna, serta terintegrasi langsung dengan ekosistem
                  Dapodik dan sistem kementerian.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section (4 Orang Utama) */}
        <section
          className="pt-28 pb-16 px-6 max-w-7xl mx-auto overflow-hidden"
          id="team"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 w-full">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                Kolaborasi Ahli
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-900">
                Tim & Pendidik Kunci
              </h2>
            </div>
            <p className="max-w-md text-zinc-500 font-medium text-base leading-relaxed">
              Orang-orang di balik inovasi tiada henti CationGate, memadukan
              keahlian teknis tingkat tinggi dan pengalaman dunia pendidikan.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-zinc-400 font-bold animate-pulse">
              Memuat data tim...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
              {members.map((member, index) => (
                <div
                  key={member.id || index}
                  className="group bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center border border-zinc-200 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-zinc-200 mb-5 group-hover:border-blue-600 transition-colors bg-zinc-100">
                    <Image
                      src={
                        member.photo_url ||
                        `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(member.name)}`
                      }
                      alt={member.name}
                      fill sizes="(max-width: 768px) 100vw, 360px"className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-1 text-zinc-900 text-center group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <span className="inline-block bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs text-center mt-2 uppercase tracking-wide">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section ref={section3Ref} className="py-24 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto bg-zinc-900 text-white rounded-[3.5rem] p-10 md:p-20 text-center relative group animate-up overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <h2 className="text-3xl md:text-6xl font-black uppercase mb-6 leading-tight relative z-10">
              Siap Beralih ke Sistem <br />{" "}
              <span className="text-yellow-400">Digital Modern?</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg font-medium mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Bergabunglah dengan puluhan institusi pendidikan yang telah
              mempercayakan pengelolaan administrasi dan pendaftaran siswanya
              pada CationGate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href="/daftar"
                className="bg-white text-zinc-900 px-8 py-4 rounded-full font-bold text-base hover:bg-zinc-100 transition-colors flex items-center gap-2 shadow-lg"
              >
                Mulai Pendaftaran <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <CinematicFooter />
    </div>
  );
}
