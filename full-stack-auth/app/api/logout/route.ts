import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  ID_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_EXPIRY_COOKIE,
} from '../callback/route';

export async function GET(request: NextRequest) {
  const idToken = request.cookies.get(ID_TOKEN_COOKIE)?.value || '';

  console.log('ID Token:', idToken);

  // Ensure the post_logout_redirect_uri is properly encoded
  const postLogoutRedirectUri = encodeURIComponent('http://localhost:3000/');

  // Only redirect to ScaleKit's logout endpoint if we have an ID token
  // Otherwise, we must have already initiated the logout process
  if (idToken) {
    // Create a response that redirects to the ScaleKit logout endpoint
    const logoutUrl = `${process.env.SCALEKIT_ENVIRONMENT_URL}/end_session?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}`;
    console.log('Redirecting to ScaleKit logout URL:', logoutUrl);

    const response = NextResponse.redirect(logoutUrl);

    // Clear all authentication cookies
    clearAllAuthCookies(response);

    return response;
  } else {
    // We've already cleared cookies in a previous invocation
    // Let the user continue to the home page or wherever they were headed
    console.log(
      'Already logged out (no ID token found). Continuing to home page...'
    );
    return NextResponse.redirect('http://localhost:3000/');
  }
}

// Helper function to clear all authentication cookies
function clearAllAuthCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(TOKEN_EXPIRY_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  response.cookies.delete(ID_TOKEN_COOKIE);
  console.log('All authentication cookies cleared');
}
