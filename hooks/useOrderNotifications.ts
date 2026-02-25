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
  const alarmTimeoutRef = useRef<number | null>(null);
  const alarmRunningRef = useRef<boolean>(false);

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
  const playSystemSound = async (durationMs: number): Promise<boolean> => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const start = performance.now();
      const beepPair = () => {
        const now = audioContext.currentTime;

        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.frequency.value = 900;
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.6, now); // plus fort
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc1.start(now);
        osc1.stop(now + 0.25);

        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1100;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.6, now + 0.35);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.60);
        osc2.start(now + 0.35);
        osc2.stop(now + 0.60);
      };

      // Rejouer une paire de bips toutes les ~900ms pendant la durée demandée
      beepPair();
      const intervalId = window.setInterval(() => {
        if (performance.now() - start >= durationMs) {
          window.clearInterval(intervalId);
          // Fermer le contexte pour libérer les ressources
          try { audioContext.close(); } catch { /* ignore */ }
          return;
        }
        beepPair();
      }, 900);

      return true;
    } catch (error) {
      return false;
    }
  };

  // Fonction pour jouer le son
  const playNotificationSound = async (durationMs: number = 6000): Promise<boolean> => {
    try {
      if (audioRef.current) {
        // Jouer en boucle pendant la durée demandée
        audioRef.current.loop = true;
        audioRef.current.currentTime = 0;
        await audioRef.current.play();

        if (alarmTimeoutRef.current) window.clearTimeout(alarmTimeoutRef.current);
        alarmTimeoutRef.current = window.setTimeout(() => {
          try {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              audioRef.current.loop = false;
            }
          } catch {
            // ignore
          } finally {
            alarmRunningRef.current = false;
          }
        }, durationMs);

        return true;
      }
    } catch {
      // fallback
    }

    const ok = await playSystemSound(durationMs);
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
    const ok = await playNotificationSound(1200);
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
              if (!alarmRunningRef.current) {
                alarmRunningRef.current = true;
                const ok = await playNotificationSound(6000);
                if (!ok) setNeedsSoundActivation(true);
              }
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

