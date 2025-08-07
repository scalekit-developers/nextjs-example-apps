import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  TOKEN_EXPIRY_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from './app/lib/constants';

// List of paths that require authentication
const protectedPaths = ['/profile'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  // If the path is not protected, continue
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Check if the user is authenticated
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const tokenExpiry = request.cookies.get(TOKEN_EXPIRY_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // If there's no access token or the token has expired but we have a refresh token
  if (
    (!accessToken || (tokenExpiry && parseInt(tokenExpiry) < Date.now())) &&
    refreshToken
  ) {
    // Redirect to a token refresh endpoint
    const refreshUrl = new URL('/api/refresh', request.url);
    refreshUrl.searchParams.set('redirect', path);

    return NextResponse.redirect(refreshUrl);
  }

  // If there's no access token or the token has expired and no refresh token
  if (!accessToken || (tokenExpiry && parseInt(tokenExpiry) < Date.now())) {
    // Create the redirect URL with the original path as the redirect parameter
    const redirectUrl = new URL('/api/auth', request.url);
    redirectUrl.searchParams.set('redirect', path);

    return NextResponse.redirect(redirectUrl);
  }

  // User is authenticated, continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all paths except for static files, api routes (except /api/user), and auth paths
    '/((?!_next/static|_next/image|favicon.ico|api/(?!user)).*)',
  ],
};
