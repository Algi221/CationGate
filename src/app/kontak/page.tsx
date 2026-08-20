"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Phone, Mail, Send, User, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Harap isi Nama, Email, dan Pesan Anda.",
        confirmButtonColor: "#FBBF24", // yellow-400
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Swal.fire({
        icon: "success",
        title: "Pesan Terkirim!",
        text: "Terima kasih telah menghubungi CationGate. Tim kami akan merespons dalam 1x24 jam kerja.",
        confirmButtonColor: "#FBBF24",
      });
      setFormData({ email: "", phone: "", name: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1 flex items-center justify-center">
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Left Dark Panel with Info & Illustration */}
          <div className="lg:col-span-5 bg-[#0E1726] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/[0.05] rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
              {/* Header aligned identically with right form header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
                  Hubungi Kami
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed min-h-[44px]">
                  Punya pertanyaan tentang sistem informasi sekolah? Tim kami siap membantu memberikan solusi terbaik untuk institusi Anda.
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                {/* Telepon */}
                <a
                  href="https://wa.me/6285167348039"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#1B2739] border border-slate-700/50 transition-all hover:border-yellow-400/40 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shrink-0 shadow-md group-hover:bg-yellow-400/10 transition-colors">
                    <Phone size={16} className="text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Telepon / WhatsApp</span>
                    <span className="text-sm font-bold text-white tracking-wide group-hover:text-yellow-400 transition-colors">
                      +62 851-6734-8039
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:cationgate@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#1B2739] border border-slate-700/50 transition-all hover:border-yellow-400/40 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shrink-0 shadow-md group-hover:bg-yellow-400/10 transition-colors">
                    <Mail size={16} className="text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Email Resmi</span>
                    <span className="text-sm font-bold text-white tracking-wide group-hover:text-yellow-400 transition-colors">
                      cationgate@gmail.com
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Customer Service Image at the bottom */}
            <div className="relative z-10 flex items-center justify-center mt-8 w-full">
              <Image 
                src="/assets/lottie_ilustration/customer-service-executive.svg" 
                alt="Customer Service Executive"
                width={360}
                height={360}
                className="w-full max-w-[280px] md:max-w-[340px] opacity-95 drop-shadow-2xl -scale-x-100 object-contain"
                priority
              />
            </div>
          </div>

          {/* Right White Form Panel */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between h-full bg-white dark:bg-slate-900">
            <div>
              {/* Header aligned identically with left dark panel */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  Kirim Pesan
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[44px]">
                  Isi form di bawah dan tim teknis kami akan segera menghubungi Anda kembali dalam 1x24 jam kerja.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        required
                        placeholder="nama@sekolah.sch.id"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="tel"
                        placeholder="08xx-xxxx-xxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Nama Lengkap / Instansi
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      placeholder="Budi Santoso - SMK Taruna Bhakti"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Pesan / Kebutuhan Sistem
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-4 text-slate-400" size={16} />
                    <textarea
                      rows={4}
                      required
                      placeholder="Ceritakan rencana implementasi sistem CationGate di sekolah Anda..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white transition-all resize-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold text-sm sm:text-base shadow-lg shadow-yellow-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <span>Mengirim Pesan...</span>
                  ) : (
                    <>
                      <span>Kirim Pesan Sekarang</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <CinematicFooter />
    </div>
  );
}
