"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSchoolHref } from "@/hooks/useSchoolHref";

export default function VerifikasiBerkasRedirect() {
  const router = useRouter();
  const { href } = useSchoolHref();

  useEffect(() => {
    router.replace(href("/dashboard/verification"));
  }, [router, href]);

  return null;
}
