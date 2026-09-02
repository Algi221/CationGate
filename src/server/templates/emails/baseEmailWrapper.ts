export interface BaseEmailWrapperOptions {
  badgeText: string;
  badgeBg?: string;
  badgeColor?: string;
  heading: string;
  description: string;
  otpCode: string;
  warningNote: string;
  footerNote?: string;
}

/**
 * Base HTML Wrapper for CationGate OTP & Notification Emails
 */
export function buildEmailHtml({
  badgeText,
  badgeBg = "#FFD33B",
  badgeColor = "#2e3749",
  heading,
  description,
  otpCode,
  warningNote,
  footerNote,
}: BaseEmailWrapperOptions): string {
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
