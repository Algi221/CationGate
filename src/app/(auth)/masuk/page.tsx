"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MasukRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams ? searchParams.toString() : "";
    const target = query ? `/login?${query}` : "/login";
    router.replace(target);
  }, [router, searchParams]);

  return null;
}

export default function MasukRedirect() {
  return (
    <Suspense fallback={null}>
      <MasukRedirectContent />
    </Suspense>
  );
}
