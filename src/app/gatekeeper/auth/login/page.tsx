"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GatekeeperAuthLoginRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams ? searchParams.toString() : "";
    const target = query ? `/gatekeeper/login?${query}` : "/gatekeeper/login";
    router.replace(target);
  }, [router, searchParams]);

  return null;
}

export default function GatekeeperAuthLoginRedirect() {
  return (
    <Suspense fallback={null}>
      <GatekeeperAuthLoginRedirectContent />
    </Suspense>
  );
}
