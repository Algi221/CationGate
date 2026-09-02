export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Template Email: Form Kontak Pesan Masuk
 */
export function getContactEmailHtml(data: ContactEmailData): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2e3749;">Ada Pesan Baru dari Website CationGate!</h2>
      <p>Berikut adalah detail pesan yang dikirimkan:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 35%;">Nama/Instansi</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">No. Telepon/WA</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.phone || "-"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Pesan</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.message}</td>
        </tr>
      </table>
      <p style="margin-top: 30px; font-size: 12px; color: #666;">Pesan ini dikirim otomatis dari sistem website.</p>
    </div>
  `.trim();
}
