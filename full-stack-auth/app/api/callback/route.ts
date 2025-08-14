import { NextRequest, NextResponse } from 'next/server';
import scalekit from '@/app/lib/scalekit';
import { jwtDecode } from 'jwt-decode';
import {
  ACCESS_TOKEN_COOKIE,
  ID_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_EXPIRY_COOKIE,
} from '@/app/lib/constants';

const redirectUri = 'http://localhost:3000/api/callback';

export async function GET(request: NextRequest) {
  // Get data from URL parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code') || '';
  const state = searchParams.get('state') || '';
  const error = searchParams.get('error') || '';

  // In some OIDC flows, the ID token might be returned directly in the URL
  const idTokenFromUrl = searchParams.get('id_token') || '';

  if (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      {
        error_code: 'Error during authentication',
        errorDetails: String(error),
      },
      { status: 400 }
    );
  }

  // Use Scalekit SDK to exchange authorization code for tokens
  try {
    const authResult = await scalekit.authenticateWithCode(code, redirectUri);

    if (!authResult || !authResult.accessToken) {
      console.error('Failed to get access token');
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 400 }
      );
    }

    // Extract ID token from the expected response structure
    const idTokenFromResponse = authResult?.idToken || '';

    // Use the ID token from response, URL, or empty string
    const finalIdToken = idTokenFromResponse || idTokenFromUrl || '';

    // Validate that we have an ID token - it's required for proper logout
    if (!finalIdToken) {
      console.error(
        'Failed to get ID token - required for logout functionality'
      );
      return NextResponse.json(
        { error: 'Failed to get ID token' },
        { status: 400 }
      );
    }

    // Decode the JWT to get the expiration time
    const decodedToken = jwtDecode<{ exp?: number }>(authResult.accessToken);
    const expiryTime = decodedToken.exp ? decodedToken.exp * 1000 : 0; // Convert to milliseconds

    // Decode the state parameter to get the redirect URL
    const redirectTo = state ? decodeURIComponent(state) : '/profile';

    // Create a response that redirects to the original URL or profile page
    const response = NextResponse.redirect(new URL(redirectTo, request.url));

    // Set the access token and expiry time as cookies
    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: authResult.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // Set the cookie to expire when the token expires
      expires: new Date(expiryTime),
    });

    // Store the expiry time as a separate cookie for easy access in middleware
    response.cookies.set({
      name: TOKEN_EXPIRY_COOKIE,
      value: expiryTime.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiryTime),
    });

    const refreshToken = authResult.refreshToken;

    if (refreshToken) {
      // Set the refresh token as a cookie
      response.cookies.set({
        name: REFRESH_TOKEN_COOKIE,
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        // Set a long expiration for refresh token
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
    }

    // Store the id_token as a cookie if it exists
    if (finalIdToken) {
      // Keep the ID token cookie longer so it's available for logout even after access token expires
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      response.cookies.set({
        name: ID_TOKEN_COOKIE,
        value: finalIdToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: thirtyDaysFromNow,
      });
    }

    return response;
  } catch (err) {
    console.error('Error exchanging code:', err);
    return NextResponse.json(
      { error: 'Failed to authenticate user' },
      { status: 500 }
    );
  }
}
