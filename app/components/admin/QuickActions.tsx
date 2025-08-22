'use client';

import { useState } from 'react';
import { toast } from 'sonner'; // Best practice 2025 pour les notifications

export default function QuickActions() {
  const [isOrderingEnabled, setIsOrderingEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleOrdering = async () => {
    setIsLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsOrderingEnabled(!isOrderingEnabled);
      toast.success(
        isOrderingEnabled 
          ? 'Commandes désactivées' 
          : 'Commandes réactivées'
      );
    } catch (error) {
      toast.error('Erreur lors de la modification');
    } finally {
      setIsLoading(false);
    }
  };

  const actions = [
    {
      title: isOrderingEnabled ? 'Désactiver commandes' : 'Activer commandes',
      description: isOrderingEnabled 
        ? 'Mettre en pause les nouvelles commandes' 
        : 'Reprendre les commandes',
      icon: isOrderingEnabled ? '⏸️' : '▶️',
      color: isOrderingEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600',
      action: toggleOrdering,
      loading: isLoading,
    },
    {
      title: 'Voir toutes les commandes',
      description: 'Gérer les commandes en cours',
      icon: '📋',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.location.href = '/admin/orders',
      loading: false,
    },
    {
      title: 'Gérer le menu',
      description: 'Modifier plats et catégories',
      icon: '🍽️',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => window.location.href = '/admin/menu',
      loading: false,
    },
    {
      title: 'Paramètres',
      description: 'Configuration du restaurant',
      icon: '⚙️',
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => window.location.href = '/admin/settings',
      loading: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Actions rapides
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            disabled={action.loading}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${action.color} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">{action.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm opacity-90">{action.description}</div>
              </div>
              {action.loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}