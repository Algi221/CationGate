import nodemailer from "nodemailer";
import { Resend } from "resend";
import {
  buildEmailHtml,
  getSchoolApprovedEmailHtml,
  getSchoolRejectedEmailHtml,
  getAdminActivationEmailHtml,
  getContactEmailHtml,
  ContactEmailData,
} from "@/server/templates/emails";

type ContactEmailPayload = ContactEmailData;

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
    const fromAddress =
      process.env.SMTP_FROM || "CationGate <noreply@cationgate.site>";

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
        console.warn(
          "Resend API warning, trying SMTP fallback:",
          error.message,
        );
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
      console.warn(
        "⚠️ No email provider configured. Simulating email send in development.",
      );
      return { success: true, simulated: true };
    }

    throw new Error(
      "Tidak ada konfigurasi pengiriman email (Resend / SMTP) yang valid.",
    );
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
      footerNote:
        "Jika Anda tidak merasa mendaftar di CationGate, silakan abaikan email ini.",
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
  async sendSchoolApprovedEmail(
    toEmail: string,
    schoolName: string,
    schoolSlug: string,
  ) {
    const isLocal = process.env.NODE_ENV !== "production";
    const baseUrl = isLocal
      ? `http://${schoolSlug}.localhost:3000`
      : `https://${schoolSlug}.cationgate.site`;
    const dashboardUrl = `${baseUrl}/dashboard`;

    const html = getSchoolApprovedEmailHtml(schoolName, baseUrl, dashboardUrl);

    return this.sendMail({
      to: toEmail,
      subject: `🎉 [CationGate] Selamat! Akun Sekolah ${schoolName} Telah Diverifikasi & Aktif`,
      html,
    });
  },

  /**
   * Template 4: Notifikasi Verifikasi Sekolah Ditolak / Perlu Revisi
   */
  async sendSchoolRejectedEmail(
    toEmail: string,
    schoolName: string,
    schoolSlug: string,
    reason?: string,
  ) {
    const isLocal = process.env.NODE_ENV !== "production";
    const baseUrl = isLocal
      ? `http://${schoolSlug}.localhost:3000`
      : `https://${schoolSlug}.cationgate.site`;
    const verificationUrl = `${baseUrl}/dashboard/verification`;

    const html = getSchoolRejectedEmailHtml(
      schoolName,
      verificationUrl,
      reason,
    );

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
      html: getContactEmailHtml(data),
    };

    return await transporter.sendMail(mailOptions);
  },

  /**
   * Send staff admin activation email with 6-digit OTP code and activation link
   */
  async sendAdminActivationEmail({
    toEmail,
    staffName,
    schoolName,
    otpCode,
    activationLink,
    username,
    role = "admin",
  }: {
    toEmail: string;
    staffName: string;
    schoolName: string;
    otpCode: string;
    activationLink?: string;
    username: string;
    role?: string;
  }): Promise<{ success: boolean; message?: string }> {
    const transporter = createTransporter();
    const fromAddress =
      process.env.SMTP_FROM ||
      `"CationGate Platform" <${process.env.SMTP_USER || process.env.EMAIL_USER || "noreply@cationgate.site"}>`;

    const htmlContent = getAdminActivationEmailHtml({
      toEmail,
      staffName,
      schoolName,
      otpCode,
      activationLink,
      username,
      role,
    });

    try {
      if (resend) {
        await resend.emails.send({
          from: fromAddress,
          to: toEmail,
          subject: `🔐 Kode OTP Verifikasi Akun Admin: ${schoolName} - CationGate`,
          html: htmlContent,
        });
        return { success: true };
      }

      if (transporter) {
        await transporter.sendMail({
          from: fromAddress,
          to: toEmail,
          subject: `🔐 Kode OTP Verifikasi Akun Admin: ${schoolName} - CationGate`,
          html: htmlContent,
        });
        return { success: true };
      }

      console.log(`[EmailService] Simulated OTP ${otpCode} to ${toEmail}`);
      return { success: true };
    } catch (err: unknown) {
      console.warn("Failed to send admin activation email:", err);
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err),
      };
    }
  },
};
