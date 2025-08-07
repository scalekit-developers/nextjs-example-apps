'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Simple state management
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [authReqId, setAuthReqId] = useState<string | null>(null);
  const [passwordlessType, setPasswordlessType] = useState<string>('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Show error messages from URL parameters (e.g., from callback redirects)
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setMessage({ type: 'error', text: decodeURIComponent(error) });
    }
  }, [searchParams]);

  // Step 1: Send verification email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification email');
      }

      // Move to verification step
      setAuthReqId(data.authReqId);
      setPasswordlessType(data.passwordlessType);
      setStep('code');
      setMessage({
        type: 'success',
        text:
          data.message ||
          'Verification email sent! Check your email for the code or magic link.',
      });

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send verification email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify the code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (code.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a 6-digit code' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authReqId, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      // Success! Redirect to dashboard
      setMessage({ type: 'success', text: 'Success! Redirecting...' });
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to verify code',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email
  const handleResendEmail = async () => {
    if (!authReqId) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authReqId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      setMessage({
        type: 'success',
        text: 'Verification email resent! Check your email.',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to resend verification email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to email step
  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setAuthReqId(null);
    setPasswordlessType('');
    setMessage(null);
  };

  // Get the appropriate title and description based on passwordless type
  const getStepInfo = () => {
    switch (passwordlessType) {
      case 'LINK':
        return {
          title: 'Check your email',
          description: `We sent a magic link to ${email}. Click the link to sign in.`,
        };
      case 'LINK_OTP':
        return {
          title: 'Choose your sign-in method',
          description: `We sent both a verification code and magic link to ${email}. Choose your preferred method:`,
        };
      default: // OTP
        return {
          title: 'Enter verification code',
          description: `We sent a 6-digit code to ${email}. Enter it below to sign in.`,
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'email' ? 'Welcome back' : stepInfo.title}
          </h1>
          <p className="text-gray-600">
            {step === 'email'
              ? 'Enter your email to sign in'
              : stepInfo.description}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Status Message */}
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleSendEmail} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send verification email'}
              </button>
            </form>
          )}

          {/* Verification Step */}
          {step === 'code' && (
            <div className="space-y-6">
              {/* Dual Authentication Options for LINK_OTP */}
              {passwordlessType === 'LINK_OTP' && (
                <div className="space-y-4">
                  {/* Magic Link Option */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        🔗
                      </div>
                      <div className="flex-1">
                        <h3 className="text-blue-900 font-semibold mb-1">
                          Magic Link (Recommended)
                        </h3>
                        <p className="text-blue-700 text-sm mb-3">
                          Click the magic link in your email for instant
                          sign-in. No code needed!
                        </p>
                        <div className="bg-blue-100 rounded-md p-3">
                          <p className="text-blue-800 text-sm font-medium">
                            📧 Check your email and click the magic link
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  {/* Verification Code Option */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        🔢
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-semibold mb-1">
                          Verification Code
                        </h3>
                        <p className="text-gray-700 text-sm mb-3">
                          Enter the 6-digit code from your email below.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Magic Link Info for LINK only */}
              {passwordlessType === 'LINK' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      🔗
                    </div>
                    <div>
                      <p className="text-blue-800 font-medium mb-1">
                        Magic link sent!
                      </p>
                      <p className="text-blue-700 text-sm">
                        Check your email and click the magic link to sign in
                        instantly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Code Input for OTP or LINK_OTP */}
              {(passwordlessType === 'OTP' ||
                passwordlessType === 'LINK_OTP' ||
                step === 'code') && (
                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div>
                    <label
                      htmlFor="code"
                      className="text-sm font-medium text-gray-700 block mb-2"
                    >
                      Verification code
                    </label>
                    <input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ''))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                      placeholder="123456"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the 6-digit code from your email
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Verifying...' : 'Verify code'}
                  </button>
                </form>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  ← Back to email
                </button>

                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full text-blue-600 py-2 px-4 rounded-lg font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Resend verification email'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
