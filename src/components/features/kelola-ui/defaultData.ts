import { AlurItem, FaqItem, MajorItem, PartnerItem, FieldConfigItem } from "./types";

export const DEFAULT_PARTNERS: PartnerItem[] = [
  { id: 1, name: "TOA", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/PT-TOA.png", url: "https://toa.co.id/", h: "h-8" },
  { id: 2, name: "Biznet", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/biznet_vertical_logo.png", url: "https://www.biznetnetworks.com/", h: "h-20" },
  { id: 3, name: "Icon+", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/56e83c6db8cd5587e87161281dfba75b.webp", url: "https://plniconplus.co.id/", h: "h-14" },
  { id: 4, name: "MD Animation", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Logo_md_animation.png", url: "https://mdentertainment.com/", h: "h-8" },
  { id: 5, name: "Hompimpa Animworks", logo: "https://www.google.com/s2/favicons?domain=hompimpa.co.id&sz=256", url: "https://hompimpa.co.id/", h: "h-12" },
  { id: 6, name: "Monsterdata", logo: "https://www.google.com/s2/favicons?domain=monsterdata.asia&sz=256", url: "https://monsterdata.asia/?utm_source=chatgpt.com", h: "h-12" },
  { id: 7, name: "Ciptadrasoft", logo: "https://www.google.com/s2/favicons?domain=citcom.id&sz=256", url: "https://citcom.id/", h: "h-12" },
  { id: 8, name: "Assemblr", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/6156e76e275fa19ed9a33fa3_Group-33959.png", url: "https://assemblrworld.com/", h: "h-20" },
  { id: 9, name: "Daun Biru Engineering", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/E-Learning-5.png", url: "https://daunbiru.co.id/", h: "h-12" },
  { id: 10, name: "Citra Film School", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/cropped-Logo-baru-citra.png", url: "https://citrafilmschool.net/", h: "h-20" },
  { id: 11, name: "Prasimax", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/Prasimax_Logo.png", url: "https://prasimax.com/", h: "h-10" },
  { id: 12, name: "Panasonic", logo: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/11/8225.png", url: "https://www.panasonic.com/id/", h: "h-8" },
  { id: 13, name: "LUWES INOVASI MANDIRI", logo: "https://luwesinovasimandiri.com/_astro/logo.DBn-6O1s.webp", url: "https://luwesinovasimandiri.com/", h: "h-12" },
  { id: 14, name: "PUDAK SCIENTIFIC", logo: "https://www.google.com/s2/favicons?domain=pudak-scientific.com&sz=256", url: "https://www.pudak-scientific.com/", h: "h-12" },
  { id: 15, name: "Pupuk Kujang Cikampek", logo: "https://www.google.com/s2/favicons?domain=pupuk-kujang.co.id&sz=256", url: "https://www.pupuk-kujang.co.id/", h: "h-12" },
  { id: 16, name: "Rasil AM 720", logo: "https://www.google.com/s2/favicons?domain=radiosilaturahim.com&sz=256", url: "https://www.radiosilaturahim.com/", h: "h-12" },
  { id: 17, name: "Beyond Films", logo: "https://www.google.com/s2/favicons?domain=beyondfilms.co.id&sz=256", url: "http://www.beyondfilms.co.id", h: "h-12" },
  { id: 18, name: "POSTPLAY", logo: "https://www.google.com/s2/favicons?domain=linktr.ee&sz=256", url: "https://linktr.ee/postplayindonesia?utm_source=chatgpt.com", h: "h-12" },
  { id: 19, name: "VISI 8", logo: "https://www.google.com/s2/favicons?domain=visi8.com&sz=256", url: "https://visi8.com/", h: "h-12" },
  { id: 20, name: "MEMENTO", logo: "https://www.google.com/s2/favicons?domain=mementoworks.id&sz=256", url: "https://mementoworks.id", h: "h-12" },
  { id: 21, name: "SKYNET", logo: "https://www.google.com/s2/favicons?domain=sky.net.id&sz=256", url: "https://sky.net.id/?utm_source=chatgpt.com", h: "h-12" },
  { id: 22, name: "Museum Nasional Indonesia", logo: "https://www.google.com/s2/favicons?domain=museumnasional.or.id&sz=256", url: "https://www.museumnasional.or.id/", h: "h-12" },
  { id: 23, name: "ANIMO", logo: "https://www.google.com/s2/favicons?domain=fiverr.com&sz=256", url: "https://www.fiverr.com/animo_studio?utm_source=chatgpt.com", h: "h-12" },
  { id: 24, name: "PIONICON", logo: "/partners/pionicon.jpg", url: "https://pionicon.com/", h: "h-12" },
  { id: 25, name: "Circle Logo", logo: "https://www.google.com/s2/favicons?domain=seamolec.org&sz=256", url: "https://seamolec.org/", h: "h-12" },
  { id: 26, name: "mvnet", logo: "https://www.google.com/s2/favicons?domain=mvnet.co.id&sz=256", url: "https://mvnet.co.id/", h: "h-12" },
  { id: 27, name: "SADA TECHNOLOGY", logo: "https://www.google.com/s2/favicons?domain=sada.id&sz=256", url: "https://sada.id/", h: "h-12" },
  { id: 28, name: "LIGHT CODE DIGITAL", logo: "https://www.google.com/s2/favicons?domain=lightcodedigital.com&sz=256", url: "https://lightcodedigital.com/", h: "h-12" },
];

export const formatRupiah = (value: string) => {
  if (!value) return "Rp ";
  const clean = value.replace(/[^0-9]/g, "");
  if (!clean) return "Rp ";
  const num = parseInt(clean, 10);
  return "Rp " + num.toLocaleString("id-ID");
};

export const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  let clean = value.replace(/[^\d+]/g, "");
  if (clean.startsWith("0")) {
    clean = "+62" + clean.slice(1);
  } else if (clean.startsWith("62")) {
    clean = "+" + clean;
  } else if (clean && !clean.startsWith("+62")) {
    if (clean.startsWith("+")) {
      clean = "+62" + clean.slice(1);
    } else {
      clean = "+62" + clean;
    }
  }
  return clean;
};

export const DEFAULT_ALUR: AlurItem[] = [
  { id: 1, title: "Pendaftaran Online", desc: "Calon peserta didik mendaftar secara online melalui website sekolah dan mengisi data lengkap." },
  { id: 2, title: "Pembayaran Formulir", desc: "Melakukan pembayaran administrasi pendaftaran via Transfer Bank atau Payment Gateway." },
  { id: 3, title: "Verifikasi & Konfirmasi", desc: "Konfirmasi data pendaftaran otomatis via WhatsApp / Email." },
  { id: 4, title: "Pemberkasan & Seragam", desc: "Datang langsung ke sekolah untuk verifikasi berkas asli fisik dan ukur seragam siswa baru." },
  { id: 5, title: "Uji Kelayakan (Tes Seleksi)", desc: "Mengikuti serangkaian tes bakat minat, wawancara kepribadian, serta tes kesehatan/fisik dasar calon siswa." },
  { id: 6, title: "Pengumuman & Kelulusan", desc: "Pengumuman kelulusan resmi dan status penerimaan calon peserta didik baru." }
];

export const DEFAULT_FAQ: FaqItem[] = [
  {
    q: "Bagaimana cara melakukan pembayaran biaya pendaftaran?",
    a: "Pembayaran administrasi pendaftaran dapat diselesaikan melalui Transfer Bank Manual ke rekening resmi yayasan sekolah atau QRIS/Virtual Account. Setelah melakukan transfer, harap unggah bukti transfer di portal pendaftaran untuk divalidasi oleh panitia."
  },
  {
    q: "Apa saja berkas persyaratan fisik yang wajib dibawa ke sekolah?",
    a: "Calon peserta didik baru diimbau membawa berkas asli dan fotokopi berupa: 1) Kartu Keluarga (KK), 2) KTP Orang Tua (Ayah & Ibu), 3) Akta Kelahiran, 4) Ijazah SMP/sederajat atau Surat Keterangan Lulus (SKL) resmi dilegalisir, dan 5) Pas foto berwarna terbaru ukuran 3x4 sebanyak 3 lembar."
  },
  {
    q: "Apakah ada batasan kuota pendaftaran untuk masing-masing jurusan?",
    a: "Ya, setiap program kompetensi keahlian memiliki batas kuota tampung maksimal yang diselaraskan dengan ketersediaan fasilitas laboratorium praktikum. Pendaftaran untuk jurusan tertentu akan ditutup otomatis ketika kuota terpenuhi."
  },
  {
    q: "Apakah ada tes seleksi masuk?",
    a: "Ya, calon peserta didik baru akan mengikuti seleksi potensi akademik, tes minat bakat, serta wawancara kompetensi keahlian secara terjadwal setelah menyelesaikan pengisian formulir pendaftaran dan pembayaran biaya administrasi."
  }
];

export const DEFAULT_MAJORS: MajorItem[] = [
  {
    code: "RPL",
    title: "Rekayasa Perangkat Lunak",
    desc: "Belajar pemrograman web, aplikasi mobile, game development, cloud computing, serta kecerdasan buatan (AI) dengan teknologi mutakhir.",
    color: "#0066ff",
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
    logo: "/assets/jurusan/pplg.png",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop", caption: "Sesi Kolaborasi UI/UX & Coding Project" },
      { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop", caption: "Peer Programming Workshop Siswa RPL" }
    ]
  },
  {
    code: "TJKT",
    title: "Teknik Jaringan Komputer & Telekomunikasi",
    desc: "Fokus pada perancangan jaringan, administrasi server Linux & Windows, keamanan cyber, infrastruktur cloud, dan sertifikasi CISCO.",
    color: "#0ea5e9",
    careers: [
      { title: "Network Engineer", desc: "Merancang, memasang, dan memelihara sistem jaringan korporasi multi-lokasi." },
      { title: "Cybersecurity Analyst", desc: "Melindungi aset data digital perusahaan dari ancaman hacker dan intrusi jaringan." },
      { title: "System Administrator", desc: "Menjamin kestabilan, performa, dan pencadangan data otomatis di server perusahaan." }
    ],
    facilities: [
      "CISCO Academy Network Design Lab",
      "Mikrotik Academy Certified Lab",
      "Cyber Security Operations Center (CSOC) Lab"
    ],
    logo: "/assets/jurusan/tjkt.png",
    banner: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop", caption: "Perawatan Server & Switch di Rack Data Center" }
    ]
  },
  {
    code: "DKV",
    title: "Desain Komunikasi Visual",
    desc: "Ekspresikan kreativitas lewat UI/UX design, desain grafis, ilustrasi digital, videografi, fotografi komersil, serta branding korporat.",
    color: "#6366f1",
    careers: [
      { title: "UI/UX Designer", desc: "Merancang pengalaman pengguna dan tampilan visual aplikasi agar mudah dan indah." },
      { title: "Graphic Designer", desc: "Membuat konsep dan eksekusi visual promosi, brosur, media sosial, dan materi cetak." }
    ],
    facilities: [
      "Wacom Creative Illustration Lab",
      "Professional Photography & Studio Lighting Room"
    ],
    logo: "/assets/jurusan/dkv.png",
    banner: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1200&auto=format&fit=crop",
    video: "",
    gallery: [
      { url: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=600&auto=format&fit=crop", caption: "Kolaborasi Pembuatan Wireframe di Figma" }
    ]
  }
];

export const DEFAULT_FIELDS_CONFIG_UI: Record<string, FieldConfigItem> = {
  nama: { label: "Nama Lengkap", required: true, active: true },
  nisn: { label: "NISN", required: true, active: true },
  nik: { label: "NIK", required: true, active: true },
  tempatLahir: { label: "Tempat Lahir", required: true, active: true },
  tglLahir: { label: "Tanggal Lahir", required: true, active: true },
  jenisKelamin: { label: "Jenis Kelamin", required: true, active: true },
  agama: { label: "Agama", required: true, active: true },
  kewarganegaraan: { label: "Kewarganegaraan", required: true, active: true },
  alamat: { label: "Alamat Lengkap", required: true, active: true },
  rtRw: { label: "RT / RW", required: true, active: true },
  kelurahan: { label: "Kelurahan", required: true, active: true },
  kecamatan: { label: "Kecamatan", required: true, active: true },
  kodePos: { label: "Kode Pos", required: true, active: true },
  whatsapp: { label: "Nomor WhatsApp", required: true, active: true },
  email: { label: "Alamat Email", required: false, active: true },
  tinggalDengan: { label: "Tinggal Dengan", required: true, active: true },
  transportasi: { label: "Transportasi", required: true, active: true },
  tinggiBadan: { label: "Tinggi Badan (cm)", required: true, active: true },
  beratBadan: { label: "Berat Badan (kg)", required: true, active: true },
  golonganDarah: { label: "Golongan Darah", required: true, active: true },
  penyakitDiderita: { label: "Penyakit Diderita", required: false, active: true },
  kebutuhanKhusus: { label: "Berkebutuhan Khusus", required: false, active: true },
  jenisPrestasi: { label: "Jenis Prestasi", required: false, active: true },
  tingkatPrestasi: { label: "Tingkat Prestasi", required: false, active: true },
  uraianPrestasi: { label: "Uraian Prestasi", required: false, active: true },
  tahunPrestasi: { label: "Tahun Prestasi", required: false, active: true },
  penyelenggara: { label: "Penyelenggara Prestasi", required: false, active: true },
  berkasPrestasi: { label: "Berkas Prestasi", required: false, active: true },
  jenisBeasiswa: { label: "Jenis Beasiswa", required: false, active: true },
  uraianBeasiswa: { label: "Uraian Beasiswa", required: false, active: true },
  tahunMulaiBeasiswa: { label: "Tahun Mulai Beasiswa", required: false, active: true },
  tahunSelesaiBeasiswa: { label: "Tahun Selesai Beasiswa", required: false, active: true },
  sekolahAsal: { label: "Sekolah Asal (SMP/MTs)", required: true, active: true },
  tglLulus: { label: "Tanggal Lulus SMP", required: true, active: true },
  noIjazah: { label: "No. Seri Ijazah", required: false, active: true },
  noSKHUN: { label: "No. Seri SKHUN", required: false, active: true },
  noPesertaUN: { label: "No. Peserta UN", required: false, active: true },
  lamaBelajar: { label: "Lama Belajar (Tahun)", required: true, active: true },
  pindahanDari: { label: "Pindahan Dari", required: false, active: true },
  alasanPindah: { label: "Alasan Pindah", required: false, active: true },
  diterimaKelas: { label: "Diterima Kelas", required: true, active: true },
  jurusan1: { label: "Program Keahlian (Jurusan)", required: true, active: true },
  alasanMemilih: { label: "Alasan Memilih Jurusan", required: false, active: true },
  namaAyah: { label: "Nama Ayah", required: true, active: true },
  tempatLahirAyah: { label: "Tempat Lahir Ayah", required: true, active: true },
  tglLahirAyah: { label: "Tanggal Lahir Ayah", required: true, active: true },
  agamaAyah: { label: "Agama Ayah", required: true, active: true },
  kewarganegaraanAyah: { label: "Kewarganegaraan Ayah", required: true, active: true },
  pendidikanAyah: { label: "Pendidikan Ayah", required: true, active: true },
  pekerjaanAyah: { label: "Pekerjaan Ayah", required: true, active: true },
  penghasilanAyah: { label: "Penghasilan Ayah", required: true, active: true },
  alamatAyah: { label: "Alamat Lengkap Ayah", required: true, active: true },
  statusAyah: { label: "Status Ayah", required: true, active: true },
  namaIbu: { label: "Nama Ibu", required: true, active: true },
  tempatLahirIbu: { label: "Tempat Lahir Ibu", required: true, active: true },
  tglLahirIbu: { label: "Tanggal Lahir Ibu", required: true, active: true },
  agamaIbu: { label: "Agama Ibu", required: true, active: true },
  kewarganegaraanIbu: { label: "Kewarganegaraan Ibu", required: true, active: true },
  pendidikanIbu: { label: "Pendidikan Ibu", required: true, active: true },
  pekerjaanIbu: { label: "Pekerjaan Ibu", required: true, active: true },
  penghasilanIbu: { label: "Penghasilan Ibu", required: true, active: true },
  alamatIbu: { label: "Alamat Lengkap Ibu", required: true, active: true },
  statusIbu: { label: "Status Ibu", required: true, active: true },
  namaWali: { label: "Nama Wali", required: false, active: true },
  tempatLahirWali: { label: "Tempat Lahir Wali", required: false, active: true },
  tglLahirWali: { label: "Tanggal Lahir Wali", required: false, active: true },
  agamaWali: { label: "Agama Wali", required: false, active: true },
  kewarganegaraanWali: { label: "Kewarganegaraan Wali", required: false, active: true },
  pendidikanWali: { label: "Pendidikan Wali", required: false, active: true },
  pekerjaanWali: { label: "Pekerjaan Wali", required: false, active: true },
  penghasilanWali: { label: "Penghasilan Wali", required: false, active: true },
  alamatWali: { label: "Alamat Lengkap Wali", required: false, active: true },
  statusWali: { label: "Status Wali", required: false, active: true },
  teleponOrtu: { label: "Telepon Orang Tua", required: true, active: true },
  nilaiUSTeori: { label: "Nilai US Teori", required: false, active: true },
  nilaiUSPraktik: { label: "Nilai US Praktik", required: false, active: true },
  nilaiMuatanLokal: { label: "Nilai Muatan Lokal", required: false, active: true },
  citaCita: { label: "Cita-cita Utama", required: false, active: true },
  hobi: { label: "Hobi", required: false, active: true },
  pelajaranDisenangi: { label: "Pelajaran Disenangi", required: false, active: true },
  alasanDisenangi: { label: "Alasan Menyenangi Pelajaran", required: false, active: true },
  kesulitanBelajar: { label: "Kesulitan Belajar", required: false, active: true },
  citaCitaSetelahLulus: { label: "Rencana Setelah Lulus", required: false, active: true },
  punyaKPS: { label: "Status KPS", required: false, active: true },
  noKPS: { label: "Nomor KPS", required: false, active: true },
  punyaKIP: { label: "Status KIP", required: false, active: true },
  noKIP: { label: "Nomor KIP", required: false, active: true },
};
