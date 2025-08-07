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

  console.log('Logout initiated');
  console.log('ID Token present:', !!idToken);
  console.log('All cookies:', request.cookies.getAll());

  // Try to use ScaleKit's proper logout method if possible
  if (idToken) {
    try {
      // Use ScaleKit SDK to generate logout URL
      const logoutUrl = await scalekit.getLogoutUrl({
        idTokenHint: idToken,
        postLogoutRedirectUri: 'http://localhost:3000/',
      });

      console.log('ScaleKit logout URL generated:', logoutUrl);

      // Create response that redirects to ScaleKit logout endpoint
      const response = NextResponse.redirect(logoutUrl);

      // Clear all authentication cookies
      clearAllAuthCookies(response);

      console.log('Logout completed - redirecting to ScaleKit logout endpoint');
      return response;
    } catch (error) {
      console.log(
        'ScaleKit logout failed, falling back to local logout:',
        error
      );
      // Fallback to local logout only
    }
  }

  // Fallback: Clear local cookies and redirect to home
  const response = NextResponse.redirect('http://localhost:3000/');
  clearAllAuthCookies(response);

  console.log('Logout completed - cookies cleared, redirecting to home');
  return response;
}

// Helper function to clear all authentication cookies
function clearAllAuthCookies(response: NextResponse) {
  // Set cookies with expired dates to ensure they're deleted
  // Must match the exact attributes used when setting the cookies
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: '',
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  response.cookies.set({
    name: TOKEN_EXPIRY_COOKIE,
    value: '',
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: '',
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  response.cookies.set({
    name: ID_TOKEN_COOKIE,
    value: '',
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  console.log('All authentication cookies cleared');
}
