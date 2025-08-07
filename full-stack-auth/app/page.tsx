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
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2"
          >
            Try the Demo Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
