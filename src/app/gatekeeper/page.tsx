"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GatekeeperRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/gatekeeper/auth/login");
  }, [router]);
  return null;
}
