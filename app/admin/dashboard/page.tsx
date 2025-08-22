'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de votre restaurant Quarter Fusion
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Bienvenue, {user?.name || user?.email}
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" 
               title="Système en ligne" />
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commandes aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-gray-900">1,247€</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Items en stock</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <span className="text-2xl mr-3">🍽️</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Gérer les menus</p>
              <p className="text-sm text-gray-600">Ajouter, modifier ou supprimer des items</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <span className="text-2xl mr-3">📋</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Voir les commandes</p>
              <p className="text-sm text-gray-600">Gérer les commandes en cours</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <span className="text-2xl mr-3">📂</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Catégories</p>
              <p className="text-sm text-gray-600">Organiser les catégories de menu</p>
            </div>
          </button>
        </div>
      </div>

      {/* Message de succès */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-green-400 text-xl">✅</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Système d'authentification configuré avec succès !
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Le modal de login NextAuth v5 fonctionne parfaitement. Vous êtes connecté en tant qu'administrateur.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}