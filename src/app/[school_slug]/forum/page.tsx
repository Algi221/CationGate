"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Search, 
  Megaphone,
  Sun,
  Moon,
  Calendar,
  ChevronRight,
  ArrowRight,
  User,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import BlurText from '@/components/BlurText';
import SafeImage from "@/components/SafeImage";
import dompurify from "dompurify";
import { usePPDB } from "@/context/PPDBContext";

const sanitizeUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    }) || null;
  } catch (e) {
    return null;
  }
};

const sanitizeSrc = (src: string | undefined | null): string | null => sanitizeUrl(src);

const BACKEND_URL = typeof window !== 'undefined' ? '/api' : "http://localhost:3000/api";

interface InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDateShort = (dateStr: string | null | undefined) => {
  if (!dateStr) return { day: '-', month: '---' };
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return { day: d.getDate(), month: months[d.getMonth()] };
};

const timeAgo = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} hari yang lalu`;
};

const parseMedia = (raw: string | null | undefined) => {
  if (!raw) return { foto: "", video: "", videoName: "", dokumen: "", dokumenName: "" };
  if (raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw);
      return {
        foto: parsed.foto || "",
        video: parsed.video || "",
        videoName: parsed.video_name || "",
        dokumen: parsed.dokumen || "",
        dokumenName: parsed.dokumen_name || ""
      };
    } catch (e) {
      // fallback
    }
  }
  return { foto: raw, video: "", videoName: "", dokumen: "", dokumenName: "" };
};

export default function ForumPage() {
  const params = useParams();
  const { ppdbLogo, ppdbTitle, profilSekolah } = usePPDB();
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [informasi, setInformasi] = useState<InformasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<InformasiItem | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleViewDetail = async (id: number) => {
    try {
      setLoadingDetailId(id);
      const res = await fetch(`${BACKEND_URL}/api/informasi/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedPost(json.data);
      } else {
        alert("Gagal mengambil detail informasi.");
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
      alert("Gagal terhubung ke server untuk mengambil detail informasi.");
    } finally {
      setLoadingDetailId(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsNavbarScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/informasi`);
        const json = await res.json();
        if (json.success && json.data) {
          setInformasi(json.data);
        }
        
        try {
          const configRes = await fetch(`${BACKEND_URL}/api/config`);
          const configJson = await configRes.json();
          if (configJson.success && configJson.data && configJson.data.ppdb_school_period) {
            setSchoolPeriod(configJson.data.ppdb_school_period);
          }
        } catch (configErr) {
          console.warn("Gagal mengambil config sekolah:", configErr);
          const localPeriod = localStorage.getItem("ppdb_school_period");
          if (localPeriod) setSchoolPeriod(localPeriod);
        }
      } catch (e) {
        console.error("Gagal fetch informasi:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = informasi.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = searchQuery === '' || 
      (item.judul || "").toLowerCase().includes(searchLower) || 
      (item.konten || "").toLowerCase().includes(searchLower);
    return matchSearch;
  });

  const recentPosts = informasi.slice(0, 3);

  const getCategoryBadge = () => {
    return { label: 'INFORMASI', cls: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' };
  };

  const schoolSlug = params.school_slug as string;
  const identitas = profilSekolah?.identitas || {};
  const address = identitas.alamat || "Jl. Raya Tapos No. 123, Depok";
  const phone = "(021) 876-5432";
  const email = identitas.email || "info@sekolah.sch.id";

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      
      {/* ── FLOATING NAVBAR (same as landing page) ── */}
      <div className="navbar-wrapper z-50">
        <nav className={`navbar ${isNavbarScrolled ? "scrolled" : ""}`}>
          <div className="nav-left">
            <Link href={`/${params.school_slug}`} className="logo-container">
              <img src={ppdbLogo || undefined} alt="Logo Sekolah" className="w-9 h-9 object-contain" />
              <span className="logo-text font-extrabold">{ppdbTitle}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href={`/${params.school_slug}#alur`} className="btn-nav-link">Alur Pendaftaran</Link>
            <Link href={`/${params.school_slug}#majors`} className="btn-nav-link">Jurusan</Link>
            <Link href={`/${params.school_slug}#kemitraan`} className="btn-nav-link">Mitra Industri</Link>
            <Link href={`/${params.school_slug}#faq`} className="btn-nav-link">FAQ</Link>
            <Link href={`/${params.school_slug}/forum`} className="btn-nav-link" style={{color: 'var(--color-blue-600, #2563eb)', fontWeight: 700}}>Forum Informasi</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href={`/${params.school_slug}/daftar`} className="btn-primary-pill !hidden md:!inline-flex">
              Daftar Sekarang
            </Link>

            {/* Hamburger Button visible only on mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 z-[101] cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Fullscreen Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] animate-in fade-in duration-300 md:hidden animate-out fade-out">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-6 text-center p-6 w-full max-w-sm relative z-10">
            <Link href={`/${params.school_slug}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 mb-6">
              <img src={ppdbLogo || undefined} alt="Logo Sekolah" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-black text-slate-800 dark:text-white">{ppdbTitle}</span>
            </Link>

            <Link
              href={`/${params.school_slug}#alur`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Alur Pendaftaran
            </Link>
            <Link
              href={`/${params.school_slug}#majors`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Jurusan
            </Link>
            <Link
              href={`/${params.school_slug}#kemitraan`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Mitra Industri
            </Link>
            <Link
              href={`/${params.school_slug}#faq`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              FAQ
            </Link>
            <Link
              href={`/${params.school_slug}/forum`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3 border-b border-slate-100 dark:border-slate-800/60 w-full"
            >
              Forum Informasi
            </Link>

            <div className="w-full flex flex-col gap-3 mt-8">
              <Link
                href={`/${params.school_slug}/daftar`}
                className="w-full btn-primary-pill flex items-center justify-center py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar Sekarang
              </Link>
              <button
                onClick={() => { toggleDark(); setMobileMenuOpen(false); }}
                className="w-full py-4 text-center text-sm font-black uppercase tracking-wider rounded-2xl border border-slate-200 dark:border-slate-700/80 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 w-full flex-grow">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header */}
          <div>
            <BlurText 
              text="Forum Pengumuman" 
              className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
              delay={150}
              animateBy="words"
              direction="top"
            />
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm leading-relaxed mb-6">
              Pusat informasi resmi dan pengumuman terbaru dari panitia PPDB SMK Taruna Bhakti.
            </p>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider">Memuat pengumuman...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
                <Megaphone className="text-slate-400 dark:text-slate-500 dark:text-slate-400" size={28} />
              </div>
              <h3 className="text-slate-800 dark:text-white font-black uppercase tracking-wider mb-3">Belum Ada Informasi</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Belum ada pengumuman yang aktif saat ini dari panitia PPDB SMK Taruna Bhakti. Silakan cek kembali nanti.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item, index) => {
                const badge = getCategoryBadge();
                const media = parseMedia(item.foto_url);
                return (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    key={item.id}
                    onClick={() => {
                      if (loadingDetailId === null) {
                        handleViewDetail(item.id);
                      }
                    }}
                    className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer group ${loadingDetailId === item.id ? 'opacity-80 pointer-events-none' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${badge.cls}`}>
                          {badge.label}
                        </span>
                        {media.video && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-500/15">
                            🎥 Video
                          </span>
                        )}
                        {media.dokumen && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald-500/15">
                            📄 Dokumen
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Calendar size={13} />
                        {formatDate(item.tanggal)}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 mb-4">
                      {media.foto && (
                        <div className="w-full sm:w-48 h-48 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-sm">
                           <img src={sanitizeSrc(media.foto)} alt={item.judul || "Pengumuman"} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-350" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug break-all hyphens-auto">
                          {item.judul}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 break-all hyphens-auto">
                          {item.konten}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center">
                          <User size={12} className="text-slate-400" />
                        </div>
                        Panitia PPDB SMK TB
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1">
                        {loadingDetailId === item.id ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent dark:border-blue-400 dark:border-t-transparent rounded-full animate-spin"></span>
                            Memuat...
                          </span>
                        ) : (
                          <>
                            Baca Selengkapnya
                            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder-slate-400 text-slate-800 dark:text-white shadow-sm"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#F0F4F8] dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/50 dark:border-slate-800 shadow-sm"
          >
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-5">Pengumuman Terbaru</h3>
            {recentPosts.length === 0 ? (
              <div className="py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Belum ada pengumuman</p>
              </div>
            ) : (
              <div className="space-y-5">
                {recentPosts.map((item, index) => {
                  const { day, month } = formatDateShort(item.tanggal);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                      onClick={() => {
                        if (loadingDetailId === null) {
                          handleViewDetail(item.id);
                        }
                      }}
                      className={`flex gap-4 items-start cursor-pointer group ${loadingDetailId === item.id ? 'opacity-80 pointer-events-none' : ''}`}
                    >
                      <div className="flex flex-col items-center justify-center w-10 h-11 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800/60 dark:border-slate-700 shadow-sm shrink-0">
                        <span className="text-[9px] font-bold text-blue-600 uppercase">{month}</span>
                        <span className="text-sm font-black text-slate-800 dark:text-white leading-none mt-0.5">{day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 break-all hyphens-auto">
                          {item.judul}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">{timeAgo(item.tanggal)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/20"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white dark:bg-[#0f172a]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-200">PPDB {schoolPeriod.includes("-") ? schoolPeriod.split("-")[0] : schoolPeriod}</span>
              <h3 className="text-lg font-bold leading-snug mt-1 mb-4">Pendaftaran Siswa Baru Telah Dibuka</h3>
              <Link href={`/${params.school_slug}/daftar`} className="inline-block bg-white dark:bg-[#0f172a] text-blue-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
                PPDB 2026 Dibuka
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── DETAIL MODAL ── */}
      {selectedPost && (() => {
        const media = parseMedia(selectedPost.foto_url);
        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden my-8 max-h-[90vh] md:max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {media.foto && (
                <div 
                  onClick={() => setLightboxImage(media.foto)}
                  className="w-full md:w-auto md:max-w-[45%] bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 cursor-zoom-in relative group max-h-[350px] md:max-h-none shrink-0"
                >
                  <img src={sanitizeSrc(media.foto)} alt={selectedPost.judul} className="max-w-full max-h-full md:max-h-[75vh] w-auto h-auto object-contain rounded-xl" />
                  <div className="absolute inset-0 bg-slate-955/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm">🔍 Klik untuk Zoom</span>
                  </div>
                </div>
              )}
              
              <div className="flex-1 flex flex-col min-w-0 h-auto md:h-full overflow-visible md:overflow-y-auto">
                <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/15 sticky top-0 z-20 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900">
                    <Calendar size={11} />
                    {formatDate(selectedPost.tanggal)}
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-white dark:bg-[#0f172a]/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-white dark:hover:text-white flex items-center justify-center transition-all font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-6 flex-1">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white leading-snug break-all">{selectedPost.judul}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line break-all">{selectedPost.konten}</p>

                  {/* Additional Media Section */}
                  {(media.video || media.dokumen) && (
                    <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-6">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-left">
                        Lampiran Pengumuman
                      </h4>
                      
                      <div className="space-y-6">
                        {/* Video Player (Inline playback only, no download) */}
                        {media.video && (
                          <div className="space-y-3 text-left">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block">🎥 Video Lampiran:</span>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-955 shadow-md">
                              <video src={sanitizeSrc(media.video)} controls className="w-full max-h-72 object-contain">
                                <track kind="captions" label="No captions" default />
                              </video>
                            </div>
                          </div>
                        )}

                        {/* Document Preview & Download Button */}
                        {media.dokumen && (
                          <div className="space-y-3 text-left w-full">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider block">📄 Pratinjau Dokumen Resmi / Surat Keputusan:</span>
                            
                            {media.dokumen.startsWith("data:application/pdf") ? (
                              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md bg-white dark:bg-[#0f172a]">
                                <iframe src={sanitizeSrc(media.dokumen)} className="w-full h-[350px] border-0" />
                              </div>
                            ) : media.dokumen.startsWith("data:image/") ? (
                              <div 
                                onClick={() => setLightboxImage(media.dokumen)}
                                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 cursor-zoom-in group relative"
                              >
                                <img src={sanitizeSrc(media.dokumen)} alt="Dokumen Preview" className="max-w-full max-h-80 object-contain rounded-xl" />
                                <div className="absolute inset-0 bg-slate-955/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <span className="bg-black/60 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">🔍 Zoom Dokumen</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-650 dark:text-emerald-450 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                  <BookOpen size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{media.dokumenName || "dokumen.pdf"}</h6>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-550 block mt-0.5">Pratinjau langsung tidak tersedia untuk format berkas ini. Silakan unduh dokumen untuk melihat isi berkas.</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="pt-2">
                              <a
                                href={sanitizeUrl(media.dokumen)}
                                download={media.dokumenName || "lampiran_dokumen.pdf"}
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
                              >
                                Unduh Lampiran Dokumen ({media.dokumenName || "dokumen.pdf"})
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/15 border-t border-slate-100 dark:border-white/5 flex justify-end sticky bottom-0 z-20 backdrop-blur-md">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-[#0f172a]/10 hover:bg-white dark:bg-[#0f172a]/20 text-white flex items-center justify-center transition-all cursor-pointer z-50 border border-white/10 hover:scale-105 active:scale-95"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
          
          <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={sanitizeSrc(lightboxImage)} 
              alt="Detail Zoomed" 
              className="max-w-full max-h-[90vh] md:max-h-screen object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
            />
          </div>
        </div>
      )}
    
      {/* FOOTER */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/50 dark:border-slate-900 py-16 transition-colors duration-300 relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-slate-500 dark:text-slate-400">
            {/* Col 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <SafeImage src={ppdbLogo || undefined} alt="Logo Sekolah" width={48} height={48} className="w-12 h-12 object-contain shrink-0" />
                <div>
                  <span className="logo-text font-black text-slate-800 dark:text-white text-lg">{ppdbTitle}</span>
                  <span className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase mt-0.5">SMK Taruna Bhakti</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global sejak 1987.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.instagram.com/smktarunabhakti.depok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link instagram"
                  title="Instagram Resmi SMK Taruna Bhakti"
                  aria-label="Instagram Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@smktarunabhaktidepok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link youtube"
                  title="YouTube Resmi SMK Taruna Bhakti"
                  aria-label="YouTube Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.099C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.399.564C.776 4.337-.026 5.141-.298 6.163 0 8.01 0 12 0 12s0 3.99.298 5.837c.272 1.022 1.074 1.826 2.099 2.099C4.45 20.5 12 20.5 12 20.5s7.55 0 9.399-.564c1.025-.273 1.827-1.077 2.099-2.099C24 15.99 24 12 24 12s0-3.99-.298-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@starbhak.official?lang=id-ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link tiktok"
                  title="TikTok Resmi SMK Taruna Bhakti"
                  aria-label="TikTok Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.6-4.03-1.46-.07-.05-.13-.1-.19-.15v5.08c.03 2.76-1.11 5.46-3.21 7.15-2.3 1.88-5.5 2.5-8.29 1.63-2.93-.93-5.27-3.41-6.01-6.42-.87-3.51.52-7.46 3.49-9.56 1.86-1.32 4.17-1.83 6.41-1.42V9.3c-1.07-.34-2.28-.19-3.22.42-1.08.7-1.74 1.94-1.73 3.22.01 1.42.87 2.77 2.19 3.29 1.34.52 2.92.21 3.93-.76.92-.88 1.34-2.18 1.25-3.44V0h-.02z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/smktarunabhaktidepok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link facebook"
                  title="Facebook Resmi SMK Taruna Bhakti"
                  aria-label="Facebook Resmi SMK Taruna Bhakti"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Program Keahlian</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><Link href={`/${schoolSlug}/jurusan/rpl`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Rekayasa Perangkat Lunak (PPLG)</Link></li>
                <li><Link href={`/${schoolSlug}/jurusan/tjkt`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Jaringan Komputer &amp; Telkom (TJKT)</Link></li>
                <li><Link href={`/${schoolSlug}/jurusan/dkv`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Desain Komunikasi Visual (DKV)</Link></li>
                <li><Link href={`/${schoolSlug}/jurusan/bc`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Broadcasting &amp; Perfilman (BC)</Link></li>
                <li><Link href={`/${schoolSlug}/jurusan/an`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Animasi (AN)</Link></li>
                <li><Link href={`/${schoolSlug}/jurusan/te`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Teknik Elektronika (TE)</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Link Terkait</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><Link href={`/${schoolSlug}#alur`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Brosur PPDB {schoolPeriod.split("-")[0]}</Link></li>
                <li><Link href={`/${schoolSlug}#alur`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Syarat Pendaftaran</Link></li>
                <li><Link href={`/${schoolSlug}/forum`} className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Forum Informasi</Link></li>
                <li><a href="https://smktarunabhakti.sch.id/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Company Profil Sekolah</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Sekretariat PPDB</h4>
              <p className="text-xs leading-relaxed font-semibold">
                {address}
              </p>
              <div className="text-xs font-bold space-y-1">
                <div>Telp: {phone}</div>
                <div>Email: {email}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800/50 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <div>© {new Date().getFullYear()} SMK Taruna Bhakti Depok. All Rights Reserved.</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400 transition-colors">Kebijakan Privasi</Link>
              <span>·</span>
              <Link href="/" className="hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400 transition-colors">Syarat &amp; Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
