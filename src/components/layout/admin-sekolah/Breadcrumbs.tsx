"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BreadcrumbsProps {
  pathname: string;
}

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Manajemen Admin",
  pendaftar: "Data Calon Siswa",
  "siswa-aktif": "Siswa Aktif",
  informasi: "Kelola Informasi",
  "kelola-ui": "Kelola UI/Data",
  "pembagian-kelas": "Pembagian Kelas",
  settings: "Pengaturan",
  profile: "Profil Saya",
};

export function Breadcrumbs({ pathname }: BreadcrumbsProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab");

  const paths = pathname.split("/").filter((p) => p);
  const breadcrumbs: { label: string; href: string }[] = [];
  let currentPath = "";

  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    if (
      index === 0 &&
      ![
        "dashboard",
        "admin",
        "pendaftar",
        "siswa-aktif",
        "informasi",
        "kelola-ui",
        "pembagian-kelas",
        "settings",
        "profile",
      ].includes(segment)
    ) {
      return;
    }
    const label = labelMap[segment] || segment;
    const href = currentPath;
    breadcrumbs.push({ label, href });
  });

  if (pathname.includes("/dashboard/admin") && activeTab === "trash") {
    breadcrumbs.push({
      label: "Sampah",
      href: `${paths[0] ? "/" + paths[0] : ""}/dashboard/admin?tab=trash`,
    });
  } else if (pathname.includes("/dashboard/pendaftar") && activeTab === "trash") {
    breadcrumbs.push({
      label: "Sampah",
      href: `${paths[0] ? "/" + paths[0] : ""}/dashboard/pendaftar?tab=trash`,
    });
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 font-medium tracking-wide select-none">
      {breadcrumbs.map((bc, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <span className="text-slate-300 dark:text-slate-700">›</span>
            )}
            {isLast ? (
              <span className="text-slate-600 dark:text-slate-300 font-semibold">
                {bc.label}
              </span>
            ) : (
              <Link
                href={bc.href}
                className="hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400 transition-colors"
              >
                {bc.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
