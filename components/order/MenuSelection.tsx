'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useOrder, MenuItem } from '../../contexts/OrderContext';
import CustomizationModal from './CustomizationModal';

interface MenuSelectionProps {
  onNext: () => void;
}

export default function MenuSelection({ onNext }: MenuSelectionProps) {
  const { addToCart } = useOrder();
  const [menu, setMenu] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Modal de personnalisation
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Récupérer le menu depuis l'API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/menu');
        const data = await response.json();

        if (data.success) {
          setMenu(data.menu);
          // Sélectionner la première catégorie disponible
          const categories = Object.keys(data.menu);
          if (categories.length > 0) {
            setSelectedCategory(categories[0]);
          }
        } else {
          setError('Erreur lors du chargement du menu');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
        setError('Erreur lors du chargement du menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Fonction pour ouvrir le modal de personnalisation
  const handleAddToCart = (item: MenuItem) => {
    setSelectedItem(item);
    setShowCustomizationModal(true);
  };

  // Fonction pour ajouter au panier avec personnalisations
  const handleAddWithCustomizations = (item: MenuItem, customizations: any[], quantity: number) => {
    // Ajouter au panier avec les personnalisations
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...item, customizations });
    }
  };

  // Les noms de catégories viennent directement de la base de données
  // Pas besoin de mapping, on utilise les noms tels quels

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-600">Chargement du menu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">
            Erreur de chargement
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* En-tête */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez vos plats
        </h2>
        <p className="text-gray-600">
          Sélectionnez les plats que vous souhaitez commander
        </p>
      </div>

      {/* Navigation des catégories */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {Object.keys(menu).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                selectedCategory === category
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des plats de la catégorie sélectionnée */}
      <div className="p-6">
        {menu[selectedCategory] && menu[selectedCategory].length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menu[selectedCategory].map((item) => (
              <div
                key={item.id || item._id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white ${
                          item.badge === 'HOT' ? 'bg-red-600' :
                          item.badge === 'NEW' ? 'bg-green-600' :
                          'bg-blue-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-red-600">
                      {item.price.toFixed(2)}€
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Aucun plat disponible dans cette catégorie
            </p>
          </div>
        )}
      </div>

      {/* Modal de personnalisation */}
      {selectedItem && (
        <CustomizationModal
          item={selectedItem}
          isOpen={showCustomizationModal}
          onClose={() => {
            setShowCustomizationModal(false);
            setSelectedItem(null);
          }}
          onAddToCart={handleAddWithCustomizations}
        />
      )}
    </div>
  );
} 