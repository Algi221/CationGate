import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pastikan bagian images ini ada di dalam nextConfig
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "hpnnzjpskvqwmbkcxfnm.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // Tambahkan opsi lain jika ada di proyek kamu...
};

export default nextConfig;
