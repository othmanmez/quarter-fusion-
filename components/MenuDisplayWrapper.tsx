'use client';

import ClientMenuInteraction from './ClientMenuInteraction';
import { useMenuData } from '../hooks/useMenuData';
import { MenuItem } from '../app/types/menu';

interface MenuDisplayWrapperProps {
  mode: 'click-and-collect' | 'livraison';
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  showAddToCart?: boolean;
}

export default function MenuDisplayWrapper({ mode, onAddToCart, showAddToCart = false }: MenuDisplayWrapperProps) {
  const { menuItems, categories, error, isLoading, refetch } = useMenuData(mode);

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {[120, 100, 140, 90, 110, 130].map((width, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded-full animate-pulse"
                style={{ width: width + 'px' }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
                <div className="mb-4">
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <div className="text-red-600 text-lg font-medium mb-2">Erreur</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Aucun plat disponible
        </h3>
        <p className="text-gray-500">
          Aucun plat n'est disponible pour {mode === 'click-and-collect' ? 'le retrait en restaurant' : 'la livraison'} pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ClientMenuInteraction 
        menuItems={menuItems}
        categories={categories}
        onAddToCart={onAddToCart}
        showAddToCart={showAddToCart}
      />
    </div>
  );
}