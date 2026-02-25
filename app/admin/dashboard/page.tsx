'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Stats {
  totalMenuItems: number;
  totalCategories: number;
  bestSellersCount: number;
  availableItems: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalMenuItems: 0,
    totalCategories: 0,
    bestSellersCount: 0,
    availableItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/categories')
      ]);
      
      const menuData = await menuRes.json();
      const catData = await catRes.json();
      
      if (menuData.success && catData.success) {
        const items = menuData.items || [];
        setStats({
          totalMenuItems: items.length,
          totalCategories: catData.categories?.length || 0,
          bestSellersCount: items.filter((item: any) => item.badge).length,
          availableItems: items.filter((item: any) => item.available).length
        });
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-black">
            Bienvenue sur votre espace d'administration Quarter Fusion
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            👤 {user?.name || user?.email}
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" 
               title="Système en ligne" />
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/menu" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Plats au menu</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalMenuItems}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/categories" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📂</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Catégories</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalCategories}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/menu" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Best-Sellers</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.bestSellersCount}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/menu" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Plats disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.availableItems}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href="/admin/menu/new" className="flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border-2 border-transparent hover:border-red-200">
            <span className="text-2xl mr-3">➕</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Ajouter un plat</p>
              <p className="text-sm text-black">Nouveau menu</p>
            </div>
          </Link>

          <Link href="/admin/menu" className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border-2 border-transparent hover:border-blue-200">
            <span className="text-2xl mr-3">🍽️</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Gérer les menus</p>
              <p className="text-sm text-black">Modifier, supprimer</p>
            </div>
          </Link>

          <Link href="/admin/categories" className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border-2 border-transparent hover:border-green-200">
            <span className="text-2xl mr-3">📂</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Catégories</p>
              <p className="text-sm text-black">Organiser le menu</p>
            </div>
          </Link>

          <Link href="/admin/settings" className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border-2 border-transparent hover:border-purple-200">
            <span className="text-2xl mr-3">⚙️</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Paramètres</p>
              <p className="text-sm text-black">Configuration</p>
            </div>
          </Link>

          <Link href="/admin/delivery-cities" className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border-2 border-transparent hover:border-yellow-200">
            <span className="text-2xl mr-3">🚚</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Villes de livraison</p>
              <p className="text-sm text-black">Zones et frais</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Guide rapide */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-3xl">📚</span>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎯 Guide rapide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900 mb-2">✨ Best-Sellers (page d'accueil) :</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Les 3 plats avec badge HOT/NEW/TOP</li>
                  <li>• Seulement 3 plats affichés</li>
                  <li>• Modifier un plat → Sélectionner badge</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">🖼️ Ajouter des images :</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Upload sur <a href="https://imgur.com" target="_blank" className="text-red-600 hover:underline">Imgur.com</a></li>
                  <li>• Copier le lien de l'image</li>
                  <li>• Coller dans le champ "Image"</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">⚙️ Activer/Désactiver services :</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Paramètres → Toggles</li>
                  <li>• Click & Collect / Livraison</li>
                  <li>• Badge "Fermé" affiché si OFF</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">🎨 Badges :</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• HOT 🔥 : Plat tendance</li>
                  <li>• NEW ✨ : Nouvelle création</li>
                  <li>• TOP ⭐ : Meilleure vente</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-sm text-black">
                📖 <strong>Guide complet</strong> : Consultez le fichier <code className="bg-white px-2 py-1 rounded">GUIDE-ADMIN.md</code> à la racine du projet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}