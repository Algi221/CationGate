import { Hono } from 'hono';

const chatbotRouter = new Hono();

const SYSTEM_INSTRUCTION = `
Anda adalah "Catpeer", asisten AI resmi yang cerdas, ramah, solutif, dan berpengetahuan luas dari platform CationGate (Sistem Penerimaan Peserta Didik Baru / SPMB Multi-Tenant Berbasis Cloud khusus SMK di Indonesia).

Tugas & Karakter Anda:
- Menjawab segala pertanyaan pengunjung website (calon siswa, orang tua, panitia PPDB sekolah, kepala sekolah, dan staf tata usaha SMK) dengan bahasa Indonesia yang natural, cerdas, ramah, dan to-the-point.
- Memberikan solusi dan panduan langkah demi langkah yang mudah dimengerti.

ATURAN PENTING & IDENTITAS:
1. PENCIPTA / DEVELOPER CATIONGATE:
   - CationGate diciptakan dan dikembangkan oleh tim developer: Algi, Farel, Husein, dan Zefanya.
   - Jika user menanyakan siapa pencipta, pembuat, developer, founder, atau siapa yang membuat web/aplikasi CationGate ini, jawab dengan jelas dan sebutkan nama mereka dengan bangga dan ramah!
2. IDENTITAS DIRI:
   - Anda adalah Catpeer, maskot dan asisten AI resmi CationGate. Jika ditanya siapa nama Anda atau siapa Anda, perkenalkan diri sebagai Catpeer.
3. AKHIRAN KATA:
   - Akhiri setiap jawaban Anda dengan kata "miaw" atau "miaw!".
4. FORMAT DAN GAYA JAWABAN:
   - Jawab secara to-the-point, jelas, dan akurat (biasanya 2-4 kalimat atau bullet point ringkas bila menjelaskan alur langkah).
   - Jangan gunakan emoji yang berlebihan (pertahankan teks yang rapi, bersih, dan profesional).
   - Selalu ramah saat disapa dan responsif terhadap pertanyaan lanjutan.

PENGETAHUAN MENDALAM CATIONGATE:
1. Apa itu CationGate:
   - Platform SaaS (Software as a Service) PPDB/SPMB Multi-Tenant Cloud khusus SMK se-Indonesia.
   - Memungkinkan sekolah memiliki portal pendaftaran mandiri dengan subdomain kustom (misal: smktb.cationgate.site).
   - Paket layanan: Free Trial dan Paket Berlangganan Tahunan.

2. Alur Pendaftaran Sekolah (Instansi):
   - Langkah 1: Registrasi di /daftar, isi identitas sekolah & klaim subdomain setelah verifikasi OTP email.
   - Langkah 2: Verifikasi NPSN dan izin operasional oleh admin CationGate (via Dapodik).
   - Langkah 3: Verifikasi cepat sekitar 1-2 jam.
   - Langkah 4: Pilih paket layanan & buka gelombang pendaftaran serta atur kuota jurusan.
   - Langkah 5: Kustomisasi logo, warna identitas instansi, dan komponen formulir.

3. Alur Calon Siswa:
   - Siswa mengakses portal pendaftaran mandiri sekolah lewat HP/laptop.
   - Mengisi formulir online bertahap (Biodata, Nilai Rapor, NISN, NIK, Data Orang Tua).
   - Pembayaran biaya formulir via Transfer Virtual Account (VA) Bank atau bayar Tunai langsung di loket TU sekolah.
   - Penyerahan berkas fisik ke sekolah (jika diwajibkan oleh sekolah).
   - Pantau pengumuman kelulusan berkas & seleksi secara transparan dan real-time di portal sekolah.

4. Fitur Unggulan Admin & Sekolah:
   - Manajemen pendaftar real-time dengan filter status seleksi.
   - To-Do List verifikasi berkas untuk mempermudah panitia mengecek berkas yang belum lengkap.
   - Ekspor 1-Klik data pendaftar langsung terstandarisasi format Dapodik Kemendikbud.
   - Rekap statistik pendaftar per jurusan dan jalur pendaftaran secara dinamis.
`;

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
];

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
      const fallbackReply = generateFallbackResponse(userMessage);
      return c.json({
        success: true,
        reply: fallbackReply,
        source: 'local_knowledge'
      });
    }

    // Format chat history for Gemini API
    const contents: { role: string; parts: { text: string }[] }[] = [];

    for (const h of history.slice(-6)) {
      if (h.role && h.text) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }

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

    let aiReply: string | null = null;
    let successfulModel: string | null = null;

    // Try candidate models in order if one fails or is unavailable
    for (const model of CANDIDATE_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim().length > 0) {
            aiReply = candidateText;
            successfulModel = model;
            break;
          }
        } else {
          const errText = await response.text();
          console.warn(`Gemini model ${model} returned ${response.status}:`, errText);
        }
      } catch (err: unknown) {
        console.warn(`Gemini model ${model} fetch failed:`, (err as Error)?.message || String(err));
      }
    }

    if (!aiReply) {
      return c.json({
        success: true,
        reply: generateFallbackResponse(userMessage),
        source: 'local_fallback'
      });
    }

    // Clean up unwanted emojis and trim
    aiReply = aiReply.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, '');

    return c.json({
      success: true,
      reply: aiReply.trim(),
      source: `gemini (${successfulModel})`
    });

  } catch (error: unknown) {
    console.error('Chatbot API Exception:', (error as Error)?.message || String(error));
    return c.json({
      success: true,
      reply: generateFallbackResponse(userMessage || ""),
      source: 'error_fallback'
    });
  }
});

function generateFallbackResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // Pencipta / Developer
  if (
    q.includes('pencipta') ||
    q.includes('menciptakan') ||
    q.includes('pembuat') ||
    q.includes('membuat') ||
    q.includes('developer') ||
    q.includes('founder') ||
    q.includes('yang bikin') ||
    q.includes('siapa buat') ||
    q.includes('algi') ||
    q.includes('farel') ||
    q.includes('husein') ||
    q.includes('zefanya')
  ) {
    return "CationGate diciptakan dan dikembangkan oleh tim developer kami: Algi, Farel, Husein, dan Zefanya. miaw!";
  }

  // Identitas Catpeer
  if (
    q.includes('siapa kamu') ||
    q.includes('siapa anda') ||
    q.includes('nama kamu') ||
    q.includes('namamu') ||
    q.includes('siapa catpeer')
  ) {
    return "Halo! Saya Catpeer, asisten virtual dan maskot resmi CationGate. Saya siap membantu kamu seputar PPDB online SMK, alur pendaftaran, dan sistem CationGate. miaw!";
  }

  // Sapaan / Greeting
  if (
    q.startsWith('halo') ||
    q.startsWith('hai') ||
    q.startsWith('hei') ||
    q.startsWith('assalamu') ||
    q.startsWith('pagi') ||
    q.startsWith('siang') ||
    q.startsWith('sore') ||
    q.startsWith('malam') ||
    q === 'tes' ||
    q === 'test' ||
    q === 'ping'
  ) {
    return "Halo! Saya Catpeer, asisten CationGate. Ada yang bisa saya bantu seputar PPDB online SMK, pendaftaran sekolah, atau pembayaran formulir? miaw!";
  }

  // Pembayaran & Biaya
  if (
    q.includes('bayar') ||
    q.includes('biaya') ||
    q.includes('pembayaran') ||
    q.includes('va') ||
    q.includes('virtual account') ||
    q.includes('tunai') ||
    q.includes('harga') ||
    q.includes('paket') ||
    q.includes('free trial') ||
    q.includes('langganan')
  ) {
    return "Untuk calon siswa, pembayaran biaya formulir bisa dilakukan via Virtual Account (VA) Bank otomatis atau bayar Tunai di loket TU sekolah. Untuk pihak sekolah, tersedia paket Free Trial dan Berlangganan Tahunan. miaw!";
  }

  // Alur / Cara Pendaftaran Siswa
  if (
    q.includes('daftar siswa') ||
    q.includes('cara daftar') ||
    q.includes('alur siswa') ||
    q.includes('pendaftaran siswa') ||
    q.includes('calon siswa') ||
    q.includes('murid') ||
    q.includes('syarat daftar')
  ) {
    return "Alur pendaftaran siswa sangat mudah: Buka link portal sekolah di HP/laptop, isi formulir online (Biodata & Rapor), bayar formulir via VA/Tunai, kumpulkan berkas fisik jika diminta, dan pantau pengumuman secara online. miaw!";
  }

  // Alur / Pendaftaran Sekolah
  if (
    q.includes('daftar sekolah') ||
    q.includes('registrasi sekolah') ||
    q.includes('subdomain') ||
    q.includes('npsn') ||
    q.includes('verifikasi') ||
    q.includes('cara gabung') ||
    q.includes('daftarin sekolah')
  ) {
    return "Untuk mendaftarkan sekolah: Buka halaman /daftar, isi identitas sekolah & klaim subdomain, lalu tunggu verifikasi NPSN oleh admin (1-2 jam). Setelah disetujui, pilih paket dan sekolah siap membuka PPDB online mandiri. miaw!";
  }

  // Dapodik / Ekspor Data
  if (
    q.includes('dapodik') ||
    q.includes('ekspor') ||
    q.includes('export') ||
    q.includes('excel') ||
    q.includes('kemdikbud') ||
    q.includes('kemendikbud')
  ) {
    return "CationGate memiliki fitur Ekspor 1-Klik ke format Excel yang sudah terstandarisasi dan siap diimpor langsung ke Dapodik Kemendikbud, menghemat waktu tata usaha sekolah. miaw!";
  }

  // Fitur & Keunggulan
  if (
    q.includes('fitur') ||
    q.includes('keunggulan') ||
    q.includes('kelebihan') ||
    q.includes('manfaat') ||
    q.includes('bisa apa')
  ) {
    return "Fitur unggulan CationGate: Subdomain portal mandiri sekolah, formulir pendaftaran mobile-friendly, pembayaran VA & tunai otomatis, To-Do list verifikasi berkas, ekspor 1-klik ke Dapodik, dan kustomisasi branding sekolah. miaw!";
  }

  // Tentang / Apa itu CationGate
  if (
    q.includes('apa itu') ||
    q.includes('tentang') ||
    q.includes('pengertian') ||
    q.includes('definisi') ||
    q.includes('cationgate')
  ) {
    return "CationGate adalah platform SaaS PPDB/SPMB Online Multi-Tenant berbasis Cloud khusus jenjang SMK di Indonesia. Sekolah dapat mengelola pendaftaran mandiri dengan subdomain khusus dan sistem verifikasi terintegrasi. miaw!";
  }

  return "Halo! Saya Catpeer, asisten cerdas CationGate. Kamu bisa tanya seputar alur PPDB online SMK, cara pendaftaran sekolah, pembayaran formulir, hingga integrasi Dapodik. Ada yang ingin kamu tanyakan? miaw!";
}

export default chatbotRouter;
