'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useBackToHome() {
  const router = useRouter();

  const handleBackToHome = useCallback(() => {
    router.push('/');
    router.refresh();
  }, [router]);

  return handleBackToHome;
}