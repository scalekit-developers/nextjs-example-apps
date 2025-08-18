import { NextRequest, NextResponse } from 'next/server';
import { scalekit, scalekitConfig, handleScalekitError } from '@/lib/scalekit';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email input
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send passwordless authentication email
    const result = await scalekit.passwordless.sendPasswordlessEmail(email, {
      expiresIn: 100, // Code expires in 100 seconds
      magiclinkAuthUri: scalekitConfig.magiclinkAuthUri,
    });

    // Create response with auth request ID
    const response = NextResponse.json({
      success: true,
      message:
        'Verification email sent! You can enter the code or click the magic link.',
      authReqId: result.authRequestId,
      passwordlessType: result.passwordlessType,
    });

    // Set auth request ID in cookie for magic link verification
    response.cookies.set('auth-request-id', result.authRequestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes (same as code expiry)
    });

    return response;
  } catch (error: any) {
    // Handle Scalekit errors gracefully
    const { error: errorMessage, status } = handleScalekitError(
      error,
      'authentication initiation'
    );
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
