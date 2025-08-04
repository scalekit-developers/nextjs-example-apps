import { NextRequest, NextResponse } from 'next/server';
import { scalekit, handleScalekitError } from '@/lib/scalekit';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const linkToken = searchParams.get('link_token');

    // Get auth request ID from cookie (set during initiation)
    const authReqId = request.cookies.get('auth-request-id')?.value;

    // Validate link token
    if (!linkToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=Invalid magic link`
      );
    }

    // Validate auth request ID (required for Scalekit)
    if (!authReqId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=Invalid magic link - please try again`
      );
    }

    // Verify the magic link token
    const result = await scalekit.passwordless.verifyPasswordlessEmail(
      { linkToken },
      authReqId
    );

    // Create user session
    const userSession = {
      email: result.email,
      verified: true,
      verifiedAt: new Date().toISOString(),
    };

    // Create redirect response to dashboard
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );

    // Set secure session cookie
    response.cookies.set('user-session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });

    // Clear the auth request ID cookie
    response.cookies.set('auth-request-id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error: any) {
    // Handle verification errors
    const { error: errorMessage } = handleScalekitError(
      error,
      'magic link verification'
    );
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent(
        errorMessage
      )}`
    );
  }
}
