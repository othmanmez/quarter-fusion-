'use client';

import { useSession } from 'next-auth/react';

export default function AdminTestPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès refusé
          </h1>
          <p className="text-gray-600">
            Vous devez être connecté pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Test Admin
        </h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Statut de connexion :</p>
            <p className="font-medium text-green-600">Connecté</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email :</p>
            <p className="font-medium">{session.user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rôle :</p>
            <p className="font-medium">{(session.user as any)?.role || 'admin'}</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            ✅ L'authentification admin fonctionne correctement !
          </p>
        </div>
      </div>
    </div>
  );
} 