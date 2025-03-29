import { NextRequest, NextResponse } from 'next/server';
// import scalekit from '@/app/lib/scalekit';
import { jwtDecode } from 'jwt-decode';

const redirectUri = 'http://localhost:3000/api/callback';

// Cookie name for the access token
export const ACCESS_TOKEN_COOKIE = 'auth_access_token';
// Cookie name for the token expiration
export const TOKEN_EXPIRY_COOKIE = 'auth_token_expiry';
// Cookie name for the refresh token
export const REFRESH_TOKEN_COOKIE = 'auth_refresh_token';
// Cookie name for the id token
export const ID_TOKEN_COOKIE = 'auth_id_token';

export async function GET(request: NextRequest) {
  // Instead of parsing body, get data from URL parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code') || '';
  const state = searchParams.get('state') || '';
  const error = searchParams.get('error') || '';

  console.log('Code', code);

  // In some OIDC flows, the ID token might be returned directly in the URL
  const idTokenFromUrl = searchParams.get('id_token') || '';

  console.log('Auth callback URL parameters:', {
    code: !!code,
    state: !!state,
    error: !!error,
    idTokenPresent: !!idTokenFromUrl,
  });

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

  // Exchange the code for tokens
  console.log('Code received:', code);
  const result = await exchangeCodeForToken(code, redirectUri);
  console.log('Result:', result);

  console.log('Authentication tokens received:', {
    accessToken: !!result?.access_token,
    refreshToken: !!result?.refresh_token,
    idToken: !!result?.id_token,
  });

  if (!result || !result.access_token) {
    console.error('Failed to get access token');
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 400 }
    );
  }

  // Use the ID token from URL if it's available and not in the token response
  const finalIdToken = result.id_token || idTokenFromUrl || '';
  if (!result.id_token && idTokenFromUrl) {
    console.log('Using ID token from URL instead of token response');
    // Add the ID token to the result for easier handling
    result.id_token = idTokenFromUrl;
  }

  // Decode the JWT to get the expiration time
  const decodedToken = jwtDecode<{ exp?: number }>(result.access_token);
  const expiryTime = decodedToken.exp ? decodedToken.exp * 1000 : 0; // Convert to milliseconds

  // Decode the state parameter to get the redirect URL
  const redirectTo = state ? decodeURIComponent(state) : '/profile';

  // Create a response that redirects to the original URL or profile page
  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  // Set the access token and expiry time as cookies
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: result.access_token,
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

  const refreshToken = result.refresh_token;

  if (refreshToken) {
    console.log('Setting refresh token cookie');
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
    console.log('Setting ID token cookie');
    response.cookies.set({
      name: ID_TOKEN_COOKIE,
      value: finalIdToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // Use the same expiration as the access token
      expires: new Date(expiryTime),
    });
  } else {
    console.warn('No ID token received from the authentication provider');
  }

  return response;
}

async function exchangeCodeForToken(code: string, redirectUri: string) {
  const url = `${process.env.SCALEKIT_ENVIRONMENT_URL}/oauth/token`;
  console.log('URL to get token:', url);

  // Make sure we're requesting openid scope to get the ID token
  const params = new URLSearchParams({
    code,
    redirect_uri: redirectUri || '',
    client_id: process.env.SCALEKIT_CLIENT_ID || '',
    client_secret: process.env.SCALEKIT_CLIENT_SECRET || '',
    grant_type: 'refresh_token',
    scope: 'openid profile email', // Ensure we're requesting openid scope
  });

  try {
    console.log(
      'Sending token request with params:',
      Object.fromEntries(params)
    );

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Token response keys:', Object.keys(data));
    return data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
}
