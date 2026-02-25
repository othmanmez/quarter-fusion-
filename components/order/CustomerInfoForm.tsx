'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { getCartSubtotal } from '@/lib/pricing';

interface BanFeature {
  properties: {
    label: string;
    housenumber?: string;
    street?: string;
    postcode: string;
    city: string;
    context: string;
    type: string;
    score: number;
  };
}

interface CustomerInfoFormProps {
  onConfirm: (orderData: any) => void;
  onSendOtp: (email: string, prenom: string, orderData: any) => Promise<void>;
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

export default function CustomerInfoForm({ onConfirm, onSendOtp, onPrev, mode, isLoading }: CustomerInfoFormProps) {
  const { state, dispatch } = useOrder();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [deliveryCities, setDeliveryCities] = useState<DeliveryCity[]>([]);
  const [selectedCityData, setSelectedCityData] = useState<DeliveryCity | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Autocomplétion adresse BAN
  const [addressSuggestions, setAddressSuggestions] = useState<BanFeature[]>([]);
  const [addressVerified, setAddressVerified] = useState(false);
  const [addressSearching, setAddressSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  // Fermer les suggestions en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche d'adresse via API Adresse (BAN) avec debounce
  const searchAddress = useCallback((query: string) => {
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);

    if (query.length < 5) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    addressDebounceRef.current = setTimeout(async () => {
      setAddressSearching(true);
      try {
        // Restriction géographique : département 95 (Val-d'Oise) + limitrophe
        const params = new URLSearchParams({
          q: query,
          limit: '6',
          type: 'housenumber',
        });
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?${params}`);
        const data = await res.json();
        const features: BanFeature[] = (data.features || []).filter(
          (f: BanFeature) => f.properties.score > 0.4
        );
        setAddressSuggestions(features);
        setShowSuggestions(features.length > 0);
      } catch {
        setAddressSuggestions([]);
      } finally {
        setAddressSearching(false);
      }
    }, 350);
  }, []);

  // Sélection d'une adresse dans la liste
  const handleSelectAddress = (feature: BanFeature) => {
    const { label, postcode, city } = feature.properties;
    // Remplir l'adresse (numéro + rue)
    const streetPart = label.replace(`, ${postcode} ${city}`, '').replace(`, ${city}`, '').trim();
    dispatch({ type: 'UPDATE_CUSTOMER_INFO', payload: { deliveryAddress: streetPart } });
    // Auto-sélectionner la ville si elle correspond à une ville de livraison
    const matchedCity = deliveryCities.find(
      c => c.name.toLowerCase() === city.toLowerCase() ||
           (c.postalCode && c.postalCode === postcode)
    );
    if (matchedCity) {
      dispatch({ type: 'UPDATE_CUSTOMER_INFO', payload: { deliveryCity: matchedCity.name } });
    }
    setAddressSuggestions([]);
    setShowSuggestions(false);
    setAddressVerified(true);
    setErrors(prev => ({ ...prev, deliveryAddress: '', deliveryCity: '' }));
  };

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
      } else if (!addressVerified) {
        newErrors.deliveryAddress = 'Veuillez sélectionner une adresse dans la liste pour la valider';
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

    // Si on modifie l'adresse manuellement, la dévalider
    if (field === 'deliveryAddress') {
      setAddressVerified(false);
      searchAddress(value);
    }

    // Effacer l'erreur si le champ est maintenant valide
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Soumission du formulaire → envoie l'OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Préparer les données de la commande
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
      total: getCartSubtotal(state.cart) + (mode === 'delivery' && selectedCityData ? selectedCityData.deliveryFee : 0),
      type: mode === 'delivery' ? 'livraison' : 'click-and-collect'
    };

    // Envoyer l'OTP par email au lieu de confirmer directement
    await onSendOtp(state.customerInfo.email, state.customerInfo.firstName, orderData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* En-tête */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-black mb-2">
          Vos informations
        </h2>
        <p className="text-black">
          Remplissez vos coordonnées pour finaliser votre commande
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prénom */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
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
            <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
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
            <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
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
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
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
            <label className="block text-sm font-medium text-black mb-2">
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
                <span className="text-sm text-black">Espèces</span>
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
                <span className="text-sm text-black">Carte bancaire</span>
              </label>
            </div>
          </div>

          {/* Champs spécifiques à la livraison */}
          {mode === 'delivery' && (
            <>
              <div className="md:col-span-2">
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-black mb-2">
                  Adresse de livraison *
                </label>
                <div className="relative" ref={suggestionsRef}>
                  <div className="relative">
                    <input
                      type="text"
                      id="deliveryAddress"
                      value={state.customerInfo.deliveryAddress || ''}
                      onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                      onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                      autoComplete="off"
                      className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.deliveryAddress
                          ? 'border-red-500'
                          : addressVerified
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="Tapez votre adresse (ex: 6 passage de l'aurore)"
                    />
                    {/* Indicateur état */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {addressSearching && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                      )}
                      {addressVerified && !addressSearching && (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Liste de suggestions */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                      {addressSuggestions.map((feature, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectAddress(feature)}
                          className="w-full text-left px-4 py-3 hover:bg-red-50 border-b border-gray-100 last:border-0 transition-colors"
                        >
                          <div className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-black">{feature.properties.label}</p>
                              <p className="text-xs text-gray-500">{feature.properties.context}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message si adresse non vérifiée */}
                  {state.customerInfo.deliveryAddress && !addressVerified && !addressSearching && addressSuggestions.length === 0 && (state.customerInfo.deliveryAddress?.length ?? 0) >= 5 && (
                    <p className="mt-1 text-xs text-orange-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Adresse introuvable dans la base officielle. Vérifiez l'orthographe.
                    </p>
                  )}
                  {addressVerified && (
                    <p className="mt-1 text-xs text-green-700 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Adresse vérifiée ✓
                    </p>
                  )}
                </div>
                {errors.deliveryAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="deliveryCity" className="block text-sm font-medium text-black mb-2">
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
                      <span className="text-black">Frais de livraison :</span>
                      <span className="font-medium text-black">{selectedCityData.deliveryFee.toFixed(2)}€</span>
                    </div>
                    {selectedCityData.minOrder && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-black">Minimum de commande :</span>
                        <span className="font-medium text-black">{selectedCityData.minOrder.toFixed(2)}€</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-black mb-2">
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
          <h4 className="font-semibold text-black mb-2">
            Informations importantes
          </h4>
          <ul className="text-sm text-black space-y-1">
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
                Envoi du code...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Recevoir mon code de vérification
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 