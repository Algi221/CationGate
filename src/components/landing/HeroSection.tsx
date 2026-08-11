import { NumberTicker } from "../ui/number-ticker";
import { Button } from "../ui/button";
import { Radio, Play } from "lucide-react";

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

            {/* Ornamen Kanan */}
            <div className="absolute -right-8 -top-4 w-10 md:-right-16 md:w-12 hidden md:block">
              <svg viewBox="0 0 50 60" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10,10 L40,20 L10,30 L40,40 L10,50 L40,60" />
              </svg>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Buat Aplikasi Sekolah Anda
            </h2>
          </div>
        </div>

        <div className="w-full max-w-7xl px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row items-stretch w-full drop-shadow-xl">
            
            <div
              className="relative w-full md:w-1/2 min-h-[20rem] md:min-h-[30rem] overflow-hidden 
                         rounded-t-[2.5rem] md:rounded-t-none 
                         md:rounded-tl-[3rem] md:rounded-bl-none md:rounded-br-[8rem] z-10"
            >
              <img
                src="/assets/landing/imageDahboard.png"
                alt="Tampilan Dashboard"
                className="absolute inset-0 h-full w-full object-cover object-left transition-all duration-300 hover:scale-105"
              />
            </div>
            
            {/* Bagian Kanan (Konten Biru) */}
            <div
              className="relative flex w-full md:w-1/2 flex-col justify-center bg-[#8EC9F6] 
                         p-10 md:p-14 lg:p-20 text-left 
                         rounded-b-[2.5rem] md:rounded-b-none 
                         md:rounded-tl-none md:rounded-tr-[3rem] md:rounded-bl-[8rem] md:rounded-br-[3rem] z-0 overflow-hidden"
            >
              {/* Ornamen Garis Background */}
              <div className="absolute bottom-6 right-6 w-32 opacity-70">
                <svg viewBox="0 0 100 20" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" />
                </svg>
              </div>

              {/* Angka Statistik */}
              <div className="mb-10 grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    <NumberTicker
                      value={50}
                      decimalPlaces={0}
                      className="text-5xl md:text-6xl font-black tracking-tighter text-[#2A1B1D]"
                    />
                    <span className="text-4xl md:text-5xl font-black text-[#2A1B1D]">+</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-[#2A1B1D]/80">
                    Sekolah Berlangganan
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    <NumberTicker
                      value={10}
                      decimalPlaces={0}
                      className="text-5xl md:text-6xl font-black tracking-tighter text-[#2A1B1D]"
                    />
                    <span className="text-4xl md:text-5xl font-black text-[#2A1B1D]">+</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-[#2A1B1D]/80">
                    Mitra Aktif
                  </p>
                </div>
              </div>

              <p className="mb-10 text-base md:text-lg font-medium leading-relaxed text-[#2A1B1D]/90 max-w-md relative z-10">
                Digitalisasi manajemen sekolah kini lebih mudah. Pantau nilai, kehadiran, dan kolaborasi guru-siswa dalam satu dashboard interaktif dan aman.
              </p>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-4 relative z-10">
                <Button variant="secondary" className="rounded-full px-6 py-6 bg-[#2A1B1D] text-sm md:text-base font-bold text-white hover:bg-[#58504E] border-none shadow-md">
                  <Radio className="mr-2 w-5 h-5" />
                  Coba Demo Live
                </Button>
                <Button
                  type="button"
                  onClick={onOpenVideo}
                  className="rounded-full px-6 py-6 bg-white/90 hover:bg-white text-[#2A1B1D] text-sm md:text-base font-bold shadow-md"
                >
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