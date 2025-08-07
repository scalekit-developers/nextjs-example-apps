import { NextRequest, NextResponse } from 'next/server';
import scalekit from '@/app/lib/scalekit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, externalId, metadata } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Get organization ID from environment variable or use the demo organization ID
    const organizationId =
      process.env.SCALEKIT_ORGANIZATION_ID || 'org_69615647365005430';

    // Prepare user data
    const userData = {
      email,
      externalId: externalId || undefined,
      metadata: metadata || {},
      userProfile: {
        firstName,
        lastName,
      },
    };

    // Create user and membership using ScaleKit SDK
    const { user } = await scalekit.user.createUserAndMembership(
      organizationId,
      userData
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.givenName,
        lastName: user.familyName,
      },
      message: 'User invited successfully',
    });
  } catch (error) {
    console.error('Error inviting user:', error);

    // Handle specific ScaleKit errors
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      if (error.message.includes('invalid')) {
        return NextResponse.json(
          { error: 'Invalid user data provided' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to invite user' },
      { status: 500 }
    );
  }
}
