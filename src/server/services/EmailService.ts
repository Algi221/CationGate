import nodemailer from "nodemailer";
import { Resend } from "resend";

interface ContactEmailPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Initialize Resend if key is available
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Helper to create Nodemailer transport
function createTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

// Base HTML Wrapper for CationGate Emails
function buildEmailHtml({
  badgeText,
  badgeBg = "#FFD33B",
  badgeColor = "#2e3749",
  heading,
  description,
  otpCode,
  warningNote,
  footerNote,
}: {
  badgeText: string;
  badgeBg?: string;
  badgeColor?: string;
  heading: string;
  description: string;
  otpCode: string;
  warningNote: string;
  footerNote?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #2e3749; padding: 28px 32px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                      Cation<span style="color: #FFD33B;">Gate</span>
                    </span>
                    <div style="margin-top: 6px;">
                      <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 3px 10px; border-radius: 9999px;">
                        ${badgeText}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: left;">
              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                ${heading}
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                ${description}
              </p>

              <!-- OTP Code Display Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background-color: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 20px;">
                    <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      Kode OTP Keamanan
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #2e3749; text-indent: 10px;">
                      ${otpCode}
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 8px;">
                      Berlaku selama <strong style="color: #0f172a;">15 menit</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px;">
                    <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.5;">
                      ${warningNote}
                    </p>
                  </td>
                </tr>
              </table>

              ${
                footerNote
                  ? `<p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">${footerNote}</p>`
                  : ""
              }
            </td>
          </tr>

          <!-- Footer Divider & Meta -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="border-top: 1px solid #f1f5f9;"></div>
            </td>
          </tr>

          <!-- Footer Info -->
          <tr>
            <td style="padding: 20px 32px 28px 32px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">
                Email ini dikirim secara otomatis oleh Sistem Keamanan <strong>CationGate</strong>.
              </p>
              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} CationGate Platform. Hak cipta dilindungi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export const EmailService = {
  /**
   * Send Email using Resend or fallback to Nodemailer SMTP
   */
  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    const fromAddress = process.env.SMTP_FROM || "CationGate <noreply@cationgate.site>";

    // 1. Try Resend if configured
    if (resend) {
      try {
        const { error } = await resend.emails.send({
          from: fromAddress,
          to,
          subject,
          html,
        });

        if (!error) {
          return { success: true };
        }
        console.warn("Resend API warning, trying SMTP fallback:", error.message);
      } catch (resendErr) {
        console.warn("Resend API error, trying SMTP fallback:", resendErr);
      }
    }

    // 2. Try Nodemailer (SMTP/Gmail)
    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: fromAddress,
          to,
          subject,
          html,
        });
        return { success: true };
      } catch (smtpErr) {
        console.error("Nodemailer SMTP sending error:", smtpErr);
        throw smtpErr;
      }
    }

    // 3. In dev mode without configured keys
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ No email provider configured. Simulating email send in development.");
      return { success: true, simulated: true };
    }

    throw new Error("Tidak ada konfigurasi pengiriman email (Resend / SMTP) yang valid.");
  },

  /**
   * Template 1: OTP Verifikasi Pendaftaran Email Baru
   */
  async sendRegistrationOtpEmail(toEmail: string, otpCode: string) {
    const html = buildEmailHtml({
      badgeText: "Verifikasi Pendaftaran",
      badgeBg: "#FFD33B",
      badgeColor: "#2e3749",
      heading: "Verifikasi Email Pendaftaran Akun",
      description:
        "Terima kasih telah memulai pendaftaran sekolah di platform CationGate. Masukkan kode OTP berikut untuk memverifikasi email resmi Anda dan melanjutkan proses aktivasi:",
      otpCode,
      warningNote:
        "<strong>Keamanan Akun:</strong> Jangan bagikan kode OTP ini kepada siapa pun. Pihak CationGate tidak akan pernah meminta kode verifikasi Anda.",
      footerNote: "Jika Anda tidak merasa mendaftar di CationGate, silakan abaikan email ini.",
    });

    return this.sendMail({
      to: toEmail,
      subject: `[CationGate] Kode Verifikasi Email Pendaftaran: ${otpCode}`,
      html,
    });
  },

  /**
   * Template 2: OTP Reset / Lupa Password
   */
  async sendForgotPasswordOtpEmail(toEmail: string, otpCode: string) {
    const html = buildEmailHtml({
      badgeText: "Pemulihan Keamanan",
      badgeBg: "#fef3c7",
      badgeColor: "#92400e",
      heading: "Permintaan Reset Kata Sandi Admin",
      description:
        "Kami menerima permintaan untuk mereset kata sandi akun Admin CationGate Anda. Masukkan kode verifikasi 6 digit di bawah ini untuk membuat kata sandi baru:",
      otpCode,
      warningNote:
        "<strong>Peringatan Keamanan:</strong> Jika Anda <em>TIDAK</em> merasa meminta reset kata sandi, abaikan email ini. Kata sandi akun Anda tetap aman dan tidak akan berubah.",
      footerNote: "Permintaan ini diajukan dari halaman login CationGate.",
    });

    return this.sendMail({
      to: toEmail,
      subject: `[CationGate] Kode OTP Reset Kata Sandi Akun: ${otpCode}`,
      html,
    });
  },

  /**
   * Template 3: Notifikasi Verifikasi Sekolah Disetujui (FULL_VERIFIED)
   */
  async sendSchoolApprovedEmail(toEmail: string, schoolName: string, schoolSlug: string) {
    const isLocal = process.env.NODE_ENV !== 'production';
    const baseUrl = isLocal
      ? `http://${schoolSlug}.localhost:3000`
      : `https://${schoolSlug}.cationgate.site`;
    const dashboardUrl = `${baseUrl}/dashboard`;

    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Sekolah Disetujui</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #1e293b; padding: 28px 32px; text-align: center;">
              <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                Cation<span style="color: #FFD33B;">Gate</span>
              </span>
              <div style="margin-top: 8px;">
                <span style="display: inline-block; background-color: #10B981; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px;">
                  VERIFIKASI RESMI DISETUJUI
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                Selamat! Akun ${schoolName} Telah Terverifikasi 🎉
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Tim Superadmin Gatekeeper telah meneliti dan menyetujui dokumen legalitas SK izin operasional instansi Anda. Seluruh fitur SPMB &amp; PPDB Online, pembayaran gateway, customizer landing page, dan manajemen kuota siswa kini <strong>aktif penuh tanpa batasan</strong>.
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Portal Subdomain Resmi Sekolah</div>
                    <div style="font-size: 15px; font-weight: 800; color: #2563EB; margin-top: 4px; word-break: break-all;">
                      <a href="${baseUrl}" style="color: #2563EB; text-decoration: none;">${baseUrl}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                      Buka Dashboard Sekolah &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                Silakan login menggunakan email resmi dan kata sandi admin yang telah Anda daftarkan.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px 28px 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
              &copy; ${new Date().getFullYear()} CationGate Platform. Hak cipta dilindungi.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    return this.sendMail({
      to: toEmail,
      subject: `🎉 [CationGate] Selamat! Akun Sekolah ${schoolName} Telah Diverifikasi & Aktif`,
      html,
    });
  },

  /**
   * Template 4: Notifikasi Verifikasi Sekolah Ditolak / Perlu Revisi
   */
  async sendSchoolRejectedEmail(toEmail: string, schoolName: string, schoolSlug: string, reason?: string) {
    const isLocal = process.env.NODE_ENV !== 'production';
    const baseUrl = isLocal
      ? `http://${schoolSlug}.localhost:3000`
      : `https://${schoolSlug}.cationgate.site`;
    const verificationUrl = `${baseUrl}/dashboard/verification`;

    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pemberitahuan Verifikasi Dokumen</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #1e293b; padding: 28px 32px; text-align: center;">
              <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                Cation<span style="color: #FFD33B;">Gate</span>
              </span>
              <div style="margin-top: 8px;">
                <span style="display: inline-block; background-color: #EF4444; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px;">
                  PERLU PERBAIKAN DOKUMEN
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                Pemberitahuan Status Verifikasi Dokumen Instansi
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Pengajuan verifikasi instansi <strong>${schoolName}</strong> belum dapat disetujui karena memerlukan perbaikan atau kejelasan data legalitas:
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; background-color: #fff1f2; border-left: 4px solid #f43f5e; border-radius: 8px; padding: 14px 18px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 800; color: #9f1239; text-transform: uppercase;">Catatan Tim Gatekeeper:</div>
                    <div style="font-size: 14px; font-weight: 600; color: #be123c; margin-top: 4px; line-height: 1.5;">
                      ${reason || "Dokumen SK Izin Operasional belum lengkap, buram, atau data NPSN tidak sesuai dengan arsip Kemendikbudristek."}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                Silakan lakukan revisi data atau unggah ulang dokumen SK resmi yang valid melalui tautan berikut:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 12px;">
                      Revisi Data Pengajuan &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                Jika Anda memiliki pertanyaan lebih lanjut, silakan hubungi tim bantuan CationGate di support@cationgate.site.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px 28px 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
              &copy; ${new Date().getFullYear()} CationGate Platform. Hak cipta dilindungi.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    return this.sendMail({
      to: toEmail,
      subject: `⚠️ [CationGate] Pemberitahuan Status Verifikasi Dokumen ${schoolName}`,
      html,
    });
  },

  /**
   * Contact Form Email
   */
  async sendContactEmail(data: ContactEmailPayload) {
    const transporter = createTransporter();
    const targetEmail = process.env.EMAIL_USER || process.env.SMTP_USER;

    if (!transporter || !targetEmail) {
      if (resend && targetEmail) {
        return await resend.emails.send({
          from: process.env.SMTP_FROM || "CationGate <noreply@cationgate.site>",
          to: targetEmail,
          replyTo: data.email,
          subject: `Pesan Baru dari ${data.name} - Form Kontak CationGate`,
          html: `<p><strong>Nama:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Pesan:</strong> ${data.message}</p>`,
        });
      }
      return { success: true };
    }

    const mailOptions = {
      from: targetEmail,
      to: targetEmail,
      replyTo: data.email,
      subject: `Pesan Baru dari ${data.name} - Form Kontak CationGate`,
      html: `
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
      `,
    };

    return await transporter.sendMail(mailOptions);
  },
};
