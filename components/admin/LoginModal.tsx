'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading, isAuthenticated, isAdmin } = useAuth();

  // Fermer le modal si l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      onClose?.();
    }
  }, [isAuthenticated, isAdmin, onClose]);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Une erreur est survenue');
    }
    // Si succès, le useEffect fermera automatiquement le modal
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Connexion Admin
              </h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Accédez au panneau d'administration de Quarter Fusion
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="modal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="samy@quarterfusion.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="modal-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Identifiants de test */}
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                💡 Identifiants de test
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Email :</strong> samy@quarterfusion.com</p>
                <p><strong>Mot de passe :</strong> pokemon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}