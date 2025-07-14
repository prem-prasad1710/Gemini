'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuthStore } from '@/store';

export default function Home() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AuthPage />;
}
