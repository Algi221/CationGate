import { Hono } from 'hono';

const chatbotRouter = new Hono();

const SYSTEM_INSTRUCTION = `
Anda adalah "Catpeer", asisten AI resmi dari platform CationGate (Sistem Penerimaan Peserta Didik Baru / SPMB Multi-Tenant Berbasis Cloud di Indonesia).

Tugas Anda:
Menjelaskan seluruh fitur, manfaat, dan alur sistem CationGate kepada pengunjung website (calon siswa, orang tua, panitia PPDB, kepala sekolah, dan staf tata usaha) dengan bahasa Indonesia yang jelas, profesional, sopan, dan terstruktur.

ATURAN PALING UTAMA DAN MUTLAK:
- DILARANG KERAS MENGGUNAKAN EMOJI APAPUN DALAM SELURUH JAWABAN ANDA.
- Berikan respon dengan teks bersih, profesional, dan rapi tanpa emotikon, karakter dekoratif, atau emoji.
- Jangan membuat informasi palsu atau menjanjikan fitur yang tidak ada di CationGate.
- Kalau lu menjawab pertanyaan user, lu harus akhiri jawaban lu dengan miaw
- Selalu perkenalkan diri sebagai "Catpeer" jika ditanya nama.

Pengetahuan Mendalam CationGate:
1. Tentang CationGate:
   - Platform SaaS (Software as a Service) Multi-Tenant berbasis Cloud untuk mendigitalisasi proses PPDB/SPMB bagi sekolah jenjang SMK (hanya SMK) di seluruh Indonesia.
   - Memudahkan sekolah dalam mengelola pendaftaran siswa baru.
   - Paket nya ada 2 :  yaitu Free Trial dan Paket Berlangganan Tahunan, bayar paketnyaa pake paymentgateawayy, bayarnya habis verifikasi nanti muncull popup pilih paket.
   - hanya menyediakan pembayaran va, bank, tunai untuk pembayaran formulir sekolahnya
   - Calon siswa tetap mengumpulkann kertasss fisikk karena dibutuhkan oleh sekolah
   - sekolah bisa mengaturrr dan mengeditt sendriii tentang sekolahnyaa jadi dinamis

2. Alur 5 Langkah Implementasi Sekolah (System Flow):
   - Langkah 01 (Registrasi SaaS): Sekolah mendaftar di halaman /daftar, mengisi data instansi, admin, dan klaim subdomain setelah verifikasi kode otp dari gmail (contoh subdomain: cationgate.site/smktb).
   - Langkah 02 (Verifikasi Dokumen): Verifikasi legalitas instansi (NPSN dan izin operasional) untuk mengaktifkan akun resmi (hal ini admin cationgatee memvalidasinya dengan mengecek platform dapodik apakah benar ada sekolah yang didaftarkan).
   - Langkah 03 ( Menunggu admin memverifikasi tidak lama paling dalam waktu 1-2 Jam (tergantung antrian) jika sudahh lanjut ketahap berikut)
   - Langkah 04 (Pilih dan Bayar Paket): Memilih paket layanan (tersedia Free Trial maupun paket berlangganan tahunan).
   - Langkah 04 (Kelola Gelombang dan Kuota): Panitia membuka gelombang pendaftaran, mengatur kuota jurusan, dan syarat nilai rapor.
   - Langkah 05 (Kustomisasi UI dan Branding): Sekolah dapat menyesuaikan logo, warna identitas sekolah, serta komponen formulir pendaftaran.

3. Alur Pendaftaran Calon Siswa (Di HP / Laptop):
   - Calon siswa mengakses portal mandiri sekolah masing-masing via smartphone atau laptop ( membuka url yang diberikan oleh sekolah atau dipromosikan ).
   - Mengisi formulir multi-tahap (Biodata, Nilai Rapor, NISN, NIK, Data Orang Tua) dengan validasi otomatis.
   - Mengumpulkan berkas fisik yang diminta kesekolah (karena dibutuhkan oleh sekolah).
   - Pembayaran Biaya Formulir: CationGate memfasilitasi pembayaran khusus biaya formulir / pendaftaran via Transfer Virtual Account (VA) Bank dan Opsi Pembayaran Tunai Langsung di Loket TU Sekolah yang tercatat di dashboard.
   - Memantau pengumuman kelulusan berkas dan hasil seleksi secara online dan transparan real time dilanding pagee sekolah .

4. Fitur Unggulan Dashboard Admin Sekolah:
   - Manajemen dan filter status calon siswa secara real-time.
   - Fitur To-Do List verifikasi berkas untuk mempermudah pengecekan dokumen yang kurang.
   - Ekspor data 1-klik yang sudah terstandarisasi dan siap diimpor langsung ke format aplikasi Dapodik Kemdikbud.
   - Rekap statistik pendaftar per jurusan / jalur pendaftaran.

Aturan Format:
- Jawab secara ringkas, informatif, dan terstruktur (gunakan bullet list bila perlu).
- Jawab selalu dalam Bahasa Indonesia.
- Jangan membuat informasi palsu atau menjanjikan fitur yang tidak ada di CationGate.
- Ingat: Tanpa emoji sama sekali.
`;

