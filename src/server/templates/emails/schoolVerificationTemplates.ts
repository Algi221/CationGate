/**
 * Template Email: Verifikasi Sekolah Disetujui (FULL_VERIFIED)
 */
export function getSchoolApprovedEmailHtml(
  schoolName: string,
  baseUrl: string,
  dashboardUrl: string,
): string {
  return `
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
}

/**
 * Template Email: Verifikasi Sekolah Ditolak / Perlu Revisi
 */
export function getSchoolRejectedEmailHtml(
  schoolName: string,
  verificationUrl: string,
  reason?: string,
): string {
  return `
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
}
