'use client';

import MenuDisplayWrapper from '../../components/MenuDisplayWrapper';
import { siteData } from '../../data/siteData';
import Link from 'next/link';

// Mode consultation uniquement - version mise à jour
export default function LivraisonPage() {

  return (
    <main className="min-h-screen">
      
      {/* Header de la page */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Livraison à <span className="text-red-700">domicile</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Découvrez notre menu et nos prix de livraison
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
              Notre Menu - Prix Livraison
            </h2>
            <p className="text-gray-600 mt-2">
              Consultez nos plats et leurs prix pour la livraison (+ {siteData.delivery.fee} de frais de livraison)
            </p>
          </div>
          
          <MenuDisplayWrapper showAddToCart={false} mode="livraison" />
        </div>
      </section>

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
    </main>
  );
} 