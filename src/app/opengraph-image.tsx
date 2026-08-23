import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "CationGate - Platform Manajemen PPDB & SPMB Sekolah Modern";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0B1120",
          backgroundImage: "radial-gradient(circle at 25px 25px, #1E293B 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1E293B 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              C
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: "900",
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
              }}
            >
              CationGate
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(37, 99, 235, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              borderRadius: "9999px",
              padding: "8px 20px",
            }}
          >
            <span
              style={{
                color: "#60A5FA",
                fontSize: "16px",
                fontWeight: "700",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              SaaS PPDB & SPMB Terintegrasi
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "1000px",
          }}
        >
          <div
            style={{
              fontSize: "58px",
              fontWeight: "900",
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Revolusi PPDB & SPMB SMK Masa Depan
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#94A3B8",
              lineHeight: 1.4,
            }}
          >
            Platform digital penerimaan siswa baru, verifikasi berkas otomatis, dan administrasi pendaftaran SMK terpadu terintegrasi Dapodik.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1E293B",
              borderRadius: "10px",
              padding: "10px 18px",
              color: "#E2E8F0",
              fontSize: "15px",
              fontWeight: "600",
              border: "1px solid #334155",
            }}
          >
            ✓ PPDB & SPMB SMK
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1E293B",
              borderRadius: "10px",
              padding: "10px 18px",
              color: "#E2E8F0",
              fontSize: "15px",
              fontWeight: "600",
              border: "1px solid #334155",
            }}
          >
            ✓ Seleksi Jurusan & Berkas
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1E293B",
              borderRadius: "10px",
              padding: "10px 18px",
              color: "#E2E8F0",
              fontSize: "15px",
              fontWeight: "600",
              border: "1px solid #334155",
            }}
          >
            ✓ Ekspor Format Dapodik
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              color: "#FBBF24",
              fontSize: "18px",
              fontWeight: "800",
              letterSpacing: "0.02em",
            }}
          >
            cationgate.site
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
