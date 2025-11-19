'use client';

import { useEffect, useRef, useState } from 'react';

interface UseOrderNotificationsProps {
  enabled?: boolean;
  checkInterval?: number; // en millisecondes
}

export function useOrderNotifications({ 
  enabled = true, 
  checkInterval = 10000 // 10 secondes par défaut
}: UseOrderNotificationsProps = {}) {
  const [lastOrderCount, setLastOrderCount] = useState<number>(0);
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser l'audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification.mp3');
      audioRef.current.volume = 1.0;
      setIsInitialized(true);
    }
  }, []);

  // Fonction pour jouer le son
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Erreur lors de la lecture du son:', error);
      });
    }
  };

  // Fonction pour afficher une notification navigateur
  const showBrowserNotification = (count: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Quarter Fusion - Nouvelle commande !', {
        body: `${count} nouvelle${count > 1 ? 's' : ''} commande${count > 1 ? 's' : ''} reçue${count > 1 ? 's' : ''}`,
        icon: '/images/logo-snack.png',
        badge: '/images/logo-snack.png',
        tag: 'new-order',
        requireInteraction: true
      });
    }
  };

  // Demander la permission pour les notifications
  useEffect(() => {
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [enabled]);

  // Vérifier les nouvelles commandes
  useEffect(() => {
    if (!enabled || !isInitialized) return;

    const checkNewOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();

        if (data.success && data.orders) {
          const currentCount = data.orders.length;
          
          // Si c'est la première vérification, initialiser sans notification
          if (lastOrderCount === 0) {
            setLastOrderCount(currentCount);
            return;
          }

          // Si il y a de nouvelles commandes
          if (currentCount > lastOrderCount) {
            const newCount = currentCount - lastOrderCount;
            setNewOrdersCount(prev => prev + newCount);
            
            // Jouer le son de notification
            playNotificationSound();
            
            // Afficher la notification navigateur
            showBrowserNotification(newCount);
            
            setLastOrderCount(currentCount);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des commandes:', error);
      }
    };

    // Première vérification immédiate
    checkNewOrders();

    // Vérification périodique
    const interval = setInterval(checkNewOrders, checkInterval);

    return () => clearInterval(interval);
  }, [enabled, isInitialized, lastOrderCount, checkInterval]);

  // Fonction pour réinitialiser le compteur de nouvelles commandes
  const resetNewOrdersCount = () => {
    setNewOrdersCount(0);
  };

  return {
    newOrdersCount,
    resetNewOrdersCount,
    playNotificationSound
  };
}

