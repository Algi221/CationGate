import React from "react";

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string[];
  author: string;
  authorRole: string;
  authorBio: string;
  authorImg: string;
  excerpt: string;
  image: string;
  content: React.ReactNode;
}

export const blogPosts: BlogPost[] = [
  {
    id: "startup-taruna-bhakti",
    title:
      "4 Siswa SMK Taruna Bhakti Mengembangkan Start Up Digital CationGate",
    date: "13 Agustus 2026",
    readTime: "5 min read",
    category: ["Inovasi", "Kisah Sukses"],
    author: "Admin CationGate",
    authorRole: "Editor in Chief",
    authorBio:
      "Tim redaksi CationGate yang berdedikasi meliput perkembangan teknologi pendidikan dan karya-karya inovatif dari siswa vokasi di seluruh Indonesia.",
    authorImg:
      "https://ui-avatars.com/api/?name=Admin+CG&background=18181b&color=fff",
    excerpt:
      "Berawal dari tugas sekolah, empat siswa SMK Taruna Bhakti berhasil merancang ekosistem digital yang menghubungkan manajemen sekolah dalam satu pintu.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600",
    content: (
      <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
        <p>
          Inovasi teknologi tidak hanya lahir dari perusahaan raksasa, tetapi
          juga dari ruang kelas. Empat developer muda SMK Taruna Bhakti, yakni
          Ahmad Faishal Majdii, Farel Al Fatir Fauzan, Hafiz Alviansyah, dan
          Satria Arief Wibowo, membuktikan hal tersebut dengan membangun
          ekosistem digital CationGate.
        </p>
        <p>
          Mereka mengawali perjalanan dari proyek e-commerce hingga akhirnya
          menyadari adanya kebutuhan mendesak di sektor pendidikan. Proses
          manajemen sekolah dan pendaftaran siswa baru yang masih manual
          memicu mereka untuk menciptakan solusi terintegrasi.
        </p>
        <blockquote className="border-l-[3px] border-zinc-900 pl-6 py-2 my-10 text-xl md:text-2xl font-medium text-zinc-900 italic tracking-tight">
          &quot;Kami ingin membuktikan bahwa siswa SMK tidak hanya bisa menjadi
          pengguna teknologi, tetapi juga pencipta solusi nyata yang bisa
          dipakai institusi secara luas.&quot;
        </blockquote>
        <p>
          Dengan pembagian tugas yang jelas dalam pengembangan{" "}
          <i className="font-sans">front-end</i> menggunakan Next.js dan{" "}
          <i className="font-sans">back-end</i> yang kokoh, tim ini sukses
          merancang antarmuka yang modern, cepat, dan responsif untuk berbagai
          kebutuhan sekolah.
        </p>
      </div>
    ),
  },
  {
    id: "digitalisasi-perpustakaan",
    title:
      "Transformasi Digital: Mengubah Wajah Perpustakaan SMK Menjadi Sistem Modern",
    date: "10 Agustus 2026",
    readTime: "4 min read",
    category: ["Edukasi", "Studi Kasus"],
    author: "Tech Contributor",
    authorRole: "System Analyst",
    authorBio:
      "Menganalisis dan merancang alur sistem informasi yang efektif untuk berbagai kebutuhan institusi pendidikan.",
    authorImg:
      "https://ui-avatars.com/api/?name=Tech+C&background=18181b&color=fff",
    excerpt:
      "Meninggalkan pencatatan manual, implementasi sistem perpustakaan digital terbukti mempercepat sirkulasi buku dan manajemen data.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600",
    content: (
      <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
        <p>
          Salah satu tonggak awal dari digitalisasi sekolah adalah modernisasi
          perpustakaan. Menggunakan metodologi Agile, peralihan dari
          pencatatan buku besar manual ke sistem digital membuahkan hasil yang
          signifikan.
        </p>
        <p>
          Dengan dukungan dan arahan mentor teknis untuk implementasi web
          serta struktur logika algoritma, sistem ini dirancang agar mudah
          digunakan oleh pustakawan maupun siswa.
        </p>
        <p>
          Proyek ini menjadi batu loncatan penting dalam memahami alur basis
          data relasional kompleks yang kemudian diadaptasi ke skala yang
          lebih besar di sistem SPMB.
        </p>
      </div>
    ),
  },
  {
    id: "mobile-learning-tracker",
    title:
      "Inovasi 'Strava untuk Siswa': Memantau Progres Belajar Lewat Aplikasi Mobile",
    date: "08 Agustus 2026",
    readTime: "6 min read",
    category: ["Fitur", "Inovasi"],
    author: "Mobile Dev Team",
    authorRole: "App Developer",
    authorBio:
      "Fokus pada pengembangan aplikasi mobile cross-platform yang interaktif dan berkinerja tinggi.",
    authorImg:
      "https://ui-avatars.com/api/?name=Mobile+Dev&background=18181b&color=fff",
    excerpt:
      "Konsep unik menggabungkan timer belajar, bukti upload, dan global feed layaknya media sosial kebugaran untuk memotivasi siswa.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1600",
    content: (
      <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
        <p>
          Bagaimana jika kita bisa melacak jam belajar sama seperti kita
          melacak jarak lari? Itulah konsep di balik Mobile Learning Tracker
          yang sedang dikembangkan.
        </p>
        <p>
          Dibangun dengan memanfaatkan kapabilitas React Native dan sistem
          backend dari Supabase, aplikasi ini memungkinkan siswa mengaktifkan
          timer belajar, mengunggah foto bukti (proof-of-study), dan melihat
          aktivitas belajar teman-teman mereka dalam sebuah global feed.
        </p>
        <h3 className="text-2xl font-sans font-bold text-zinc-900 mt-10 mb-4 tracking-tight">
          Membangun Ekosistem yang Sehat
        </h3>
        <p>
          Gamifikasi ini terbukti mampu meningkatkan retensi dan motivasi
          belajar mandiri. Fitur ini rencananya akan diintegrasikan sebagai
          nilai tambah bagi sekolah-sekolah yang menggunakan ekosistem
          CationGate.
        </p>
      </div>
    ),
  },
  {
    id: "lumeria-ke-edtech",
    title:
      "Dari E-Commerce Kuliner ke Ed-Tech: Kekuatan Kolaborasi Multidisiplin",
    date: "05 Agustus 2026",
    readTime: "5 min read",
    category: ["Kisah Sukses", "Edukasi"],
    author: "Project Manager",
    authorRole: "Product Lead",
    authorBio:
      "Mengorkestrasi kerja sama tim dari berbagai disiplin ilmu untuk menciptakan produk digital yang berdampak.",
    authorImg:
      "https://ui-avatars.com/api/?name=Project+M&background=18181b&color=fff",
    excerpt:
      "Pengalaman membangun platform e-commerce sukses menjadi fondasi kuat tim dalam mengarsiteki sistem manajemen pendidikan CationGate.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600",
    content: (
      <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
        <p>
          Sebelum menyelami dunia teknologi pendidikan, fondasi engineering
          tim terbentuk dari proyek Lumeria—sebuah platform e-commerce
          terintegrasi untuk produk kuliner lokal.
        </p>
        <p>
          Keberhasilan Lumeria tak lepas dari kolaborasi luar biasa antara
          Developers, Cooks, dan Designers yang melibatkan banyak talenta
          muda.
        </p>
        <p>
          Pengalaman mengelola deployment, optimalisasi UI/UX, hingga
          menangani logika transaksi yang rumit inilah yang pada akhirnya
          dipinjam dan diimprovisasi ulang untuk membangun arsitektur
          CationGate yang andal.
        </p>
      </div>
    ),
  },
  {
    id: "fitur-ppdb",
    title: "Mengenal Fitur PPDB Terpadu CationGate untuk Tahun Ajaran Baru",
    date: "01 Agustus 2026",
    readTime: "4 min read",
    category: ["Fitur", "Panduan"],
    author: "Zac Hall",
    authorRole: "Product Manager",
    authorBio:
      "Fokus pada pengembangan pengalaman pengguna (UX) untuk produk-produk CationGate.",
    authorImg:
      "https://ui-avatars.com/api/?name=Zac+H&background=18181b&color=fff",
    excerpt:
      "Panduan lengkap menggunakan sistem PPDB CationGate untuk mengelola ribuan pendaftar dengan mudah, cepat, dan tanpa kendala server.",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1600",
    content: (
      <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
        <p>
          Sistem Penerimaan Peserta Didik Baru (PPDB) seringkali menjadi momen
          krusial yang menguras tenaga panitia sekolah. CationGate hadir
          dengan fitur dasbor pendaftar yang tersentralisasi.
        </p>
      </div>
    ),
  },
  {
    id: "pentingnya-digitalisasi",
    title: "Menyiapkan Infrastruktur Digital Sekolah di Era Modern",
    date: "28 Juli 2026",
    readTime: "3 min read",
    category: ["Opini"],
    author: "Ryan Christoffel",
    authorRole: "System Architect",
    authorBio:
      "Arsitek infrastruktur cloud yang memastikan keandalan server CationGate.",
    authorImg:
      "https://ui-avatars.com/api/?name=Ryan+C&background=18181b&color=fff",
    excerpt:
      "Bagaimana transformasi digital mengubah cara sekolah mengelola operasional sehari-hari dan meningkatkan kualitas pelayanan mutu pendidikan.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1600",
    content: (
      <div className="space-y-6 text-[17px] md:text-lg text-zinc-700 leading-[1.8] font-serif">
        <p>
          Dunia pendidikan kini berada di titik balik. Tuntutan untuk memiliki
          database yang aman, cepat diakses, dan transparan membuat solusi
          cloud menjadi sebuah keharusan mutlak bagi sekolah kejuruan modern.
        </p>
      </div>
    ),
  },
];

export const blogCategories: string[] = [
  "Semua",
  ...Array.from(new Set(blogPosts.flatMap((p) => p.category))),
];
