import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    // Clear all session data
    session.isLoggedIn = false;
    session.username = undefined;
    session.userId = undefined;
    session.userInfo = undefined;
    session.nonce = undefined;
    session.state = undefined;

    await session.save();

    // Get Cognito logout URL
    // Cognito logout URL format:
    // https://[domain].auth.[region].amazoncognito.com/logout?client_id=[app client id]&logout_uri=[redirect URI]
    const clientId =
      process.env.COGNITO_CLIENT_ID || 'k6tana1l8b0bvhk9gfijkurr6';

    const redirectUri = encodeURIComponent(
      new URL('/', request.url).toString()
    );

    console.log('Redirect URI:', redirectUri);

    // Using the domain name format from the Cognito console
    // Usually domain-prefix.auth.region.amazoncognito.com
    const cognitoDomain =
      `${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com` ||
      'eu-north-16m0o668r5.auth.eu-north-1.amazoncognito.com';

    // https://<your-domain>.auth.<region>.amazoncognito.com/logout?client_id=<your-app-client-id>&logout_uri=<your-logout-redirect-uri>
    // https://scalekit-cognito-demo.auth.eu-north-1.amazoncognito.com/logout?client_id=k6tana1l8b0bvhk9gfijkurr6&logout_uri=http%3A%2F%2Flocalhost%3A3000%2F
    const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${redirectUri}`;
    console.log('Logout URL:', logoutUrl);

    // Redirect to Cognito logout endpoint
    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Logout error:', error);
    // If there's an error, still clear the session but redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
}
