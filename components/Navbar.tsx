'use client';

import { useState } from 'react';
import { siteData } from '../data/siteData';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-red-700">
              {siteData.restaurant.name}
            </h1>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {siteData.navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Bouton Commander */}
          <div className="hidden md:block">
            <button className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200">
              Commander
            </button>
          </div>

          {/* Menu mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-700 focus:outline-none focus:text-red-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {siteData.navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button className="w-full mt-4 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200">
                Commander
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 