'use client';

import React from 'react';
import { useOrder } from '../../contexts/OrderContext';

interface OrderSummaryProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function OrderSummary({ onNext, onPrev }: OrderSummaryProps) {
  const { state, removeFromCart, updateQuantity } = useOrder();

  // Calculer le sous-total
  const subtotal = state.cart.reduce((total, cartItem) => {
    return total + (cartItem.item.price * cartItem.quantity);
  }, 0);

  // Calculer les frais de livraison
  const deliveryFee = state.orderMode === 'delivery' ? 2.50 : 0;

  // Calculer le total
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* En-tête */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Récapitulatif de votre commande
        </h2>
        <p className="text-gray-600">
          Vérifiez vos articles avant de continuer
        </p>
      </div>

      {/* Liste des articles */}
      <div className="p-6">
        {state.cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Votre panier est vide</p>
            <button
              onClick={onPrev}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Retourner au menu
            </button>
          </div>
        ) : (
          <>
            {/* Articles */}
            <div className="space-y-4 mb-6">
              {state.cart.map((cartItem) => (
                <div
                  key={cartItem.item._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {cartItem.item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {cartItem.item.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {cartItem.item.price.toFixed(2)}€ l'unité
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Contrôles de quantité */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if (cartItem.quantity > 1) {
                            updateQuantity(cartItem.item._id, cartItem.quantity - 1);
                          } else {
                            removeFromCart(cartItem.item._id);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                      >
                        +
                      </button>
                    </div>

                    {/* Prix total pour cet article */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {(cartItem.item.price * cartItem.quantity).toFixed(2)}€
                      </p>
                    </div>

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => removeFromCart(cartItem.item._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé des prix */}
            <div className="border-t pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sous-total :</span>
                  <span className="font-medium">{subtotal.toFixed(2)}€</span>
                </div>

                {state.orderMode === 'delivery' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Frais de livraison :</span>
                    <span className="font-medium">{deliveryFee.toFixed(2)}€</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                  <span>Total :</span>
                  <span className="text-red-600">{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Informations importantes
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Votre commande sera préparée dans les 15-20 minutes</li>
                {state.orderMode === 'click-and-collect' ? (
                  <li>• Retrait en restaurant : 6 passage de l'aurore, 95800 Cergy</li>
                ) : (
                  <li>• Livraison en 30-45 minutes dans votre zone</li>
                )}
                <li>• Paiement à la réception de votre commande</li>
              </ul>
            </div>

            {/* Boutons de navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={onPrev}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                ← Retour au menu
              </button>
              <button
                onClick={onNext}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Continuer →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 