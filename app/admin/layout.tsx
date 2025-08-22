'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LoginModal from '@/components/admin/LoginModal';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading, isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Afficher le modal de login si pas authentifié (sauf sur la page de login)
  const shouldShowModal = !isAuthenticated && pathname !== '/admin/login' && !isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Quarter Fusion Admin
            </h1>
            <p className="text-gray-600 mb-6">
              Veuillez vous connecter pour accéder au panneau d'administration
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
        <LoginModal 
          isOpen={shouldShowModal || showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Menus', href: '/admin/menu', icon: '🍽️' },
    { name: 'Catégories', href: '/admin/categories', icon: '📂' },
    { name: 'Commandes', href: '/admin/orders', icon: '📋' },
    { name: 'Paramètres', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin/dashboard" className="text-xl font-bold text-red-600">
                  Quarter Fusion Admin
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="border-transparent text-gray-500 hover:border-red-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user?.email}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation mobile */}
      <div className="sm:hidden bg-white border-b">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 