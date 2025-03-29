import { NextRequest, NextResponse } from 'next/server';
import scalekit from '@/app/lib/scalekit';

export async function GET(request: NextRequest) {
  // Get the redirect URL from the query parameters
  const searchParams = request.nextUrl.searchParams;
  const redirectAfterAuth = searchParams.get('redirect') || '/profile';

  // Encode the redirect URL to use as state parameter
  const state = encodeURIComponent(redirectAfterAuth);

  const authUrl = await getAuthUrl(state);

  // If we have an auth URL, redirect to it
  if (authUrl) {
    return NextResponse.redirect(authUrl);
  }

  // If we don't have an auth URL, return an error
  return NextResponse.json(
    {
      error: 'Failed to generate authentication URL',
    },
    { status: 500 }
  );
}

async function getAuthUrl(state: string) {
  try {
    const redirectUri = 'http://localhost:3000/api/callback';

    // Ensure we're requesting openid scope to get the ID token
    // The ScaleKit SDK should add the necessary parameters based on these scopes
    const authUrl = await scalekit.getAuthorizationUrl(redirectUri, {
      // connectionId: 'conn_59615204090052747',
      scopes: ['offline_access', 'openid', 'profile', 'email'],
      state,
    });

    console.log('Generated auth URL with scopes:', [
      'offline_access',
      'openid',
      'profile',
      'email',
    ]);

    return authUrl;
  } catch (error) {
    console.error('Error at getAuthUrl:', error);
    return null;
  }
}
