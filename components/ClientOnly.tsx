'use client';

import { useHydrated } from '@/hooks/useHydrated';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}