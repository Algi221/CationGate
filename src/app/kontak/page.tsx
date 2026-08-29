"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Phone, Mail, Plus } from "lucide-react";
import Swal from "sweetalert2";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Harap isi Nama dan Email instansi Anda.",
        confirmButtonColor: "#2e3749",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Pesan Terkirim!",
          text: "Terima kasih, tim kami akan segera menghubungi Anda untuk mendiskusikan kebutuhan digitalisasi sekolah Anda.",
          confirmButtonColor: "#2e3749",
        });
        
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        throw new Error("Gagal mengirim pesan dari server");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat mengirim pesan. Pastikan koneksi aman atau coba lagi nanti.",
        confirmButtonColor: "#2e3749",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2e3749] flex flex-col justify-between font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-28 pb-24 w-full flex-1">
        <section className="relative px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto text-center py-12 lg:py-20 flex flex-col items-center justify-center">
          <div className="absolute top-6 left-8 sm:left-16 text-[#2e3749]/20 pointer-events-none">
            <Plus size={32} />
          </div>
          <div className="absolute top-10 right-10 sm:right-20 w-8 h-8 border-4 border-[#FFD33B] rounded-full border-t-transparent border-r-transparent -rotate-45 pointer-events-none" />
          <div className="absolute bottom-8 left-10 sm:left-24 text-[#FFD33B] pointer-events-none">
            <Plus size={24} />
          </div>
          <div className="absolute bottom-6 right-8 sm:right-16 w-6 h-6 border-4 border-[#2e3749]/30 rounded-full border-b-transparent border-l-transparent rotate-45 pointer-events-none" />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2e3749] mb-6">
            Mari terhubung dengan kami
          </h1>
          
          <p className="text-slate-500 max-w-2xl text-sm sm:text-base leading-relaxed mb-8">
            Konsultasikan kebutuhan platform sekolahmu. Kirimkan pesan atau hubungi kami langsung, tim kami siap membantu dan akan merespons dalam 1x24 jam kerja.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <a
              href="https://wa.me/6285167348039"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-5 py-2.5 rounded-full border border-slate-200 hover:border-[#FFD33B] transition-all hover:scale-105 shadow-xs"
            >
              <Phone size={18} className="text-[#2e3749]" />
              <span className="text-sm font-semibold text-[#2e3749]">
                085167348039
              </span>
            </a>

            <a
              href="mailto:cationgate@gmail.com"
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-5 py-2.5 rounded-full border border-slate-200 hover:border-[#FFD33B] transition-all hover:scale-105 shadow-xs"
            >
              <Mail size={18} className="text-[#2e3749]" />
              <span className="text-sm font-semibold text-[#2e3749]">
                cationgate@gmail.com
              </span>
            </a>
          </div>
        </section>

        <section className="relative px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto pt-4">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-linear-to-r from-transparent via-[#FFD33B] to-transparent opacity-60 rounded-full" />
          <div className="absolute top-12 -left-6 text-[#FFD33B]/40 pointer-events-none hidden sm:block">
            <Plus size={40} />
          </div>
          <div className="absolute bottom-20 -right-6 w-12 h-12 border-4 border-[#FFD33B]/50 rounded-full border-t-transparent border-l-transparent pointer-events-none hidden sm:block" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative z-10">
            <div className="lg:col-span-6 space-y-10">
              <div className="bg-slate-50/70 border border-slate-100/80 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-sm relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#FFD33B]/10 rounded-full blur-xl pointer-events-none" />

                <h2 className="text-2xl sm:text-3xl font-bold text-[#2e3749] mb-2">
                  Kirim Pesan
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  Isi formulir di bawah ini untuk memulai diskusi dengan tim kami.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap / Instansi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-[#2e3749] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD33B] focus:ring-2 focus:ring-[#FFD33B]/30 transition-all shadow-sm"
                    />

                    <input
                      type="tel"
                      placeholder="Nomor WhatsApp"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-[#2e3749] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD33B] focus:ring-2 focus:ring-[#FFD33B]/30 transition-all shadow-sm"
                    />
                  </div>

                  <input
                    type="email"
                    required
                    placeholder="Email Instansi / Sekolah"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-[#2e3749] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD33B] focus:ring-2 focus:ring-[#FFD33B]/30 transition-all shadow-sm"
                  />

                  <textarea
                    rows={4}
                    placeholder="Tuliskan pesan atau kebutuhan digitalisasi sekolahmu..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-[#2e3749] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD33B] focus:ring-2 focus:ring-[#FFD33B]/30 transition-all resize-none shadow-sm"
                  />

                  <div className="pt-2">
                    <InteractiveHoverButton 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] border-none font-bold px-8 py-3 shadow-sm disabled:opacity-50 transition-opacity"
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                    </InteractiveHoverButton>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-6 sticky top-28">
              <div className="rounded-4xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100 h-120 lg:h-145 relative group">
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FFD33B]/30 rounded-full blur-2xl z-0 pointer-events-none" />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/assets/landing/cationgate.jpeg" 
                  alt="Gedung Perusahaan" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 relative z-10"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#2e3749]/90 via-black/20 to-transparent flex items-end p-8 z-20">
                  <div className="text-white">
                    <span className="px-3 py-1 bg-[#FFD33B] text-[#2e3749] text-xs font-bold rounded-full mb-2 inline-block">
                      Headquarter
                    </span>
                    <h3 className="text-2xl font-bold">Pusat Digitalisasi Sekolah</h3>
                    <p className="text-sm text-slate-200 mt-1">Membangun ekosistem pendidikan modern yang terintegrasi.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      <CinematicFooter />
    </div>
  );
}