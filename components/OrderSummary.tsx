'use client';

import { CartItem } from '../app/types/menu';
import { getCartItemTotal, getCartItemUnitPrice, getCartSubtotal } from '@/lib/pricing';

interface OrderSummaryProps {
  cart: CartItem[];
  totalPrice: number;
  deliveryFee?: number;
  onBack: () => void;
  onContinue: () => void;
}

export default function OrderSummary({ 
  cart, 
  totalPrice, 
  deliveryFee = 0, 
  onBack, 
  onContinue 
}: OrderSummaryProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const computedSubtotal = getCartSubtotal(cart);
  const finalTotal = computedSubtotal + deliveryFee;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-red-700 text-white p-6">
        <h2 className="text-2xl font-bold">Récapitulatif de votre commande</h2>
        <p className="text-red-100 mt-2">
          {totalItems} article{totalItems > 1 ? 's' : ''} • Total : {finalTotal.toFixed(2)}€
        </p>
      </div>

      {/* Liste des articles */}
      <div className="p-6">
        <div className="space-y-4">
          {cart.map((cartItem, index) => (
            <div key={`cart-item-${cartItem.item.id}-${index}`} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{cartItem.item.title}</h3>
                  <span className="text-lg font-bold text-red-700">
                    {getCartItemTotal(cartItem).toFixed(2)}€
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{cartItem.item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Quantité : {cartItem.quantity} × {getCartItemUnitPrice(cartItem).toFixed(2)}€
                  </span>
                  {cartItem.customizations && cartItem.customizations.length > 0 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Personnalisé
                    </span>
                  )}
                </div>
                {cartItem.customizations && cartItem.customizations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 font-medium">Personnalisations :</p>
                    <p className="text-xs text-blue-600">{cartItem.customizations.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Résumé des prix */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''}) :</span>
              <span>{computedSubtotal.toFixed(2)}€</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Frais de livraison :</span>
                <span>{deliveryFee.toFixed(2)}€</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total à payer :</span>
              <span className="text-red-700">{finalTotal.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Informations importantes :</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Votre commande sera préparée dès réception</li>
            <li>• Temps de préparation : 15-20 minutes</li>
            <li>• Vous recevrez un email de confirmation</li>
            <li>• Paiement à la livraison/retrait</li>
          </ul>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Retour au menu
          </button>
          <button
            onClick={onContinue}
            className="flex-1 bg-red-700 hover:bg-red-800 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
} 