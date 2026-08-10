import { NumberTicker } from "../ui/number-ticker";
import { Button } from "../ui/button";
import { Radio, Play  } from 'lucide-react';

export default function HeroSection() {
  return (
    <main>
      <div className="flex min-h-screen items-center justify-center py-20 bg-white">
        <div className="w-full text-center px-4">
          <div className="relative inline-block mb-12 md:mb-16">
            <div className="absolute -left-12 top-4 w-12 md:-left-20 md:w-16 hidden md:block">
              <svg
                viewBox="0 0 100 30"
                fill="none"
                stroke="#FDE047"
                strokeWidth="6"
                strokeLinecap="round"
              >
                <path d="M5,15 Q15,0 25,15 T45,15 T65,15 T85,15" />
              </svg>
            </div>

            <div className="absolute -right-8 -top-4 w-10 md:-right-16 md:w-12 hidden md:block">
              <svg
                viewBox="0 0 50 60"
                fill="none"
                stroke="#111827"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10,10 L40,20 L10,30 L40,40 L10,50 L40,60" />
              </svg>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Buat Aplikasi Sekolah Anda
            </h2>
          </div>

          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col md:flex-row items-stretch w-full ">
              <div
                className="relative w-full md:w-1/2 min-h-87.5 md:min-h-112.5 border border-yellow-500 overflow-hidden 
                                rounded-t-[2.5rem] md:rounded-t-none 
                                md:rounded-tl-[3rem] md:rounded-tr-none md:rounded-bl-none md:rounded-br-[8rem] z-10"
              >
              <img
  src="/assets/landing/imageDahboard.png"
  alt="Team collaboration"
  className="absolute inset-0 h-full w-full object-cover object-left transition-all duration-300 hover:scale-105"
/>
              </div>
              <div
                className="relative flex w-full md:w-1/2 flex-col justify-center bg-[#8EC9F6] 
                                p-10 md:p-14 lg:p-20 text-left 
                                rounded-b-[2.5rem] md:rounded-b-none 
                                md:rounded-tl-none md:rounded-tr-[3rem] md:rounded-bl-[8rem] rounded-br-none md:rounded-br-none z-0"
              >
                <div className="absolute bottom-6 right-6 w-32 opacity-70">
                  <svg
                    viewBox="0 0 100 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" />
                  </svg>
                </div>

              <div className="mb-8 grid grid-cols-2 gap-4 relative z-10">
                  <div>
                   <NumberTicker
      value={50}
      decimalPlaces={0}
      className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
    />
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      Sekolah berlangganan
                    </p>
                  </div>
                  <div>
                       <NumberTicker
      value={10}
      decimalPlaces={0}
      className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
    />
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      Rekan
                    </p>
                  </div>
                </div>

                <p className="mb-10 text-base md:text-lg font-medium leading-relaxed text-gray-800/80 max-w-sm relative z-10">
                  A startup company is a newly formed business with particular
                  momentum behind it based on perceived demand for its product.
                </p>

                <div className="flex flex-wrap items-center gap-6 relative z-10">
                  <Button variant="secondary" className="rounded-full p-6 bg-[#2A1B1D] text-base text-white hover:bg-[#58504E] border-none">
                    <Radio/>
                    Coba Demo Live
                  </Button>
                  <Button className="p-6 gap-3 rounded-full bg-white text-black">
                   <Play fill="#8EC9F6" color="#8EC9F6"/>
                    Lihat Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}