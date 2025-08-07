# Scalekit SDK Configuration

This directory contains the centralized Scalekit SDK configuration for the passwordless authentication app.

## Files

### `scalekit.ts`

The main Scalekit SDK configuration file that provides:

- **`scalekit`**: Pre-configured Scalekit SDK instance
- **`scalekitConfig`**: Common configuration constants
- **`handleScalekitError`**: Centralized error handling function

## Usage

### Import the SDK

```typescript
import { scalekit, scalekitConfig, handleScalekitError } from '@/lib/scalekit';
```

### Environment Variables Required

Make sure these environment variables are set in your `.env.local` file:

```env
SCALEKIT_ENVIRONMENT_URL=your_environment_url
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_APP_URL=your_app_url
```

### Example Usage in Route Handlers

#### Initiate Authentication

```typescript
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const result = await scalekit.passwordless.sendPasswordlessEmail(email, {
      expiresIn: 100,
      magiclinkAuthUri: scalekitConfig.magiclinkAuthUri,
    });

    return NextResponse.json({
      success: true,
      authReqId: result.authRequestId,
    });
  } catch (error: any) {
    const { error: errorMessage, status } = handleScalekitError(
      error,
      'authentication initiation'
    );
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
```

#### Handle Authentication Callback

```typescript
export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');

    const result = await scalekit.authenticateWithCode(
      code,
      scalekitConfig.redirectUri
    );

    // Handle successful authentication...
  } catch (error: any) {
    const { error: errorMessage } = handleScalekitError(
      error,
      'authentication callback'
    );
    return NextResponse.redirect(
      `${scalekitConfig.appUrl}/login?error=${encodeURIComponent(errorMessage)}`
    );
  }
}
```

## Benefits

1. **Centralized Configuration**: All Scalekit settings in one place
2. **Environment Validation**: Automatic validation of required environment variables
3. **Consistent Error Handling**: Standardized error responses across all routes
4. **Type Safety**: Full TypeScript support with proper type checking
5. **Maintainability**: Easy to update SDK configuration across the entire app
