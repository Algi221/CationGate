import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_AUDIT_AGENTS = [
  "lighthouse",
  "chrome-lighthouse",
  "pagespeed",
  "insights",
  "gtmetrix",
  "webpagetest",
];

// Reserved system/marketing subdomains that should NOT be treated as school slugs
const SYSTEM_SUBDOMAINS = ["www", "api", "admin", "app", "mail", "cname", "static", "assets"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";

  // 1. Restrict automated audit and Lighthouse bots from performance scanning
  if (BLOCKED_AUDIT_AGENTS.some((agent) => userAgent.includes(agent))) {
    return new NextResponse("Access Denied: Automated performance audit is restricted.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  // 2. Skip internal Next.js assets, API endpoints, static assets, and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Extract Host & Subdomain
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();

  let subdomain: string | null = null;

  if (hostname.endsWith(".cationgate.site")) {
    subdomain = hostname.replace(".cationgate.site", "");
  } else if (hostname.endsWith(".localhost") && hostname !== "localhost") {
    subdomain = hostname.replace(".localhost", "");
  } else if (hostname.endsWith(".vercel.app") && hostname !== "cationgate.vercel.app") {
    const parts = hostname.split(".");
    if (parts.length > 3) {
      subdomain = parts[0];
    }
  }

  // If subdomain is in system reserved keywords, ignore it
  if (subdomain && SYSTEM_SUBDOMAINS.includes(subdomain)) {
    subdomain = null;
  }

  // 4. Handle Subdomain Routing (e.g. smktarunabhakti.cationgate.site or demo.cationgate.site)
  if (subdomain) {
    // If request already contains the subdomain slug in pathname, rewrite to clean path
    if (pathname.startsWith(`/${subdomain}`)) {
      const cleanPath = pathname.replace(`/${subdomain}`, "") || "/";
      const rewriteUrl = new URL(`/${subdomain}${cleanPath}`, request.url);
      const response = NextResponse.rewrite(rewriteUrl);
      response.headers.set("x-school-slug", subdomain);
      response.headers.set("x-is-subdomain", "true");
      return response;
    }

    // If request is /login or /auth/login on a school subdomain, rewrite to client-side redirect page
    if (pathname === "/login" || pathname === "/auth/login") {
      const rewriteUrl = new URL(`/${subdomain}/auth/login`, request.url);
      const response = NextResponse.rewrite(rewriteUrl);
      response.headers.set("x-school-slug", subdomain);
      response.headers.set("x-is-subdomain", "true");
      return response;
    }

    // Rewrite internal request to dynamic route `/[school_slug]`
    // e.g. `/` -> `/[school_slug]`
    // e.g. `/dashboard` -> `/[school_slug]/dashboard`
    // e.g. `/profil` -> `/[school_slug]/profil`
    const rewriteUrl = new URL(`/${subdomain}${pathname}`, request.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-school-slug", subdomain);
    response.headers.set("x-is-subdomain", "true");
    return response;
  }

  // 5. Handle Root Domain Routing (cationgate.site / localhost:3000)
  // Attach x-school-slug header if accessing a school via path (e.g. /smktarunabhakti/dashboard)
  const dashboardMatch = pathname.match(/^\/([^/]+)\/dashboard/);
  if (dashboardMatch) {
    const schoolSlug = dashboardMatch[1];
    const response = NextResponse.next();
    response.headers.set("x-school-slug", schoolSlug);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

