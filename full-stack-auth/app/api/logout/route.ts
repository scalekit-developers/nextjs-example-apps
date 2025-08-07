import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  ID_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_EXPIRY_COOKIE,
} from '@/app/lib/constants';
import scalekit from '@/app/lib/scalekit';

export async function GET(request: NextRequest) {
  const idToken = request.cookies.get(ID_TOKEN_COOKIE)?.value || '';

  // ID token is required for proper logout - if missing, just clear cookies and redirect
  if (!idToken) {
    const response = NextResponse.redirect(new URL('/', request.url));
    clearAllAuthCookies(response);
    return response;
  }

  try {
    // Use ScaleKit SDK to generate logout URL with proper session termination
    const logoutUrl = await scalekit.getLogoutUrl({
      idTokenHint: idToken,
      postLogoutRedirectUri: 'http://localhost:3000/', // Redirect back to home after ScaleKit logout
    });

    // Redirect to ScaleKit logout endpoint to invalidate their session
    const scalekitResponse = NextResponse.redirect(logoutUrl);

    // Ensure cookies are cleared on this response too
    clearAllAuthCookies(scalekitResponse);

    return scalekitResponse;
  } catch {
    // Fallback to local logout only
  }

  // Create a fallback response for local logout
  const fallbackResponse = NextResponse.redirect(new URL('/', request.url));
  clearAllAuthCookies(fallbackResponse);

  return fallbackResponse;
}

// Helper function to clear all authentication cookies
function clearAllAuthCookies(response: NextResponse) {
  // Set cookies with expired dates to ensure they're deleted
  const cookieOptions = {
    value: '',
    expires: new Date(0),
    maxAge: 0, // Add maxAge=0 for immediate expiration
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  // Clear all auth cookies using the same options they were set with
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', cookieOptions);
  response.cookies.set(TOKEN_EXPIRY_COOKIE, '', cookieOptions);
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', cookieOptions);
  response.cookies.set(ID_TOKEN_COOKIE, '', cookieOptions);

  // Also clear any session cookies that might be present
  response.cookies.set('session', '', cookieOptions);
  response.cookies.set('session.sig', '', cookieOptions);
}
