'use client';

import { useEffect, useRef, useState } from 'react';

interface UseOrderNotificationsProps {
  enabled?: boolean;
  checkInterval?: number; // en millisecondes
}

const SOUND_ARMED_KEY = 'qf_admin_sound_armed_v1';

export function useOrderNotifications({ 
  enabled = true, 
  checkInterval = 10000 // 10 secondes par défaut
}: UseOrderNotificationsProps = {}) {
  const [lastOrderCount, setLastOrderCount] = useState<number>(0);
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0);
  const [soundArmed, setSoundArmed] = useState<boolean>(false);
  const [needsSoundActivation, setNeedsSoundActivation] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioErrorLogged = useRef<boolean>(false); // Flag pour éviter les logs répétitifs
  const fetchErrorLogged = useRef<boolean>(false);
  const consecutiveFailures = useRef<number>(0);

  // Initialiser l'audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(SOUND_ARMED_KEY);
        setSoundArmed(saved === '1');
      } catch {
        // ignore
      }

      // Essayer de charger le fichier audio
      audioRef.current = new Audio('/notification.mp3');
      audioRef.current.volume = 1.0;
      audioRef.current.preload = 'auto';
      
      // Gérer les erreurs de chargement (une seule fois)
      audioRef.current.addEventListener('error', () => {
        if (!audioErrorLogged.current) {
          // Log une seule fois, puis utiliser le son système
          audioErrorLogged.current = true;
        }
        // Ne rien faire d'autre, le son système sera utilisé en fallback
      });
      
      setIsInitialized(true);
    }
  }, []);

  // Fonction pour générer un son avec Web Audio API (fallback)
  const playSystemSound = async (): Promise<boolean> => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Son de notification (fréquence 800Hz, durée 200ms)
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);

      // Deuxième bip après 100ms
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';

        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.2);
      }, 100);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Fonction pour jouer le son
  const playNotificationSound = async (): Promise<boolean> => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        return true;
      }
    } catch {
      // fallback
    }

    const ok = await playSystemSound();
    return ok;
  };

  const armSound = async () => {
    setNeedsSoundActivation(false);
    setSoundArmed(true);
    try {
      window.localStorage.setItem(SOUND_ARMED_KEY, '1');
    } catch {
      // ignore
    }
    // Jouer un petit bip pour "débloquer" l'audio (interaction utilisateur requise)
    const ok = await playNotificationSound();
    if (!ok) setNeedsSoundActivation(true);
  };

  // Fonction pour afficher une notification navigateur
  const showBrowserNotification = (count: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Quarter Fusion - Nouvelle commande !', {
        body: `${count} nouvelle${count > 1 ? 's' : ''} commande${count > 1 ? 's' : ''} reçue${count > 1 ? 's' : ''}`,
        icon: '/icon.png',
        badge: '/icon.png',
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
        if (!navigator.onLine || document.visibilityState === 'hidden') return;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('/api/orders', {
          cache: 'no-store',
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) return;
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
            
            // Jouer le son de notification (si armé)
            if (soundArmed) {
              const ok = await playNotificationSound();
              if (!ok) setNeedsSoundActivation(true);
            } else {
              setNeedsSoundActivation(true);
            }
            
            // Afficher la notification navigateur
            showBrowserNotification(newCount);
            
            setLastOrderCount(currentCount);
          }
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
        consecutiveFailures.current += 1;
        if (consecutiveFailures.current >= 3) {
          // Désactiver temporairement les logs après plusieurs échecs
          fetchErrorLogged.current = true;
        }
      }
    };

    // Première vérification immédiate
    checkNewOrders();

    // Vérification périodique
    const interval = setInterval(checkNewOrders, checkInterval);

    return () => clearInterval(interval);
  }, [enabled, isInitialized, lastOrderCount, checkInterval, soundArmed]);

  // Fonction pour réinitialiser le compteur de nouvelles commandes
  const resetNewOrdersCount = () => {
    setNewOrdersCount(0);
  };

  return {
    newOrdersCount,
    resetNewOrdersCount,
    playNotificationSound,
    soundArmed,
    needsSoundActivation,
    armSound,
  };
}

