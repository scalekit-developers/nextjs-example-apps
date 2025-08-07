import { NextRequest, NextResponse } from 'next/server';
import { scalekit, scalekitConfig, handleScalekitError } from '@/lib/scalekit';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${scalekitConfig.appUrl}/login?error=${encodeURIComponent(
          errorDescription || error
        )}`
      );
    }

    // Validate authorization code
    if (!code) {
      return NextResponse.redirect(
        `${scalekitConfig.appUrl}/login?error=No authorization code received`
      );
    }

    // Authenticate with the authorization code
    const result = await scalekit.authenticateWithCode(
      code,
      scalekitConfig.redirectUri
    );

    // Create user session data
    const userSession = {
      email: result.user.email,
      idToken: result.idToken,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    };

    // Create redirect response to dashboard
    const response = NextResponse.redirect(
      `${scalekitConfig.appUrl}/dashboard?user=${encodeURIComponent(
        JSON.stringify(userSession)
      )}`
    );

    // Set secure session cookie
    response.cookies.set('user-session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: result.expiresIn,
    });

    return response;
  } catch (error: any) {
    // Handle authentication errors
    const { error: errorMessage } = handleScalekitError(
      error,
      'authentication callback'
    );
    return NextResponse.redirect(
      `${scalekitConfig.appUrl}/login?error=${encodeURIComponent(errorMessage)}`
    );
  }
}
