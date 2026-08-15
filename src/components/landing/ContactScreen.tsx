"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  X,
  Send,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// ==========================================
// 1. CONTEXT & HOOKS (Logika State)
// ==========================================
interface ExpandableScreenContextValue {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  layoutId: string;
}

const ExpandableScreenContext =
  createContext<ExpandableScreenContextValue | null>(null);

function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext);
  if (!context) {
    throw new Error(
      "useExpandableScreen must be used within an ExpandableScreen",
    );
  }
  return context;
}

// ==========================================
// 2. ROOT PROVIDER
// ==========================================
interface ExpandableScreenProps {
  children: ReactNode;
  layoutId?: string;
}

function ExpandableScreen({
  children,
  layoutId = "contact-morph-btn",
}: ExpandableScreenProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  return (
    <ExpandableScreenContext.Provider
      value={{ isExpanded, expand, collapse, layoutId }}
    >
      <section className="w-full px-4 md:px-6 py-16 md:py-24 max-w-6xl mx-auto flex justify-center items-center">
        {children}
      </section>
    </ExpandableScreenContext.Provider>
  );
}

// ==========================================
// 3. TRIGGER COMPONENT (Tombol yang bisa morphing)
// ==========================================
function ContactTrigger() {
  const { isExpanded, expand, layoutId } = useExpandableScreen();

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-[2.5rem] p-10 md:p-20 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/[0.03] to-transparent pointer-events-none"></div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full  text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6 relative z-10">
        Bantuan & Diskusi
      </div>

      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tight max-w-2xl relative z-10">
        Punya Pertanyaan Lain Terkait Sistem?
      </h2>

      {/* Kontainer Tombol dengan AnimatePresence */}
      <div className="relative z-10 h-14 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isExpanded && (
            <motion.button
              layoutId={layoutId}
              onClick={expand}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer flex items-center gap-2 bg-yellow-400 text-zinc-950 px-8 py-4 rounded-full font-bold text-base transition-all hover:bg-yellow-300 hover:scale-105 shadow-lg shadow-yellow-400/10 group will-change-transform"
            >
              <span>Hubungi Tim Teknis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// 4. CONTENT COMPONENT (Modal Full Screen dari Tombol)
// ==========================================
function ContactContent() {
  const { isExpanded, collapse, layoutId } = useExpandableScreen();

  // Konfigurasi physics spring agar perpindahan dari tombol ke modal sangat empuk dan natural
  const springTransition = {
    type: "spring",
    damping: 30,
    stiffness: 250,
    mass: 1,
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <>
          {/* Backdrop Blur Gelap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[998] bg-zinc-950/60 backdrop-blur-md"
            onClick={collapse}
          />

          {/* Wrapper Modal Utama yang Responsif */}
          <div className="fixed inset-3 sm:inset-6 md:inset-10 lg:inset-14 z-[999] flex items-center justify-center pointer-events-none">
            <motion.div
              layoutId={layoutId}
              transition={springTransition}
              className="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row border border-zinc-200 will-change-transform"
            >
              {/* Tombol Close */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={collapse}
                className="cursor-pointer absolute right-5 top-5 md:right-8 md:top-8 z-[1000] flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 hover:bg-yellow-400 hover:text-zinc-950 text-zinc-700 transition-colors shadow-sm"
                aria-label="Tutup Layar"
              >
                <X className="h-5 w-5" />
              </motion.button>

              {/* KIRI: Info Kontak (Dark Mode Mewah, Responsif Scroll) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="w-full md:w-5/12 bg-zinc-950 p-6 sm:p-8 md:p-14 lg:p-16 flex flex-col justify-between text-white overflow-y-auto h-auto md:h-full relative shrink-0"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/[0.03] rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 space-y-6">
                  <span className="inline-block px-3.5 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-bold uppercase tracking-widest rounded-full border border-yellow-400/20">
                    Dukungan Langsung
                  </span>

                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                      Mari Bangun <br />
                      <span className="text-yellow-400">Sistem Hebat.</span>
                    </h2>
                    <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm md:text-base">
                      Diskusikan kebutuhan manajemen sekolah, kustomisasi PPDB,
                      dan jadwal implementasi CationGate bersama tim kami.
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-yellow-400 group-hover:border-yellow-400/40 transition-colors shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="pt-1">
                        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                          Email Resmi
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-200">
                          partnership@cationgate.id
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-yellow-400 group-hover:border-yellow-400/40 transition-colors shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="pt-1">
                        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                          Telepon / WhatsApp
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-200">
                          +62 811 2345 6789
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-yellow-400 group-hover:border-yellow-400/40 transition-colors shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="pt-1">
                        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                          Kantor Utama
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-zinc-300 leading-relaxed">
                          Gedung Inovasi SMK Taruna Bhakti
                          <br />
                          Depok, Jawa Barat, Indonesia
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-zinc-900 text-[11px] sm:text-xs text-zinc-500 font-medium">
                  © 2026 CationGate Tech Division.
                </div>
              </motion.div>

              {/* KANAN: Form (Responsif di semua ukuran layar) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-full md:w-7/12 p-6 sm:p-8 md:p-14 lg:p-16 bg-white overflow-y-auto h-auto md:h-full flex flex-col justify-center"
              >
                <div className="max-w-xl w-full mx-auto">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 mb-1 sm:mb-2 tracking-tight">
                    Kirim Pesan
                  </h3>
                  <p className="text-zinc-500 text-xs sm:text-sm mb-6 sm:mb-8">
                    Isi formulir di bawah ini dan kami akan segera merespon
                    dalam 1x24 jam.
                  </p>

                  <form
                    className="space-y-4 sm:space-y-5"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          placeholder="Budi Santoso"
                          className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white transition-all text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700">
                          Instansi / Sekolah
                        </label>
                        <input
                          type="text"
                          placeholder="SMK Taruna Bhakti"
                          className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white transition-all text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        placeholder="budi@sekolah.sch.id"
                        className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white transition-all text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700">
                        Pesan / Kebutuhan Sistem
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ceritakan rencana implementasi sistem di sekolah Anda..."
                        className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white transition-all resize-none text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-yellow-400/20 mt-2 sm:mt-4 text-sm sm:text-base"
                    >
                      <span>Kirim Pesan Sekarang</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// 5. EXPORT UTAMA
// ==========================================
export function ContactScreen() {
  return (
    <ExpandableScreen>
      <ContactTrigger />
      <ContactContent />
    </ExpandableScreen>
  );
}
