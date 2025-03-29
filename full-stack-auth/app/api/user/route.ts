import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '../callback/route';

export async function GET(request: NextRequest) {
  // Get the access token from cookies
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Fetch user profile data from the authentication provider
    const userProfile = await fetchUserProfile(accessToken);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 400 }
      );
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

async function fetchUserProfile(accessToken: string) {
  try {
    // Use the access token to fetch user profile from your auth provider
    const response = await fetch(
      `${process.env.SCALEKIT_ENVIRONMENT_URL}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
