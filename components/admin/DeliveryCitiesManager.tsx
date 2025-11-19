'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface DeliveryCity {
  id: string;
  name: string;
  postalCode: string | null;
  deliveryFee: number;
  minOrder: number | null;
  active: boolean;
}

export default function DeliveryCitiesManager() {
  const [cities, setCities] = useState<DeliveryCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState<DeliveryCity | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    postalCode: '',
    deliveryFee: 2.5,
    minOrder: '',
    active: true,
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/delivery-cities');
      const data = await response.json();
      if (data.success) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des villes:', error);
      toast.error('Erreur lors du chargement des villes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCity
        ? `/api/delivery-cities/${editingCity.id}`
        : '/api/delivery-cities';
      
      const method = editingCity ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          postalCode: formData.postalCode || null,
          deliveryFee: parseFloat(formData.deliveryFee.toString()),
          minOrder: formData.minOrder ? parseFloat(formData.minOrder.toString()) : null,
          active: formData.active,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingCity ? 'Ville mise à jour !' : 'Ville ajoutée !');
        fetchCities();
        handleCloseModal();
      } else {
        toast.error(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (city: DeliveryCity) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      postalCode: city.postalCode || '',
      deliveryFee: city.deliveryFee,
      minOrder: city.minOrder ? city.minOrder.toString() : '',
      active: city.active,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/delivery-cities/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Ville supprimée !');
        fetchCities();
      } else {
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (city: DeliveryCity) => {
    try {
      const response = await fetch(`/api/delivery-cities/${city.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !city.active }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(city.active ? 'Ville désactivée' : 'Ville activée');
        fetchCities();
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCity(null);
    setFormData({
      name: '',
      postalCode: '',
      deliveryFee: 2.5,
      minOrder: '',
      active: true,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            🚗 Villes de livraison
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Gérez les villes desservies et leurs frais de livraison
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          + Ajouter une ville
        </button>
      </div>

      <div className="p-6">
        {cities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune ville de livraison configurée.</p>
            <p className="text-sm mt-2">Ajoutez votre première ville pour commencer !</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ville
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code postal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frais de livraison
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande min.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{city.name}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {city.postalCode || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-red-600">
                        {city.deliveryFee.toFixed(2)}€
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {city.minOrder ? `${city.minOrder.toFixed(2)}€` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(city)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          city.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {city.active ? '✓ Active' : '✗ Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleEdit(city)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal d'ajout/édition */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingCity ? 'Modifier la ville' : 'Ajouter une ville'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom de la ville */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la ville *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Cergy"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Code postal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Ex: 95000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Frais de livraison */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frais de livraison (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
                  placeholder="2.50"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Commande minimum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commande minimum (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  placeholder="20.00 (optionnel)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Laissez vide pour utiliser le montant minimum global
                </p>
              </div>

              {/* Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                  Ville active (disponible pour la livraison)
                </label>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {editingCity ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

