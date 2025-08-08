'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent') || 'login';
  const redirect =
    searchParams.get('redirect') || (intent === 'signup' ? '/' : '/profile');

  useEffect(() => {
    // Redirect to the auth API with the redirect parameter
    const intentParam = intent ? `&intent=${encodeURIComponent(intent)}` : '';
    router.push(
      `/api/auth?redirect=${encodeURIComponent(redirect)}${intentParam}`
    );
  }, [router, redirect, intent]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
