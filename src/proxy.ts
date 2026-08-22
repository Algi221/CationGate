import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_DASHBOARD_PATTERN = /^\/([^/]+)\/dashboard/;

const ALWAYS_ALLOWED = ['/auth/', '/verify-account', '/daftar', '/api/', '/verify/'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
