import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/tentang",
          "/kontak",
          "/blog",
          "/demo",
          "/fitur",
          "/solusi",
          "/pricing",
          "/daftar",
        ],
        disallow: [
          "/api/",
          "/gatekeeper/",
          "/*/dashboard/",
          "/*/verify/",
          "/*/verify-account/",
          "/*/invoice/",
          "/health",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/gatekeeper/",
          "/*/dashboard/",
          "/*/verify/",
          "/*/verify-account/",
          "/*/invoice/",
          "/health",
        ],
      },
      {
        userAgent: ["Lighthouse", "Chrome-Lighthouse", "Google-PageSpeed-Insights"],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
