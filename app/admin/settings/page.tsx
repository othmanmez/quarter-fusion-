'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PrinterTestButton from '@/components/admin/PrinterTestButton';
import DeliveryCitiesManager from '@/components/admin/DeliveryCitiesManager';

interface Settings {
  restaurantOpen: boolean;
  clickAndCollectEnabled: boolean;
  deliveryEnabled: boolean;
  minOrderAmount: number;
  deliveryFee: number;
  estimatedTime: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    restaurantOpen: true,
    clickAndCollectEnabled: true,
    deliveryEnabled: true,
    minOrderAmount: 20,
    deliveryFee: 2.5,
    estimatedTime: '30-45 minutes'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger les paramètres
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof Settings) => {
    const newValue = !settings[key];

    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value: newValue
        })
      });

      const data = await response.json();

      if (data.success) {
        setSettings(prev => ({ ...prev, [key]: newValue }));
        let serviceName = '';
        if (key === 'restaurantOpen') {
          serviceName = 'Restaurant';
          toast.success(`🔔 ${serviceName} ${newValue ? 'OUVERT' : 'FERMÉ'}`, {
            duration: 5000,
            className: newValue ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          });
        } else if (key === 'clickAndCollectEnabled') {
          serviceName = 'Click & Collect';
          toast.success(`${serviceName} ${newValue ? 'activé' : 'désactivé'}`);
        } else if (key === 'deliveryEnabled') {
          serviceName = 'Livraison';
          toast.success(`${serviceName} ${newValue ? 'activé' : 'désactivé'}`);
        }
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleNumberChange = async (key: keyof Settings, value: number) => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value })
      });

      const data = await response.json();

      if (data.success) {
        setSettings(prev => ({ ...prev, [key]: value }));
        toast.success('Paramètre mis à jour');
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez les paramètres de votre restaurant et les prises de commande
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* INTERRUPTEUR PRINCIPAL - Restaurant Ouvert/Fermé */}
        <div className={`bg-gradient-to-r ${settings.restaurantOpen ? 'from-green-50 to-emerald-50' : 'from-red-50 to-orange-50'} shadow-lg rounded-lg border-2 ${settings.restaurantOpen ? 'border-green-300' : 'border-red-300'}`}>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  {settings.restaurantOpen ? (
                    <>
                      <span className="text-green-600">🟢</span>
                      <span className="text-gray-900">Restaurant OUVERT</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-600">🔴</span>
                      <span className="text-gray-900">Restaurant FERMÉ</span>
                    </>
                  )}
                </h2>
                <p className={`text-base mt-2 font-medium ${settings.restaurantOpen ? 'text-green-700' : 'text-red-700'}`}>
                  {settings.restaurantOpen
                    ? '✅ Les clients peuvent commander en ligne'
                    : '⛔ Les pages de commande affichent un message de fermeture'}
                </p>
              </div>
              <button
                onClick={() => handleToggle('restaurantOpen')}
                disabled={saving}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all shadow-lg focus:outline-none focus:ring-4 ${
                  settings.restaurantOpen
                    ? 'bg-green-600 focus:ring-green-300'
                    : 'bg-red-600 focus:ring-red-300'
                } disabled:opacity-50 transform hover:scale-105`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.restaurantOpen ? 'translate-x-11' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Activation des services */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Services de commande</h2>
            <p className="text-sm text-gray-600 mt-1">Activez ou désactivez les prises de commande</p>
          </div>

          <div className="px-6 py-4 space-y-6">
            {/* Click & Collect */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 flex items-center">
                  🥡 Click & Collect
                  {!settings.clickAndCollectEnabled && (
                    <span className="ml-3 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Fermé
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Permettre aux clients de commander et retirer sur place
                </p>
              </div>
              <button
                onClick={() => handleToggle('clickAndCollectEnabled')}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  settings.clickAndCollectEnabled ? 'bg-red-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.clickAndCollectEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Livraison */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 flex items-center">
                  🚗 Livraison à domicile
                  {!settings.deliveryEnabled && (
                    <span className="ml-3 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Fermé
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Permettre aux clients de commander en livraison
                </p>
              </div>
              <button
                onClick={() => handleToggle('deliveryEnabled')}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  settings.deliveryEnabled ? 'bg-red-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.deliveryEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Paramètres de livraison */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Paramètres de livraison</h2>
            <p className="text-sm text-gray-600 mt-1">Configurez les conditions de livraison</p>
          </div>
          
          <div className="px-6 py-4 space-y-4">
            {/* Montant minimum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commande minimum (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={settings.minOrderAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setSettings(prev => ({ ...prev, minOrderAmount: value }));
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  handleNumberChange('minOrderAmount', value);
                }}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Montant minimum pour valider une commande en livraison
              </p>
            </div>

            {/* Frais de livraison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de livraison (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={settings.deliveryFee}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setSettings(prev => ({ ...prev, deliveryFee: value }));
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  handleNumberChange('deliveryFee', value);
                }}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Frais appliqués sur chaque livraison
              </p>
            </div>

            {/* Délai estimé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Délai de préparation estimé
              </label>
              <input
                type="text"
                value={settings.estimatedTime}
                onChange={(e) => setSettings(prev => ({ ...prev, estimatedTime: e.target.value }))}
                onBlur={async (e) => {
                  try {
                    setSaving(true);
                    const response = await fetch('/api/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ key: 'estimatedTime', value: e.target.value })
                    });
                    const data = await response.json();
                    if (!data.success) {
                      toast.error('Erreur lors de la mise à jour');
                    }
                  } catch (error) {
                    console.error('Erreur:', error);
                    toast.error('Erreur lors de la mise à jour');
                  } finally {
                    setSaving(false);
                  }
                }}
                placeholder="Ex: 30-45 minutes"
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Temps estimé affiché aux clients
              </p>
            </div>
          </div>
        </div>

        {/* Avertissement */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Lorsque vous désactivez un service, les clients ne pourront plus passer de commandes via ce mode. 
                  Les commandes en cours ne seront pas affectées.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test d'imprimante */}
        <PrinterTestButton />

        {/* Gestion des villes de livraison */}
        <DeliveryCitiesManager />
      </div>
    </div>
  );
}

