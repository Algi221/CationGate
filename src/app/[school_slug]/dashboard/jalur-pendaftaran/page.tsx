"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSchoolHref } from "@/hooks/useSchoolHref";

export default function JalurPendaftaranRedirect() {
  const router = useRouter();
  const { href } = useSchoolHref();

  useEffect(() => {
    router.replace(href("/dashboard/pendaftar?tab=kuota"));
  }, [router, href]);

  return null;
}
