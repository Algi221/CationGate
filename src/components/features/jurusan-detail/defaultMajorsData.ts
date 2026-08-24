import dompurify from "dompurify";
import { MajorDetail } from "./types";

export const sanitizeUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  try {
    return (
      dompurify.sanitize(url, {
        ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
      }) || null
    );
  } catch (_e) {
    return null;
  }
};

export const sanitizeSrc = (src: string | undefined | null): string | null => {
  let url = sanitizeUrl(src);
  if (url && url.startsWith("/jurusan/")) {
    url = url.replace("/jurusan/", "/assets/jurusan/");
  }
  return url;
};

export function hexToRgb(hex: string): string {
  try {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = (hex || "#0066ff").replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 102, 255";
  } catch (_) {
    return "0, 102, 255";
  }
}

export function getDarkerColor(hex: string, percent = 20): string {
  try {
    const cleanHex = (hex || "#0066ff").replace("#", "");
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return "#0044cc";
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    const clamp = (val: number) => (val < 0 ? 0 : val > 255 ? 255 : val);
    const rHex = clamp(R).toString(16).padStart(2, "0");
    const gHex = clamp(G).toString(16).padStart(2, "0");
    const bHex = clamp(B).toString(16).padStart(2, "0");
    return `#${rHex}${gHex}${bHex}`;
  } catch (_) {
    return "#0044cc";
  }
}

