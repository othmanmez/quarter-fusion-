'use client';

import React, { useState, useEffect } from 'react';
import { useOrder } from '../../contexts/OrderContext';

interface CustomerInfoFormProps {
  onConfirm: (orderData: any) => void;
  onPrev: () => void;
  mode: 'click-and-collect' | 'delivery';
  isLoading: boolean;
}

interface Settings {
  deliveryCities: string[];
  deliveryFee: number;
  minimumOrder: number;
  deliveryTime: string;
}

interface DeliveryCity {
  id: string;
  name: string;
  postalCode: string | null;
  deliveryFee: number;
  minOrder: number | null;
  active: boolean;
}

export default function CustomerInfoForm({ onConfirm, onPrev, mode, isLoading }: CustomerInfoFormProps) {
  const { state, dispatch } = useOrder();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [deliveryCities, setDeliveryCities] = useState<DeliveryCity[]>([]);
  const [selectedCityData, setSelectedCityData] = useState<DeliveryCity | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Récupérer les villes de livraison
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/delivery-cities');
        const data = await response.json();
        if (data.success) {
          setDeliveryCities(data.cities || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des villes:', error);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    };

    if (mode === 'delivery') {
      fetchCities();
      fetchSettings();
    }
  }, [mode]);

  // Mettre à jour les frais quand la ville change
  useEffect(() => {
    if (state.customerInfo.deliveryCity) {
      const cityData = deliveryCities.find(c => c.name === state.customerInfo.deliveryCity);
      setSelectedCityData(cityData || null);
    }
  }, [state.customerInfo.deliveryCity, deliveryCities]);

  // Validation des champs
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!state.customerInfo.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!state.customerInfo.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!state.customerInfo.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[0-9\s\-\+\(\)]{10,}$/.test(state.customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Le numéro de téléphone n\'est pas valide';
    }

    if (!state.customerInfo.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.customerInfo.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (mode === 'delivery') {
      if (!state.customerInfo.deliveryAddress?.trim()) {
        newErrors.deliveryAddress = 'L\'adresse de livraison est requise';
      }
      if (!state.customerInfo.deliveryCity?.trim()) {
        newErrors.deliveryCity = 'La ville de livraison est requise';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements de champs
  const handleInputChange = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_CUSTOMER_INFO',
      payload: { [field]: value }
    });

    // Effacer l'erreur si le champ est maintenant valide
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Préparer les données de la commande dans le format attendu par l'API
    const orderData = {
      cart: state.cart.map(cartItem => ({
        item: {
          id: cartItem.item.id || cartItem.item._id,
          title: cartItem.item.title,
          price: cartItem.item.price,
          description: cartItem.item.description
        },
        quantity: cartItem.quantity,
        customizations: cartItem.item.customizations || []
      })),
      formData: {
        prenom: state.customerInfo.firstName,
        nom: state.customerInfo.lastName,
        email: state.customerInfo.email,
        telephone: state.customerInfo.phone,
        moyenPaiement: state.customerInfo.paymentMethod,
        notes: state.customerInfo.notes,
        adresse: mode === 'delivery' ? state.customerInfo.deliveryAddress : undefined,
        ville: mode === 'delivery' ? state.customerInfo.deliveryCity : undefined,
        codePostal: mode === 'delivery' ? selectedCityData?.postalCode || '' : undefined
      },
      total: state.cart.reduce((total, item) => total + (item.item.price * item.quantity), 0) + (mode === 'delivery' && selectedCityData ? selectedCityData.deliveryFee : 0),
      type: mode === 'delivery' ? 'livraison' : 'click-and-collect'
    };

    onConfirm(orderData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* En-tête */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vos informations
        </h2>
        <p className="text-gray-600">
          Remplissez vos coordonnées pour finaliser votre commande
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prénom */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              id="firstName"
              value={state.customerInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre prénom"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              id="lastName"
              value={state.customerInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre nom"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone *
            </label>
            <input
              type="tel"
              id="phone"
              value={state.customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="01 30 17 31 78"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={state.customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="votre@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Moyen de paiement */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moyen de paiement *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="especes"
                  checked={state.customerInfo.paymentMethod === 'especes'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="mr-2 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Espèces</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="carte"
                  checked={state.customerInfo.paymentMethod === 'carte'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="mr-2 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Carte bancaire</span>
              </label>
            </div>
          </div>

          {/* Champs spécifiques à la livraison */}
          {mode === 'delivery' && (
            <>
              <div className="md:col-span-2">
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse de livraison *
                </label>
                <input
                  type="text"
                  id="deliveryAddress"
                  value={state.customerInfo.deliveryAddress || ''}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Numéro et nom de rue"
                />
                {errors.deliveryAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <select
                  id="deliveryCity"
                  value={state.customerInfo.deliveryCity || ''}
                  onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.deliveryCity ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez votre ville</option>
                  {deliveryCities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name} {city.postalCode && `(${city.postalCode})`} - {city.deliveryFee.toFixed(2)}€
                    </option>
                  ))}
                </select>
                {errors.deliveryCity && (
                  <p className="mt-1 text-sm text-red-600">{errors.deliveryCity}</p>
                )}
                
                {/* Afficher les infos de la ville sélectionnée */}
                {selectedCityData && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Frais de livraison :</span>
                      <span className="font-medium text-gray-900">{selectedCityData.deliveryFee.toFixed(2)}€</span>
                    </div>
                    {selectedCityData.minOrder && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-700">Minimum de commande :</span>
                        <span className="font-medium text-gray-900">{selectedCityData.minOrder.toFixed(2)}€</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes spécifiques
            </label>
            <textarea
              id="notes"
              value={state.customerInfo.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Instructions spéciales, allergies, préférences... (optionnel)"
            />
          </div>
        </div>

        {/* Informations importantes */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">
            Informations importantes
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Paiement à la réception de votre commande</li>
            {mode === 'click-and-collect' ? (
              <li>• Retrait en restaurant : 6 passage de l'aurore, 95800 Cergy</li>
            ) : (
              <li>• Livraison en 30-45 minutes dans votre zone</li>
            )}
            <li>• Votre commande sera préparée dans les 15-20 minutes</li>
            <li>• Nous vous contacterons par téléphone pour confirmer</li>
          </ul>
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={onPrev}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            ← Retour
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Traitement...
              </>
            ) : (
              'Confirmer la commande'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 