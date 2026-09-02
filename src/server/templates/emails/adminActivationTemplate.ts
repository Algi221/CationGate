interface AdminActivationTemplateOptions {
  toEmail: string;
  staffName: string;
  schoolName: string;
  otpCode: string;
  activationLink?: string;
  username: string;
  role?: string;
}

/**
 * Template Email: Verifikasi & Aktivasi Akun Staf Admin Sekolah
 */
export function getAdminActivationEmailHtml({
  toEmail,
  staffName,
  schoolName,
  otpCode,
  activationLink,
  username,
  role = "admin",
}: AdminActivationTemplateOptions): string {
  const roleLabel =
    role === "superadmin"
      ? "Superadmin Instansi"
      : role === "panitia"
      ? "Panitia Verifikator PPDB"
      : "Admin Sekolah (Lengkap)";

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode Verifikasi Akun Admin Sekolah - CationGate</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #0f172a; padding: 32px; text-align: center;">
              <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                Cation<span style="color: #3b82f6;">Gate</span>
              </span>
              <div style="margin-top: 8px;">
                <span style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 14px; border-radius: 9999px;">
                  VERIFIKASI AKUN ADMIN
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px; text-align: left;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #0f172a;">
                Halo, ${staffName}!
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Anda telah ditambahkan sebagai <strong>${roleLabel}</strong> untuk portal resmi <strong>${schoolName}</strong> di platform CationGate.
              </p>
              
              <div style="background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr>
                    <td style="color: #64748b; font-weight: 600; padding-bottom: 6px; width: 35%;">Username:</td>
                    <td style="color: #0f172a; font-weight: 800; font-family: monospace;">${username}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-weight: 600; padding-bottom: 6px;">Email:</td>
                    <td style="color: #0f172a; font-weight: 700;">${toEmail}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-weight: 600;">Instansi Sekolah:</td>
                    <td style="color: #0f172a; font-weight: 700;">${schoolName}</td>
                  </tr>
                </table>
              </div>

              <!-- OTP Display Box -->
              <div style="text-align: center; margin: 28px 0; background: #0f172a; border-radius: 20px; padding: 24px 20px; border: 1px solid #1e293b;">
                <span style="display: block; font-size: 11px; font-weight: 800; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">KODE VERIFIKASI OTP</span>
                <span style="font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #38bdf8; font-family: monospace; display: block; padding-left: 10px;">${otpCode}</span>
                <span style="display: block; font-size: 11px; color: #64748b; margin-top: 10px;">Kode berlaku selama 24 jam</span>
              </div>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Silakan masukkan kode OTP di atas pada halaman verifikasi atau saat pertama kali login ke dashboard sekolah.
              </p>

              ${
                activationLink
                  ? `
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="${activationLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 14px; box-shadow: 0 4px 14px rgba(37,99,235,0.3);">
                  Buka Halaman Verifikasi Akun &rarr;
                </a>
              </div>
              `
                  : ""
              }

              <p style="margin: 16px 0 0 0; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; line-height: 1.5;">
                * Gunakan Email Anda dan Password yang telah dibuat oleh Admin Sekolah untuk masuk ke portal setelah verifikasi selesai.<br />
                * Jangan berikan kode OTP ini kepada siapapun demi keamanan instansi sekolah Anda.
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
