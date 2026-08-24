"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { ArrowRight } from "lucide-react";
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

const defaultTeam = [
  {
    id: 1,
    name: "Algifahri Tri Ramadhan",
    role: "Fullstack Developer",
    clipPathId: "clip-squiggle",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    photo_url: "/assets/team/Algi.jpg",
  },
  {
    id: 2,
    name: "Zefanya Law Prasetyo",
    role: "Frontend Developer",
    clipPathId: "differentone16",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    photo_url: "/assets/team/jepan.jpg",
  },
  {
    id: 3,
    name: "Farel Al Fatir Fauzan",
    role: "Frontend Developer",
    clipPathId: "differentone8",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    photo_url: "/assets/team/farell.jpg",
  },
  {
    id: 4,
    name: "Muhamad Husein Alfah Reza",
    role: "QA & Backend Developer",
    clipPathId: "clip-rect",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    photo_url: "/assets/team/husein.jpg",
  },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div className="absolute bottom-10 -right-20 w-125 h-125 bg-amber-500/10 rounded-full blur-3xl floating-img-2"></div>

          <div className="max-w-4xl hero-content relative z-10 space-y-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-zinc-900 leading-none">
              Membangun Masa Depan <br />{" "}
              <span className="text-yellow-400">Digital Pendidikan</span>
            </h1>
            <p className="text-lg md:text-2xl text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto">
              CationGate adalah platform SaaS terpadu yang membantu ratusan
              sekolah di Indonesia menyederhanakan SPMB/PPDB, dan
              manajemen siswa.
            </p>
          </div>
        </section>

        {/* Story Section - id diubah menjadi #kisah */}
        <section
          ref={section1Ref}
          id="kisah"
          className="py-24 px-6 max-w-7xl mx-auto overflow-hidden scroll-mt-24"
        >
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 relative animate-up w-full">
              {/* Logo Card */}
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02] flex items-center justify-center bg-white border border-zinc-200 p-8">
                <div className="text-center space-y-6 flex flex-col items-center w-full h-full justify-center">
                  <div className="w-52 h-52 sm:w-64 sm:h-64 relative mb-2 flex items-center justify-center">
                    <Image
                      src="/assets/logo_cationgate/CationGate_Logo.png"
                      alt="CationGate Logo"
                      fill
                      sizes="(max-width: 768px) 208px, 256px"
                      className="object-contain"
                      priority
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

              {/* Floating Quote */}
              <div className="absolute -bottom-6 -right-6 bg-zinc-900 text-white p-6 rounded-3xl shadow-xl max-w-65 hidden md:block border border-zinc-800">
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

        {/* Mission Section - id diubah menjadi #visi-misi */}
        <section
          ref={section2Ref}
          id="visi-misi"
          className="py-32 bg-zinc-900 text-white px-6 relative overflow-hidden scroll-mt-20"
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
              {/* Card Visi */}
              <div className="group relative bg-zinc-800/80 hover:bg-zinc-800 p-8 sm:p-10 md:p-12 rounded-[2.5rem] border border-zinc-700/60 hover:border-blue-500/50 transition-all duration-500 shadow-xl flex flex-col justify-between items-start">
                <div className="w-full">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-wider mb-4">
                    Tujuan Jangka Panjang
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black mb-4 text-white tracking-tight">
                    Visi Utama
                  </h3>
                  <p className="text-zinc-300 font-medium text-base sm:text-lg leading-relaxed">
                    Menjadi standar infrastruktur digital utama bagi setiap
                    lembaga pendidikan di Indonesia, mewujudkan tata kelola
                    sekolah yang transparan dan modern berbasis cloud.
                  </p>
                </div>

                {/* Gambar Ilustrasi Visi di Bawah Teks */}
                <div className="w-full h-64 sm:h-72 lg:h-80 mt-8 relative flex items-center justify-center p-4 rounded-3xl bg-zinc-900/50 border border-zinc-700/50 group-hover:border-blue-500/40 group-hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-inner">
                  <Image
                    src="/assets/lottie_ilustration/visi.svg"
                    alt="Ilustrasi Visi CationGate"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain p-4 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Card Misi */}
              <div className="group relative bg-zinc-800/80 hover:bg-zinc-800 p-8 sm:p-10 md:p-12 rounded-[2.5rem] border border-zinc-700/60 hover:border-amber-500/50 transition-all duration-500 shadow-xl flex flex-col justify-between items-start">
                <div className="w-full">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider mb-4">
                    Langkah Nyata
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black mb-4 text-white tracking-tight">
                    Misi Kami
                  </h3>
                  <p className="text-zinc-300 font-medium text-base sm:text-lg leading-relaxed">
                    Menghadirkan perangkat lunak berstandar enterprise yang aman,
                    ramah pengguna, serta terintegrasi langsung dengan ekosistem
                    Dapodik dan sistem kementerian.
                  </p>
                </div>

                {/* Gambar Ilustrasi Misi di Bawah Teks */}
                <div className="w-full h-64 sm:h-72 lg:h-80 mt-8 relative flex items-center justify-center p-4 rounded-3xl bg-zinc-900/50 border border-zinc-700/50 group-hover:border-amber-500/40 group-hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-inner">
                  <Image
                    src="/assets/lottie_ilustration/misi.svg"
                    alt="Ilustrasi Misi CationGate"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain p-4 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SVG Clip Path Definitions for Artistic Team Frames */}
        <svg className="absolute top-[-9999px] left-[-9999px] w-0 h-0 pointer-events-none" aria-hidden="true">
          <defs>
            <clipPath id="clip-squiggle" clipPathUnits="objectBoundingBox">
              <path
                d="M0.434125 0.00538712C0.56323 -0.00218488 0.714575 -0.000607013 0.814404 0.00302954L0.802642 0.163537C0.813884 0.167475 0.824927 0.172002 0.835358 0.177236C0.869331 0.194281 0.909224 0.225945 0.90824 0.27348C0.907177 0.324883 0.858912 0.354946 0.822651 0.36933C0.857426 0.376783 0.894591 0.387558 0.925837 0.404287C0.968002 0.426862 1.00569 0.464702 0.999287 0.515878C0.993163 0.564818 0.950731 0.597642 0.904098 0.615682C0.88204 0.624216 0.858239 0.62992 0.834803 0.633808C0.858076 0.639299 0.881603 0.646639 0.90267 0.656757C0.946271 0.677698 0.986875 0.715485 0.978905 0.768037C0.972241 0.811979 0.93615 0.843109 0.895204 0.862035C0.858032 0.879217 0.815169 0.887544 0.778534 0.892219C0.704792 0.901628 0.614366 0.901003 0.535183 0.899176C0.508115 0.898551 0.482286 0.89779 0.45773 0.897065C0.404798 0.895504 0.357781 0.894117 0.317008 0.894657C0.301552 0.894862 0.289265 0.895348 0.279749 0.895976C0.251913 0.937168 0.226467 0.980907 0.216015 1L0 0.941216C0.0140558 0.915539 0.051354 0.851547 0.0902557 0.797766C0.118421 0.758828 0.1722 0.745373 0.200402 0.740217C0.168437 0.733484 0.134299 0.723597 0.105102 0.708076C0.0614715 0.684884 0.0263696 0.64687 0.0325498 0.596965C0.0385804 0.548267 0.0803829 0.515256 0.12709 0.496909C0.146901 0.489127 0.168128 0.483643 0.189242 0.479724C0.163739 0.476035 0.137977 0.471053 0.115188 0.463936C0.0874831 0.455285 0.00855855 0.424854 0.016569 0.357817C0.0231721 0.302559 0.0838593 0.276249 0.116031 0.266164C0.149646 0.255625 0.188201 0.2505 0.221821 0.247468C0.208809 0.243824 0.195905 0.239492 0.183801 0.234287C0.152543 0.220846 0.101565 0.189547 0.105449 0.136312C0.108467 0.0949629 0.144168 0.0682612 0.171101 0.0543099C0.197578 0.0405945 0.227933 0.032236 0.25348 0.0267029C0.305656 0.0154021 0.370636 0.00911076 0.434125 0.00538712Z"
                fill="black"
              />
            </clipPath>
            <clipPath id="differentone16" clipPathUnits="objectBoundingBox">
              <path
                d="M0.911218 0.329658C0.917139 0.29671 0.914994 0.262818 0.904967 0.23088C0.894939 0.198941 0.877327 0.169906 0.853635 0.146256C0.829944 0.122605 0.800878 0.105043 0.768923 0.0950708C0.736967 0.0850983 0.703072 0.083012 0.670134 0.0889901C0.651042 0.0615242 0.625587 0.0390856 0.595943 0.0235895C0.566299 0.00809344 0.533346 0 0.499896 0C0.466446 0 0.433493 0.00809344 0.403849 0.0235895C0.374204 0.0390856 0.34875 0.0615242 0.329658 0.0889901C0.29675 0.0830893 0.262904 0.0852337 0.231005 0.0952406C0.199106 0.105248 0.1701 0.12282 0.14646 0.14646C0.12282 0.1701 0.105248 0.199106 0.0952406 0.231005C0.0852337 0.262904 0.0830893 0.29675 0.0889901 0.329658C0.0615242 0.34875 0.0390856 0.374204 0.0235895 0.403849C0.00809344 0.433493 0 0.466446 0 0.499896C0 0.533346 0.00809344 0.566299 0.0235895 0.595943C0.0390856 0.625587 0.0615242 0.651042 0.0889901 0.670134C0.0830405 0.703077 0.0851562 0.73697 0.0951563 0.768917C0.105156 0.800864 0.122744 0.829915 0.146414 0.853586C0.170085 0.877256 0.199136 0.894844 0.231083 0.904844C0.26303 0.914844 0.296923 0.916959 0.329866 0.91101C0.348958 0.938476 0.374413 0.960914 0.404057 0.97641C0.433701 0.991907 0.466654 1 0.500104 1C0.533554 1 0.566507 0.991907 0.596151 0.97641C0.625796 0.960914 0.65125 0.938476 0.670343 0.91101C0.70327 0.916921 0.737139 0.914776 0.769057 0.904759C0.800976 0.894741 0.829997 0.877149 0.853642 0.853483C0.877287 0.829818 0.894854 0.800782 0.904844 0.768854C0.914834 0.736927 0.916949 0.703056 0.91101 0.670134C0.938476 0.651042 0.960914 0.625587 0.97641 0.595943C0.991907 0.566299 1 0.533346 1 0.499896C1 0.466446 0.991907 0.433493 0.97641 0.403849C0.960914 0.374204 0.938476 0.34875 0.91101 0.329658H0.911218Z"
                fill="black"
              />
            </clipPath>
            <clipPath id="differentone8" clipPathUnits="objectBoundingBox">
              <path
                d="M0.830625 0.5C0.883908 0.453139 0.926579 0.395449 0.955787 0.330781C0.984995 0.266114 1.00007 0.195958 1 0.125C1 0.0918481 0.98683 0.0600539 0.963388 0.0366119C0.939946 0.0131698 0.908152 2.32816e-07 0.875 2.32816e-07C0.725625 2.32816e-07 0.591667 0.0654169 0.5 0.169375C0.453139 0.116092 0.395449 0.0734212 0.330781 0.0442131C0.266114 0.0150049 0.195958 -6.83243e-05 0.125 2.32816e-07C0.0918481 2.32816e-07 0.0600539 0.0131698 0.0366119 0.0366119C0.0131698 0.0600539 2.32816e-07 0.0918481 2.32816e-07 0.125C2.32816e-07 0.274375 0.0654169 0.408333 0.169375 0.5C0.116092 0.546861 0.0734212 0.604551 0.0442131 0.669219C0.0150049 0.733887 -6.83243e-05 0.804042 2.32816e-07 0.875C2.32816e-07 0.908152 0.0131698 0.939946 0.0366119 0.963388C0.0600539 0.98683 0.0918481 1 0.125 1C0.274375 1 0.408333 0.934583 0.5 0.830625C0.546861 0.883908 0.604551 0.926579 0.669219 0.955787C0.733887 0.984995 0.804042 1.00007 0.875 1C0.908152 1 0.939946 0.98683 0.963388 0.963388C0.98683 0.939946 1 0.908152 1 0.875C1 0.725625 0.934583 0.591667 0.830625 0.5Z"
                fill="black"
              />
            </clipPath>
            <clipPath id="clip-rect" clipPathUnits="objectBoundingBox">
              <path
                d="M0.5 0L0.550709 0.0460541C0.541963 0.0640581 0.528578 0.0791151 0.513027 0.0917341C0.520456 0.0907291 0.527892 0.0897201 0.535322 0.0887131C0.611493 0.0783851 0.687008 0.0681471 0.74727 0.0620541C0.784018 0.0583381 0.81958 0.0556691 0.848085 0.0560471C0.861663 0.0562271 0.879579 0.0571111 0.897003 0.0610981C0.909779 0.0640211 0.953305 0.0757431 0.966627 0.113912C0.981722 0.157163 0.941632 0.185488 0.934622 0.19038C0.921226 0.199729 0.905329 0.206897 0.892499 0.212115C0.870649 0.221001 0.842659 0.230142 0.811999 0.239254C0.83681 0.236656 0.861008 0.235257 0.882435 0.23621C0.898377 0.236918 0.921559 0.239201 0.943733 0.24826C0.970081 0.259024 0.995291 0.280051 0.999439 0.311122C1.00342 0.340933 0.985349 0.363373 0.972847 0.375304C0.959707 0.387843 0.943414 0.397844 0.928912 0.405582C0.908422 0.416516 0.883341 0.427176 0.856112 0.437447C0.864364 0.436866 0.872329 0.436539 0.879902 0.436521C0.894726 0.436485 0.918867 0.437439 0.942277 0.446087C0.955191 0.450858 0.970509 0.458949 0.982453 0.472319C0.994857 0.486205 0.999891 0.501633 0.999891 0.515923C0.999891 0.545114 0.979611 0.565612 0.967435 0.575746C0.953994 0.586934 0.937862 0.595927 0.923325 0.603007C0.898842 0.614932 0.868113 0.626538 0.834975 0.637664C0.839838 0.637396 0.844565 0.637223 0.849131 0.637157C0.862911 0.636959 0.885294 0.637431 0.907315 0.644301C0.91929 0.648037 0.935423 0.654982 0.948734 0.667909C0.96307 0.681831 0.969583 0.69831 0.969583 0.714241C0.969583 0.756168 0.930027 0.781711 0.913544 0.791403C0.891777 0.804203 0.864569 0.815187 0.838085 0.824629C0.790903 0.84145 0.729751 0.858922 0.669115 0.876246C0.66103 0.878556 0.652955 0.880864 0.644923 0.883166C0.574356 0.903398 0.504814 0.923898 0.447288 0.945539C0.385857 0.968649 0.354123 0.98743 0.343618 0.999097L0.202975 0.923461C0.215492 0.909559 0.231313 0.896865 0.249116 0.885256C0.245423 0.885811 0.241771 0.886347 0.238165 0.886862C0.198801 0.892483 0.158749 0.89657 0.125136 0.895416C0.10872 0.894852 0.0869431 0.892883 0.0658381 0.885656C0.0427861 0.877762 0.014566 0.861068 0.00449603 0.831173C-0.00578897 0.800641 0.00946505 0.775473 0.0227 0.761104C0.035552 0.747151 0.0521941 0.73661 0.0660451 0.729015C0.0763781 0.723348 0.0879781 0.717821 0.10046 0.712441C0.0918191 0.7114 0.0828791 0.709795 0.0740171 0.70737C0.0519021 0.701317 0.021352 0.687312 0.00720103 0.65819C-0.00776397 0.627392 0.00549305 0.600161 0.018904 0.584108C0.03142 0.569125 0.048329 0.557944 0.061925 0.550133C0.0899171 0.534051 0.127869 0.51891 0.167323 0.504992C0.189196 0.497276 0.213195 0.489371 0.238664 0.48135C0.201179 0.486283 0.163943 0.489581 0.131973 0.488597C0.114641 0.488064 0.0935231 0.486164 0.0730311 0.480032C0.0519071 0.47371 0.024429 0.460566 0.00936805 0.434874C-0.00727695 0.406482 0.000740049 0.379077 0.014172 0.360311C0.026036 0.343734 0.043174 0.331657 0.0566 0.32353C0.084167 0.306842 0.121704 0.291789 0.159992 0.278421C0.179936 0.271457 0.2017 0.264408 0.224764 0.257328C0.191619 0.258997 0.158935 0.259269 0.131101 0.256364C0.115367 0.254721 0.0954681 0.251528 0.0765251 0.244134C0.0569951 0.236512 0.030269 0.220901 0.019911 0.192566C0.00630305 0.155339 0.028173 0.125216 0.050968 0.10819C0.070358 0.0937081 0.094464 0.0847721 0.112073 0.0791001C0.142823 0.0691931 0.183388 0.0604071 0.219871 0.0525041C0.226304 0.0511111 0.232611 0.0497451 0.238714 0.0484051C0.283575 0.0385571 0.323527 0.0289901 0.35429 0.0175781L0.5 0Z"
                fill="black"
              />
            </clipPath>
          </defs>
        </svg>

        {/* Team Section */}
        <section
          className="pt-28 pb-24 px-6 max-w-7xl mx-auto overflow-hidden scroll-mt-24"
          id="tim"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 w-full">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
                Kolaborasi Ahli
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-900">
                Tim & Pendidik Kunci
              </h2>
            </div>
            <p className="max-w-md text-zinc-500 font-medium text-sm md:text-base leading-relaxed">
              Orang-orang di balik inovasi tiada henti CationGate, memadukan
              keahlian teknis tingkat tinggi dan dedikasi penuh untuk kemajuan dunia pendidikan.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-zinc-400 font-bold animate-pulse">
              Memuat data tim...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-10 w-full">
              {members.map((member, index) => {
                const clipIds = ["clip-squiggle", "differentone16", "differentone8", "clip-rect"];
                const clipId = member.clipPathId || clipIds[index % 4];
                const badgeClass =
                  member.badgeClass ||
                  (member.role?.toLowerCase().includes("frontend")
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : member.role?.toLowerCase().includes("fullstack")
                    ? "bg-blue-50 text-blue-700 border-blue-200/70"
                    : "bg-slate-100 text-slate-700 border-slate-200");

                return (
                  <div
                    key={member.id || index}
                    className="group flex flex-col items-center hover:-translate-y-2 transition-transform duration-500"
                  >
                    {/* Organic Clip-Path Framed Photo Container (Tanpa Card Box) */}
                    <div className="w-full max-w-65 aspect-4/5 sm:aspect-3/4 mb-6 relative flex items-center justify-center">
                      <div
                        className="w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 shadow-lg transition-transform duration-500 group-hover:scale-105"
                        style={{ clipPath: `url(#${clipId})` }}
                      >
                        {member.photo_url ? (
                          <Image
                            src={member.photo_url}
                            alt={member.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 260px"
                            className="object-cover w-full h-full group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 text-blue-600 font-black text-3xl select-none">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="w-full text-center flex flex-col items-center gap-2.5">
                      <h3 className="font-black text-lg sm:text-xl text-zinc-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                        {member.name}
                      </h3>

                      <span
                        className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-2xs ${badgeClass}`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section ref={section3Ref} className="py-24 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto bg-zinc-900 text-white rounded-[3.5rem] p-10 md:p-20 text-center relative group animate-up overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

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
