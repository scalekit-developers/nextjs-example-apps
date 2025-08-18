import { NextRequest, NextResponse } from 'next/server';
import { scalekit, handleScalekitError } from '@/lib/scalekit';

export async function POST(request: NextRequest) {
  try {
    const { authReqId } = await request.json();

    // Validate auth request ID
    if (!authReqId) {
      return NextResponse.json(
        { error: 'Auth request ID is required' },
        { status: 400 }
      );
    }

    // Resend the verification code
    await scalekit.passwordless.resendPasswordlessEmail(authReqId);

    return NextResponse.json({
      success: true,
      message: 'Verification code resent',
    });
  } catch (error: any) {
    // Handle Scalekit errors gracefully
    const { error: errorMessage, status } = handleScalekitError(
      error,
      'resend code'
    );
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
