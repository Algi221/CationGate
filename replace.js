const fs = require('fs');

const files = [
  'src/app/[school_slug]/page.tsx',
  'src/app/[school_slug]/forum/page.tsx',
  'src/app/[school_slug]/profil/page.tsx',
  'src/app/[school_slug]/jurusan/[code]/page.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let c = fs.readFileSync(file, 'utf8');
  
  // Replace header and mobile overlay
  c = c.replace(/<header[\s\S]*?<!-- Fullscreen Mobile Navigation Menu Overlay -->[\s\S]*?<\/div>\s*\)}/g, '<SchoolNavbar schoolSlug={schoolSlug} />');
  c = c.replace(/\{\/\* ── FLOATING NAVBAR ── \*\/\}[\s\S]*?<!-- Fullscreen Mobile Navigation Menu Overlay -->[\s\S]*?<\/div>\s*\)}/g, '<SchoolNavbar schoolSlug={schoolSlug} />');

  // Specific replacement for profil
  c = c.replace(/<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">[\s\S]*?<\/nav>/g, '<SchoolNavbar schoolSlug={schoolSlug} />');

  // Replace footer
  c = c.replace(/<footer[\s\S]*?<\/footer>/g, '<SchoolFooter schoolSlug={schoolSlug} />');
  
  // Add imports
  if (!c.includes('SchoolNavbar')) {
    c = c.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { SchoolNavbar } from "@/components/landing/SchoolNavbar";\nimport { SchoolFooter } from "@/components/landing/SchoolFooter";');
  } else if (!c.includes('import { SchoolNavbar }')) {
    c = c.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { SchoolNavbar } from "@/components/landing/SchoolNavbar";\nimport { SchoolFooter } from "@/components/landing/SchoolFooter";');
  }

  // Define schoolSlug if not defined (forum, profil, jurusan)
  if (!c.includes('const schoolSlug =') && c.includes('params.school_slug')) {
    c = c.replace('const params = useParams();', 'const params = useParams();\n  const schoolSlug = params.school_slug as string;');
  }

  // Remove `schoolSlug` from `page.tsx` where it already uses `schoolSlug`
  // Actually page.tsx has `const schoolSlug = (params?.school_slug as string) || "sekolah";`

  fs.writeFileSync(file, c);
  console.log('Updated', file);
}
