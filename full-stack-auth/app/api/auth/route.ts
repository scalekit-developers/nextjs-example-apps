import { NextRequest, NextResponse } from 'next/server';
import scalekit from '@/app/lib/scalekit';

export async function GET(request: NextRequest) {
  try {
    // Get the redirect URL from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const redirectAfterAuth = searchParams.get('redirect') || '/profile';
    const connectionId = searchParams.get('connectionId'); // Optional connection ID
    const organizationId = searchParams.get('organizationId'); // Optional organization ID

    // Encode the redirect URL to use as state parameter
    const state = encodeURIComponent(redirectAfterAuth);

    const authUrl = await getAuthUrl(state, connectionId, organizationId);

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
  } catch (error) {
    console.error('Error in auth route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error during authentication',
      },
      { status: 500 }
    );
  }
}

async function getAuthUrl(
  state: string,
  connectionId?: string | null,
  organizationId?: string | null
) {
  try {
    const redirectUri = 'http://localhost:3000/api/callback';

    // Build the authorization options based on the Scalekit SDK documentation
    const authOptions: {
      scopes: string[];
      state?: string;
      connectionId?: string;
      organizationId?: string;
      prompt?: string;
      responseType?: string;
    } = {
      scopes: ['offline_access', 'openid', 'profile', 'email'],
      state,
      connectionId: connectionId || undefined,
      organizationId: organizationId || undefined,
      responseType: 'code', // Explicitly request authorization code flow
    };

    // Use the Scalekit SDK to generate the authorization URL
    const authUrl = await scalekit.getAuthorizationUrl(
      redirectUri,
      authOptions
    );

    return authUrl;
  } catch (error) {
    console.error('Error generating authorization URL:', error);
    return null;
  }
}