export const majorsData: Record<string, MajorDetail> = {
  rpl: {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    alias: "PPLG",
    subtitle: "Pengembangan Perangkat Lunak dan Gim",
    tagline: "Coding the Future, Building Creative Solutions.",
    desc: "Program Keahlian Rekayasa Perangkat Lunak (PPLG) mendidik talenta muda menjadi Software Engineer kelas dunia. Kurikulum kami diselaraskan dengan standar industri teknologi, melatih siswa menguasai Fullstack Web Development, Mobile Applications, Cloud Systems, Game Programming, dan AI.",
    color: "from-blue-600 to-indigo-600",
    accentColor: "#0066ff",
    bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
    textAccent: "text-blue-600 dark:text-blue-400",
    glowColor: "rgba(0,102,255,0.15)",
    logo: "/assets/jurusan/pplg.png",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "Modern Web Programming", desc: "HTML5, CSS3, ES6+ JavaScript, TailwindCSS, React.js, Next.js, Node.js, RESTful API." },
      { subject: "Mobile App Development", desc: "Kotlin Native Android Development, Cross-Platform Flutter, iOS Swift." },
      { subject: "Databases & Cloud Engineering", desc: "Relational Database PostgreSQL, AWS Cloud Foundations, Firebase, Supabase." },
      { subject: "Game Development", desc: "Unity 3D Engine, C# Scripting, Game Physics, 2D/3D Assets Integration." },
      { subject: "DevOps & Collaboration Tools", desc: "Version Control Git/GitHub, CI/CD Pipeline, Docker Containerization, Linux server administration." }
    ],
    careers: [
      { title: "Fullstack Web Developer", desc: "Merancang dan membangun arsitektur frontend dan backend aplikasi web modern." },
      { title: "Mobile Application Developer", desc: "Mengembangkan aplikasi mobile berkinerja tinggi untuk iOS dan Android." },
      { title: "Game Programmer", desc: "Menulis kode logika interaktif, AI musuh, dan fisika game menggunakan engine Unity." },
      { title: "Cloud Integration Specialist", desc: "Mengelola arsitektur server awan yang aman, andal, dan skalabel dengan AWS." }
    ],
    facilities: [
      "iMac Core-i9 Software Developer Lab",
      "ASUS ROG Game & Production Lab",
      "Smart Interactive Classroom (Smartboard Integrated)",
      "AWS Cloud Academy Learning Station",
      "Google Developer Partner Studio Lab"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop", caption: "Sesi Kolaborasi UI/UX & Coding Project" },
      { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop", caption: "Peer Programming Workshop Siswa RPL" },
      { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop", caption: "Praktik Penulisan Kode Algoritma Kompleks" },
      { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop", caption: "Presentasi Pitching Project Akhir Semester" }
    ],
    partners: "Amazon Web Services (AWS) Academy, Google Developer Partner, Dicoding Academy, Oracle Academy"
  },
  tjkt: {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    alias: "TJKT",
    subtitle: "Cyber Security & Network Infrastructure",
    tagline: "Connecting the World, Securing Digital Assets.",
    desc: "Program Keahlian TJKT membekali siswa dengan kompetensi tinggi untuk merancang, mengonfigurasi, dan mengamankan jaringan komputer skala korporat. Melalui kemitraan industri, lulusan dilatih menguasai administrasi server, pertahanan cyber, serat optik, serta teknologi virtualisasi cloud.",
    color: "from-sky-500 to-blue-500",
    accentColor: "#0ea5e9",
    bgAccent: "bg-sky-500/10 dark:bg-sky-500/20",
    textAccent: "text-sky-600 dark:text-sky-400",
    glowColor: "rgba(14,165,233,0.15)",
    logo: "/assets/jurusan/tjkt.png",
    banner: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "Enterprise Network Design", desc: "Kurikulum CISCO CCNA & MikroTik MTCNA, routing, switching, VLAN, OSPF." },
      { subject: "Cyber Security & Defense", desc: "Firewall configuration, network penetration testing, digital forensics, IDS/IPS." },
      { subject: "Server Administration", desc: "Linux Server setup, Active Directory, Web/Mail server, Docker & virtualization." },
      { subject: "Telecommunication Fiber Optic", desc: "Fusion splicing serat optik, Optical Time Domain Reflectometer (OTDR), FTTH planning." },
      { subject: "Cloud Infrastructure Networking", desc: "Amazon Web Services VPC, Virtual Private Cloud Networking, virtual routers." }
    ],
    careers: [
      { title: "Network Engineer", desc: "Merancang, memasang, dan memelihara sistem jaringan korporasi multi-lokasi." },
      { title: "Cybersecurity Analyst", desc: "Melindungi aset data digital perusahaan dari ancaman hacker dan intrusi jaringan." },
      { title: "System Administrator", desc: "Menjamin kestabilan, performa, dan pencadangan data otomatis di server perusahaan." },
      { title: "Fiber Optic Specialist", desc: "Menginstalasi dan menyambung infrastruktur kabel serat optik kecepatan tinggi." }
    ],
    facilities: [
      "CISCO Academy Network Design Lab",
      "Mikrotik Academy Certified Lab",
      "Cyber Security Operations Center (CSOC) Lab",
      "FTTH & Fiber Optic Splicing Lab",
      "Virtualization & Private Cloud Server Sandbox"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop", caption: "Perawatan Server & Switch di Rack Data Center" },
      { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop", caption: "Konfigurasi Router & Debugging Jaringan" },
      { url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop", caption: "Penyambungan Kabel FO menggunakan Fusion Splicer" },
      { url: "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=600&auto=format&fit=crop", caption: "Simulasi Pertahanan Cyber & Ethical Hacking" }
    ],
    partners: "CISCO Networking Academy, Mikrotik Academy, Fortinet Academy, AWS Academy Partner"
  },
  dkv: {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    alias: "DKV",
    subtitle: "Creative Design & UI/UX Experience",
    tagline: "Visualizing Brilliant Ideas, Empowering Global Brands.",
    desc: "Program Keahlian DKV mendidik siswa menjadi kreator visual profesional yang mampu bersaing di industri kreatif. Siswa dibekali kemampuan UI/UX website/application design, ilustrasi digital modern, videografi & fotografi komersial, corporate branding, serta media penerbitan digital.",
    color: "from-indigo-500 to-purple-600",
    accentColor: "#6366f1",
    bgAccent: "bg-indigo-500/10 dark:bg-indigo-500/20",
    textAccent: "text-indigo-600 dark:text-indigo-400",
    glowColor: "rgba(99,102,241,0.15)",
    logo: "/assets/jurusan/dkv.png",
    banner: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "UI/UX & Web Interaction", desc: "Design system Figma, low/high-fidelity wireframes, interactive prototyping, user flow." },
      { subject: "Digital Illustration & Painting", desc: "Seni ilustrasi karakter, digital painting, raster graphics menggunakan tablet Wacom." },
      { subject: "Studio Commercial Photography", desc: "Penguasaan teknik kamera DSLR, lighting studio, product shoot, portraiture." },
      { subject: "Corporate Branding & Identity", desc: "Pembuatan logo, buku panduan visual brand (brand book), packaging, merchandise." },
      { subject: "Creative Layout & Publishing", desc: "Layout majalah digital, media publikasi interaktif dengan Adobe Creative Suite." }
    ],
    careers: [
      { title: "UI/UX Designer", desc: "Merancang pengalaman pengguna dan tampilan visual aplikasi agar mudah dan indah." },
      { title: "Graphic Designer", desc: "Membuat konsep dan eksekusi visual promosi, brosur, media sosial, dan materi cetak." },
      { title: "Brand Identity Specialist", desc: "Membangun sistem identitas visual yang khas dan kuat untuk klien bisnis global." },
      { title: "Commercial Photographer", desc: "Mengambil gambar produk bernilai tinggi untuk katalog e-commerce dan periklanan." }
    ],
    facilities: [
      "Wacom Creative Illustration Lab",
      "Professional Photography & Studio Lighting Room",
      "UI/UX Prototyping Sandbox Lab",
      "Adobe Certified Professional Lab",
      "Large-Format Digital Printing Center"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=600&auto=format&fit=crop", caption: "Kolaborasi Pembuatan Wireframe di Figma" },
      { url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop", caption: "Praktik Menggambar Karakter dengan Wacom Tablet" },
      { url: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop", caption: "Seni Pengambilan Gambar Produk Komersial" },
      { url: "https://images.unsplash.com/photo-1534972195531-d756b9bda9f2?q=80&w=600&auto=format&fit=crop", caption: "Penyuntingan Aset Visual & Layout Kreatif" }
    ],
    partners: "Adobe Certified Professional Partner, Dentsu Creative, Dicoding Academy UI/UX Partner"
  },
  bc: {
    code: "BC",
    title: "Broadcasting & Perfilman",
    alias: "BC",
    subtitle: "Creative Cinema & Media Production",
    tagline: "Inspiring Stories, Crafting Moving Moments.",
    desc: "Program Keahlian Broadcasting & Perfilman mendidik sineas dan praktisi penyiaran televisi/radio masa depan. Menggunakan peralatan berstandar penyiaran nasional, siswa diajarkan penulisan naskah skenario, penyutradaraan film, tata kamera sinematik, editing video profesional, tata cahaya, serta produksi siaran langsung.",
    color: "from-amber-500 to-orange-600",
    accentColor: "#f59e0b",
    bgAccent: "bg-amber-500/10 dark:bg-amber-500/20",
    textAccent: "text-amber-600 dark:text-amber-400",
    glowColor: "rgba(245,158,11,0.15)",
    logo: "/assets/jurusan/bc.png",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "Creative Writing & Directing", desc: "Storytelling, scriptwriting, storyboard creation, shot analysis, blocking." },
      { subject: "Cinematography & Audio Gear", desc: "Kamera video profesional, manual focus, 3-point lighting setup, condenser mic." },
      { subject: "Non-Linear Video Editing (NLE)", desc: "Adobe Premiere Pro, DaVinci Resolve color grading, audio synchronization." },
      { subject: "Live Multi-Camera Production", desc: "Vision mixer switcher, intercom communication, studio floor management." },
      { subject: "Broadcasting Laws & Ethics", desc: "Kode etik jurnalistik penyiaran, manajemen penyiaran digital OTT." }
    ],
    careers: [
      { title: "Film Director", desc: "Memimpin visi kreatif dalam produksi film fiksi, dokumenter, dan iklan televisi." },
      { title: "Professional Video Editor", desc: "Merangkai footage menjadi narasi visual utuh dengan visual effects dan audio mixing." },
      { title: "Director of Photography (DoP)", desc: "Mengatur tata kamera dan tata cahaya untuk menghasilkan estetika sinematik." },
      { title: "Broadcast Program Producer", desc: "Mengelola jalannya produksi acara televisi atau konten media digital komersial." }
    ],
    facilities: [
      "Professional TV Broadcast & Control Room Studio",
      "Chroma Key Green Screen Stage",
      "Cinema Editing & DaVinci Resolve Suite",
      "Acoustic Audio Recording & Podcasting Booth",
      "Broadcast Outdoor Live Streaming Van Rig"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop", caption: "Pengambilan Gambar Sinematik Outdoor" },
      { url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop", caption: "Live Switcher Operator di Studio Kontrol" },
      { url: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=600&auto=format&fit=crop", caption: "Sesi Color Grading Film Dokumenter" },
      { url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop", caption: "Produksi Podcast Audio Visual Berkualitas" }
    ],
    partners: "Blackmagic Design Certified, MNC Media Network, Netmediatama Academy"
  },
  animasi: {
    code: "ANIMASI",
    title: "Animasi",
    alias: "AN",
    subtitle: "2D/3D Animation & Visual Effects",
    tagline: "Breathing Life into Characters, Frame by Frame.",
    desc: "Program Keahlian Animasi mengasah daya imajinasi dan keterampilan teknis siswa dalam memproduksi karya animasi 2D dan 3D berstandar internasional. Menguasai software standar industri seperti Blender, Maya, dan Toon Boom, siswa diajarkan character rigging, 3D modeling, rendering, serta compositing VFX.",
    color: "from-pink-500 to-rose-600",
    accentColor: "#ec4899",
    bgAccent: "bg-pink-500/10 dark:bg-pink-500/20",
    textAccent: "text-pink-600 dark:text-pink-400",
    glowColor: "rgba(236,72,153,0.15)",
    logo: "/assets/jurusan/animasi.png",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "12 Principles of Animation", desc: "Timing, spacing, squash & stretch, anticipation, follow through, staging." },
      { subject: "2D Character Animation", desc: "Frame-by-frame animation, cut-out digital puppet rigging di Toon Boom Harmony." },
      { subject: "3D Asset Modeling & Texturing", desc: "Polygonal modeling, digital sculpting ZBrush, UV mapping, PBR texturing." },
      { subject: "3D Rigging & Keyframe Acting", desc: "Biped & quadruped skeletal skeleton rigging, blendshapes, facial expressions." },
      { subject: "Compositing & Visual Effects", desc: "Particle simulation, dynamic lighting, multipass rendering, After Effects compositing." }
    ],
    careers: [
      { title: "3D Character Animator", desc: "Menggerakkan karakter 3D dengan akting ekspresif untuk film animasi dan game." },
      { title: "3D Hard Surface & Environment Modeler", desc: "Membangun model objek, kendaraan, dan latar belakang dunia 3D yang detail." },
      { title: "Concept & Storyboard Artist", desc: "Merancang visual awal karakter, prop, dan tata urutan adegan visual cerita." },
      { title: "VFX & Compositing Artist", desc: "Menggabungkan efek visual digital dengan live-action footage secara realistis." }
    ],
    facilities: [
      "iMac Core-i9 3D Render Farm Lab",
      "Wacom Cintiq Pro Interactive Drawing Room",
      "Stop Motion Animation Studio",
      "Motion Capture Suit (MoCap) Sandbox",
      "Surround Sound Audio Mixing & Dubbing Room"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", caption: "Digital Sculpting Karakter 3D di ZBrush" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop", caption: "Keyframe Animation di Blender Viewport" },
      { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop", caption: "Visual Concept Art & Storyboard Planning" },
      { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop", caption: "Sesi Review Animatic Bersama Pengajar Industri" }
    ],
    partners: "The Monk Studios Partner, Infinite Frameworks Batam, Toon Boom Certified Trainer"
  },
  te: {
    code: "TE",
    title: "Teknik Elektronika",
    alias: "TE",
    subtitle: "Robotics & Industrial Automation",
    tagline: "Engineering Smart Hardware, Automating the Modern World.",
    desc: "Program Keahlian Teknik Elektronika mendidik teknisi handal di bidang mikrokontroler, Internet of Things (IoT), PLC, dan robotika industri. Siswa dilatih merancang skema PCB, pemrograman embedded C/C++, instalasi sensor pintar cerdas, serta otomatisasi mesin pabrik modern.",
    color: "from-emerald-500 to-teal-600",
    accentColor: "#10b981",
    bgAccent: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    glowColor: "rgba(16,185,129,0.15)",
    logo: "/assets/jurusan/te.png",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    syllabus: [
      { subject: "Electronic Circuit & PCB Design", desc: "Altium Designer, Eagle PCB, perancangan skematik, chemical etching, SMD soldering." },
      { subject: "Microcontroller & Embedded C", desc: "Arduino, ESP32, STM32, interfacing sensor analog/digital, PWM control." },
      { subject: "Internet of Things (IoT) Architecture", desc: "MQTT protocol, Node-RED, dashboard monitoring cloud, REST API hardware." },
      { subject: "Industrial PLC & SCADA", desc: "Omron & Siemens PLC programming, ladder diagram, Human-Machine Interface (HMI)." },
      { subject: "Applied Robotics Systems", desc: "Kinematika lengan robot, sensor ultrasonik/LiDAR, motor servo/stepper precision." }
    ],
    careers: [
      { title: "IoT Hardware Engineer", desc: "Merancang perangkat keras pintar terhubung internet untuk smart home dan smart city." },
      { title: "Industrial Automation Programmer", desc: "Memprogram sistem kendali PLC untuk otomasi lini perakitan pabrik manufaktur." },
      { title: "Robotics Technician", desc: "Merakit, memprogram, dan memelihara unit robot cerdas di sektor industri." },
      { title: "PCB Design Specialist", desc: "Merancang tata letak sirkuit cetak multi-layer yang efisien dan minim noise." }
    ],
    facilities: [
      "Industrial Robotics & PLC Automation Lab",
      "IoT Smart Hardware Prototype Sandbox",
      "PCB Rapid Prototyping & CNC Milling Lab",
      "Precision Micro-Soldering Station",
      "Microcontroller & Embedded Systems Lab"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop", caption: "Perakitan Sirkuit Elektronika Presisi" },
      { url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop", caption: "Pemrograman PLC Omron untuk Simulasi Pabrik" },
      { url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=600&auto=format&fit=crop", caption: "Pengujian Modul IoT Terhubung Server Cloud" },
      { url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop", caption: "Uji Coba Lengan Robotik Cerdas 6-Axis" }
    ],
    partners: "Omron Automation Partner, Schneider Electric Academy, Indobot Academy"
  }
};
