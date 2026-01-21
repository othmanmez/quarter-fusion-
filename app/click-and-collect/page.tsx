'use client';

import MenuDisplayWrapper from '../../components/MenuDisplayWrapper';
import Link from 'next/link';

// Mode consultation uniquement - version mise à jour
export default function ClickAndCollectPage() {

  return (
    <main className="min-h-screen">
      
      {/* Header de la page */}
      <section className="pt-30 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Click & <span className="text-red-700">Collect</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Découvrez notre menu et nos prix Click & Collect
            </p>
            
            {/* Bouton pour commander */}
            <div className="flex justify-center">
              <Link
                href="/commander"
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Commander maintenant
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Cette page est en consultation uniquement. Pour passer commande, cliquez sur le bouton ci-dessus.
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Notre Menu - Prix Click & Collect
            </h2>
            <p className="text-gray-600 mt-2">
              Consultez nos plats et leurs prix pour le Click & Collect
            </p>
          </div>
          
          <MenuDisplayWrapper showAddToCart={false} mode="click-and-collect" />
        </div>
      </section>

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
    </main>
  );
} 