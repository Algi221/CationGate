"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSchoolHref } from "@/hooks/useSchoolHref";

export default function DaftarUlangRedirect() {
  const router = useRouter();
  const { href } = useSchoolHref();

  useEffect(() => {
    router.replace(href("/dashboard/pendaftar"));
  }, [router, href]);

  return null;
}
