import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const currentDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fitur`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/daftar`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const schoolRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: schools } = await supabase
        .from("schools")
        .select("slug, updated_at")
        .limit(100);

      if (schools && schools.length > 0) {
        for (const school of schools) {
          if (!school.slug) continue;
          const schoolMod = school.updated_at ? new Date(school.updated_at) : currentDate;

          schoolRoutes.push(
            {
              url: `${baseUrl}/${school.slug}`,
              lastModified: schoolMod,
              changeFrequency: "daily",
              priority: 0.9,
            },
            {
              url: `${baseUrl}/${school.slug}/profil`,
              lastModified: schoolMod,
              changeFrequency: "weekly",
              priority: 0.7,
            },
            {
              url: `${baseUrl}/${school.slug}/data-pendaftar`,
              lastModified: schoolMod,
              changeFrequency: "daily",
              priority: 0.7,
            },
            {
              url: `${baseUrl}/${school.slug}/daftar`,
              lastModified: schoolMod,
              changeFrequency: "daily",
              priority: 0.8,
            }
          );
        }
      }
    }
  } catch (error) {
    console.warn("Sitemap dynamic fetch warning:", error);
  }

  if (schoolRoutes.length === 0) {
    const defaultSlugs = ["smktarunabhakti"];
    for (const slug of defaultSlugs) {
      schoolRoutes.push(
        {
          url: `${baseUrl}/${slug}`,
          lastModified: currentDate,
          changeFrequency: "daily",
          priority: 0.9,
        },
        {
          url: `${baseUrl}/${slug}/profil`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        },
        {
          url: `${baseUrl}/${slug}/data-pendaftar`,
          lastModified: currentDate,
          changeFrequency: "daily",
          priority: 0.7,
        },
        {
          url: `${baseUrl}/${slug}/daftar`,
          lastModified: currentDate,
          changeFrequency: "daily",
          priority: 0.8,
        }
      );
    }
  }

  return [...staticRoutes, ...schoolRoutes];
}
