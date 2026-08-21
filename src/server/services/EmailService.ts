import nodemailer from "nodemailer";

interface ContactEmailPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const EmailService = {
  sendContactEmail: async (data: ContactEmailPayload) => {
    // Setup transporter (pastikan email dan app password udah ada di .env)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Desain template email yang bakal masuk ke inbox kamu
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Ngirim ke email kamu sendiri
      replyTo: data.email, // Biar gampang kalo mau langsung balas ke pengirim
      subject: `Pesan Baru dari ${data.name} - Website Profil Sekolah`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Ada Pesan Baru dari Website!</h2>
          <p>Berikut adalah detail pesan yang dikirimkan melalui form kontak:</p>
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
      `,
    };

    // Eksekusi pengiriman email
    return await transporter.sendMail(mailOptions);
  },
};

