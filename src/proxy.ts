import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_DASHBOARD_PATTERN = /^\/([^/]+)\/dashboard/;

const ALWAYS_ALLOWED = ['/auth/', '/verify-account', '/daftar', '/api/', '/verify/'];

const BLOCKED_AUDIT_AGENTS = [
  'lighthouse',
  'chrome-lighthouse',
  'pagespeed',
  'insights',
  'gtmetrix',
  'webpagetest'
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // Restrict automated audit and Lighthouse bots from performance scanning
  if (BLOCKED_AUDIT_AGENTS.some((agent) => userAgent.includes(agent))) {
    return new NextResponse('Access Denied: Automated performance audit is restricted.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    ALWAYS_ALLOWED.some(p => pathname.includes(p))
  ) {
    return NextResponse.next();
  }

  const dashboardMatch = pathname.match(PROTECTED_DASHBOARD_PATTERN);
  if (dashboardMatch) {
    const schoolSlug = dashboardMatch[1];

    const response = NextResponse.next();
    response.headers.set('x-school-slug', schoolSlug);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [

    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
