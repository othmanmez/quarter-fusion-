'use client';

import { useRequireAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600">
            Vous devez être connecté en tant qu'administrateur pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}