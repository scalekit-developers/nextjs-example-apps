import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, TOKEN_EXPIRY_COOKIE } from '../callback/route';
import { jwtDecode } from 'jwt-decode';

// Add this constant
const REFRESH_TOKEN_COOKIE = 'auth_refresh_token';

export async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const redirectPath =
    request.nextUrl.searchParams.get('redirect') || '/profile';

  if (!refreshToken) {
    // No refresh token, redirect to login
    const authUrl = new URL('/api/auth', request.url);
    authUrl.searchParams.set('redirect', redirectPath);
    return NextResponse.redirect(authUrl);
  }

  try {
    // Exchange refresh token for new access token
    const tokenResponse = await refreshAccessToken(refreshToken);

    if (!tokenResponse || !tokenResponse.access_token) {
      throw new Error('Failed to refresh access token');
    }

    // Decode the JWT to get the expiration time
    const decodedToken = jwtDecode<{ exp?: number }>(
      tokenResponse.access_token
    );
    const expiryTime = decodedToken.exp ? decodedToken.exp * 1000 : 0;

    // Create a response that redirects to the original URL
    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    // Set the new access token as a cookie
    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: tokenResponse.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiryTime),
    });

    // Store the expiry time as a separate cookie
    response.cookies.set({
      name: TOKEN_EXPIRY_COOKIE,
      value: expiryTime.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiryTime),
    });

    // If we got a new refresh token, update it
    if (tokenResponse.refresh_token) {
      response.cookies.set({
        name: REFRESH_TOKEN_COOKIE,
        value: tokenResponse.refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);

    // Failed to refresh, redirect to login
    const authUrl = new URL('/api/auth', request.url);
    authUrl.searchParams.set('redirect', redirectPath);
    return NextResponse.redirect(authUrl);
  }
}

async function refreshAccessToken(refreshToken: string) {
  const url = `${process.env.SCALEKIT_ENVIRONMENT_URL}/oauth/token`;

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: process.env.SCALEKIT_CLIENT_ID || '',
    client_secret: process.env.SCALEKIT_CLIENT_SECRET || '',
    grant_type: 'refresh_token',
  });

  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
