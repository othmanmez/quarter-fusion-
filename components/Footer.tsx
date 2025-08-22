'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { siteData } from '../data/siteData';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Réinitialiser le compteur après 3 secondes d'inactivité
  const resetClickCount = useCallback(() => {
    setTimeout(() => {
      setClickCount(0);
    }, 3000);
  }, []);

  // Fonction pour gérer les clics sur le copyright
  const handleCopyrightClick = useCallback(() => {
    const currentTime = Date.now();
    
    // Réinitialiser le compteur si plus de 3 secondes se sont écoulées
    if (currentTime - lastClickTime > 3000) {
      setClickCount(1);
    } else {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);
      
      // Si 2 clics détectés, rediriger vers l'admin
      if (newClickCount === 2) {
        router.push('/admin/login');
        setClickCount(0); // Réinitialiser le compteur
      } else {
        // Réinitialiser le compteur après 3 secondes
        resetClickCount();
      }
    }
    
    setLastClickTime(currentTime);
  }, [clickCount, lastClickTime, router, resetClickCount]);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              {siteData.restaurant.name}
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Votre restaurant de snack préféré à Paris. Nous proposons des plats délicieux 
              préparés avec des ingrédients frais et de qualité. Livraison rapide et service impeccable.
            </p>
            <div className="flex space-x-4">
              {siteData.socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <span className="text-2xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact rapide */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-400">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>{siteData.restaurant.address}</p>
              <a 
                href={`tel:${siteData.restaurant.phone}`}
                className="hover:text-red-400 transition-colors duration-200"
              >
                {siteData.restaurant.phone}
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-400">Liens rapides</h4>
            <div className="space-y-2">
              {siteData.navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div 
              className={`text-sm mb-4 md:mb-0 cursor-pointer select-none transition-colors duration-200 ${
                clickCount === 1 
                  ? 'text-red-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={handleCopyrightClick}
              title="Cliquez 2 fois pour accéder à l'administration"
            >
              © {currentYear} {siteData.restaurant.name}. Tous droits réservés.
            </div>

            {/* Mentions légales */}
            <div className="flex flex-wrap gap-6 text-sm">
              <a 
                href="/mentions-legales" 
                className="text-gray-400 hover:text-red-400 transition-colors duration-200"
              >
                Mentions légales
              </a>
              <a 
                href="/politique-confidentialite" 
                className="text-gray-400 hover:text-red-400 transition-colors duration-200"
              >
                Politique de confidentialité
              </a>
              <a 
                href="/conditions-utilisation" 
                className="text-gray-400 hover:text-red-400 transition-colors duration-200"
              >
                Conditions d'utilisation
              </a>
              <a 
                href="/cgv" 
                className="text-gray-400 hover:text-red-400 transition-colors duration-200"
              >
                CGV
              </a>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Ce site utilise des cookies pour améliorer votre expérience. 
            En continuant à naviguer, vous acceptez notre utilisation des cookies.
          </p>
          <p className="mt-2">
            Restaurant certifié HACCP • Hygiène alimentaire contrôlée • 
            Formation continue du personnel
          </p>
        </div>
      </div>
    </footer>
  );
} 