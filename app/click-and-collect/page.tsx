'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MenuDisplay from '../components/MenuDisplay';
import FloatingCart from '../components/FloatingCart';
import OrderSummary from '../components/OrderSummary';
import OrderForm from '../components/OrderForm';
import { siteData } from '../data/siteData';
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
}

type OrderStep = 'menu' | 'summary' | 'form';

export default function ClickAndCollectPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<OrderStep>('menu');
  const [loading, setLoading] = useState(false);

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
    return cart.reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
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
          type: 'click-and-collect'
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Commande envoyée avec succès !\nNuméro de commande : ${result.orderNumber}\nVous recevrez un email de confirmation.`);
        setCart([]);
        setCurrentStep('menu');
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi de la commande');
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
      <Navbar />
      
      {/* Header de la page */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Click & <span className="text-red-700">Collect</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Commandez en ligne et récupérez votre commande en restaurant. Rapide, pratique et sans frais !
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
              
              <MenuDisplay onAddToCart={handleAddToCart} showAddToCart={true} />
            </>
          )}

          {currentStep === 'summary' && (
            <OrderSummary
              cart={cart}
              totalPrice={getTotalPrice()}
              onBack={handleBackToMenu}
              onContinue={handleContinueToForm}
            />
          )}

          {currentStep === 'form' && (
            <OrderForm
              cart={cart}
              totalPrice={getTotalPrice()}
              isDelivery={false}
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
          totalPrice={getTotalPrice()}
        />
      )}

      {/* Informations supplémentaires */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Comment ça marche ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Commandez en ligne</h4>
                    <p className="text-gray-600 text-sm">Sélectionnez vos plats préférés</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Nous préparons</h4>
                    <p className="text-gray-600 text-sm">Votre commande sera prête en 15-20 minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Récupérez</h4>
                    <p className="text-gray-600 text-sm">Venez chercher votre commande en restaurant</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Avantages Click & Collect
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Aucun frais de livraison</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Commande prête en 15-20 minutes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Retrait en restaurant</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Service rapide et pratique</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Horaires de retrait
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Lundi - Dimanche</span>
                  <span className="font-medium">18:00 - 02:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 