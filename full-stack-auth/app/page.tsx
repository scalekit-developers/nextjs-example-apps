'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl  text-gray-800 font-bold mb-6 text-center">
          Full Stack Auth Demo
        </h1>

        <p className="mb-8 text-gray-800 text-center">
          This is a demonstration of a full-stack authentication flow using
          Next.js and an external authentication provider.
        </p>

        <div className="flex justify-center">
          <Link
            href="/profile"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
