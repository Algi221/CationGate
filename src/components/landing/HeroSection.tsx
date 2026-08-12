import { NumberTicker } from "../ui/number-ticker";
import { Button } from "../ui/button";
import { Radio, Play, ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  onOpenVideo?: () => void;
}

export default function HeroSection({ onOpenVideo }: HeroSectionProps) {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-white">
        <div className="w-full text-center px-4 mb-12 md:mb-16 mt-10">
          <div className="relative inline-block text-center">
            <div className="absolute -left-12 top-4 w-20 md:-left-20 md:w-16 hidden md:block">
              <svg viewBox="0 0 100 30" fill="none" stroke="#FDE047" strokeWidth="6" strokeLinecap="round">
                <path d="M5,15 Q15,0 25,15 T45,15 T65,15 T85,15" />
              </svg>
            </div>

            <div className="absolute -right-8 -top-4 w-10 md:-right-16 md:w-12 hidden md:block">
              <svg viewBox="0 0 50 60" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10,10 L40,20 L10,30 L40,40 L10,50 L40,60" />
              </svg>
            </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#23191C] whitespace-nowrap">
            The intelligent platform for{" "}
            <span className="relative inline-block">
              <span className="relative z-10">modern schools</span>
              <span className="absolute bottom-[4px] left-0 z-0 h-[30%] w-full rounded-[3px] bg-[#FFD33B]" />
            </span>
          </h1>
          </div>

          {/* Description - Single Line */}
          <p className="mt-6 max-w-4xl text-base sm:text-lg font-medium leading-relaxed text-[#58504E]">
            One platform to manage learning, monitor progress, and empower teachers with intelligent tools.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/daftar" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group h-12 w-full rounded-lg border-0 bg-[#23191C] px-8 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3D3235] hover:shadow-xl active:scale-95 sm:w-auto"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
            </Link>

            <button
              type="button"
              onClick={onOpenVideo}
              className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-[#E7E1D6] bg-white px-7 text-sm font-semibold text-[#23191C] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D9D3C7] hover:bg-[#F7F4ED] hover:shadow-md sm:w-auto"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#23191C] text-white transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
              </span>
              Watch Demo
            </button>
          </div>
        </div>

        <div className="w-full max-w-7xl px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-stretch w-full drop-shadow-xl">
            <div className="relative w-full md:w-1/2 min-h-[20rem] md:min-h-[30rem] overflow-hidden rounded-t-[2.5rem] md:rounded-t-none md:rounded-tl-[3rem] md:rounded-bl-none md:rounded-br-[8rem] z-10">
              <img
                src="/assets/landing/imageDahboard.png"
                alt="Tampilan Dashboard"
                className="absolute inset-0 h-full w-full object-cover object-left transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="relative flex w-full md:w-1/2 flex-col justify-center bg-[#8EC9F6] p-10 md:p-14 lg:p-20 text-left rounded-b-[2.5rem] md:rounded-b-none md:rounded-tl-none md:rounded-tr-[3rem] md:rounded-bl-[8rem] md:rounded-br-[3rem] z-0 overflow-hidden">
              <div className="absolute bottom-6 right-6 w-32 opacity-70">
                <svg viewBox="0 0 100 20" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" />
                </svg>
              </div>

              <div className="mb-10 grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    <NumberTicker value={50} decimalPlaces={0} className="text-5xl md:text-6xl font-black tracking-tighter text-[#2A1B1D]" />
                    <span className="text-[42px] md:text-[68px] font-black text-[#2A1B1D]">+</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-[#2A1B1D]/80">Sekolah Berlangganan</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    <NumberTicker value={10} decimalPlaces={0} className="text-5xl md:text-6xl font-black tracking-tighter text-[#2A1B1D]" />
                    <span className="text-[42px] md:text-[68px] font-black text-[#2A1B1D]">+</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-[#2A1B1D]/80">Mitra Aktif</p>
                </div>
              </div>

              <p className="mb-10 text-base md:text-lg font-medium leading-relaxed text-[#2A1B1D]/90 max-w-md relative z-10">
                Digitalisasi manajemen sekolah kini lebih mudah. Pantau nilai, kehadiran, dan kolaborasi guru-siswa dalam satu dashboard interaktif dan aman.
              </p>

              <div className="flex flex-wrap items-center gap-4 relative z-10">
                <Button variant="secondary" className="rounded-full px-6 py-6 bg-[#2A1B1D] text-sm md:text-base font-bold text-white hover:bg-[#58504E] border-none shadow-md">
                  <Radio className="mr-2 w-5 h-5" />
                  Coba Demo Live
                </Button>
                <Button type="button" onClick={onOpenVideo} className="rounded-full px-6 py-6 bg-white/90 hover:bg-white text-[#2A1B1D] text-sm md:text-base font-bold shadow-md">
                  <Play fill="#8EC9F6" className="text-[#8EC9F6] mr-2 w-5 h-5" />
                  Lihat Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export { HeroSection };
