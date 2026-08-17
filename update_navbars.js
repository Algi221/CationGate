const fs = require('fs');
const path = require('path');

const replacementNavbar = `      {/* ── FLOATING NAVBAR ── */}
      <header className={\`sticky top-0 z-50 w-full transition-all duration-300 \${isNavbarScrolled ? 'bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm' : 'bg-transparent'}\`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center shrink-0 min-w-0">
            <Link href={\`/\${params.school_slug}\`} className="flex items-center gap-3 overflow-visible group min-w-0">
              <div className="relative h-10 w-10 shrink-0 overflow-visible">
                <SafeImage src={ppdbLogo || undefined} alt="Logo Sekolah" fill sizes="48px" className="object-contain" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs lg:max-w-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {ppdbTitle}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 shrink-0 z-50">
            <Link href={\`/\${params.school_slug}#alur\`} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Alur Pendaftaran</Link>
            <Link href={\`/\${params.school_slug}#majors\`} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Jurusan</Link>
            <Link href={\`/\${params.school_slug}#kemitraan\`} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Mitra Industri</Link>
            <Link href={\`/\${params.school_slug}#faq\`} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</Link>
            <Link href={\`/\${params.school_slug}/forum\`} className="text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors">Forum Informasi</Link>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href={\`/\${params.school_slug}/daftar\`} className="hidden md:inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors whitespace-nowrap">
              Daftar Sekarang
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 z-[101] cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

`;

const files = [
  'src/app/[school_slug]/forum/page.tsx',
  'src/app/[school_slug]/profil/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const startIdx = content.indexOf('      {/* ── FLOATING NAVBAR');
  const endIdx = content.indexOf('      {/* Fullscreen Mobile Navigation Menu Overlay');
  
  if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    content = content.substring(0, startIdx) + replacementNavbar + content.substring(endIdx);
    fs.writeFileSync(file, content);
    console.log('Fixed navbar in', file);
  } else {
    console.error('Could not find navbar anchors in', file);
  }
}
