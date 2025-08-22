'use client';

import { useState } from 'react';

import { MenuItem, Category } from '../app/types/menu';

interface ClientMenuInteractionProps {
  menuItems: MenuItem[];
  categories: Category[];
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  showAddToCart?: boolean;
}

export default function ClientMenuInteraction({ menuItems, categories, onAddToCart, showAddToCart }: ClientMenuInteractionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showCustomization, setShowCustomization] = useState<string | null>(null);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    if (onAddToCart) {
      onAddToCart(item, quantity);
      setQuantities(prev => ({ ...prev, [item.id]: 0 }));
      setShowCustomization(null);
    }
  };

  const toggleCustomization = (itemId: string) => {
    setShowCustomization(showCustomization === itemId ? null : itemId);
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category.name === selectedCategory);

  return (
    <>
      {/* Filtres par catégorie */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === 'all'
                ? 'bg-red-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tout le menu
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.name
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Affichage des plats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image placeholder */}
            <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center relative">
              <div className="text-red-600 text-4xl">🍔</div>
              
              {/* Icône de personnalisation */}
              <button
                onClick={() => toggleCustomization(item.id)}
                className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 shadow-sm"
                title="Personnaliser"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <span className="text-xl font-bold text-red-700">
                  {item.price.toFixed(2)}€
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {item.description}
              </p>

              {/* Badge catégorie */}
              <div className="mb-4">
                <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {item.category.name}
                </span>
                {item.badge && (
                  <span className={`ml-2 inline-block text-xs font-bold px-2 py-1 rounded-full ${
                    item.badge === 'HOT' ? 'bg-red-100 text-red-800' :
                    item.badge === 'NEW' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Options de personnalisation */}
              {showCustomization === item.id && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Personnalisation :</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Sans oignon</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Sans fromage</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Sauce à part</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Bien cuit</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Contrôles de quantité et ajout au panier */}
              {showAddToCart && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {quantities[item.id] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                      className="w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center hover:bg-red-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={(quantities[item.id] || 0) === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      (quantities[item.id] || 0) === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-700 text-white hover:bg-red-800'
                    }`}
                  >
                    Ajouter
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun plat trouvé */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            Aucun plat trouvé
          </h3>
          <p className="text-gray-500">
            Aucun plat disponible dans cette catégorie pour le moment.
          </p>
        </div>
      )}
    </>
  );
}