"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoginRedirect() {
  useEffect(() => {
    const host = window.location.host.toLowerCase();
    const isLocalhost = host.includes("localhost");
    const port = window.location.port ? `:${window.location.port}` : "";
    const rootUrl = isLocalhost
      ? `http://localhost${port}/login`
      : "https://cationgate.site/login";
    window.location.href = rootUrl;
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#0077c8]" />
    </div>
  );
}
