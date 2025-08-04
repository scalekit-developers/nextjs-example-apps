import { NextRequest, NextResponse } from 'next/server';
import { scalekit, handleScalekitError } from '@/lib/scalekit';

export async function POST(request: NextRequest) {
  try {
    const { authReqId, code } = await request.json();

    // Validate required inputs
    if (!authReqId || !code) {
      return NextResponse.json(
        { error: 'Auth request ID and verification code are required' },
        { status: 400 }
      );
    }

    if (code.length !== 6) {
      return NextResponse.json(
        { error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    // Verify the passwordless authentication code
    const result = await scalekit.passwordless.verifyPasswordlessEmail(
      { code },
      authReqId
    );

    // Create a simple user session
    const userSession = {
      email: result.email || 'user@example.com',
      authRequestId: authReqId,
      verified: true,
      verifiedAt: new Date().toISOString(),
    };

    // Create success response
    const response = NextResponse.json({
      success: true,
      message: 'Verification successful',
      user: userSession,
    });

    // Set secure session cookie
    response.cookies.set('user-session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error: any) {
    // Handle Scalekit errors gracefully
    const { error: errorMessage, status } = handleScalekitError(
      error,
      'code verification'
    );
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
