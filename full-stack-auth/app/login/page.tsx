'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';

  useEffect(() => {
    // Redirect to the auth API with the redirect parameter
    router.push(`/api/auth?redirect=${encodeURIComponent(redirect)}`);
  }, [router, redirect]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Redirecting to login...</h1>
      <p>Please wait while we redirect you to the login page.</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginRedirect />
      </Suspense>
    </div>
  );
}
