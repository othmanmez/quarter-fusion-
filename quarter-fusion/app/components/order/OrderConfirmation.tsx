'use client';

import React from 'react';
import { useOrder } from '../../contexts/OrderContext';

interface OrderConfirmationProps {
  orderNumber: string;
  onNewOrder: () => void;
  mode: 'click-and-collect' | 'delivery';
}

export default function OrderConfirmation({ orderNumber, onNewOrder, mode }: OrderConfirmationProps) {
  const { state } = useOrder();

  // Calculer le total
  const subtotal = state.cart.reduce((total, cartItem) => {
    return total + (cartItem.item.price * cartItem.quantity);
  }, 0);
  const deliveryFee = mode === 'delivery' ? 2.50 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* En-tête de confirmation */}
          <div className="bg-green-600 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Commande confirmée !
            </h1>
            <p className="text-green-100">
              Votre commande a été enregistrée avec succès
            </p>
          </div>

          {/* Détails de la commande */}
          <div className="p-6">
            {/* Numéro de commande */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Numéro de commande
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <span className="text-2xl font-bold text-red-600 font-mono">
                  {orderNumber}
                </span>
              </div>
            </div>

            {/* Informations client */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Informations client
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nom :</span>
                    <p className="text-gray-900">{state.customerInfo.firstName} {state.customerInfo.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Téléphone :</span>
                    <p className="text-gray-900">{state.customerInfo.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email :</span>
                    <p className="text-gray-900">{state.customerInfo.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Paiement :</span>
                    <p className="text-gray-900 capitalize">
                      {state.customerInfo.paymentMethod === 'especes' ? 'Espèces' : 'Carte bancaire'}
                    </p>
                  </div>
                  {mode === 'delivery' && (
                    <>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Adresse de livraison :</span>
                        <p className="text-gray-900">
                          {state.customerInfo.deliveryAddress}, {state.customerInfo.deliveryCity}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Récapitulatif de la commande */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Récapitulatif de votre commande
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {state.cart.map((cartItem) => (
                    <div key={cartItem.item._id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-900">
                          {cartItem.quantity} × {cartItem.item.title}
                        </span>
                      </div>
                      <span className="text-gray-700">
                        {(cartItem.item.price * cartItem.quantity).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total :</span>
                    <span className="font-medium">{subtotal.toFixed(2)}€</span>
                  </div>
                  {mode === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frais de livraison :</span>
                      <span className="font-medium">{deliveryFee.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total :</span>
                    <span className="text-red-600">{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {state.customerInfo.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Notes spéciales
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{state.customerInfo.notes}</p>
                </div>
              </div>
            )}

            {/* Informations importantes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Prochaines étapes
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Nous avons envoyé un email de confirmation à {state.customerInfo.email}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Nous vous contacterons par téléphone pour confirmer votre commande</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>
                      {mode === 'click-and-collect' 
                        ? 'Votre commande sera prête en 15-20 minutes. Retrait en restaurant : 6 passage de l\'aurore, 95800 Cergy'
                        : 'Votre commande sera livrée en 30-45 minutes à l\'adresse indiquée'
                      }
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>Paiement à la réception de votre commande</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Besoin d'aide ?
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  Pour toute question concernant votre commande :
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <a
                    href="tel:0130173178"
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    01 30 17 31 78
                  </a>
                  <a
                    href="/contact"
                    className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Nous contacter
                  </a>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onNewOrder}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
              >
                Nouvelle commande
              </button>
              <a
                href="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium text-center transition-colors duration-200"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 