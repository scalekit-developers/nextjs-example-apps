import { Scalekit } from '@scalekit-sdk/node';

// Required environment variables for Scalekit
const requiredEnvVars = {
  SCALEKIT_ENVIRONMENT_URL: process.env.SCALEKIT_ENVIRONMENT_URL,
  SCALEKIT_CLIENT_ID: process.env.SCALEKIT_CLIENT_ID,
  SCALEKIT_CLIENT_SECRET: process.env.SCALEKIT_CLIENT_SECRET,
};

// Validate that all required environment variables are present
if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_APP_URL');
}

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// Initialize Scalekit SDK
export const scalekit = new Scalekit(
  requiredEnvVars.SCALEKIT_ENVIRONMENT_URL!,
  requiredEnvVars.SCALEKIT_CLIENT_ID!,
  requiredEnvVars.SCALEKIT_CLIENT_SECRET!
);

// App configuration for Scalekit
export const scalekitConfig = {
  magiclinkAuthUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-magic-link`,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
} as const;

// Helper function to handle Scalekit errors with user-friendly messages
export function handleScalekitError(
  error: any,
  context: string
): { error: string; status: number } {
  console.error(`Scalekit ${context} error:`, error);

  // Map Scalekit error codes to user-friendly messages
  const errorMap: Record<string, { error: string; status: number }> = {
    INVALID_EMAIL: { error: 'Invalid email address', status: 400 },
    RATE_LIMIT_EXCEEDED: {
      error: 'Too many requests. Please try again later.',
      status: 429,
    },
    AUTH_REQUEST_EXPIRED: {
      error: 'Authentication request has expired',
      status: 400,
    },
    INVALID_CODE: {
      error: 'Invalid verification code. Please try again.',
      status: 400,
    },
    CODE_EXPIRED: {
      error: 'Verification code has expired. Please request a new one.',
      status: 400,
    },
    TOO_MANY_ATTEMPTS: {
      error: 'Too many verification attempts. Please request a new code.',
      status: 429,
    },
    INVALID_LINK_TOKEN: {
      error: 'Invalid or expired magic link. Please request a new one.',
      status: 400,
    },
    INVALID_ARGUMENT: {
      error: 'Invalid authentication request. Please try again.',
      status: 400,
    },
  };

  // Return specific error if found, otherwise return generic error
  if (error.code && errorMap[error.code]) {
    return errorMap[error.code];
  }

  return {
    error: error.message || `Failed to ${context.toLowerCase()}`,
    status: 500,
  };
}
