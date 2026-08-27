"use client";

import React from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { usePPDB } from "@/context/PPDBContext";
import { useSchoolHref } from "@/hooks/useSchoolHref";

import Swal from "sweetalert2";

interface SchoolFooterProps {
  schoolSlug: string;
  isPreview?: boolean;
}

export function SchoolFooter({ schoolSlug, isPreview = false }: SchoolFooterProps) {
  const { ppdbLogo, ppdbTitle, ppdbFooterDesc, profilSekolah } = usePPDB();
  const { href } = useSchoolHref(schoolSlug);
  const [majors, setMajors] = React.useState<Array<{ code: string; title: string }>>([]);
  const [schoolContact, setSchoolContact] = React.useState<{ address: string; phone: string; email: string }>({
    address: "",
    phone: "",
    email: ""
  });

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string) => {
    if (!isPreview) return;
    e.preventDefault();
    if (targetPath.includes("#")) {
      const hash = targetPath.split("#")[1];
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    Swal.fire({
      toast: true,
      position: "top",
      icon: "info",
      title: "Mode Live Preview",
      text: "Tautan footer ini akan aktif penuh setelah perubahan disimpan.",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  };

  const isDemo = schoolSlug === "demo" || (typeof window !== "undefined" && window.location.pathname.startsWith("/demo"));
  const schoolDisplayName = ppdbTitle || (isDemo ? "SMK Demo Indonesia" : schoolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));

  React.useEffect(() => {
    fetch(`/api/config?school_slug=${schoolSlug}&t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const c = data.data;
          let majorsConfig = c.ppdb_majors_config;
          if (typeof majorsConfig === "string" && (majorsConfig.startsWith("[") || majorsConfig.startsWith("{"))) {
            try { majorsConfig = JSON.parse(majorsConfig); } catch (_e) {}
          }
          if (Array.isArray(majorsConfig) && majorsConfig.length > 0) {
            setMajors(majorsConfig);
          } else if (isDemo) {
            setMajors([
              { code: "RPL", title: "Rekayasa Perangkat Lunak" },
              { code: "TJKT", title: "Teknik Jaringan Komputer" },
              { code: "DKV", title: "Desain Komunikasi Visual" },
              { code: "BC", title: "Broadcasting & Perfilman" }
            ]);
          } else {
            setMajors([]);
          }

          setSchoolContact({
            address: c.ppdb_address || (isDemo ? "Jl. Pendidikan No. 1, Jakarta" : ""),
            phone: c.ppdb_phone || (isDemo ? "(021) 1234567" : ""),
            email: c.ppdb_email || (isDemo ? "info@demo.cationgate.site" : "")
          });
        }
      })
      .catch(() => {});
  }, [schoolSlug, isDemo]);

  let rawProfil = profilSekolah;
  if (typeof rawProfil === "string" && (rawProfil.startsWith("{") || rawProfil.startsWith("["))) {
    try { rawProfil = JSON.parse(rawProfil); } catch (_e) {}
  }
  const identitas = (rawProfil && typeof rawProfil === "object") ? rawProfil.identitas || {} : {};
  const displayAddress = schoolContact.address || identitas.alamat || (isDemo ? "Jl. Pendidikan No. 1, Jakarta" : "");
  const displayPhone = schoolContact.phone || identitas.telepon || (isDemo ? "(021) 1234567" : "");
  const displayEmail = schoolContact.email || identitas.email || (isDemo ? "info@demo.cationgate.site" : "");

  return (
    <footer className="bg-slate-50 text-slate-600 dark:bg-[#0a0a0a] dark:text-slate-500 py-16 sm:py-24 relative overflow-hidden border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1: Identity & Socials */}
          <div className="space-y-6">
            <Link href={href("/")} onClick={(e) => handleLinkClick(e, href("/"))} className="flex items-center gap-3 group">
              <div className="relative h-11 w-11 shrink-0 bg-white/10 dark:bg-white/5 rounded-xl p-1.5 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center">
                {ppdbLogo ? (
                  <SafeImage src={ppdbLogo} alt="Logo Sekolah" fill sizes="48px" className="object-contain" />
                ) : isDemo ? (
                  <SafeImage src="/assets/logo_sekolah/logo_smktb.png" alt="Logo Sekolah" fill sizes="48px" className="object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                    {(schoolDisplayName || "S").substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {schoolDisplayName}
              </span>
            </Link>
            <p className="text-xs font-semibold leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
              {ppdbFooterDesc || "Platform penerimaan peserta didik baru dan sistem administrasi sekolah digital resmi."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link instagram"
                title="Instagram Resmi"
                aria-label="Instagram Resmi"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link youtube"
                title="YouTube Resmi"
                aria-label="YouTube Resmi"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.099C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.399.564C.776 4.337-.026 5.141-.298 6.163 0 8.01 0 12 0 12s0 3.99.298 5.837c.272 1.022 1.074 1.826 2.099 2.099C4.45 20.5 12 20.5 12 20.5s7.55 0 9.399-.564c1.025-.273 1.827-1.077 2.099-2.099C24 15.99 24 12 24 12s0-3.99-.298-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link tiktok"
                title="TikTok Resmi"
                aria-label="TikTok Resmi"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.6-4.03-1.46-.07-.05-.13-.1-.19-.15v5.08c.03 2.76-1.11 5.46-3.21 7.15-2.3 1.88-5.5 2.5-8.29 1.63-2.93-.93-5.27-3.41-6.01-6.42-.87-3.51.52-7.46 3.49-9.56 1.86-1.32 4.17-1.83 6.41-1.42V9.3c-1.07-.34-2.28-.19-3.22.42-1.08.7-1.74 1.94-1.73 3.22.01 1.42.87 2.77 2.19 3.29 1.34.52 2.92.21 3.93-.76.92-.88 1.34-2.18 1.25-3.44V0h-.02z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link facebook"
                title="Facebook Resmi"
                aria-label="Facebook Resmi"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Dynamic Program Keahlian */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Program Keahlian</h4>
            {majors.length > 0 ? (
              <ul className="space-y-2 text-xs font-semibold">
                {majors.map((m, idx) => (
                  <li key={idx}>
                    <Link
                      href={href(`/jurusan/${encodeURIComponent(m.code.toLowerCase())}`)}
                      onClick={(e) => handleLinkClick(e, href(`/jurusan/${encodeURIComponent(m.code.toLowerCase())}`))}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {m.title || m.code}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 font-medium">Belum ada jurusan yang ditambahkan.</p>
            )}
          </div>

          {/* Col 3: Link Terkait */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Link Terkait</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link
                  href={href("/#alur")}
                  onClick={(e) => handleLinkClick(e, href("/#alur"))}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Alur &amp; Jadwal PPDB
                </Link>
              </li>
              <li>
                <Link
                  href={href("/#gelombang")}
                  onClick={(e) => handleLinkClick(e, href("/#gelombang"))}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Gelombang Pendaftaran
                </Link>
              </li>
              <li>
                <Link
                  href={href("/forum")}
                  onClick={(e) => handleLinkClick(e, href("/forum"))}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Forum Informasi
                </Link>
              </li>
              <li>
                <Link
                  href={href("/profil")}
                  onClick={(e) => handleLinkClick(e, href("/profil"))}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Profil Sekolah
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dynamic Sekretariat PPDB */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Sekretariat PPDB</h4>
            {displayAddress ? (
              <p className="text-xs leading-relaxed font-semibold text-slate-500 dark:text-slate-400">
                {displayAddress}
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-medium italic">Alamat belum dikonfigurasikan.</p>
            )}
            <div className="text-xs font-bold space-y-1 text-slate-500 dark:text-slate-400">
              {displayPhone && <div>Telp: {displayPhone}</div>}
              {displayEmail && <div>Email: {displayEmail}</div>}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <div>© {new Date().getFullYear()} {schoolDisplayName}. Hak Cipta Dilindungi.</div>
          <div className="flex gap-4">
            <Link href="/" onClick={(e) => handleLinkClick(e, "/")} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Kebijakan Privasi</Link>
            <span>·</span>
            <Link href="/" onClick={(e) => handleLinkClick(e, "/")} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Syarat &amp; Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
