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
  
  if (!c.includes('import { SchoolNavbar }')) {
    if (c.includes('import Link from "next/link";')) {
      c = c.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { SchoolNavbar } from "@/components/landing/SchoolNavbar";\nimport { SchoolFooter } from "@/components/landing/SchoolFooter";');
    } else if (c.includes("import Link from 'next/link';")) {
      c = c.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { SchoolNavbar } from \"@/components/landing/SchoolNavbar\";\nimport { SchoolFooter } from \"@/components/landing/SchoolFooter\";");
    } else {
      c = c.replace('"use client";', '"use client";\nimport { SchoolNavbar } from "@/components/landing/SchoolNavbar";\nimport { SchoolFooter } from "@/components/landing/SchoolFooter";');
    }
    fs.writeFileSync(file, c);
    console.log('Fixed imports in', file);
  }
}
