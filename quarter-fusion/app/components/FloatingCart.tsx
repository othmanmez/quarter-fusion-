'use client';

import { useState } from 'react';
import { MenuItem } from '../data/menuData';

interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations?: string[];
}

interface FloatingCartProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onContinue: () => void;
  totalPrice: number;
  deliveryFee?: number;
}

export default function FloatingCart({ 
  cart, 
  onUpdateQuantity, 
  onContinue, 
  totalPrice, 
  deliveryFee = 0 
}: FloatingCartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const finalTotal = totalPrice + deliveryFee;

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      {/* Panier flottant */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Bouton principal */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-red-700 hover:bg-red-800 text-white p-5 rounded-full shadow-2xl transition-all duration-200 flex items-center space-x-3 border-4 border-white"
          style={{
            boxShadow: '0 10px 25px rgba(220, 38, 38, 0.4)',
            animation: totalItems > 0 ? 'pulse 2s infinite' : 'none'
          }}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <span className="font-bold text-lg">{totalItems}</span>
        </button>

        {/* Badge de notification */}
        {totalItems > 0 && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
            {totalItems}
          </div>
        )}

        {/* Panneau déplié */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 w-96 bg-white rounded-2xl shadow-2xl border-2 border-red-200 max-h-[500px] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">🛒 Votre commande</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 text-red-100">
                {totalItems} article{totalItems > 1 ? 's' : ''} • Total : {finalTotal.toFixed(2)}€
              </div>
            </div>

            {/* Liste des articles */}
            <div className="p-5 max-h-80 overflow-y-auto">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{cartItem.item.title}</h4>
                    <p className="text-xs text-gray-600">{cartItem.item.price.toFixed(2)}€</p>
                    {cartItem.customizations && cartItem.customizations.length > 0 && (
                      <p className="text-xs text-blue-600 font-medium">
                        {cartItem.customizations.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm hover:bg-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{cartItem.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                      className="w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-800 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total et bouton continuer */}
            <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm font-medium">
                  <span>Sous-total :</span>
                  <span>{totalPrice.toFixed(2)}€</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm font-medium">
                    <span>Frais de livraison :</span>
                    <span>{deliveryFee.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl border-t border-gray-300 pt-3">
                  <span>Total :</span>
                  <span className="text-red-700">{finalTotal.toFixed(2)}€</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setIsExpanded(false);
                  onContinue();
                }}
                className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 Continuer ({totalItems} article{totalItems > 1 ? 's' : ''})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour fermer le panier */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Styles CSS pour l'animation pulse */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
} 