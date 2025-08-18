'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome!</h1>
        <p className="text-gray-600 mb-8">
          You've successfully signed in using passwordless authentication.
        </p>

        {/* Sample Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Sample Dashboard
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            This is a simple dashboard page that users see after successful
            authentication.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>Tip:</strong> In a real app, you would display
              user-specific content, settings, or other protected resources
              here.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign in with different email
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
