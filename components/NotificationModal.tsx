'use client';

import { useEffect } from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  details?: string;
}

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  details
}: NotificationModalProps) {
  // Fermer le modal avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Empêcher le scroll en arrière-plan
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop avec blur */}
      <div 
        className="absolute inset-0 bg-black/20 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header coloré */}
        <div className={`px-6 py-4 ${isSuccess ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isSuccess ? (
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {message}
          </p>
          
          {details && (
            <div className={`p-4 rounded-lg border-l-4 ${
              isSuccess 
                ? 'bg-green-50 border-green-400 text-green-800' 
                : 'bg-red-50 border-red-400 text-red-800'
            }`}>
              <p className="text-sm whitespace-pre-line">{details}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          {isSuccess ? (
            <>
              <a
                href="tel:0130173178"
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                📞 Nous appeler
              </a>
              <button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                Fermer
              </button>
            </>
          ) : (
            <>
              <a
                href="tel:0130173178"
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                📞 Appeler directement
              </a>
              <button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                Réessayer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}