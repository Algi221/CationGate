"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Phone, Mail, MapPin } from "lucide-react";
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
        confirmButtonColor: "#000000",
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
          confirmButtonColor: "#000000",
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
        confirmButtonColor: "#000000",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full flex-1">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-16 gap-6">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#58504E]/40 rounded-full text-xs font-semibold text-white mb-6">
              Solusi Profil Sekolahmu
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-black">
              Hubungi Kami
            </h1>
          </div>
          <p className="text-slate-600 max-w-xs text-left md:text-right text-sm md:text-base leading-relaxed">
            Konsultasikan kebutuhan platform sekolahmu. Tim kami siap membantu dan akan merespons dalam 1x24 jam kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          <div className="lg:col-span-7 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="08xx-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-100 border-none text-sm placeholder:text-slate-400 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">
                    Email Instansi
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@sekolah.sch.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-100 border-none text-sm placeholder:text-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Nama Lengkap / Nama Sekolah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama atau institusi..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-100 border-none text-sm placeholder:text-slate-400 focus:outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Pesan / Kebutuhan Digitalisasi
                </label>
                <textarea
                  rows={4}
                  placeholder="Ceritakan kendala atau kebutuhan sistem di sekolahmu..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-4 rounded-xl bg-slate-100 border-none text-sm placeholder:text-slate-400 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="disabled:opacity-50 transition-opacity"
                >
                  <InteractiveHoverButton>
                    {isSubmitting ? "Mengirim Pesan..." : "Kirim Pertanyaan"}
                  </InteractiveHoverButton>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 h-[400px] lg:h-auto min-h-[500px] relative rounded-[32px] overflow-hidden shadow-sm group cursor-pointer">
            
            <img 
              src="/assets/landing/cationgate.jpeg" 
              alt="Digitalisasi Sekolah" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            
            <div className="absolute top-6 right-6 transition-opacity duration-300 group-hover:opacity-0 z-10">
              <span className="px-5 py-2 border border-white/80 text-white rounded-full text-sm font-medium backdrop-blur-sm bg-black/30">
                Digital School Info
              </span>
            </div>

            <div className="absolute inset-0 bg-[#23191C]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-8 z-20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Kantor Pusat Kami</h3>
                <p className="text-slate-300 text-sm">Siap membantu transformasi digital sekolahmu.</p>
              </div>

              <div className="w-full max-w-sm space-y-6">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-0.5">Email Bantuan</span>
                    <span className="text-sm font-medium text-white tracking-wide">hello@sekolahdigital.id</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-green-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-0.5">WhatsApp / Telepon</span>
                    <span className="text-sm font-medium text-white tracking-wide">+62 851-1051-1403</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-0.5">Alamat</span>
                    <span className="text-sm font-medium text-white leading-snug block">
                      Jl. Ratu Bidadari 3 no 2, Ciputat, Tangerang Selatan
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}