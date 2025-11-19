'use client';

import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { useEffect, useState } from 'react';

export default function OrderNotificationBadge() {
  const { newOrdersCount, resetNewOrdersCount } = useOrderNotifications({
    enabled: true,
    checkInterval: 10000 // Vérifier toutes les 10 secondes
  });
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (newOrdersCount > 0) {
      setShowBadge(true);
      // Cacher le badge après 10 secondes
      const timeout = setTimeout(() => {
        setShowBadge(false);
        resetNewOrdersCount();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [newOrdersCount, resetNewOrdersCount]);

  if (!showBadge || newOrdersCount === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
        <div className="animate-pulse">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-lg">Nouvelle{newOrdersCount > 1 ? 's' : ''} commande{newOrdersCount > 1 ? 's' : ''} !</div>
          <div className="text-sm opacity-90">{newOrdersCount} commande{newOrdersCount > 1 ? 's' : ''} reçue{newOrdersCount > 1 ? 's' : ''}</div>
        </div>
        <div className="text-3xl font-bold bg-white text-red-600 rounded-full w-12 h-12 flex items-center justify-center">
          {newOrdersCount}
        </div>
      </div>
    </div>
  );
}

