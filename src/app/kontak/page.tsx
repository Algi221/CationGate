"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { Phone, Mail, MapPin, Send, User, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";

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
        confirmButtonColor: "#F59E0B",
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
        confirmButtonColor: "#F59E0B",
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
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Dark Navy Panel */}
          <div className="lg:col-span-5 bg-[#0E1726] text-white p-8 md:p-12 flex flex-col justify-between space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                Hubungi Kami
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tim kami siap bantu kamu lewat kontak di bawah ini, atau langsung datang ke lokasi kantor kami.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {/* Telepon */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1B2739] border border-slate-700/50 transition-all hover:border-amber-500/40">
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-md">
                  <Phone size={18} className="text-slate-800" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Telepon</span>
                  <span className="text-sm font-bold text-white tracking-wide">+62 851-1051-1403</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1B2739] border border-slate-700/50 transition-all hover:border-amber-500/40">
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-md">
                  <Mail size={18} className="text-amber-500" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Email</span>
                  <span className="text-sm font-bold text-white tracking-wide">jelajahmemoria@gmail.com</span>
                </div>
              </div>

              {/* Alamat */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1B2739] border border-slate-700/50 transition-all hover:border-amber-500/40">
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-md">
                  <MapPin size={18} className="text-amber-500" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Alamat</span>
                  <span className="text-xs font-bold text-white leading-snug block">
                    Jl. Ratu Bidadari 3 no 2, Ciputat, Tangerang Selatan
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Note inside Left Card */}
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Jam Operasional: Senin - Jumat (08.00 - 17.00 WIB)
            </div>
          </div>

          {/* Right White Form Panel */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Get In Touch
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Isi form di bawah dan tim kami akan segera menghubungi kamu kembali, biasanya dalam 1x24 jam kerja.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="tel"
                      placeholder="08xx-xxxx-xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-4 text-slate-400" size={16} />
                  <textarea
                    rows={4}
                    required
                    placeholder="Tulis pesan kamu di sini..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Mengirim Pesan...</span>
                ) : (
                  <>
                    <span>Kirim Pesan</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <CinematicFooter />
    </div>
  );
}
