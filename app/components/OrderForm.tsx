'use client';

import { useState } from 'react';
import { MenuItem } from '../data/menuData';

interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations?: string[];
}

interface OrderFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  moyenPaiement: string;
  notes: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
}

interface OrderFormProps {
  cart: CartItem[];
  totalPrice: number;
  deliveryFee?: number;
  isDelivery?: boolean;
  onBack: () => void;
  onSubmit: (formData: OrderFormData) => void;
  loading?: boolean;
}

export default function OrderForm({ 
  cart, 
  totalPrice, 
  deliveryFee = 0, 
  isDelivery = false,
  onBack, 
  onSubmit,
  loading = false
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    moyenPaiement: 'especes',
    notes: '',
    adresse: '',
    ville: '',
    codePostal: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Informations de commande
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                required
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="01 30 17 31 78"
              />
            </div>

            {/* Adresse de livraison (si livraison) */}
            {isDelivery && (
              <>
                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse de livraison *
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    required
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Numéro et nom de rue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      id="codePostal"
                      name="codePostal"
                      required
                      value={formData.codePostal}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="95800"
                    />
                  </div>
                  <div>
                    <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      id="ville"
                      name="ville"
                      required
                      value={formData.ville}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Cergy"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Moyen de paiement */}
            <div>
              <label htmlFor="moyenPaiement" className="block text-sm font-medium text-gray-700 mb-2">
                Moyen de paiement *
              </label>
              <select
                id="moyenPaiement"
                name="moyenPaiement"
                required
                value={formData.moyenPaiement}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="especes">Espèces</option>
                <option value="carte">Carte bancaire</option>
              </select>
            </div>

            {/* Notes spéciales */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes spéciales (optionnel)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Instructions spéciales, allergies, préférences, code d'accès..."
              />
            </div>

            {/* Boutons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-200"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : `Commander (${finalTotal.toFixed(2)}€)`}
              </button>
            </div>
          </form>
        </div>

        {/* Résumé de la commande */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Résumé de votre commande
          </h3>
          
          <div className="space-y-3 mb-6">
            {cart.map((cartItem) => (
              <div key={cartItem.item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{cartItem.item.title}</h4>
                  <p className="text-sm text-gray-600">
                    {cartItem.quantity} × {cartItem.item.price.toFixed(2)}€
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  {(cartItem.item.price * cartItem.quantity).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm">
              <span>Sous-total :</span>
              <span>{totalPrice.toFixed(2)}€</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Frais de livraison :</span>
                <span>{deliveryFee.toFixed(2)}€</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
              <span>Total :</span>
              <span className="text-red-700">{finalTotal.toFixed(2)}€</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Informations :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {isDelivery ? 'Livraison' : 'Click & Collect'} en {isDelivery ? '30-45 minutes' : '15-20 minutes'}</li>
              <li>• Email de confirmation envoyé</li>
              <li>• Paiement à la {isDelivery ? 'livraison' : 'retrait'}</li>
              <li>• {totalItems} article{totalItems > 1 ? 's' : ''} dans votre commande</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 