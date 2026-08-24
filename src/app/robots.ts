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
        ],
        disallow: [
          "/api/",
          "/gatekeeper/",
          "/*/dashboard/",
          "/*/verify/",
          "/*/verify-account/",
          "/*/invoice/",
          "/health",
          "/(auth)/",
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
