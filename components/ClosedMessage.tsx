'use client';

import { useEffect, useState } from 'react';

export default function ClosedMessage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-orange-600 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animations d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cercles flottants */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-200/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Carte principale */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-scale-in">

          {/* Icône animée */}
          <div className="mb-8 relative">
            <div className="inline-block relative">
              {/* Cercle pulsant */}
              <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-75"></div>

              {/* Icône horloge */}
              <div className="relative bg-red-600 rounded-full p-6 shadow-lg">
                <svg
                  className="w-16 h-16 text-white animate-swing"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 animate-fade-in">
            Nous sommes
            <span className="block text-red-600 mt-2 animate-bounce-gentle">
              FERMÉS
            </span>
          </h1>

          {/* Message */}
          <div className="space-y-4 mb-8 animate-fade-in-delayed">
            <p className="text-xl md:text-2xl text-gray-700 font-medium">
              Revenez demain ! 🌙
            </p>
            <p className="text-lg text-gray-600">
              Nous serons ravis de vous servir lors de nos prochaines ouvertures
            </p>
          </div>

          {/* Horaires */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 animate-fade-in-more-delayed">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nos Horaires
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <span className="text-gray-700 font-medium">Lundi - Dimanche</span>
                <span className="text-red-700 font-bold text-lg">18:00 - 01:00</span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-most-delayed">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Retour à l'accueil
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Nous contacter
            </a>
          </div>

          {/* Info supplémentaire */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              📍 6 passage de l'aurore, 95800 Cergy
            </p>
            <p className="text-gray-600 text-sm mt-2">
              📞 01 30 17 31 78
            </p>
          </div>
        </div>

        {/* Réseaux sociaux flottants */}
        <div className="mt-8 text-center animate-fade-in-most-delayed">
          <p className="text-white text-sm mb-4">Suivez-nous sur les réseaux</p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://www.tiktok.com/@quarter.fusion95"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            >
              <span className="text-2xl">🎵</span>
            </a>
            <a
              href="https://www.instagram.com/quarter.fusion"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            >
              <span className="text-2xl">📸</span>
            </a>
            <a
              href="https://t.snapchat.com/qCBjA7AK"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            >
              <span className="text-2xl">👻</span>
            </a>
          </div>
        </div>
      </div>

      {/* Animations CSS personnalisées */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(-15px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes swing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.4s both;
        }

        .animate-fade-in-more-delayed {
          animation: fade-in 0.6s ease-out 0.6s both;
        }

        .animate-fade-in-most-delayed {
          animation: fade-in 0.6s ease-out 0.8s both;
        }

        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
