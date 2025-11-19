'use client';

import { useState } from 'react';
import MenuDisplayWrapper from '../../components/MenuDisplayWrapper';
import FloatingCart from '../../components/FloatingCart';
import OrderSummary from '../../components/OrderSummary';
import OrderForm from '../../components/OrderForm';
import OrderConfirmationModal from '../../components/order/OrderConfirmationModal';
import { siteData } from '../../data/siteData';
import { MenuItem, CartItem, OrderFormData } from '../types/menu';

type OrderStep = 'menu' | 'summary' | 'form';

export default function LivraisonPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<OrderStep>('menu');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity }];
      }
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
    
    // Ajouter les frais de livraison
    const deliveryFee = parseFloat(siteData.delivery.fee.replace('€', ''));
    return subtotal + deliveryFee;
  };

  const getDeliveryFee = () => {
    return parseFloat(siteData.delivery.fee.replace('€', ''));
  };

  const handleContinueToSummary = () => {
    setCurrentStep('summary');
  };

  const handleBackToMenu = () => {
    setCurrentStep('menu');
  };

  const handleContinueToForm = () => {
    setCurrentStep('form');
  };

  const handleSubmitOrder = async (formData: OrderFormData) => {
    setLoading(true);
    
    try {
      // Appel API pour envoyer la commande
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          formData,
          total: getTotalPrice(),
          type: 'livraison'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Afficher la modal de confirmation
        setOrderNumber(result.orderNumber);
        setCustomerEmail(formData.email);
        setShowConfirmation(true);
        setCart([]);
      } else {
        // Si on a un orderNumber malgré l'erreur, la commande a été enregistrée
        if (result.orderNumber) {
          setOrderNumber(result.orderNumber);
          setCustomerEmail(formData.email);
          setShowConfirmation(true);
          setCart([]);
        } else {
          throw new Error(result.error || 'Erreur lors de l\'envoi de la commande');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      
      {/* Header de la page */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Livraison à <span className="text-red-700">domicile</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Commandez en ligne et faites-vous livrer chez vous. Service rapide et professionnel.
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentStep === 'menu' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Notre Menu
                </h2>
                <p className="text-gray-600 mt-2">
                  Sélectionnez vos plats préférés et personnalisez-les selon vos goûts
                </p>
              </div>
              
              <MenuDisplayWrapper onAddToCart={handleAddToCart} showAddToCart={true} mode="livraison" />
            </>
          )}

          {currentStep === 'summary' && (
            <OrderSummary
              cart={cart}
              totalPrice={getTotalPrice() - getDeliveryFee()}
              deliveryFee={getDeliveryFee()}
              onBack={handleBackToMenu}
              onContinue={handleContinueToForm}
            />
          )}

          {currentStep === 'form' && (
            <OrderForm
              cart={cart}
              totalPrice={getTotalPrice() - getDeliveryFee()}
              deliveryFee={getDeliveryFee()}
              isDelivery={true}
              onBack={() => setCurrentStep('summary')}
              onSubmit={handleSubmitOrder}
              loading={loading}
            />
          )}
        </div>
      </section>

      {/* Panier flottant (visible seulement sur la page menu) */}
      {currentStep === 'menu' && (
        <FloatingCart
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onContinue={handleContinueToSummary}
          totalPrice={getTotalPrice() - getDeliveryFee()}
          deliveryFee={getDeliveryFee()}
        />
      )}

      {/* Informations supplémentaires */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact rapide */}
            <div className="bg-red-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Commander par téléphone
              </h3>
              <p className="text-red-100 mb-6">
                Préférez appeler ? Nous sommes là pour vous aider !
              </p>
              <a
                href={`tel:${siteData.restaurant.phone}`}
                className="inline-flex items-center bg-white text-red-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {siteData.restaurant.phone}
              </a>
            </div>

            {/* Conditions de livraison */}
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Conditions de livraison
              </h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Commande minimum :</span>
                  <span className="font-medium text-red-700">{siteData.delivery.minimum}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison :</span>
                  <span className="font-medium text-red-700">{siteData.delivery.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Délai de livraison :</span>
                  <span className="font-medium text-red-700">{siteData.delivery.time}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-sm">{siteData.delivery.zones}</span>
                </div>
              </div>
            </div>

            {/* Avantages livraison */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Pourquoi choisir la livraison ?
              </h3>
              <div className="space-y-3 text-green-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Livraison rapide en 30-45 minutes</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Plats chauds et frais à domicile</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Paiement sécurisé à la livraison</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Suivi en temps réel de votre commande</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de confirmation */}
      <OrderConfirmationModal
        isOpen={showConfirmation}
        orderNumber={orderNumber}
        customerEmail={customerEmail}
        onClose={() => {
          setShowConfirmation(false);
          setCurrentStep('menu');
        }}
      />
    </main>
  );
} 