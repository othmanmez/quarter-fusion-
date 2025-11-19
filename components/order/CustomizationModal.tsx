'use client';

import { useState, useEffect } from 'react';

interface CustomizationOption {
  name: string;
  priceExtra: number;
}

interface Customization {
  id: string;
  name: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TOGGLE';
  required: boolean;
  options: CustomizationOption[];
}

interface MenuItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  allowDrinkOption?: boolean;
  drinkPrice?: number;
}

interface DrinkItem {
  id: string;
  title: string;
  price: number;
}

export interface SelectedCustomization {
  name: string;
  selectedOptions: string[];
  priceExtra: number;
}

interface CustomizationModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customizations: SelectedCustomization[], quantity: number) => void;
}

export default function CustomizationModal({
  item,
  isOpen,
  onClose,
  onAddToCart
}: CustomizationModalProps) {
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  
  // État pour l'option boisson
  const [drinkWanted, setDrinkWanted] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<string>('');
  const [availableDrinks, setAvailableDrinks] = useState<DrinkItem[]>([]);
  const [loadingDrinks, setLoadingDrinks] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      fetchCustomizations();
      if (item.allowDrinkOption) {
        fetchDrinks();
      }
      // Reset états
      setDrinkWanted(false);
      setSelectedDrink('');
    }
  }, [isOpen, item]);

  const fetchCustomizations = async () => {
    try {
      setLoading(true);
      const itemId = item.id || item._id;
      const response = await fetch(`/api/menu/${itemId}/customizations`);
      const data = await response.json();

      if (data.success) {
        const customs = data.customizations || [];
        setCustomizations(customs);
        
        // Initialiser les options sélectionnées
        const initial: Record<string, string[]> = {};
        customs.forEach((custom: Customization) => {
          initial[custom.id] = [];
        });
        setSelectedOptions(initial);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrinks = async () => {
    try {
      setLoadingDrinks(true);
      const response = await fetch('/api/menu');
      const data = await response.json();

      if (data.success) {
        // Filtrer pour ne garder que les boissons disponibles
        const drinks = (data.items || [])
          .filter((item: any) => item.category.slug === 'boissons' && item.available)
          .map((drink: any) => ({
            id: drink.id,
            title: drink.title,
            price: drink.price
          }));
        setAvailableDrinks(drinks);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des boissons:', error);
    } finally {
      setLoadingDrinks(false);
    }
  };

  const handleOptionChange = (customId: string, optionName: string, type: string) => {
    setSelectedOptions(prev => {
      const current = prev[customId] || [];
      
      if (type === 'SINGLE_CHOICE' || type === 'TOGGLE') {
        // Pour choix unique, remplacer
        return { ...prev, [customId]: [optionName] };
      } else {
        // Pour choix multiples, toggle
        if (current.includes(optionName)) {
          return { ...prev, [customId]: current.filter(o => o !== optionName) };
        } else {
          return { ...prev, [customId]: [...current, optionName] };
        }
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = item.price * quantity;
    
    // Ajouter le prix des personnalisations
    customizations.forEach(custom => {
      const selected = selectedOptions[custom.id] || [];
      selected.forEach(optName => {
        const option = custom.options.find(opt => opt.name === optName);
        if (option) {
          total += option.priceExtra * quantity;
        }
      });
    });
    
    // Ajouter le prix de la boisson si sélectionnée
    if (drinkWanted && item.drinkPrice) {
      total += item.drinkPrice * quantity;
    }
    
    return total;
  };

  const handleAddToCart = () => {
    // Vérifier les champs obligatoires
    const missingRequired = customizations.find(custom => 
      custom.required && (!selectedOptions[custom.id] || selectedOptions[custom.id].length === 0)
    );

    if (missingRequired) {
      alert(`"${missingRequired.name}" est obligatoire`);
      return;
    }

    // Vérifier si une boisson est voulue mais non sélectionnée
    if (drinkWanted && !selectedDrink) {
      alert('Veuillez sélectionner une boisson');
      return;
    }

    // Construire les personnalisations sélectionnées
    const selectedCustoms: SelectedCustomization[] = customizations
      .map(custom => {
        const selected = selectedOptions[custom.id] || [];
        if (selected.length === 0) return null;

        const priceExtra = selected.reduce((sum, optName) => {
          const option = custom.options.find(opt => opt.name === optName);
          return sum + (option?.priceExtra || 0);
        }, 0);

        return {
          name: custom.name,
          selectedOptions: selected,
          priceExtra
        };
      })
      .filter(Boolean) as SelectedCustomization[];

    // Ajouter la boisson si sélectionnée
    if (drinkWanted && selectedDrink) {
      const drink = availableDrinks.find(d => d.id === selectedDrink);
      if (drink) {
        selectedCustoms.push({
          name: `Boisson`,
          selectedOptions: [drink.title],
          priceExtra: item.drinkPrice || 0
        });
      }
    }

    onAddToCart(item, selectedCustoms, quantity);
    onClose();
    
    // Reset
    setQuantity(1);
    setSelectedOptions({});
    setDrinkWanted(false);
    setSelectedDrink('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header avec image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si l'image ne charge pas, afficher une image par défaut
              e.currentTarget.src = '/images/placeholder.svg';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Titre et prix */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="text-2xl font-bold text-red-600 mb-6">
            Prix de base : {item.price.toFixed(2)}€
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            </div>
          ) : customizations.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-600 text-center">
                Aucune personnalisation disponible pour ce plat
              </p>
            </div>
          ) : (
            <div className="space-y-6 mb-6">
              {customizations.map((custom) => (
                <div key={custom.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{custom.name}</h3>
                    {custom.required && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                        Obligatoire
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {custom.options.map((option) => (
                      <label
                        key={`${custom.id}-${option.name}`}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex items-center flex-1">
                          <input
                            type={custom.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                            name={custom.id}
                            checked={selectedOptions[custom.id]?.includes(option.name) || false}
                            onChange={() => handleOptionChange(custom.id, option.name, custom.type)}
                            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                          />
                          <span className="ml-3 text-gray-900">{option.name}</span>
                        </div>
                        {option.priceExtra > 0 && (
                          <span className="text-green-600 font-medium">
                            +{option.priceExtra.toFixed(2)}€
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Option Boisson */}
          {item.allowDrinkOption && (
            <div className="mb-6 border-t pt-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">🥤</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ajoutez une boisson
                    </h3>
                    <p className="text-sm text-blue-800">
                      Complétez votre menu avec une boisson pour seulement{' '}
                      <span className="font-bold">+{item.drinkPrice?.toFixed(2)}€</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={drinkWanted}
                    onChange={(e) => {
                      setDrinkWanted(e.target.checked);
                      if (!e.target.checked) {
                        setSelectedDrink('');
                      }
                    }}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    Oui, j'ajoute une boisson (+{item.drinkPrice?.toFixed(2)}€)
                  </span>
                </label>

                {drinkWanted && (
                  <div className="ml-8 space-y-2">
                    {loadingDrinks ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : availableDrinks.length === 0 ? (
                      <p className="text-sm text-gray-600">Aucune boisson disponible</p>
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Choisissez votre boisson *
                        </label>
                        <select
                          value={selectedDrink}
                          onChange={(e) => setSelectedDrink(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required={drinkWanted}
                        >
                          <option value="">-- Sélectionnez une boisson --</option>
                          {availableDrinks.map((drink) => (
                            <option key={drink.id} value={drink.id}>
                              {drink.title}
                            </option>
                          ))}
                        </select>
                        {selectedDrink && (
                          <p className="text-xs text-gray-500 mt-1">
                            La boisson sera ajoutée pour {item.drinkPrice?.toFixed(2)}€ au lieu de son prix normal
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantité */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantité
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
              >
                −
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Prix total et bouton */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-2xl font-bold text-red-600">
                {calculateTotalPrice().toFixed(2)}€
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

