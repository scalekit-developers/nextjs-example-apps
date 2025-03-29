// app/profile/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const response = await fetch('/api/user');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching profile data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch profile data'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto my-8 bg-black rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Profile Page</h1>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/api/logout"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading profile...</p>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <p className="mt-2">Please try logging in again.</p>
        </div>
      ) : profileData ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Profile Data</h2>
          <div className="bg-gray-800 p-5 rounded-lg text-white overflow-auto">
            <pre className="font-mono text-sm whitespace-pre-wrap break-words">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No profile data available</p>
      )}
    </div>
  );
}