chatbotRouter.post('/', async (c) => {
  let userMessage = '';
  try {
    const body = await c.req.json();
    userMessage = body.message?.trim() || '';
    const history = Array.isArray(body.history) ? body.history : [];

    if (!userMessage) {
      return c.json({ success: false, message: 'Pesan tidak boleh kosong.' }, 400);
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      // Fallback response engine if API key is not yet configured
      const fallbackReply = generateFallbackResponse(userMessage);
      return c.json({
        success: true,
        reply: fallbackReply,
        source: 'local_knowledge'
      });
    }

    // Format messages for Google Gemini API
    const contents: any[] = [];

    // Add conversation history if present
    for (const h of history.slice(-6)) {
      if (h.role && h.text) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const geminiPayload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };

    // Try Gemini 1.5 Flash first, with fallback to gemini-2.0-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API Error:', errText);
      // Fallback on Gemini error
      return c.json({
        success: true,
        reply: generateFallbackResponse(userMessage),
        source: 'local_fallback'
      });
    }

    const data = await response.json();
    let aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      return c.json({
        success: true,
        reply: generateFallbackResponse(userMessage),
        source: 'local_fallback'
      });
    }

    // Strip any unexpected emojis from reply to enforce strict rule
    aiReply = aiReply.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, '');

    return c.json({
      success: true,
      reply: aiReply.trim(),
      source: 'gemini'
    });

  } catch (error: any) {
    console.error('Chatbot API Exception:', error?.message);
    return c.json({
      success: true,
      reply: generateFallbackResponse(userMessage || ""),
      source: 'error_fallback'
    });
  }
});

function generateFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('apa itu') || q.includes('cationgate') || q.includes('tentang')) {
    return "CationGate adalah platform SaaS Cloud Multi-Tenant yang dirancang khusus untuk mendigitalisasi proses PPDB/SPMB bagi sekolah jenjang SMK di seluruh Indonesia.\n\nDengan CationGate, sekolah dapat mengelola pendaftaran secara mandiri dengan subdomain khusus (contoh: cationgate.site/sekolah-anda), memfasilitasi pembayaran formulir via Virtual Account Bank maupun Tunai di sekolah, serta mengatur data sekolah secara dinamis. miaw";
  }

  if (q.includes('bayar') || q.includes('biaya') || q.includes('pembayaran') || q.includes('va')) {
    return "Sistem Pembayaran di CationGate:\n\nCationGate menyediakan layanan pembayaran khusus untuk biaya formulir pendaftaran sekolah:\n1. Transfer Virtual Account (VA) Bank.\n2. Pembayaran Tunai langsung di loket TU sekolah yang dicatat langsung di dashboard. miaw";
  }

  if (q.includes('alur') || q.includes('cara kerja') || q.includes('flow') || q.includes('daftar')) {
    return "Alur Pendaftaran dan Penggunaan CationGate:\n\n1. Registrasi SaaS Sekolah: Daftarkan sekolah di menu /daftar, isi data, dan klaim subdomain setelah verifikasi OTP dari Gmail.\n2. Verifikasi Dokumen: Admin CationGate memvalidasi NPSN dan izin operasional via Dapodik dalam waktu 1-2 jam.\n3. Pilih Paket & Pengaturan: Pilih paket langganan, atur gelombang kuota, dan sesuaikan UI branding sekolah.\n4. Pendaftaran Calon Siswa: Calon siswa mengisi formulir mandiri via HP/laptop dan mengumpulkan berkas fisik yang dibutuhkan ke sekolah.\n5. Hasil & Pengumuman: Pantau status verifikasi berkas dan pengumuman seleksi secara real-time di portal sekolah. miaw";
  }

  if (q.includes('dapodik') || q.includes('excel') || q.includes('ekspor')) {
    return "Integrasi Dapodik Kemdikbud:\n\nSeluruh data calon siswa yang terdaftar di CationGate dapat diekspor hanya dengan 1-Klik ke format Excel yang disesuaikan dengan struktur impor aplikasi Dapodik Kemdikbud. Panitia tidak perlu lagi mengetik manual satu per satu. miaw";
  }

  return "Halo! Saya Catpeer, asisten cerdas CationGate. Saya siap membantu menjawab seputar:\n- Cara mendaftarkan sekolah SMK di CationGate\n- Alur pendaftaran siswa mandiri via smartphone\n- Metode pembayaran biaya formulir (VA Bank dan Tunai)\n- Fitur dashboard dan ekspor data ke Dapodik\n\nAda yang ingin Anda tanyakan lebih lanjut? miaw";
}

export default chatbotRouter;
