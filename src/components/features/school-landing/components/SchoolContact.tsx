"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MapPin, HelpCircle, Phone } from "lucide-react";

const ScrollFloat = dynamic(() => import("@/components/ScrollFloat"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: (props: any) => <div className={props.containerClassName}>{props.children}</div>
});

interface SchoolContactProps {
  mapTitle: string;
  mapUrl: string;
  address: string;
  waAdmin: string;
  schoolDisplayName: string;
}

export const SchoolContact: React.FC<SchoolContactProps> = ({
  mapTitle,
  mapUrl,
  address,
  waAdmin,
  schoolDisplayName
}) => {
  const sanitizeUrl = (url: string | undefined | null): string | undefined => {
    if (!url) return undefined;
    if (/^(?:https?:\/\/|\/)/i.test(url)) {
      if (url.toLowerCase().includes("javascript:")) return undefined;
      return url;
    }
    return undefined;
  };

  return (
    <>
      {/* MAP SECTION */}
      {mapUrl && (
        <section className="w-full bg-slate-50 dark:bg-slate-950/50 py-24 relative z-10 transition-colors duration-300 text-left">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <ScrollFloat
                containerClassName="inline-block mb-2"
                textClassName="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100/50 dark:border-emerald-900/30 px-3.5 py-1.5 rounded-full"
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="top 90%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.02}
              >
                Lokasi Kami
              </ScrollFloat>
              <ScrollFloat
                containerClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-4 drop-shadow-xs pb-2"
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
              >
                {mapTitle}
              </ScrollFloat>
              <ScrollFloat
                containerClassName="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="top 90%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.01}
                textMode={false}
              >
                Pusat informasi dan pendaftaran offline tersedia di gedung utama kami.
              </ScrollFloat>
            </div>

            <div className="relative w-full h-125 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800/60 group">
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors duration-500 z-10" />

              <iframe
                src={sanitizeUrl(mapUrl)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-15 group-hover:grayscale-0 transition-all duration-700"
              />

              {/* Floating Address Card */}
              {address && (
                <div className="absolute bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-112.5 bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-white/20 dark:border-slate-800/50 shadow-2xl z-20 transition-transform duration-300 hover:-translate-y-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20">
                      <MapPin size={24} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1.5">
                        Alamat Kami
                      </h3>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                        {address}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* WHATSAPP CALL TO ACTION */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-24 relative z-10 text-left">
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-150/40 dark:border-blue-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-5 dark:opacity-10 pointer-events-none">
            <HelpCircle size={96} className="text-blue-600 animate-pulse" />
          </div>

          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">
            Masih Mengalami Kendala atau Pertanyaan Lain?
          </h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto leading-relaxed">
            Tim panitia PPDB {schoolDisplayName} siap membantu Anda secara langsung. Klik tombol di bawah untuk konsultasi via WhatsApp.
          </p>

          <a
            href={`https://wa.me/${waAdmin.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Halo Admin PPDB ${schoolDisplayName}, saya calon pendaftar PPDB TP. Saya ingin berkonsultasi mengenai proses pendaftaran.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-8 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Phone size={14} />
            <span>Konsultasi Lewat WA Admin</span>
          </a>
        </div>
      </section>
    </>
  );
};
