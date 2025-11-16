'use client';

import { useState, useEffect } from 'react';
import { OrderProvider } from '../../contexts/OrderContext';
import OrderWizard from '../../components/OrderWizard';

type OrderMode = 'click-and-collect' | 'delivery';

interface Settings {
  clickAndCollectEnabled: boolean;
  deliveryEnabled: boolean;
  minOrderAmount: number;
  deliveryFee: number;
  estimatedTime: string;
}

export default function CommanderPage() {
  const [selectedMode, setSelectedMode] = useState<OrderMode | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Erreur chargement paramètres:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleModeSelection = (mode: OrderMode) => {
    if (!settings) return;
    
    if (mode === 'click-and-collect' && !settings.clickAndCollectEnabled) {
      alert('Le Click & Collect est temporairement fermé. Veuillez réessayer plus tard ou choisir la livraison.');
      return;
    }
    
    if (mode === 'delivery' && !settings.deliveryEnabled) {
      alert('La livraison est temporairement fermée. Veuillez réessayer plus tard ou choisir le Click & Collect.');
      return;
    }
    
    setSelectedMode(mode);
  };

  if (selectedMode) {
    return (
      <OrderProvider>
        <main className="min-h-screen">
          <OrderWizard mode={selectedMode} />
        </main>
      </OrderProvider>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header de la page */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comment souhaitez-vous <span className="text-red-700">commander</span> ?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez votre mode de commande préféré pour déguster nos délicieux plats
            </p>
          </div>

          {/* Options de commande */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Click & Collect */}
            <div 
              onClick={() => handleModeSelection('click-and-collect')}
              className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 border-2 ${
                settings?.clickAndCollectEnabled 
                  ? 'hover:shadow-xl cursor-pointer border-transparent hover:border-red-700' 
                  : 'opacity-60 cursor-not-allowed border-gray-300'
              } group`}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <span className="text-4xl">🥡</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors flex items-center justify-center gap-2">
                  Click & Collect
                  {!settings?.clickAndCollectEnabled && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Fermé
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 mb-6">
                  Commandez en ligne et venez récupérer votre commande directement au restaurant
                </p>
                <div className="space-y-3 text-sm text-gray-500 mb-6">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Pas de frais supplémentaires</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Prêt en 15-20 minutes</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Paiement à l'arrivée</span>
                  </div>
                </div>
                <button className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-full font-medium transition-colors duration-200 group-hover:shadow-lg">
                  Choisir ce mode
                </button>
              </div>
            </div>

            {/* Livraison */}
            <div 
              onClick={() => handleModeSelection('delivery')}
              className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 border-2 ${
                settings?.deliveryEnabled 
                  ? 'hover:shadow-xl cursor-pointer border-transparent hover:border-red-700' 
                  : 'opacity-60 cursor-not-allowed border-gray-300'
              } group`}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <span className="text-4xl">🚗</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors flex items-center justify-center gap-2">
                  Livraison à domicile
                  {!settings?.deliveryEnabled && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Fermé
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 mb-6">
                  Recevez votre commande directement chez vous, chaud et savoureux
                </p>
                <div className="space-y-3 text-sm text-gray-500 mb-6">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Livraison en 30-45 minutes</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Frais de livraison : 2.50€</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Commande minimum : 20€</span>
                  </div>
                </div>
                <button className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-full font-medium transition-colors duration-200 group-hover:shadow-lg">
                  Choisir ce mode
                </button>
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">
              Une question sur votre commande ?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0130173178"
                className="inline-flex items-center bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                01 30 17 31 78
              </a>
              <a
                href="/contact"
                className="inline-flex items-center bg-transparent border-2 border-red-700 text-red-700 px-6 py-3 rounded-full font-medium hover:bg-red-700 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}