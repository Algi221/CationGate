import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require verified school status
const PROTECTED_DASHBOARD_PATTERN = /^\/([^/]+)\/dashboard/;
// Routes that should be accessible regardless of verification status
const ALWAYS_ALLOWED = ['/auth/', '/verify-account', '/daftar', '/api/', '/verify/'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, API routes, and always-allowed paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    ALWAYS_ALLOWED.some(p => pathname.includes(p))
  ) {
    return NextResponse.next();
  }

  // Check if this is a dashboard route
  const dashboardMatch = pathname.match(PROTECTED_DASHBOARD_PATTERN);
  if (dashboardMatch) {
    const schoolSlug = dashboardMatch[1];
    
    // We can't do async DB calls in Edge middleware easily,
    // so we set a header that the dashboard layout can use to check school status.
    // The actual verification check happens client-side in the dashboard layout.
    const response = NextResponse.next();
    response.headers.set('x-school-slug', schoolSlug);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
